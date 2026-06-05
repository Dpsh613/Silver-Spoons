import express from 'express';
import { loginAdmin, logoutAdmin, getAdminProfile, getSettings, registerAdmin, verifyEmail } from '../controllers/authController.js';
import { protectAdmin, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/profile', protectAdmin, getAdminProfile);
//temporary test route
router.get('/settings', protectAdmin, authorizeRoles('owner'), getSettings);
router.post('/register', registerAdmin);
router.post('/verify-email', verifyEmail);

export default router;