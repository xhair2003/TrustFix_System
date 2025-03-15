const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    serviceIndustry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceIndustry',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema); 