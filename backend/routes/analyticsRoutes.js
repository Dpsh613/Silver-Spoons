import express from 'express';
import { trackEvent, getAnalytics } from '../controllers/analyticsController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/track', trackEvent); // Public (Triggered by frontend interactions)
router.get('/', protectAdmin, getAnalytics); // Admin Only

export default router;