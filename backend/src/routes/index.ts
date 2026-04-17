import { Router } from 'express';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// 404 for everything else
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ✅ MUST use export default
export default router;