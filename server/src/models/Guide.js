const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'article'], required: true },
    content: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    tags: { type: mongoose.Schema.Types.Mixed }, // JSON or array
    created_by: { type: Number, required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Guide', GuideSchema);
