const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        unique: true // Ensures one role per user
    },
    type: { 
        type: String, 
        required: true,
        enum: ['customer', 'repairman', 'admin']
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for user
RoleSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Role', RoleSchema); 