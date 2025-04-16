const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
    // comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumComment' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Mỗi user chỉ được like một post duy nhất một lần
LikeSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema);
