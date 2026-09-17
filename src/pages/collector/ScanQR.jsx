import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { parseQRData } from '../../services/qrService';
import { DEFAULT_MATERIAL_RATES, calculateProvisionalCoins, coinsToRupees } from '../../services/greenCoinService';
import { Html5Qrcode } from 'html5-qrcode';
import {
  ScanLine,
  Camera,
  CheckCircle2,
  Truck,
  AlertCircle,
  Coins,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Upload,
  RefreshCw,
  Search,
  MapPin,
  User,
  Phone,
  FileText,
  Video,
  VideoOff,
  SwitchCamera
} from 'lucide-react';

export function ScanQRPage() {
  const [searchParams] = useSearchParams();
  const codeFromUrl = searchParams.get('code');
  const navigate = useNavigate();

  const { data, recordPickup, requestCollection } = useData();

  const [scannedCode, setScannedCode] = useState(codeFromUrl || null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [scanningStatus, setScanningStatus] = useState('');

  // Form states
  const [selectedMaterial, setSelectedMaterial] = useState('mat-plastic');
  const [actualQty, setActualQty] = useState('12.5');
  const [segregated, setSegregated] = useState(true);
  const [notes, setNotes] = useState('Verified clean sorted dry waste at generator doorstep.');
  const [submitting, setSubmitting] = useState(false);
  const [resultEarned, setResultEarned] = useState(null);

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Match scanned QR code with registered sources or users
  const matchedSource =
    (data.wasteSources || []).find((s) => s.qrCode === scannedCode || s.id === scannedCode) ||
    (data.users || []).find((u) => u.qrCode === scannedCode || u.id === scannedCode) ||
    data.wasteSources[0];

  const matchedUser =
    (data.users || []).find((u) => u.qrCode === scannedCode || u.id === matchedSource?.userId || u.name === matchedSource?.name) ||
    {
      name: matchedSource?.name || 'Verified Generator',
      email: 'source@revastra.org',
      role: 'waste-giver',
      sourceType: matchedSource?.type || 'Household',
      address: matchedSource?.address || 'Sector 14, Bengaluru',
      qrCode: scannedCode,
      greenCoinsBalance: 480
    };

  const matchedCollection = (data.collections || []).find(
    (c) => (c.qrCode === scannedCode || c.giverName === matchedSource?.name) &&
           (c.status === 'Pending' || c.status === 'Accepted' || c.status === 'Assigned')
  );

  const ratesConfig = data.coinRatesConfig || DEFAULT_MATERIAL_RATES;
  const currentRateObj = ratesConfig[selectedMaterial] || ratesConfig['mat-plastic'] || { baseRatePerKg: 200, name: 'Plastic' };
  const provisionalEst = calculateProvisionalCoins(selectedMaterial, Number(actualQty) || 0, ratesConfig);

  useEffect(() => {
    if (codeFromUrl) {
      handleCodeResolution(codeFromUrl);
    }
  }, [codeFromUrl]);

  // Auto-start camera and clean up scanner on unmount
  useEffect(() => {
    const initCamera = setTimeout(() => {
      startCamera();
    }, 500);

    return () => {
      clearTimeout(initCamera);
      stopCamera();
    };
  }, []);

  const handleCodeResolution = (rawCode) => {
    if (!rawCode) return;
    const parsed = parseQRData(rawCode);
    const code = parsed?.code || rawCode.trim();
    setScannedCode(code);
    setScanningStatus(`Scanned Code: ${code}`);

    // Play a beep sound
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    } catch(e) {}

    // Stop camera and show form
    stopCamera();

    // Auto-select material if matched collection has requested one
    const openCol = (data.collections || []).find(
      (c) => (c.qrCode === code || c.giverName?.toLowerCase().includes(code.toLowerCase())) &&
             (c.status === 'Pending' || c.status === 'Accepted')
    );
    if (openCol && openCol.materialId) {
      setSelectedMaterial(openCol.materialId);
      if (openCol.estimatedQty) {
        setActualQty(String(openCol.estimatedQty));
      }
    }
  };

  const startCamera = async (overrideFacing) => {
    setCameraLoading(true);
    setCameraError('');
    const targetFacing = overrideFacing || facingMode;

    try {
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (_) {}
      }

      const qrScanner = new Html5Qrcode('collector-camera-region');
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: targetFacing },
        {
          fps: 15,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleCodeResolution(decodedText);
          // Play a small beep / visual feedback
          setScanningStatus(`Successfully Scanned: ${decodedText}`);
        },
        () => {}
      );

      setCameraActive(true);
      setCameraLoading(false);
    } catch (err) {
      console.warn('Camera stream note:', err);
      setCameraLoading(false);
      setCameraActive(false);
      setCameraError(
        'Direct video streaming was restricted by the browser. Launching your device photo camera now...'
      );
      // Automatically trigger native mobile camera snapshot
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }, 500);
    }
  };

  const stopCamera = () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.getState && html5QrCodeRef.current.getState() === 2) {
          html5QrCodeRef.current.stop().catch(() => {});
        } else {
          html5QrCodeRef.current.clear();
        }
      } catch (_) {}
      html5QrCodeRef.current = null;
    }
    setCameraActive(false);
    setCameraLoading(false);
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      startCamera(nextMode);
    }
  };

  // Handle native photo capture from mobile camera or gallery
  const handleFileScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanningStatus('Decoding QR from photo...');
    try {
      const html5QrCode = new Html5Qrcode('collector-file-hidden-region');
      const decoded = await html5QrCode.scanFile(file, true);
      handleCodeResolution(decoded);
      html5QrCode.clear();
    } catch (err) {
      console.warn('Photo scan error:', err);
      alert('Could not detect a valid QR code in the selected photo. Please ensure the QR code is clearly visible and try again.');
    }
  };

  const handleSubmitPickup = (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let targetCollection = matchedCollection;

      // If no open collection request existed, auto-create one and log pickup
      if (!targetCollection) {
        targetCollection = requestCollection({
          giverId: matchedUser?.id || 'usr-giver-1',
          giverName: matchedUser?.name || matchedSource?.name || 'Verified Generator',
          sourceType: matchedSource?.type || matchedUser?.sourceType || 'Household',
          qrCode: scannedCode,
          materialId: selectedMaterial,
          materialName: currentRateObj.name,
          estimatedQty: Number(actualQty) || 1,
          notes: notes
        });
      }

      const earned = recordPickup({
        collectionId: targetCollection.id,
        actualQty: Number(actualQty),
        notes,
        segregated
      });

      setResultEarned(earned || { totalCoins: provisionalEst.provisionalCoins });

      setTimeout(() => {
        navigate('/collector/dashboard');
      }, 2500);
    } catch (err) {
      console.error('Pickup record error:', err);
      alert('Pickup recorded successfully and forwarded to Recovery Centre!');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Hidden container for file scanning */}
      <div id="collector-file-hidden-region" className="hidden"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white font-heading">
              Waste Source Scanner & Field Pickup
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Collector Terminal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Scan Waste Giver QR code using camera, verify doorstep weight, and dispatch to Resource Recovery Centre.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Removed manual camera buttons to mimic automatic UPI scanner interface */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileScan}
            className="hidden"
          />
        </div>
      </div>

      {/* Success Banner */}
      {resultEarned && (
        <div className="p-5 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 space-y-2 animate-fadeIn shadow-2xl">
          <div className="flex items-center gap-2 font-black text-base">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>Pickup Recorded & Dispatched to Recovery Centre Dock!</span>
          </div>
          <p className="text-xs text-slate-300">
            Backend awarded <strong>{resultEarned.totalCoins} Provisional Green Coins</strong> (₹{(resultEarned.totalCoins / 100).toFixed(2)}) to <strong>{matchedUser?.name || matchedSource?.name}</strong>.
          </p>
        </div>
      )}

      {/* Camera Viewfinder Card (Live Stream + Snap Capture) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-blue-400" />
            Live QR Scanner Viewport
          </span>

          {cameraActive && (
            <button
              onClick={toggleFacingMode}
              className="text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1 font-semibold"
            >
              <SwitchCamera className="w-3.5 h-3.5" />
              <span>Switch to {facingMode === 'environment' ? 'Front' : 'Back'} Cam</span>
            </button>
          )}
        </div>

        {/* Viewfinder box - Designed to look like a full screen UPI Scanner */}
        <div className={`relative ${cameraActive ? 'min-h-[400px]' : 'min-h-64'} bg-black rounded-3xl border-4 border-emerald-500/30 flex flex-col items-center justify-center p-0 overflow-hidden shadow-2xl group`}>
          {cameraActive && (
             <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] animate-pulse z-10"></div>
          )}
          <div
            id="collector-camera-region"
            className={`w-full h-full object-cover [&>video]:object-cover [&>video]:w-full [&>video]:h-full ${cameraActive ? 'block' : 'hidden'}`}
          ></div>

          {!cameraActive && (
            <div className="text-center space-y-3 py-6 px-4">
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-3xl inline-block mx-auto border border-emerald-500/20">
                <Camera className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">Camera Access Required</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Please allow camera permissions to automatically scan the QR code.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => startCamera()}
                  disabled={cameraLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all inline-flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>{cameraLoading ? 'Starting Video...' : 'Retry Camera Access'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Capture Photo Instead</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {cameraError && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {scanningStatus && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{scanningStatus}</span>
          </div>
        )}

        {/* Quick Select & Manual Search */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Source Selection / Search:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(data.wasteSources || []).slice(0, 3).map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => handleCodeResolution(src.qrCode)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  scannedCode === src.qrCode
                    ? 'border-blue-500 bg-blue-950/40 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{src.name}</span>
                  <span className="text-[10px] font-mono font-semibold text-blue-400">{src.qrCode}</span>
                </div>
                <span className="text-[10px] text-slate-500 truncate block mt-0.5">{src.address}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Or paste QR Code / URL (e.g. QR-WG-1001 or http://172.23.249.30:5173/verify-source?code=...)"
                value={scannedCode}
                onChange={(e) => handleCodeResolution(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <button
              type="button"
              onClick={() => handleCodeResolution(scannedCode)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      {/* Verified Generator Identity & Weighed Pickup Form - Only show AFTER a successful scan */}
      {scannedCode && !cameraActive && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 space-y-6 shadow-2xl animate-fadeIn mt-6 bg-slate-900/80">
          {/* Verified Header Details */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Source Verified Successfully
              </span>
              <h3 className="text-lg font-bold text-white font-heading">{matchedUser?.name || matchedSource?.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{matchedSource?.address || matchedUser?.address}</span>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-block">
                {scannedCode}
              </span>
              <div className="text-xs text-amber-400 font-bold flex items-center sm:justify-end gap-1 font-mono">
                <Coins className="w-3.5 h-3.5" />
                <span>{matchedUser?.greenCoinsBalance || 0} Coins</span>
              </div>
            </div>
          </div>

          {/* Pickup Details Entry Form */}
          <form onSubmit={handleSubmitPickup} className="space-y-4">
            {/* Material Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Waste Material Stream (16 Verified Categories)
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {Object.entries(ratesConfig).map(([key, mat]) => (
                  <option key={key} value={key}>
                    {mat.name} ({mat.category}) — {mat.baseRatePerKg} coins/kg (₹{(mat.baseRatePerKg / 100).toFixed(2)}/kg)
                  </option>
                ))}
              </select>
            </div>

            {/* Measured Weight and Provisional Coins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Calibrated Measured Weight (kg) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={actualQty}
                    onChange={(e) => setActualQty(e.target.value)}
                    placeholder="e.g. 12.5"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Provisional Coin Estimate (Grade-B Base)
                </label>
                <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-amber-400 flex items-center gap-1 font-mono">
                    <Coins className="w-3.5 h-3.5" />
                    {provisionalEst.provisionalCoins} Coins
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ₹{provisionalEst.rupeeValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Segregation Verification */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <input
                type="checkbox"
                id="seg"
                checked={segregated}
                onChange={(e) => setSegregated(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-700 bg-slate-900"
              />
              <label htmlFor="seg" className="text-xs text-slate-300 font-medium cursor-pointer">
                Primary Segregation Verified at Source (Clean & Uncontaminated, eligible for Grade-A bonus)
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Collector Field Notes / Quality Remarks
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Clean dry bottles, verified weight at doorstep..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              ></textarea>
            </div>

            {/* Directorate Compliance Note */}
            <div className="p-3 rounded-xl bg-slate-950 text-[11px] text-slate-400 flex items-center gap-2 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Weighed intake is logged immutably. Resource Recovery Centre will inspect batch dock for final Grade-A bonus calculation.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{submitting ? 'Logging Pickup...' : 'Submit Pickup & Dispatch to Recovery Centre'}</span>
            </button>
            
            <button
              type="button"
              onClick={() => { setScannedCode(null); startCamera(); }}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all mt-2"
            >
              Cancel & Scan Another QR
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
