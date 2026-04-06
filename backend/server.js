import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import locationRoutes from './src/routes/locationRoutes.js';
import safeZoneRoutes from './src/routes/safeZoneRoutes.js';
import alertRoutes from './src/routes/alertRoutes.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';

dotenv.config();

const normalizeOrigin = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().replace(/\/+$/, '');
};

const splitOrigins = (value) => {
  if (!value || typeof value !== 'string') {
    return [];
  }

  return value
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
};

const configuredOrigins = splitOrigins(process.env.CLIENT_URL);
const mobileOrigins = ['capacitor://localhost', 'http://localhost'];
const allowedOrigins = [...new Set([...configuredOrigins, ...mobileOrigins])];

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  const normalized = normalizeOrigin(origin);
  return allowedOrigins.includes(normalized);
};

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  },
});

app.use(cors({
  origin: (origin, callback) => {
    if (!allowedOrigins.length || isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('io', io);

app.use('/api', authRoutes);
app.use('/api', locationRoutes);
app.use('/api', safeZoneRoutes);
app.use('/api', alertRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', tripRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
