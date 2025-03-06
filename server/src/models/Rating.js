const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        default: 1,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for request
RatingSchema.virtual('request', {
    ref: 'Request',
    localField: 'request_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Rating', RatingSchema); 