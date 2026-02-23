const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Assessment = require('../models/Assessment');

const router = express.Router();

// @desc    Verify if user can access mock interview
// @route   GET /api/mock-interview/verify-access
// @access  Private
router.get('/verify-access', protect, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({
            userId: req.user._id,
            score: { $gte: 7 }
        });

        if (assessment) {
            res.json({ allowed: true });
        } else {
            res.json({ allowed: false, message: 'Complete assessment with score ≥ 7 to unlock interview.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get latest passed quiz company
// @route   GET /api/mock-interview/latest-passed
// @access  Private
router.get('/latest-passed', protect, async (req, res) => {
    try {
        const assessment = await Assessment.findOne({
            userId: req.user._id,
            score: { $gte: 7 }
        }).sort({ createdAt: -1 });

        if (assessment) {
            res.json(assessment);
        } else {
            res.status(404).json({ message: 'No passed quiz found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
