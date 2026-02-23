const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '30d',
    });
};

const googleLogin = async (req, res, next) => {
    const { credential } = req.body;
    try {
        if (!credential) {
            return res.status(400).json({ message: 'No Google credential provided' });
        }

        let googleId, email, name, picture;

        // Check if credential is a JWT (id_token) or an opaque access_token
        if (credential.split('.').length === 3) {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            googleId = payload.sub;
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        } else {
            // It is an access_token from the React implicit flow
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${credential}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile using access token');
            }

            const payload = await response.json();
            googleId = payload.sub;
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
        }

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.create({
                googleId,
                email,
                name,
                picture
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { googleLogin };
