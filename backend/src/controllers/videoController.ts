import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// Upload a new video ad
export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;
    const { title, description, videoUrl } = req.body;

    if (!sellerId || (userRole !== 'SELLER' && userRole !== 'ADMIN')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, error: 'Title and video URL are required' });
    }

    const video = await prisma.videoAd.create({
      data: {
        title,
        sellerId,
        videoUrl,
        description,

        approvalStatus: 'PENDING',
        viewCount: 0,
        likeCount: 0,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        approvalStatus: video.approvalStatus,
        uploadedAt: video.uploadedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to upload video' });
  }
};

// Delete a video ad
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;
    const videoId = parseInt(req.params.videoId);

    if (!sellerId || (userRole !== 'SELLER' && userRole !== 'ADMIN')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const video = await prisma.videoAd.findFirst({
      where: { id: videoId, sellerId },
    });
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    await prisma.videoAd.delete({ where: { id: videoId } });
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete video' });
  }
};