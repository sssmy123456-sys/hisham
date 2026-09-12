import React, { useState } from 'react';
import { Ticket } from '../types';
import { 
  getStatusMeta, 
  getPriorityMeta, 
  getCategoryMeta, 
  getDeviceTypeLabel,
  formatDate 
} from '../utils/helpers';
import { 
  Search, 
  Clock, 
  User, 
  MapPin, 
  Wrench, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  Star, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Wifi, 
  Calendar,
  Check
} from 'lucide-react';

interface TrackTicketViewProps {
  tickets: Ticket[];
  initialSearchId?: string;
  onUpdateTicket: (updated: Ticket) => void;
  onPrintTicket: (ticket: Ticket) => void;
}

export const TrackTicketView: React.FC<TrackTicketViewProps> = ({
  tickets,
  initialSearchId = '',
  onUpdateTicket,
  onPrintTicket
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchId);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    initialSearchId || (tickets.length > 0 ? tickets[0].id : null)
  );

  // Note addition state
  const [userNote, setUserNote] = useState('');
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Filter tickets based on query
  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      t.id.toLowerCase().includes(q) ||
      t.requesterName.toLowerCase().includes(q) ||
      t.employeeId.toLowerCase().includes(q) ||
      t.phone.includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.buildingRoom.toLowerCase().includes(q)
    );
  });

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || filteredTickets[0] || null;

  const handleAddUserNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !userNote.trim()) return;

    const newLogItem = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: `${selectedTicket.requesterName} (مقدم الطلب)`,
      action: 'إضافة استفسار / ملاحظة',
      note: userNote.trim()
    };

    const updated: Ticket = {
      ...selectedTicket,
      activityLog: [...selectedTicket.activityLog, newLogItem]
    };

    onUpdateTicket(updated);
    setUserNote('');
  };

  const handleRateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updated: Ticket = {
      ...selectedTicket,
      rating: ratingVal,
      ratingFeedback: ratingComment.trim() || undefined,
      activityLog: [
        ...selectedTicket.activityLog,
        {
          id: `act-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: selectedTicket.requesterName,
          action: 'تقييم الخدمة',
          note: `تم تقييم الخدمة بـ ${ratingVal} من 5 نجوم: ${ratingComment.trim() || 'خدمة ممتازة'}`
        }
      ]
    };

    onUpdateTicket(updated);
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            الاستعلام ومتابعة حالة بلاغات الصيانة
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-4">
            أدخل رقم التتبع (مثل TCK-2025-101)، أو الرقم الوظيفي، أو رقم الجوال للاطلاع على خط سير البلاغ
          </p>

          <div className="relative flex items-center">
            <input
              type="text"
              id="search-ticket-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم التذكرة أو الاسم أو الموقع..."
              className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600 shadow-inner"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-4 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 text-xs bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-full px-2 py-0.5"
              >
                مسح
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: List on side, Detail on main */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Side: Tickets list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              البلاغات المتطابقة ({filteredTickets.length})
            </span>
            <span className="text-[11px] text-slate-400">انقر للعرض</span>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              لا توجد بلاغات تطابق بحثك.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const statusMeta = getStatusMeta(t.status);
                const priorityMeta = getPriorityMeta(t.priority);

                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-right p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-cyan-50/70 border-cyan-500 ring-2 ring-cyan-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-cyan-800">
                        {t.id}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
                        {statusMeta.label}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                      {t.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[140px]">{t.requesterName}</span>
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${priorityMeta.dot}`}></span>
                        {priorityMeta.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right/Main: Selected Ticket Comprehensive View */}
        <div className="lg:col-span-8">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-black font-mono text-cyan-800 tracking-wider">
                      {selectedTicket.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusMeta(selectedTicket.status).bg} ${getStatusMeta(selectedTicket.status).text} ${getStatusMeta(selectedTicket.status).border}`}>
                      {getStatusMeta(selectedTicket.status).label}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedTicket.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => onPrintTicket(selectedTicket)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                    title="طباعة أمر عمل"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة التذكرة</span>
                  </button>
                </div>
              </div>

              {/* Visual Progress Stepper (Timeline) */}
              <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-3">
                  مراحل معالجة البلاغ:
                </span>
                {(() => {
                  const steps = [
                    { label: 'استلام البلاغ', desc: 'تم التوثيق بالنظام' },
                    { label: 'إسناد لفني', desc: 'تم تحديد المختص' },
                    { label: 'الفحص والصيانة', desc: 'مباشرة المعالجة' },
                    { label: 'تم الإصلاح', desc: 'اكتمال العمل الفني' },
                  ];

                  let currentStep = 0;
                  if (selectedTicket.status === 'assigned') currentStep = 1;
                  else if (selectedTicket.status === 'in_progress' || selectedTicket.status === 'waiting_parts') currentStep = 2;
                  else if (selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') currentStep = 3;

                  return (
                    <div className="relative flex items-center justify-between">
                      {/* Line */}
                      <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0">
                        <div 
                          className="h-full bg-cyan-600 transition-all duration-500"
                          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>
                      </div>

                      {steps.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={idx} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? 'bg-cyan-600 text-white shadow-md ring-4 ring-white'
                                  : 'bg-slate-200 text-slate-500 ring-4 ring-white'
                              } ${isCurrent ? 'ring-cyan-200' : ''}`}
                            >
                              {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span className={`text-xs font-semibold mt-2 text-center whitespace-nowrap ${isDone ? 'text-cyan-900 font-bold' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden sm:block">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">التصنيف الفني:</span>
                  <span className="font-semibold text-slate-800">
                    {getCategoryMeta(selectedTicket.category).label}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">نوع الجهاز:</span>
                  <span className="font-semibold text-slate-800">
                    {getDeviceTypeLabel(selectedTicket.deviceType)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">الموقع والقاعة:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedTicket.buildingRoom}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">الأولوية:</span>
                  <span className="font-semibold text-slate-800">
                    {getPriorityMeta(selectedTicket.priority).label}
                  </span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  وصف العطل المسجل:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>

                {selectedTicket.errorCode && (
                  <div className="flex items-center gap-2 text-xs bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-200">
                    <span className="font-bold">رمز الخطأ المسجل:</span>
                    <span className="font-mono">{selectedTicket.errorCode}</span>
                  </div>
                )}
              </div>

              {/* Assigned Technician Card (if assigned) */}
              {selectedTicket.assignedTechnician ? (
                <div className="bg-cyan-50/60 border border-cyan-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow">
                      {selectedTicket.assignedTechnician.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs text-cyan-800 font-semibold block">
                        الفني المسؤول عن المعالجة:
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {selectedTicket.assignedTechnician}
                      </h4>
                    </div>
                  </div>

                  {selectedTicket.technicianNotes && (
                    <div className="bg-white/80 border border-cyan-200/80 rounded-lg p-2.5 text-xs text-slate-700 max-w-sm">
                      <span className="font-bold text-cyan-900 block mb-0.5">ملاحظة الفني:</span>
                      <span>{selectedTicket.technicianNotes}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>البلاغ بانتظار الفرز والتعيين من قبل مشرف قسم الدعم الفني.</span>
                </div>
              )}

              {/* Activity Audit Log */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span>سجل الإجراءات والتحديثات ({selectedTicket.activityLog.length}):</span>
                </span>

                <div className="space-y-2.5 border-r-2 border-slate-200 pr-4 mr-2">
                  {selectedTicket.activityLog.map((act) => (
                    <div key={act.id} className="relative text-xs">
                      {/* Node circle */}
                      <span className="absolute -right-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-600 ring-4 ring-white"></span>
                      
                      <div className="flex items-center justify-between text-slate-500 mb-0.5">
                        <span className="font-bold text-slate-800">{act.action}</span>
                        <span className="text-[11px] font-mono">{act.date}</span>
                      </div>
                      <span className="text-slate-600 block text-[11px]">
                        بواسطة: {act.author}
                      </span>
                      {act.note && (
                        <p className="text-slate-700 mt-1 bg-slate-50 p-2 rounded border border-slate-200/70">
                          {act.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add User Inquiry / Note */}
              <form onSubmit={handleAddUserNote} className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  إضافة تعليق أو استفسار إضافي للفني:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="اكتب رسالتك أو استفسارك هنا..."
                    className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
                  />
                  <button
                    type="submit"
                    disabled={!userNote.trim()}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال</span>
                  </button>
                </div>
              </form>

              {/* Customer Rating if Resolved */}
              {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
                <div className="pt-4 border-t border-slate-200 bg-emerald-50/50 rounded-xl p-4 border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>تقييم جودة الخدمة وسرعة الحل الفني</span>
                  </h4>

                  {selectedTicket.rating ? (
                    <div className="text-xs text-slate-700">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= (selectedTicket.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                          />
                        ))}
                        <span className="font-bold mr-2 text-slate-800">
                          {selectedTicket.rating} من 5 نجوم
                        </span>
                      </div>
                      {selectedTicket.ratingFeedback && (
                        <p className="text-slate-600 italic">"{selectedTicket.ratingFeedback}"</p>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleRateService} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">درجة الرضا:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingVal(star)}
                              className="focus:outline-none transition hover:scale-110"
                            >
                              <Star
                                className={`w-5 h-5 ${star <= ratingVal ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={ratingComment}
                          onChange={(e) => setRatingComment(e.target.value)}
                          placeholder="ملاحظاتك حول تعامل الفني وسرعة الحل..."
                          className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          إرسال التقييم
                        </button>
                      </div>

                      {ratingSubmitted && (
                        <span className="text-xs text-emerald-700 font-bold block">
                          ✓ شكراً لك، تم حفظ تقييمك بنجاح!
                        </span>
                      )}
                    </form>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              اختر بلاغاً من القائمة الجانبية لعرض التفاصيل وسير العمل الفني.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
