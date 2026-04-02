import { useState } from 'react';
import { Bell, ChevronDown, User, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockVehicles, mockNotifications } from '@/services/mockData';

interface NavbarProps {
  selectedVehicle: string;
  onVehicleChange: (id: string) => void;
  onMenuToggle: () => void;
}

const Navbar = ({ selectedVehicle, onVehicleChange, onMenuToggle }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const selected = mockVehicles.find(v => v.id === selectedVehicle) || mockVehicles[0];

  return (
    <header className="h-14 md:h-16 glass-panel border-b border-border flex items-center justify-between px-3 md:px-6 relative z-30">
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
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selected.color }} />
            <span className="text-xs md:text-sm font-medium text-foreground truncate max-w-[100px] md:max-w-none">{selected.name}</span>
            <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
          </button>
          <AnimatePresence>
            {showVehicleDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-12 left-0 w-64 md:w-56 glass-card p-2 shadow-xl"
              >
                {mockVehicles.map(v => (
                  <button
                    key={v.id}
                    onClick={() => { onVehicleChange(v.id); setShowVehicleDropdown(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${v.id === selectedVehicle ? 'bg-primary/20 text-primary' : 'hover:bg-secondary text-foreground'}`}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: v.color }} />
                    <span className="truncate">{v.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground hidden md:inline">{v.plate}</span>
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
                className="absolute top-12 right-0 w-[calc(100vw-2rem)] md:w-80 max-w-80 glass-card p-3 md:p-4 shadow-xl"
              >
                <h3 className="text-sm font-semibold text-foreground mb-3">Notifications</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mockNotifications.map(n => (
                    <div key={n.id} className={`p-2.5 md:p-3 rounded-lg text-sm ${n.read ? 'bg-secondary/50' : 'bg-primary/10 border border-primary/20'}`}>
                      <p className="text-foreground text-xs md:text-sm">{n.message}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{n.time}</p>
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
