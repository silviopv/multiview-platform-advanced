import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Recording } from '../types';
import { recordingsAPI } from '../services/api';
import { useStreamStore } from '../stores/streamStore';
import { Video, Plus, Square, Trash2, Calendar, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecordingsPage() {
  const { t } = useTranslation();
  const { streams, loadStreams } = useStreamStore();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ streamId: '', format: 'MP4', storageType: 'LOCAL', scheduledAt: '' });

  const loadRecordings = async () => {
    try {
      const { data } = await recordingsAPI.getAll();
      setRecordings(data.recordings);
    } catch {
      toast.error('Erro ao carregar gravações');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStreams();
    loadRecordings();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await recordingsAPI.create({
        streamId: form.streamId,
        format: form.format,
        storageType: form.storageType,
        scheduledAt: form.scheduledAt || undefined,
      });
      setRecordings([data, ...recordings]);
      setShowModal(false);
      toast.success('Gravação criada!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao criar gravação');
    }
  };

  const handleStop = async (id: string) => {
    try {
      await recordingsAPI.stop(id);
      loadRecordings();
      toast.success('Gravação parada!');
    } catch {
      toast.error('Erro ao parar gravação');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    try {
      await recordingsAPI.delete(id);
      setRecordings(recordings.filter(r => r.id !== id));
      toast.success('Gravação removida!');
    } catch {
      toast.error('Erro ao remover gravação');
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-slate-500/20 text-slate-400',
    SCHEDULED: 'bg-blue-500/20 text-blue-400',
    RECORDING: 'bg-red-500/20 text-red-400',
    COMPLETED: 'bg-emerald-500/20 text-emerald-400',
    FAILED: 'bg-amber-500/20 text-amber-400',
    CANCELLED: 'bg-slate-500/20 text-slate-400',
  };

  const statusLabels: Record<string, string> = {
    PENDING: t('recordings.pending'),
    SCHEDULED: t('recordings.scheduled'),
    RECORDING: t('recordings.recording'),
    COMPLETED: t('recordings.completed'),
    FAILED: t('recordings.failed'),
    CANCELLED: 'Cancelada',
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('recordings.title')}</h1>
          <p className="text-slate-400 mt-1">{recordings.length} gravações</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> {t('recordings.start')}
        </button>
      </div>

      {/* Recordings Table */}
      {recordings.length === 0 ? (
        <div className="card text-center py-16">
          <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-400 mb-2">Nenhuma gravação</h2>
          <p className="text-slate-500">Inicie uma gravação para começar</p>
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">Stream</th>
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">{t('recordings.format')}</th>
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">{t('recordings.status')}</th>
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">{t('recordings.duration')}</th>
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">{t('recordings.size')}</th>
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">{t('recordings.storage')}</th>
                <th className="text-right text-sm font-medium text-slate-400 px-6 py-4">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((rec) => (
                <tr key={rec.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {rec.status === 'RECORDING' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                      <span className="text-white font-medium">{rec.stream?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{rec.format}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${statusColors[rec.status]}`}>{statusLabels[rec.status]}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{formatDuration(rec.duration)}</td>
                  <td className="px-6 py-4 text-slate-300">{formatSize(rec.fileSize)}</td>
                  <td className="px-6 py-4 text-slate-300">{rec.storageType}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {rec.status === 'RECORDING' && (
                        <button onClick={() => handleStop(rec.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title={t('recordings.stop')}>
                          <Square className="w-4 h-4" />
                        </button>
                      )}
                      {rec.status === 'COMPLETED' && rec.storageUrl && (
                        <a href={rec.storageUrl} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => handleDelete(rec.id)} className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Nova Gravação</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Stream</label>
                <select value={form.streamId} onChange={(e) => setForm({ ...form, streamId: e.target.value })} className="input-field" required>
                  <option value="">Selecione uma stream</option>
                  {streams.map(s => <option key={s.id} value={s.id}>{s.name} ({s.protocol})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('recordings.format')}</label>
                  <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="input-field">
                    <option value="MP4">MP4</option>
                    <option value="MKV">MKV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('recordings.storage')}</label>
                  <select value={form.storageType} onChange={(e) => setForm({ ...form, storageType: e.target.value })} className="input-field">
                    <option value="LOCAL">Local</option>
                    <option value="S3">Amazon S3</option>
                    <option value="GOOGLE_DRIVE">Google Drive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1" /> Agendar (opcional)
                </label>
                <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button type="submit" className="btn-primary flex-1">{t('recordings.start')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
