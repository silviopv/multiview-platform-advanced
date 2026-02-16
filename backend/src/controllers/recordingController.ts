import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getRecordings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, streamId, page = '1', limit = '20' } = req.query;

    const where: any = { userId: req.userId };
    if (status) where.status = status;
    if (streamId) where.streamId = streamId;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [recordings, total] = await Promise.all([
      prisma.recording.findMany({
        where,
        include: { stream: { select: { name: true, protocol: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.recording.count({ where }),
    ]);

    res.json({
      recordings: recordings.map((r: any) => ({
        ...r,
        fileSize: r.fileSize ? Number(r.fileSize) : null,
      })),
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error('Get recordings error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createRecording = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { streamId, format, storageType, scheduledAt } = req.body;

    const stream = await prisma.stream.findFirst({
      where: { id: streamId, userId: req.userId },
    });

    if (!stream) {
      res.status(404).json({ error: 'Stream não encontrada' });
      return;
    }

    const recording = await prisma.recording.create({
      data: {
        streamId,
        userId: req.userId!,
        format: format || 'MP4',
        storageType: storageType || 'LOCAL',
        status: scheduledAt ? 'SCHEDULED' : 'PENDING',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: { stream: { select: { name: true, protocol: true } } },
    });

    res.status(201).json(recording);
  } catch (error) {
    console.error('Create recording error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const stopRecording = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recording = await prisma.recording.findFirst({
      where: { id: req.params.id as string, userId: req.userId, status: 'RECORDING' },
    });

    if (!recording) {
      res.status(404).json({ error: 'Gravação não encontrada ou não está em andamento' });
      return;
    }

    const updated = await prisma.recording.update({
      where: { id: req.params.id as string },
      data: { status: 'COMPLETED', endedAt: new Date() },
    });

    res.json(updated);
  } catch (error) {
    console.error('Stop recording error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteRecording = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recording = await prisma.recording.findFirst({
      where: { id: req.params.id as string, userId: req.userId },
    });

    if (!recording) {
      res.status(404).json({ error: 'Gravação não encontrada' });
      return;
    }

    await prisma.recording.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Gravação removida com sucesso' });
  } catch (error) {
    console.error('Delete recording error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
