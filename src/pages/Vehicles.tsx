import { motion } from 'framer-motion';
import { Car, MapPin, Battery, Signal } from 'lucide-react';
import { mockVehicles } from '@/services/mockData';

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
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your fleet</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          + Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockVehicles.map((vehicle, i) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 hover:border-primary/30 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{vehicle.name}</h3>
                  <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBg[vehicle.status]} ${statusColors[vehicle.status]}`}>
                {vehicle.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Delhi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">92%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Strong</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
