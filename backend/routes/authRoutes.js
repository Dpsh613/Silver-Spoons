import express from 'express';
import {
    loginAdmin,
    logoutAdmin,
    getAdminProfile,
    getSettings,
    registerAdmin,
    verifyEmail,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    resendVerification,
} from '../controllers/authController.js';
import { protectAdmin, authorizeRoles } from '../middlewares/authMiddleware.js';
import { loginLimiter } from '../middlewares/rateLimiter.js'; // phase- 4 
const router = express.Router();

router.post('/login', loginLimiter, loginAdmin);
router.post('/logout', logoutAdmin);
router.post('/refresh', refreshAccessToken);
router.get('/profile', protectAdmin, getAdminProfile);
//temporary test route
router.get('/settings', protectAdmin, authorizeRoles('owner'), getSettings);
router.post('/register', registerAdmin);
router.post('/resend-verification', resendVerification); // phase-2 
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password', resetPassword);

export default router;