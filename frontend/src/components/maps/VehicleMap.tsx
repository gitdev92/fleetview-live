import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VehicleLocation {
  car_id: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}

interface SafeZone {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius: number;
}

interface VehicleMapProps {
  location: VehicleLocation;
  safeZones?: SafeZone[];
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  followVehicle?: boolean;
}

const carIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <circle cx="20" cy="20" r="18" fill="#2563EB" fill-opacity="0.2" stroke="#2563EB" stroke-width="2"/>
  <circle cx="20" cy="20" r="8" fill="#2563EB"/>
  <circle cx="20" cy="20" r="4" fill="white"/>
</svg>`;

const carIcon = new L.DivIcon({
  html: carIconSvg,
  className: 'car-marker-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const MapFollower = ({ lat, lng, follow }: { lat: number; lng: number; follow: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (follow) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, follow, map]);
  return null;
};

const MapClickHandler = ({ onClick }: { onClick: (lat: number, lng: number) => void }) => {
  const map = useMap();
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handler);
    return () => { map.off('click', handler); };
  }, [map, onClick]);
  return null;
};

const VehicleMap = ({ location, safeZones = [], onMapClick, className = '', followVehicle = true }: VehicleMapProps) => {
  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={15}
      className={`w-full h-full ${className}`}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFollower lat={location.lat} lng={location.lng} follow={followVehicle} />
      {onMapClick && <MapClickHandler onClick={onMapClick} />}

      <Marker position={[location.lat, location.lng]} icon={carIcon}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">{location.car_id}</p>
            <p>Speed: {location.speed.toFixed(1)} km/h</p>
            <p>Lat: {location.lat.toFixed(6)}</p>
            <p>Lng: {location.lng.toFixed(6)}</p>
          </div>
        </Popup>
      </Marker>

      {safeZones.map(zone => (
        <Circle
          key={zone.id}
          center={[zone.center_lat, zone.center_lng]}
          radius={zone.radius}
          pathOptions={{
            color: '#22C55E',
            fillColor: '#22C55E',
            fillOpacity: 0.1,
            weight: 2,
          }}
        >
          <Popup>{zone.name} — {zone.radius}m radius</Popup>
        </Circle>
      ))}
    </MapContainer>
  );
};

export default VehicleMap;
