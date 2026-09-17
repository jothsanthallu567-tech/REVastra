import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { Heart, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export function NGOAcceptedPickups() {
  const { currentUser } = useAuth();
  const { data, updateFoodStatus } = useData();

  const accepted = data.foodDonations.filter(
    (f) => f.acceptedByNgoId === currentUser?.id || f.status === 'Accepted' || f.status === 'Pickup Scheduled' || f.status === 'Delivered'
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Accepted Food Pickups</h1>
        <p className="text-xs text-slate-400">Scheduled pickups and distribution tracking for food rescue</p>
      </div>

      {accepted.length > 0 && (
        <div className="mb-6">
          <InteractiveMap 
            height="350px" 
            markers={accepted.map((f, i) => ({
              lat: 12.9716 + ((i % 5) * 0.005) - 0.01,
              lng: 77.5946 + ((i % 3) * 0.005) - 0.005,
              label: `${f.donorName} - ${f.foodType} (${f.status})`
            }))} 
          />
        </div>
      )}

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Donor Name</th>
                <th className="px-6 py-4">Food Type</th>
                <th className="px-6 py-4">Servings</th>
                <th className="px-6 py-4">Pickup Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {accepted.map((food) => (
                <tr key={food.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{food.donorName}</td>
                  <td className="px-6 py-4 text-amber-400 font-semibold">{food.foodType}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">{food.peopleServed} Meals</td>
                  <td className="px-6 py-4 text-slate-300">{food.scheduledPickupTime || 'Today 18:30'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={food.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {food.status !== 'Delivered' ? (
                      <button
                        onClick={() => updateFoodStatus(food.id, 'Delivered')}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                      >
                        Mark Delivered
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Delivered
                      </span>
                    )}
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
