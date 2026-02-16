import { create } from 'zustand';
import type { Stream, StreamMetrics, GridPreset } from '../types';
import { streamsAPI } from '../services/api';

interface StreamState {
  streams: Stream[];
  metrics: Record<string, StreamMetrics>;
  activeGrid: GridPreset;
  fullscreenStreamId: string | null;
  audioStreamId: string | null;
  isLoading: boolean;
  loadStreams: () => Promise<void>;
  addStream: (data: { name: string; url: string; protocol: string; tags?: string[] }) => Promise<void>;
  updateStream: (id: string, data: any) => Promise<void>;
  removeStream: (id: string) => Promise<void>;
  setGrid: (grid: GridPreset) => void;
  setFullscreen: (streamId: string | null) => void;
  setAudioStream: (streamId: string | null) => void;
  updateMetrics: (streamId: string, metrics: Partial<StreamMetrics>) => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  streams: [],
  metrics: {},
  activeGrid: '2x2',
  fullscreenStreamId: null,
  audioStreamId: null,
  isLoading: false,

  loadStreams: async () => {
    set({ isLoading: true });
    try {
      const { data } = await streamsAPI.getAll();
      set({ streams: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addStream: async (streamData) => {
    const { data } = await streamsAPI.create(streamData);
    set((state) => ({ streams: [...state.streams, data] }));
  },

  updateStream: async (id, streamData) => {
    const { data } = await streamsAPI.update(id, streamData);
    set((state) => ({
      streams: state.streams.map((s) => (s.id === id ? data : s)),
    }));
  },

  removeStream: async (id) => {
    await streamsAPI.delete(id);
    set((state) => ({
      streams: state.streams.filter((s) => s.id !== id),
    }));
  },

  setGrid: (grid) => set({ activeGrid: grid }),
  setFullscreen: (streamId) => set({ fullscreenStreamId: streamId }),
  setAudioStream: (streamId) => set({ audioStreamId: streamId }),

  updateMetrics: (streamId, metrics) =>
    set((state) => ({
      metrics: {
        ...state.metrics,
        [streamId]: { ...state.metrics[streamId], ...metrics, streamId },
      },
    })),
}));
