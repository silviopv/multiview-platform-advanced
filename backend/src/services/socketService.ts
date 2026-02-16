import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { connectedClients } from './metricsService';
import prisma from '../config/database';

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin.split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; role: string };
      (socket as any).userId = decoded.userId;
      (socket as any).userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`Client connected: ${socket.id} (User: ${userId})`);
    connectedClients.inc();

    socket.join(`user:${userId}`);

    socket.on('stream:status', async (data: { streamId: string; status: 'online' | 'offline'; metadata?: any }) => {
      try {
        const { streamId, status, metadata } = data;

        io.to(`user:${userId}`).emit('stream:statusUpdate', { streamId, status, metadata });

        await prisma.notification.create({
          data: {
            type: status === 'online' ? 'STREAM_ONLINE' : 'STREAM_OFFLINE',
            message: `Stream ${status === 'online' ? 'ficou online' : 'ficou offline'}`,
            streamId,
            userId,
            metadata: metadata || {},
          },
        });

        io.to(`user:${userId}`).emit('notification:new', {
          type: status === 'online' ? 'STREAM_ONLINE' : 'STREAM_OFFLINE',
          streamId,
        });
      } catch (error) {
        console.error('Stream status error:', error);
      }
    });

    socket.on('stream:metrics', (data: { streamId: string; bitrate: number; fps: number; resolution: string }) => {
      io.to(`user:${userId}`).emit('stream:metricsUpdate', data);
    });

    socket.on('recording:status', (data: { recordingId: string; status: string; progress?: number }) => {
      io.to(`user:${userId}`).emit('recording:statusUpdate', data);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      connectedClients.dec();
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};
