import React, { useState } from 'react';
import { DIAGNOSTIC_NODES } from '../data/mockData';
import { DiagnosticNode, Ticket } from '../types';
import { 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  Send, 
  Sparkles, 
  Wrench,
  HelpCircle,
  Terminal,
  Zap
} from 'lucide-react';

interface DiagnosticWizardViewProps {
  onAutoPrefillTicket: (data: Partial<Ticket>) => void;
}

export const DiagnosticWizardView: React.FC<DiagnosticWizardViewProps> = ({
  onAutoPrefillTicket
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [activeSolution, setActiveSolution] = useState<{
    title: string;
    steps: string[];
    isSolved: boolean;
    prefillTitle?: string;
    prefillDesc?: string;
  } | null>(null);

  const currentNode: DiagnosticNode = DIAGNOSTIC_NODES[currentNodeId] || DIAGNOSTIC_NODES['start'];

  const handleSelectOption = (option: DiagnosticNode['options'][0]) => {
    if (option.solution) {
      setActiveSolution(option.solution);
    } else if (option.nextNodeId && DIAGNOSTIC_NODES[option.nextNodeId]) {
      setHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(option.nextNodeId);
      setActiveSolution(null);
    }
  };

  const handleBack = () => {
    if (activeSolution) {
      setActiveSolution(null);
      return;
    }
    if (history.length > 0) {
      const prevNodeId = history[history.length - 1];
      setHistory((prev) => prev.slice(0, prev.length - 1));
      setCurrentNodeId(prevNodeId);
      setActiveSolution(null);
    }
  };

  const handleReset = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setActiveSolution(null);
  };

  const handleConvertTicket = () => {
    if (activeSolution) {
      onAutoPrefillTicket({
        category: currentNode.category,
        deviceType: currentNode.deviceType,
        priority: activeSolution.isSolved ? 'medium' : 'high',
        title: activeSolution.prefillTitle || 'بلاغ صيانة بعد فحص التشخيص الذكي',
        description: activeSolution.prefillDesc || `نتائج الفحص الذكي:\n${activeSolution.title}\nالخطوات التي جربت:\n${activeSolution.steps.join('\n')}`
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>الفاحص الذكي للأعطال</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              تشخيص تفاعلي
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            خطوات سريعة لاكتشاف الخلل وحله فورياً أو تحويله مباشرة إلى بلاغ صيانة
          </p>
        </div>
      </div>

      {/* Interactive Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* Navigation / Progress bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            {(history.length > 0 || activeSolution) && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>الخطوة السابقة</span>
              </button>
            )}
            <span className="text-slate-400">
              المرحلة: {history.length + (activeSolution ? 2 : 1)}
            </span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة الفحص من البداية</span>
          </button>
        </div>

        {/* If solution reached */}
        {activeSolution ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className={`p-5 rounded-2xl border ${
              activeSolution.isSolved 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-start gap-3">
                {activeSolution.isSolved ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-base font-bold mb-1">
                    {activeSolution.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {activeSolution.isSolved 
                      ? 'خطوات الإرشاد الفني الموصى بها لحل هذه المشكلة ذاتياً:'
                      : 'بناءً على الأعراض المدخلة، يتطلب هذا العطل تدخلاً مباشراً من فني الصيانة:'}
                  </p>
                </div>
              </div>

              {/* Recommended Steps */}
              <div className="mt-4 space-y-2 pr-9">
                {activeSolution.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-white font-bold text-slate-700 flex items-center justify-center shrink-0 border border-slate-300 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                فحص مشكلة أخرى
              </button>

              <button
                onClick={handleConvertTicket}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>رفع بلاغ دعم فني معبأ مسبقاً بهذه المشكلة</span>
              </button>
            </div>
          </div>
        ) : (
          /* Question step */
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block mb-1">
                سؤال الفحص الفني:
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {currentNode.question}
              </h3>
              {currentNode.description && (
                <p className="text-xs text-slate-500 mt-1">
                  {currentNode.description}
                </p>
              )}
            </div>

            {/* Options grid */}
            <div className="space-y-3">
              {currentNode.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full p-4 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 text-right transition-all flex items-center justify-between group shadow-sm hover:shadow"
                >
                  <div className="pr-1">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-cyan-900 block mb-0.5">
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span className="text-xs text-slate-500 block">
                        {opt.description}
                      </span>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-cyan-600 group-hover:text-white flex items-center justify-center text-slate-400 transition shrink-0 mr-3">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
