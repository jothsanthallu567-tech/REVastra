import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Settings, RefreshCw, Database, Globe, CheckCircle2 } from 'lucide-react';

export function AdminSystemSettings() {
  const { resetDemoData } = useData();
  const { language, changeLanguage, t, supportedLanguages } = useLanguage();

  const collections = [
    'users', 'wasteSources', 'wasteCollections', 'recoveryCentres',
    'batches', 'warehouseStock', 'buyers', 'orders', 'greenCoins',
    'groceryCatalogue', 'redemptions', 'foodDonations', 'notifications', 'routes', 'impactMetrics', 'prohibitedWaste'
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">{t('nav_settings')}</h1>
        <p className="text-xs text-slate-400">Environment configuration, Language preferences & Firestore schema</p>
      </div>

      {/* Firebase Cloud Connection Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-heading">Firebase Cloud Integration</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">Live Firebase Authentication & Cloud Firestore project configuration</p>
          </div>
          <Database className="w-5 h-5 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Project ID</span>
            <span className="text-xs font-mono font-bold text-emerald-400">revastra-a552e</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Auth Domain</span>
            <span className="text-xs font-mono font-bold text-cyan-400">revastra-a552e.firebaseapp.com</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Storage Bucket</span>
            <span className="text-xs font-mono font-bold text-purple-400">revastra-a552e.firebasestorage.app</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">App ID</span>
            <span className="text-xs font-mono font-bold text-slate-300 truncate block">1:834366038905:web:...</span>
          </div>
        </div>
      </div>

      {/* Language Preference Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">{t('lang_select')}</h3>
            <p className="text-xs text-slate-400">Select default interface language for REVastra UI</p>
          </div>
          <Globe className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
          {supportedLanguages?.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                language === lang.code
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{lang.name}</span>
                {language === lang.code && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">{lang.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">Firebase Firestore Collection Schema</h3>
            <p className="text-xs text-slate-400">16 standardized collections with cross-referenced foreign keys</p>
          </div>
          <Database className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {collections.map((col) => (
            <div key={col} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-xs font-mono font-bold text-emerald-400">{col}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-heading">State Management & Demo Tools</h3>
        <p className="text-xs text-slate-400">Reset prototype data state to initial seed parameters for live evaluation</p>

        <button
          onClick={() => {
            if (window.confirm('Reset state to clean initial seed data?')) {
              resetDemoData();
              alert('REVastra demo data reset successfully.');
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Reset Seed Demo State
        </button>
      </div>
    </div>
  );
}
