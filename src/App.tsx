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
import { 
  MonitorCheck, 
  RotateCcw, 
  CheckCircle2, 
  Shield, 
  Server, 
  Heart,
  PlusCircle,
  Search,
  Wrench,
  Cpu,
  BookOpen,
  BarChart3
} from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => getStoredTickets());
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'tech' | 'diagnose' | 'kb' | 'stats'>('submit');
  const [trackSearchId, setTrackSearchId] = useState<string>('');
  const [prefilledData, setPrefilledData] = useState<Partial<Ticket> | null>(null);
  const [printingTicket, setPrintingTicket] = useState<Ticket | null>(null);

  // Sync with localStorage
  useEffect(() => {
    saveTicketsToStorage(tickets);
  }, [tickets]);

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
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'submit') setPrefilledData(null);
          setActiveTab(tab);
        }}
        openTicketsCount={openCount}
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
          />
        )}

        {activeTab === 'tech' && (
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

        {activeTab === 'stats' && (
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
                نظام إدارة البلاغات وصيانة الحواسب وتجهيزات المعامل التقنية
              </span>
            </div>
          </div>

          {/* Status Indicator & Quick Reset */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>خوادم الدعم الفني متصلة وتعمل بكفاءة</span>
            </div>

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
