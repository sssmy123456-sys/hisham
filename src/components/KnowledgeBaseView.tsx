import React, { useState } from 'react';
import { KNOWLEDGE_ARTICLES } from '../data/mockData';
import { KnowledgeArticle, TicketCategory } from '../types';
import { getCategoryMeta } from '../utils/helpers';
import { 
  BookOpen, 
  Search, 
  Terminal, 
  Lightbulb, 
  ThumbsUp, 
  Check, 
  Copy, 
  Clock, 
  Layers, 
  Cpu, 
  Wifi, 
  Printer 
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(KNOWLEDGE_ARTICLES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [votedArticles, setVotedArticles] = useState<Record<string, boolean>>({});

  const handleCopy = (cmd: string) => {
    // extract pure command before parenthesis if any
    const pureCmd = cmd.split('(')[0].trim();
    navigator.clipboard.writeText(pureCmd);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleVote = (id: string) => {
    if (votedArticles[id]) return;
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, helpfulVotes: a.helpfulVotes + 1 } : a))
    );
    setVotedArticles((prev) => ({ ...prev, [id]: true }));
  };

  const filteredArticles = articles.filter((a) => {
    if (activeCategory !== 'all' && a.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.steps.some((s) => s.toLowerCase().includes(q)) ||
        (a.commands && a.commands.some((c) => c.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Sleek Support Desk Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>دليل الحلول السريعة</span>
            <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
              قاعدة المعرفة
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            حلول معتمدة وأوامر فنية لمعالجة أعطال الحواسب والشبكات والطابعات
          </p>
        </div>

        {/* Compact Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الحلول والأوامر..."
            className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded px-1.5 py-0.5"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'كافة الأدلة' },
          { id: 'hardware', label: 'عتاد وأجهزة (Hardware)' },
          { id: 'network', label: 'شبكات وإنترنت (Network)' },
          { id: 'software', label: 'أنظمة وبرمجيات (Software)' },
          { id: 'printers', label: 'طابعات وملحقات (Printers)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => {
          const catMeta = getCategoryMeta(article.category);
          const hasVoted = votedArticles[article.id];

          return (
            <div
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Meta bar */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
                    {catMeta.label}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>وقت القراءة: {article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {article.summary}
                </p>

                {/* Steps List */}
                <div className="space-y-2 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    خطوات الفحص والتطبيق:
                  </span>
                  {article.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Terminal Commands (if any) */}
                {article.commands && article.commands.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-slate-700" />
                      <span>الأوامر المعتمدة في موجه الأوامر (CMD):</span>
                    </span>
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px] space-y-1.5">
                      {article.commands.map((cmd, idx) => {
                        const isThisCopied = copiedCommand === cmd;
                        return (
                          <div key={idx} className="flex items-center justify-between gap-2 hover:bg-slate-800/80 p-1 rounded">
                            <span className="text-emerald-400 font-semibold dir-ltr">{cmd}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cmd)}
                              className="text-slate-400 hover:text-white p-1 rounded transition"
                              title="نسخ الأمر"
                            >
                              {isThisCopied ? (
                                <span className="text-[10px] text-emerald-400 font-sans flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> تم
                                </span>
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Technician Tips (if any) */}
                {article.tips && article.tips.length > 0 && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block">نصيحة فني الميدان:</span>
                      {article.tips.map((tip, idx) => (
                        <span key={idx} className="block text-[11px] leading-relaxed">
                          {tip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer: Feedback */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>هل ساعدك هذا الدليل في حل العطل؟</span>
                <button
                  type="button"
                  onClick={() => handleVote(article.id)}
                  disabled={hasVoted}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition ${
                    hasVoted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-emerald-600' : ''}`} />
                  <span>{article.helpfulVotes} مفيد</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
