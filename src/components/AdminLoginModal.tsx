import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept "admin", "1234", or empty for quick test
    if (password === 'admin' || password === '1234' || password === '') {
      setError(false);
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleQuickDemoLogin = () => {
    setError(false);
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shadow">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                بوابة دخول الإدارة والدعم الفني
              </h3>
              <p className="text-xs text-slate-500">
                خاصة بمشرفي وفنيي الصيانة فقط
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-800 block mb-1">
            🔒 منطقة محمية ومخصصة:
          </span>
          لوحة الفنيين وإحصائيات البلاغات معزولة ومخصصة فقط لإدارة القسم لمتابعة الصيانة وإسناد التذاكر.
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              كلمة مرور أو رمز التحقق للإدارة:
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="أدخل الرمز (الافتراضي: admin أو 1234)"
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600 font-mono"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-red-600 text-[11px] mt-1.5 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>رمز المرور غير صحيح. يمكنك استخدام "admin" أو النقر على الدخول السريع أدناه.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>تسجيل الدخول للوحة الإدارة</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <span>دخول مباشر وسريع للمناقشة والتقييم (Demo Access)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
