import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import {
  Monitor, LayoutGrid, Radio, Video, Bell, Settings, LogOut,
  Menu, X, ChevronDown, Globe, User
} from 'lucide-react';

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: <LayoutGrid className="w-5 h-5" />, label: t('nav.dashboard') },
    { path: '/dashboard/multiview', icon: <Monitor className="w-5 h-5" />, label: t('nav.multiview') },
    { path: '/dashboard/streams', icon: <Radio className="w-5 h-5" />, label: t('nav.streams') },
    { path: '/dashboard/recordings', icon: <Video className="w-5 h-5" />, label: t('nav.recordings') },
    { path: '/dashboard/notifications', icon: <Bell className="w-5 h-5" />, label: t('nav.notifications') },
    { path: '/dashboard/settings', icon: <Settings className="w-5 h-5" />, label: t('nav.settings') },
  ];

  const languages = [
    { code: 'pt-BR', label: 'Português' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setLangOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <span className="text-lg font-bold text-white">MultiView <span className="text-indigo-400">Pro</span></span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Language Selector */}
              <div className="relative">
                <button onClick={() => { setLangOpen(!langOpen); setProfileOpen(false); }} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                    {languages.map((lang) => (
                      <button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${i18n.language === lang.code ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300 hover:bg-slate-700'}`}>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <Link to="/dashboard/notifications" className="relative text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950" />
              </Link>

              {/* Profile */}
              <div className="relative">
                <button onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); }} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-300">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <Link to="/dashboard/settings" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700">
                      {t('nav.settings')}
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
