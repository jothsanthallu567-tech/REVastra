import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Navbar } from '../components/common/Navbar';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-xs text-slate-400 bg-slate-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 <strong>REVastra Platform</strong> • Smart Waste-to-Value Infrastructure</span>
            <span className="text-emerald-400 font-medium">Tagline: "Turning Waste into Value"</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
