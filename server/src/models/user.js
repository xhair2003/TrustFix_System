const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    imgAvt: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Banned']
    },
    address: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Virtual for roles
UserSchema.virtual('roles', {
    ref: 'Role',
    localField: '_id',
    foreignField: 'user_id'
});

// Virtual for wallet
UserSchema.virtual('wallet', {
    ref: 'Wallet',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true
});

// Virtual for vip status
UserSchema.virtual('vip', {
    ref: 'Vip',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true
});

// Virtual for requests
UserSchema.virtual('requests', {
    ref: 'Request',
    localField: '_id',
    foreignField: 'user_id'
});

// Virtual for repairman upgrade requests
UserSchema.virtual('repairmanUpgradeRequests', {
    ref: 'RepairmanUpgradeRequest',
    localField: '_id',
    foreignField: 'user_id'
});

// Virtual for verification mail
UserSchema.virtual('veriMail', {
    ref: 'VeriMail',
    localField: '_id',
    foreignField: 'user_id',
    justOne: true
});

module.exports = mongoose.model('User', UserSchema);
