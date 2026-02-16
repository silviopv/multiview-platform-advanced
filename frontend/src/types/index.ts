export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  language: string;
  avatar?: string;
  createdAt: string;
}

export interface Stream {
  id: string;
  name: string;
  url: string;
  protocol: Protocol;
  isActive: boolean;
  userId: string;
  order: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type Protocol = 'SRT' | 'RTMP' | 'RTMPS' | 'RTSP' | 'HLS';

export interface Layout {
  id: string;
  name: string;
  grid: string;
  userId: string;
  isDefault: boolean;
  config?: any;
  items: LayoutItem[];
  createdAt: string;
  updatedAt: string;
}

export interface LayoutItem {
  id: string;
  layoutId: string;
  streamId?: string;
  stream?: Stream;
  position: number;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  audioOn: boolean;
}

export interface Recording {
  id: string;
  streamId: string;
  stream?: { name: string; protocol: Protocol };
  userId: string;
  format: 'MP4' | 'MKV';
  status: RecordingStatus;
  filePath?: string;
  fileSize?: number;
  duration?: number;
  storageType: 'LOCAL' | 'S3' | 'GOOGLE_DRIVE';
  storageUrl?: string;
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  error?: string;
  createdAt: string;
}

export type RecordingStatus = 'PENDING' | 'SCHEDULED' | 'RECORDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  streamId?: string;
  stream?: { name: string };
  userId: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

export type NotificationType = 'STREAM_ONLINE' | 'STREAM_OFFLINE' | 'RECORDING_STARTED' | 'RECORDING_COMPLETED' | 'RECORDING_FAILED' | 'SYSTEM';

export interface StreamMetrics {
  streamId: string;
  bitrate: number;
  fps: number;
  resolution: string;
  status: 'online' | 'offline' | 'connecting' | 'error';
}

export type GridPreset = '1x1' | '2x2' | '3x3' | '4x4' | '2x1' | '1x2' | '3x2' | '2x3';
