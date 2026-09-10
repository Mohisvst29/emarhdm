import React, { useState } from 'react';

export default function AdminLogin({ onLoginSuccess, onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password: cleanPassword })
      });
      const result = await res.json();

      if (result.success) {
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_user', result.username);
        onLoginSuccess(result.token);
      } else {
        setErrorMsg(result.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 bg-surface text-right relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10 animate-scale-in">
        
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="font-headline-md font-bold text-on-surface">تسجيل دخول الإدارة</h1>
          <p className="font-body-sm text-on-surface-variant">منطقة محمية لإدارة خدمات ومقالات إعمار السعودية</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-error/10 border border-error/30 text-error font-body-sm flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-secondary">person</span>
              <span>اسم المستخدم</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl p-3 font-body-md text-on-surface focus:border-primary focus:outline-none transition-colors text-right"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md font-bold text-on-surface flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-secondary">lock</span>
                <span>كلمة المرور</span>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl p-3 font-body-md text-on-surface focus:border-primary focus:outline-none transition-colors text-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-primary text-on-primary font-label-lg font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">login</span>
                <span>دخول لوحة التحكم</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-on-surface-variant hover:text-primary font-label-sm font-semibold transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
            <span>العودة للواجهة الرئيسية</span>
          </button>
        </div>

      </div>
    </div>
  );
}
