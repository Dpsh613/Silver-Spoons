import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Item name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        image: {
            type: String, // Cloudinary URL
            required: [true, 'Image is required'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuCategory',
            required: [true, 'Category ID is required'],
        },
        isSoldOut: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);