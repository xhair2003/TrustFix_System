const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    industry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceIndustry',
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
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for industry
ServiceSchema.virtual('industry', {
    ref: 'ServiceIndustry',
    localField: 'industry_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for prices
ServiceSchema.virtual('prices', {
    ref: 'Price',
    localField: '_id',
    foreignField: 'service_id'
});

module.exports = mongoose.model('Service', ServiceSchema); 