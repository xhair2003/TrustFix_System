const mongoose = require('mongoose');

const DuePriceSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    minPrice: {
        type: Number,
        required: true
    },
    maxPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Virtual for request
DuePriceSchema.virtual('request', {
    ref: 'Request',
    localField: 'request_id',
    foreignField: '_id',
    justOne: true
});
DuePriceSchema.virtual("prices", {
    ref: "Price",
    localField: "_id",
    foreignField: "duePrice_id",
  });
// Index for due date
DuePriceSchema.index({ dueDate: 1 });

module.exports = mongoose.model('DuePrice', DuePriceSchema); 