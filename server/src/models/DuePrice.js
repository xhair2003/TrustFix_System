const mongoose = require('mongoose');

const DuePriceSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 1,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paidAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for request
DuePriceSchema.virtual('request', {
    ref: 'Request',
    localField: 'request_id',
    foreignField: '_id',
    justOne: true
});

// Index for due date
DuePriceSchema.index({ dueDate: 1 });

module.exports = mongoose.model('DuePrice', DuePriceSchema); 