import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer Storage Engine for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'restaurant_menu',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // webp is great for web performance
        transformation: [{ width: 800, height: 800, crop: 'limit' }], // Optimize on upload
    },
});

export const upload = multer({ storage });

// Production helper: Delete image from Cloudinary when a menu item is deleted
export const deleteFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;
    try {
        // Extract public_id from the Cloudinary URL
        const urlParts = imageUrl.split('/');
        const folderAndFile = urlParts.slice(-2).join('/'); // e.g., "restaurant_menu/xyz123.jpg"
        const publicId = folderAndFile.split('.')[0]; // Remove extension

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
};