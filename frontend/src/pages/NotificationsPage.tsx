import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Notification } from '../types';
import { notificationsAPI } from '../services/api';
import { Bell, CheckCheck, Trash2, Wifi, WifiOff, Video, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationsAPI.getAll();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      toast.error('Erro ao carregar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('Todas marcadas como lidas');
    } catch {
      toast.error('Erro');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Remover todas as notificações?')) return;
    try {
      await notificationsAPI.delete();
      setNotifications([]);
      setUnreadCount(0);
      toast.success('Notificações removidas');
    } catch {
      toast.error('Erro');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'STREAM_ONLINE': return <Wifi className="w-5 h-5 text-emerald-400" />;
      case 'STREAM_OFFLINE': return <WifiOff className="w-5 h-5 text-red-400" />;
      case 'RECORDING_STARTED': return <Video className="w-5 h-5 text-indigo-400" />;
      case 'RECORDING_COMPLETED': return <Video className="w-5 h-5 text-emerald-400" />;
      case 'RECORDING_FAILED': return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Agora';
    if (mins < 60) return `${mins}m atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('notifications.title')}</h1>
          <p className="text-slate-400 mt-1">{unreadCount} não lidas</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleMarkAllRead} className="btn-secondary flex items-center gap-2 text-sm">
            <CheckCheck className="w-4 h-4" /> {t('notifications.markAllRead')}
          </button>
          <button onClick={handleClearAll} className="btn-danger flex items-center gap-2 text-sm">
            <Trash2 className="w-4 h-4" /> {t('notifications.clearAll')}
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-16">
          <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-400">{t('notifications.noNotifications')}</h2>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div key={notif.id} className={`card flex items-start gap-4 py-4 ${!notif.isRead ? 'border-indigo-500/30 bg-indigo-500/5' : ''}`}>
              <div className="flex-shrink-0 mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notif.isRead ? 'text-slate-300' : 'text-white font-medium'}`}>
                  {notif.message}
                </p>
                {notif.stream && (
                  <p className="text-xs text-slate-500 mt-1">Stream: {notif.stream.name}</p>
                )}
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0">{formatTime(notif.createdAt)}</span>
              {!notif.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
