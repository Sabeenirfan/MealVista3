const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();

const googleAudiences = (process.env.GOOGLE_CLIENT_ID || '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

if (!googleAudiences.length) {
  console.warn('Google authentication is not fully configured. Set GOOGLE_CLIENT_ID with your OAuth client IDs.');
}

const googleClient = new OAuth2Client();

router.post('/', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleAudiences.length ? googleAudiences : undefined,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const {
      sub: googleId,
      email,
      name,
      given_name: givenName,
      family_name: familyName,
      picture,
    } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Google account must include an email address' });
    }

    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Check if user was previously deleted
      const deletedUser = await User.findOne({ email: normalizedEmail, isDeleted: true });
      if (deletedUser) {
        return res.status(400).json({ 
          message: 'This email was previously registered and cannot be used again' 
        });
      }
      
      user = await User.create({
        name: name || `${givenName || ''} ${familyName || ''}`.trim() || normalizedEmail,
        email: normalizedEmail,
        googleId,
        profilePicture: picture,
      });
    } else {
      // Check if user is deleted
      if (user.isDeleted) {
        return res.status(400).json({ 
          message: 'This account has been deleted and cannot be accessed' 
        });
      }
      
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && user.profilePicture !== picture) {
        user.profilePicture = picture;
      }
      if (!user.name && name) {
        user.name = name;
      }
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        isAdmin: user.isAdmin || false,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Google authentication failed:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;