import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Sparkles } from 'lucide-react';

export function SplashPage() {
  const navigate = useNavigate();

  const handleEnterPlatform = () => {
    navigate('/role-selection');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden text-center select-none">
      {/* Radial Glow Effect */}
      <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 animate-pulse"></div>

      {/* Main Clickable Logo Symbol Card */}
      <div className="relative z-10 max-w-md w-full space-y-6 animate-fadeIn">
        <button
          onClick={handleEnterPlatform}
          className="group focus:outline-none flex flex-col items-center mx-auto cursor-pointer"
        >
          {/* Logo Badge Icon */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white shadow-[0_0_60px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_90px_rgba(16,185,129,0.7)] group-hover:scale-110 transition-all duration-500 border border-emerald-300/50">
            <Leaf className="w-20 h-20 transform group-hover:rotate-12 transition-transform duration-500 drop-shadow-md" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          {/* Brand Name & Tagline */}
          <div className="mt-8 space-y-2">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white font-heading">
              REV<span className="eco-gradient-text">astra</span>
            </h1>
            <p className="text-sm font-semibold tracking-widest uppercase text-emerald-400">
              Turning Waste into Value
            </p>
          </div>
        </button>
      </div>

      {/* Subtle Footer with About Link */}
      <footer className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 text-center text-xs text-slate-400 font-medium">
        <span>REVastra Platform • Smart Waste-to-Value Ecosystem</span>
        <span>•</span>
        <button
          onClick={() => navigate('/about')}
          className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
        >
          About Platform
        </button>
      </footer>
    </div>
  );
}
