const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
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
        default: 1
    },
    repairman_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RepairmanUpgradeRequest',
        unique: true,
        default: null
    },
    parentRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        default: null
    },
}, { timestamps: true });

RequestSchema.virtual('ID', {
    ref: 'Request',
    localField: '_id',
    foreignField: 'parentRequest'
});
// Virtual for user
RequestSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for service industry
RequestSchema.virtual('serviceIndustry', {
    ref: 'ServiceIndustry',
    localField: 'serviceIndustry_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for ratings
RequestSchema.virtual('ratings', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'request_id'
});

// Virtual for images
RequestSchema.virtual('images', {
    ref: 'Image',
    localField: '_id',
    foreignField: 'request_id'
});

// Virtual for repairman
RequestSchema.virtual('repairman', {
    ref: 'RepairmanUpgradeRequest',
    localField: 'repairman_id',
    foreignField: '_id',
    //justOne: true
});

module.exports = mongoose.model('Request', RequestSchema); 