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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Vehicles</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Manage your fleet</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto">
          + Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {mockVehicles.map((vehicle, i) => (
          <motion.div
            key={vehicle.id}
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
                  <p className="text-[11px] md:text-xs text-muted-foreground">{vehicle.plate}</p>
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
