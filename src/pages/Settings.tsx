import { motion } from "motion/react";
import { User, Mail, ShieldCheck, Sun, Moon, Sparkles, Bell, ToggleLeft, BadgeCheck } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-screen-xl mx-auto px-8 pt-24 space-y-12">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-6xl text-primary-container tracking-tighter"
          >
            Settings
          </motion.h1>
          <p className="text-on-surface-variant text-xl font-light opacity-60 max-w-sm leading-relaxed">
            Refine your digital environment to better serve your focus and tranquility.
          </p>
        </div>
      </section>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-8 bg-surface-container-low rounded-[2.5rem] p-10 sanctuary-shadow group"
        >
          <div className="flex justify-between items-start mb-16">
            <div>
              <h2 className="font-display text-2xl text-primary-container font-semibold mb-2">Profile</h2>
              <p className="text-on-surface-variant font-light">Manage your identity and personal data</p>
            </div>
            <div className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-outline group-hover:text-primary transition-colors">
              <User size={22} />
            </div>
          </div>

          <div className="space-y-10">
            <ProfileRow 
              icon={<BadgeCheck className="text-tertiary" />} 
              label="Display Name" 
              value="Alex Morgan" 
              action="Edit" 
              bgColor="bg-tertiary-fixed/20"
            />
            <ProfileRow 
              icon={<Mail className="text-primary" />} 
              label="Email Address" 
              value="alex.m@sanctuary.design" 
              action="Change" 
              bgColor="bg-primary-fixed/30"
            />
          </div>
        </motion.div>

        {/* Appearance Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 bg-tertiary-fixed/10 border border-tertiary-fixed/20 rounded-[2.5rem] p-10 flex flex-col"
        >
          <div className="mb-12">
            <h2 className="font-display text-2xl text-tertiary font-semibold mb-2">Appearance</h2>
            <p className="text-on-surface-variant text-sm font-light">Tailor the visual rhythm</p>
          </div>
          
          <div className="space-y-4 mt-auto">
            <AppearanceOption label="Light Mode" icon={<Sun size={18} />} active />
            <AppearanceOption label="Dark Mode" icon={<Moon size={18} />} />
            <AppearanceOption label="Automatic" icon={<Sparkles size={18} />} />
          </div>
        </motion.div>

        {/* Security Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-6 bg-surface-container-high rounded-[2.5rem] p-10 sanctuary-shadow"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-display text-2xl text-on-surface font-semibold">Security</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-on-surface-variant font-medium">Two-Factor Auth</span>
              <span className="bg-primary-fixed text-primary px-4 py-1.5 rounded-full text-xs font-bold">Enabled</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-on-surface-variant font-medium">Passkey Login</span>
              <button className="border border-outline-variant px-5 py-2 rounded-full text-xs font-bold hover:bg-on-surface/5 transition-colors">Configure</button>
            </div>
          </div>
        </motion.div>

        {/* Notifications Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-6 bg-secondary-container/20 rounded-[2.5rem] p-10 sanctuary-shadow"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
              <Bell size={20} />
            </div>
            <h2 className="font-display text-2xl text-on-surface font-semibold">Notifications</h2>
          </div>

          <div className="space-y-8">
            <NotificationToggle 
              label="Morning Digest" 
              description="Daily wellness summary at 8:00 AM" 
              active 
            />
            <NotificationToggle 
              label="Focus Mode" 
              description="Mute non-essential alerts" 
            />
          </div>
        </motion.div>

      </div>

      <div className="text-center py-16">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="font-sans text-on-surface-variant italic text-lg max-w-xl mx-auto leading-relaxed"
        >
          "The soul always knows what to do to heal itself. The challenge is to silence the mind."
        </motion.p>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value, action, bgColor }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-3xl ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="font-display font-bold text-on-surface">{label}</p>
          <p className="text-on-surface-variant text-sm font-light">{value}</p>
        </div>
      </div>
      <button className="text-primary-container font-bold text-sm tracking-wide hover:underline underline-offset-8 transition-all">
        {action}
      </button>
    </div>
  );
}

function AppearanceOption({ label, icon, active = false }: any) {
  return (
    <div className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 ${active ? 'bg-white sanctuary-shadow scale-102 border-transparent' : 'bg-on-surface/5 opacity-40 hover:opacity-100 border-transparent'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 p-1 transition-colors ${active ? 'border-primary-container' : 'border-outline/30'}`}>
        {active && <div className="w-full h-full bg-primary-container rounded-full" />}
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, active = false }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="font-bold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant font-light">{description}</p>
      </div>
      <div className={`w-12 h-7 rounded-full relative flex items-center px-1.5 transition-colors cursor-pointer ${active ? 'bg-primary-container' : 'bg-outline-variant/50'}`}>
        <motion.div 
          animate={{ x: active ? 20 : 0 }}
          className={`w-4 h-4 rounded-full shadow-sm ${active ? 'bg-white' : 'bg-white/80'}`} 
        />
      </div>
    </div>
  );
}
