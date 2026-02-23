const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['passed', 'failed'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
