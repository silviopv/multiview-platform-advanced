import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-BR': {
    translation: {
      app: { name: 'MultiView Pro', tagline: 'Plataforma Avançada de Monitoramento de Streams' },
      nav: { dashboard: 'Dashboard', multiview: 'Multiview', streams: 'Streams', recordings: 'Gravações', notifications: 'Notificações', settings: 'Configurações', logout: 'Sair' },
      auth: { login: 'Entrar', register: 'Cadastrar', email: 'Email', password: 'Senha', name: 'Nome', confirmPassword: 'Confirmar Senha', forgotPassword: 'Esqueceu a senha?', noAccount: 'Não tem conta?', hasAccount: 'Já tem conta?', loginSuccess: 'Login realizado com sucesso!', registerSuccess: 'Cadastro realizado com sucesso!' },
      landing: { hero: 'Monitore todas as suas streams em um só lugar', heroSub: 'Plataforma profissional de multiview com suporte a SRT, RTMP, RTSP e HLS. Grave, monitore e gerencie suas transmissões com facilidade.', cta: 'Começar Agora', features: 'Recursos', feature1: 'Grid Multiview', feature1Desc: 'Visualize até 16 streams simultaneamente com layouts personalizáveis', feature2: 'Multi-Protocolo', feature2Desc: 'Suporte completo a SRT, RTMP, RTMPS, RTSP e HLS', feature3: 'Gravação FFmpeg', feature3Desc: 'Grave suas streams em MP4/MKV com agendamento e upload automático', feature4: 'Monitoramento', feature4Desc: 'Métricas em tempo real com bitrate, resolução e alertas', feature5: 'Multi-Idioma', feature5Desc: 'Interface disponível em Português, English e Español', feature6: 'Notificações', feature6Desc: 'Alertas em tempo real quando streams ficam online ou offline', pricing: 'Planos', free: 'Gratuito', pro: 'Profissional', enterprise: 'Empresarial' },
      streams: { title: 'Gerenciar Streams', add: 'Adicionar Stream', name: 'Nome', url: 'URL da Stream', protocol: 'Protocolo', tags: 'Tags', active: 'Ativa', inactive: 'Inativa', noStreams: 'Nenhuma stream cadastrada', deleteConfirm: 'Tem certeza que deseja remover esta stream?' },
      multiview: { title: 'Multiview', layout: 'Layout', audio: 'Áudio', fullscreen: 'Tela Cheia', snapshot: 'Captura', reconnect: 'Reconectar', bitrate: 'Bitrate', resolution: 'Resolução', fps: 'FPS', online: 'Online', offline: 'Offline', connecting: 'Conectando' },
      recordings: { title: 'Gravações', start: 'Iniciar Gravação', stop: 'Parar', schedule: 'Agendar', format: 'Formato', storage: 'Armazenamento', status: 'Status', duration: 'Duração', size: 'Tamanho', pending: 'Pendente', recording: 'Gravando', completed: 'Concluída', failed: 'Falhou', scheduled: 'Agendada' },
      notifications: { title: 'Notificações', markAllRead: 'Marcar todas como lidas', clearAll: 'Limpar todas', noNotifications: 'Nenhuma notificação', streamOnline: 'Stream ficou online', streamOffline: 'Stream ficou offline' },
      common: { save: 'Salvar', cancel: 'Cancelar', delete: 'Excluir', edit: 'Editar', close: 'Fechar', loading: 'Carregando...', error: 'Erro', success: 'Sucesso', confirm: 'Confirmar', search: 'Buscar', filter: 'Filtrar', actions: 'Ações', back: 'Voltar' },
    },
  },
  en: {
    translation: {
      app: { name: 'MultiView Pro', tagline: 'Advanced Stream Monitoring Platform' },
      nav: { dashboard: 'Dashboard', multiview: 'Multiview', streams: 'Streams', recordings: 'Recordings', notifications: 'Notifications', settings: 'Settings', logout: 'Logout' },
      auth: { login: 'Login', register: 'Register', email: 'Email', password: 'Password', name: 'Name', confirmPassword: 'Confirm Password', forgotPassword: 'Forgot password?', noAccount: "Don't have an account?", hasAccount: 'Already have an account?', loginSuccess: 'Login successful!', registerSuccess: 'Registration successful!' },
      landing: { hero: 'Monitor all your streams in one place', heroSub: 'Professional multiview platform with SRT, RTMP, RTSP and HLS support. Record, monitor and manage your broadcasts with ease.', cta: 'Get Started', features: 'Features', feature1: 'Multiview Grid', feature1Desc: 'View up to 16 streams simultaneously with customizable layouts', feature2: 'Multi-Protocol', feature2Desc: 'Full support for SRT, RTMP, RTMPS, RTSP and HLS', feature3: 'FFmpeg Recording', feature3Desc: 'Record your streams in MP4/MKV with scheduling and auto-upload', feature4: 'Monitoring', feature4Desc: 'Real-time metrics with bitrate, resolution and alerts', feature5: 'Multi-Language', feature5Desc: 'Interface available in Portuguese, English and Spanish', feature6: 'Notifications', feature6Desc: 'Real-time alerts when streams go online or offline', pricing: 'Plans', free: 'Free', pro: 'Professional', enterprise: 'Enterprise' },
      streams: { title: 'Manage Streams', add: 'Add Stream', name: 'Name', url: 'Stream URL', protocol: 'Protocol', tags: 'Tags', active: 'Active', inactive: 'Inactive', noStreams: 'No streams registered', deleteConfirm: 'Are you sure you want to remove this stream?' },
      multiview: { title: 'Multiview', layout: 'Layout', audio: 'Audio', fullscreen: 'Fullscreen', snapshot: 'Snapshot', reconnect: 'Reconnect', bitrate: 'Bitrate', resolution: 'Resolution', fps: 'FPS', online: 'Online', offline: 'Offline', connecting: 'Connecting' },
      recordings: { title: 'Recordings', start: 'Start Recording', stop: 'Stop', schedule: 'Schedule', format: 'Format', storage: 'Storage', status: 'Status', duration: 'Duration', size: 'Size', pending: 'Pending', recording: 'Recording', completed: 'Completed', failed: 'Failed', scheduled: 'Scheduled' },
      notifications: { title: 'Notifications', markAllRead: 'Mark all as read', clearAll: 'Clear all', noNotifications: 'No notifications', streamOnline: 'Stream went online', streamOffline: 'Stream went offline' },
      common: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', close: 'Close', loading: 'Loading...', error: 'Error', success: 'Success', confirm: 'Confirm', search: 'Search', filter: 'Filter', actions: 'Actions', back: 'Back' },
    },
  },
  es: {
    translation: {
      app: { name: 'MultiView Pro', tagline: 'Plataforma Avanzada de Monitoreo de Streams' },
      nav: { dashboard: 'Panel', multiview: 'Multiview', streams: 'Streams', recordings: 'Grabaciones', notifications: 'Notificaciones', settings: 'Configuración', logout: 'Salir' },
      auth: { login: 'Iniciar Sesión', register: 'Registrarse', email: 'Email', password: 'Contraseña', name: 'Nombre', confirmPassword: 'Confirmar Contraseña', forgotPassword: '¿Olvidaste tu contraseña?', noAccount: '¿No tienes cuenta?', hasAccount: '¿Ya tienes cuenta?', loginSuccess: '¡Inicio de sesión exitoso!', registerSuccess: '¡Registro exitoso!' },
      landing: { hero: 'Monitorea todas tus streams en un solo lugar', heroSub: 'Plataforma profesional de multiview con soporte SRT, RTMP, RTSP y HLS. Graba, monitorea y gestiona tus transmisiones con facilidad.', cta: 'Comenzar Ahora', features: 'Características', feature1: 'Grid Multiview', feature1Desc: 'Visualiza hasta 16 streams simultáneamente con layouts personalizables', feature2: 'Multi-Protocolo', feature2Desc: 'Soporte completo para SRT, RTMP, RTMPS, RTSP y HLS', feature3: 'Grabación FFmpeg', feature3Desc: 'Graba tus streams en MP4/MKV con programación y subida automática', feature4: 'Monitoreo', feature4Desc: 'Métricas en tiempo real con bitrate, resolución y alertas', feature5: 'Multi-Idioma', feature5Desc: 'Interfaz disponible en Portugués, English y Español', feature6: 'Notificaciones', feature6Desc: 'Alertas en tiempo real cuando los streams se conectan o desconectan', pricing: 'Planes', free: 'Gratuito', pro: 'Profesional', enterprise: 'Empresarial' },
      streams: { title: 'Gestionar Streams', add: 'Agregar Stream', name: 'Nombre', url: 'URL del Stream', protocol: 'Protocolo', tags: 'Etiquetas', active: 'Activo', inactive: 'Inactivo', noStreams: 'No hay streams registrados', deleteConfirm: '¿Estás seguro de que quieres eliminar este stream?' },
      multiview: { title: 'Multiview', layout: 'Layout', audio: 'Audio', fullscreen: 'Pantalla Completa', snapshot: 'Captura', reconnect: 'Reconectar', bitrate: 'Bitrate', resolution: 'Resolución', fps: 'FPS', online: 'En línea', offline: 'Fuera de línea', connecting: 'Conectando' },
      recordings: { title: 'Grabaciones', start: 'Iniciar Grabación', stop: 'Detener', schedule: 'Programar', format: 'Formato', storage: 'Almacenamiento', status: 'Estado', duration: 'Duración', size: 'Tamaño', pending: 'Pendiente', recording: 'Grabando', completed: 'Completada', failed: 'Fallida', scheduled: 'Programada' },
      notifications: { title: 'Notificaciones', markAllRead: 'Marcar todas como leídas', clearAll: 'Limpiar todas', noNotifications: 'Sin notificaciones', streamOnline: 'Stream se conectó', streamOffline: 'Stream se desconectó' },
      common: { save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', edit: 'Editar', close: 'Cerrar', loading: 'Cargando...', error: 'Error', success: 'Éxito', confirm: 'Confirmar', search: 'Buscar', filter: 'Filtrar', actions: 'Acciones', back: 'Volver' },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
});

export default i18n;
