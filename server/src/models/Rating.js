const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
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

module.exports = mongoose.model('Rating', RatingSchema); 