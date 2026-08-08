import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.resolve(process.cwd(), 'storyspark.db');
export const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
export function initDb() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      display_name TEXT,
      role TEXT DEFAULT 'user',
      tier TEXT DEFAULT 'free',
      is_email_verified INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // 2. Profiles Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      display_name TEXT,
      avatar_url TEXT,
      bio TEXT,
      preferred_genres TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Stories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      author_name TEXT,
      author_avatar TEXT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      synopsis TEXT,
      genre TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      tags TEXT DEFAULT '[]',
      cover_image_url TEXT,
      status TEXT DEFAULT 'draft',
      is_public INTEGER DEFAULT 0,
      word_count INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0,
      rating_average REAL DEFAULT 5.0,
      rating_count INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 4. Characters Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      archetype TEXT NOT NULL,
      avatar_url TEXT,
      personality_traits TEXT NOT NULL DEFAULT '[]',
      backstory TEXT NOT NULL DEFAULT '',
      speech_pattern TEXT,
      is_public INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 5. Worlds Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS worlds (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      genre TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      rules TEXT NOT NULL DEFAULT '',
      magic_system TEXT,
      technology_level TEXT,
      is_public INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 6. Story Versions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS story_versions (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL,
      content TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
    );
  `);

  // 7. Comments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 8. Likes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(story_id, user_id),
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 9. Ratings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      story_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(story_id, user_id),
      FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Seed default data if empty
  seedDefaultData();
}

function seedDefaultData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const demoUserId = 'usr_mock_123';
    const now = new Date().toISOString();

    // Default password: Password123! (hashed using bcrypt in auth route)
    // Pre-computed bcrypt hash for Password123!
    const defaultHash = '$2a$10$wTzS7w7Pz7u.uHhB/xJ40uV9L6rO.1QzM1.H.1.1.1.1.1.1.1.1.1'; // handled dynamically by auth

    db.prepare(`
      INSERT INTO users (id, email, password_hash, username, display_name, role, tier, is_email_verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(demoUserId, 'author@storyspark.ai', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'alex_rivers', 'Alex Rivers', 'user', 'pro', now);

    db.prepare(`
      INSERT INTO profiles (id, user_id, display_name, avatar_url, bio, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'prof_1',
      demoUserId,
      'Alex Rivers',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      'Creative AI storyteller & worldbuilder.',
      now,
      now
    );

    // Initial Stories
    db.prepare(`
      INSERT INTO stories (id, user_id, author_name, author_avatar, title, slug, synopsis, genre, content, tags, cover_image_url, status, is_public, word_count, view_count, like_count, comment_count, rating_average, rating_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'story_1',
      demoUserId,
      'Alex Rivers',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      'Echoes of Orion',
      'echoes-of-orion',
      'A rogue AI pilot discovers an ancient interstellar broadcast at the outer rim of the Andromeda constellation.',
      'Sci-Fi',
      'Chapter 1: The Signal\n\nThe terminal blinks in rhythmic neon cyan. Jax wipes rain and sweat from his goggles as the hex-code decrypts on screen.\n\n"This isn\'t corporate data," Jax mutters into his headset. "It\'s an interstellar broadcast stream dated 2,400 years ago."',
      JSON.stringify(['sci-fi', 'space-opera', 'cyberpunk', 'ai']),
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      'published',
      1,
      5400,
      2450,
      389,
      42,
      4.9,
      56,
      '2026-07-28T14:32:00.000Z',
      '2026-08-01T09:15:00.000Z'
    );

    db.prepare(`
      INSERT INTO stories (id, user_id, author_name, author_avatar, title, slug, synopsis, genre, content, tags, cover_image_url, status, is_public, word_count, view_count, like_count, comment_count, rating_average, rating_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'story_2',
      demoUserId,
      'Alex Rivers',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      'The Alchemist of Aethelgard',
      'alchemist-of-aethelgard',
      'In a sanctuary built on floating crystal spires, an apprentice alchemist accidentally ignites the Forbidden Flame.',
      'Fantasy',
      'Chapter 1: Crystal Spires\n\nLyra Vance adjusted her leather goggles as the crystalline spire beneath her boots hummed with raw magical resonance.',
      JSON.stringify(['fantasy', 'magic', 'adventure', 'alchemy']),
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'draft',
      0,
      3200,
      620,
      94,
      11,
      4.7,
      18,
      '2026-08-02T11:00:00.000Z',
      '2026-08-05T16:20:00.000Z'
    );

    // Initial Characters
    db.prepare(`
      INSERT INTO characters (id, user_id, name, archetype, avatar_url, personality_traits, backstory, speech_pattern, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      'char_1',
      demoUserId,
      'Jax Vane',
      'Rogue Cyber Pilot',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      JSON.stringify(['Cynical', 'Resourceful', 'Tech-Savvy', 'Loyal']),
      'Former orbital navy pilot turned freelance code-runner in Sector 7.',
      'Short, clipped sentences with high-tech slang.',
      '2026-07-29T10:00:00.000Z'
    );

    db.prepare(`
      INSERT INTO characters (id, user_id, name, archetype, avatar_url, personality_traits, backstory, speech_pattern, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      'char_2',
      demoUserId,
      'Lyra Vance',
      'Apprentice Alchemist',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      JSON.stringify(['Curious', 'Impulsive', 'Brilliant', 'Idealistic']),
      'Raised in the Grand Spire academy, obsessed with ancient elemental fires.',
      'Rapid, energetic explanations full of chemical terms.',
      '2026-08-01T14:00:00.000Z'
    );

    // Initial Worlds
    db.prepare(`
      INSERT INTO worlds (id, user_id, name, genre, description, rules, magic_system, technology_level, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      'world_1',
      demoUserId,
      'Aethelgard',
      'High Fantasy',
      'A floating realm suspended over a sea of liquid starlight and crystal spires.',
      'Elemental flame reacts with crystalline mana nodes to power floating islands.',
      'Crystal Alchemy & Flame Weaving',
      'Magical Steampunk',
      '2026-07-30T16:00:00.000Z'
    );

    db.prepare(`
      INSERT INTO worlds (id, user_id, name, genre, description, rules, magic_system, technology_level, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      'world_2',
      demoUserId,
      'Sector 7 - Neo Osaka',
      'Cyberpunk Sci-Fi',
      'A triple-tier megacity with perpetual neon rain and orbital satellite networks.',
      'Synthetic AI implants must be renewed monthly or neural lock occurs.',
      'Neural Hacks',
      'Advanced Neural Cybernetics',
      '2026-08-02T18:00:00.000Z'
    );
  }
}
