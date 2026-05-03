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