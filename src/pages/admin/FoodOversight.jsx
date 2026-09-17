import React from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { Heart } from 'lucide-react';

export function AdminFoodOversight() {
  const { data } = useData();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Food Rescue Oversight</h1>
        <p className="text-xs text-slate-400">Monitor commercial food surplus donations & NGO pickup distribution</p>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Donor Name</th>
                <th className="px-6 py-4">Food Description</th>
                <th className="px-6 py-4">Servings</th>
                <th className="px-6 py-4">Claimed NGO</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {data.foodDonations.map((f) => (
                <tr key={f.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-amber-400">{f.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{f.donorName}</td>
                  <td className="px-6 py-4 text-slate-300">{f.foodType}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">{f.peopleServed} Meals</td>
                  <td className="px-6 py-4 text-slate-400">{f.acceptedByNgoName || 'Unclaimed'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={f.status} />
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
