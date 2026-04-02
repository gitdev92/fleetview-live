import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('car001');
  const isMobile = useIsMobile();

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
