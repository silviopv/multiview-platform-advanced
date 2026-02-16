import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Monitor, Radio, Video, BarChart3, Globe, Bell, Zap, Shield, Layers, ChevronRight, Play, Check } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    { icon: <Layers className="w-8 h-8" />, title: t('landing.feature1'), desc: t('landing.feature1Desc') },
    { icon: <Radio className="w-8 h-8" />, title: t('landing.feature2'), desc: t('landing.feature2Desc') },
    { icon: <Video className="w-8 h-8" />, title: t('landing.feature3'), desc: t('landing.feature3Desc') },
    { icon: <BarChart3 className="w-8 h-8" />, title: t('landing.feature4'), desc: t('landing.feature4Desc') },
    { icon: <Globe className="w-8 h-8" />, title: t('landing.feature5'), desc: t('landing.feature5Desc') },
    { icon: <Bell className="w-8 h-8" />, title: t('landing.feature6'), desc: t('landing.feature6Desc') },
  ];

  const plans = [
    { name: t('landing.free'), price: 'R$ 0', period: '/mês', features: ['4 streams simultâneas', 'Layout 2x2', '1 GB gravação', 'Suporte comunidade'], highlighted: false },
    { name: t('landing.pro'), price: 'R$ 49', period: '/mês', features: ['16 streams simultâneas', 'Layouts customizados', '50 GB gravação', 'Google Drive / S3', 'Suporte prioritário', 'API acesso'], highlighted: true },
    { name: t('landing.enterprise'), price: 'R$ 199', period: '/mês', features: ['Streams ilimitadas', 'Layouts ilimitados', '500 GB gravação', 'Todas integrações', 'Suporte 24/7', 'SLA 99.9%', 'White-label'], highlighted: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MultiView <span className="text-indigo-400">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Recursos</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Planos</a>
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">{t('auth.login')}</Link>
            <Link to="/register" className="btn-primary flex items-center gap-2">
              {t('landing.cta')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-400">Plataforma de Monitoramento Profissional</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t('landing.hero').split(' ').map((word, i) =>
              i >= 3 && i <= 5 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{word} </span> : word + ' '
            )}
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
            {t('landing.heroSub')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
              <Play className="w-5 h-5" /> {t('landing.cta')}
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-3">
              Ver Recursos
            </a>
          </div>

          {/* Preview Grid */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 max-w-5xl mx-auto shadow-2xl shadow-indigo-500/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5" />
                    <Monitor className="w-8 h-8 text-slate-600" />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-slate-500">Stream {i}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">1920x1080</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">{t('landing.features')}</h2>
            <p className="text-slate-400 text-lg">Tudo que você precisa para monitorar suas transmissões</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="card hover:border-indigo-500/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Protocolos Suportados</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {['SRT', 'RTMP', 'RTMPS', 'RTSP', 'HLS'].map(p => (
              <div key={p} className="bg-slate-800 border border-slate-700 rounded-xl px-8 py-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span className="text-lg font-semibold text-white">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">{t('landing.pricing')}</h2>
            <p className="text-slate-400 text-lg">Escolha o plano ideal para sua necessidade</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`card relative ${plan.highlighted ? 'border-indigo-500 ring-2 ring-indigo-500/20' : ''}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`w-full block text-center py-3 rounded-lg font-medium transition-all ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}>
                  {t('landing.cta')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">MultiView Pro</span>
          </div>
          <p className="text-slate-500 text-sm">&copy; 2025 MultiView Pro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
