const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    domain: { type: String, required: true },
    questions: [{
        text: String,
        answer: String,
        type: String, // 'technical' | 'hr'
    }],
    malpracticeCount: { type: Number, default: 0 },
    malpracticeLogs: [{
        reason: String,
        timestamp: { type: Date, default: Date.now }
    }],
    scores: {
        resumeScore: { type: Number, default: 0 },
        technicalScore: { type: Number, default: 0 },
        communicationScore: { type: Number, default: 0 },
        integrityScore: { type: Number, default: 100 },
        overallReadiness: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);
