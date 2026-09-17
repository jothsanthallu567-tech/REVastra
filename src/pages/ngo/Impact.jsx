import React from 'react';
import { StatCard } from '../../components/common/StatCard';
import { Heart, Users, Utensils, Globe } from 'lucide-react';

export function NGOImpact() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Food Rescue Impact Analytics</h1>
        <p className="text-xs text-slate-400">Social & nutritional metrics of food waste diversion</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Meals Rescued"
          value="8,420 Meals"
          subtext="Diverted from organic landfills"
          icon={Utensils}
          color="amber"
        />
        <StatCard
          title="People Nourished"
          value="42,500+"
          subtext="Through shelter & community centers"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Methane Offset"
          value="12.4 Tons"
          subtext="Harmful GHG emissions prevented"
          icon={Globe}
          color="cyan"
        />
        <StatCard
          title="Active Donor Partners"
          value="18 Kitchens"
          subtext="Restaurants & institutional mess"
          icon={Heart}
          color="purple"
        />
      </div>
    </div>
  );
}
