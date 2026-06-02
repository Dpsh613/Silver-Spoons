import Reservation from '../models/Reservation.js';
import { sendReservationEmails } from '../utils/sendEmail.js';

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Public
export const createReservation = async (req, res) => {
    try {
        const reservation = await Reservation.create(req.body);

        // Fire & Forget: Trigger emails asynchronously without blocking the response
        sendReservationEmails(reservation);

        // Also trigger an analytics increment for reservations!
        // We'll call an internal API or just import the model (Best practice: isolate logic, but for speed, we handle it in analytics controller. Here we just return success).

        res.status(201).json({
            message: 'Reservation request received successfully',
            reservation,
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating reservation', error: error.message });
    }
};

// @desc    Get all reservations (Optionally filter by date)
// @route   GET /api/reservations?date=YYYY-MM-DD
// @access  Private/Admin
export const getReservations = async (req, res) => {
    try {
        const filter = {};
        if (req.query.date) {
            filter.date = req.query.date;
        }

        // Sort by date ascending, then by time
        const reservations = await Reservation.find(filter).sort({ date: 1, time: 1 });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update reservation status
// @route   PATCH /api/reservations/:id/status
// @access  Private/Admin
export const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate enum
        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Production Bonus: You could trigger another email here (e.g., "Your reservation is Confirmed!")

        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ message: 'Error updating reservation', error: error.message });
    }
};