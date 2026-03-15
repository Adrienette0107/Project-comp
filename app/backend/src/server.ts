import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
// @ts-ignore
import authRoutes from './routes/auth';
// @ts-ignore
import userRoutes from './routes/users';
// @ts-ignore
import farmRoutes from './routes/farm';
// @ts-ignore
import marketRoutes from './routes/market';
// @ts-ignore
import toolsRoutes from './routes/tools';
// @ts-ignore
import chatRoutes from './routes/chat';
// @ts-ignore
import schemeRoutes from './routes/schemes';
// @ts-ignore
import notificationRoutes from './routes/notifications';
// @ts-ignore
import recommendationRoutes from './routes/recommendations';
// @ts-ignore
import globalMarketRoutes from './routes/globalMarket';

// Import middleware
// @ts-ignore
import { errorHandler } from './middleware/errorHandler';
// @ts-ignore
import { requestLogger } from './middleware/requestLogger';

// Import services
// @ts-ignore
import { WebSocketService } from './websocket/socketService';
import { logger } from './utils/logger';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Initialize WebSocket service
const wsService = new WebSocketService(io);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Request logging
app.use(requestLogger);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/global-market', globalMarketRoutes);

// Health check endpoint
app.get('/api/health', (req: any, res: any) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api', (req: any, res: any) => {
  res.json({
    name: 'AgroConnect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      farm: '/api/farm',
      market: '/api/market',
      tools: '/api/tools',
      chat: '/api/chat',
      schemes: '/api/schemes',
      notifications: '/api/notifications',
      recommendations: '/api/recommendations',
      'global-market': '/api/global-market'
    }
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: any, res: any) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
  logger.error('Unhandled Rejection:', err);
});

export { io, wsService };
