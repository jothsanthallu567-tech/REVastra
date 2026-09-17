import React from 'react';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { WasteTrendChart } from '../../components/charts/WasteTrendChart';
import { MaterialDistributionChart } from '../../components/charts/MaterialDistributionChart';
import { Recycle, Globe, Wind, Heart, DollarSign, Coins } from 'lucide-react';

export function AdminImpactAnalytics() {
  const { data } = useData();
  const imp = data.impactMetrics;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Ecosystem Impact Analytics</h1>
        <p className="text-xs text-slate-400">Environmental & social sustainability reporting metrics and live ESG impact</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Waste Collected" value={`${imp.totalWasteCollectedKg.toLocaleString()} kg`} subtext="48.6 Metric Tons" icon={Recycle} color="emerald" />
        <StatCard title="Landfill Diversion" value={`${imp.landfillDiversionPercent}%`} subtext="46.1 Tons recovered" icon={Globe} color="cyan" />
        <StatCard title="CO2 Offset" value={`${imp.co2DivertedTons} Tons`} subtext="GHG Emissions averted" icon={Wind} color="purple" />
        <StatCard title="Meals Rescued" value={imp.foodMealsRescued.toLocaleString()} subtext="Nourished by NGOs" icon={Heart} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Weekly Collection vs Recovery Volume</h3>
          <div className="h-64">
            <WasteTrendChart height={240} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Recovered Material Category Share</h3>
          <div className="h-64">
            <MaterialDistributionChart height={240} />
          </div>
        </div>
      </div>
    </div>
  );
}
