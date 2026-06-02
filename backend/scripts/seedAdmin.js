import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await Admin.findOne({ email: 'admin@restaurant.com' });
        if (adminExists) {
            console.log('Admin already exists!');
            process.exit();
        }

        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@restaurant.com',
            password: 'password123', // Change this!
            role: 'superadmin',
        });

        console.log('✅ Admin created successfully:', admin.email);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();