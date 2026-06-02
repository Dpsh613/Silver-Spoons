import express from 'express';
import { loginAdmin, logoutAdmin, getAdminProfile } from '../controllers/authController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/profile', protectAdmin, getAdminProfile);

export default router;