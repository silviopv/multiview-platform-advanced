import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getStreams = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const streams = await prisma.stream.findMany({
      where: { userId: req.userId },
      orderBy: { order: 'asc' },
    });
    res.json(streams);
  } catch (error) {
    console.error('Get streams error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getStream = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stream = await prisma.stream.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!stream) {
      res.status(404).json({ error: 'Stream não encontrada' });
      return;
    }

    res.json(stream);
  } catch (error) {
    console.error('Get stream error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createStream = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, url, protocol, tags } = req.body;

    const count = await prisma.stream.count({ where: { userId: req.userId } });

    const stream = await prisma.stream.create({
      data: {
        name,
        url,
        protocol,
        tags: tags || [],
        order: count,
        userId: req.userId!,
      },
    });

    res.status(201).json(stream);
  } catch (error) {
    console.error('Create stream error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateStream = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, url, protocol, isActive, tags, order } = req.body;

    const existing = await prisma.stream.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Stream não encontrada' });
      return;
    }

    const stream = await prisma.stream.update({
      where: { id: req.params.id as string },
      data: { name, url, protocol, isActive, tags, order },
    });

    res.json(stream);
  } catch (error) {
    console.error('Update stream error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteStream = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existing = await prisma.stream.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'Stream não encontrada' });
      return;
    }

    await prisma.stream.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Stream removida com sucesso' });
  } catch (error) {
    console.error('Delete stream error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const reorderStreams = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { streamIds } = req.body;

    const updates = streamIds.map((id: string, index: number) =>
      prisma.stream.updateMany({
        where: { id, userId: req.userId },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);
    res.json({ message: 'Ordem atualizada com sucesso' });
  } catch (error) {
    console.error('Reorder streams error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
