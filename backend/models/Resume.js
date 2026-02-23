const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalFileName: {
        type: String,
        required: true
    },
    extractedText: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    analysis: {
        type: Object,
        default: null
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', resumeSchema);
