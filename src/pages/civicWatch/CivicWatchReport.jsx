import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
  Camera,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Upload,
  RefreshCw,
  Loader2,
  ArrowRight,
  Sparkles,
  Leaf,
  ShieldCheck,
  Compass,
  FileText,
  Clock,
  Layers,
  X,
  Phone,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';

const WASTE_TYPES = [
  'Plastic Waste',
  'Paper & Cardboard',
  'Food & Organic',
  'Construction Debris',
  'Mixed Solid Waste',
  'Electronic Waste',
  'Textile & Clothes',
  'Glass Bottles',
  'Hazardous / Chemical',
  'Overflowing Bin'
];

export function CivicWatchReport() {
  const { createCivicReport } = useData();
  const navigate = useNavigate();

  // Photo State
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  // Mandatory Location State
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [ward, setWard] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  // Form Fields
  const [wasteType, setWasteType] = useState('Mixed Solid Waste');
  const [urgency, setUrgency] = useState('Standard'); // Standard, High, Critical
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Reverse Geocoding helper
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9'
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.pedestrian || addr.street || '';
        const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || '';
        const city = addr.city || addr.town || addr.county || 'Bengaluru';
        const postcode = addr.postcode || '';

        const fullAddr = [road, suburb, city, postcode].filter(Boolean).join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        const localArea = suburb || city || 'Local Sector';
        
        let localWard = 'Ward 112 - Domlur / Indiranagar';
        if (suburb.toLowerCase().includes('koramangala') || lat < 12.95) {
          localWard = 'Ward 151 - Koramangala / South';
        } else if (suburb.toLowerCase().includes('whitefield') || lng > 77.7) {
          localWard = 'Ward 84 - Hagadur / Whitefield';
        } else if (suburb.toLowerCase().includes('hsr')) {
          localWard = 'Ward 174 - HSR Layout';
        } else if (suburb) {
          localWard = `Ward Sector - ${suburb}`;
        }

        return { fullAddr, localArea, localWard };
      }
    } catch (err) {
      console.warn('Geocoding notice:', err);
    }

    // Fallback based on coordinates
    const fallbackArea = lat > 12.97 ? 'Indiranagar / East Ward' : 'Koramangala / South Ward';
    const fallbackWard = lat > 12.97 ? 'Ward 112 - Domlur / Indiranagar' : 'Ward 151 - Koramangala';
    return {
      fullAddr: `Roadside Location near ${fallbackArea} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      localArea: fallbackArea,
      localWard: fallbackWard
    };
  };

  // Request device location
  const handleCaptureLocation = () => {
    setLocLoading(true);
    setLocError('');

    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your device/browser.');
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });

        const geo = await reverseGeocode(lat, lng);
        setAddress(geo.fullAddr);
        setArea(geo.localArea);
        setWard(geo.localWard);
        setLocLoading(false);
      },
      (err) => {
        console.warn('GPS notice (using fallback):', err);
        const fallbackLat = 12.9784;
        const fallbackLng = 77.6408;
        setCoords({ lat: fallbackLat, lng: fallbackLng });
        setAddress('100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, 560038');
        setArea('Indiranagar');
        setWard('Ward 112 - Domlur / Indiranagar');
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    handleCaptureLocation();
  }, []);

  // Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    setPhotoError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      setPhotoPreview(result);
      setPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Quick Preset Sample Photos
  const handleSelectPresetPhoto = (url) => {
    setPhotoUrl(url);
    setPhotoPreview(url);
    setPhotoError('');
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!photoUrl && !photoPreview) {
      setPhotoError('A photo of the roadside dumping is strictly required.');
      return;
    }

    if (!coords || !coords.lat || !coords.lng) {
      setLocError('GPS Location is required to pinpoint the dumping site.');
      return;
    }

    setSubmitting(true);

    try {
      const newReport = createCivicReport({
        photoUrl: photoPreview || photoUrl,
        latitude: coords.lat,
        longitude: coords.lng,
        address,
        area,
        ward,
        wasteType,
        urgency,
        description: description || `Reported ${wasteType} on roadside.`,
        landmark,
        reporterPhone: reporterPhone.trim() || 'Anonymous Citizen',
        concernedMunicipality: `${ward || area} Sanitation Wing`
      });

      setTimeout(() => {
        setSubmitting(false);
        navigate(`/civicwatch/success?id=${newReport.reportId}`);
      }, 500);
    } catch (err) {
      setSubmitting(false);
      setFormError('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 cleantech-grid-bg relative overflow-x-hidden selection:bg-teal-500 selection:text-white pb-16">
      {/* Background glow */}
      <div className="hero-glow top-0 left-1/2 -translate-x-1/2 opacity-25"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-teal-500/20 h-16">
        <div className="max-w-4xl mx-auto h-full px-4 flex items-center justify-between">
          <NavLink to="/civicwatch" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4 text-slate-400" />
            <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-md">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-white font-heading">
              REV<span className="text-teal-400">astra</span> CivicWatch
            </span>
          </NavLink>

          <NavLink
            to="/civicwatch/track"
            className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
          >
            Track Existing Report
          </NavLink>
        </div>
      </header>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>Public Incident Reporting • No Login Required</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-heading">
            Report Roadside Dumping
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Take a photo, verify your GPS location, and submit. The report will appear directly in System Admin for cleanup dispatch.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 1: PHOTO UPLOAD */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">1. Photo Evidence</h3>
                  <p className="text-[11px] text-slate-400">Clear visual proof of dumping site</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                Required
              </span>
            </div>

            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-teal-500/40 shadow-inner group">
                <img
                  src={photoPreview}
                  alt="Dumping preview"
                  className="w-full h-56 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setPhotoUrl('');
                  }}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-rose-600 text-white transition-colors"
                  title="Remove Photo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-sm p-2 flex items-center justify-between text-xs text-teal-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Photo attached
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-white hover:underline"
                  >
                    Change photo
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/80 flex flex-col items-center justify-center space-y-2.5"
              >
                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Click to Upload or Snap Photo</p>
                  <p className="text-xs text-slate-400 mt-0.5">Supports Camera capture or gallery files (JPEG, PNG, WebP)</p>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {photoError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{photoError}</span>
              </div>
            )}

            {/* Quick Demo Presets */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                Quick Sample Photos (Tap to select):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    title: 'Plastic Pile',
                    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=600'
                  },
                  {
                    title: 'Mixed Garbage',
                    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600'
                  },
                  {
                    title: 'Cardboard Scrap',
                    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600'
                  }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetPhoto(p.url)}
                    className="p-1.5 rounded-xl border border-slate-800 hover:border-teal-500/50 bg-slate-900/60 text-left transition-all flex items-center gap-2"
                  >
                    <img src={p.url} alt={p.title} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[11px] text-slate-300 truncate font-medium">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: GPS LOCATION */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-teal-500/40 bg-slate-900/60 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">2. GPS Location</h3>
                  <p className="text-[11px] text-slate-400">Pinpoints sector for rapid cleanups</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCaptureLocation}
                disabled={locLoading}
                className="px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-xs font-bold text-teal-300 flex items-center gap-1 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${locLoading ? 'animate-spin' : ''}`} />
                <span>{locLoading ? 'Detecting...' : 'Refresh GPS'}</span>
              </button>
            </div>

            {coords && (
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Detected Address & Ward:</span>
                    <span className="font-mono text-teal-300 font-bold text-[11px]">
                      {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </span>
                  </div>
                  <p className="font-bold text-white text-xs">{address}</p>
                  <p className="text-teal-400 text-[11px] font-semibold">{ward || area}</p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-800">
                  <InteractiveMap
                    height="160px"
                    markers={[
                      {
                        lat: coords.lat,
                        lng: coords.lng,
                        label: `Dumping Pin: ${address}`
                      }
                    ]}
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: WASTE TYPE & DETAILS */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">3. Incident Details</h3>
                <p className="text-[11px] text-slate-400">Category and severity for appropriate tooling</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Waste Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-teal-400 focus:outline-none"
                  >
                    {WASTE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Standard', 'High', 'Critical'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setUrgency(lvl)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                          urgency === lvl
                            ? lvl === 'Critical'
                              ? 'bg-rose-600 text-white'
                              : lvl === 'High'
                              ? 'bg-amber-600 text-white'
                              : 'bg-teal-600 text-white'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Landmark / Location Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Near metro pillar #140, behind bus shelter..."
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Your Mobile Number (Optional for SMS Status Updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210 (Leave blank for anonymous)"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:border-teal-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !coords || (!photoUrl && !photoPreview)}
              id="btn-submit-civic-report"
              className={`w-full py-4 rounded-2xl text-base font-black tracking-wide shadow-xl flex items-center justify-center gap-2.5 transition-all ${
                !coords || (!photoUrl && !photoPreview)
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-white shadow-teal-500/30 transform hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Grievance to System Admin...</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span>SUBMIT DUMPING REPORT</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Zero citizen login required • Report instantly synchronizes to System Admin for triage.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
