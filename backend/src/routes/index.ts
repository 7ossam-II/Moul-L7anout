import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as storeController from '../controllers/storeController';
import * as productController from '../controllers/productController';
import * as orderController from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';
import * as sellerController from '../controllers/sellerController';

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
// seller revenue route
router.get('/seller/revenue/monthly',authMiddleware,sellerController.getMonthlyRevenue);
//top customers
router.get('/seller/top-customers', authMiddleware, sellerController.getTopCustomers);

//video routes
router.get('/seller/video-stats', authMiddleware, sellerController.getVideoStats);
router.get('/seller/videos', authMiddleware, sellerController.getSellerVideos);

//live tracking
router.get('/seller/store/live-tracking', authMiddleware, sellerController.getLiveTracking);
router.put('/seller/store/live-tracking', authMiddleware, sellerController.updateLiveTracking);


//get product trends
router.get('/seller/orders/monthly', authMiddleware, sellerController.getMonthlyOrders);
//get costumer insights
router.get('/seller/customer-insights', authMiddleware, sellerController.getCustomerInsights);
//product sales by category
router.get('/seller/sales-by-category', authMiddleware, sellerController.getSalesByCategory);
router.get('/seller/recent-activity', authMiddleware, sellerController.getRecentActivity);

router.get('/seller/sales-last-7-days', authMiddleware, sellerController.getSalesLast7Days);
router.get('/seller/products', authMiddleware, sellerController.getSellerProducts);
router.get('/seller/trending-products', authMiddleware, sellerController.getTrendingProducts);
router.get('/seller/category-distribution', authMiddleware, sellerController.getCategoryDistribution);
//quick stats
router.get('/seller/quick-stats', authMiddleware, sellerController.getQuickStats);

router.get('/seller/orders/stats', authMiddleware, sellerController.getOrderStats);

router.get('/seller/revenue/last-6-months', authMiddleware, sellerController.getRevenueLast6Months);

router.get('/seller/orders', authMiddleware, sellerController.getSellerOrders);

// 404 for everything else
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default router;
