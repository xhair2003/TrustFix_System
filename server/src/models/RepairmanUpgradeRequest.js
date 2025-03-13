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
    imgCertificatePractice: {
        type: [String],
        required: true
    },
    imgCCCD: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Pending']
    },
    serviceTypes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Service'
    }
}, { timestamps: true });

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