import React from 'react';
import { Ticket } from '../types';
import { 
  getStatusMeta, 
  getPriorityMeta, 
  getCategoryMeta, 
  getDeviceTypeLabel, 
  formatDate 
} from '../utils/helpers';
import { Printer, X, MonitorCheck, ShieldCheck } from 'lucide-react';

interface TicketPrintModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export const TicketPrintModal: React.FC<TicketPrintModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-3xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-600" />
            <span className="text-sm font-bold text-slate-800">
              معاينة وطباعة أمر عمل الصيانة الفنية (Work Order)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الآن</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Layout */}
        <div className="print-area space-y-6 text-slate-900 border border-slate-300 p-6 sm:p-8 rounded-xl bg-white" id="printable-ticket-content">
          
          {/* Document Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
            <div className="text-right space-y-0.5">
              <span className="text-xs font-semibold text-slate-500 block">مشروع تخصص الدعم الفني والشبكات</span>
              <h1 className="text-lg font-black text-slate-900">قسم تقنية المعلومات والدعم الفني</h1>
              <span className="text-xs text-slate-600 block">وحدة صيانة الحاسب الآلي وتجهيزات المعامل</span>
            </div>

            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <MonitorCheck className="w-7 h-7 text-cyan-400" />
            </div>

            <div className="text-left font-mono text-xs space-y-1 dir-ltr">
              <div><strong>Ticket No:</strong> {ticket.id}</div>
              <div><strong>Date:</strong> {formatDate(ticket.createdAt)}</div>
              <div><strong>Status:</strong> {getStatusMeta(ticket.status).label}</div>
            </div>
          </div>

          {/* Barcode Mock */}
          <div className="text-center py-2 bg-slate-50 rounded border border-slate-200">
            <span className="font-mono text-2xl tracking-[0.3em] font-black text-slate-800 select-none block">
              ||| | |||| || ||||| | ||| |||| |
            </span>
            <span className="font-mono text-xs font-bold text-slate-600">
              *{ticket.id}*
            </span>
          </div>

          {/* Grid Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
              <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
                بيانات مقدم الطلب والموقع:
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">الاسم:</span>
                <span className="font-semibold">{ticket.requesterName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الرقم الوظيفي:</span>
                <span className="font-mono font-semibold">{ticket.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">القسم:</span>
                <span className="font-semibold">{ticket.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الموقع/القاعة:</span>
                <span className="font-semibold">{ticket.buildingRoom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الجوال:</span>
                <span className="font-mono font-semibold dir-ltr">{ticket.phone}</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
              <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
                مواصفات الجهاز والعطل:
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">نوع الجهاز:</span>
                <span className="font-semibold">{getDeviceTypeLabel(ticket.deviceType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">التصنيف الفني:</span>
                <span className="font-semibold">{getCategoryMeta(ticket.category).label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الأولوية:</span>
                <span className="font-bold text-red-600">{getPriorityMeta(ticket.priority).label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الرقم التسلسلي:</span>
                <span className="font-mono font-semibold">{ticket.deviceSerial || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">رمز الخطأ:</span>
                <span className="font-mono font-semibold">{ticket.errorCode || 'لا يوجد'}</span>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="border border-slate-200 rounded-lg p-3.5 text-xs space-y-1">
            <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
              عنوان وتفاصيل العطل المسجل:
            </span>
            <p className="font-semibold text-slate-900 pt-1">{ticket.title}</p>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Technician Section */}
          <div className="border border-slate-200 rounded-lg p-3.5 text-xs space-y-2 bg-slate-50/30">
            <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">
              تقرير الفحص الفني والإجراءات المتخذة:
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500">الفني المختص:</span>
                <span className="font-semibold mr-1">{ticket.assignedTechnician || 'قيد التعيين'}</span>
              </div>
              <div>
                <span className="text-slate-500">تاريخ الإنجاز:</span>
                <span className="font-semibold mr-1">{ticket.resolvedAt || 'قيد المتابعة'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">ملاحظات التشخيص الفني:</span>
              <p className="text-slate-800 bg-white p-2 rounded border border-slate-200">
                {ticket.technicianNotes || 'جاري الفحص الميداني واختبار المكونات.'}
              </p>
            </div>

            {ticket.partsReplaced && (
              <div>
                <span className="text-slate-500 block mb-0.5">القطع المستبدلة من المستودع:</span>
                <p className="text-slate-800 font-semibold bg-white p-1.5 rounded border border-slate-200">
                  {ticket.partsReplaced}
                </p>
              </div>
            )}
          </div>

          {/* Signatures & Stamp Block */}
          <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-3 gap-4 text-center text-xs">
            <div className="space-y-6">
              <span className="text-slate-600 block font-semibold">توقيع المستفيد (صاحب البلاغ)</span>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="text-[10px] text-slate-400">التاريخ: _____ / _____ / 2025</span>
            </div>

            <div className="space-y-6">
              <span className="text-slate-600 block font-semibold">توقيع الفني المنفذ</span>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="text-[10px] text-slate-400">{ticket.assignedTechnician || 'توقيع الفني'}</span>
            </div>

            <div className="space-y-6">
              <span className="text-slate-600 block font-semibold">ختم واعتماد مشرف الدعم الفني</span>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-400 mx-auto flex items-center justify-center text-[10px] text-slate-400 font-bold rotate-[-12deg]">
                ختم الإدارة
              </div>
              <span className="text-[10px] text-slate-400">معتمد من وحدة تقنية المعلومات</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
