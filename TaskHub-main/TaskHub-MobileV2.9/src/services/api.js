import axios from 'axios';

const storage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
};

const BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/usuarios/login', { email, senha });
    if (response.data) {
      await storage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: async () => {
    await storage.removeItem('user');
  },
  getCurrentUser: async () => {
    const user = await storage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const agendaService = {
  findByUsuarioId: async (usuarioId) => {
    const response = await api.get(`/agendas/usuario/${usuarioId}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/agendas', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/agendas/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/agendas/${id}`);
    return response.data;
  }
};

export default api;
