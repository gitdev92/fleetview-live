import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Calendar, Clock, Gauge, Route as RouteIcon } from 'lucide-react';
import { mockTrips } from '@/services/mockData';
import 'leaflet/dist/leaflet.css';

const startIcon = new L.DivIcon({
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#22C55E;border:2px solid white;box-shadow:0 0 6px rgba(34,197,94,0.5)"></div>`,
  className: '',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const endIcon = new L.DivIcon({
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#EF4444;border:2px solid white;box-shadow:0 0 6px rgba(239,68,68,0.5)"></div>`,
  className: '',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const TripHistory = () => {
  const [selectedTrip, setSelectedTrip] = useState(mockTrips[0]);
  const [date, setDate] = useState('2026-04-02');

  const duration = useMemo(() => {
    const start = new Date(selectedTrip.start_time);
    const end = new Date(selectedTrip.end_time);
    const mins = Math.round((end.getTime() - start.getTime()) / 60000);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }, [selectedTrip]);

  const center = selectedTrip.route_coordinates[Math.floor(selectedTrip.route_coordinates.length / 2)];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Trip History</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">View past vehicle trips</p>
      </div>

      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Mobile: horizontal scroll trip cards, then map below */}
      {/* Trip selector - horizontal on mobile, vertical sidebar on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:hidden snap-x">
        {mockTrips.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedTrip(trip)}
            className={`glass-card p-3 cursor-pointer transition-colors flex-shrink-0 w-[200px] snap-start ${
              selectedTrip.id === trip.id ? 'border-primary/50' : 'hover:border-primary/20'
            }`}
          >
            <p className="text-xs font-semibold text-foreground">{trip.vehicle}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(trip.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex gap-3 mt-1.5">
              <span className="text-[11px] text-muted-foreground">{trip.distance} km</span>
              <span className="text-[11px] text-muted-foreground">{trip.avg_speed} km/h</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Desktop Trip List */}
        <div className="hidden lg:block space-y-3">
          {mockTrips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedTrip(trip)}
              className={`glass-card p-4 cursor-pointer transition-colors ${
                selectedTrip.id === trip.id ? 'border-primary/50' : 'hover:border-primary/20'
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{trip.vehicle}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(trip.start_time).toLocaleTimeString()} — {new Date(trip.end_time).toLocaleTimeString()}
              </p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-muted-foreground">{trip.distance} km</span>
                <span className="text-xs text-muted-foreground">Avg {trip.avg_speed} km/h</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map + Summary */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          <div className="glass-card overflow-hidden rounded-xl h-56 md:h-80">
            <MapContainer center={center} zoom={14} className="w-full h-full" key={selectedTrip.id}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Polyline
                positions={selectedTrip.route_coordinates}
                pathOptions={{ color: '#2563EB', weight: 4, opacity: 0.8 }}
              />
              <Marker position={selectedTrip.route_coordinates[0]} icon={startIcon} />
              <Marker position={selectedTrip.route_coordinates[selectedTrip.route_coordinates.length - 1]} icon={endIcon} />
            </MapContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="glass-card p-3 md:p-4 text-center">
              <RouteIcon className="w-4 h-4 md:w-5 md:h-5 text-primary mx-auto mb-1 md:mb-2" />
              <p className="text-sm md:text-lg font-bold text-foreground">{selectedTrip.distance} km</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Distance</p>
            </div>
            <div className="glass-card p-3 md:p-4 text-center">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent mx-auto mb-1 md:mb-2" />
              <p className="text-sm md:text-lg font-bold text-foreground">{duration}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="glass-card p-3 md:p-4 text-center">
              <Gauge className="w-4 h-4 md:w-5 md:h-5 text-warning mx-auto mb-1 md:mb-2" />
              <p className="text-sm md:text-lg font-bold text-foreground">{selectedTrip.avg_speed}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Avg km/h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripHistory;
