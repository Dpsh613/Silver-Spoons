import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        },
        action: {
            type: String,
            required: true // e.g., "APPROVED_RESERVATION", "UPDATED_SETTINGS"
        },
        resource: {
            type: String,
            required: true  // e.g., "Reservations", "Menu" . "Analytics"
        },
        ipAddress: {
            type: String
        },
        userAgent: {
            type: String
        },
    },
    { timestamps: true }
);

// We index adminId and createdAt for blazing fast queries when viewing logs
auditLogSchema.index({ adminId: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);