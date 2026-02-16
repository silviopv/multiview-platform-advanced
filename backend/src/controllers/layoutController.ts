import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getLayouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const layouts = await prisma.layout.findMany({
      where: { userId: req.userId },
      include: { items: { include: { stream: true }, orderBy: { position: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(layouts);
  } catch (error) {
    console.error('Get layouts error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createLayout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, grid, isDefault, items, config: layoutConfig } = req.body;

    if (isDefault) {
      await prisma.layout.updateMany({
        where: { userId: req.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const layout = await prisma.layout.create({
      data: {
        name,
        grid,
        isDefault: isDefault || false,
        config: layoutConfig || {},
        userId: req.userId!,
        items: {
          create: (items || []).map((item: any) => ({
            streamId: item.streamId || null,
            position: item.position,
            row: item.row,
            col: item.col,
            rowSpan: item.rowSpan || 1,
            colSpan: item.colSpan || 1,
            audioOn: item.audioOn || false,
          })),
        },
      },
      include: { items: { include: { stream: true } } },
    });

    res.status(201).json(layout);
  } catch (error) {
    console.error('Create layout error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateLayout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, grid, isDefault, items, config: layoutConfig } = req.body;

    const existing = await prisma.layout.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Layout não encontrado' });
      return;
    }

    if (isDefault) {
      await prisma.layout.updateMany({
        where: { userId: req.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    await prisma.layoutItem.deleteMany({ where: { layoutId: req.params.id as string } });

    const layout = await prisma.layout.update({
      where: { id: req.params.id as string },
      data: {
        name,
        grid,
        isDefault,
        config: layoutConfig,
        items: {
          create: (items || []).map((item: any) => ({
            streamId: item.streamId || null,
            position: item.position,
            row: item.row,
            col: item.col,
            rowSpan: item.rowSpan || 1,
            colSpan: item.colSpan || 1,
            audioOn: item.audioOn || false,
          })),
        },
      },
      include: { items: { include: { stream: true } } },
    });

    res.json(layout);
  } catch (error) {
    console.error('Update layout error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteLayout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await prisma.layout.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Layout não encontrado' });
      return;
    }

    await prisma.layout.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Layout removido com sucesso' });
  } catch (error) {
    console.error('Delete layout error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
