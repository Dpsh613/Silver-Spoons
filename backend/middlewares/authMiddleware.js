import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
    let token = req.cookies.accessToken;

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get admin from the token (exclude password)
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({ message: 'Not authorized, admin not found' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Role Authorization Middleware
 * @param  {...String} roles - Allowed roles (e.g., 'owner', 'manager')
 */

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // protectAdmin must run first, so req.admin exists
        if (!req.admin) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                message: `Role (${req.admin.role}) is not authorized to access this resource.`
            });
        }

        next();
    };
};

// Example on how to use this in routes -- for later
// Staff can view, Managers can update, Only Owners can delete
// router.get('/menu', protectAdmin, getMenu);
// router.post('/menu', protectAdmin, authorizeRoles('owner', 'manager'), addMenu);
// router.delete('/menu/:id', protectAdmin, authorizeRoles('owner'), deleteMenu);

