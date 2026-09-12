import React from 'react';
import { 
  MonitorCheck, 
  PlusCircle, 
  Search, 
  Wrench, 
  Cpu, 
  BookOpen, 
  BarChart3,
  PhoneCall,
  Lock,
  LogOut,
  ShieldCheck,
  UserCheck,
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
    <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-50 border-b border-slate-800">
      {/* Top Banner with Project Department & Hotline */}
      <div className="bg-slate-950/80 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-cyan-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              مشروع تخصص الدعم الفني للحاسب الآلي والشبكات
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-400">
              البوابة المخصصة للزوار، الدكاترة والأساتذة، والطلاب
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Unified Storage Multi-Device Sync Indicator */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${
                syncState === 'synced'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                  : syncState === 'syncing'
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
              }`}
              title="مزامنة فورية مشتركة بين جميع الأجهزة (خادم موحد)"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>قاعدة موحدة مشتركة</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {onManualSync && (
                <button
                  onClick={onManualSync}
                  className="hover:text-white p-0.5 rounded transition ml-0.5"
                  title="تحديث ومزامنة فورية الآن"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>هاتف الدعم الداخلي:</span>
              <span className="font-mono text-emerald-400 dir-ltr font-semibold">ext. 4000</span>
            </div>

            {/* Admin Login/Logout Link in top bar */}
            {!isAdmin ? (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition text-[11px] font-semibold bg-slate-800 hover:bg-slate-700/80 px-2.5 py-1 rounded-md border border-slate-700"
                title="تسجيل دخول فنيي ومشرفي القسم"
              >
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>دخول الإدارة والفنيين</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-cyan-400 text-[11px] font-bold bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>وضع الإدارة نشط</span>
                </span>
                <button
                  onClick={onAdminLogout}
                  className="flex items-center gap-1 text-red-300 hover:text-red-200 text-[11px] bg-red-950/40 hover:bg-red-900/40 border border-red-800/40 px-2 py-0.5 rounded transition"
                >
                  <LogOut className="w-3 h-3" />
                  <span>خروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setActiveTab('submit')}
              className="flex items-center gap-3 cursor-pointer group"
              id="brand-logo"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                <MonitorCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  بوابة الدعم الفني للحاسب الآلي
                  <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    IT Portal
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-normal">
                  {isAdmin 
                    ? 'لوحة إدارة ومتابعة أعمال الصيانة الفنية وتوزيع التذاكر' 
                    : 'الواجهة العامة لتقديم البلاغات واستعلام الدكاترة والزوار'}
                </p>
              </div>
            </div>

            {/* Mobile Quick Submit Button */}
            <button
              onClick={() => setActiveTab('submit')}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تقديم بلاغ</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none" id="main-navigation">
            {/* 1. Public: Submit Ticket */}
            <button
              id="nav-tab-submit"
              onClick={() => setActiveTab('submit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'submit'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>تقديم بلاغ عطل</span>
            </button>

            {/* 2. Public: Track Tickets */}
            <button
              id="nav-tab-track"
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'track'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>متابعة واستعلام</span>
            </button>

            {/* 3. Public: Diagnostic Troubleshooter */}
            <button
              id="nav-tab-diagnose"
              onClick={() => setActiveTab('diagnose')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'diagnose'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>الفاحص الذكي</span>
            </button>

            {/* 4. Public: Knowledge Base */}
            <button
              id="nav-tab-kb"
              onClick={() => setActiveTab('kb')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'kb'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دليل الأعطال</span>
            </button>

            {/* ADMIN-ONLY TABS (Strictly isolated to Admin Mode) */}
            {isAdmin && (
              <>
                <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block"></div>

                <button
                  id="nav-tab-tech"
                  onClick={() => setActiveTab('tech')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border border-amber-500/40 ${
                    activeTab === 'tech'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-amber-300 bg-amber-950/30 hover:bg-amber-900/40'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>لوحة الفنيين</span>
                  {openTicketsCount > 0 && (
                    <span className="bg-amber-500 text-slate-950 text-[11px] font-black px-1.5 py-0.2 rounded-full">
                      {openTicketsCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-tab-stats"
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border border-cyan-500/40 ${
                    activeTab === 'stats'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/40'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>التقارير والإحصائيات</span>
                </button>
              </>
            )}

            {/* If NOT Admin: Show a clean locked access button to switch */}
            {!isAdmin && (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition whitespace-nowrap border border-transparent hover:border-slate-700"
                title="لوحة الفنيين والإحصائيات خاصة بإدارة القسم فقط"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>لوحة الإدارة</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Admin Mode Ribbon (If Active) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-1.5 text-xs text-amber-950 font-bold shadow-inner flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <span className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-4 h-4 text-amber-200" />
              <span>أنت الآن في [وضع الإدارة والدعم الفني] - أزرار لوحة الفنيين والإحصائيات متاحة لك حصرياً.</span>
            </span>
            <button
              onClick={() => {
                onAdminLogout();
                setActiveTab('submit');
              }}
              className="px-2.5 py-0.5 bg-amber-900/40 hover:bg-amber-900/60 text-white rounded text-[11px] font-semibold transition flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>العودة للواجهة العامة</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
