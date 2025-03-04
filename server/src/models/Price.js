const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    price: {
        type: Number,
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

// Virtual for service
PriceSchema.virtual('service', {
    ref: 'Service',
    localField: 'service_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Price', PriceSchema); 