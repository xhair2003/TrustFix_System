const mongoose = require('mongoose');

const VipSchema = new mongoose.Schema({
    // user_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    name: {
        type: String,
        required: true,
        unique: true
    },
    // name: {
    //     type: String
    // },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // Thời hạn tính bằng tháng
        required: true,
        default: 1 // Mặc định là 1 tháng
    },
}, { timestamps: true });



// Index for expiration
VipSchema.index({ expiredAt: 1 });

module.exports = mongoose.model('Vip', VipSchema); 