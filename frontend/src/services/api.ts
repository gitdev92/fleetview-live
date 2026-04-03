import axios from 'axios';

const normalizeApiBaseUrl = () => {
  const fallback = 'http://localhost:5000/api';
  const rawValue = import.meta.env.VITE_API_URL;

  if (!rawValue) {
    return fallback;
  }

  const trimmed = String(rawValue).trim().replace(/\/+$/, '');
  if (!trimmed) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed);
    const normalizedPath = parsed.pathname.replace(/\/+$/, '');
    parsed.pathname = normalizedPath.endsWith('/api') ? normalizedPath : `${normalizedPath}/api`;
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
};

const API = axios.create({
  baseURL: normalizeApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  API.post('/login', { email, password });

export const register = (name: string, email: string, password: string) =>
  API.post('/register', { name, email, password });

// Vehicles
export const getVehicles = () => API.get('/vehicles');
export const createVehicle = (data: { name: string; deviceId: string; owner: string }) =>
  API.post('/vehicles', data);
export const getLatestLocation = (deviceId: string) => API.get(`/vehicles/${deviceId}/location`);

// Safe Zones
export const getSafeZones = (userId?: string) =>
  API.get('/safe-zones', { params: userId ? { userId } : undefined });
export const createSafeZone = (zoneData: { name: string; center_lat: number; center_lng: number; radius: number; userId: string }) =>
  API.post('/safe-zones', zoneData);
export const deleteSafeZone = (id: string) => API.delete(`/safe-zones/${id}`);
export const updateSafeZone = (id: string, data: any) => API.put(`/safe-zones/${id}`, data);

// Alerts
export const getAlerts = () => API.get('/alerts');
export const markAlertRead = (id: string) => API.put(`/alerts/${id}/read`);

// Trips
export const getTrips = (carId: string, date?: string) =>
  API.get(`/trips/${carId}`, { params: { date } });

// Profile
export const getProfile = () => API.get('/profile');
export const updateProfile = (data: any) => API.put('/profile', data);

export default API;
