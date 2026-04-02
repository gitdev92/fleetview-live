import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

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
