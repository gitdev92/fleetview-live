import { useVehicleTracking } from '@/hooks/useVehicleTracking';
import VehicleMap from '@/components/maps/VehicleMap';
import VehicleInfoPanel from '@/components/VehicleInfoPanel';
import { mockSafeZones } from '@/services/mockData';

const Dashboard = () => {
  const { location, isMoving } = useVehicleTracking('car001');

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Map */}
      <div className="flex-1 relative">
        <VehicleMap
          location={location}
          safeZones={mockSafeZones}
          followVehicle={true}
        />
      </div>

      {/* Info Panel */}
      <div className="lg:border-l border-border bg-background/50 overflow-auto">
        <VehicleInfoPanel location={location} isMoving={isMoving} />
      </div>
    </div>
  );
};

export default Dashboard;
