import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

function formatCharacter(row) {
  let traits = [];
  try {
    traits = JSON.parse(row.personality_traits || '[]');
  } catch {
    traits = [];
  }
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    archetype: row.archetype,
    avatarUrl: row.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    personalityTraits: traits,
    backstory: row.backstory || '',
    speechPattern: row.speech_pattern,
    isPublic: Boolean(row.is_public),
    createdAt: row.created_at,
  };
}

// GET /api/v1/characters
router.get('/', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM characters WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Characters fetched successfully',
      data: rows.map(formatCharacter),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch characters.' },
    });
  }
});

// POST /api/v1/characters
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, archetype, avatarUrl, personalityTraits, backstory, speechPattern, isPublic } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error: { code: 'INVALID_INPUT', message: 'Character name is required.' },
      });
    }

    const id = 'char_' + Date.now();
    const now = new Date().toISOString();
    const traitsJson = JSON.stringify(personalityTraits || ['Brave']);
    const avatar = avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80';
    const isPub = isPublic ?? true ? 1 : 0;

    db.prepare(`
      INSERT INTO characters (id, user_id, name, archetype, avatar_url, personality_traits, backstory, speech_pattern, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user.id, name, archetype || 'Protagonist', avatar, traitsJson, backstory || '', speechPattern || '', isPub, now);

    const created = db.prepare('SELECT * FROM characters WHERE id = ?').get(id);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Character forged successfully',
      data: formatCharacter(created),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to create character.' },
    });
  }
});

// GET /api/v1/characters/:id
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM characters WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'NOT_FOUND', message: 'Character not found.' },
      });
    }

    // Security Check: Private character only accessible by owner
    if (!Boolean(row.is_public) && row.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to access this private character.' },
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Character retrieved successfully',
      data: formatCharacter(row),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve character.' },
    });
  }
});

// PATCH /api/v1/characters/:id
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM characters WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'NOT_FOUND', message: 'Character not found.' },
      });
    }

    if (existing.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: { code: 'FORBIDDEN', message: 'You are not authorized to modify this character.' },
      });
    }

    const { name, archetype, avatarUrl, personalityTraits, backstory, speechPattern, isPublic } = req.body;

    const newName = name !== undefined ? name : existing.name;
    const newArchetype = archetype !== undefined ? archetype : existing.archetype;
    const newAvatar = avatarUrl !== undefined ? avatarUrl : existing.avatar_url;
    const newTraits = personalityTraits !== undefined ? JSON.stringify(personalityTraits) : existing.personality_traits;
    const newBackstory = backstory !== undefined ? backstory : existing.backstory;
    const newSpeech = speechPattern !== undefined ? speechPattern : existing.speech_pattern;
    const newIsPublic = isPublic !== undefined ? (isPublic ? 1 : 0) : existing.is_public;

    db.prepare(`
      UPDATE characters
      SET name = ?, archetype = ?, avatar_url = ?, personality_traits = ?, backstory = ?, speech_pattern = ?, is_public = ?
      WHERE id = ?
    `).run(newName, newArchetype, newAvatar, newTraits, newBackstory, newSpeech, newIsPublic, req.params.id);

    const updated = db.prepare('SELECT * FROM characters WHERE id = ?').get(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Character updated successfully',
      data: formatCharacter(updated),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to update character.' },
    });
  }
});

// DELETE /api/v1/characters/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM characters WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'NOT_FOUND', message: 'Character not found.' },
      });
    }

    if (existing.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: { code: 'FORBIDDEN', message: 'You are not authorized to delete this character.' },
      });
    }

    db.prepare('DELETE FROM characters WHERE id = ?').run(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Character deleted successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete character.' },
    });
  }
});

export default router;
