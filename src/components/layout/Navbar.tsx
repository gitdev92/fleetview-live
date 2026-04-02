import { useState } from 'react';
import { Bell, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockVehicles, mockNotifications } from '@/services/mockData';

interface NavbarProps {
  selectedVehicle: string;
  onVehicleChange: (id: string) => void;
}

const Navbar = ({ selectedVehicle, onVehicleChange }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const selected = mockVehicles.find(v => v.id === selectedVehicle) || mockVehicles[0];

  return (
    <header className="h-16 glass-panel border-b border-border flex items-center justify-between px-6 relative z-30">
      {/* Vehicle Selector */}
      <div className="relative">
        <button
          onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selected.color }} />
          <span className="text-sm font-medium text-foreground">{selected.name}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
        <AnimatePresence>
          {showVehicleDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-12 left-0 w-56 glass-card p-2 shadow-xl"
            >
              {mockVehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => { onVehicleChange(v.id); setShowVehicleDropdown(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${v.id === selectedVehicle ? 'bg-primary/20 text-primary' : 'hover:bg-secondary text-foreground'}`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                  <span>{v.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{v.plate}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
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
                className="absolute top-12 right-0 w-80 glass-card p-4 shadow-xl"
              >
                <h3 className="text-sm font-semibold text-foreground mb-3">Notifications</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mockNotifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-lg text-sm ${n.read ? 'bg-secondary/50' : 'bg-primary/10 border border-primary/20'}`}>
                      <p className="text-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground hidden md:block">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
