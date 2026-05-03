import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, CalendarDays, Zap } from "lucide-react";
import { api } from "../services/api";
import { Customer, Order } from "../types";

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [c, o] = await Promise.all([api.getCustomers(), api.getOrders()]);
        setCustomers(c);
        setOrders(o);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.paid_amount, 0);
  const totalValue = orders.reduce((sum, o) => sum + o.total_price, 0);
  const revenueProgress = totalValue > 0 ? (totalRevenue / totalValue) * 100 : 0;
  
  const activeCustomersCount = customers.filter(c => 
    orders.some(o => o.customer_id === c.id)
  ).length;

  const completedOrders = orders.filter(o => o.status === "paid").length;
  const avgOrderValue = orders.length > 0 ? totalValue / orders.length : 0;

  if (loading) return (
    <div className="max-w-screen-xl mx-auto px-8 pt-48 text-center text-outline">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Zap size={48} className="mx-auto" />
      </motion.div>
      <p className="mt-4 font-display">Preparing your sanctuary...</p>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-8 pt-24">
      {/* Editorial Header */}
      <section className="mb-12">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-5xl md:text-6xl text-primary-container tracking-tight max-w-2xl font-light"
        >
          Good morning, Sarah
        </motion.h2>
        <p className="font-sans text-xl text-outline mt-3 font-light">
          Your financial sanctuary is in harmony today.
        </p>
      </section>

      {/* Core Overview Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-12">
        <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-10 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em] opacity-60">Total Revenue</span>
            <h3 className="font-display text-4xl mt-2 text-primary-container">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            
            <div className="mt-10 space-y-5">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-sm text-outline">Outstanding</span>
                  <p className="text-lg font-semibold text-primary-container">
                    ${(totalValue - totalRevenue).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary">{Math.round(revenueProgress)}% Collected</span>
                </div>
              </div>
              <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${revenueProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary-container to-primary-fixed-dim rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-tertiary-fixed/20 rounded-full blur-3xl" />
        </div>

        {/* Active Customers Card */}
        <div className="lg:col-span-5 bg-primary-fixed/20 rounded-2xl p-10 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <span className="text-xs font-semibold text-primary-container uppercase tracking-[0.2em] opacity-60">Active Clients</span>
            <h3 className="font-display text-4xl mt-2 text-primary-container">{activeCustomersCount} Souls</h3>
            
            <div className="mt-10 space-y-5">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-sm text-outline">Total Directory</span>
                  <p className="text-lg font-semibold text-primary-container">{customers.length} Contacts</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary-container">Engagement High</span>
                </div>
              </div>
              <div className="h-2.5 w-full bg-primary-container/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(activeCustomersCount/customers.length)*100}%` }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-primary-container rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="mb-12">
        <div className="flex justify-between items-baseline mb-6 px-1">
          <h4 className="font-display text-2xl text-primary-container">Insights</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            icon={<TrendingUp size={24} />} 
            label="Avg Order Value" 
            value={`$${Math.round(avgOrderValue)}`} 
            progress={75}
            color="secondary"
          />
          <MetricCard 
            icon={<Zap size={24} />} 
            label="Recovery Score" 
            value={`${Math.round(revenueProgress)}/100`} 
            progress={revenueProgress}
            color="primary"
          />
          <MetricCard 
            icon={<CalendarDays size={24} />} 
            label="Settled Invoices" 
            value={`${completedOrders} Orders`} 
            progress={(completedOrders/orders.length)*100}
            color="tertiary"
          />
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, progress, color }: any) {
  const colorMap: any = {
    primary: "bg-primary-fixed/30 text-primary-container stroke-primary-container",
    secondary: "bg-secondary-container/30 text-secondary stroke-secondary",
    tertiary: "bg-tertiary-fixed/30 text-tertiary stroke-tertiary",
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface-container-lowest p-8 rounded-2xl sanctuary-shadow"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]}`}>
          {icon}
        </div>
        <div className="w-10 h-10">
          <svg className="w-full h-full -rotate-90">
            <circle className="text-surface-container-high" cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" />
            <motion.circle 
              cx="20" cy="20" r="16" fill="transparent" 
              stroke={color === 'primary' ? '#55624d' : color === 'secondary' ? '#745754' : '#584049'}
              strokeWidth="3" strokeDasharray={100}
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 100 - (progress || 0) }}
              transition={{ duration: 1.5, delay: 0.8 }}
              strokeLinecap="round" 
            />
          </svg>
        </div>
      </div>
      <p className="text-xs font-semibold text-outline uppercase tracking-widest">{label}</p>
      <h5 className="font-display text-2xl text-on-surface mt-1">{value}</h5>
    </motion.div>
  );
}
