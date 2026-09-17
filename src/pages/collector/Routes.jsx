import React from 'react';
import { useData } from '../../context/DataContext';
import { RouteOptimizerView } from '../../components/ai/RouteOptimizerView';
import { LiveTrackingMap } from '../../components/map/LiveTrackingMap';
import { Route, Navigation, Clock, CheckCircle2 } from 'lucide-react';

export function CollectorRoutes() {
  const { data } = useData();
  const route = data.routes[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">AI Optimized Collector Routes</h1>
        <p className="text-xs text-slate-400">Intelligent node sequencing minimizing fuel consumption & travel time</p>
      </div>

      <div className="mb-6">
        <LiveTrackingMap height="300px" label="Collector Live Location" />
      </div>

      <RouteOptimizerView route={route} />

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-heading">Assigned Stop Sequence</h3>
        <div className="space-y-2">
          {route.stops.map((stop) => (
            <div key={stop.stopOrder} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                  #{stop.stopOrder}
                </span>
                <div>
                  <p className="text-xs font-bold text-white">{stop.name}</p>
                  <span className="text-[11px] text-slate-400">{stop.address} • QR: {stop.qrCode}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                stop.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                {stop.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
