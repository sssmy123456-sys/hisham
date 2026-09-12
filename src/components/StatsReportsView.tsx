import React from 'react';
import { Ticket } from '../types';
import { TECHNICIANS } from '../data/mockData';
import { getCategoryMeta, getStatusMeta } from '../utils/helpers';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Users, 
  Building2, 
  Cpu, 
  ShieldAlert 
} from 'lucide-react';

interface StatsReportsViewProps {
  tickets: Ticket[];
}

export const StatsReportsView: React.FC<StatsReportsViewProps> = ({ tickets }) => {
  const total = tickets.length;
  const resolved = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const inProgress = tickets.filter((t) => t.status === 'in_progress' || t.status === 'waiting_parts').length;
  const newTickets = tickets.filter((t) => t.status === 'new').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category counts
  const categories: Record<string, number> = {
    hardware: 0,
    software: 0,
    network: 0,
    printers: 0,
    security: 0,
    accounts: 0,
  };
  tickets.forEach((t) => {
    if (categories[t.category] !== undefined) {
      categories[t.category]++;
    }
  });

  // Department counts
  const deptCounts: Record<string, number> = {};
  tickets.forEach((t) => {
    deptCounts[t.department] = (deptCounts[t.department] || 0) + 1;
  });

  // Priority counts
  const critical = tickets.filter((t) => t.priority === 'critical').length;
  const high = tickets.filter((t) => t.priority === 'high').length;
  const medium = tickets.filter((t) => t.priority === 'medium').length;
  const low = tickets.filter((t) => t.priority === 'low').length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>التقارير والمؤشرات</span>
            <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
              إحصائيات الأداء
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            مؤشرات إنجاز البلاغات، توزيع الأعطال الفنية، وأداء فرق الصيانة الميدانية
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <Printer className="w-3.5 h-3.5 text-cyan-400" />
          <span>طباعة التقرير</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            نسبة إنجاز البلاغات (SLA)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              %{resolutionRate}
            </span>
            <span className="text-xs text-slate-400 font-medium">من الإجمالي</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${resolutionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            متوسط زمن الاستجابة الأولي
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-700">18</span>
            <span className="text-xs text-slate-500 font-medium">دقيقة</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-2 block font-semibold">
            ✓ أسرع بنسبة 12% من المعيار الجامعي
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            متوسط زمن الإصلاح والإغلاق
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">2.4</span>
            <span className="text-xs text-slate-500 font-medium">ساعة</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            يشمل فترات انتظار قطع الغيار
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            متوسط رضا المستفيدين
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-500">4.8</span>
            <span className="text-xs text-slate-500 font-medium">من 5.0</span>
          </div>
          <span className="text-[11px] text-amber-600 mt-2 block font-semibold">
            ★★★★★ تقييم عالي الجودة
          </span>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>توزيع البلاغات حسب التصنيف الفني</span>
            <Cpu className="w-4 h-4 text-cyan-600" />
          </h3>

          <div className="space-y-3.5">
            {[
              { id: 'hardware', label: 'عتاد وحاسوب (Hardware)', count: categories.hardware, color: 'bg-amber-500' },
              { id: 'network', label: 'شبكات وإنترنت (Network)', count: categories.network, color: 'bg-emerald-500' },
              { id: 'software', label: 'أنظمة وبرمجيات (Software)', count: categories.software, color: 'bg-blue-500' },
              { id: 'printers', label: 'طابعات وملحقات (Printers)', count: categories.printers, color: 'bg-purple-500' },
              { id: 'accounts', label: 'حسابات وصلاحيات (Accounts)', count: categories.accounts, color: 'bg-indigo-500' },
            ].map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.id} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {item.count} بلاغ ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Severity Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>توزيع درجات الأهمية والخطورة</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-3 text-center">
              <span className="text-xs text-red-700 font-semibold block mb-0.5">حرج جداً</span>
              <span className="text-2xl font-black text-red-700">{critical}</span>
            </div>
            <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3 text-center">
              <span className="text-xs text-orange-700 font-semibold block mb-0.5">عاجل</span>
              <span className="text-2xl font-black text-orange-700">{high}</span>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-center">
              <span className="text-xs text-amber-700 font-semibold block mb-0.5">متوسط</span>
              <span className="text-2xl font-black text-amber-700">{medium}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-600 font-semibold block mb-0.5">عادي / منخفض</span>
              <span className="text-2xl font-black text-slate-700">{low}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">💡 توصية فريق الصيانة:</span>
            معظم البلاغات الحرجة تتركز في كوابل الشبكة وتلف مزودات الطاقة. يوصى بإجراء صيانة وقائية دورية قبل بداية الفصل الدراسي القادم.
          </div>
        </div>

      </div>

      {/* Technicians Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>أداء فريق الدعم الفني وتوزيع المهام</span>
          <Users className="w-4 h-4 text-cyan-600" />
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">الفني المختص</th>
                <th className="p-3">التخصص والمهام</th>
                <th className="p-3">البلاغات المسندة</th>
                <th className="p-3">الحالة الراهنة</th>
                <th className="p-3">مستوى الجاهزية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TECHNICIANS.map((tech) => {
                const assignedCount = tickets.filter((t) => t.assignedTechnician === tech.name).length;
                const techResolved = tickets.filter((t) => t.assignedTechnician === tech.name && (t.status === 'resolved' || t.status === 'closed')).length;

                return (
                  <tr key={tech.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                        {tech.name.charAt(0)}
                      </div>
                      <span>{tech.name}</span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">
                      {tech.role}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">
                      {assignedCount} بلاغات (أنجز {techResolved})
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        متاح ومناوب
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-cyan-600 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
