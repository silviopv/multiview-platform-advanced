import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '50', unreadOnly = 'false' } = req.query;

    const where: any = { userId: req.userId };
    if (unreadOnly === 'true') where.isRead = false;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: { stream: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: req.userId, isRead: false } }),
    ]);

    res.json({
      notifications,
      total,
      unreadCount,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (ids && Array.isArray(ids)) {
      await prisma.notification.updateMany({
        where: { id: { in: ids }, userId: req.userId },
        data: { isRead: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId: req.userId, isRead: false },
        data: { isRead: true },
      });
    }

    res.json({ message: 'Notificações marcadas como lidas' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (ids && Array.isArray(ids)) {
      await prisma.notification.deleteMany({
        where: { id: { in: ids }, userId: req.userId },
      });
    } else {
      await prisma.notification.deleteMany({
        where: { userId: req.userId },
      });
    }

    res.json({ message: 'Notificações removidas com sucesso' });
  } catch (error) {
    console.error('Delete notifications error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
