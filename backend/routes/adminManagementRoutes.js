import express from 'express';
import { getPendingAdmins, approveAdmin } from '../controllers/adminManagementController.js';
import { protectAdmin, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply middleware to all routes in this file: Must be logged in AND must be an Owner
router.use(protectAdmin, authorizeRoles('owner'));

router.get('/pending', getPendingAdmins);
router.patch('/:id/approve', approveAdmin);

export default router;
