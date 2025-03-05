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
}, { timestamps: true });

// Virtual for user
WalletSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for transactions
WalletSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'wallet_id'
});

module.exports = mongoose.model('Wallet', WalletSchema); 