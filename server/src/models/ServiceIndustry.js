const mongoose = require('mongoose');

const ServiceIndustrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 1,
        required: true
    },
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for services
ServiceIndustrySchema.virtual('services', {
    ref: 'Service',
    localField: '_id',
    foreignField: 'industry_id'
});

module.exports = mongoose.model('ServiceIndustry', ServiceIndustrySchema); 