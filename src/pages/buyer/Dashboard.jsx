import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { Store, Sparkles, ShoppingBag, PackageCheck, ArrowRight } from 'lucide-react';

export function BuyerDashboard() {
  const { currentUser } = useAuth();
  const { data } = useData();

  const myOrders = data.orders.filter(o => o.buyerId === currentUser?.id || o.buyerName === currentUser?.name);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
            <Store className="w-4 h-4" />
            <span>Verified Recycler Procurement Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Welcome, <span className="text-purple-400">{currentUser?.name || 'EcoPolymer Industries'}</span>
          </h1>
          <p className="text-xs text-slate-400">
            GSTIN: <code className="text-purple-400 bg-slate-950 px-2 py-0.5 rounded">{currentUser?.gstin || '29ABCDE1234F1Z5'}</code> • Business Type: {currentUser?.businessType || 'Plastic Recycler'}
          </p>
        </div>

        <NavLink
          to="/buyer/marketplace"
          className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-all"
        >
          <Store className="w-4 h-4" />
          <span>Browse B2B Catalog</span>
        </NavLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Orders"
          value={`${myOrders.length} Orders`}
          subtext="In procurement pipeline"
          icon={PackageCheck}
          color="purple"
        />
        <StatCard
          title="Total Procured Material"
          value="350 kg"
          subtext="PET Flakes & Shredded Aluminium"
          icon={ShoppingBag}
          color="emerald"
        />
        <StatCard
          title="Total Spend"
          value="₹24,000"
          subtext="Paid via verified escrow"
          icon={Store}
          color="amber"
        />
        <StatCard
          title="AI Match Quality"
          value="98.2%"
          subtext="Spec matching accuracy"
          icon={Sparkles}
          color="cyan"
        />
      </div>

      {/* Orders & Marketplace Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Current B2B Purchase Orders</h3>
            <NavLink to="/buyer/orders" className="text-xs text-purple-400 hover:underline font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="space-y-2.5">
            {myOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-400">{ord.id}</span>
                    <StatusBadge status={ord.status} />
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{ord.materialName}</h4>
                  <p className="text-[10px] text-slate-400">{ord.orderDate} • {ord.recoveryCentre}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white font-heading">₹{ord.totalAmount.toLocaleString()}</span>
                  <span className="block text-[10px] text-emerald-400 font-semibold">{ord.quantityKg} kg @ ₹{ord.pricePerKg}/kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">AI Recommended</h3>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          {data.warehouseStock.slice(0, 2).map((item) => (
            <div key={item.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-[10px] text-purple-400 font-bold uppercase">{item.category}</span>
              <h4 className="text-xs font-bold text-white">{item.material}</h4>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-emerald-400 font-bold">₹{item.pricePerKg}/kg</span>
                <NavLink to="/buyer/marketplace" className="text-purple-400 hover:underline text-[11px]">View Listing →</NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
