const mongoose = require('mongoose');

const ServicePriceSchema = new mongoose.Schema({
    serviceName  : {
        type: String,
        required: true,
        unique : true  
    },
    price : {
        type: Number,
        required: true
    },
    description : {
        type: String,
        
    },

});
module.exports = mongoose.model('ServicePrice', ServicePriceSchema);