const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repairman_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceIndustry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceIndustry',
        required: true
    },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
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
    price: {
        type: Number,
        required: true
    },
    schedule: {
        type: Date,
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for user
RequestSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for repairman
RequestSchema.virtual('repairman', {
    ref: 'User',
    localField: 'repairman_id',
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

// Virtual for address
RequestSchema.virtual('address', {
    ref: 'Address',
    localField: 'address_id',
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

module.exports = mongoose.model('Request', RequestSchema); 