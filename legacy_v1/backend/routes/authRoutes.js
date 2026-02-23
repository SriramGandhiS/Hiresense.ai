const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_hiresense_jwt_token', { expiresIn: '30d' });

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User exists' });
        const user = await User.create({ name, email, password });
        res.status(201).json({
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user._id)
        });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                user: { _id: user._id, name: user.name, email: user.email, role: user.role },
                token: generateToken(user._id)
            });
        } else { res.status(401).json({ message: 'Invalid credentials' }); }
    } catch (error) { res.status(500).json({ message: error.message }); }
});

// Temporary endpoint to easily make yourself an admin for testing
const { protect } = require('../middleware/authMiddleware');
router.get('/make-me-admin', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.role = 'admin';
        await user.save();
        res.json({ message: 'Success! You are now an admin. Please log out and log back in to refresh your permissions.' });
    } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
