const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect middleware
 *
 * Permissive auth: if a valid JWT is present, decode it and attach the real user.
 * For any other case (no token, invalid token, user not found) — attach a default
 * guest user and call next(). Nothing is ever blocked.
 */
const protect = async (req, res, next) => {
    const GUEST_USER = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Guest',
        email: 'guest@hiresense.ai',
    };

    // No authorization header at all — grant guest access immediately
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        req.user = GUEST_USER;
        return next();
    }

    const token = req.headers.authorization.split(' ')[1];

    // Handle known guest bypass tokens
    if (!token || token === 'guest_token_123' || token === 'guest-bypass-token-777') {
        console.log('[AuthMiddleware] Guest access granted via token:', token || '(empty)');
        req.user = GUEST_USER;
        return next();
    }

    // Attempt to verify as a real JWT
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        const dbUser = await User.findById(decoded.id).select('-googleId -__v');

        if (dbUser) {
            req.user = dbUser;
        } else {
            // Valid token but user deleted — fall back to guest
            console.warn('[AuthMiddleware] User not found in DB, falling back to guest.');
            req.user = GUEST_USER;
        }
    } catch (err) {
        // Invalid / expired token — fall back to guest instead of blocking
        console.warn('[AuthMiddleware] Token verification failed, falling back to guest:', err.message);
        req.user = GUEST_USER;
    }

    return next();
};

module.exports = { protect };
