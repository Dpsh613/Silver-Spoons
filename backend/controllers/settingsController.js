import Settings from '../models/Settings.js';

// @desc    Get restaurant settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // If no settings exist yet, return a default template
        if (!settings) {
            settings = new Settings();
        }

        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update restaurant settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
    try {
        // We pass empty object {} as the filter. Since it's a singleton, it finds the first/only document.
        // upsert: true means if it doesn't exist, create it.
        const updatedSettings = await Settings.findOneAndUpdate(
            {},
            { $set: req.body },
            { returnDocument: 'after', upsert: true, unValidators: true }
        );

        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(400).json({ message: 'Error updating settings', error: error.message });
    }
};