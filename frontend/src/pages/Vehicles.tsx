import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, MapPin, Battery, Signal } from 'lucide-react';
import { createVehicle, getVehicles } from '@/services/api';

type VehicleRecord = {
  _id: string;
  name: string;
  deviceId: string;
  trackerToken?: string;
  lastLocation?: {
    speed?: number;
    timestamp?: string;
  };
};

const statusColors: Record<string, string> = {
  moving: 'text-accent',
  parked: 'text-warning',
  offline: 'text-destructive',
};

const statusBg: Record<string, string> = {
  moving: 'bg-accent/10',
  parked: 'bg-warning/10',
  offline: 'bg-destructive/10',
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      try {
        const response = await getVehicles();
        if (isMounted) {
          setVehicles(response.data?.vehicles || []);
        }
      } catch {
        if (isMounted) {
          setVehicles([]);
        }
      }
    };

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  const getVehicleStatus = (vehicle: VehicleRecord) => {
    const speed = vehicle.lastLocation?.speed ?? 0;
    const timestamp = vehicle.lastLocation?.timestamp ? new Date(vehicle.lastLocation.timestamp).getTime() : 0;
    const isRecent = timestamp ? Date.now() - timestamp < 10 * 60 * 1000 : false;

    if (!isRecent) {
      return 'offline';
    }

    return speed > 5 ? 'moving' : 'parked';
  };

  const vehicleStats = useMemo(() => vehicles.map(vehicle => ({
    ...vehicle,
    status: getVehicleStatus(vehicle),
  })), [vehicles]);

  const copyTrackerToken = async (token?: string) => {
    if (!token) {
      return;
    }

    try {
      await navigator.clipboard.writeText(token);
    } catch {
      setFormError('Could not copy tracker token. Please copy it manually.');
    }
  };

  const handleCreateVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser?._id || currentUser?.id;

    if (!currentUserId) {
      setFormError('User session not found. Please login again.');
      return;
    }

    if (!name.trim() || !deviceId.trim()) {
      setFormError('Vehicle name and device ID are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createVehicle({
        name: name.trim(),
        deviceId: deviceId.trim(),
        owner: currentUserId,
      });

      const createdVehicle = response.data?.vehicle;
      if (createdVehicle) {
        setVehicles((prev) => [createdVehicle, ...prev]);
      }

      setName('');
      setDeviceId('');
      setShowAddForm(false);
    } catch (error: any) {
      setFormError(error?.response?.data?.message || 'Failed to create vehicle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Vehicles</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Manage your fleet</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setFormError('');
          }}
          className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
        >
          + Add Vehicle
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateVehicle} className="glass-card p-4 md:p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vehicle name"
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            />
            <input
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Device ID (e.g. car002)"
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            />
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Vehicle'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setName('');
                setDeviceId('');
                setFormError('');
              }}
              className="px-4 py-2 rounded-lg border border-border text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {vehicleStats.map((vehicle, i) => (
          <motion.div
            key={vehicle._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 md:p-5 hover:border-primary/30 transition-colors cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Car className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm md:text-base">{vehicle.name}</h3>
                  <p className="text-[11px] md:text-xs text-muted-foreground">{vehicle.deviceId}</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground break-all">
                    Token: {vehicle.trackerToken || 'not set'}
                  </p>
                </div>
              </div>
              <span className={`text-[11px] md:text-xs font-medium px-2 py-1 rounded-full ${statusBg[vehicle.status]} ${statusColors[vehicle.status]}`}>
                {vehicle.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground" />
                <span className="text-[11px] md:text-xs text-muted-foreground">Delhi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Battery className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent" />
                <span className="text-[11px] md:text-xs text-muted-foreground">92%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
                <span className="text-[11px] md:text-xs text-muted-foreground">Strong</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyTrackerToken(vehicle.trackerToken)}
              className="mt-3 text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted/50"
            >
              Copy Tracker Token
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
