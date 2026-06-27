import axios from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const storage = {
  getItem: async (key) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }

    return SecureStore.getItemAsync(key);
  },
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  },
};

const getUserForStorage = (user) => {
  if (!user || Platform.OS === 'web') {
    return user;
  }

  const { foto, ...userWithoutPhoto } = user;
  return userWithoutPhoto;
};

const persistCurrentUser = async (user) => {
  await storage.setItem('user', JSON.stringify(getUserForStorage(user)));
};

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  if (envUrl) {
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl.replace(/\/$/, '')}/api/v1`;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8080/api/v1`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api/v1';
  }

  return 'http://localhost:8080/api/v1';
};

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/usuarios/login', { email, senha });
    if (response.data) {
      await persistCurrentUser(response.data);
    }
    return response.data;
  },
  logout: async () => {
    await storage.removeItem('user');
  },
  getCurrentUser: async () => {
    const user = await storage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  findById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
  refreshCurrentUser: async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser?.id) return currentUser;

    const response = await api.get(`/usuarios/${currentUser.id}`);
    await persistCurrentUser(response.data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data);
    const currentUser = await authService.getCurrentUser();

    if (currentUser?.id === id || String(currentUser?.id) === String(id)) {
      await persistCurrentUser(response.data);
    }

    return response.data;
  },
};

export const agendaService = {
  findByUsuarioId: async (usuarioId) => {
    const response = await api.get(`/agendas/usuario/${usuarioId}`);
    return normalizeList(response.data);
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
