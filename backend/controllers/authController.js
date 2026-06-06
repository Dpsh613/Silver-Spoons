import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// Utility to generate BOTH tokens and set cookie
const generateTokensAndSetCookies = async (res, adminId) => {
    // Create short-lived Access Token (15mins)

    const accessToken = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });

    // 2. Create long-lived Refresh Token (7 days)
    const refreshToken = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    // 3. Save Refresh Token to the database (Allows us to revoke it later)
    await Admin.findByIdAndUpdate(adminId, {
        $push: { refreshTokens: refreshToken }
    });

    // 4. Set Access Token Cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,  // Prevents XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',  // Prevents CSRF attacks
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // 5. Set Refresh Token Cookie (Path restricted so it's only sent to the refresh endpoint)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/auth/refresh', // 🔒 Security: Only sent when requesting a new token!
    });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // use +password because we set select: false in the model -- hashing the password before storing in the database
        const admin = await Admin.findOne({ email }).select('+password');

        //phase-4
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 🛡️ SECURITY CHECK: Is the account locked?
        if (admin.isLocked()) {
            return res.status(423).json({
                message: 'Account temporarily locked due to too many failed attempts. Try again in 15 minutes.'
            });
        }

        if (await admin.matchPassword(password)) {
            // SUCCESS! Reset the failed attempt counters.
            admin.loginAttempts = 0;
            admin.lockUntil = undefined;
            await admin.save();

            if (!admin.isEmailVerified) return res.status(401).json({ message: 'Please verify your email address first.' });
            if (!admin.isApproved) return res.status(401).json({ message: 'Your account is pending approval from an Owner.' });

            await generateTokensAndSetCookies(res, admin._id);

            res.status(200).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            });
        } else {
            // FAILED PASSWORD! Increment attempts.
            admin.loginAttempts += 1;

            // Lock account if they hit 5 attempts
            if (admin.loginAttempts >= 5) {
                admin.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 mins
            }

            await admin.save();

            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public (Uses Refresh Cookie)
export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        // 1. Verify the refresh token cryptographically
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // 2. Find the admin AND ensure this specific token exists in their database array
        const admin = await Admin.findOne({
            _id: decoded.id,
            refreshTokens: refreshToken
        });

        if (!admin) {
            // If token is valid but NOT in database, it means they were logged out/fired!
            return res.status(401).json({ message: 'Session expired or revoked. Please log in again.' });
        }

        // 3. Issue a NEW Access Token (15m)
        const newAccessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({ message: 'Access token refreshed' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

// @desc    Logout admin / clear cookie & revoke DB token
// @route   POST /api/auth/logout
// @access  Private
export const logoutAdmin = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        // Remove this specific refresh token from the database
        if (refreshToken) {
            // We use req.admin._id if available, otherwise decode token manually
            const decoded = jwt.decode(refreshToken);
            if (decoded) {
                await Admin.findByIdAndUpdate(decoded.id, {
                    $pull: { refreshTokens: refreshToken }
                });
            }
        }

        res.cookie('accessToken', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/api/auth/refresh'
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during logout' });
    }
};

// @desc    Get current admin profile
// @route   GET /api/auth/profile
// @access  Private
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);
        if (admin) {
            res.status(200).json(admin);
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get system settings (Temporary test route)
// @route   GET /api/settings
// @access  Private (Owner Only)
export const getSettings = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome, Owner. Here are the system settings.",
        settings: {
            restaurantName: "The Golden Fork",
            currency: "USD"
        }
    });
};

// phase-2 but with change on resending verification link
// @desc    Register a new admin (With Smart Verification Bypass)
// @route   POST /api/auth/register
// @access  Public
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            // 🛡️ SMART BYPASS: If they exist but verified their email, they are a duplicate.
            if (existingAdmin.isEmailVerified) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // 🔄 RECOVERY: If they exist but NEVER verified their email, overwrite credentials and send a fresh token!
            existingAdmin.name = name;
            existingAdmin.password = password; // pre-save hook will hash this new password

            const unhashedToken = existingAdmin.generateEmailVerificationToken();
            await existingAdmin.save();

            await sendVerificationEmail(existingAdmin.email, existingAdmin.name, unhashedToken);

            return res.status(200).json({
                message: 'Account was pending verification. A fresh verification email has been sent.'
            });
        }

        // Standard new registration
        const admin = new Admin({
            name,
            email,
            password,
            role: 'staff',
            isEmailVerified: false,
            isApproved: false
        });

        const unhashedToken = admin.generateEmailVerificationToken();
        await admin.save();

        await sendVerificationEmail(admin.email, admin.name, unhashedToken);

        res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// phase-2 
// @desc    Resend Verification Email
// @route   POST /api/auth/resend-verification
// @access  Public+
export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email });

        // ANTI-ENUMERATION: If user doesn't exist, don't tell the client. Say success anyway.
        if (!admin) {
            return res.status(200).json({ message: 'If this email is registered, a new verification link has been sent.' });
        }

        if (admin.isEmailVerified) {
            return res.status(400).json({ message: 'This email is already verified. Please log in.' });
        }

        const unhashedToken = admin.generateEmailVerificationToken();
        await admin.save();

        await sendVerificationEmail(admin.email, admin.name, unhashedToken);

        res.status(200).json({ message: 'If this email is registered, a new verification link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify Email Token
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        // Re-hash the token from the URL to compare with the one in the DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const admin = await Admin.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() }, // Ensure it hasn't expired
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Mark as verified and clean up token fields
        admin.isEmailVerified = true;
        admin.emailVerificationToken = undefined;
        admin.emailVerificationExpire = undefined;

        await admin.save();

        res.status(200).json({ message: 'Email verified successfully. Awaiting owner approval.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//phase - 4
import { sendPasswordResetEmail } from '../utils/sendEmail.js';

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });

        // 🛡️ ANTI-ENUMERATION: Even if the email doesn't exist, return success.
        // We do not want hackers using this endpoint to check which emails are registered.
        if (!admin) {
            return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }

        const unhashedToken = admin.generatePasswordResetToken();
        await admin.save({ validateBeforeSave: false });

        await sendPasswordResetEmail(admin.email, admin.name, unhashedToken);

        res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reset Password
// @route   PATCH /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Hash the incoming token to compare with DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const admin = await Admin.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Set new password (the pre-save hook will hash it)
        admin.password = newPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;

        // Unlock account in case they were locked out
        admin.loginAttempts = 0;
        admin.lockUntil = undefined;

        // Log out all existing sessions by clearing refresh tokens!
        admin.refreshTokens = [];
        admin.passwordChangedAt = Date.now();

        await admin.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 