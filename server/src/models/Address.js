const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    detailAddress: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);