const EARTH_RADIUS_METERS = 6371000;

const toRadians = (value) => (value * Math.PI) / 180;

export const checkGeofence = (vehicleLocation, safeZone) => {
  const vehicleLat = Number(vehicleLocation?.lat);
  const vehicleLng = Number(vehicleLocation?.lng);
  const centerLat = Number(safeZone?.center_lat);
  const centerLng = Number(safeZone?.center_lng);
  const radiusMeters = Number(safeZone?.radius);

  if (
    !Number.isFinite(vehicleLat) ||
    !Number.isFinite(vehicleLng) ||
    !Number.isFinite(centerLat) ||
    !Number.isFinite(centerLng) ||
    !Number.isFinite(radiusMeters)
  ) {
    throw new Error('Invalid geofence coordinates or radius.');
  }

  const deltaLat = toRadians(centerLat - vehicleLat);
  const deltaLng = toRadians(centerLng - vehicleLng);
  const lat1 = toRadians(vehicleLat);
  const lat2 = toRadians(centerLat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = EARTH_RADIUS_METERS * c;
  const exited = distanceMeters > radiusMeters;

  return {
    distanceMeters,
    exited,
    withinRadius: !exited,
  };
};
