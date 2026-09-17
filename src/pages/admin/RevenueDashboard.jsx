import React from 'react';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { StatusBadge } from '../../components/common/Badge';
import { DollarSign, Store, ShoppingBag, ArrowRight } from 'lucide-react';

export function RevenueDashboard() {
  const { data } = useData();
  const totalRev = data.impactMetrics.totalMarketplaceRevenueRupees;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Monetization & Revenue Center</h1>
        <p className="text-xs text-slate-400">
          Financial transactions tracking commercial B2B sales of recovered materials to recyclers & manufacturers.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-center font-mono font-bold text-emerald-400 flex items-center justify-center gap-2 flex-wrap shadow-xl">
        <span className="text-slate-300">WASTE GENERATION</span> →
        <span className="text-blue-400">COLLECTION</span> →
        <span className="text-teal-400">RECOVERY & GRADING</span> →
        <span className="text-purple-400">DIGITAL INVENTORY</span> →
        <span className="text-amber-400">B2B MARKETPLACE</span> →
        <span className="text-emerald-300">REVENUE (₹)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Marketplace Revenue"
          value={`₹${totalRev.toLocaleString()}`}
          subtext="Processed via escrow bank transfers"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Average Order Value"
          value="₹12,000"
          subtext="Across commercial buyers"
          icon={Store}
          color="purple"
        />
        <StatCard
          title="Material Volume Sold"
          value="18,450 kg"
          subtext="Quality Grade A & B stock"
          icon={ShoppingBag}
          color="cyan"
        />
        <StatCard
          title="Active Recyclers"
          value="48 Buyers"
          subtext="Verified commercial accounts"
          icon={Store}
          color="amber"
        />
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-heading">Revenue Over Time (INR)</h3>
        <div className="h-64">
          <RevenueChart height={240} />
        </div>
      </div>

      {/* Orders Revenue Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white font-heading">Completed B2B Material Sales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Buyer Company</th>
                <th className="px-6 py-4">Material Category</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Rate / kg</th>
                <th className="px-6 py-4 text-right">Revenue Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {data.orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-purple-400">{ord.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{ord.buyerName}</td>
                  <td className="px-6 py-4 text-slate-300">{ord.materialName}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">{ord.quantityKg} kg</td>
                  <td className="px-6 py-4 text-slate-400">₹{ord.pricePerKg}</td>
                  <td className="px-6 py-4 text-right font-extrabold text-emerald-400 font-heading">
                    ₹{ord.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
