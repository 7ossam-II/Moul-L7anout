import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get all stores owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Fetch all accomplished orders from those stores
    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: storeIds },
        orderStatus: 'ACCOMPLISHED',
      },
      select: { totalAmount: true, createdAt: true },
    });

    // Aggregate by month and year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth = new Map<string, number>();

    for (const order of orders) {
      const date = new Date(order.createdAt);
      const year = date.getFullYear();
      const month = monthNames[date.getMonth()];
      const key = `${year}-${month}`;
      const current = revenueByMonth.get(key) || 0;
      revenueByMonth.set(key, current + Number(order.totalAmount));
    }

    // Convert to array and sort chronologically
    const data = Array.from(revenueByMonth.entries())
      .map(([key, total]) => {
        const [year, month] = key.split('-');
        return { year: parseInt(year), month, total };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
      });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch monthly revenue' });
  }
};
export const getTopCustomers = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    // Get all stores owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: { customers: [], totalCustomers: 0 } });
    }

    // Fetch all accomplished orders from those stores, including buyer info
    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: storeIds },
        orderStatus: 'ACCOMPLISHED',
      },
      include: {
        buyer: {
          include: {
            user: true,   // pulls fullName from User
          },
        },
      },
    });

    // Aggregate by buyer
    const customerMap = new Map<number, {
      fullName: string;
      totalSpent: number;
      orderCount: number;
      lastOrderDate: Date;
    }>();

    for (const order of orders) {
      const buyerId = order.buyerId;
      const buyerUser = order.buyer.user;
      if (!customerMap.has(buyerId)) {
        customerMap.set(buyerId, {
          fullName: buyerUser.fullName,
          totalSpent: 0,
          orderCount: 0,
          lastOrderDate: new Date(0),
        });
      }
      const entry = customerMap.get(buyerId)!;
      entry.totalSpent += Number(order.totalAmount);
      entry.orderCount++;
      if (order.createdAt > entry.lastOrderDate) {
        entry.lastOrderDate = order.createdAt;
      }
    }

    // Convert map to array, sort by totalSpent descending, apply limit
    const customers = Array.from(customerMap.values())
      .map(c => ({
        fullName: c.fullName,
        totalSpent: c.totalSpent,
        orderCount: c.orderCount,
        lastOrderDate: c.lastOrderDate.toISOString(),
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);

    const totalCustomers = customers.length;

    res.json({
      success: true,
      data: {
        customers,
        totalCustomers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch top customers' });
  }
};
// Aggregated video stats for the seller
export const getVideoStats = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const videos = await prisma.videoAd.findMany({
      where: { sellerId },
      select: { viewCount: true, likeCount: true },
    });

    const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
    const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);
    const avgEngagement = totalViews > 0 ? (totalLikes / totalViews) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalViews,
        totalLikes,
        avgEngagement: Math.round(avgEngagement * 10) / 10,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch video stats' });
  }
};

// List all videos uploaded by the seller
export const getSellerVideos = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const videos = await prisma.videoAd.findMany({
      where: { sellerId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({ success: true, data: videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch videos' });
  }
};

// Get live tracking status of the seller's store (default: first store)
export const getLiveTracking = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get the seller's stores
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true, liveTrackingEnabled: true },
    });

    if (stores.length === 0) {
      return res.status(404).json({ success: false, error: 'No store found for this seller' });
    }

    // Return the first store's status
    res.json({
      success: true,
      data: {
        storeId: stores[0].id,
        liveTrackingEnabled: stores[0].liveTrackingEnabled,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch live tracking status' });
  }
};

// Update live tracking status for the seller's store
export const updateLiveTracking = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;
    const { enabled } = req.body;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ success: false, error: 'enabled must be a boolean' });
    }

    // Get the seller's stores
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });

    if (stores.length === 0) {
      return res.status(404).json({ success: false, error: 'No store found for this seller' });
    }

    // Update the first store
    const updatedStore = await prisma.store.update({
      where: { id: stores[0].id },
      data: { liveTrackingEnabled: enabled },
    });

    res.json({
      success: true,
      data: {
        storeId: updatedStore.id,
        liveTrackingEnabled: updatedStore.liveTrackingEnabled,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update live tracking status' });
  }
};
// getting monthly orders
export const getMonthlyOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get all stores owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Fetch all accomplished orders from those stores
    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: storeIds },
        orderStatus: 'ACCOMPLISHED',
      },
      select: { createdAt: true },
    });

    // Count orders per month-year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const ordersByMonth = new Map<string, number>();

    for (const order of orders) {
      const date = new Date(order.createdAt);
      const year = date.getFullYear();
      const month = monthNames[date.getMonth()];
      const key = `${year}-${month}`;
      const current = ordersByMonth.get(key) || 0;
      ordersByMonth.set(key, current + 1);
    }

    // Convert to array and sort chronologically
    const data = Array.from(ordersByMonth.entries())
      .map(([key, count]) => {
        const [year, month] = key.split('-');
        return { year: parseInt(year), month, count };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
      });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch monthly orders' });
  }
};

export const getCustomerInsights = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get all stores owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({
        success: true,
        data: {
          returningCustomersPercent: 0,
          avgOrderValue: 0,
          customerLifetimeMonths: 0,
        },
      });
    }

    // Fetch all accomplished orders with buyer info
    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: storeIds },
        orderStatus: 'ACCOMPLISHED',
      },
      include: {
        buyer: true,
      },
    });

    if (orders.length === 0) {
      return res.json({
        success: true,
        data: {
          returningCustomersPercent: 0,
          avgOrderValue: 0,
          customerLifetimeMonths: 0,
        },
      });
    }

    // Calculate average order value
    const totalAmount = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const avgOrderValue = totalAmount / orders.length;

    // Calculate returning customers percentage
    const buyerOrderCounts = new Map<number, { count: number; firstOrderDate: Date; lastOrderDate: Date }>();
    for (const order of orders) {
      const buyerId = order.buyerId;
      if (!buyerOrderCounts.has(buyerId)) {
        buyerOrderCounts.set(buyerId, {
          count: 0,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt,
        });
      }
      const entry = buyerOrderCounts.get(buyerId)!;
      entry.count++;
      if (order.createdAt < entry.firstOrderDate) entry.firstOrderDate = order.createdAt;
      if (order.createdAt > entry.lastOrderDate) entry.lastOrderDate = order.createdAt;
    }

    const totalBuyers = buyerOrderCounts.size;
    const returningBuyers = Array.from(buyerOrderCounts.values()).filter(b => b.count > 1).length;
    const returningCustomersPercent = totalBuyers > 0 ? (returningBuyers / totalBuyers) * 100 : 0;

    // Calculate customer lifetime (months) – average months between first and last order
    let totalLifetimeMonths = 0;
    let buyersWithMultipleOrders = 0;
    for (const buyer of buyerOrderCounts.values()) {
      if (buyer.count > 1) {
        const diffMs = buyer.lastOrderDate.getTime() - buyer.firstOrderDate.getTime();
        const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44); // average days per month
        totalLifetimeMonths += diffMonths;
        buyersWithMultipleOrders++;
      }
    }
    const customerLifetimeMonths = buyersWithMultipleOrders > 0 ? totalLifetimeMonths / buyersWithMultipleOrders : 0;

    res.json({
      success: true,
      data: {
        returningCustomersPercent: Math.round(returningCustomersPercent),
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        customerLifetimeMonths: Math.round(customerLifetimeMonths * 10) / 10,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer insights' });
  }
};
//sales by category
export const getSalesByCategory = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get all stores owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Fetch all accomplished orders from those stores, including order items and product category
    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: storeIds },
        orderStatus: 'ACCOMPLISHED',
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: { category: true, price: true },
            },
          },
        },
      },
    });

    // Aggregate sales per category
    const categorySales = new Map<string, number>();

    for (const order of orders) {
      for (const item of order.orderItems) {
        const category = item.product.category || 'Uncategorized';
        const itemTotal = Number(item.unitPrice) * item.quantity;
        const current = categorySales.get(category) || 0;
        categorySales.set(category, current + itemTotal);
      }
    }

    // Calculate total sales and percentages
    const totalSales = Array.from(categorySales.values()).reduce((sum, val) => sum + val, 0);
    const data = Array.from(categorySales.entries())
      .map(([category, total]) => ({
        category,
        total,
        percentage: totalSales > 0 ? Math.round((total / totalSales) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch sales by category' });
  }
};
// recent activity
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get all stores owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });

    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Fetch recent orders (limit 10) with buyer and store info
    const orders = await prisma.order.findMany({
      where: { storeId: { in: storeIds } },
      include: {
        buyer: {
          include: { user: true },
        },
        store: {
          select: { id: true, address: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const activities = orders.map(order => ({
      type: 'ORDER',
      description: `New order #${order.id} from ${order.buyer.user.fullName}`,
      timestamp: order.createdAt.toISOString(),
      orderId: order.id,
      totalAmount: order.totalAmount,
    }));

    res.json({ success: true, data: activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch recent activity' });
  }
};
//sales revenue last 7 days
export const getSalesLast7Days = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get store IDs owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Generate last 7 days dates (today minus 6 days)
    const today = new Date();
    const days: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }
    const startDate = days[0];
    const endDate = new Date(days[6]);
    endDate.setHours(23, 59, 59, 999);

    // Fetch orders in that period
    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: storeIds },
        orderStatus: 'ACCOMPLISHED',
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { createdAt: true, totalAmount: true },
    });

    // Map day -> revenue
    const map = new Map<string, number>();
    for (const order of orders) {
      const dayStr = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      const current = map.get(dayStr) || 0;
      map.set(dayStr, current + Number(order.totalAmount));
    }

    // Build response with day labels (Mon, Tue, etc.)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map(d => {
      const dateStr = d.toISOString().split('T')[0];
      return {
        day: dayNames[d.getDay()],
        date: dateStr,
        revenue: map.get(dateStr) || 0,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch sales data' });
  }
};
//seller products
export const getSellerProducts = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Pagination and filters
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const availableStatus = req.query.availableStatus === 'true' ? true : req.query.availableStatus === 'false' ? false : undefined;

    // Get store IDs owned by seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true, name: true },
    });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [], pagination: { total: 0, limit, offset } });
    }

    // Build filters
    const where: any = { storeId: { in: storeIds } };
    if (category) where.category = category;
    if (availableStatus !== undefined) where.availableStatus = availableStatus;
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // Count total products matching filters
    const total = await prisma.product.count({ where });

    // Fetch products with store name
    const products = await prisma.product.findMany({
      where,
      include: { store: { select: { name: true } } },
      orderBy: { id: 'desc' },
      skip: offset,
      take: limit,
    });

    const data = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      availableStatus: p.availableStatus,
      storeId: p.storeId,
      storeName: p.store.name,
      photoUrl: p.photoUrl,
      quantityAvailable: p.quantityAvailable,
      deliveryAvailable: p.deliveryAvailable,
    }));

    res.json({
      success: true,
      data,
      pagination: { total, limit, offset },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};
//trending products
export const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 5, 20);
    const periodDays = parseInt(req.query.periodDays as string) || 30;

    const results = await prisma.$queryRaw`
      SELECT 
        p.id AS "productId",
        p.name AS "productName",
        SUM(oi.quantity) AS "totalSold",
        SUM(oi.quantity * oi."unitPrice") AS "revenue"
      FROM order_items oi
      JOIN orders o ON o.id = oi."orderId"
      JOIN products p ON p.id = oi."productId"
      JOIN stores s ON s.id = o."storeId"
      WHERE s."sellerId" = ${sellerId}
        AND o."orderStatus" = 'ACCOMPLISHED'
        AND o."createdAt" >= NOW() - (${periodDays} || ' days')::INTERVAL
      GROUP BY p.id, p.name
      ORDER BY "totalSold" DESC
      LIMIT ${limit}
    `;

    const data = (results as any[]).map((item, index) => ({
      rank: index + 1,
      productId: item.productId,
      productName: item.productName,
      totalSold: Number(item.totalSold),
      revenue: Number(item.revenue),
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch trending products' });
  }
};
//category distribution
export const getCategoryDistribution = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get store IDs owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Group products by category, count them
    const products = await prisma.product.groupBy({
      by: ['category'],
      where: { storeId: { in: storeIds } },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
    });

    const data = products.map(p => ({
      category: p.category || 'Uncategorized',
      count: p._count.category,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch category distribution' });
  }
};
export const getQuickStats = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get store IDs
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({
        success: true,
        data: {
          avgProductPrice: 0,
          topCategory: { name: '', percentage: 0 },
          lkridiRate: 0,
        },
      });
    }

    // Fetch all products in those stores
    const products = await prisma.product.findMany({
      where: { storeId: { in: storeIds } },
      select: { price: true, category: true, lkridiEligible: true },
    });

    const totalProducts = products.length;
    if (totalProducts === 0) {
      return res.json({
        success: true,
        data: { avgProductPrice: 0, topCategory: { name: '', percentage: 0 }, lkridiRate: 0 },
      });
    }

    // Average product price
    const totalPrice = products.reduce((sum, p) => sum + Number(p.price), 0);
    const avgProductPrice = totalPrice / totalProducts;

    // Top category by product count
    const categoryCount = new Map<string, number>();
    for (const p of products) {
      const cat = p.category || 'Uncategorized';
      categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
    }
    let topCategory = { name: '', count: 0 };
    for (const [name, count] of categoryCount.entries()) {
      if (count > topCategory.count) topCategory = { name, count };
    }
    const topCategoryPercentage = (topCategory.count / totalProducts) * 100;

    // LKRIDI rate (products with lkridiEligible true)
    const lkridiCount = products.filter(p => p.lkridiEligible).length;
    const lkridiRate = (lkridiCount / totalProducts) * 100;

    res.json({
      success: true,
      data: {
        avgProductPrice: Math.round(avgProductPrice * 100) / 100,
        topCategory: { name: topCategory.name, percentage: Math.round(topCategoryPercentage) },
        lkridiRate: Math.round(lkridiRate),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch quick stats' });
  }
};

export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Get store IDs owned by this seller
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({
        success: true,
        data: { totalOrders: 0, pending: 0, completed: 0, cancelled: 0, avgOrderValue: 0, conversionRate: 0 }
      });
    }

    // Aggregate order counts by status
    const orderCounts = await prisma.order.groupBy({
      by: ['orderStatus'],
      where: { storeId: { in: storeIds } },
      _count: { id: true },
    });

    const statusMap: Record<string, number> = {};
    for (const oc of orderCounts) {
      statusMap[oc.orderStatus] = oc._count.id;
    }

    const totalOrders = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const pending = statusMap['PENDING'] || 0;
    const completed = statusMap['ACCOMPLISHED'] || 0;
    const cancelled = statusMap['CANCELLED'] || 0;

    // Average order value – only from accomplished orders (or all? We'll use accomplished)
    const accomplishedOrders = await prisma.order.findMany({
      where: { storeId: { in: storeIds }, orderStatus: 'ACCOMPLISHED' },
      select: { totalAmount: true },
    });
    const totalRevenue = accomplishedOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const avgOrderValue = accomplishedOrders.length > 0 ? totalRevenue / accomplishedOrders.length : 0;

    // Conversion rate: completed / total orders * 100
    const conversionRate = totalOrders > 0 ? (completed / totalOrders) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        pending,
        completed,
        cancelled,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        conversionRate: Math.round(conversionRate * 10) / 10,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch order stats' });
  }
};

export const getRevenueLast6Months = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Calculate date 6 months ago from today
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        storeId: { in: storeIds },
        orderStatus: 'ACCOMPLISHED',
        createdAt: { gte: sixMonthsAgo },
      },
      select: { createdAt: true, totalAmount: true },
    });

    // Group by month-year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueMap = new Map<string, number>();

    for (const order of orders) {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`; // YYYY-M (0-index)
      const monthName = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const displayKey = `${year}-${monthName}`;
      const current = revenueMap.get(displayKey) || 0;
      revenueMap.set(displayKey, current + Number(order.totalAmount));
    }

    // Generate last 6 months in order (oldest to newest)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(today.getMonth() - i);
      const year = d.getFullYear();
      const monthName = monthNames[d.getMonth()];
      const key = `${year}-${monthName}`;
      months.push({ month: monthName, year, revenue: revenueMap.get(key) || 0 });
    }

    res.json({ success: true, data: months });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch revenue for last 6 months' });
  }
};

export const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || !userRole) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const customerSearch = req.query.customerSearch as string;

    // Get store IDs
    const stores = await prisma.store.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const storeIds = stores.map(s => s.id);
    if (storeIds.length === 0) {
      return res.json({ success: true, data: [], pagination: { total: 0, limit, offset } });
    }

    // Build where clause
    const where: any = { storeId: { in: storeIds } };
    if (status) where.orderStatus = status;
    if (startDate) where.createdAt = { ...where.createdAt, gte: startDate };
    if (endDate) where.createdAt = { ...where.createdAt, lte: endDate };
    if (customerSearch) {
      where.buyer = {
        user: {
          OR: [
            { fullName: { contains: customerSearch, mode: 'insensitive' } },
            { phone: { contains: customerSearch, mode: 'insensitive' } },
          ],
        },
      };
    }

    const total = await prisma.order.count({ where });

    const orders = await prisma.order.findMany({
      where,
      include: {
        buyer: { include: { user: true } },
        store: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    const data = orders.map(o => ({
      id: o.id,
      orderNumber: o.id, // or generate if you have orderNumber field
      buyerName: o.buyer.user.fullName,
      buyerPhone: o.buyer.user.phone,
      totalAmount: o.totalAmount,
      status: o.orderStatus,
      createdAt: o.createdAt,
    }));

    res.json({
      success: true,
      data,
      pagination: { total, limit, offset },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};