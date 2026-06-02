import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            unique: true,
        },
        order: {
            type: Number,
            default: 0, // Used to sort categories on the frontend (e.g., Starters -> Mains -> Desserts)
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('MenuCategory', menuCategorySchema);