import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true },
        date: {
            type: String, // Format: YYYY-MM-DD makes it easier to query exact days
            required: true
        },
        time: { type: String, required: true },
        partySize: { type: Number, required: true, min: 1, max: 20 },
        specialRequests: { type: String, trim: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Reservation', reservationSchema);