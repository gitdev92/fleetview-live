import { Capacitor, registerPlugin } from '@capacitor/core';

interface FleetAlertPlugin {
  requestNotificationPermission(): Promise<{ granted: boolean }>;
  startSiren(options: { title?: string; message?: string }): Promise<{ started: boolean }>;
  stopSiren(): Promise<{ stopped: boolean }>;
}

const FleetAlert = registerPlugin<FleetAlertPlugin>('FleetAlert');

const isAndroid = () => Capacitor.getPlatform() === 'android';

export const triggerGeofenceSiren = async (message: string) => {
  if (!isAndroid()) {
    return;
  }

  try {
    await FleetAlert.startSiren({
      title: 'Safe Zone Alert',
      message,
    });
  } catch (error) {
    // Keep silent in production flow; alert processing should not break app UI.
    console.error('Failed to start geofence siren:', error);
  }
};

export const ensureAlertPermissions = async () => {
  if (!isAndroid()) {
    return;
  }

  try {
    await FleetAlert.requestNotificationPermission();
  } catch (error) {
    console.error('Failed requesting notification permission:', error);
  }
};

export const stopGeofenceSiren = async () => {
  if (!isAndroid()) {
    return;
  }

  try {
    await FleetAlert.stopSiren();
  } catch (error) {
    console.error('Failed to stop geofence siren:', error);
  }
};
