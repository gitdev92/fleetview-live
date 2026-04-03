import Vehicle from '../models/Vehicle.js';
import LocationHistory from '../models/LocationHistory.js';

const MOVING_SPEED_KMH = 5;
const MIN_STOP_DURATION_MS = 2 * 60 * 1000;

const toRadians = (value) => (value * Math.PI) / 180;

const haversineDistanceKm = (a, b) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinLng * sinLng;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
};

const buildDayRange = (dateString) => {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateString || '') ? new Date(`${dateString}T00:00:00.000Z`) : new Date();

  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
};

const finalizeTrip = (trip, vehicleName) => {
  if (!trip || trip.points.length < 2) {
    return null;
  }

  const durationMs = trip.endTime.getTime() - trip.startTime.getTime();
  if (durationMs <= 0 || trip.distanceKm <= 0) {
    return null;
  }

  const avgSpeed = trip.distanceKm / (durationMs / (1000 * 60 * 60));

  return {
    id: `${trip.startTime.getTime()}-${trip.endTime.getTime()}`,
    vehicle: vehicleName,
    start_time: trip.startTime.toISOString(),
    end_time: trip.endTime.toISOString(),
    distance: Number(trip.distanceKm.toFixed(2)),
    avg_speed: Number(avgSpeed.toFixed(1)),
    route_coordinates: trip.points,
  };
};

export const getTripsByVehicle = async (req, res) => {
  try {
    const { carId } = req.params;
    const ownerId = req.user?.userId;
    const { date } = req.query;

    const vehicle = await Vehicle.findOne({ deviceId: carId, owner: ownerId });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    const { start, end } = buildDayRange(String(date || ''));

    const points = await LocationHistory.find({
      vehicleId: vehicle._id,
      timestamp: { $gte: start, $lt: end },
    })
      .sort({ timestamp: 1 })
      .lean();

    if (!points.length) {
      return res.status(200).json({ trips: [] });
    }

    const trips = [];
    let activeTrip = null;
    let stopCandidateStartedAt = null;

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const isMoving = Number(point.speed || 0) > MOVING_SPEED_KMH;
      const pointCoord = [point.lat, point.lng];
      const pointTime = new Date(point.timestamp);

      if (isMoving && !activeTrip) {
        activeTrip = {
          startTime: pointTime,
          endTime: pointTime,
          distanceKm: 0,
          points: [pointCoord],
          previous: point,
        };
        stopCandidateStartedAt = null;
        continue;
      }

      if (!activeTrip) {
        continue;
      }

      const segmentDistance = haversineDistanceKm(activeTrip.previous, point);
      activeTrip.distanceKm += segmentDistance;
      activeTrip.points.push(pointCoord);
      activeTrip.endTime = pointTime;
      activeTrip.previous = point;

      if (isMoving) {
        stopCandidateStartedAt = null;
        continue;
      }

      if (!stopCandidateStartedAt) {
        stopCandidateStartedAt = pointTime;
        continue;
      }

      if (pointTime.getTime() - stopCandidateStartedAt.getTime() >= MIN_STOP_DURATION_MS) {
        // End trip when parked duration crosses threshold; use stop start time as true arrival.
        activeTrip.endTime = stopCandidateStartedAt;
        const trip = finalizeTrip(activeTrip, vehicle.name || vehicle.deviceId);
        if (trip) {
          trips.push(trip);
        }
        activeTrip = null;
        stopCandidateStartedAt = null;
      }
    }

    if (activeTrip) {
      const trip = finalizeTrip(activeTrip, vehicle.name || vehicle.deviceId);
      if (trip) {
        trips.push(trip);
      }
    }

    return res.status(200).json({ trips });
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return res.status(500).json({ message: 'Failed to fetch trips.' });
  }
};
