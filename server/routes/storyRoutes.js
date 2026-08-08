import express from 'express';
import { db } from '../db.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to format story SQL row to JS Object
function formatStory(row) {
  let tags = [];
  try {
    tags = JSON.parse(row.tags || '[]');
  } catch {
    tags = [];
  }
  return {
    id: row.id,
    userId: row.user_id,
    authorName: row.author_name || 'Alex Rivers',
    authorAvatar: row.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    title: row.title,
    slug: row.slug,
    synopsis: row.synopsis || '',
    genre: row.genre,
    content: row.content || '',
    tags,
    coverImageUrl: row.cover_image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: row.status,
    isPublic: Boolean(row.is_public),
    wordCount: row.word_count || 0,
    viewCount: row.view_count || 0,
    likeCount: row.like_count || 0,
    commentCount: row.comment_count || 0,
    ratingAverage: row.rating_average || 5.0,
    ratingCount: row.rating_count || 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/v1/stories (Public or Authenticated Library)
router.get('/', optionalAuth, (req, res) => {
  try {
    const { isPublic, status, genre, q } = req.query;

    let sql = 'SELECT * FROM stories WHERE 1=1';
    const params = [];

    // User data isolation: If caller is authenticated and asking for their library, filter by user_id
    if (req.user && isPublic !== 'true') {
      sql += ' AND user_id = ?';
      params.push(req.user.id);
    } else if (isPublic === 'true') {
      // Public discovery: only published & public stories
      sql += ' AND is_public = 1 AND status = ?';
      params.push('published');
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (genre && genre !== 'All') {
      sql += ' AND genre = ?';
      params.push(genre);
    }

    if (q) {
      sql += ' AND (title LIKE ? OR synopsis LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = db.prepare(sql).all(...params);
    const stories = rows.map(formatStory);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Stories fetched successfully',
      data: stories,
    });
  } catch (error) {
    console.error('Fetch stories error:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch stories.' },
    });
  }
});

// GET /api/v1/stories/:id
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const story = db.prepare('SELECT * FROM stories WHERE id = ?').get(req.params.id);
    if (!story) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'STORY_NOT_FOUND', message: 'Story not found.' },
      });
    }

    // Security check: Private stories only accessible by owner
    if (!story.is_public && story.status !== 'published') {
      if (!req.user || req.user.id !== story.user_id) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          error: { code: 'FORBIDDEN', message: 'You do not have permission to view this draft story.' },
        });
      }
    }

    // Increment view count if public
    if (story.is_public) {
      db.prepare('UPDATE stories SET view_count = view_count + 1 WHERE id = ?').run(req.params.id);
      story.view_count += 1;
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Story retrieved successfully',
      data: formatStory(story),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to retrieve story.' },
    });
  }
});

// POST /api/v1/stories (Create Story)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, genre, synopsis, content, tags, status, isPublic, coverImageUrl } = req.body;
    const now = new Date().toISOString();
    const storyId = 'story_' + Date.now();
    const slug = title ? title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4) : 'untitled-story';
    const textContent = content || synopsis || '';
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;
    const isPub = isPublic ? 1 : 0;
    const tagsJson = JSON.stringify(tags || [genre ? genre.toLowerCase() : 'creative']);

    const user = db.prepare('SELECT display_name, username FROM users WHERE id = ?').get(req.user.id);
    const authorName = user ? (user.display_name || user.username) : 'Creator';

    db.prepare(`
      INSERT INTO stories (id, user_id, author_name, author_avatar, title, slug, synopsis, genre, content, tags, cover_image_url, status, is_public, word_count, view_count, like_count, comment_count, rating_average, rating_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 5.0, 1, ?, ?)
    `).run(
      storyId,
      req.user.id,
      authorName,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      title || 'Untitled Story',
      slug,
      synopsis || '',
      genre || 'Sci-Fi',
      textContent,
      tagsJson,
      coverImageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      status || 'draft',
      isPub,
      wordCount,
      now,
      now
    );

    const created = db.prepare('SELECT * FROM stories WHERE id = ?').get(storyId);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Story created successfully',
      data: formatStory(created),
    });
  } catch (error) {
    console.error('Create story error:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to create story.' },
    });
  }
});

// PATCH /api/v1/stories/:id (Update Story)
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM stories WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'STORY_NOT_FOUND', message: 'Story not found.' },
      });
    }

    // Security check: User can only edit their own story
    if (existing.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: { code: 'FORBIDDEN', message: 'You are not authorized to modify this story.' },
      });
    }

    const { title, genre, synopsis, content, status, isPublic, tags } = req.body;
    const now = new Date().toISOString();

    const newTitle = title !== undefined ? title : existing.title;
    const newGenre = genre !== undefined ? genre : existing.genre;
    const newSynopsis = synopsis !== undefined ? synopsis : existing.synopsis;
    const newContent = content !== undefined ? content : existing.content;
    const newStatus = status !== undefined ? status : existing.status;
    const newIsPublic = isPublic !== undefined ? (isPublic ? 1 : 0) : existing.is_public;
    const newTags = tags !== undefined ? JSON.stringify(tags) : existing.tags;
    const wordCount = (newContent || newSynopsis || '').split(/\s+/).filter(Boolean).length;

    db.prepare(`
      UPDATE stories
      SET title = ?, genre = ?, synopsis = ?, content = ?, status = ?, is_public = ?, tags = ?, word_count = ?, updated_at = ?
      WHERE id = ?
    `).run(newTitle, newGenre, newSynopsis, newContent, newStatus, newIsPublic, newTags, wordCount, now, req.params.id);

    const updated = db.prepare('SELECT * FROM stories WHERE id = ?').get(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Story updated successfully',
      data: formatStory(updated),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to update story.' },
    });
  }
});

// DELETE /api/v1/stories/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM stories WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'STORY_NOT_FOUND', message: 'Story not found.' },
      });
    }

    // User data isolation: Only author can delete
    if (existing.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: { code: 'FORBIDDEN', message: 'You are not authorized to delete this story.' },
      });
    }

    db.prepare('DELETE FROM stories WHERE id = ?').run(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Story deleted successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete story.' },
    });
  }
});

// POST /api/v1/stories/:id/publish
router.post('/:id/publish', authenticateToken, (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM stories WHERE id = ?').get(req.params.id);
    if (!existing || existing.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        error: { code: 'NOT_FOUND', message: 'Story not found or unauthorized.' },
      });
    }

    const now = new Date().toISOString();
    db.prepare(`
      UPDATE stories SET status = 'published', is_public = 1, updated_at = ? WHERE id = ?
    `).run(now, req.params.id);

    const updated = db.prepare('SELECT * FROM stories WHERE id = ?').get(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Story published to discovery',
      data: formatStory(updated),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to publish story.' },
    });
  }
});

// POST /api/v1/stories/:id/like
router.post('/:id/like', authenticateToken, (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user.id;

    const existingLike = db.prepare('SELECT * FROM likes WHERE story_id = ? AND user_id = ?').get(storyId, userId);

    if (existingLike) {
      db.prepare('DELETE FROM likes WHERE story_id = ? AND user_id = ?').run(storyId, userId);
      db.prepare('UPDATE stories SET like_count = MAX(0, like_count - 1) WHERE id = ?').run(storyId);
      const updated = db.prepare('SELECT like_count FROM stories WHERE id = ?').get(storyId);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Unliked story',
        data: { liked: false, likeCount: updated ? updated.like_count : 0 },
      });
    } else {
      const now = new Date().toISOString();
      db.prepare('INSERT INTO likes (id, story_id, user_id, created_at) VALUES (?, ?, ?, ?)').run('like_' + Date.now(), storyId, userId, now);
      db.prepare('UPDATE stories SET like_count = like_count + 1 WHERE id = ?').run(storyId);
      const updated = db.prepare('SELECT like_count FROM stories WHERE id = ?').get(storyId);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Liked story',
        data: { liked: true, likeCount: updated ? updated.like_count : 0 },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      error: { code: 'SERVER_ERROR', message: 'Failed to like story.' },
    });
  }
});

export default router;
