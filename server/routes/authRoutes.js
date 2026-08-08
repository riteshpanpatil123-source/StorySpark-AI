import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'storyspark_jwt_secret_production_key_2026';

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, displayName } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: { code: 'INVALID_INPUT', message: 'Email, username, and password are required.' },
      });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: { code: 'USER_EXISTS', message: 'User with this email or username already exists.' },
      });
    }

    const userId = 'usr_' + Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const nameToUse = displayName || username;

    db.prepare(`
      INSERT INTO users (id, email, password_hash, username, display_name, role, tier, is_email_verified, created_at)
      VALUES (?, ?, ?, ?, ?, 'user', 'free', 1, ?)
    `).run(userId, email, hashedPassword, username, nameToUse, now);

    db.prepare(`
      INSERT INTO profiles (id, user_id, display_name, avatar_url, bio, created_at, updated_at)
      VALUES (?, ?, ?, ?, '', ?, ?)
    `).run('prof_' + Date.now(), userId, nameToUse, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80', now, now);

    const userObj = {
      id: userId,
      email,
      username,
      displayName: nameToUse,
      role: 'user',
      tier: 'free',
      isEmailVerified: true,
      createdAt: now,
    };

    const accessToken = jwt.sign({ id: userId, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Account registered successfully',
      data: { user: userObj, accessToken },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Registration failed due to server error.' },
    });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: { code: 'INVALID_INPUT', message: 'Email and password are required.' },
      });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    const userObj = {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name || user.username,
      role: user.role || 'user',
      tier: user.tier || 'pro',
      isEmailVerified: !!user.is_email_verified,
      createdAt: user.created_at,
    };

    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Logged in successfully',
      data: { user: userObj, accessToken },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Login failed due to server error.' },
    });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Logged out successfully',
    data: null,
  });
});

// GET /api/v1/auth/me
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(444).json({
        success: false,
        statusCode: 404,
        error: { code: 'USER_NOT_FOUND', message: 'User not found.' },
      });
    }

    const userObj = {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name || user.username,
      role: user.role || 'user',
      tier: user.tier || 'pro',
      isEmailVerified: !!user.is_email_verified,
      createdAt: user.created_at,
    };

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Current user fetched',
      data: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch user.' },
    });
  }
});

export default router;
