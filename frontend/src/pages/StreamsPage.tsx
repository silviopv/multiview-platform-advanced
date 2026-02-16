import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStreamStore } from '../stores/streamStore';
import type { Protocol } from '../types';
import { Plus, Pencil, Trash2, Radio, X, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StreamsPage() {
  const { t } = useTranslation();
  const { streams, loadStreams, addStream, updateStream, removeStream } = useStreamStore();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', url: '', protocol: 'HLS' as Protocol, tags: '' });

  useEffect(() => { loadStreams(); }, []);

  const resetForm = () => {
    setForm({ name: '', url: '', protocol: 'HLS', tags: '' });
    setEditId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editId) {
        await updateStream(editId, data);
        toast.success('Stream atualizada!');
      } else {
        await addStream(data);
        toast.success('Stream adicionada!');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao salvar stream');
    }
  };

  const handleEdit = (stream: any) => {
    setForm({ name: stream.name, url: stream.url, protocol: stream.protocol, tags: stream.tags?.join(', ') || '' });
    setEditId(stream.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('streams.deleteConfirm'))) return;
    try {
      await removeStream(id);
      toast.success('Stream removida!');
    } catch {
      toast.error('Erro ao remover stream');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada!');
  };

  const protocols: Protocol[] = ['SRT', 'RTMP', 'RTMPS', 'RTSP', 'HLS'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('streams.title')}</h1>
          <p className="text-slate-400 mt-1">{streams.length} streams cadastradas</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> {t('streams.add')}
        </button>
      </div>

      {/* Streams List */}
      {streams.length === 0 ? (
        <div className="card text-center py-16">
          <Radio className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-400 mb-2">{t('streams.noStreams')}</h2>
          <p className="text-slate-500 mb-4">Adicione sua primeira stream para começar</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" /> {t('streams.add')}
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {streams.map((stream) => (
            <div key={stream.id} className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${stream.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate">{stream.name}</h3>
                    <span className="badge badge-protocol">{stream.protocol}</span>
                    <span className={`badge ${stream.isActive ? 'badge-online' : 'badge-offline'}`}>
                      {stream.isActive ? t('streams.active') : t('streams.inactive')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-400 truncate max-w-md">{stream.url}</p>
                    <button onClick={() => copyUrl(stream.url)} className="text-slate-500 hover:text-slate-300 flex-shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {stream.tags?.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {stream.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(stream)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(stream.id)} className="p-2 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">{editId ? 'Editar Stream' : 'Nova Stream'}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('streams.name')}</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Ex: Camera Principal" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('streams.url')}</label>
                <input type="text" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="input-field" placeholder="Ex: https://example.com/stream.m3u8" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('streams.protocol')}</label>
                <select value={form.protocol} onChange={(e) => setForm({ ...form, protocol: e.target.value as Protocol })} className="input-field">
                  {protocols.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t('streams.tags')}</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="tag1, tag2, tag3" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="btn-secondary flex-1">{t('common.cancel')}</button>
                <button type="submit" className="btn-primary flex-1">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
