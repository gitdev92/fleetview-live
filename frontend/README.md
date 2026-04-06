# FleetView Frontend

This frontend runs as:
- A regular Vite web app (for Vercel/local web)
- A Capacitor Android app wrapper (for emulator/device)

## Key Commands

- `npm run dev` starts local web development
- `npm run build` builds the web app to `dist`
- `npm run cap:sync` syncs current `dist` into Android project
- `npm run android:build` runs build + sync
- `npm run android:open` opens Android Studio project

## Environment Variables

The frontend uses:
- `VITE_API_URL`
- `VITE_SOCKET_URL` (optional)

Notes:
- REST calls normalize `VITE_API_URL` to include `/api`
- Socket URL now auto-falls back to API host when `VITE_SOCKET_URL` is not set

## Environment Matrix

### 1) Local web + local backend

- `VITE_API_URL=http://localhost:5000/api`
- `VITE_SOCKET_URL=http://localhost:5000`

### 2) Android emulator + local backend (running on your PC)

- `VITE_API_URL=http://10.0.2.2:5000/api`
- `VITE_SOCKET_URL=http://10.0.2.2:5000`

### 3) Android physical device + local backend (same Wi-Fi)

- `VITE_API_URL=http://<YOUR_PC_LAN_IP>:5000/api`
- `VITE_SOCKET_URL=http://<YOUR_PC_LAN_IP>:5000`

### 4) Production (Vercel frontend + Render backend)

- `VITE_API_URL=https://<your-render-domain>/api`
- `VITE_SOCKET_URL=https://<your-render-domain>`

## Suggested Workflow

### Web local

1. Set env values
2. Run `npm run dev`

### Android

1. Set env values for emulator/device/production target
2. Run `npm run android:build`
3. Run `npm run android:open`
4. Build/run from Android Studio

When env values change, rebuild and sync again.
