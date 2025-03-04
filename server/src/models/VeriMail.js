const mongoose = require('mongoose');

const VeriMailSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    code: { 
        type: String, 
        required: true 
    },
    expiredAt: { 
        type: Date, 
        required: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for user
VeriMailSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Index for code expiration
VeriMailSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('VeriMail', VeriMailSchema); 