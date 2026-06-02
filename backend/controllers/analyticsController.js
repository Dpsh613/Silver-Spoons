import Analytics from '../models/Analytics.js';

// @desc    Track a new event (Increment counter)
// @route   POST /api/analytics/track
// @access  Public
export const trackEvent = async (req, res) => {
    try {
        const { eventType } = req.body; // 'pageViews', 'reservations', 'callClicks', 'mapClicks'

        // Validate event type
        const validEvents = ['pageViews', 'reservations', 'callClicks', 'mapClicks'];
        if (!validEvents.includes(eventType)) {
            return res.status(400).json({ message: 'Invalid event type' });
        }

        // Get today's date in YYYY-MM-DD format (Local server time)
        // Note: In a global app you'd use UTC, but for a local restaurant, local timezone logic is fine.
        const today = new Date().toISOString().split('T')[0];

        // Atomic increment operation.
        // upsert: true -> If today's row doesn't exist, create it with event = 1.
        const updatedAnalytics = await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: { [eventType]: 1 } },
            { returnDocument: 'after', upsert: true }
        );

        res.status(200).json({ success: true, data: updatedAnalytics });
    } catch (error) {
        res.status(500).json({ message: 'Error tracking event', error: error.message });
    }
};

// @desc    Get analytics data (e.g., last 30 days)
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        const limit = parseInt(req.query.days) || 30;

        // Fetch the last X days, sorted by newest first
        const data = await Analytics.find().sort({ date: -1 }).limit(limit);

        // Reverse array to be chronological (oldest to newest) for charts
        res.status(200).json(data.reverse());
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};