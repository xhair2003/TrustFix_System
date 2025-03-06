const mongoose = require('mongoose');

const RepairmanUpgradeRequestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceIndustry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceIndustry',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1,
        required: true
    },
    approvedAt: {
        type: Date,
        default: null
    },
    rejectedAt: {
        type: Date,
        default: null
    },
    rejectReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for user
RepairmanUpgradeRequestSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for service industry
RepairmanUpgradeRequestSchema.virtual('serviceIndustry', {
    ref: 'ServiceIndustry',
    localField: 'serviceIndustry_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('RepairmanUpgradeRequest', RepairmanUpgradeRequestSchema); 