// models/Violation.js
const mongoose = require('mongoose');

const ViolationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumComment', required: true },
    content: { type: String, required: true }, // Store comment content for reference
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Violation', ViolationSchema);