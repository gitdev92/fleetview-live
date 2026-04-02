import { useState } from 'react';
import { useVehicleTracking } from '@/hooks/useVehicleTracking';
import VehicleMap from '@/components/maps/VehicleMap';
import VehicleInfoPanel from '@/components/VehicleInfoPanel';
import { mockSafeZones } from '@/services/mockData';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { location, isMoving } = useVehicleTracking('car001');
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] relative">
      {/* Map - full height on mobile */}
      <div className="flex-1 relative min-h-0">
        <VehicleMap
          location={location}
          safeZones={mockSafeZones}
          followVehicle={true}
        />

        {/* Mobile: floating speed indicator */}
        <div className="absolute top-3 right-3 glass-card p-3 lg:hidden z-[1000]">
          <div className="flex items-center gap-2">
            <div className={isMoving ? 'status-dot-active' : 'status-dot-inactive'} />
            <span className="text-lg font-bold text-foreground">{location.speed.toFixed(0)}</span>
            <span className="text-[10px] text-muted-foreground">km/h</span>
          </div>
        </div>

        {/* Mobile: pull-up handle */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="absolute bottom-0 left-0 right-0 h-10 glass-card rounded-t-2xl flex items-center justify-center lg:hidden z-[1000] border-b-0"
        >
          {panelOpen ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronUp className="w-5 h-5 text-muted-foreground" />}
          <span className="text-xs text-muted-foreground ml-2">Vehicle Info</span>
        </button>
      </div>

      {/* Mobile: sliding panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border z-[999]"
          >
            <VehicleInfoPanel location={location} isMoving={isMoving} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: side panel */}
      <div className="hidden lg:block lg:border-l border-border bg-background/50 overflow-auto">
        <VehicleInfoPanel location={location} isMoving={isMoving} />
      </div>
    </div>
  );
};

export default Dashboard;
