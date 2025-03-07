const mongoose = require('mongoose');

const VipSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

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