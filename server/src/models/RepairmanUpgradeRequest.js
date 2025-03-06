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
    typePaper: {
        type: String,
        required: true
    },
    imgPaper: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
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