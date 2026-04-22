import 'dotenv/config';
import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';
import corsMiddleware from './src/middleware/cors.middleware.js';
import errorHandler from './src/middleware/error.middleware.js';
import connectDB from './src/config/db.js';

// ── Routes ────────────────────────────────────────────
import authRoutes from './src/routes/auth.routes.js';
import projectRoutes from './src/routes/projects.routes.js';
import skillRoutes from './src/routes/skills.routes.js';
import profileRoutes from './src/routes/profile.routes.js';
import messageRoutes from './src/routes/messages.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';

const app = express();

// ── Connect Database ──────────────────────────────────
connectDB();

// ── Security & Performance Middleware ─────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(corsMiddleware);
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Rate Limiting ─────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2,
  message: { success: false, message: 'Too many messages sent. Please wait before trying again.' },
});
app.use('/api/', limiter);
app.post('/api/messages', contactLimiter);

// ── Body Parser ───────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── API Docs ──────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { background-color: #0a0a0f; }',
  customSiteTitle: "Papai's Portfolio API",
}));

// ── Routes ────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills',   skillRoutes);
app.use('/api/profile',  profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload',   uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Health Check ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: "Papai's Portfolio API is running 🚀", env: process.env.NODE_ENV });
});

// ── 404 Handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📖 API Docs:   http://localhost:${PORT}/api-docs`);
    console.log(`❤️  Health:    http://localhost:${PORT}/health\n`);
  });
}

// Export for Vercel
export default app;
