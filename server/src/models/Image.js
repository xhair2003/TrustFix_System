const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    imgUrlList: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Virtual for request
ImageSchema.virtual('request', {
    ref: 'Request',
    localField: 'request_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Image', ImageSchema); 