const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
    duePrice_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DuePrice',
        required: true
    },
    priceToPay: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Price', PriceSchema); 