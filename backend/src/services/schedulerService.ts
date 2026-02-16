import cron from 'node-cron';
import prisma from '../config/database';
import { startRecording } from './recordingService';

export const initScheduler = (): void => {
  // Check for scheduled recordings every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const scheduledRecordings = await prisma.recording.findMany({
        where: {
          status: 'SCHEDULED',
          scheduledAt: {
            lte: now,
          },
        },
      });

      for (const recording of scheduledRecordings) {
        console.log(`Starting scheduled recording: ${recording.id}`);
        try {
          await startRecording(recording.id);
        } catch (error) {
          console.error(`Failed to start scheduled recording ${recording.id}:`, error);
          await prisma.recording.update({
            where: { id: recording.id },
            data: {
              status: 'FAILED',
              error: `Failed to start: ${error}`,
            },
          });
        }
      }
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  });

  // Clean up old refresh tokens every day at 3 AM
  cron.schedule('0 3 * * *', async () => {
    try {
      const result = await prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
      console.log(`Cleaned up ${result.count} expired refresh tokens`);
    } catch (error) {
      console.error('Token cleanup error:', error);
    }
  });

  console.log('📅 Scheduler initialized');
};
