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
            console.error('Auth Error: No credential provided');
            return res.status(400).json({ message: 'No Google credential provided' });
        }

        console.log('Auth: Received credential, identifying flow...');
        let googleId, email, name, picture;

        try {
            // Check if credential is a JWT (id_token) or an opaque access_token
            if (credential.split('.').length === 3) {
                console.log('Auth: Using ID Token verification flow');
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
                console.log('Auth: Using Access Token userinfo flow');
                // It is an access_token from the React implicit flow
                const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${credential}` }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Auth UserInfo Error:', errorText);
                    throw new Error('Failed to fetch user profile using access token');
                }

                const payload = await response.json();
                googleId = payload.sub;
                email = payload.email;
                name = payload.name;
                picture = payload.picture;
            }
        } catch (verifyError) {
            console.error('Auth Verification CRITICAL Error:', verifyError.message);
            return res.status(401).json({
                message: 'Google Token Verification Failed',
                error: verifyError.message,
                client_id_used: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing'
            });
        }

        console.log('Auth: Profile retrieved for', email, '- syncing with database...');
        let user;
        const isDbConnected = mongoose.connection.readyState === 1;

        try {
            if (isDbConnected) {
                user = await User.findOne({ googleId });

                if (!user) {
                    console.log('Auth: Creating new user record');
                    user = await User.create({
                        googleId,
                        email,
                        name,
                        picture
                    });
                }
            } else {
                console.warn('Auth: Database OFFLINE. Proceeding with Temporary Guest Session for', email);
                // Create a temporary user object that mirrors the model structure
                user = {
                    _id: 'guest_' + googleId,
                    name,
                    email,
                    picture
                };
            }
        } catch (dbError) {
            console.error('Auth Database Error:', dbError.message);
            // Fallback to guest mode even on error to prevent blocking the user
            user = {
                _id: 'guest_' + googleId,
                name,
                email,
                picture
            };
        }

        const token = generateToken(user._id);
        console.log('Auth: Login Success (Mode: ' + (isDbConnected ? 'Permanent' : 'Guest') + ') for', email);

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
        console.error('Auth General Error:', error);
        res.status(500).json({ message: 'Internal Server Error during Authentication', error: error.message });
    }
};

module.exports = { googleLogin };
