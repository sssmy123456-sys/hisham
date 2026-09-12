import React from 'react';
import { 
  MonitorCheck, 
  PlusCircle, 
  Search, 
  Wrench, 
  Cpu, 
  BookOpen, 
  BarChart3,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'submit' | 'track' | 'tech' | 'diagnose' | 'kb' | 'stats';
  setActiveTab: (tab: 'submit' | 'track' | 'tech' | 'diagnose' | 'kb' | 'stats') => void;
  openTicketsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openTicketsCount }) => {
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
            <span className="hidden sm:inline text-slate-400">إدارة البلاغات والصيانة الفنية الشاملة</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>طوارئ المعامل والدعم الداخلي:</span>
              <span className="font-mono text-emerald-400 dir-ltr font-semibold">ext. 4000</span>
            </div>
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
                    IT Helpdesk
                  </span>
                </h1>
                <p className="text-xs text-slate-400 font-normal">
                  منصة استقبال وفرز بلاغات الأعطال واستكشاف الأخطاء
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

            <button
              id="nav-tab-tech"
              onClick={() => setActiveTab('tech')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'tech'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>لوحة الفنيين</span>
              {openTicketsCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {openTicketsCount}
                </span>
              )}
            </button>

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

            <button
              id="nav-tab-stats"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>الإحصائيات</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
