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
import jokeRoutes from './routes/jokeRoutes.js';

dotenv.config();

// Initialize SQLite database tables & seed data
initDb();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================================================
// CORS CONFIGURATION
// ==================================================

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',

  // Vercel production frontend
  'https://story-spark-732zftzu2-ritesh-d6f0.vercel.app',
  'https://story-spark-ai-amber.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (for example, server-to-server requests)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(`CORS blocked origin: ${origin}`);
      return callback(new Error(`CORS blocked origin: ${origin}`));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// ==================================================
// BODY PARSERS
// ==================================================

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ==================================================
// REQUEST LOGGING
// ==================================================

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`
  );

  next();
});

// ==================================================
// API v1 ROUTES
// ==================================================

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/stories', storyRoutes);

app.use('/api/v1/characters', characterRoutes);

app.use('/api/v1/worlds', worldRoutes);

app.use('/api/v1/ai', aiRoutes);

app.use('/api/v1/jokes', jokeRoutes);

// ==================================================
// HEALTH CHECK
// ==================================================

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    service: 'StorySpark AI Backend API',
    database: 'SQLite (node:sqlite persistent)',
  });
});

// ==================================================
// SERVE STATIC FRONTEND BUILD
// ==================================================

const distPath = path.resolve(process.cwd(), 'dist');

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.url.startsWith('/api/v1')) {
    return next();
  }

  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res
        .status(404)
        .send('StorySpark AI Backend API Active');
    }
  });
});

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

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

// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {
  console.log('==================================================');
  console.log(
    `🚀 StorySpark AI Full-Stack Server Running on Port ${PORT}`
  );
  console.log(
    `📡 API Endpoint: http://localhost:${PORT}/api/v1`
  );
  console.log(
    '💾 Database: SQLite (storyspark.db persistent)'
  );
  console.log('==================================================');
});
