import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save } from 'lucide-react';

const Profile = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4 md:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Manage your account</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 md:p-6 flex items-center gap-3 md:gap-4">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm md:text-base truncate">{name}</h3>
          <p className="text-xs md:text-sm text-muted-foreground truncate">{email}</p>
        </div>
      </motion.div>

      <div className="glass-card p-4 md:p-6 space-y-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">Personal Information</h3>
        <div>
          <label className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider">Full Name</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider">Email</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <div className="glass-card p-4 md:p-6 space-y-4">
        <h3 className="font-semibold text-foreground text-sm md:text-base">Change Password</h3>
        <div>
          <label className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider">Current Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wider">New Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        {saved ? (
          <><span className="text-accent">✓</span> Saved!</>
        ) : (
          <><Save className="w-4 h-4" /> Save Changes</>
        )}
      </button>
    </div>
  );
};

export default Profile;
