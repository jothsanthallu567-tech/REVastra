import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { ScanLine, CheckCircle2, Camera, Search, Sparkles, Video, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { parseQRData } from '../../services/qrService';
import { Html5Qrcode } from 'html5-qrcode';

export function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const { data } = useData();
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen && scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      setCameraActive(false);
    }
  }, [isOpen]);

  const handleProcessCode = (rawCode) => {
    const parsed = parseQRData(rawCode);
    const resolvedCode = parsed?.code || rawCode;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onScanSuccess(resolvedCode);
      onClose();
    }, 500);
  };

  const startCameraScanning = async () => {
    setCameraError('');
    try {
      const html5QrCode = new Html5Qrcode('qr-reader-region');
      scannerRef.current = html5QrCode;
      setCameraActive(true);

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 }
        },
        (decodedText) => {
          html5QrCode.stop().catch(() => {});
          setCameraActive(false);
          handleProcessCode(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.warn('Camera scanner initialization note:', err);
      setCameraError('Live video stream restricted by browser. Opening mobile camera capture...');
      setCameraActive(false);
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 400);
    }
  };

  const handleFileScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-modal-hidden-reader');
      const decoded = await html5QrCode.scanFile(file, true);
      handleProcessCode(decoded);
      html5QrCode.clear();
    } catch (err) {
      console.warn('File decode error:', err);
      alert('Could not decode QR code from the selected image. Please try again.');
    }
  };

  const stopCameraScanning = () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.getState && scannerRef.current.getState() === 2) {
          scannerRef.current.stop().catch(() => {});
        } else {
          scannerRef.current.clear();
        }
      } catch (_) {}
      setCameraActive(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Collector QR Scanner & Source Verification" maxWidth="max-w-lg">
      <div className="space-y-4">
        {/* Hidden elements for photo capture decoding */}
        <div id="qr-modal-hidden-reader" className="hidden"></div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleFileScan}
          className="hidden"
        />

        {/* Scanner Viewfinder Box */}
        <div className="relative min-h-52 bg-slate-950 rounded-2xl border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center p-4 overflow-hidden group">
          <div id="qr-reader-region" className={`w-full max-w-[280px] rounded-xl overflow-hidden ${cameraActive ? 'block' : 'hidden'}`}></div>

          {!cameraActive && (
            <>
              {scanning ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-emerald-400 font-semibold">Reading QR Identity & Fetching Location...</span>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl inline-block mx-auto">
                    <Camera className="w-8 h-8" />
                  </div>
                  <p className="text-xs font-bold text-slate-200">Live Camera QR Reader</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Point device camera at any generator QR code or network URL sticker.
                  </p>

                  <button
                    type="button"
                    onClick={startCameraScanning}
                    className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all inline-flex items-center gap-1.5"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Live Camera</span>
                  </button>
                </div>
              )}
            </>
          )}

          {cameraActive && (
            <button
              type="button"
              onClick={stopCameraScanning}
              className="mt-3 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Stop Camera
            </button>
          )}
        </div>

        {cameraError && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Quick Scan Presets for Field / Simulation */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Registered Source Quick Select:
            </span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {data.wasteSources.map((src) => (
              <button
                key={src.id}
                onClick={() => handleProcessCode(src.qrCode)}
                className="w-full p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-left transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{src.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      {src.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{src.address}</p>
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-400 shrink-0 ml-2">{src.qrCode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual QR Input */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Or enter / paste QR Code or URL (e.g. QR-WG-1001)..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => manualCode && handleProcessCode(manualCode)}
            disabled={!manualCode}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white transition-colors"
          >
            Verify
          </button>
        </div>
      </div>
    </Modal>
  );
}
