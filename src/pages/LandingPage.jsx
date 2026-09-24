import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Leaf,
  QrCode,
  Truck,
  Building2,
  Coins,
  Store,
  Heart,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BarChart3,
  Cpu,
  Layers,
  Repeat,
  Info,
  Scale,
  Boxes,
  DollarSign,
  AlertTriangle,
  Globe,
  Award,
  Zap,
  Check,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  Clock,
  MapPin,
  TrendingUp,
  FileCheck2,
  Camera
} from 'lucide-react';

export function LandingPage() {
  const { switchRoleDemo } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleQuickDemoRole = (roleKey, targetUrl) => {
    switchRoleDemo(roleKey);
    navigate(targetUrl);
  };

  const steps = [
    {
      num: '01',
      title: 'SOURCE',
      sub: 'Waste Generators',
      desc: 'Households, shops, institutions, and restaurants generate segregated dry recyclables & surplus food with verified QR source tags.',
      icon: QrCode,
      color: 'emerald'
    },
    {
      num: '02',
      title: 'IDENTIFY',
      sub: 'Dynamic QR Source Identity',
      desc: 'Each waste giver receives an immutable QR identity linking their location, generator type, and digital reward wallet.',
      icon: QrCode,
      color: 'teal'
    },
    {
      num: '03',
      title: 'COLLECT',
      sub: 'Collector Scans & Records',
      desc: 'Authorized field collectors scan QR codes at doorstep, weigh materials, and log verified collection entries into cloud ledger.',
      icon: Truck,
      color: 'blue'
    },
    {
      num: '04',
      title: 'RECOVER',
      sub: 'Secondary Segregation & Grading',
      desc: 'Resource Recovery Centres (RRCs) inspect incoming batches, perform precision weighing, and assign Quality Grade A / B / C.',
      icon: Scale,
      color: 'cyan'
    },
    {
      num: '05',
      title: 'INVENTORY',
      sub: 'Digital Marketplace Stock',
      desc: 'Admin-verified batches automatically publish to B2B marketplace catalog with immutable Batch IDs and price benchmarks.',
      icon: Boxes,
      color: 'purple'
    },
    {
      num: '06',
      title: 'MARKET',
      sub: 'B2B Recycler Purchase',
      desc: 'Verified industrial recyclers discover quality-graded stock, place escrow purchase orders, and integrate raw materials into production.',
      icon: Store,
      color: 'rose'
    },
    {
      num: '07',
      title: 'REWARD',
      sub: 'Green Coins & Grocery Rewards',
      desc: 'Responsible contributors receive verified Green Coins (100 coins = ₹1 INR) redeemable for essential grocery packages.',
      icon: Coins,
      color: 'amber'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white cleantech-grid-bg relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="hero-glow top-10 left-1/2 -translate-x-1/2 opacity-25"></div>
      <div className="hero-glow top-[1200px] left-1/4 opacity-15"></div>
      <div className="hero-glow top-[2600px] right-1/4 opacity-15"></div>

      {/* TOP NAVIGATION HEADER */}
      <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-emerald-500/15 h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-heading">
                REV<span className="text-emerald-400">astra</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Smart Circular Waste-to-Value Platform
              </span>
            </div>
          </NavLink>

          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#about-platform" className="hover:text-emerald-400 transition-colors">About Platform</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#portals" className="hover:text-emerald-400 transition-colors">Portals</a>
            <a href="#civicwatch" className="hover:text-teal-400 transition-colors">Civic Watch</a>
            <a href="#traceability" className="hover:text-emerald-400 transition-colors">Traceability</a>
            <a href="#marketplace" className="hover:text-emerald-400 transition-colors">Marketplace</a>
            <a href="#food-rescue" className="hover:text-emerald-400 transition-colors">Food Rescue</a>
            <a href="#impact" className="hover:text-emerald-400 transition-colors">Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/civicwatch"
              className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-xs font-bold text-teal-300 border border-teal-500/40 transition-all flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Civic Watch (No Login)</span>
            </NavLink>

            <NavLink
              to="/role-selection"
              className="px-4 py-2 rounded-xl eco-gradient-btn text-xs font-extrabold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Access Portals</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Clean & Green Technology • Smart City Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight leading-[1.15]">
              Waste isn't waste when it has <span className="eco-gradient-text">verifiable value</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              Digitizing the journey from waste collection to recovery, verified inventory, responsible reuse, and sustainable rewards. Empowering citizens and cities to transform urban waste into high-grade circular industrial resources.
            </p>

            {/* Visual Mini Pipeline Flow Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/20 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-300">
              <span className="text-emerald-400">SOURCE</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span>COLLECTION</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span>RECOVERY</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-teal-400">INVENTORY</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-purple-400">MARKETPLACE</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-amber-400">GREEN COINS</span>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <NavLink
                to="/role-selection"
                className="px-6 py-3.5 rounded-2xl eco-gradient-btn text-xs font-extrabold text-white shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Get Started (Choose Portal)</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>

              <NavLink
                to="/civicwatch"
                className="px-5 py-3.5 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-xs font-bold text-teal-300 border border-teal-500/40 transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Civic Watch Portal (No Login)</span>
              </NavLink>

              <button
                onClick={() => handleQuickDemoRole('admin', '/admin/dashboard')}
                className="px-4 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-300 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>System Admin Demo</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5 relative">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-white">Live REVastra Network Feed</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  Real-Time Active
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="font-bold text-white">Doorstep QR Verified</p>
                      <p className="text-[10px] text-slate-400">Indiranagar Sector 4 • 4.2 kg PET</p>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">+140 Coins</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-teal-400" />
                    <div>
                      <p className="font-bold text-white">Civic Watch Incident Reported</p>
                      <p className="text-[10px] text-slate-400">100 Ft Road • Mixed Debris</p>
                    </div>
                  </div>
                  <span className="font-mono text-teal-400 font-bold">Auto-Geotagged</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="font-bold text-white">Surplus Meals Rescued</p>
                      <p className="text-[10px] text-slate-400">Grand Kitchens • 45 Packed Meals</p>
                    </div>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">NGO Dispatched</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="font-bold text-white">B2B Escrow Order Verified</p>
                      <p className="text-[10px] text-slate-400">EcoPolymer Ltd • 500 kg PET Bales</p>
                    </div>
                  </div>
                  <span className="font-mono text-purple-400 font-bold">₹21,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ABOUT PLATFORM & NEW ECOSYSTEM FEATURES
          ======================================================== */}
      <section id="about-platform" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen CleanTech Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading">
            About the <span className="eco-gradient-text">REVastra Platform</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            REVastra is India's most advanced circular waste-to-value digital platform. We seamlessly bridge the gap between waste generators, field collectors, community food rescue, public civic grievances, Resource Recovery Centres, and industrial recyclers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Civic Watch */}
          <div className="glass-panel p-6 rounded-3xl border border-teal-500/30 bg-slate-900/60 hover:border-teal-400 transition-all space-y-3 group">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 w-fit group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Civic Watch (Zero Login)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Public 1-click grievance portal allowing any citizen to photograph roadside dumping and geo-tag coordinates with zero account required. Synchronizes straight to System Admin.
            </p>
          </div>

          {/* Feature 2: QR Doorstep Tracking */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all space-y-3 group">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Dynamic QR Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every source generator gets an encrypted QR code tag. Collectors scan and weigh on-site at doorstep, guaranteeing source transparency and preventing fraudulent records.
            </p>
          </div>

          {/* Feature 3: Live GPS Location & Routing */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/40 transition-all space-y-3 group">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Live Location & Fleet Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time GPS coordinate capture and optimized collection routes across municipal zones, reducing fuel consumption and speeding up door-to-door waste pickups.
            </p>
          </div>

          {/* Feature 4: Surplus Food Rescue */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-amber-500/40 transition-all space-y-3 group">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Zero-Waste Food Rescue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Commercial kitchens, cafeterias, and restaurants list edible surplus meals. Verified NGOs receive instantaneous alerts to collect and feed local communities before spoilage.
            </p>
          </div>

          {/* Feature 5: Green Coins & Grocery */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-amber-500/40 transition-all space-y-3 group">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Green Coins & Grocery Rewards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Citizens earn tokenized Green Coins (100 coins = ₹1 INR) redeemable for daily essentials like rice, dal, and cooking oil at RRC kiosks and partnered supermarkets.
            </p>
          </div>

          {/* Feature 6: B2B Circular Marketplace */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/40 transition-all space-y-3 group">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">B2B Circular Marketplace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recycling industries procure quality-graded materials (washed PET flakes, cardboard bales, metal scrap) with digital escrow payments and automated tax invoices.
            </p>
          </div>

          {/* Feature 7: Immutable Traceability */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all space-y-3 group">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Immutable Batch Traceability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every kilogram of processed waste is tracked with a unique Batch ID from original household generator through collector, RRC dock, and industrial manufacturer.
            </p>
          </div>

          {/* Feature 8: System Admin Directorate */}
          <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-slate-900/60 hover:border-rose-400 transition-all space-y-3 group">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Admin Command Center</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              360° oversight of urban recovery centres, marketplace pricing, fraud mitigation, revenue models, carbon ESG analytics, and real-time civic grievances triage.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          CIVICWATCH SPOTLIGHT BANNER
          ======================================================== */}
      <section id="civicwatch" className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-teal-500/40 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 shadow-2xl relative overflow-hidden">
          <div className="hero-glow top-0 right-0 opacity-20"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold">
                <Camera className="w-4 h-4" />
                <span>ReVastra CivicWatch • Public Citizen Portal (No Login Required)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
                See Waste Dumped on the Road?
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Report roadside dumping with a photo and instant GPS location. ReVastra connects reports directly into System Admin for rapid dispatch, cleanup, and secondary recovery.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Mandatory GPS accuracy</span>
                </div>
                <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Direct Admin triage</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                  <Repeat className="w-4 h-4 text-purple-400" />
                  <span>Connected to RRC Recovery</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto shrink-0">
              <NavLink
                to="/civicwatch/report"
                id="btn-report-dumping-home"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-white text-base font-black tracking-wide shadow-xl shadow-teal-500/30 transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Camera className="w-5 h-5 animate-pulse" />
                <span>Report Roadside Dumping</span>
                <ArrowRight className="w-4 h-4" />
              </NavLink>

              <NavLink
                to="/civicwatch"
                className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold text-center transition-colors"
              >
                Open CivicWatch Portal
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PORTALS SECTION (UPDATED: 6 SPECIALIZED PORTALS)
          ======================================================== */}
      <section id="portals" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Domain Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Dedicated Portals for Every Domain Actor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Strict role-based isolation ensures collectors, recyclers, citizens, and admins only see authorized operational workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Waste Giver */}
          <div
            onClick={() => handleQuickDemoRole('waste-giver', '/waste-giver/dashboard')}
            className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:translate-y-[-2px] space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Portal #1
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Waste Giver Portal</h3>
              <p className="text-xs text-slate-400 mt-1">
                Households, restaurants, shops, and colleges generate QR tags, request waste pickup, track Green Coins, and donate surplus unserved food.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Launch Waste Giver Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Collector */}
          <div
            onClick={() => handleQuickDemoRole('collector', '/collector/dashboard')}
            className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:translate-y-[-2px] space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                Portal #2
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Field Collector Portal</h3>
              <p className="text-xs text-slate-400 mt-1">
                Field waste collectors scan QR tags, record on-site weights, verify segregation, and execute optimized collection routes across municipal zones.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 font-bold">
              <span>Launch Collector Workstation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Buyer */}
          <div
            onClick={() => handleQuickDemoRole('buyer', '/buyer/dashboard')}
            className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all hover:translate-y-[-2px] space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full">
                Portal #3
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">B2B Recycler Marketplace</h3>
              <p className="text-xs text-slate-400 mt-1">
                Commercial recyclers discover verified raw material stock (PET flakes, cardboard bales, metal scrap), review Batch IDs, and place escrow orders.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-bold">
              <span>Explore Marketplace Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* NGO */}
          <div
            onClick={() => handleQuickDemoRole('ngo', '/ngo/dashboard')}
            className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:translate-y-[-2px] space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                Portal #4
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">NGO Food Rescue Portal</h3>
              <p className="text-xs text-slate-400 mt-1">
                Verified welfare organizations review surplus meals submitted by restaurants and cafeterias, accept donations, and schedule immediate pickup.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold">
              <span>Launch Food Rescue Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Admin */}
          <div
            onClick={() => handleQuickDemoRole('admin', '/admin/dashboard')}
            className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:translate-y-[-2px] space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                Command Hub
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">System Admin Directorate</h3>
              <p className="text-xs text-slate-400 mt-1">
                System administrators oversee recovery centres, digital inventory publishing, coin issuance rates, batch audits & Civic Watch grievance triage.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-rose-400 font-bold">
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Civic Watch Public */}
          <div
            onClick={() => navigate('/civicwatch')}
            className="glass-panel p-6 rounded-3xl border border-teal-500/40 hover:border-teal-400 bg-gradient-to-b from-slate-900/90 via-teal-950/20 to-slate-900/90 cursor-pointer transition-all hover:translate-y-[-2px] space-y-4 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/40 animate-pulse">
                Public • No Login
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Civic Watch Public Portal</h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero-login public grievance portal. Citizens snap roadside dumping photos with GPS coordinates to trigger rapid cleanup and circular recovery.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-teal-300 font-bold">
              <span>Open Civic Watch Directly</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS (CIRCULAR LIFECYCLE)
          ======================================================== */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5" /> End-to-End Circular Value Chain
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            How the REVastra Ecosystem Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A 7-stage closed-loop journey transforming unsegregated urban waste into high-grade industrial raw materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -right-2 -bottom-2 text-6xl font-black font-mono text-slate-800/20 select-none group-hover:text-emerald-500/10 transition-colors">
                  {step.num}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">{step.num}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-4 font-heading">{step.title}</h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">{step.sub}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          BATCH TRACEABILITY LEDGER
          ======================================================== */}
      <section id="traceability" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-teal-500/20 bg-slate-900/60 space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" /> Verifiable Auditability
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
                Immutable Material Batch Traceability
              </h2>
              <p className="text-xs text-slate-400">
                Every kilogram of recyclable material carries a unique Batch ID with its full chain of custody.
              </p>
            </div>

            <NavLink
              to="/traceability"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 self-start"
            >
              <span>Explore Live Traceability Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Sample Batch:</span>
                <code className="text-xs font-mono text-teal-300 bg-teal-950/60 px-2.5 py-1 rounded border border-teal-500/30">
                  BATCH-2026-0891
                </code>
              </div>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Grade A Clean PET Flakes (12.0 kg)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">1. Origin</span>
                <p className="font-bold text-white">Ananya Household</p>
                <p className="text-[10px] text-slate-400">QR-WG-1001 (Indiranagar)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">2. Field Collector</span>
                <p className="font-bold text-white">Ramesh Kumar</p>
                <p className="text-[10px] text-slate-400">EV Van #4092 (10:15 AM)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">3. RRC Processing</span>
                <p className="font-bold text-white">City RRC Alpha North</p>
                <p className="text-[10px] text-slate-400">Dock #2 Segregation Dock</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">4. Final Buyer</span>
                <p className="font-bold text-white">EcoPolymer Ltd</p>
                <p className="text-[10px] text-slate-400">STK-PET-901 (₹42/kg)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MARKETPLACE & FOOD RESCUE
          ======================================================== */}
      <section id="marketplace" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Marketplace Card */}
          <div className="glass-panel p-8 rounded-3xl border border-purple-500/20 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30 inline-flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> B2B Marketplace
              </span>
              <h3 className="text-2xl font-black text-white font-heading">
                Quality-Graded Recycled Materials Catalog
              </h3>
              <p className="text-xs text-slate-300">
                Verified manufacturing recyclers procure dry PET flakes, cardboard bales, coconut shell biochar, and e-waste lots with direct dock dispatch.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Washed PET Flakes</span>
                  <strong className="text-purple-300">₹42 / kg (Grade A)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Aluminium Cans</span>
                  <strong className="text-purple-300">₹135 / kg (Grade A)</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleQuickDemoRole('buyer', '/buyer/marketplace')}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>Explore Marketplace Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Food Rescue Card */}
          <div id="food-rescue" className="glass-panel p-8 rounded-3xl border border-amber-500/20 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30 inline-flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Food Rescue Module
              </span>
              <h3 className="text-2xl font-black text-white font-heading">
                Surplus Food Rescue & NGO Network
              </h3>
              <p className="text-xs text-slate-300">
                Zero-waste dining: Restaurants, hotels, and cafeterias list safe surplus unserved meals. Verified NGOs receive instant alerts to accept, collect, and feed local shelters.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Meals Rescued</span>
                  <strong className="text-amber-400 text-base font-heading">8,420+ Meals</strong>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Active NGO Partners</span>
                  <strong className="text-emerald-400 text-base font-heading">14 Verified</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleQuickDemoRole('ngo', '/ngo/food-donations')}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>View Active Food Donations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          LIVE IMPACT METRICS
          ======================================================== */}
      <section id="impact" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Proven Ecological Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Live City-Scale Sustainability Metrics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time data aggregated across all collection routes, civic remediations, and recovery centres.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-1">
            <span className="text-3xl lg:text-4xl font-extrabold text-emerald-400 font-heading">48,620 kg</span>
            <span className="block text-xs font-bold text-white">Waste Recovered</span>
            <span className="text-[10px] text-slate-400">From registered sources</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-1">
            <span className="text-3xl lg:text-4xl font-extrabold text-cyan-400 font-heading">94.9%</span>
            <span className="block text-xs font-bold text-white">Landfill Diversion</span>
            <span className="text-[10px] text-slate-400">Prevented toxic landfill dumping</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-1">
            <span className="text-3xl lg:text-4xl font-extrabold text-amber-400 font-heading">184,500</span>
            <span className="block text-xs font-bold text-white">Green Coins Issued</span>
            <span className="text-[10px] text-slate-400">Citizens rewarded with groceries</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-1">
            <span className="text-3xl lg:text-4xl font-extrabold text-purple-400 font-heading">68.4 Tons</span>
            <span className="block text-xs font-bold text-white">CO₂ Diverted</span>
            <span className="text-[10px] text-slate-400">Circular climate offset</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          CALL TO ACTION
          ======================================================== */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-gradient-to-tr from-emerald-950/60 via-slate-900 to-teal-950/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">
              Ready to Experience the Future of CleanTech?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Join thousands of households, commercial kitchens, recyclers, and operators driving circular sustainability.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <NavLink
              to="/role-selection"
              className="px-8 py-4 rounded-2xl eco-gradient-btn text-xs font-extrabold text-white shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 hover:scale-105"
            >
              <span>Explore Roles & Portals</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>

            <NavLink
              to="/civicwatch"
              className="px-6 py-4 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs border border-teal-500/40 transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Civic Watch Portal (No Login)</span>
            </NavLink>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 max-w-7xl mx-auto text-xs text-slate-400 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500 text-slate-950">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white font-heading">
                REV<span className="text-emerald-400">astra</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Smart Circular Waste-to-Value Infrastructure. Built for Indian Smart Cities & Modern Urban CleanTech.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Role Portals</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><NavLink to="/login/waste-giver" className="hover:text-emerald-400">Waste Giver Portal</NavLink></li>
              <li><NavLink to="/login/collector" className="hover:text-emerald-400">Collector Portal</NavLink></li>
              <li><NavLink to="/login/buyer" className="hover:text-emerald-400">B2B Recycler Marketplace</NavLink></li>
              <li><NavLink to="/login/ngo" className="hover:text-emerald-400">NGO Food Rescue</NavLink></li>
              <li><NavLink to="/login/admin" className="hover:text-emerald-400">System Admin Directorate</NavLink></li>
              <li><NavLink to="/civicwatch" className="hover:text-teal-400">Civic Watch Portal (No Login)</NavLink></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Core Features</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><NavLink to="/civicwatch/report" className="hover:text-emerald-400">Report Roadside Dumping</NavLink></li>
              <li><NavLink to="/traceability" className="hover:text-emerald-400">Batch Traceability Ledger</NavLink></li>
              <li><NavLink to="/waste-giver/grocery-rewards" className="hover:text-emerald-400">Grocery Rewards Catalogue</NavLink></li>
              <li><NavLink to="/waste-giver/donate-food" className="hover:text-emerald-400">Surplus Food Rescue</NavLink></li>
              <li><NavLink to="/admin/revenue" className="hover:text-emerald-400">Marketplace Monetization</NavLink></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Standards</h4>
            <p className="text-[11px] text-slate-500">
              Adheres to SWM Rules 2016, FSSAI Food Safety Protocols, and Extended Producer Responsibility (EPR) guidelines.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
          <span>© 2026 REVastra Platform • All rights reserved.</span>
          <span className="text-emerald-400 font-semibold">Theme: Clean & Green Technology</span>
        </div>
      </footer>
    </div>
  );
}
