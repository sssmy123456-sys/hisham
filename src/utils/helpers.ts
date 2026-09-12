import { Ticket, TicketCategory, TicketPriority, TicketStatus, DeviceType } from '../types';
import { INITIAL_TICKETS } from '../data/mockData';

const STORAGE_KEY = 'it_support_tickets_v1';

export function getStoredTickets(): Ticket[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading tickets from storage', e);
  }
  // Initialize with initial tickets
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
  return INITIAL_TICKETS;
}

export function saveTicketsToStorage(tickets: Ticket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error('Error saving tickets to storage', e);
  }
}

export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TCK-${year}-${randomNum}`;
}

export function getCategoryMeta(cat: TicketCategory): { label: string; bg: string; text: string; border: string } {
  switch (cat) {
    case 'hardware':
      return { label: 'عتاد وحاسوب (Hardware)', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'software':
      return { label: 'برمجيات وأنظمة (Software)', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'network':
      return { label: 'شبكات وإنترنت (Network)', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'printers':
      return { label: 'طابعات وملحقات (Printers)', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'security':
      return { label: 'أمن وحماية (Security)', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'accounts':
      return { label: 'حسابات وصلاحيات (Accounts)', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    default:
      return { label: 'أخرى', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function getStatusMeta(status: TicketStatus): { label: string; bg: string; text: string; border: string; stepIndex: number } {
  switch (status) {
    case 'new':
      return { label: 'جديد / بانتظار الفرز', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', stepIndex: 0 };
    case 'assigned':
      return { label: 'تم تعيين فني', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', stepIndex: 1 };
    case 'in_progress':
      return { label: 'جاري الفحص والمعالجة', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', stepIndex: 2 };
    case 'waiting_parts':
      return { label: 'بانتظار قطع غيار / مورد', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', stepIndex: 2 };
    case 'resolved':
      return { label: 'تم الإصلاح بنجاح', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', stepIndex: 3 };
    case 'closed':
      return { label: 'مغلق ومؤرشف', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', stepIndex: 4 };
  }
}

export function getPriorityMeta(priority: TicketPriority): { label: string; bg: string; text: string; dot: string } {
  switch (priority) {
    case 'critical':
      return { label: 'حرج جداً (توقف عمل)', bg: 'bg-red-50 text-red-700 border-red-200', text: 'text-red-700', dot: 'bg-red-500' };
    case 'high':
      return { label: 'عاجل (مرتفع)', bg: 'bg-orange-50 text-orange-700 border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' };
    case 'medium':
      return { label: 'متوسط', bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'low':
      return { label: 'منخفض / عادي', bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-700', dot: 'bg-slate-400' };
  }
}

export function getDeviceTypeLabel(type: DeviceType): string {
  switch (type) {
    case 'desktop': return 'حاسب مكتبي (PC)';
    case 'laptop': return 'حاسب محمول (Laptop)';
    case 'printer': return 'طابعة / ماسح ضوئي';
    case 'monitor': return 'شاشة عرض (Monitor)';
    case 'network_device': return 'جهاز شبكة (راوتر/سويتش)';
    case 'projector': return 'جهاز عرض ضوئي (Data Show)';
    case 'other': return 'ملحق / جهاز آخر';
  }
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return dateString;
  }
}
