import React, { useState, useEffect } from 'react';
import { Ticket } from './types';
import { getStoredTickets, saveTicketsToStorage } from './utils/helpers';
import { INITIAL_TICKETS } from './data/mockData';
import { Header } from './components/Header';
import { SubmitTicketView } from './components/SubmitTicketView';
import { TrackTicketView } from './components/TrackTicketView';
import { TechnicianDeskView } from './components/TechnicianDeskView';
import { DiagnosticWizardView } from './components/DiagnosticWizardView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { StatsReportsView } from './components/StatsReportsView';
import { TicketPrintModal } from './components/TicketPrintModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { 
  MonitorCheck, 
  RotateCcw, 
  CheckCircle2, 
  Shield, 
  Server, 
  Lock,
  LogOut,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => getStoredTickets());
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'tech' | 'diagnose' | 'kb' | 'stats'>('submit');
  const [trackSearchId, setTrackSearchId] = useState<string>('');
  const [prefilledData, setPrefilledData] = useState<Partial<Ticket> | null>(null);
  const [printingTicket, setPrintingTicket] = useState<Ticket | null>(null);

  // Admin isolation state (Default: false, so visitors and doctor see only public views)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Sync with localStorage
  useEffect(() => {
    saveTicketsToStorage(tickets);
  }, [tickets]);

  // If user tries to open tech or stats while not admin, redirect or open login
  useEffect(() => {
    if (!isAdmin && (activeTab === 'tech' || activeTab === 'stats')) {
      setActiveTab('submit');
    }
  }, [isAdmin, activeTab]);

  // Open tickets count (for badge in header)
  const openCount = tickets.filter(
    (t) => t.status === 'new' || t.status === 'in_progress' || t.status === 'assigned' || t.status === 'waiting_parts'
  ).length;

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleUpdateTicket = (updated: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const handleNavigateToTrack = (ticketId: string) => {
    setTrackSearchId(ticketId);
    setActiveTab('track');
  };

  const handleAutoPrefillTicket = (data: Partial<Ticket>) => {
    setPrefilledData(data);
    setActiveTab('submit');
  };

  const handleResetDemoData = () => {
    if (window.confirm('هل تريد إعادة تعيين كافة البلاغات إلى البيانات الافتراضية للمشروع؟')) {
      localStorage.removeItem('it_support_tickets_v1');
      setTickets(INITIAL_TICKETS);
      alert('تمت استعادة البيانات الافتراضية بنجاح.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Header with isolated admin navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'submit') setPrefilledData(null);
          // If trying to access admin tabs while not admin, open login modal
          if ((tab === 'tech' || tab === 'stats') && !isAdmin) {
            setIsAdminLoginOpen(true);
            return;
          }
          setActiveTab(tab);
        }}
        openTicketsCount={openCount}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={() => {
          setIsAdmin(false);
          setActiveTab('submit');
        }}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'submit' && (
          <SubmitTicketView
            onTicketCreated={handleTicketCreated}
            onNavigateToTrack={handleNavigateToTrack}
            prefilledData={prefilledData}
          />
        )}

        {activeTab === 'track' && (
          <TrackTicketView
            tickets={tickets}
            initialSearchId={trackSearchId}
            onUpdateTicket={handleUpdateTicket}
            onPrintTicket={(ticket) => setPrintingTicket(ticket)}
            onNavigateToSubmit={() => setActiveTab('submit')}
          />
        )}

        {/* Admin-only view: Tech Desk */}
        {activeTab === 'tech' && isAdmin && (
          <TechnicianDeskView
            tickets={tickets}
            onUpdateTicket={handleUpdateTicket}
            onPrintTicket={(ticket) => setPrintingTicket(ticket)}
          />
        )}

        {activeTab === 'diagnose' && (
          <DiagnosticWizardView
            onAutoPrefillTicket={handleAutoPrefillTicket}
          />
        )}

        {activeTab === 'kb' && (
          <KnowledgeBaseView />
        )}

        {/* Admin-only view: Stats & Analytics */}
        {activeTab === 'stats' && isAdmin && (
          <StatsReportsView
            tickets={tickets}
          />
        )}
      </main>

      {/* Printable Ticket Modal */}
      {printingTicket && (
        <TicketPrintModal
          ticket={printingTicket}
          onClose={() => setPrintingTicket(null)}
        />
      )}

      {/* Admin Login Modal (for accessing isolated technician & stats views) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setActiveTab('tech');
        }}
      />

      {/* Footer (No-Print) */}
      <footer className="no-print bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
              <MonitorCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block">
                مشروع تخصص الدعم الفني للحاسب الآلي والشبكات
              </span>
              <span className="text-[11px] text-slate-500">
                البوابة الموحدة لخدمة الزوار، الطلاب، وأعضاء هيئة التدريس (الدكاترة)
              </span>
            </div>
          </div>

          {/* Status Indicator & Admin Portal Access */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {!isAdmin ? (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>دخول الإدارة والفنيين</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>لوحة الإدارة نشطة</span>
                </span>
                <button
                  onClick={() => {
                    setIsAdmin(false);
                    setActiveTab('submit');
                  }}
                  className="text-red-300 hover:text-red-200 bg-red-950/40 border border-red-800/40 px-2 py-1 rounded text-[11px] transition flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>الخروج للواجهة العامة</span>
                </button>
              </div>
            )}

            <button
              onClick={handleResetDemoData}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition"
              title="إعادة تعيين البيانات الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات النموذجية</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-800/60 text-center text-[11px] text-slate-500">
          تم تصميم وبناء هذا النظام لخدمة مشاريع التخرج ومقررات الدعم الفني، وشبكات الحاسب، وصيانة الحواسب الشخصية وأنظمة التشغيل.
        </div>
      </footer>
    </div>
  );
}
