import Admin from '../models/Admin.js';
import AuditLog from '../models/AuditLog.js';
import { sendApprovalEmail } from '../utils/sendEmail.js';

// @desc    Get all admins pending approval
// @route   GET /api/admin-management/pending
// @access  Private (Owner Only)
export const getPendingAdmins = async (req, res) => {
    try {
        // Find admins who verified their email but are not yet approved
        const pendingAdmins = await Admin.find({
            isEmailVerified: true,
            isApproved: false
        }).select('-password');

        res.status(200).json(pendingAdmins);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Approve a pending admin
// @route   PATCH /api/admin-management/:id/approve
// @access  Private (Owner Only)
export const approveAdmin = async (req, res) => {
    try {
        const targetAdmin = await Admin.findById(req.params.id);

        if (!targetAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (targetAdmin.isApproved) {
            return res.status(400).json({ message: 'Admin is already approved' });
        }

        // Approve the admin
        targetAdmin.isApproved = true;
        targetAdmin.approvedBy = req.admin._id; // Track WHO approved them
        await targetAdmin.save();

        // 🛡️ CREATE AUDIT LOG 🛡️
        await AuditLog.create({
            adminId: req.admin._id, // The Owner who took the action
            action: `APPROVED_ACCOUNT: ${targetAdmin.email}`,
            resource: 'AdminManagement',
            ipAddress: req.ip
        });
        // 📧 Send approval notification email
        await sendApprovalEmail(targetAdmin.email, targetAdmin.name);

        res.status(200).json({ message: 'Admin approved successfully', targetAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};