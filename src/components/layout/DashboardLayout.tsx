import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('car001');

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-0"
      >
        <Navbar selectedVehicle={selectedVehicle} onVehicleChange={setSelectedVehicle} />
        <main className="flex-1 overflow-auto">
          <Outlet context={{ selectedVehicle, setSelectedVehicle }} />
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
