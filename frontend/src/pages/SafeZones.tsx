import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Edit2, Trash2, Eye, Plus, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { createSafeZone, deleteSafeZone, getSafeZones } from '@/services/api';
import VehicleMap from '@/components/maps/VehicleMap';
import { useVehicleTracking } from '@/hooks/useVehicleTracking';

type SafeZoneRecord = {
  _id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius: number;
};

type SafeZonesContext = {
  selectedVehicle: string;
};

const SafeZones = () => {
  const { selectedVehicle } = useOutletContext<SafeZonesContext>();
  const { location: trackedLocation } = useVehicleTracking(selectedVehicle);
  const [zones, setZones] = useState<SafeZoneRecord[]>([]);
  const [creating, setCreating] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', center_lat: 0, center_lng: 0, radius: 500 });
  const [viewZone, setViewZone] = useState<typeof zones[0] | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSafeZones = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
        const response = await getSafeZones(currentUser?._id);

        if (isMounted) {
          setZones(response.data?.safeZones || []);
        }
      } catch {
        if (isMounted) {
          setZones([]);
        }
      }
    };

    loadSafeZones();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    if (creating) {
      setNewZone(prev => ({ ...prev, center_lat: lat, center_lng: lng }));
    }
  };

  const handleSave = async () => {
    if (!newZone.name || !newZone.center_lat) return;

    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!currentUser?._id) {
      return;
    }

    await createSafeZone({
      name: newZone.name,
      center_lat: newZone.center_lat,
      center_lng: newZone.center_lng,
      radius: newZone.radius,
      userId: currentUser._id,
    });

    const response = await getSafeZones(currentUser._id);
    setZones(response.data?.safeZones || []);
    setNewZone({ name: '', center_lat: 0, center_lng: 0, radius: 500 });
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    await deleteSafeZone(id);
    setZones(prev => prev.filter(z => z._id !== id));
  };

  const mapLocation = viewZone
    ? { car_id: '', lat: viewZone.center_lat, lng: viewZone.center_lng, speed: 0, timestamp: '' }
    : {
        car_id: trackedLocation.car_id,
        lat: trackedLocation.lat,
        lng: trackedLocation.lng,
        speed: trackedLocation.speed,
        timestamp: trackedLocation.timestamp,
      };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Safe Zones</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Manage geofence boundaries</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {creating ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Create Safe Zone</>}
        </button>
      </div>

      {creating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-4 md:p-5 space-y-3 md:space-y-4"
        >
          <p className="text-xs md:text-sm text-muted-foreground">Tap on the map to set the zone center.</p>
          <div className="h-48 md:h-64 rounded-lg overflow-hidden">
            <VehicleMap
              location={mapLocation}
              onMapClick={handleMapClick}
              followVehicle={newZone.center_lat === 0}
              safeZones={newZone.center_lat ? [{ ...newZone, id: 'new' }] : []}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            <div>
              <label className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider">Zone Name</label>
              <input
                value={newZone.name}
                onChange={e => setNewZone(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Home"
              />
            </div>
            <div>
              <label className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider">Radius: {newZone.radius}m</label>
              <input
                type="range" min={100} max={2000} step={50} value={newZone.radius}
                onChange={e => setNewZone(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                className="w-full mt-3 accent-primary"
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleSave} className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Save Zone
              </button>
            </div>
          </div>
          {newZone.center_lat !== 0 && (
            <p className="text-[11px] md:text-xs text-muted-foreground">
              Selected: {newZone.center_lat.toFixed(6)}, {newZone.center_lng.toFixed(6)}
            </p>
          )}
        </motion.div>
      )}

      {viewZone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground text-sm md:text-base">{viewZone.name}</h3>
            <button onClick={() => setViewZone(null)} className="text-muted-foreground hover:text-foreground p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-48 md:h-64 rounded-lg overflow-hidden">
            <VehicleMap location={mapLocation} safeZones={[{ id: viewZone._id, ...viewZone }]} followVehicle={true} />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {zones.map((zone, i) => (
          <motion.div
            key={zone._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 md:p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm md:text-base">{zone.name}</h3>
                  <p className="text-[11px] md:text-xs text-muted-foreground">{zone.radius}m radius</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] md:text-xs text-muted-foreground mb-3">
              {zone.center_lat.toFixed(4)}, {zone.center_lng.toFixed(4)}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setViewZone(zone)} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-md bg-secondary text-foreground text-xs hover:bg-secondary/80 transition-colors">
                <Eye className="w-3 h-3" /> View
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-md bg-secondary text-foreground text-xs hover:bg-secondary/80 transition-colors">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => handleDelete(zone._id)} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-md bg-destructive/10 text-destructive text-xs hover:bg-destructive/20 transition-colors">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SafeZones;
