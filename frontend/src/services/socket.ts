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
let activeConnections = 0;

const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false });
  }

  return socket;
};

export const connectSocket = () => {
  const activeSocket = getSocket();
  activeConnections += 1;

  if (!activeSocket.connected) {
    activeSocket.connect();
  }

  return activeSocket;
};

export const disconnectSocket = () => {
  activeConnections = Math.max(0, activeConnections - 1);

  if (socket && activeConnections === 0) {
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

export const removeLocationUpdateListener = (callback: (data: {
  car_id: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}) => void) => {
  getSocket().off('location_update', callback);
};

export const onAlertTriggered = (callback: (data: {
  type: string;
  ownerId?: string;
  vehicleId: string;
  message: string;
  location?: {
    lat: number;
    lng: number;
  };
}) => void) => {
  getSocket().on('alert_triggered', callback);
};

export const offAlertTriggered = () => {
  getSocket().off('alert_triggered');
};

export const removeAlertTriggeredListener = (callback: (data: {
  type: string;
  ownerId?: string;
  vehicleId: string;
  message: string;
  location?: {
    lat: number;
    lng: number;
  };
}) => void) => {
  getSocket().off('alert_triggered', callback);
};

export { socket };
