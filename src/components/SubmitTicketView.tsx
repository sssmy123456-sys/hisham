import React, { useState } from 'react';
import { 
  TicketCategory, 
  DeviceType, 
  TicketPriority, 
  Ticket 
} from '../types';
import { DEPARTMENTS } from '../data/mockData';
import { generateTicketId } from '../utils/helpers';
import { 
  Cpu, 
  Layers, 
  Wifi, 
  Printer, 
  ShieldAlert, 
  UserCheck, 
  Monitor, 
  Laptop, 
  Tv, 
  Router, 
  Video, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer as PrintIcon, 
  Sparkles, 
  Upload, 
  AlertTriangle,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface SubmitTicketViewProps {
  onTicketCreated: (newTicket: Ticket) => void;
  onNavigateToTrack: (ticketId: string) => void;
  prefilledData?: Partial<Ticket> | null;
}

export const SubmitTicketView: React.FC<SubmitTicketViewProps> = ({
  onTicketCreated,
  onNavigateToTrack,
  prefilledData
}) => {
  const [category, setCategory] = useState<TicketCategory>(prefilledData?.category || 'hardware');
  const [deviceType, setDeviceType] = useState<DeviceType>(prefilledData?.deviceType || 'desktop');
  const [priority, setPriority] = useState<TicketPriority>(prefilledData?.priority || 'medium');
  const [requesterName, setRequesterName] = useState(prefilledData?.requesterName || '');
  const [employeeId, setEmployeeId] = useState(prefilledData?.employeeId || '');
  const [department, setDepartment] = useState(prefilledData?.department || DEPARTMENTS[0]);
  const [buildingRoom, setBuildingRoom] = useState(prefilledData?.buildingRoom || '');
  const [phone, setPhone] = useState(prefilledData?.phone || '');
  const [email, setEmail] = useState(prefilledData?.email || '');
  const [deviceSerial, setDeviceSerial] = useState(prefilledData?.deviceSerial || '');
  const [title, setTitle] = useState(prefilledData?.title || '');
  const [description, setDescription] = useState(prefilledData?.description || '');
  const [errorCode, setErrorCode] = useState(prefilledData?.errorCode || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Success state
  const [submittedTicket, setSubmittedTicket] = useState<Ticket | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick preset loader for fast testing
  const loadPreset = (type: 'hardware' | 'network' | 'printer' | 'software') => {
    if (type === 'hardware') {
      setCategory('hardware');
      setDeviceType('desktop');
      setPriority('high');
      setTitle('الجهاز لا يستجيب للتشغيل ومصباح الباور مطفأ');
      setDescription('عند الضغط على زر الطاقة في كيس الحاسب لا تصدر أي استجابة، المراوح متوقفة ولا توجد إضاءة. تم تجربة مقبس كهرباء آخر.');
      setBuildingRoom('مبنى الحاسب - معمل 102');
    } else if (type === 'faculty' as any) {
      setCategory('hardware');
      setDeviceType('projector');
      setPriority('critical');
      setTitle('عطل جهاز العرض (Data Show) وانقطاع الصوت بقاعة المحاضرات الرئيسية');
      setDescription('البروجكتر يصدر وميض لمبة Lamp حمراء ولا يعرض شاشة اللابتوب، ونظام الصوت بالقاعة لا يعمل قبل بدء محاضرة المقرر.');
      setBuildingRoom('مبنى الكلية - مدرج المحاضرات 101');
    } else if (type === 'network') {
      setCategory('network');
      setDeviceType('network_device');
      setPriority('critical');
      setTitle('انقطاع الإنترنت وظهور علامة التعجب الصفراء بالمعمل');
      setDescription('فقدان الاتصال بالشبكة المحلية وتعذر الدخول على البوابة الجامعية، الأجهزة أخذت IP تلقائي 169.254.x.x');
      setBuildingRoom('المبنى الرئيسي - معمل الشبكات 204');
    } else if (type === 'printer') {
      setCategory('printers');
      setDeviceType('printer');
      setPriority('medium');
      setTitle('طابعة HP متعددة المهام متوقفة وتعطي رسالة خطأ انحشار الورق');
      setDescription('تظهر رسالة Paper Jam في الشاشة الصغيرة رغم التأكد من خلو المسار، وتصدر صوت تكتكة عند محاولة سحب الورق.');
      setBuildingRoom('مبنى الإدارة - مكتب القبول والتسجيل');
    } else if (type === 'software') {
      setCategory('software');
      setDeviceType('desktop');
      setPriority('high');
      setTitle('شاشة زرقاء متكررة BSOD عند تشغيل برامج المحاكاة');
      setDescription('النظام ينهار فجأة وتظهر رسالة CRITICAL_PROCESS_DIED مع رمز التوقف، ويعيد التشغيل التلقائي.');
      setErrorCode('0x000000EF');
      setBuildingRoom('مبنى ب - معمل 305');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !requesterName.trim() || !description.trim()) {
      alert('يرجى ملء الحقول الإلزامية: الاسم، عنوان البلاغ، ووصف العطل.');
      return;
    }

    const ticketId = generateTicketId();
    const newTicket: Ticket = {
      id: ticketId,
      createdAt: new Date().toISOString(),
      requesterName: requesterName.trim(),
      employeeId: employeeId.trim() || 'غير محدد',
      department,
      buildingRoom: buildingRoom.trim() || 'غير محدد',
      phone: phone.trim() || 'غير محدد',
      email: email.trim() || 'user@tech.edu.sa',
      category,
      deviceType,
      deviceSerial: deviceSerial.trim() || undefined,
      priority,
      title: title.trim(),
      description: description.trim(),
      errorCode: errorCode.trim() || undefined,
      imageUrl: imagePreview || undefined,
      status: 'new',
      activityLog: [
        {
          id: `act-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: requesterName.trim(),
          action: 'تسجيل البلاغ',
          note: 'تم إرسال البلاغ عبر البوابة الإلكترونية للدعم الفني'
        }
      ]
    };

    onTicketCreated(newTicket);
    setSubmittedTicket(newTicket);
  };

  const copyTicketId = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // If submitted, show success voucher
  if (submittedTicket) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4" id="ticket-success-receipt">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-1">
            تم استلام بلاغ الدعم الفني بنجاح!
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            تم تسجيل طلب الصيانة في النظام، وسيتم فرزه وإسناده للفني المختص فوراً.
          </p>

          {/* Ticket ID Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              رقم تتبع البلاغ (Ticket Reference ID)
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-cyan-700 tracking-wider">
                {submittedTicket.id}
              </span>
              <button
                type="button"
                onClick={copyTicketId}
                className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition shadow-sm"
                title="نسخ الرقم"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <span className="text-xs text-slate-400 mt-2 block">
              احفظ هذا الرقم لمتابعة حالة الصيانة أو الاستعلام عن الإجراءات المتخذة.
            </span>
          </div>

          {/* Summary Details */}
          <div className="text-right bg-slate-50/50 rounded-xl border border-slate-200/80 p-4 mb-6 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">عنوان البلاغ:</span>
              <span className="font-semibold text-slate-800">{submittedTicket.title}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">صاحب البلاغ:</span>
              <span className="font-semibold text-slate-800">{submittedTicket.requesterName} ({submittedTicket.department})</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">الموقع والقاعة:</span>
              <span className="font-semibold text-slate-800">{submittedTicket.buildingRoom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">درجة الأهمية:</span>
              <span className="font-semibold text-red-600">{submittedTicket.priority === 'critical' ? 'حرج جداً' : submittedTicket.priority === 'high' ? 'عاجل' : 'متوسط'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigateToTrack(submittedTicket.id)}
              className="w-full sm:w-auto px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>متابعة حالة البلاغ الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <PrintIcon className="w-4 h-4" />
              <span>طباعة إشعار الاستلام</span>
            </button>

            <button
              onClick={() => {
                setSubmittedTicket(null);
                setTitle('');
                setDescription('');
                setErrorCode('');
                setImagePreview(null);
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-slate-500 hover:text-slate-800 font-semibold transition text-sm"
            >
              تقديم بلاغ آخر
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Sleek Support Desk Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>تقديم بلاغ دعم فني</span>
            <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
              تذكرة صيانة
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            سجّل العطل الفني لمباشرة الفحص والصيانة الميدانية في أسرع وقت
          </p>
        </div>

        {/* Quick Test Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          <span className="text-slate-400 font-medium text-[11px] whitespace-nowrap pl-1">نماذج سريعة:</span>
          <button
            type="button"
            onClick={() => loadPreset('faculty' as any)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition text-xs whitespace-nowrap border border-slate-200/80"
          >
            قاعة محاضرات
          </button>
          <button
            type="button"
            onClick={() => loadPreset('hardware')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition text-xs whitespace-nowrap border border-slate-200/80"
          >
            عطل باور
          </button>
          <button
            type="button"
            onClick={() => loadPreset('network')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition text-xs whitespace-nowrap border border-slate-200/80"
          >
            انقطاع شبكة
          </button>
          <button
            type="button"
            onClick={() => loadPreset('printer')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition text-xs whitespace-nowrap border border-slate-200/80"
          >
            طابعة
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-7" id="submit-ticket-form">
        
        {/* Step 1: Category Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            1. حدد تصنيف العطل الفني: <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'hardware', label: 'عتاد وأجهزة', desc: 'باور، مذربورد، رام، شاشة، مراوح', icon: Cpu, color: 'hover:border-amber-500 hover:bg-amber-50/50' },
              { id: 'software', label: 'أنظمة وبرمجيات', desc: 'ويندوز، شاشة زرقاء، أوفيس، برامج', icon: Layers, color: 'hover:border-blue-500 hover:bg-blue-50/50' },
              { id: 'network', label: 'شبكات وإنترنت', desc: 'كوابل، راوتر، سويتش، Wi-Fi، بطء', icon: Wifi, color: 'hover:border-emerald-500 hover:bg-emerald-50/50' },
              { id: 'printers', label: 'طابعات وملحقات', desc: 'انحشار ورق، أحبار، ماسح ضوئي', icon: Printer, color: 'hover:border-purple-500 hover:bg-purple-50/50' },
              { id: 'security', label: 'أمن وفيروسات', desc: 'برمجيات خبيثة، فدية، تنظيف', icon: ShieldAlert, color: 'hover:border-rose-500 hover:bg-rose-50/50' },
              { id: 'accounts', label: 'حسابات وصلاحيات', desc: 'كلمة مرور، دومين، بريد جامعي', icon: UserCheck, color: 'hover:border-indigo-500 hover:bg-indigo-50/50' },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`cat-select-${item.id}`}
                  onClick={() => setCategory(item.id as TicketCategory)}
                  className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-500/20 shadow-sm'
                      : `border-slate-200 bg-white ${item.color}`
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${isSelected ? 'text-cyan-900' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`} />
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Device Type & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              2. نوع الجهاز المتضرر:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'desktop', label: 'حاسب مكتبي', icon: Monitor },
                { id: 'laptop', label: 'لابتوب محمول', icon: Laptop },
                { id: 'printer', label: 'طابعة / سكنر', icon: Printer },
                { id: 'monitor', label: 'شاشة عرض', icon: Tv },
                { id: 'network_device', label: 'جهاز شبكة', icon: Router },
                { id: 'projector', label: 'بروجكتر', icon: Video },
              ].map((dev) => {
                const Icon = dev.icon;
                const isSelected = deviceType === dev.id;
                return (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => setDeviceType(dev.id as DeviceType)}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-50/80 text-cyan-900 font-bold ring-1 ring-cyan-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`} />
                    <span className="text-xs">{dev.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              3. درجة الأهمية / الأولوية:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'low', label: 'منخفض / عادي', desc: 'لا يعطل سير العمل اليومي', color: 'border-slate-300' },
                { id: 'medium', label: 'متوسط', desc: 'يؤثر جزئياً على الإنجاز', color: 'border-amber-300' },
                { id: 'high', label: 'عاجل', desc: 'تعطل جهاز رئيسي للموظف/المعلم', color: 'border-orange-300' },
                { id: 'critical', label: 'حرج جداً', desc: 'توقف قاعة كاملة أو خدمة حرجة', color: 'border-red-300' },
              ].map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as TicketPriority)}
                    className={`p-2.5 rounded-xl border text-right transition ${
                      isSelected
                        ? p.id === 'critical'
                          ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-300'
                          : 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-300'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{p.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-700" />}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 3: Requester Information */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>4. بيانات مقدم البلاغ والموقع:</span>
            <span className="text-xs font-normal text-slate-500">(لتسهيل وصول الفني والتواصل السريع)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="input-requester-name"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="مثال: أحمد عبد الله المحمد"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الرقم الوظيفي / الجامعي <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="input-employee-id"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="مثال: EMP-2041 أو STU-8812"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الجهة / القسم / المعمل <span className="text-red-500">*</span>
              </label>
              <select
                id="select-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                المبنى ورقم القاعة / المكتب <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="input-building-room"
                required
                value={buildingRoom}
                onChange={(e) => setBuildingRoom(e.target.value)}
                placeholder="مثال: مبنى أ - معمل الحاسب 105"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الجوال للتواصل
              </label>
              <input
                type="tel"
                id="input-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm dir-ltr text-right focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الرقم التسلسلي للجهاز / باركود العهدة (إن وجد)
              </label>
              <input
                type="text"
                id="input-serial"
                value={deviceSerial}
                onChange={(e) => setDeviceSerial(e.target.value)}
                placeholder="مثال: PC-LAB1-04"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Issue Description & Error Details */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            5. تفاصيل ووصف العطل الفني:
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              عنوان موجز للبلاغ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="input-ticket-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: الجهاز لا يقلع وتظهر رسالة No bootable device"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              وصف تفصيلي للأعراض والخطوات التي جرت قبل العطل <span className="text-red-500">*</span>
            </label>
            <textarea
              id="input-ticket-desc"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اشرح المشكلة بالتفصيل: هل يصدر الجهاز أصواتاً؟ هل حدث العطل فجأة بعد تحديث؟ هل جربت إعادة التشغيل؟"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رمز الخطأ الظاهر (Error Code) - إن وجد:
              </label>
              <input
                type="text"
                id="input-error-code"
                value={errorCode}
                onChange={(e) => setErrorCode(e.target.value)}
                placeholder="مثال: 0x0000007B أو Stop 0x124"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                إرفاق صورة للعطل أو لقطة شاشة (اختياري):
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3.5 py-2.5 border border-dashed border-slate-300 hover:border-cyan-500 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs font-semibold text-slate-600">
                  <Upload className="w-4 h-4 text-cyan-600" />
                  <span>{imagePreview ? 'تغيير الصورة المرفقة' : 'رفع صورة الخطأ / الشاشة'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="مرفق العطل"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-cyan-600" />
            <span>سيتم إرسال إشعار تتبع فوري بعد اعتماد البلاغ</span>
          </div>

          <button
            type="submit"
            id="btn-submit-ticket"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/25 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>إرسال البلاغ واعتماد التذكرة</span>
          </button>
        </div>

      </form>
    </div>
  );
};
