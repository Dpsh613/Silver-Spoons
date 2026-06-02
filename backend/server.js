import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration (Crucial for HttpOnly cookies)
app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL], // URLs allowed to access the backend
        credentials: true, // Allows cookies to be sent back and forth
    })
);

// Middleware to parse JSON payloads
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/analytics', analyticsRoutes);


// Basic health check route
app.get('/', (req, res) => {
    res.send('Restaurant API is running...');
});

// Fallback error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
