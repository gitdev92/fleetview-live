import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('car001');

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content - marginLeft only on desktop */}
      <div
        className="flex-1 flex flex-col min-h-0 w-full md:transition-[margin-left] md:duration-300"
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (sidebarCollapsed ? 72 : 240) : 0 }}
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
