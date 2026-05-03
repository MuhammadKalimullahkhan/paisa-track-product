import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingBag, Utensils, CreditCard, ChevronDown, CheckCircle2, Leaf, Zap, User, Package } from "lucide-react";
import { api } from "../services/api";
import { Customer, ProductVariant, Product } from "../types";

export default function NewTransaction() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [customerId, setCustomerId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paidAmount, setPaidAmount] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [c, v, p] = await Promise.all([api.getCustomers(), api.getVariants(), api.getProducts()]);
        setCustomers(c);
        setVariants(v);
        setProducts(p);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const selectedVariant = variants.find(v => v.id === variantId);
  const totalPrice = selectedVariant ? selectedVariant.price * quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !variantId) return;

    setSubmitting(true);
    try {
      await api.createOrder({
        customer_id: customerId,
        product_variant_id: variantId,
        quantity,
        paid_amount: paidAmount,
        total_price: totalPrice,
        status: paidAmount >= totalPrice ? "paid" : paidAmount > 0 ? "partial" : "pending",
        delivery_date: deliveryDate,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-screen-xl mx-auto px-8 pt-48 text-center text-outline">
      <Zap size={48} className="mx-auto animate-pulse" />
      <p className="mt-4 font-display">Opening the ledger...</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-8 pt-24">
      <section className="mb-10 text-center">
        <h2 className="font-display text-2xl text-primary-container opacity-60 font-light mb-2">New Transaction</h2>
      </section>

      <section className="mb-12 text-center">
        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] opacity-40">Total Price</span>
        <div className="mt-2 text-center">
          <span className="font-display text-7xl text-primary font-light">
            ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </section>

      <form className="space-y-10" onSubmit={handleSubmit}>
        {/* Customer Select */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary px-4 uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
            <User size={12} /> Select Customer
          </label>
          <div className="relative">
            <select 
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-5 text-on-surface focus:bg-primary-fixed transition-colors appearance-none cursor-pointer"
            >
              <option value="">Who is this for?</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={20} />
          </div>
        </div>

        {/* Product Variant Select */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary px-4 uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
            <Package size={12} /> Select Product
          </label>
          <div className="relative">
            <select 
              required
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-5 text-on-surface focus:bg-primary-fixed transition-colors appearance-none cursor-pointer"
            >
              <option value="">What are they taking?</option>
              {variants.map(v => {
                const product = products.find(p => p.id === v.product_id);
                return (
                  <option key={v.id} value={v.id}>
                    {product?.name} ({v.type}) - ${v.price}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={20} />
          </div>
        </div>

        {/* Quantity & Payment */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary px-4 uppercase tracking-[0.2em] opacity-50">Quantity</label>
            <input 
              type="number" 
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-5 text-on-surface focus:bg-primary-fixed transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary px-4 uppercase tracking-[0.2em] opacity-50">Amount Paid</label>
            <input 
              type="number" 
              min="0"
              max={totalPrice}
              value={paidAmount}
              onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
              className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-5 text-on-surface focus:bg-primary-fixed transition-colors"
            />
          </div>
        </div>

        {/* Delivery Date */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary px-4 uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
             Delivery Date (Optional)
          </label>
          <input 
            type="date" 
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-5 text-on-surface focus:bg-primary-fixed transition-colors"
          />
        </div>

        {/* Main CTA */}
        <div className="pt-4">
          <button 
            disabled={submitting}
            type="submit"
            className="w-full bg-secondary-container text-on-secondary-container py-6 rounded-full font-display text-xl font-bold sanctuary-shadow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {submitting ? <Zap className="animate-spin" /> : <CheckCircle2 size={24} />}
            {submitting ? "Securing Transaction..." : "Save Transaction"}
          </button>
        </div>

        {/* Abstract Card Visual */}
        <div className="relative h-48 rounded-2xl overflow-hidden sanctuary-shadow group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed to-tertiary-fixed opacity-40" />
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" 
            alt="Zen"
            className="w-full h-full object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 p-8 flex justify-between items-end">
            <div>
              <p className="font-display font-bold text-primary-container text-xl">Financial Harmony</p>
              <p className="text-primary-container/70 text-sm">Track mindfully, live freely.</p>
            </div>
            <Leaf className="text-primary-container opacity-40" size={32} />
          </div>
        </div>
      </form>
    </div>
  );
}
