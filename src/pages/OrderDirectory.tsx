import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MoreVertical, CreditCard, Clock, CheckCircle2, Package, Tag, Zap, Calendar, X, User, ChevronDown } from "lucide-react";
import { api } from "../services/api";
import { Customer, Order, Product, ProductVariant } from "../types";

export default function OrderDirectory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Edit State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [o, c, p, v] = await Promise.all([
        api.getOrders(),
        api.getCustomers(),
        api.getProducts(),
        api.getVariants(),
      ]);
      setOrders(o);
      setCustomers(c);
      setProducts(p);
      setVariants(v);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (order: Order) => {
    setEditingOrder({ ...order });
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      await api.updateOrder(editingOrder.id, editingOrder);
      setIsEditModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  const getProcessedOrders = () => {
    let list = orders.filter(order => {
      const customer = customers.find(c => c.id === order.customerId);
      const matchesSearch = customer?.name.toLowerCase().includes(search.toLowerCase()) || 
                           order.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  if (loading && orders.length === 0) return (
    <div className="max-w-screen-xl mx-auto px-8 pt-48 text-center text-outline">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Zap size={48} className="mx-auto" />
      </motion.div>
      <p className="mt-4 font-display">Syncing the ledger...</p>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-8 pt-24 pb-24">
      {/* Editorial Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-5xl md:text-6xl text-primary-container tracking-tight mb-4">Transaction History</h2>
            <p className="text-xl text-on-surface-variant font-light opacity-80">A comprehensive view of all commitments, settled and pending.</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-outline uppercase tracking-[0.3em]">Total Volume</span>
            <p className="font-display text-2xl text-primary-container">
              ${orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-surface-container-low rounded-3xl p-6 mb-12 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-2xl focus:ring-2 focus:ring-primary-fixed-dim transition-all text-on-surface sanctuary-shadow"
          />
        </div>
        <div className="flex gap-2">
          {["all", "paid", "partial", "pending"].map((status) => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-4 rounded-2xl font-semibold text-xs capitalize transition-all sanctuary-shadow ${filterStatus === status ? "bg-primary text-white" : "bg-surface-container-lowest text-primary hover:bg-primary-fixed"}`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      {/* Orders List */}
      <section className="space-y-4">
        {getProcessedOrders().map((order, idx) => {
          const customer = customers.find(c => c.id === order.customerId);
          const variant = variants.find(v => v.id === order.productVariantId);
          const product = products.find(p => p && p.id === variant?.productId);
          const date = new Date(order.createdAt).toLocaleDateString(undefined, { 
            month: 'short', day: 'numeric', year: 'numeric' 
          });

          return (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleEditClick(order)}
              className="bg-surface-container-lowest rounded-[2rem] p-6 sanctuary-shadow group flex flex-col md:flex-row items-center gap-6 md:gap-12 cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              {/* Order Status Icon */}
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 ${
                order.status === 'paid' ? 'bg-primary-fixed text-primary' : 
                order.status === 'partial' ? 'bg-secondary-container text-on-secondary-container' : 
                'bg-surface-container-high text-outline'
              }`}>
                {order.status === 'paid' ? <CheckCircle2 size={24} /> : 
                 order.status === 'partial' ? <CreditCard size={24} /> : 
                 <Clock size={24} />}
              </div>

              {/* Order Details */}
              <div className="flex-1 space-y-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                  <span className="hidden md:block text-outline/30">•</span>
                  <span className="text-xs font-medium text-outline flex items-center justify-center md:justify-start gap-1">
                    <Calendar size={12} /> {date}
                  </span>
                </div>
                <h3 className="font-display text-xl text-on-surface font-semibold">
                  {customer?.name || "Unknown Individual"}
                </h3>
                <p className="text-sm text-on-surface-variant flex items-center justify-center md:justify-start gap-2 opacity-70">
                  <Package size={14} /> {product?.name} ({variant?.type}) × {order.quantity}
                </p>
                {order.deliveryDate && (
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                    Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Financial Summary */}
              <div className="text-center md:text-right min-w-[140px]">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Settlement</p>
                <div className="flex flex-col items-center md:items-end">
                  <span className="font-display text-2xl text-primary-container font-bold">
                    ${order.paidAmount.toLocaleString()}
                  </span>
                  <span className="text-xs text-outline opacity-60">
                    of ${order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="w-full md:w-32">
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(order.paidAmount / (order.totalPrice || 1)) * 100}%` }}
                    className={`h-full ${order.status === 'paid' ? 'bg-primary' : 'bg-secondary'}`}
                  />
                </div>
              </div>

              <div className="text-outline group-hover:text-primary transition-colors pr-2">
                <MoreVertical size={20} />
              </div>
            </motion.div>
          );
        })}

        {getProcessedOrders().length === 0 && (
          <div className="py-20 text-center text-outline font-display opacity-40">
            <Tag size={48} className="mx-auto mb-4" />
            <p>No transactions found in the current sanctuary.</p>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-container-lowest rounded-[3rem] p-10 sanctuary-shadow overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-display text-3xl text-primary-container">Edit Transaction</h3>
                  <p className="text-outline text-sm tracking-widest uppercase mt-1">ID: #{editingOrder.id.slice(0, 8)}</p>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-3 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors text-outline"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em] flex items-center gap-2">
                      <User size={12} /> Customer
                    </label>
                    <div className="relative">
                      <select 
                        required
                        value={editingOrder.customerId}
                        onChange={(e) => setEditingOrder({...editingOrder, customerId: e.target.value})}
                        className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors appearance-none cursor-pointer"
                      >
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={20} />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Zap size={12} /> Status
                    </label>
                    <div className="relative">
                      <select 
                        required
                        value={editingOrder.status}
                        onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value as any})}
                        className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors appearance-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={20} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Price */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em]">Total Price ($)</label>
                    <input 
                      type="number"
                      required
                      value={editingOrder.totalPrice}
                      onChange={(e) => setEditingOrder({...editingOrder, totalPrice: parseFloat(e.target.value)})}
                      className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors"
                    />
                  </div>
                  {/* Paid Amount */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em]">Paid Amount ($)</label>
                    <input 
                      type="number"
                      required
                      value={editingOrder.paidAmount}
                      onChange={(e) => setEditingOrder({...editingOrder, paidAmount: parseFloat(e.target.value)})}
                      className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors"
                    />
                  </div>
                </div>

                {/* Delivery Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em]">Delivery Date</label>
                  <input 
                    type="date"
                    value={editingOrder.deliveryDate || ""}
                    onChange={(e) => setEditingOrder({...editingOrder, deliveryDate: e.target.value})}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-5 rounded-full font-display text-xl font-bold sanctuary-shadow hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Update Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
