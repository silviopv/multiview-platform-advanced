import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStreamStore } from '../stores/streamStore';
import StreamPlayer from '../components/multiview/StreamPlayer';
import type { GridPreset } from '../types';
import { LayoutGrid, Monitor } from 'lucide-react';

const gridConfigs: Record<GridPreset, { cols: number; rows: number; label: string }> = {
  '1x1': { cols: 1, rows: 1, label: '1x1' },
  '2x1': { cols: 2, rows: 1, label: '2x1' },
  '1x2': { cols: 1, rows: 2, label: '1x2' },
  '2x2': { cols: 2, rows: 2, label: '2x2' },
  '3x2': { cols: 3, rows: 2, label: '3x2' },
  '2x3': { cols: 2, rows: 3, label: '2x3' },
  '3x3': { cols: 3, rows: 3, label: '3x3' },
  '4x4': { cols: 4, rows: 4, label: '4x4' },
};

export default function MultiviewPage() {
  const { t } = useTranslation();
  const { streams, activeGrid, fullscreenStreamId, audioStreamId, setGrid, setFullscreen, setAudioStream, loadStreams } = useStreamStore();

  useEffect(() => {
    loadStreams();
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.key) {
      case '1': setGrid('1x1'); break;
      case '2': setGrid('2x2'); break;
      case '3': setGrid('3x3'); break;
      case '4': setGrid('4x4'); break;
      case 'Escape': setFullscreen(null); break;
      case 'f': case 'F':
        if (e.ctrlKey || e.metaKey) return;
        // Toggle fullscreen of first stream
        if (fullscreenStreamId) {
          setFullscreen(null);
        }
        break;
      case 'm': case 'M':
        // Mute/unmute
        if (audioStreamId) {
          setAudioStream(null);
        }
        break;
    }

    // Number keys 5-9 for selecting audio on stream index
    const num = parseInt(e.key);
    if (num >= 5 && num <= 9 && streams[num - 5]) {
      setAudioStream(streams[num - 5].id);
    }
  }, [fullscreenStreamId, audioStreamId, streams, setGrid, setFullscreen, setAudioStream]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const config = gridConfigs[activeGrid];
  const maxSlots = config.cols * config.rows;
  const visibleStreams = streams.filter(s => s.isActive).slice(0, maxSlots);

  // Fullscreen mode
  if (fullscreenStreamId) {
    const stream = streams.find(s => s.id === fullscreenStreamId);
    if (stream) {
      return (
        <div className="fixed inset-0 z-50 bg-black">
          <StreamPlayer
            stream={stream}
            isFullscreen={true}
            isAudioActive={audioStreamId === stream.id}
            onFullscreen={() => setFullscreen(null)}
            onAudioSelect={() => setAudioStream(audioStreamId === stream.id ? null : stream.id)}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl font-bold text-white">{t('multiview.title')}</h1>
          <span className="text-sm text-slate-400">({visibleStreams.length}/{streams.filter(s => s.isActive).length} streams)</span>
        </div>

        {/* Grid Presets */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 mr-2">{t('multiview.layout')}:</span>
          {(Object.keys(gridConfigs) as GridPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => setGrid(preset)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeGrid === preset
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={`Layout ${preset} (Hotkey: ${preset === '1x1' ? '1' : preset === '2x2' ? '2' : preset === '3x3' ? '3' : preset === '4x4' ? '4' : preset})`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Hotkeys Info */}
      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="bg-slate-800 px-2 py-1 rounded">1-4: Layout</span>
        <span className="bg-slate-800 px-2 py-1 rounded">ESC: Sair fullscreen</span>
        <span className="bg-slate-800 px-2 py-1 rounded">M: Mute</span>
      </div>

      {/* Grid */}
      {visibleStreams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LayoutGrid className="w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-400 mb-2">Nenhuma stream ativa</h2>
          <p className="text-slate-500">Adicione e ative streams para visualizar no multiview</p>
        </div>
      ) : (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            gridTemplateRows: `repeat(${config.rows}, 1fr)`,
            height: `calc(100vh - 220px)`,
          }}
        >
          {Array.from({ length: maxSlots }).map((_, index) => {
            const stream = visibleStreams[index];
            if (!stream) {
              return (
                <div key={`empty-${index}`} className="stream-tile aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="w-8 h-8 text-slate-700 mx-auto mb-1" />
                    <p className="text-xs text-slate-600">Slot {index + 1}</p>
                  </div>
                </div>
              );
            }
            return (
              <StreamPlayer
                key={stream.id}
                stream={stream}
                isFullscreen={false}
                isAudioActive={audioStreamId === stream.id}
                onFullscreen={() => setFullscreen(stream.id)}
                onAudioSelect={() => setAudioStream(audioStreamId === stream.id ? null : stream.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
