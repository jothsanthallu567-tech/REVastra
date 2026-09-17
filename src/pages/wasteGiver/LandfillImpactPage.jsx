import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { WasteTrendChart } from '../../components/charts/WasteTrendChart';
import { MaterialDistributionChart } from '../../components/charts/MaterialDistributionChart';
import { Leaf, BarChart3, Globe, Recycle, Award, Wind } from 'lucide-react';

export function LandfillImpactPage() {
  const { currentUser } = useAuth();
  const { data } = useData();

  const myCollections = data.collections.filter(
    (c) => c.giverId === currentUser?.id || c.giverName === currentUser?.name
  );

  const totalKg = myCollections.reduce((acc, c) => acc + (c.actualQty || c.estimatedQty || 0), 0);
  const co2Offset = (totalKg * 1.45).toFixed(1);
  const landfillDiverted = (totalKg * 0.94).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Environmental Impact Analytics</h1>
        <p className="text-xs text-slate-400">
          Quantified metrics demonstrating your household/facility waste diversion and carbon footprint reduction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Waste Submitted"
          value={`${totalKg} kg`}
          subtext="Across all verified collections"
          icon={Recycle}
          color="emerald"
        />
        <StatCard
          title="Landfill Diversion"
          value={`${landfillDiverted} kg`}
          subtext="94.0% recovery efficiency rate"
          icon={Globe}
          color="cyan"
        />
        <StatCard
          title="CO2 Offset Estimate"
          value={`${co2Offset} kg CO2e`}
          subtext="Greenhouse gas emissions averted"
          icon={Wind}
          color="purple"
        />
        <StatCard
          title="Eco Rank"
          value="Champion Giver"
          subtext="Top 5% active waste givers"
          icon={Award}
          color="amber"
        />
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Weekly Collection vs Recovery</h3>
          <div className="h-64">
            <WasteTrendChart height={240} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Material Category Breakdown</h3>
          <div className="h-64">
            <MaterialDistributionChart height={240} />
          </div>
        </div>
      </div>
    </div>
  );
}
