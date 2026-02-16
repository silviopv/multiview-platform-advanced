import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data: { email: string; name: string; password: string; language?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { name?: string; language?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

// Streams
export const streamsAPI = {
  getAll: () => api.get('/streams'),
  get: (id: string) => api.get(`/streams/${id}`),
  create: (data: { name: string; url: string; protocol: string; tags?: string[] }) =>
    api.post('/streams', data),
  update: (id: string, data: any) => api.put(`/streams/${id}`, data),
  delete: (id: string) => api.delete(`/streams/${id}`),
  reorder: (streamIds: string[]) => api.post('/streams/reorder', { streamIds }),
};

// Layouts
export const layoutsAPI = {
  getAll: () => api.get('/layouts'),
  create: (data: any) => api.post('/layouts', data),
  update: (id: string, data: any) => api.put(`/layouts/${id}`, data),
  delete: (id: string) => api.delete(`/layouts/${id}`),
};

// Recordings
export const recordingsAPI = {
  getAll: (params?: any) => api.get('/recordings', { params }),
  create: (data: { streamId: string; format?: string; storageType?: string; scheduledAt?: string }) =>
    api.post('/recordings', data),
  stop: (id: string) => api.post(`/recordings/${id}/stop`),
  delete: (id: string) => api.delete(`/recordings/${id}`),
};

// Notifications
export const notificationsAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (ids?: string[]) => api.post('/notifications/read', { ids }),
  delete: (ids?: string[]) => api.post('/notifications/delete', { ids }),
};
