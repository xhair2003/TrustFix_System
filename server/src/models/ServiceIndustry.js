const mongoose = require('mongoose');

const ServiceIndustrySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    }
    
}, { timestamps: true });

module.exports = mongoose.model('ServiceIndustry', ServiceIndustrySchema); 