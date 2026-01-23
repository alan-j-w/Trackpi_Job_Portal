const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

// Index for search capabilities
languageSchema.index({ name: 'text' });

module.exports = mongoose.model('Language', languageSchema);
