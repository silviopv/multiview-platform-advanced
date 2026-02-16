import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useStreamStore } from '../stores/streamStore';
import { Monitor, Radio, Video, Bell, Activity, ArrowUpRight, TrendingUp, Wifi } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { streams, loadStreams } = useStreamStore();
  const [stats, setStats] = useState({ totalStreams: 0, activeStreams: 0, recordings: 0, notifications: 0 });

  useEffect(() => {
    loadStreams();
  }, []);

  useEffect(() => {
    setStats({
      totalStreams: streams.length,
      activeStreams: streams.filter(s => s.isActive).length,
      recordings: 0,
      notifications: 0,
    });
  }, [streams]);

  const statCards = [
    { label: 'Total de Streams', value: stats.totalStreams, icon: <Radio className="w-6 h-6" />, color: 'from-indigo-500 to-indigo-600', link: '/dashboard/streams' },
    { label: 'Streams Ativas', value: stats.activeStreams, icon: <Wifi className="w-6 h-6" />, color: 'from-emerald-500 to-emerald-600', link: '/dashboard/multiview' },
    { label: 'Gravações', value: stats.recordings, icon: <Video className="w-6 h-6" />, color: 'from-amber-500 to-amber-600', link: '/dashboard/recordings' },
    { label: 'Notificações', value: stats.notifications, icon: <Bell className="w-6 h-6" />, color: 'from-rose-500 to-rose-600', link: '/dashboard/notifications' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Olá, {user?.name}!</h1>
          <p className="text-slate-400 mt-1">Bem-vindo ao seu painel de controle</p>
        </div>
        <Link to="/dashboard/multiview" className="btn-primary flex items-center gap-2">
          <Monitor className="w-5 h-5" /> Abrir Multiview
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link} className="card group hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Streams */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/dashboard/multiview" className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors">
              <Monitor className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <span className="text-sm text-slate-300">Multiview</span>
            </Link>
            <Link to="/dashboard/streams" className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors">
              <Radio className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <span className="text-sm text-slate-300">Nova Stream</span>
            </Link>
            <Link to="/dashboard/recordings" className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors">
              <Video className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <span className="text-sm text-slate-300">Gravações</span>
            </Link>
            <Link to="/dashboard/settings" className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-4 text-center transition-colors">
              <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <span className="text-sm text-slate-300">Métricas</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-indigo-400" /> Streams Recentes
          </h2>
          {streams.length === 0 ? (
            <div className="text-center py-8">
              <Radio className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Nenhuma stream cadastrada</p>
              <Link to="/dashboard/streams" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">Adicionar primeira stream</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {streams.slice(0, 5).map((stream) => (
                <div key={stream.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${stream.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{stream.name}</p>
                      <p className="text-xs text-slate-400">{stream.protocol}</p>
                    </div>
                  </div>
                  <span className={`badge ${stream.isActive ? 'badge-online' : 'badge-offline'}`}>
                    {stream.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
