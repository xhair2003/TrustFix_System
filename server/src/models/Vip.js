const mongoose = require('mongoose');

const VipSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    points: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: Number,
        default: 1,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for user
VipSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Index for expiration
VipSchema.index({ expiredAt: 1 });

module.exports = mongoose.model('Vip', VipSchema); 