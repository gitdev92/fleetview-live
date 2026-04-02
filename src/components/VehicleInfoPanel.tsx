import { motion } from 'framer-motion';
import { Gauge, MapPin, Clock, Activity } from 'lucide-react';

interface VehicleInfoPanelProps {
  location: {
    lat: number;
    lng: number;
    speed: number;
    timestamp: string;
  };
  isMoving: boolean;
}

const VehicleInfoPanel = ({ location, isMoving }: VehicleInfoPanelProps) => {
  const lastSeen = new Date(location.timestamp).toLocaleTimeString();

  const stats = [
    { icon: Gauge, label: 'Speed', value: `${location.speed.toFixed(1)}`, unit: 'km/h', color: location.speed > 80 ? 'text-destructive' : 'text-primary' },
    { icon: MapPin, label: 'Latitude', value: location.lat.toFixed(6), unit: '°', color: 'text-accent' },
    { icon: MapPin, label: 'Longitude', value: location.lng.toFixed(6), unit: '°', color: 'text-accent' },
    { icon: Clock, label: 'Last Updated', value: lastSeen, unit: '', color: 'text-muted-foreground' },
  ];

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-full lg:w-80 space-y-3 md:space-y-4 p-3 md:p-4"
    >
      {/* Status + Gauge - horizontal on mobile */}
      <div className="glass-card p-3 md:p-4">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <h3 className="text-sm font-semibold text-foreground">Vehicle Status</h3>
          <div className="flex items-center gap-2">
            <div className={isMoving ? 'status-dot-active' : 'status-dot-inactive'} />
            <span className={`text-xs font-medium ${isMoving ? 'text-accent' : 'text-muted-foreground'}`}>
              {isMoving ? 'Moving' : 'Parked'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center py-2 md:py-4">
          <div className="relative w-20 h-20 md:w-28 md:h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="hsl(var(--secondary))" strokeWidth="8" fill="none" />
              <circle
                cx="50" cy="50" r="42"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(location.speed / 200) * 264} 264`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl md:text-2xl font-bold text-foreground">{location.speed.toFixed(0)}</span>
              <span className="text-[9px] md:text-[10px] text-muted-foreground">km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-2.5 md:p-3"
          >
            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
              <stat.icon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${stat.color}`} />
              <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-xs md:text-sm font-semibold text-foreground truncate">
              {stat.value}<span className="text-[10px] md:text-xs text-muted-foreground ml-0.5">{stat.unit}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Activity Indicator */}
      <div className="glass-card p-2.5 md:p-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary animate-pulse-glow" />
          <span className="text-[11px] md:text-xs text-muted-foreground">Live tracking active</span>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleInfoPanel;
