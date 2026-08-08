import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

function formatWorld(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    genre: row.genre,
    description: row.description || '',
    rules: row.rules || '',
    magicSystem: row.magic_system,
    technologyLevel: row.technology_level,
    isPublic: Boolean(row.is_public),
    createdAt: row.created_at,
  };
}

// GET /api/v1/worlds
router.get('/', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM worlds WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Worlds fetched successfully',
      data: rows.map(formatWorld),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch worlds.' },
    });
  }
});

// POST /api/v1/worlds
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, genre, description, rules, magicSystem, technologyLevel, isPublic } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: { code: 'INVALID_INPUT', message: 'World name is required.' },
      });
    }

    const id = 'world_' + Date.now();
    const now = new Date().toISOString();
    const isPub = isPublic ?? true ? 1 : 0;

    db.prepare(`
      INSERT INTO worlds (id, user_id, name, genre, description, rules, magic_system, technology_level, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, name, genre || 'Sci-Fi', description || '', rules || '', magicSystem || '', technologyLevel || '', isPub, now);

    const created = db.prepare('SELECT * FROM worlds WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'World lore saved successfully',
      data: formatWorld(created),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to create world.' },
    });
  }
});

// DELETE /api/v1/worlds/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM worlds WHERE id = ?').get(req.params.id);
    if (!existing || existing.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'NOT_FOUND', message: 'World not found or unauthorized.' },
      });
    }

    db.prepare('DELETE FROM worlds WHERE id = ?').run(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'World deleted successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete world.' },
    });
  }
});

export default router;
