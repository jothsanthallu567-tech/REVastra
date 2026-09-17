import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { Truck, Search, Filter, Calendar, User, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

export function AdminCollectorHistory() {
  const { data } = useData();

  const collectors = data.users.filter((u) => u.role === 'collector');
  const [selectedCollectorId, setSelectedCollectorId] = useState(collectors[0]?.id || 'usr-collector-1');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const selectedCollector = collectors.find((c) => c.id === selectedCollectorId) || collectors[0];

  const collectorCollections = data.collections.filter(
    (c) => c.collectorId === selectedCollector?.id || c.collectorName === selectedCollector?.name
  );

  const filteredCollections = collectorCollections.filter((col) => {
    const matchesSearch = col.giverName.toLowerCase().includes(searchTerm.toLowerCase()) || col.materialName.toLowerCase().includes(searchTerm.toLowerCase()) || col.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || col.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalKg = collectorCollections.reduce((acc, c) => acc + (c.actualQty || c.estimatedQty || 0), 0);
  const completedCount = collectorCollections.filter((c) => c.status === 'Completed' || c.status === 'Sent to Recovery Centre').length;
  const pendingCount = collectorCollections.filter((c) => c.status === 'Pending' || c.status === 'Requested' || c.status === 'Assigned').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">Collector Activity & History</h1>
          <p className="text-xs text-slate-400">
            Performance analytics, route verification, and individual collection logs per municipal collector.
          </p>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collector or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Collector Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collectors.map((col) => {
          const isSelected = selectedCollectorId === col.id;
          return (
            <div
              key={col.id}
              onClick={() => setSelectedCollectorId(col.id)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-rose-500/15 border-rose-500/50 shadow-xl'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={col.avatar} alt={col.name} className="w-12 h-12 rounded-full border-2 border-rose-500/40 object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-white">{col.name}</h3>
                  <span className="text-[11px] font-mono text-rose-400 font-semibold">{col.collectorBadgeId || 'CLR-KA-104'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="block text-[9px] text-slate-400">Total</span>
                  <strong className="text-white">{col.totalCollectionsCount || 45}</strong>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="block text-[9px] text-slate-400">Completed</span>
                  <strong className="text-emerald-400">{col.completedCount || 40}</strong>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="block text-[9px] text-slate-400">Collected</span>
                  <strong className="text-cyan-400">{col.totalKgCollected || 325} kg</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Collector Detailed Metrics & History Table */}
      {selectedCollector && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img src={selectedCollector.avatar} alt={selectedCollector.name} className="w-14 h-14 rounded-full border-2 border-rose-500/40 object-cover" />
              <div>
                <h3 className="text-lg font-bold text-white font-heading">{selectedCollector.name}</h3>
                <p className="text-xs text-slate-400">
                  Zone: <strong>{selectedCollector.assignedZone}</strong> • Vehicle: <code className="text-rose-400 bg-slate-950 px-2 py-0.5 rounded">{selectedCollector.vehicleNo}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                {completedCount} Completed
              </div>
              <div className="px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                {pendingCount} Pending
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h4 className="text-sm font-bold text-white font-heading">Individual Collection Log History</h4>
            <div className="flex items-center gap-2">
              {['All', 'Pending', 'Sent to Recovery Centre', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors border ${
                    statusFilter === st
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Records Table */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Waste Source</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4">Actual Qty</th>
                  <th className="px-6 py-4">Date / Time</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Coins Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredCollections.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                      No matching collection records found for this collector.
                    </td>
                  </tr>
                ) : (
                  filteredCollections.map((col) => (
                    <tr key={col.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-rose-400">{col.id}</td>
                      <td className="px-6 py-4 font-bold text-white">
                        {col.giverName}
                        <span className="block text-[10px] text-slate-400 font-normal">{col.sourceType} • {col.qrCode}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-200">{col.materialName}</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">
                        {col.actualQty ? `${col.actualQty} kg` : `${col.estimatedQty} kg (Est)`}
                      </td>
                      <td className="px-6 py-4 text-slate-400">{col.collectedDate || col.requestedDate}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={col.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-amber-400">
                        {col.coinsEarned > 0 ? `+${col.coinsEarned}` : 'Pending'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
