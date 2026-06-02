import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
    {
        date: {
            type: String, // Format: 'YYYY-MM-DD'
            required: true,
            unique: true, // Only one document per day
        },
        pageViews: { type: Number, default: 0 },
        reservations: { type: Number, default: 0 },
        callClicks: { type: Number, default: 0 },
        mapClicks: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model('Analytics', analyticsSchema);