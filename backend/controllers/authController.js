import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

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