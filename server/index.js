import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initDb } from './db.js';

import authRoutes from './routes/authRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import worldRoutes from './routes/worldRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

// Initialize SQLite database tables & seed data
initDb();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/characters', characterRoutes);
app.use('/api/v1/worlds', worldRoutes);
app.use('/api/v1/ai', aiRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    service: 'StorySpark AI Backend API',
    database: 'SQLite (node:sqlite persistent)',
  });
});

// Serve static frontend build files in production if dist/ exists
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.url.startsWith('/api/v1')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('StorySpark AI Backend API Active');
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
    },
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 StorySpark AI Full-Stack Server Running on Port ${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}/api/v1`);
  console.log(`💾 Database: SQLite (storyspark.db persistent)`);
  console.log(`==================================================`);
});
