import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { RouteOptimizerView } from '../../components/ai/RouteOptimizerView';
import { LiveTrackingMap } from '../../components/map/LiveTrackingMap';
import {
  Milestone,
  Clock,
  MapPin,
  Zap,
  Radio,
  Layers,
  Compass
} from 'lucide-react';

export function CollectorRoutes() {
  const { data } = useData();

  // All available routes in data (with guaranteed fallback to multiple routes)
  const allRoutes = useMemo(() => {
    if (data.routes && data.routes.length > 0) return data.routes;
    return [];
  }, [data.routes]);

  // Selected route index (e.g., Corridor 4, Corridor 7, Corridor 2)
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const activeRoute = allRoutes[selectedRouteIdx] || allRoutes[0];

  // Active target stop / Waste Giver for live point-to-point routing
  const [selectedStopId, setSelectedStopId] = useState(() => {
    return activeRoute?.stops?.[0]?.id || 'stop-1';
  });

  // Live OSRM route statistics
  const [liveRouteStats, setLiveRouteStats] = useState({
    distanceKm: '0.85',
    durationText: '2 mins',
    summary: 'OSRM Driving Engine'
  });

  // Find currently targeted stop object
  const currentTargetStop = useMemo(() => {
    if (!activeRoute || !activeRoute.stops) return null;
    const found = activeRoute.stops.find((s) => s.id === selectedStopId);
    if (found) return found;
    return activeRoute.stops[0];
  }, [activeRoute, selectedStopId]);

  // Handle route change
  const handleRouteChange = (idx) => {
    setSelectedRouteIdx(idx);
    const newRoute = allRoutes[idx];
    if (newRoute && newRoute.stops && newRoute.stops.length > 0) {
      setSelectedStopId(newRoute.stops[0].id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">
            Collector Routes & Live OSRM Navigation
          </h1>
          <p className="text-xs text-slate-400">
            Real-time turn-by-turn trajectory between Collector vehicle and assigned Waste Giver doorsteps with alternative routes
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Live GPS & OSRM Engine Active</span>
        </div>
      </div>

      {/* Multiple Assigned Routes Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Assigned Collector Corridors ({allRoutes.length} active routes):
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Switch corridor to view assigned stops
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allRoutes.map((rt, idx) => (
            <button
              type="button"
              key={rt.id}
              onClick={() => handleRouteChange(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                selectedRouteIdx === idx
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-xl shadow-blue-600/20 ring-1 ring-blue-400/40'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400">{rt.id}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {rt.stops?.length || 0} Stops
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{rt.name}</h4>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 mt-2 border-t border-slate-800/80">
                <span>{rt.totalDistanceKm} km total</span>
                <span className="text-amber-400 font-medium">~{rt.estimatedDurationMinutes} mins</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Dynamic KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Distance Card */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Route Distance
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Milestone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {liveRouteStats.distanceKm ? `${liveRouteStats.distanceKm} km` : '0.85 km'}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">
            Dynamic polyline trajectory to doorstep
          </p>
        </div>

        {/* Appropriate Time / ETA Card */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Appropriate Travel Time
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-heading">
            {liveRouteStats.durationText ? liveRouteStats.durationText : '2 mins'}
          </div>
          <p className="text-[11px] text-slate-400">
            Real-time traffic-adjusted EV transit time
          </p>
        </div>

        {/* Active Target Waste Giver Card */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Target Waste Giver
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-white font-heading truncate">
            {currentTargetStop?.name || 'Ananya Sharma (Doorstep)'}
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {currentTargetStop?.address || 'Indiranagar 100ft Road, Bengaluru'}
          </p>
        </div>

        {/* Routing Engine Card */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Routing Engine
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-extrabold text-cyan-300 font-heading">
            OSRM Free Engine
          </div>
          <p className="text-[11px] text-cyan-400/80 font-medium">
            Multiple routes • 10s auto-refresh
          </p>
        </div>
      </div>

      {/* Embedded Leaflet Map Container */}
      <div>
        <LiveTrackingMap
          height="420px"
          label="Collector EV KA-01-EV-4092"
          showWasteGiver={true}
          targetGiver={currentTargetStop}
          assignedStops={activeRoute?.stops || []}
          onSelectStop={(stop) => setSelectedStopId(stop.id)}
          onRouteCalculated={({ distanceKm, durationText, summary }) =>
            setLiveRouteStats({ distanceKm, durationText, summary })
          }
        />
      </div>

      {/* AI Node Sequencer Optimization */}
      {activeRoute && <RouteOptimizerView route={activeRoute} />}

      {/* Assigned Stop Sequence with Interactive Routing Switchers */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Assigned Stop Sequence & Doorstep Destinations
            </h3>
            <p className="text-xs text-slate-400">
              Click any stop below to immediately recalculate the live OSRM route, distance, and appropriate arrival time
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
            {activeRoute?.name}
          </span>
        </div>

        <div className="space-y-2.5">
          {(activeRoute?.stops || []).map((stop) => {
            const isTarget = currentTargetStop?.id === stop.id;
            return (
              <div
                key={stop.stopOrder}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isTarget
                    ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs border ${
                      isTarget
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    #{stop.stopOrder}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{stop.name}</p>
                      {isTarget && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          Active Target
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {stop.address} • QR: <span className="font-mono text-slate-300">{stop.qrCode}</span>
                    </p>
                    {stop.material && (
                      <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        Material: {stop.material} (~{stop.estimatedQty} kg)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      stop.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {stop.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedStopId(stop.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isTarget
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isTarget ? 'Routing Active' : 'Navigate Here'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
