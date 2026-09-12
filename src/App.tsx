import React, { useState, useEffect, useCallback } from 'react';
import { Ticket } from './types';
import { getStoredTickets, saveTicketsToStorage } from './utils/helpers';
import { INITIAL_TICKETS } from './data/mockData';
import { 
  fetchTicketsApi, 
  createTicketApi, 
  updateTicketApi, 
  resetTicketsApi 
} from './services/ticketsApi';
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
  UserCheck,
  Database
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

  // Live multi-device sync state
  const [syncState, setSyncState] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Multi-device sync function
  const triggerSync = useCallback(async (showLoading = false) => {
    if (showLoading) setSyncState('syncing');
    try {
      const { tickets: serverTickets, fromServer } = await fetchTicketsApi();
      if (fromServer) {
        setSyncState('synced');
        setTickets((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(serverTickets)) {
            return serverTickets;
          }
          return prev;
        });
      } else {
        setSyncState('offline');
      }
    } catch (err) {
      console.warn('Sync failed:', err);
      setSyncState('offline');
    }
  }, []);

  // Initial fetch and 3-second live polling loop across all devices
  useEffect(() => {
    triggerSync(true);

    const interval = setInterval(() => {
      triggerSync(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [triggerSync]);

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

  const handleTicketCreated = async (newTicket: Ticket) => {
    // 1. Optimistic instant local update
    setTickets((prev) => [newTicket, ...prev.filter(t => t.id !== newTicket.id)]);
    // 2. Persist to unified server database so all other devices see it
    await createTicketApi(newTicket);
  };

  const handleUpdateTicket = async (updated: Ticket) => {
    // 1. Optimistic instant local update
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    // 2. Persist to unified server database
    await updateTicketApi(updated);
  };

  const handleNavigateToTrack = (ticketId: string) => {
    setTrackSearchId(ticketId);
    setActiveTab('track');
  };

  const handleAutoPrefillTicket = (data: Partial<Ticket>) => {
    setPrefilledData(data);
    setActiveTab('submit');
  };

  const handleResetDemoData = async () => {
    if (window.confirm('هل تريد مسح وإعادة ضبط قاعدة البيانات الموحدة لكافة الأجهزة؟')) {
      await resetTicketsApi();
      setTickets([]);
      alert('تمت إعادة ضبط وتصفير قاعدة البيانات المشتركة بنجاح.');
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
        syncState={syncState}
        onManualSync={() => triggerSync(true)}
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
      <footer className="no-print bg-slate-900 text-slate-400 text-xs border-t border-slate-800/80 mt-12 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
              <MonitorCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block text-xs">
                منظومة الدعم الفني والصيانة
              </span>
              <span className="text-[11px] text-slate-500">
                إدارة بلاغات وأعطال أجهزة الحاسب والشبكات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>خادم موحد مشترك</span>
            </div>

            <button
              onClick={handleResetDemoData}
              className="text-slate-500 hover:text-red-400 transition text-[11px] flex items-center gap-1"
              title="تصفير قاعدة البيانات الموحدة"
            >
              <RotateCcw className="w-3 h-3" />
              <span>تصفير البيانات</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
