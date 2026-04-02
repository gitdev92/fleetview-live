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
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor vehicle alerts and notifications</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'geofence', 'overspeed', 'offline'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Message</th>
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
                    <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">{alert.message}</td>
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
