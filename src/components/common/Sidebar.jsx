import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  QrCode,
  Truck,
  Coins,
  ShoppingBag,
  BarChart3,
  History,
  User,
  ScanLine,
  Route,
  Store,
  Sparkles,
  PackageCheck,
  Heart,
  Users,
  Building2,
  Boxes,
  DollarSign,
  FileCheck2,
  Cpu,
  Settings,
  ShieldCheck,
  Leaf,
  ClipboardList
} from 'lucide-react';

export function Sidebar({ isOpen, setIsOpen }) {
  const { currentRole, currentUser } = useAuth();
  const { t } = useLanguage();

  const getNavLinks = () => {
    switch (currentRole) {
      case 'waste-giver':
        return [
          { to: '/waste-giver/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
          { to: '/waste-giver/donate-food', label: 'Donate Food', icon: Heart },
          { to: '/waste-giver/my-qr', label: t('nav_my_qr'), icon: QrCode },
          { to: '/waste-giver/request-collection', label: t('nav_request_collection'), icon: Truck },
          { to: '/waste-giver/collections', label: t('nav_my_collections'), icon: History },
          { to: '/waste-giver/wallet', label: 'Green Coins & Rewards', icon: Coins },
          { to: '/waste-giver/grocery-rewards', label: t('nav_grocery_rewards'), icon: ShoppingBag },
          { to: '/waste-giver/impact', label: t('nav_impact'), icon: BarChart3 },
          { to: '/waste-giver/profile', label: t('nav_profile'), icon: User }
        ];

      case 'collector':
        return [
          { to: '/collector/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
          { to: '/collector/scan-qr', label: t('nav_scan_qr'), icon: ScanLine },
          { to: '/collector/requests', label: 'Zone Pickup Requests', icon: Truck },
          { to: '/collector/routes', label: t('nav_routes'), icon: Route },
          { to: '/collector/profile', label: t('nav_profile'), icon: User }
        ];

      case 'buyer':
        return [
          { to: '/buyer/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
          { to: '/buyer/marketplace', label: t('nav_marketplace'), icon: Store },
          { to: '/buyer/matching', label: t('nav_matching'), icon: Sparkles },
          { to: '/buyer/orders', label: 'Orders & Invoices', icon: PackageCheck },
          { to: '/buyer/profile', label: t('nav_profile'), icon: User }
        ];

      case 'ngo':
        return [
          { to: '/ngo/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
          { to: '/ngo/food-donations', label: t('nav_food_donations'), icon: Heart },
          { to: '/ngo/accepted-pickups', label: t('nav_accepted_pickups'), icon: Truck },
          { to: '/ngo/impact', label: t('nav_impact'), icon: BarChart3 },
          { to: '/ngo/profile', label: t('nav_profile'), icon: User }
        ];

      case 'admin':
        return [
          { to: '/admin/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
          { to: '/admin/users', label: t('nav_users'), icon: Users },
          { to: '/admin/collectors', label: t('nav_collector_history'), icon: ClipboardList },
          { to: '/admin/collections', label: t('nav_my_collections'), icon: Truck },
          { to: '/admin/recovery-centres', label: t('nav_recovery_centres'), icon: Building2 },
          { to: '/admin/inventory', label: t('nav_inventory'), icon: Boxes },
          { to: '/admin/marketplace-orders', label: 'B2B Invoices & Orders', icon: Store },
          { to: '/admin/coin-rules', label: 'Green Coin Management', icon: Coins },
          { to: '/admin/food-rescue', label: t('nav_food_donations'), icon: Heart },
          { to: '/admin/revenue', label: t('nav_revenue'), icon: DollarSign },
          { to: '/admin/impact-analytics', label: t('nav_impact'), icon: BarChart3 },
          { to: '/admin/traceability', label: t('nav_traceability'), icon: FileCheck2 },
          { to: '/admin/ai-suite', label: t('nav_ai_suite'), icon: Cpu },
          { to: '/admin/settings', label: t('nav_settings'), icon: Settings }
        ];

      case 'municipality':
        return [
          { to: '/municipality/dashboard', label: 'Civic Triage & Reports', icon: LayoutDashboard },
          { to: '/recovery-centre/segregation', label: 'RRC Recovery Dock', icon: Building2 },
          { to: '/admin/inventory', label: 'Recovered Inventory', icon: Boxes },
          { to: '/municipality/profile', label: t('nav_profile'), icon: User }
        ];

      default:
        return [
          { to: '/role-selection', label: 'Role Selection', icon: LayoutDashboard }
        ];
    }
  };

  const navLinks = getNavLinks();

  const getRoleBadge = () => {
    const rolesMap = {
      'waste-giver': { text: 'Waste Giver', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      'collector': { text: 'Collector', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
      'buyer': { text: 'B2B Buyer', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
      'ngo': { text: 'NGO / Food Rescue', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      'admin': { text: 'System Admin', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
      'municipality': { text: 'Municipality / ULB', bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30' }
    };
    return rolesMap[currentRole] || { text: 'Guest', bg: 'bg-slate-700 text-slate-300' };
  };

  const badge = getRoleBadge();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/40">
            <NavLink to="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white font-heading">
                  REV<span className="text-emerald-400">astra</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  Waste-to-Value Platform
                </span>
              </div>
            </NavLink>
          </div>

          {/* Current Role Banner */}
          <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Role</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}>
                {badge.text}
              </span>
            </div>
            {currentUser && (
              <p className="mt-1 text-xs text-white truncate font-medium">{currentUser.name}</p>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* CivicWatch Fast Access & Footer info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          <NavLink
            to="/civicwatch"
            onClick={() => setIsOpen(false)}
            className="w-full py-2 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-between text-xs font-bold transition-all group"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
              <span>CivicWatch Portal</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-200 uppercase font-extrabold">
              Public
            </span>
          </NavLink>

          <div className="text-center pt-1">
            <p className="text-[11px] text-slate-400 font-medium">REVastra CleanTech v3.0</p>
            <p className="text-[10px] text-slate-400">{t('tagline')}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
