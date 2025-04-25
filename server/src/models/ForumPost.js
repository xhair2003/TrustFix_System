const mongoose = require('mongoose');


const ForumPostSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    serviceIndustry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceIndustry',
        required: true
    },
    tags: { type: mongoose.Schema.Types.Mixed }, // JSON or array
    status: { type: String, enum: ['active', 'pending', 'deleted'], default: 'pending' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Virtual for user
ForumPostSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});
ForumPostSchema.virtual('serviceIndustry', {
    ref: () => require('./ServiceIndustry'),
    localField: 'serviceIndustry_id',
    foreignField: '_id',
    justOne: true
});
module.exports = mongoose.model('ForumPost', ForumPostSchema);
