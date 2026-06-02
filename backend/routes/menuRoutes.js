import express from 'express';
import {
    getFullMenu,
    createCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
} from '../controllers/menuController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public Routes
router.get('/', getFullMenu);

// Admin Protected Routes
router.post('/categories', protectAdmin, createCategory);

// For items, we use 'upload.single("image")' middleware to process the file upload
router.post('/items', protectAdmin, upload.single('image'), addMenuItem);
router.put('/items/:id', protectAdmin, upload.single('image'), updateMenuItem);
router.delete('/items/:id', protectAdmin, deleteMenuItem);

export default router;