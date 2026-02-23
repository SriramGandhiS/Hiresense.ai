const express = require('express');
const { googleLogin, login } = require('../controllers/authController');

const router = express.Router();

router.post('/google', googleLogin);
router.post('/login', login);

module.exports = router;
