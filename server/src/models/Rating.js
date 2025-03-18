const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    // user_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    comment: {
        type: String
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { timestamps: true });

// Virtual for request
RatingSchema.virtual('request', {
    ref: 'Request',
    localField: 'request_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for user
RatingSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// Virtual for user role
RatingSchema.virtual('userRole', {
    ref: 'Role',
    localField: 'user_id',
    foreignField: 'user_id',
    justOne: true,
    match: { name: 'repairman' } // Chỉ lấy những người dùng có vai trò là repairman
});

module.exports = mongoose.model('Rating', RatingSchema);