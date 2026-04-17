import express from 'express';
import cors from 'cors';
// Optional: comment out helmet and morgan temporarily if they cause issues
// import helmet from 'helmet';
// import morgan from 'morgan';
import { env } from './config/env';
import router from './routes/index';  // ← Try with explicit /index

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));

// Routes
app.use('/api', router);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// Start server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

export default app;