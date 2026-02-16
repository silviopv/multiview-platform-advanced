import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';
import prisma from '../config/database';
import { config } from '../config';
import { emitToUser } from './socketService';
import { activeRecordings } from './metricsService';

interface ActiveRecording {
  process: ChildProcess;
  recordingId: string;
  userId: string;
  startTime: Date;
}

const activeRecordingProcesses = new Map<string, ActiveRecording>();

export const startRecording = async (recordingId: string): Promise<void> => {
  const recording = await prisma.recording.findUnique({
    where: { id: recordingId },
    include: { stream: true },
  });

  if (!recording || !recording.stream) {
    throw new Error('Recording or stream not found');
  }

  const recordingsDir = config.recordings.path;
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const extension = recording.format === 'MKV' ? 'mkv' : 'mp4';
  const filename = `${recording.stream.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${extension}`;
  const filePath = path.join(recordingsDir, filename);

  // Build FFmpeg command based on protocol
  const ffmpegArgs = buildFFmpegArgs(recording.stream.url, recording.stream.protocol, filePath, recording.format);

  console.log(`Starting recording: ffmpeg ${ffmpegArgs.join(' ')}`);

  const ffmpegProcess = spawn('ffmpeg', ffmpegArgs, {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  activeRecordingProcesses.set(recordingId, {
    process: ffmpegProcess,
    recordingId,
    userId: recording.userId,
    startTime: new Date(),
  });

  activeRecordings.inc();

  await prisma.recording.update({
    where: { id: recordingId },
    data: {
      status: 'RECORDING',
      startedAt: new Date(),
      filePath,
    },
  });

  emitToUser(recording.userId, 'recording:statusUpdate', {
    recordingId,
    status: 'RECORDING',
  });

  // Create notification
  await prisma.notification.create({
    data: {
      type: 'RECORDING_STARTED',
      message: `Gravação iniciada: ${recording.stream.name}`,
      streamId: recording.stream.id,
      userId: recording.userId,
    },
  });

  emitToUser(recording.userId, 'notification:new', {
    type: 'RECORDING_STARTED',
    streamId: recording.stream.id,
  });

  ffmpegProcess.stderr?.on('data', (data: Buffer) => {
    const output = data.toString();
    // Parse progress from FFmpeg output
    const timeMatch = output.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
    if (timeMatch) {
      const timeParts = timeMatch[1].split(':');
      const seconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseFloat(timeParts[2]);
      emitToUser(recording.userId, 'recording:progress', {
        recordingId,
        duration: Math.floor(seconds),
      });
    }
  });

  ffmpegProcess.on('close', async (code) => {
    activeRecordingProcesses.delete(recordingId);
    activeRecordings.dec();

    const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    const endTime = new Date();
    const active = activeRecordingProcesses.get(recordingId);
    const duration = active ? Math.floor((endTime.getTime() - active.startTime.getTime()) / 1000) : 0;

    if (code === 0 || code === 255) {
      await prisma.recording.update({
        where: { id: recordingId },
        data: {
          status: 'COMPLETED',
          endedAt: endTime,
          fileSize: stats ? BigInt(stats.size) : null,
          duration,
        },
      });

      await prisma.notification.create({
        data: {
          type: 'RECORDING_COMPLETED',
          message: `Gravação concluída: ${recording.stream!.name}`,
          streamId: recording.stream!.id,
          userId: recording.userId,
        },
      });
    } else {
      await prisma.recording.update({
        where: { id: recordingId },
        data: {
          status: 'FAILED',
          endedAt: endTime,
          error: `FFmpeg exited with code ${code}`,
        },
      });

      await prisma.notification.create({
        data: {
          type: 'RECORDING_FAILED',
          message: `Gravação falhou: ${recording.stream!.name}`,
          streamId: recording.stream!.id,
          userId: recording.userId,
        },
      });
    }

    emitToUser(recording.userId, 'recording:statusUpdate', {
      recordingId,
      status: code === 0 || code === 255 ? 'COMPLETED' : 'FAILED',
    });
  });

  ffmpegProcess.on('error', async (error) => {
    console.error(`FFmpeg error for recording ${recordingId}:`, error);
    activeRecordingProcesses.delete(recordingId);
    activeRecordings.dec();

    await prisma.recording.update({
      where: { id: recordingId },
      data: {
        status: 'FAILED',
        endedAt: new Date(),
        error: error.message,
      },
    });
  });
};

export const stopRecording = async (recordingId: string): Promise<void> => {
  const active = activeRecordingProcesses.get(recordingId);
  if (!active) {
    throw new Error('Recording not active');
  }

  // Send 'q' to FFmpeg to gracefully stop
  active.process.stdin?.write('q');

  // Force kill after 10 seconds if not stopped
  setTimeout(() => {
    if (activeRecordingProcesses.has(recordingId)) {
      active.process.kill('SIGKILL');
    }
  }, 10000);
};

export const getActiveRecordings = (): string[] => {
  return Array.from(activeRecordingProcesses.keys());
};

function buildFFmpegArgs(url: string, protocol: string, outputPath: string, format: string): string[] {
  const args: string[] = ['-y'];

  // Input options based on protocol
  switch (protocol) {
    case 'SRT':
      args.push('-i', url);
      break;
    case 'RTMP':
    case 'RTMPS':
      args.push('-i', url);
      break;
    case 'RTSP':
      args.push('-rtsp_transport', 'tcp', '-i', url);
      break;
    case 'HLS':
      args.push(
        '-headers', 'User-Agent: Mozilla/5.0',
        '-i', url
      );
      break;
    default:
      args.push('-i', url);
  }

  // Output options
  args.push(
    '-c', 'copy',           // Copy streams without re-encoding
    '-movflags', '+faststart', // Enable fast start for MP4
    '-f', format === 'MKV' ? 'matroska' : 'mp4',
    outputPath
  );

  return args;
}
