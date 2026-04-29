import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as storeController from '../controllers/storeController';
import * as productController from '../controllers/productController';
import * as orderController from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

console.log("Routes file loaded")
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
router.post('/test-store', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ success: true, message: 'Test works' });
});

// Auth routes
 router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.getCurrentUser);

//Store routes
router.get('/stores/nearby', storeController.getNearbyStores);
router.get('/stores/:storeId', storeController.getStoreById);
router.post('/stores', (req, res, next) => {
  console.log('Store route hit');
  next();
}, authMiddleware, storeController.createStore);

// Product routes
router.get('/stores/:storeId/products', productController.getProductsByStore);
router.get('/products/:productId', productController.getProductById);
router.post('/products', authMiddleware, productController.createProduct);

// Order routes
router.post('/orders', authMiddleware, orderController.createOrder);
router.get('/orders/:orderId', authMiddleware, orderController.getOrderById);
router.get('/orders', authMiddleware, orderController.getMyOrders);

// 404 for everything else
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default router;
