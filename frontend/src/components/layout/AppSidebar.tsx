import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Car, Shield, Bell, Route, User, LogOut, ChevronLeft, ChevronRight, Navigation, X
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Vehicles', icon: Car, path: '/vehicles' },
  { label: 'Safe Zones', icon: Shield, path: '/safe-zones' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Trip History', icon: Route, path: '/trip-history' },
  { label: 'Profile', icon: User, path: '/profile' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const AppSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    onMobileClose();
  }, [location.pathname]);

  // Desktop sidebar
  const sidebarContent = (showLabels: boolean) => (
    <>
      {/* Logo */}
      <div className="h-14 md:h-16 flex items-center px-4 border-b border-border">
        <Navigation className="w-6 h-6 md:w-7 md:h-7 text-primary flex-shrink-0" />
        <AnimatePresence>
          {showLabels && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 text-lg font-bold text-foreground tracking-tight"
            >
              TrackFleet
            </motion.span>
          )}
        </AnimatePresence>
        {/* Mobile close button */}
        <button onClick={onMobileClose} className="ml-auto md:hidden p-1 rounded-lg hover:bg-secondary">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={isActive ? 'nav-item-active' : 'nav-item'}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {showLabels && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="nav-item w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {showLabels && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-screen glass-panel flex-col border-r border-border fixed left-0 top-0 z-40 hidden md:flex"
      >
        {sidebarContent(!collapsed)}

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile Overlay Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1200] md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 w-[280px] h-screen glass-panel flex flex-col border-r border-border z-[1300] md:hidden"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppSidebar;
