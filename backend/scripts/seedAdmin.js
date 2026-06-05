import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        // Clear existing test admin to avoid duplicate key errors during testing
        await Admin.deleteOne({ email: 'admin@restaurant.com' });

        const admin = await Admin.create({
            name: 'Test User',
            email: 'admin@restaurant.com',
            password: 'password123',
            role: 'owner', // Seed as 'staff' first to test authorization restriction
            isEmailVerified: true, // Prepared for Phase 2
            isApproved: true       // Prepared for Phase 2
        });

        console.log('✅ Test Admin seeded as STAFF:', admin.email);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();