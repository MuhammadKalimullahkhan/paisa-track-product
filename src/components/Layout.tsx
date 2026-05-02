import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Users, Settings, Plus, Bell, ReceiptText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/40 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-8 pt-6 pb-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/10">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-display font-semibold text-primary-container text-xl tracking-tight">Paisa</h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-primary-container hover:opacity-70 transition-opacity">
              <Bell size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FAB - Global Add Button */}
      <div className="fixed bottom-24 right-8 z-50">
        <NavLink to="/new">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-primary-container text-white rounded-full sanctuary-shadow flex items-center justify-center hover:bg-primary transition-colors"
          >
            <Plus size={28} strokeWidth={2} />
          </motion.button>
        </NavLink>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 pointer-events-none">
        <div className="pointer-events-auto glass-pill rounded-full mx-auto w-max px-8 py-4 flex gap-12 sanctuary-shadow">
          <NavItem to="/" icon={<LayoutGrid size={24} />} label="Dashboard" />
          <NavItem to="/customers" icon={<Users size={24} />} label="Customers" />
          <NavItem to="/orders" icon={<ReceiptText size={24} />} label="Transactions" />
          <NavItem to="/settings" icon={<Settings size={24} />} label="Settings" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div className="relative flex flex-col items-center justify-center">
          <span className={`transition-all duration-400 ${isActive ? 'text-primary-container scale-110' : 'text-outline hover:text-on-surface'}`}>
            {icon}
          </span>
          {isActive && (
            <motion.div 
              layoutId="nav-glow"
              className="absolute -inset-2 bg-primary-container/10 rounded-full blur-md -z-10"
            />
          )}
        </div>
      )}
    </NavLink>
  );
}
