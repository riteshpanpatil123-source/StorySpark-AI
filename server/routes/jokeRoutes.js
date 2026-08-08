import express from 'express';
import { db } from '../db.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

function formatJoke(row) {
  return {
    id: row.id,
    userId: row.user_id,
    setup: row.setup,
    punchline: row.punchline,
    category: row.category,
    ratingAverage: row.rating_average || 5.0,
    ratingCount: row.rating_count || 1,
    isPublic: Boolean(row.is_public),
    createdAt: row.created_at,
  };
}

// GET /api/v1/jokes
router.get('/', optionalAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM jokes ORDER BY created_at DESC').all();
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Jokes fetched successfully',
      data: rows.map(formatJoke),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch jokes.' },
    });
  }
});

// POST /api/v1/jokes
router.post('/', authenticateToken, (req, res) => {
  try {
    const { setup, punchline, category, isPublic } = req.body;
    if (!setup || !punchline) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: { code: 'INVALID_INPUT', message: 'Setup and punchline are required.' },
      });
    }

    const id = 'jk_' + Date.now();
    const now = new Date().toISOString();
    const isPub = isPublic ?? true ? 1 : 0;

    db.prepare(`
      INSERT INTO jokes (id, user_id, setup, punchline, category, rating_average, rating_count, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, 5.0, 1, ?, ?)
    `).run(id, req.user.id, setup, punchline, category || 'General', isPub, now);

    const created = db.prepare('SELECT * FROM jokes WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Joke saved successfully',
      data: formatJoke(created),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to save joke.' },
    });
  }
});

export default router;
