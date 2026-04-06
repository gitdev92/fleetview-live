import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/sonner';
import { connectSocket, disconnectSocket, onAlertTriggered, removeAlertTriggeredListener } from '@/services/socket';
import { ensureAlertPermissions, triggerGeofenceSiren } from '@/services/mobileAlertService';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const currentUserId = user?._id || user?.id;

    ensureAlertPermissions();
    connectSocket();

    const handleAlertTriggered = async (event: { type: string; ownerId?: string; message: string }) => {
      if (event?.type !== 'GEOFENCE_EXIT') {
        return;
      }

      if (currentUserId && event.ownerId && event.ownerId !== String(currentUserId)) {
        return;
      }

      const message = event.message || 'Vehicle exited a safe zone.';
      toast.error(message, { duration: 10000 });
      await triggerGeofenceSiren(message);
    };

    onAlertTriggered(handleAlertTriggered);

    return () => {
      removeAlertTriggeredListener(handleAlertTriggered);
      disconnectSocket();
    };
  }, []);

  const marginLeft = isMobile ? 0 : (sidebarCollapsed ? 72 : 240);

  return (
    <div className="relative isolate h-screen flex overflow-hidden bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className="relative z-0 flex-1 flex flex-col min-h-0 w-full transition-[margin-left] duration-300"
        style={{ marginLeft }}
      >
        <Navbar
          selectedVehicle={selectedVehicle}
          onVehicleChange={setSelectedVehicle}
          onMenuToggle={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <Outlet context={{ selectedVehicle, setSelectedVehicle }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
