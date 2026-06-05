import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// Utility to generate token and set cookie
const generateTokenAndSetCookie = (res, adminId) => {
    const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token valid for 7 days
    });

    res.cookie('jwt', token, {
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
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

        // We use +password because we set select: false in the model -- hashing the password before storing in the database
        const admin = await Admin.findOne({ email }).select('+password');

        if (admin && (await admin.matchPassword(password))) {
            // phase-2--start
            if (!admin.isEmailVerified) {
                return res.status(401).json({ message: 'Please verify your email address first.' });
            }

            // SECURITY CHECK 2: Is Approved by Owner?
            if (!admin.isApproved) {
                return res.status(401).json({ message: 'Your account is pending approval from an Owner.' });
            }
            // phase-2--end

            generateTokenAndSetCookie(res, admin._id);

            res.status(200).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Logout admin / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutAdmin = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Expire cookie immediately
    });
    res.status(200).json({ message: 'Logged out successfully' });
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


// phase-2
// @desc    Register a new admin (Pending state)
// @route   POST /api/auth/register
// @access  Public
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user. Force role to 'staff' so hackers can't inject 'owner' in the body.
        const admin = new Admin({
            name,
            email,
            password,
            role: 'staff',
            isEmailVerified: false,
            isApproved: false
        });

        // Generate token (modifies the user document, but doesn't save to DB yet)
        const unhashedToken = admin.generateEmailVerificationToken();

        await admin.save();

        // Send Email
        await sendVerificationEmail(admin.email, admin.name, unhashedToken);

        res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
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