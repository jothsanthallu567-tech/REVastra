import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { getSourceQRUrl, DEFAULT_NETWORK_HOST } from '../../services/qrService';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Globe,
  ExternalLink,
  Sparkles,
  Smartphone,
  Edit2,
  RefreshCw,
  Code
} from 'lucide-react';

export function MyQRPage() {
  const { currentUser } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedBase64, setCopiedBase64] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Network IP / Localhost URL configuration
  const detectedOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://10.87.201.156:5173';
  const [hostUrl, setHostUrl] = useState(() => {
    const saved = localStorage.getItem('revastra_qr_host');
    if (saved && !saved.includes('172.23.249.30')) {
      return saved;
    }
    return detectedOrigin;
  });

  const rawQrCode = currentUser?.qrCode || 'QR-WG-1001';
  const scannableUrl = getSourceQRUrl(rawQrCode, hostUrl);

  const qrContainerRef = useRef(null);

  const handleSaveHost = (newHost) => {
    setHostUrl(newHost);
    localStorage.setItem('revastra_qr_host', newHost);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawQrCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(scannableUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Convert SVG QR to high-res PNG and download
  const handleDownloadPNG = () => {
    const svgElement = qrContainerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 600;
    canvas.height = 600;

    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `REVastra-QR-${rawQrCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Copy Base64 PNG data string
  const handleCopyBase64 = () => {
    const svgElement = qrContainerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 400;
    canvas.height = 400;

    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngBase64 = canvas.toDataURL('image/png');
      navigator.clipboard.writeText(pngBase64);
      setCopiedBase64(true);
      setTimeout(() => setCopiedBase64(false), 2000);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Real-Time Scannable QR Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
          My Waste Source QR Identity
        </h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Authorized collectors can scan this QR code using any smartphone or camera to instantly verify your source details and log doorstep collections.
        </p>
      </div>

      {/* Main QR Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl text-center">
        {/* QR Display Container */}
        <div
          ref={qrContainerRef}
          className="p-6 bg-white rounded-3xl inline-block shadow-2xl border-4 border-emerald-500/40 relative group"
        >
          <QRCodeSVG
            value={scannableUrl}
            size={240}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Identity Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="px-4 py-1.5 rounded-full text-sm font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {rawQrCode}
            </span>
          </div>

          <h3 className="text-xl font-black text-white font-heading mt-2">{currentUser?.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{currentUser?.address}</p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-950 text-slate-300 border border-slate-800">
              {currentUser?.sourceType || 'Household'} Generator
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {currentUser?.greenCoinsBalance || 480} Green Coins (₹{((currentUser?.greenCoinsBalance || 480) / 100).toFixed(2)})
            </span>
          </div>
        </div>

        {/* Live Scannable Link Display */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Scannable Target URL (Injected into QR):
            </span>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Edit2 className="w-3 h-3" />
              {showConfig ? 'Hide Host Config' : 'Change Network IP / Host'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
            <span className="truncate">{scannableUrl}</span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopyUrl}
                title="Copy Full Scannable URL"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                {copiedUrl ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={scannableUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Test Open in New Tab"
                className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Configurable Host Panel (Allows user to paste their local IP & Port) */}
          {showConfig && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2.5 animate-fadeIn">
              <p className="text-[11px] text-slate-300">
                To scan this QR on a mobile phone on the same Wi-Fi network, set your computer's local network IP URL:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={hostUrl}
                  onChange={(e) => handleSaveHost(e.target.value)}
                  placeholder="e.g. http://172.23.249.30:5173"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400">Quick Presets:</span>
                <button
                  onClick={() => handleSaveHost(window.location.origin)}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono hover:bg-emerald-500/20"
                >
                  Current Browser ({window.location.origin})
                </button>
                <button
                  onClick={() => handleSaveHost('https://10.87.201.156:5173')}
                  className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-mono hover:bg-blue-500/20"
                >
                  Wi-Fi Network (https://10.87.201.156:5173)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <button
            onClick={handleCopyCode}
            className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleCopyBase64}
            className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copiedBase64 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
            <span>{copiedBase64 ? 'Copied Base64' : 'Copy Base64'}</span>
          </button>

          <button
            onClick={handleDownloadPNG}
            className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save PNG</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sticker</span>
          </button>
        </div>
      </div>

      {/* Collector / Mobile Scanner Guide Box */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          How Authorized Collectors Scan This QR:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">1. Point Camera</strong>
            <span>Scan with phone camera or REVastra Collector Scanner portal.</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">2. Verify & Weigh</strong>
            <span>Doorstep terminal opens verified details and logs weight in kg.</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">3. Instant Coins</strong>
            <span>Provisional Green Coins are awarded to your wallet in real time.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
