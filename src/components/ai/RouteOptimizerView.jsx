import React from 'react';
import { Route, Navigation, MapPin, Clock, ShieldCheck } from 'lucide-react';

export function RouteOptimizerView({ route }) {
  if (!route) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Route className="w-4 h-4 text-emerald-400" />
            AI Optimized Collector Route
          </h4>
          <p className="text-xs text-slate-400">{route.name}</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Saved ~3.2 km Fuel
        </span>
      </div>

      {/* Simulated Visual Map Nodes */}
      <div className="relative h-40 bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-center justify-around overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

        {route.stops.map((stop, idx) => (
          <div key={stop.stopOrder} className="relative z-10 flex flex-col items-center group">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform group-hover:scale-110 ${
              stop.status === 'Completed'
                ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                : 'bg-slate-800 text-slate-300 border-2 border-slate-600'
            }`}>
              {stop.stopOrder}
            </div>
            <span className="mt-2 text-[11px] font-semibold text-slate-200">{stop.name}</span>
            <span className="text-[9px] text-slate-400">{stop.status}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>Total Distance: <strong className="text-white">{route.totalDistanceKm} km</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Est Duration: <strong className="text-white">{route.estimatedDurationMinutes} mins</strong></span>
        </div>
      </div>
    </div>
  );
}
