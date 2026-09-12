import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../types';
import { TECHNICIANS } from '../data/mockData';
import { 
  getStatusMeta, 
  getPriorityMeta, 
  getCategoryMeta, 
  getDeviceTypeLabel,
  formatDate 
} from '../utils/helpers';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Package, 
  UserPlus, 
  FileEdit, 
  Printer, 
  Filter, 
  Search, 
  Layers, 
  Sparkles,
  Cpu,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface TechnicianDeskViewProps {
  tickets: Ticket[];
  onUpdateTicket: (updated: Ticket) => void;
  onPrintTicket: (ticket: Ticket) => void;
}

export const TechnicianDeskView: React.FC<TechnicianDeskViewProps> = ({
  tickets,
  onUpdateTicket,
  onPrintTicket
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Resolution modal state
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [techStatus, setTechStatus] = useState<TicketStatus>('in_progress');
  const [techAssigned, setTechAssigned] = useState<string>('');
  const [techNotes, setTechNotes] = useState<string>('');
  const [techParts, setTechParts] = useState<string>('');
  const [techResolution, setTechResolution] = useState<string>('');

  // Stats calculation
  const totalCount = tickets.length;
  const newCount = tickets.filter((t) => t.status === 'new').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress' || t.status === 'assigned').length;
  const waitingPartsCount = tickets.filter((t) => t.status === 'waiting_parts').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const criticalCount = tickets.filter((t) => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length;

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.requesterName.toLowerCase().includes(q) ||
        t.buildingRoom.toLowerCase().includes(q) ||
        (t.assignedTechnician && t.assignedTechnician.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openEditModal = (t: Ticket) => {
    setEditingTicket(t);
    setTechStatus(t.status);
    setTechAssigned(t.assignedTechnician || TECHNICIANS[0].name);
    setTechNotes(t.technicianNotes || '');
    setTechParts(t.partsReplaced || '');
    setTechResolution(t.resolutionSummary || '');
  };

  const handleSaveTechUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    const isResolvedNow = techStatus === 'resolved' && editingTicket.status !== 'resolved';
    const updated: Ticket = {
      ...editingTicket,
      status: techStatus,
      assignedTechnician: techAssigned || editingTicket.assignedTechnician,
      technicianNotes: techNotes.trim() || editingTicket.technicianNotes,
      partsReplaced: techParts.trim() || editingTicket.partsReplaced,
      resolutionSummary: techResolution.trim() || editingTicket.resolutionSummary,
      resolvedAt: isResolvedNow ? new Date().toISOString().replace('T', ' ').substring(0, 16) : editingTicket.resolvedAt,
      activityLog: [
        ...editingTicket.activityLog,
        {
          id: `act-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: techAssigned || 'مشرف الدعم الفني',
          action: `تحديث الحالة إلى [${getStatusMeta(techStatus).label}]`,
          note: techNotes.trim() || (isResolvedNow ? 'تم حل العطل واختبار الجهاز بنجاح' : undefined)
        }
      ]
    };

    onUpdateTicket(updated);
    setEditingTicket(null);
  };

  const handleQuickAssign = (ticket: Ticket, techName: string) => {
    const updated: Ticket = {
      ...ticket,
      assignedTechnician: techName,
      status: ticket.status === 'new' ? 'assigned' : ticket.status,
      activityLog: [
        ...ticket.activityLog,
        {
          id: `act-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: 'مشرف الدعم الفني',
          action: 'إسناد البلاغ',
          note: `تم تعيين الفني: ${techName}`
        }
      ]
    };
    onUpdateTicket(updated);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner with KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-600" />
            <span>لوحة تحكم فنيي ومشرفي الدعم الفني</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            إدارة تذاكر الصيانة، فرز الأعطال، وتعيين المهام وتوثيق الحلول الفنية
          </p>
        </div>

        {criticalCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>يوجد {criticalCount} بلاغ بحالة حرجة يتطلب التدخل الفوري!</span>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500">إجمالي البلاغات</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-black text-slate-900">{totalCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-sky-600">جديد بانتظار الفرز</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-2xl font-black text-sky-700">{newCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-amber-600">قيد الصيانة والفحص</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-700">{inProgressCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-orange-600">بانتظار قطع غيار</span>
            <Package className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-2xl font-black text-orange-700">{waitingPartsCount}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-emerald-600">تم الحل والإنجاز</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{resolvedCount}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              ({totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم البلاغ، العنوان، اسم صاحب البلاغ، القاعة أو الفني..."
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="all">كل الحالات ({totalCount})</option>
              <option value="new">جديد بانتظار الفرز</option>
              <option value="assigned">تم تعيين فني</option>
              <option value="in_progress">قيد الفحص والصيانة</option>
              <option value="waiting_parts">بانتظار قطع غيار</option>
              <option value="resolved">تم الحل والإصلاح</option>
              <option value="closed">مغلق</option>
            </select>

            {/* Filter Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="all">كل التصنيفات</option>
              <option value="hardware">عتاد وحاسوب</option>
              <option value="software">أنظمة وبرمجيات</option>
              <option value="network">شبكات وإنترنت</option>
              <option value="printers">طابعات وملحقات</option>
              <option value="accounts">حسابات وصلاحيات</option>
            </select>

            {/* Filter Priority */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="all">كل الأولويات</option>
              <option value="critical">حرج جداً</option>
              <option value="high">عاجل</option>
              <option value="medium">متوسط</option>
              <option value="low">عادي</option>
            </select>

            {(filterStatus !== 'all' || filterCategory !== 'all' || filterPriority !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterCategory('all');
                  setFilterPriority('all');
                  setSearchQuery('');
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold whitespace-nowrap transition"
              >
                إعادة ضبط
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tickets Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            قائمة البلاغات المسجلة ({filteredTickets.length})
          </span>
          <span className="text-[11px] text-slate-500">
            انقر على "إجراءات الصيانة" لتحديث الحالة وتوثيق الحل
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            لا توجد بلاغات تطابق الفلاتر المحددة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">رقم البلاغ</th>
                  <th className="p-3.5">عنوان المشكلة</th>
                  <th className="p-3.5">صاحب البلاغ / الموقع</th>
                  <th className="p-3.5">التصنيف والأولوية</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5">الفني المسؤول</th>
                  <th className="p-3.5 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => {
                  const statusMeta = getStatusMeta(t.status);
                  const priorityMeta = getPriorityMeta(t.priority);
                  const catMeta = getCategoryMeta(t.category);

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID & Date */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-mono font-bold text-cyan-800 block">
                          {t.id}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(t.createdAt)}
                        </span>
                      </td>

                      {/* Title & Description preview */}
                      <td className="p-3.5 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate" title={t.title}>
                          {t.title}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {t.description}
                        </span>
                        {t.errorCode && (
                          <span className="inline-block font-mono text-[10px] bg-red-50 text-red-700 px-1.5 py-0.2 rounded border border-red-200 mt-0.5">
                            {t.errorCode}
                          </span>
                        )}
                      </td>

                      {/* Requester & Location */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block">
                          {t.requesterName}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {t.buildingRoom}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {t.phone}
                        </span>
                      </td>

                      {/* Category & Priority */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-1 ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
                          {catMeta.label}
                        </span>
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className={`w-2 h-2 rounded-full ${priorityMeta.dot}`}></span>
                          <span className="font-medium text-slate-700">{priorityMeta.label}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
                          {statusMeta.label}
                        </span>
                      </td>

                      {/* Assigned Tech */}
                      <td className="p-3.5 whitespace-nowrap">
                        {t.assignedTechnician ? (
                          <span className="font-bold text-slate-800 text-xs">
                            {t.assignedTechnician}
                          </span>
                        ) : (
                          <select
                            onChange={(e) => handleQuickAssign(t, e.target.value)}
                            defaultValue=""
                            className="text-[11px] bg-sky-50 border border-sky-300 text-sky-800 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="" disabled>تعيين فني...</option>
                            {TECHNICIANS.map((tech) => (
                              <option key={tech.id} value={tech.name}>
                                {tech.name} ({tech.role})
                              </option>
                            ))}
                          </select>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(t)}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold text-xs transition flex items-center gap-1 shadow-sm"
                            title="تحديث تقرير الصيانة والحالة"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>إجراءات الصيانة</span>
                          </button>

                          <button
                            onClick={() => onPrintTicket(t)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                            title="طباعة بطاقة البلاغ"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Technician Resolution & Update Modal */}
      {editingTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-800">
                  {editingTicket.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  توثيق الإجراء الفني وتحديث حالة الصيانة
                </h3>
              </div>
              <button
                onClick={() => setEditingTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {/* Ticket Summary Box */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>{editingTicket.title}</span>
                <span className="text-slate-500">{editingTicket.buildingRoom}</span>
              </div>
              <p className="text-slate-600">{editingTicket.description}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveTechUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    حالة البلاغ الجديدة: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={techStatus}
                    onChange={(e) => setTechStatus(e.target.value as TicketStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-white focus:ring-2 focus:ring-cyan-500/30"
                  >
                    <option value="new">جديد بانتظار الفرز</option>
                    <option value="assigned">تم تعيين فني</option>
                    <option value="in_progress">قيد الفحص والمعالجة الفنية</option>
                    <option value="waiting_parts">بانتظار قطع غيار / موافقة مستودع</option>
                    <option value="resolved">تم الإصلاح والحل بنجاح</option>
                    <option value="closed">إغلاق نهائي وأرشفة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الفني المسؤول المكلف: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={techAssigned}
                    onChange={(e) => setTechAssigned(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-white focus:ring-2 focus:ring-cyan-500/30"
                  >
                    {TECHNICIANS.map((tech) => (
                      <option key={tech.id} value={tech.name}>
                        {tech.name} - {tech.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ملاحظات الفحص والتشخيص الفني (Internal Tech Notes):
                </label>
                <textarea
                  rows={3}
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  placeholder="مثال: تم فحص الفولتيات بمقياس Multimeter، اتضح تلف مكثف الباور، تم استبدال الكيبل واختبار درجة حرارة المعالج..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  القطع المستبدلة والمواد المستهلكة (إن وجدت):
                </label>
                <input
                  type="text"
                  value={techParts}
                  onChange={(e) => setTechParts(e.target.value)}
                  placeholder="مثال: مزود طاقة 500W + معجون حراري Thermal Paste + كيبل SATA"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ملخص الحل المعتمد النهائي (Resolution Summary):
                </label>
                <input
                  type="text"
                  value={techResolution}
                  onChange={(e) => setTechResolution(e.target.value)}
                  placeholder="مثال: تم حل المشكلة وإعادة تثبيت تعريف الشبكة والتأكد من سرعة التصفح واستقرار الاتصال."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold shadow-md shadow-cyan-600/20"
                >
                  حفظ التحديث وسجل الصيانة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
