import Vehicle from '../models/Vehicle.js';
import SafeZone from '../models/SafeZone.js';
import Alert from '../models/Alert.js';
import { checkGeofence } from '../services/geofenceService.js';

const parseNumericField = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const triggerGeofenceAlerts = async (vehicle, previousLocation, io) => {
  const ownerId = vehicle.owner?._id ?? vehicle.owner;

  if (!ownerId) {
    return [];
  }

  const safeZones = await SafeZone.find({ userId: ownerId });
  const triggeredAlerts = [];

  for (const safeZone of safeZones) {
    const previousGeofenceResult = previousLocation ? checkGeofence(previousLocation, safeZone) : { withinRadius: false };
    const currentGeofenceResult = checkGeofence(vehicle.lastLocation, safeZone);

    if (!previousGeofenceResult.withinRadius || !currentGeofenceResult.exited) {
      continue;
    }

    const alert = await Alert.create({
      type: 'GEOFENCE_EXIT',
      vehicleId: vehicle._id,
      message: `Vehicle exited safe zone ${safeZone.name}`,
      location: {
        lat: vehicle.lastLocation.lat,
        lng: vehicle.lastLocation.lng,
      },
      status: 'unread',
    });

    if (io) {
      io.emit('alert_triggered', {
        type: alert.type,
        vehicleId: alert.vehicleId,
        message: alert.message,
        location: alert.location,
      });
    }

    triggeredAlerts.push(alert);
  }

  return triggeredAlerts;
};

export const updateLocation = async (req, res) => {
  try {
    const { deviceId, lat, lng, speed, trackerToken } = req.body;

    if (!deviceId || !trackerToken || lat === undefined || lng === undefined || speed === undefined) {
      return res.status(400).json({ message: 'deviceId, trackerToken, lat, lng, and speed are required.' });
    }

    const numericLat = parseNumericField(lat);
    const numericLng = parseNumericField(lng);
    const numericSpeed = parseNumericField(speed);

    if (numericLat === null || numericLng === null || numericSpeed === null) {
      return res.status(400).json({ message: 'lat, lng, and speed must be valid numeric values (string or number).' });
    }

    const vehicle = await Vehicle.findOne({ deviceId: deviceId.trim() });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    const normalizedTrackerToken = String(trackerToken).trim();

    // Backfill token for older vehicles created before trackerToken existed.
    if (!vehicle.trackerToken) {
      vehicle.trackerToken = normalizedTrackerToken;
      await vehicle.save({ validateBeforeSave: false });
    }

    if (vehicle.trackerToken !== normalizedTrackerToken) {
      return res.status(401).json({ message: 'Invalid tracker token.' });
    }

    const previousLocation = vehicle.lastLocation ? { ...vehicle.lastLocation } : null;

    vehicle.lastLocation = {
      lat: numericLat,
      lng: numericLng,
      speed: numericSpeed,
      timestamp: new Date(),
    };

    await vehicle.save({ validateBeforeSave: false });

    const io = req.app.get('io');

    if (io) {
      io.emit('location_update', {
        car_id: vehicle.deviceId,
        lat: vehicle.lastLocation.lat,
        lng: vehicle.lastLocation.lng,
        speed: vehicle.lastLocation.speed,
        timestamp: vehicle.lastLocation.timestamp,
      });
    }

    const alertsTriggered = await triggerGeofenceAlerts(vehicle, previousLocation, io);

    return res.status(200).json({
      message: 'Location updated successfully.',
      vehicle,
      alertsTriggered: alertsTriggered.length,
    });
  } catch (error) {
    console.error('Location update failed:', error);
    return res.status(500).json({ message: 'Failed to update location.' });
  }
};