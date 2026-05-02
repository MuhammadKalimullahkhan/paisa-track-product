import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  MoreVertical, 
  ArrowUpRight, 
  Clock, 
  History, 
  Zap, 
  Plus, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2,
  Edit2
} from "lucide-react";
import { api } from "../services/api";
import { Customer, Order } from "../types";

export default function CustomerDirectory() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"alpha" | "activity">("activity");

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formState, setFormState] = useState<Partial<Customer>>({
    name: "",
    email: "",
    contact: "",
    address: ""
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [c, o] = await Promise.all([api.getCustomers(), api.getOrders()]);
      setCustomers(c);
      setOrders(o);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerStatus = (customerId: string) => {
    const customerOrders = orders.filter(o => o.customerId === customerId);
    if (customerOrders.length === 0) return "Inactive";
    const hasUnpaid = customerOrders.some(o => o.status !== "paid");
    return hasUnpaid ? "Pending" : "Active";
  };

  const getLatestInteraction = (customerId: string) => {
    const customerOrders = orders.filter(o => o.customerId === customerId);
    if (customerOrders.length === 0) return null;
    return customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  };

  const getProcessedCustomers = () => {
    let list = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    
    if (sortBy === "alpha") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => {
        const dateA = getLatestInteraction(a.id)?.createdAt || "0";
        const dateB = getLatestInteraction(b.id)?.createdAt || "0";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    }
    return list;
  };

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormState({ ...customer });
    } else {
      setEditingCustomer(null);
      setFormState({ name: "", email: "", contact: "", address: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.id, formState);
      } else {
        await api.createCustomer(formState);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Failed to save customer:", err);
    }
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await api.deleteCustomer(customerToDelete.id);
      setIsDeleting(false);
      setCustomerToDelete(null);
      loadData();
    } catch (err) {
      console.error("Failed to delete customer:", err);
    }
  };

  if (loading && customers.length === 0) return (
    <div className="max-w-screen-xl mx-auto px-8 pt-48 text-center text-outline">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Zap size={48} className="mx-auto" />
      </motion.div>
      <p className="mt-4 font-display">Gazing into the network...</p>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-8 pt-24 pb-32">
      {/* Editorial Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-5xl md:text-6xl text-primary-container tracking-tight mb-4">Customer Directory</h2>
            <p className="text-xl text-on-surface-variant font-light opacity-80">A curated view of your relationship network, managed with tranquility and precision.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold sanctuary-shadow hover:bg-primary-container transition-all"
          >
            <Plus size={20} /> New Customer
          </motion.button>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-surface-container-low rounded-3xl p-6 mb-12 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Seek a customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-2xl focus:ring-2 focus:ring-primary-fixed-dim transition-all text-on-surface sanctuary-shadow"
          />
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setSortBy("alpha")}
            className={`px-6 py-4 rounded-2xl font-semibold text-sm transition-all sanctuary-shadow ${sortBy === "alpha" ? "bg-primary text-white" : "bg-surface-container-lowest text-primary hover:bg-primary-fixed"}`}
          >
            Alphabetical
          </button>
          <button 
            onClick={() => setSortBy("activity")}
            className={`px-6 py-4 rounded-2xl font-semibold text-sm transition-all sanctuary-shadow ${sortBy === "activity" ? "bg-primary text-white" : "bg-surface-container-lowest text-primary hover:bg-primary-fixed"}`}
          >
            Recent Activity
          </button>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getProcessedCustomers().map((customer, idx) => {
          const status = getCustomerStatus(customer.id);
          const latestOrder = getLatestInteraction(customer.id);
          const initials = customer.name.split(" ").map(n => n[0]).join("");

          return (
            <motion.div 
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-surface-container-lowest rounded-3xl p-8 sanctuary-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-display text-lg font-bold bg-primary-fixed text-primary-container">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-on-surface leading-tight">{customer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-primary' : status === 'Pending' ? 'bg-secondary' : 'bg-outline'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'Active' ? 'text-primary' : status === 'Pending' ? 'text-secondary' : 'text-outline'}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(customer)}
                      className="p-2 text-outline hover:text-primary transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => {
                        setCustomerToDelete(customer);
                        setIsDeleting(true);
                      }}
                      className="p-2 text-outline hover:text-error transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-on-surface-variant opacity-70">
                    <Mail size={14} /> {customer.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-on-surface-variant opacity-70">
                    <Phone size={14} /> {customer.contact}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-on-surface-variant opacity-70">
                    <MapPin size={14} /> {customer.address}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-surface-container-low pt-6">
                <div>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">
                    {latestOrder ? "Latest Payment" : "No orders yet"}
                  </p>
                  <p className="font-display text-2xl text-on-surface">
                    {latestOrder ? `$${latestOrder.paidAmount.toLocaleString()}` : "---"}
                  </p>
                  {latestOrder?.deliveryDate && (
                    <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5">
                      Delivery: {new Date(latestOrder.deliveryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className={`p-2 rounded-xl transition-colors ${status === 'Active' ? 'bg-primary-fixed text-primary-container' : 'bg-surface-container-high text-outline'}`}>
                  {status === "Active" ? <ArrowUpRight /> : status === "Pending" ? <Clock /> : <History />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-lowest rounded-[3rem] p-10 sanctuary-shadow overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-display text-3xl text-primary-container">
                    {editingCustomer ? "Update Entity" : "New Customer"}
                  </h3>
                  <p className="text-outline text-sm tracking-widest uppercase mt-1">Relationship Management</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors text-outline"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em] flex items-center gap-2">
                    <User size={12} /> Full Name
                  </label>
                  <input 
                    required
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors"
                    placeholder="E.g. Julian Hayes"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Mail size={12} /> Email Address
                  </label>
                  <input 
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors"
                    placeholder="julian@hayes.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Phone size={12} /> Contact Number
                  </label>
                  <input 
                    required
                    type="text"
                    value={formState.contact}
                    onChange={(e) => setFormState({ ...formState, contact: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors"
                    placeholder="XXX-XXX-XXXX"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline px-4 uppercase tracking-[0.2em] flex items-center gap-2">
                    <MapPin size={12} /> Mailing Address
                  </label>
                  <textarea 
                    required
                    value={formState.address}
                    onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 text-on-surface focus:bg-primary-fixed transition-colors resize-none h-24"
                    placeholder="Sanctuary St, NY"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-5 rounded-full font-display text-xl font-bold sanctuary-shadow hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {editingCustomer ? "Update Sanctuary Record" : "Enroll Customer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleting && customerToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleting(false)}
              className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-[2.5rem] p-10 sanctuary-shadow text-center"
            >
              <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="font-display text-2xl text-on-surface mb-2">Severe Action</h3>
              <p className="text-on-surface-variant font-light mb-8 opacity-70">
                Are you certain you wish to sever ties with <span className="font-bold">{customerToDelete.name}</span>? This action is irreversible.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={handleDelete}
                  className="w-full bg-error text-white py-4 rounded-full font-bold shadow-lg hover:bg-error/90 transition-all"
                >
                  Confirm Severance
                </button>
                <button 
                  onClick={() => setIsDeleting(false)}
                  className="w-full bg-surface-container-low text-outline py-4 rounded-full font-bold hover:bg-surface-container-high transition-all"
                >
                  Retain Connection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

