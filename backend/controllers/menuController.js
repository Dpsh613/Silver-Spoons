import MenuItem from '../models/MenuItem.js';
import MenuCategory from '../models/MenuCategory.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

// ========================
// PUBLIC ROUTES
// ========================

// @desc    Get all menu items grouped by category (Production Optimized)
// @route   GET /api/menu
// @access  Public
export const getFullMenu = async (req, res) => {
    try {
        // 1. Fetch active categories, sorted by order
        const categories = await MenuCategory.find({ isActive: true }).sort('order').lean();

        // 2. Fetch all active items
        const items = await MenuItem.find().lean();

        // 3. Group items in memory (Faster than Mongoose aggregate for typical menu sizes)
        const groupedMenu = categories.map((cat) => ({
            ...cat,
            items: items.filter((item) => item.category.toString() === cat._id.toString()),
        }));

        res.status(200).json(groupedMenu);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ========================
// ADMIN ROUTES (PROTECTED)
// ========================

// @desc    Create Menu Category
// @route   POST /api/menu/categories
export const createCategory = async (req, res) => {
    try {
        const category = await MenuCategory.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Error creating category', error: error.message });
    }
};

// @desc    Add a new Menu Item
// @route   POST /api/menu/items
export const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, isSoldOut } = req.body;

        // Cloudinary returns the URL in req.file.path
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const newItem = await MenuItem.create({
            name,
            description,
            price,
            category,
            isSoldOut: isSoldOut === 'true', // multipart/form-data sends strings
            image: req.file.path,
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Error adding item', error: error.message });
    }
};

// @desc    Update a Menu Item
// @route   PUT /api/menu/items/:id
export const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        let updatedData = { ...req.body };

        // If a new image is uploaded
        if (req.file) {
            await deleteFromCloudinary(item.image); // Clean up old image
            updatedData.image = req.file.path; // Set new image
        }

        // Handle boolean string parsing from FormData
        if (req.body.isSoldOut !== undefined) {
            updatedData.isSoldOut = req.body.isSoldOut === 'true';
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating item', error: error.message });
    }
};

// @desc    Delete a Menu Item
// @route   DELETE /api/menu/items/:id
export const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Clean up image from Cloudinar
        await deleteFromCloudinary(item.image);

        await item.deleteOne();
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};