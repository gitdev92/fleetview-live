import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: ReturnType<typeof io> | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false });
  }
  socket.connect();
  return socket;
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
  if (socket) {
    socket.on('location_update', callback);
  }
};

export const offLocationUpdate = () => {
  if (socket) {
    socket.off('location_update');
  }
};

export { socket };
