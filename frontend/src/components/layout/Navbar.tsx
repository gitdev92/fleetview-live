import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronDown, User, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAlerts, getVehicles } from '@/services/api';

type VehicleSummary = {
  _id: string;
  name: string;
  deviceId: string;
  lastLocation?: {
    lat?: number;
    lng?: number;
    speed?: number;
    timestamp?: string;
  };
};

type AlertSummary = {
  _id: string;
  message: string;
  status: 'read' | 'unread';
  createdAt?: string;
};

interface NavbarProps {
  selectedVehicle: string;
  onVehicleChange: (id: string) => void;
  onMenuToggle: () => void;
}

const Navbar = ({ selectedVehicle, onVehicleChange, onMenuToggle }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [alerts, setAlerts] = useState<AlertSummary[]>([]);

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

    const loadAlerts = async () => {
      try {
        const response = await getAlerts();
        if (isMounted) {
          setAlerts(response.data?.alerts || []);
        }
      } catch {
        if (isMounted) {
          setAlerts([]);
        }
      }
    };

    loadVehicles();
    loadAlerts();

    return () => {
      isMounted = false;
    };
  }, []);

  const unreadCount = useMemo(() => alerts.filter(alert => alert.status === 'unread').length, [alerts]);
  const selected = vehicles.find(vehicle => vehicle.deviceId === selectedVehicle) || vehicles[0];

  useEffect(() => {
    if (!vehicles.length) {
      return;
    }

    const selectedExists = vehicles.some(vehicle => vehicle.deviceId === selectedVehicle);
    if (!selectedExists) {
      onVehicleChange(vehicles[0].deviceId);
    }
  }, [vehicles, selectedVehicle, onVehicleChange]);

  const getVehicleColor = (deviceId: string) => {
    const palette = ['#2563EB', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6'];
    const hash = deviceId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return palette[hash % palette.length];
  };

  return (
    <header className="h-14 md:h-16 glass-panel border-b border-border flex items-center justify-between px-3 md:px-6 relative z-[1100] pointer-events-auto">
      {/* Left: hamburger + vehicle selector */}
      <div className="flex items-center gap-2">
        {/* Mobile hamburger */}
        <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden">
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        {/* Vehicle Selector */}
        <div className="relative">
          <button
            onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
            className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected ? getVehicleColor(selected.deviceId) : '#2563EB' }} />
            <span className="text-xs md:text-sm font-medium text-foreground truncate max-w-[100px] md:max-w-none">
              {selected?.name || 'Loading vehicles...'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
          </button>
          <AnimatePresence>
            {showVehicleDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-12 left-0 z-[1100] w-64 md:w-56 glass-card p-2 shadow-xl"
              >
                {vehicles.map(vehicle => (
                  <button
                    key={vehicle.deviceId}
                    onClick={() => { onVehicleChange(vehicle.deviceId); setShowVehicleDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${vehicle.deviceId === selectedVehicle ? 'bg-primary/20 text-primary' : 'hover:bg-secondary text-foreground'}`}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getVehicleColor(vehicle.deviceId) }} />
                    <span className="truncate">{vehicle.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground hidden md:inline">{vehicle.deviceId}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-12 right-0 z-[1100] w-[calc(100vw-2rem)] md:w-80 max-w-80 glass-card p-3 md:p-4 shadow-xl"
              >
                <h3 className="text-sm font-semibold text-foreground mb-3">Notifications</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alerts.map(alert => (
                    <div key={alert._id} className={`p-2.5 md:p-3 rounded-lg text-sm ${alert.status === 'read' ? 'bg-secondary/50' : 'bg-primary/10 border border-primary/20'}`}>
                      <p className="text-foreground text-xs md:text-sm">{alert.message}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                        {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground hidden lg:block">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
