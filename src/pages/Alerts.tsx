import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Wifi, Clock, MapPin, Check } from 'lucide-react';
import { mockAlerts } from '@/services/mockData';

const alertIcons: Record<string, typeof AlertTriangle> = {
  geofence: Shield,
  overspeed: AlertTriangle,
  offline: Wifi,
};

const alertColors: Record<string, string> = {
  geofence: 'text-warning',
  overspeed: 'text-destructive',
  offline: 'text-muted-foreground',
};

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'read' } : a));
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Alerts</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Monitor vehicle alerts</p>
      </div>

      {/* Filters - scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {['all', 'geofence', 'overspeed', 'offline'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Mobile: card list, Desktop: table */}
      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((alert, i) => {
          const Icon = alertIcons[alert.type] || AlertTriangle;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 ${alert.status === 'unread' ? 'border-primary/20' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${alertColors[alert.type]}`} />
                  <span className="text-sm font-medium text-foreground capitalize">{alert.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    alert.status === 'unread' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {alert.status}
                  </span>
                  {alert.status === 'unread' && (
                    <button onClick={() => markAsRead(alert.id)} className="p-1 rounded-md hover:bg-secondary">
                      <Check className="w-3.5 h-3.5 text-accent" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1.5">{alert.message}</p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{alert.vehicle}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="glass-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert, i) => {
                const Icon = alertIcons[alert.type] || AlertTriangle;
                return (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${alert.status === 'unread' ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${alertColors[alert.type]}`} />
                        <span className="text-sm text-foreground capitalize">{alert.type}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{alert.vehicle}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{alert.message}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{alert.location}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{alert.time}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        alert.status === 'unread' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {alert.status === 'unread' && (
                        <button onClick={() => markAsRead(alert.id)} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                          <Check className="w-4 h-4 text-accent" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
