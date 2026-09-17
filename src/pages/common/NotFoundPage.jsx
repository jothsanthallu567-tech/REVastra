import React from 'react';
import { NavLink } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <AlertTriangle className="w-12 h-12 text-amber-400" />
      <h2 className="text-2xl font-bold text-white font-heading">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm">The page or route you are looking for does not exist in REVastra.</p>
      <NavLink to="/" className="px-4 py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </NavLink>
    </div>
  );
}
