import express from 'express';
import {
    createReservation,
    getReservations,
    updateReservationStatus,
} from '../controllers/reservationController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', createReservation); // Public
router.get('/', protectAdmin, getReservations); // Admin only
router.patch('/:id/status', protectAdmin, updateReservationStatus); // Admin only

export default router;