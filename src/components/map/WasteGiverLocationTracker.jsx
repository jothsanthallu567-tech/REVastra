import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  MapPin,
  Radio,
  Navigation,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  Compass,
  Crosshair,
  Sliders,
  Check
} from 'lucide-react';

// Custom Animated Markers using Leaflet divIcon (zero external image dependency)
const createGiverIcon = (isLive, isManual) =>
  L.divIcon({
    className: 'giver-location-marker',
    html: `
      <div class="relative flex items-center justify-center" style="width: 36px; height: 36px;">
        ${
          isLive && !isManual
            ? '<span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 animate-ping"></span>'
            : ''
        }
        <div class="relative w-8 h-8 rounded-full ${
          isManual ? 'bg-amber-500 ring-4 ring-amber-500/30' : 'bg-emerald-600 ring-4 ring-emerald-500/30'
        } border-2 border-white shadow-xl flex items-center justify-center text-white text-xs">
          ${isManual ? '📍' : '♻️'}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });

// Helper component to center and pan map smoothly
function MapCenterController({ center, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

// Click listener inside Leaflet for manual fallback selection
function MapClickInterceptor({ onManualClick, isManualMode }) {
  useMapEvents({
    click(e) {
      if (onManualClick) {
        onManualClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export function WasteGiverLocationTracker({
  height = '360px',
  onLocationChange = null,
  showTitle = true,
  compact = false
}) {
  const { currentUser } = useAuth();
  const { updateWasteGiverLiveLocation, liveGiverLocation } = useData();

  // Initial coordinates: Bengaluru tech zone default or stored position
  const initialLat = liveGiverLocation?.lat || 12.9716;
  const initialLng = liveGiverLocation?.lng || 77.5946;

  // Toggle & Mode States
  const [isSharing, setIsSharing] = useState(liveGiverLocation?.isLive ?? true);
  const [trackingMode, setTrackingMode] = useState(
    liveGiverLocation?.isManual ? 'manual' : 'gps'
  ); // 'gps' | 'manual'

  // Position & Accuracy
  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [accuracy, setAccuracy] = useState(liveGiverLocation?.accuracy || 15);
  const [address, setAddress] = useState(
    liveGiverLocation?.address || currentUser?.address || 'Indiranagar 100ft Road, Bengaluru, Karnataka'
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Reference for watchPosition ID
  const watchIdRef = useRef(null);

  // Reverse geocoding helper via OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en-US,en;q=0.8' } }
      );
      if (!response.ok) throw new Error('Geocoding response not ok');
      const data = await response.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const parts = [
          addr.building || addr.house_number,
          addr.road || addr.street,
          addr.neighbourhood || addr.suburb,
          addr.city || addr.town || addr.county,
          addr.state,
          addr.postcode
        ].filter(Boolean);
        const resolved = parts.length > 0 ? parts.join(', ') : data.display_name;
        setAddress(resolved);
        return resolved;
      }
    } catch {
      // Fallback formatting if offline or rate-limited
      const fallback = `Lat: ${lat.toFixed(5)}, Lng: ${lon.toFixed(5)} (Bengaluru)`;
      setAddress(fallback);
      return fallback;
    }
  };

  // Broadcast & Sync function to DataContext, localStorage, and server
  const broadcastLocation = useCallback(
    (lat, lng, acc, manualFlag, sharingFlag, explicitAddress = null) => {
      const resolvedAddress = explicitAddress || address;
      const payload = {
        giverId: currentUser?.id || 'usr-giver-1',
        giverName: currentUser?.name || 'Ananya Sharma',
        lat,
        lng,
        accuracy: acc,
        address: resolvedAddress,
        isLive: sharingFlag,
        isManual: manualFlag
      };

      // Call DataContext helper
      if (updateWasteGiverLiveLocation) {
        updateWasteGiverLiveLocation(payload);
      }

      // Trigger optional prop callback
      if (onLocationChange) {
        onLocationChange(payload);
      }
    },
    [currentUser, address, updateWasteGiverLiveLocation, onLocationChange]
  );

  // Stop GPS watch
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsLocating(false);
  }, []);

  // Start GPS watch with HTML5 Geolocation API
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg('HTML5 Geolocation is not supported by your browser.');
      setTrackingMode('manual');
      return;
    }

    stopWatching();
    setErrorMsg(null);
    setIsLocating(true);
    setStatusMessage('Acquiring high-accuracy GPS signal...');

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy || 10);

        setCoords({ lat, lng });
        setAccuracy(acc);
        setIsLocating(false);
        setStatusMessage(`Live GPS locked (Accuracy: ±${acc}m)`);
        setErrorMsg(null);

        // Fetch street address
        const resolvedAddr = await reverseGeocode(lat, lng);
        broadcastLocation(lat, lng, acc, false, true, resolvedAddr);
      },
      (err) => {
        setIsLocating(false);
        let errorText = 'GPS signal unavailable. Switched to Manual Map Pinpoint.';
        if (err.code === 1) {
          errorText = 'Location permission denied by browser. Switched to Manual Pinpoint.';
        } else if (err.code === 3) {
          errorText = 'Location request timed out. Switched to Manual Pinpoint.';
        }
        setErrorMsg(errorText);
        // Seamless fallback to manual click mode
        setTrackingMode('manual');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 4000,
        timeout: 12000
      }
    );
  }, [stopWatching, broadcastLocation]);

  // Effect to handle toggling and mode switching
  useEffect(() => {
    if (!isSharing) {
      stopWatching();
      setStatusMessage('Location sharing paused.');
      broadcastLocation(coords.lat, coords.lng, accuracy, trackingMode === 'manual', false);
      return;
    }

    if (trackingMode === 'gps') {
      startWatching();
    } else {
      stopWatching();
      setStatusMessage('Manual Map Pinpoint active. Click map to set doorstep point.');
      broadcastLocation(coords.lat, coords.lng, accuracy, true, true);
    }

    return () => stopWatching();
  }, [isSharing, trackingMode]);

  // Handle Manual Click on Leaflet Map
  const handleManualMapClick = async (clickedLat, clickedLng) => {
    // If not in manual mode, automatically switch to manual mode when user clicks the map
    if (trackingMode !== 'manual') {
      stopWatching();
      setTrackingMode('manual');
    }

    const cleanLat = Number(clickedLat.toFixed(6));
    const cleanLng = Number(clickedLng.toFixed(6));
    setCoords({ lat: cleanLat, lng: cleanLng });
    setAccuracy(null);
    setStatusMessage(`Manual doorstep pin placed at [${cleanLat}, ${cleanLng}]`);
    setErrorMsg(null);

    // If sharing was off, toggle it on
    if (!isSharing) {
      setIsSharing(true);
    }

    const resolvedAddr = await reverseGeocode(cleanLat, cleanLng);
    broadcastLocation(cleanLat, cleanLng, null, true, true, resolvedAddr);
  };

  // Toggle Sharing Handler
  const handleToggleSharing = () => {
    const nextState = !isSharing;
    setIsSharing(nextState);
  };

  // Manual button fallback click
  const handleTriggerManualMode = () => {
    stopWatching();
    setTrackingMode('manual');
    setStatusMessage('Manual Mode Activated: Click any spot on the map to set your exact doorstep location.');
  };

  // Re-center on GPS
  const handleCenterOnGPS = () => {
    setTrackingMode('gps');
    if (!isSharing) setIsSharing(true);
    startWatching();
  };

  // Copy coordinates
  const handleCopyCoords = () => {
    const text = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isSharing
            ? trackingMode === 'gps'
              ? 'bg-emerald-500/15'
              : 'bg-amber-500/15'
            : 'bg-slate-700/10'
        }`}
      />

      {/* Header & Controls Row */}
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl border transition-colors ${
                isSharing
                  ? trackingMode === 'gps'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400'
              }`}
            >
              <Radio
                className={`w-5 h-5 ${
                  isSharing && trackingMode === 'gps' ? 'animate-pulse' : ''
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-heading">
                  Live Doorstep Location Radar
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                    isSharing
                      ? trackingMode === 'gps'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSharing
                        ? trackingMode === 'gps'
                          ? 'bg-emerald-400 animate-ping'
                          : 'bg-amber-400'
                        : 'bg-slate-500'
                    }`}
                  />
                  {isSharing
                    ? trackingMode === 'gps'
                      ? 'Live GPS Active'
                      : 'Manual Pin Active'
                    : 'Sharing Off'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Broadcasting doorstep GPS coordinates to assigned Municipal Collectors in real time
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-300">
              {isSharing ? 'Sharing On' : 'Sharing Off'}
            </span>
            <button
              type="button"
              id="share-location-toggle"
              onClick={handleToggleSharing}
              aria-label="Toggle live location sharing"
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                isSharing ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isSharing ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Mode Switcher Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            id="mode-gps-btn"
            onClick={handleCenterOnGPS}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              trackingMode === 'gps' && isSharing
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>Auto GPS Stream</span>
          </button>

          <button
            type="button"
            id="mode-manual-btn"
            onClick={handleTriggerManualMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              trackingMode === 'manual' && isSharing
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Manual Map Pinpoint</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {trackingMode === 'manual' && (
            <span className="text-[11px] text-amber-300/90 font-medium bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-amber-400" />
              Click any point on map below
            </span>
          )}
          <button
            type="button"
            onClick={handleCopyCoords}
            title="Copy coordinates"
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Coords'}</span>
          </button>
        </div>
      </div>

      {/* Error / Feedback Alert Banners */}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={handleTriggerManualMode}
            className="underline hover:text-white shrink-0 font-semibold"
          >
            Use Manual Map Pin
          </button>
        </div>
      )}

      {/* Interactive Leaflet Map View */}
      <div
        style={{ height }}
        className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner relative z-0 group"
      >
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={15}
          minZoom={3}
          worldCopyJump={true}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          {/* 100% Free OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Accuracy circle if GPS is active and accuracy available */}
          {isSharing && trackingMode === 'gps' && accuracy && (
            <Circle
              center={[coords.lat, coords.lng]}
              radius={accuracy}
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.12,
                weight: 1
              }}
            />
          )}

          {/* Waste Giver Marker */}
          <Marker
            position={[coords.lat, coords.lng]}
            icon={createGiverIcon(isSharing, trackingMode === 'manual')}
            draggable={trackingMode === 'manual'}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handleManualMapClick(position.lat, position.lng);
              }
            }}
          >
            <Popup className="revastra-map-popup">
              <div className="p-1 space-y-1 text-slate-900 text-xs">
                <div className="font-bold flex items-center gap-1 text-emerald-800">
                  <span>{currentUser?.name || 'Waste Giver Doorstep'}</span>
                </div>
                <p className="text-[11px] text-slate-600">{address}</p>
                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                  {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                  {accuracy ? ` (±${accuracy}m)` : ''}
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Smooth Recenter */}
          <MapCenterController center={[coords.lat, coords.lng]} />

          {/* Map click listener for manual placement */}
          <MapClickInterceptor
            onManualClick={handleManualMapClick}
            isManualMode={trackingMode === 'manual'}
          />
        </MapContainer>

        {/* Map Overlay Badge */}
        <div className="absolute top-3 right-3 z-[1000] pointer-events-none">
          <div className="glass-panel px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-950/80 text-[10px] text-slate-300 font-mono shadow-lg flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSharing
                  ? trackingMode === 'gps'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-amber-400'
                  : 'bg-slate-500'
              }`}
            />
            <span>
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </span>
          </div>
        </div>

        {/* Manual Click Hint Banner */}
        {trackingMode === 'manual' && (
          <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
            <div className="glass-panel px-3 py-1.5 rounded-xl border border-amber-500/40 bg-slate-950/90 text-[11px] text-amber-300 font-medium shadow-lg flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Click anywhere on the map or drag the pin to position your doorstep</span>
            </div>
          </div>
        )}
      </div>

      {/* Location Details Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Resolved Address
          </span>
          <p className="text-xs font-semibold text-white truncate" title={address}>
            {address || 'Fetching address...'}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Current Coordinates
          </span>
          <p className="text-xs font-mono font-bold text-emerald-400">
            {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Stream Status
          </span>
          <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{statusMessage || 'Idle'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
