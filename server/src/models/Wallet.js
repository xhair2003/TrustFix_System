const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Ensures one wallet per user
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals are included in JSON output
    toObject: { virtuals: true } // Ensure virtuals are included when converting to plain object
});

// Virtual for user
WalletSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for role (through user_id)
WalletSchema.virtual('role', {
    ref: 'Role',
    localField: 'user_id', // Reference the user_id from Wallet
    foreignField: 'user_id', // Match with user_id in Role schema
    justOne: true
});

// Virtual for transactions
WalletSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'wallet_id'
});

module.exports = mongoose.model('Wallet', WalletSchema); 