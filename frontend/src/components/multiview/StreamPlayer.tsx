import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import type { Stream, StreamMetrics } from '../../types';
import { useStreamStore } from '../../stores/streamStore';
import { Maximize2, Minimize2, Volume2, VolumeX, Camera, RefreshCw, AlertTriangle, WifiOff } from 'lucide-react';

interface StreamPlayerProps {
  stream: Stream;
  isFullscreen: boolean;
  isAudioActive: boolean;
  onFullscreen: () => void;
  onAudioSelect: () => void;
  showOverlay?: boolean;
}

export default function StreamPlayer({ stream, isFullscreen, isAudioActive, onFullscreen, onAudioSelect, showOverlay = true }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<'connecting' | 'online' | 'offline' | 'error'>('connecting');
  const [metrics, setMetrics] = useState<Partial<StreamMetrics>>({});
  const [vuLevel, setVuLevel] = useState(0);
  const [reconnectCount, setReconnectCount] = useState(0);
  const { updateMetrics } = useStreamStore();

  const MAX_RECONNECT = 50;
  const RECONNECT_DELAY = 3000;

  const destroyPlayer = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const initPlayer = useCallback(() => {
    if (!videoRef.current || !stream.url) return;
    destroyPlayer();
    setStatus('connecting');

    const video = videoRef.current;

    if (stream.protocol === 'HLS' || stream.url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          startFragPrefetch: true,
          testBandwidth: true,
        });

        hls.loadSource(stream.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
          setStatus('online');
          setReconnectCount(0);
        });

        hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
          const level = hls.levels[data.level];
          if (level) {
            const newMetrics = {
              resolution: `${level.width}x${level.height}`,
              bitrate: Math.round(level.bitrate / 1000),
              fps: level.attrs?.['FRAME-RATE'] ? parseFloat(level.attrs['FRAME-RATE']) : 0,
            };
            setMetrics(newMetrics);
            updateMetrics(stream.id, { ...newMetrics, status: 'online' });
          }
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setStatus('error');
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (reconnectCount < MAX_RECONNECT) {
                  reconnectTimerRef.current = setTimeout(() => {
                    setReconnectCount(prev => prev + 1);
                    hls.startLoad();
                  }, RECONNECT_DELAY);
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                destroyPlayer();
                if (reconnectCount < MAX_RECONNECT) {
                  reconnectTimerRef.current = setTimeout(() => {
                    setReconnectCount(prev => prev + 1);
                    initPlayer();
                  }, RECONNECT_DELAY);
                }
                break;
            }
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream.url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
          setStatus('online');
        });
      }
    } else {
      // For non-HLS protocols, try direct playback
      video.src = stream.url;
      video.addEventListener('loadeddata', () => {
        setStatus('online');
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setStatus('error');
        if (reconnectCount < MAX_RECONNECT) {
          reconnectTimerRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            initPlayer();
          }, RECONNECT_DELAY);
        }
      });
    }
  }, [stream.url, stream.protocol, stream.id, reconnectCount, destroyPlayer, updateMetrics]);

  useEffect(() => {
    initPlayer();
    return destroyPlayer;
  }, [stream.url]);

  // VU Meter simulation based on audio
  useEffect(() => {
    if (!isAudioActive || !videoRef.current) {
      setVuLevel(0);
      return;
    }

    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && status === 'online') {
        setVuLevel(Math.random() * 80 + 20);
      } else {
        setVuLevel(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isAudioActive, status]);

  // Audio control
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isAudioActive;
      videoRef.current.volume = isAudioActive ? 1 : 0;
    }
  }, [isAudioActive]);

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const link = document.createElement('a');
      link.download = `snapshot-${stream.name}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleReconnect = () => {
    setReconnectCount(0);
    initPlayer();
  };

  const vuColor = vuLevel > 80 ? 'bg-red-500' : vuLevel > 50 ? 'bg-yellow-500' : 'bg-emerald-500';

  return (
    <div className={`stream-tile ${isFullscreen ? 'stream-tile-fullscreen' : 'aspect-video'}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        playsInline
        muted={!isAudioActive}
        autoPlay
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Status Overlay */}
      {status !== 'online' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          {status === 'connecting' && (
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-300">Conectando...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">Reconectando... ({reconnectCount})</p>
              <button onClick={handleReconnect} className="mt-2 text-xs text-indigo-400 hover:text-indigo-300">
                Forçar reconexão
              </button>
            </div>
          )}
          {status === 'offline' && (
            <div className="text-center">
              <WifiOff className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">Stream offline</p>
            </div>
          )}
        </div>
      )}

      {/* Top Info Bar */}
      {showOverlay && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : status === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-medium text-white truncate max-w-[120px]">{stream.name}</span>
              <span className="badge badge-protocol text-[10px]">{stream.protocol}</span>
            </div>
            <div className="flex items-center gap-1">
              {metrics.bitrate && (
                <span className="text-[10px] text-slate-300 bg-black/50 px-1.5 py-0.5 rounded">
                  {metrics.bitrate}kbps
                </span>
              )}
              {metrics.resolution && (
                <span className="text-[10px] text-slate-300 bg-black/50 px-1.5 py-0.5 rounded">
                  {metrics.resolution}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VU Meter */}
      {isAudioActive && showOverlay && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-24 bg-slate-700/50 rounded-full overflow-hidden flex flex-col-reverse">
          <div className={`${vuColor} rounded-full transition-all duration-100`} style={{ height: `${vuLevel}%` }} />
        </div>
      )}

      {/* Bottom Controls */}
      {showOverlay && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button onClick={onAudioSelect} className={`p-1.5 rounded transition-colors ${isAudioActive ? 'bg-indigo-500 text-white' : 'bg-black/50 text-slate-300 hover:text-white'}`}>
                {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button onClick={takeSnapshot} className="p-1.5 rounded bg-black/50 text-slate-300 hover:text-white transition-colors">
                <Camera className="w-4 h-4" />
              </button>
              <button onClick={handleReconnect} className="p-1.5 rounded bg-black/50 text-slate-300 hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <button onClick={onFullscreen} className="p-1.5 rounded bg-black/50 text-slate-300 hover:text-white transition-colors">
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
