import React from 'react';
import { 
  MonitorCheck, 
  Plus, 
  Search, 
  Wrench, 
  Cpu, 
  BookOpen, 
  BarChart3,
  Lock,
  LogOut,
  ShieldCheck,
  RefreshCw,
  Database
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'submit' | 'track' | 'tech' | 'diagnose' | 'kb' | 'stats';
  setActiveTab: (tab: 'submit' | 'track' | 'tech' | 'diagnose' | 'kb' | 'stats') => void;
  openTicketsCount: number;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  syncState?: 'synced' | 'syncing' | 'offline';
  onManualSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  openTicketsCount,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout,
  syncState = 'synced',
  onManualSync
}) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Title (Clean & Crisp) */}
          <div 
            onClick={() => setActiveTab('submit')}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <MonitorCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                  الدعم الفني
                </span>
                <span className="text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30 uppercase tracking-wide">
                  IT Desk
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:block leading-none mt-0.5">
                صيانة الحاسب والشبكات
              </span>
            </div>
          </div>

          {/* Navigation Links (Sleek Pills) */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none" id="main-navigation">
            {/* 1. Submit Ticket */}
            <button
              id="nav-tab-submit"
              onClick={() => setActiveTab('submit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'submit'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تقديم بلاغ</span>
            </button>

            {/* 2. Track Tickets */}
            <button
              id="nav-tab-track"
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'track'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>متابعة البلاغات</span>
            </button>

            {/* 3. Diagnostic Troubleshooter */}
            <button
              id="nav-tab-diagnose"
              onClick={() => setActiveTab('diagnose')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'diagnose'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>الفاحص الذكي</span>
            </button>

            {/* 4. Knowledge Base */}
            <button
              id="nav-tab-kb"
              onClick={() => setActiveTab('kb')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'kb'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>دليل الحلول</span>
            </button>

            {/* ADMIN-ONLY TABS */}
            {isAdmin && (
              <>
                <div className="h-4 w-px bg-slate-700/60 mx-1 hidden sm:block"></div>

                <button
                  id="nav-tab-tech"
                  onClick={() => setActiveTab('tech')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border ${
                    activeTab === 'tech'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                      : 'text-amber-300 bg-amber-950/30 hover:bg-amber-900/50 border-amber-500/30'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>لوحة الفنيين</span>
                  {openTicketsCount > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {openTicketsCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-tab-stats"
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border ${
                    activeTab === 'stats'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                      : 'text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/50 border-cyan-500/30'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>التقارير</span>
                </button>
              </>
            )}
          </nav>

          {/* Left Actions: Live Sync & Admin Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Shared Database Indicator */}
            <div 
              onClick={onManualSync}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer select-none transition ${
                syncState === 'synced'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                  : syncState === 'syncing'
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
              }`}
              title="تخزين سحابي موحد لجميع الأجهزة - انقر للتحديث الفوري"
            >
              <Database className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">سحابي موحد</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <RefreshCw className={`w-2.5 h-2.5 text-slate-400 ${syncState === 'syncing' ? 'animate-spin text-cyan-300' : ''}`} />
            </div>

            {/* Admin Toggle */}
            {!isAdmin ? (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition"
                title="تسجيل دخول المشرفين والفنيين"
              >
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>دخول الفنيين</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="hidden md:flex items-center gap-1 text-cyan-300 text-xs font-bold bg-cyan-950/60 border border-cyan-800/70 px-2 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>وضع الإدارة</span>
                </span>
                <button
                  onClick={onAdminLogout}
                  className="flex items-center gap-1 text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/50 border border-red-800/50 px-2.5 py-1 rounded-lg text-xs transition"
                  title="الخروج من وضع الإدارة"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
