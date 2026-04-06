import { io } from 'socket.io-client';

const normalizeSocketBaseUrl = () => {
  const fallback = 'http://localhost:5000';
  const rawSocketValue = import.meta.env.VITE_SOCKET_URL;
  const rawApiValue = import.meta.env.VITE_API_URL;

  const sanitize = (value: string) => {
    const trimmed = String(value).trim().replace(/\/+$/, '');
    if (!trimmed) {
      return '';
    }

    try {
      const parsed = new URL(trimmed);
      parsed.pathname = parsed.pathname.replace(/\/+$/, '').replace(/\/api$/, '');
      return parsed.toString().replace(/\/+$/, '');
    } catch {
      return trimmed.replace(/\/api$/, '');
    }
  };

  if (rawSocketValue) {
    const normalizedSocket = sanitize(rawSocketValue);
    if (normalizedSocket) {
      return normalizedSocket;
    }
  }

  if (rawApiValue) {
    const normalizedFromApi = sanitize(rawApiValue);
    if (normalizedFromApi) {
      return normalizedFromApi;
    }
  }

  return fallback;
};

const SOCKET_URL = normalizeSocketBaseUrl();

let socket: ReturnType<typeof io> | null = null;

const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false });
  }

  return socket;
};

export const connectSocket = () => {
  const activeSocket = getSocket();

  if (!activeSocket.connected) {
    activeSocket.connect();
  }

  return activeSocket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onLocationUpdate = (callback: (data: {
  car_id: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}) => void) => {
  getSocket().on('location_update', callback);
};

export const offLocationUpdate = () => {
  getSocket().off('location_update');
};

export { socket };
