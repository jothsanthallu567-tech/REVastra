import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { Heart, Utensils, Truck, Users, ArrowRight } from 'lucide-react';

export function NGODashboard() {
  const { currentUser } = useAuth();
  const { data } = useData();

  const accepted = data.foodDonations.filter((f) => f.acceptedByNgoId === currentUser?.id || f.status === 'Accepted');
  const availableCount = data.foodDonations.filter((f) => f.status === 'Available').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Heart className="w-4 h-4" />
            <span>Verified NGO Food Rescue Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            NGO Portal: <span className="text-amber-400">{currentUser?.name || 'Annapoorna Food Foundation'}</span>
          </h1>
          <p className="text-xs text-slate-400">
            Reg No: <code className="text-amber-400 bg-slate-950 px-2 py-0.5 rounded">{currentUser?.registrationNo || 'NGO-KA-2018-9941'}</code> • Contact: {currentUser?.contactPerson || 'Priya Sundaram'}
          </p>
        </div>

        <NavLink
          to="/ngo/food-donations"
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all"
        >
          <Utensils className="w-4 h-4" />
          <span>Browse Available Surplus Food ({availableCount})</span>
        </NavLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Food Listings"
          value={`${availableCount} Listings`}
          subtext="Ready for rescue"
          icon={Utensils}
          color="amber"
        />
        <StatCard
          title="Active Pickups"
          value={`${accepted.length} Scheduled`}
          subtext="Assigned to logistics team"
          icon={Truck}
          color="blue"
        />
        <StatCard
          title="Meals Rescued Today"
          value="100 Meals"
          subtext="From corporate & restaurant buffets"
          icon={Heart}
          color="emerald"
        />
        <StatCard
          title="Total People Served"
          value="42,500+"
          subtext="Across community kitchens"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Main Grid: Active Pickups & Available Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading">Accepted Food Pickups</h3>
            <NavLink to="/ngo/accepted-pickups" className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="space-y-2.5">
            {accepted.map((food) => (
              <div key={food.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{food.donorName}</span>
                    <StatusBadge status={food.status} />
                  </div>
                  <h4 className="text-xs font-bold text-amber-400 mt-1">{food.foodType}</h4>
                  <p className="text-[10px] text-slate-400">{food.pickupLocation} • Pickup: {food.scheduledPickupTime}</p>
                </div>
                <span className="text-xs font-bold text-emerald-400">{food.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">Surplus Food Alert</h3>
          {data.foodDonations.slice(0, 2).map((f) => (
            <div key={f.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase">{f.donorName}</span>
              <h4 className="text-xs font-bold text-white">{f.foodType}</h4>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-slate-400">{f.peopleServed} Servings</span>
                <NavLink to="/ngo/food-donations" className="text-amber-400 hover:underline text-[11px]">Accept →</NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
