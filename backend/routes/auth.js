import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, profileData } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ email, password, role });

    let profile;
    if (role === 'student') {
      profile = await Student.create({ ...profileData, userId: user._id });
    } else if (role === 'faculty') {
      profile = await Faculty.create({ ...profileData, userId: user._id });
    }

    if (profile) {
      user.profileId = profile._id;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profileId: user.profileId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === 'faculty') {
      profile = await Faculty.findOne({ userId: user._id });
    }

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    let profile = null;
    if (req.user.role === 'student') {
      profile = await Student.findOne({ userId: req.user._id });
    } else if (req.user.role === 'faculty') {
      profile = await Faculty.findOne({ userId: req.user._id });
    }

    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;