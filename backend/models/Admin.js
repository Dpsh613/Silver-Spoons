import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from 'crypto'; //phase-2


const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Prevents password from being returned in queries by default
        },
        role: {
            type: String,
            enum: ['owner', 'manager', 'staff'],
            default: 'owner',
        },
        // 2. Onboarding & Approval State
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        // ... phase-2 onboarding
        emailVerificationToken: String,
        emailVerificationExpire: Date,
        isApproved: {
            type: Boolean,
            default: false  // Owner must set this to true
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        // 3. Security & Account Lockout
        loginAttempts: {
            type: Number,
            default: 0
        },
        lockUntil: {
            type: Date
        },
        // 4. MFA Data 
        isMfaEnabled: {
            type: Boolean,
            default: false
        },
        mfaSecret: {
            type: String,
            select: false
        },
        // Array of active refresh tokens (allows multi-device login) - phase-3
        refreshTokens: [{ type: String }],
        // 5. Token Invalidation (Prepared for Phase 3)
        // When a password is changed or admin is kicked, we update this date.
        // Any JWT issued before this date is instantly invalid.
        passwordChangedAt: {
            type: Date
        },
        resetPasswordToken: String, //phase4 
        resetPasswordExpire: Date, //phase4 
    },
    { timestamps: true }
);


// Hash password before saving to the database
adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// compare passwords
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Check if account is locked
adminSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// phase-2 
// Generate and hash email verification token
adminSchema.methods.generateEmailVerificationToken = function () {
    // 1. Generate a random 20-character hex string
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash it using SHA-256 and save to the database field
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    // 3. Set expiration (e.g., 24 hours from now)
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

    // 4. Return the UNHASHED token to send via email
    return verificationToken;
};
// phase-4
// Generate and hash password reset token
adminSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Password reset tokens should be short-lived (15 minutes)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export default mongoose.model('Admin', adminSchema);
