const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    wallet_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Wallet',
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    type: { 
        type: String,
        required: true,
        enum: ['deposit', 'withdraw', 'transfer']
    },
    status: { 
        type: Number,
        required: true,
        default: 1
    },
    description: { 
        type: String,
        default: null
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for wallet
TransactionSchema.virtual('wallet', {
    ref: 'Wallet',
    localField: 'wallet_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Transaction', TransactionSchema); 