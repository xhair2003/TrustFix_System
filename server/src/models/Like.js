const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' },
    comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumComment' },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Like', LikeSchema);
