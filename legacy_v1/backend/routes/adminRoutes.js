const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Interview = require('../models/Interview');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/malpractice-logs', protect, admin, async (req, res) => {
    try {
        const interviews = await Interview.find({ 'malpracticeLogs.0': { $exists: true } }).populate('userId', 'name email');
        let logs = [];
        interviews.forEach(i => {
            i.malpracticeLogs.forEach(log => {
                logs.push({ user: i.userId, reason: log.reason, timestamp: log.timestamp, count: i.malpracticeCount });
            });
        });
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(logs);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/stats', protect, admin, async (req, res) => {
    try {
        const interviews = await Interview.find();
        const totalInterviews = interviews.length;
        let avgScore = 0;
        if (totalInterviews > 0) {
            avgScore = interviews.reduce((acc, i) => acc + (i.scores.overallReadiness || 0), 0) / totalInterviews;
        }
        res.json({ totalInterviews, avgScore: Math.round(avgScore) });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/log-malpractice', protect, async (req, res) => {
    try {
        // Find most recent interview for user and append log
        const interview = await Interview.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (interview) {
            interview.malpracticeLogs.push({ reason: req.body.reason });
            interview.malpracticeCount += 1;
            await interview.save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
