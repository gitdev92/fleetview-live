export const mockVehicles = [
  { id: 'car001', name: 'Tesla Model 3', plate: 'DL-01-AB-1234', status: 'moving', color: '#2563EB' },
  { id: 'car002', name: 'BMW X5', plate: 'DL-02-CD-5678', status: 'parked', color: '#22C55E' },
  { id: 'car003', name: 'Audi A4', plate: 'DL-03-EF-9012', status: 'offline', color: '#EF4444' },
];

export const mockAlerts = [
  { id: '1', type: 'geofence', message: 'Vehicle left safe zone', vehicle: 'Tesla Model 3', time: '2 min ago', location: 'Connaught Place, Delhi', status: 'unread' },
  { id: '2', type: 'overspeed', message: 'Overspeed detected (120 km/h)', vehicle: 'BMW X5', time: '15 min ago', location: 'NH-48, Gurgaon', status: 'unread' },
  { id: '3', type: 'offline', message: 'Device went offline', vehicle: 'Audi A4', time: '1 hr ago', location: 'Last: Nehru Place', status: 'read' },
  { id: '4', type: 'geofence', message: 'Vehicle entered safe zone', vehicle: 'Tesla Model 3', time: '2 hrs ago', location: 'Home Zone', status: 'read' },
  { id: '5', type: 'overspeed', message: 'Overspeed detected (95 km/h)', vehicle: 'Tesla Model 3', time: '3 hrs ago', location: 'Ring Road', status: 'read' },
];

export const mockSafeZones = [
  { id: 'sz1', name: 'Home', center_lat: 28.6139, center_lng: 77.2090, radius: 500 },
  { id: 'sz2', name: 'Office', center_lat: 28.6280, center_lng: 77.2190, radius: 300 },
  { id: 'sz3', name: 'School', center_lat: 28.6100, center_lng: 77.2300, radius: 200 },
];

export const mockTrips = [
  {
    id: 't1',
    vehicle: 'Tesla Model 3',
    start_time: '2026-04-02T08:00:00',
    end_time: '2026-04-02T09:15:00',
    distance: 23.5,
    avg_speed: 32,
    route_coordinates: [
      [28.6139, 77.2090],
      [28.6180, 77.2120],
      [28.6220, 77.2160],
      [28.6260, 77.2200],
      [28.6300, 77.2240],
      [28.6340, 77.2280],
    ] as [number, number][],
  },
  {
    id: 't2',
    vehicle: 'Tesla Model 3',
    start_time: '2026-04-01T17:30:00',
    end_time: '2026-04-01T18:45:00',
    distance: 18.2,
    avg_speed: 28,
    route_coordinates: [
      [28.6340, 77.2280],
      [28.6300, 77.2240],
      [28.6260, 77.2200],
      [28.6220, 77.2160],
      [28.6180, 77.2120],
      [28.6139, 77.2090],
    ] as [number, number][],
  },
];

export const mockNotifications = [
  { id: '1', message: 'Tesla Model 3 left safe zone "Home"', time: '2 min ago', read: false },
  { id: '2', message: 'Overspeed alert: BMW X5 at 120 km/h', time: '15 min ago', read: false },
  { id: '3', message: 'Audi A4 went offline', time: '1 hr ago', read: true },
];

// Mock simulation - car moves around Delhi
const CENTER = { lat: 28.6139, lng: 77.2090 };
let angle = 0;
const RADIUS = 0.01;

export const getSimulatedLocation = () => {
  angle += 0.05;
  const lat = CENTER.lat + RADIUS * Math.sin(angle);
  const lng = CENTER.lng + RADIUS * Math.cos(angle);
  const speed = 20 + Math.random() * 60;

  return {
    car_id: 'car001',
    lat: parseFloat(lat.toFixed(6)),
    lng: parseFloat(lng.toFixed(6)),
    speed: parseFloat(speed.toFixed(1)),
    timestamp: new Date().toISOString(),
  };
};
