import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { Truck, Search, PlusCircle, Coins, FileCheck2 } from 'lucide-react';

export function MyCollections() {
  const { currentUser } = useAuth();
  const { data } = useData();
  const [filterStatus, setFilterStatus] = useState('All');

  const myCollections = data.collections.filter(
    (c) => c.giverId === currentUser?.id || c.giverName === currentUser?.name
  );

  const filtered = myCollections.filter((c) => {
    if (filterStatus === 'All') return true;
    return c.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">My Collection Requests</h1>
          <p className="text-xs text-slate-400">View real-time status from pickup request to recovery centre verification</p>
        </div>

        <NavLink
          to="/waste-giver/request-collection"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Request</span>
        </NavLink>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Requested', 'Assigned', 'Sent to Recovery Centre', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              filterStatus === st
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Collections List Table / Cards */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Collection ID</th>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Est / Actual Qty</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned Collector</th>
                <th className="px-6 py-4 text-right">Green Coins</th>
                <th className="px-6 py-4 text-center">Batch Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No collection records found.
                  </td>
                </tr>
              ) : (
                filtered.map((col) => (
                  <tr key={col.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{col.id}</td>
                    <td className="px-6 py-4 font-semibold text-white">{col.materialName}</td>
                    <td className="px-6 py-4">
                      {col.actualQty ? (
                        <span className="font-bold text-emerald-300">{col.actualQty} kg</span>
                      ) : (
                        <span className="text-slate-400">{col.estimatedQty} kg (Est)</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={col.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-300">{col.collectorName || 'Assigning...'}</td>
                    <td className="px-6 py-4 text-right font-bold text-amber-400">
                      {col.coinsEarned > 0 ? `+${col.coinsEarned}` : 'Pending Verification'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {col.batchId ? (
                        <NavLink
                          to={`/admin/traceability?id=${col.batchId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>{col.batchId}</span>
                        </NavLink>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Processing Dock</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
