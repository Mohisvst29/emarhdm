import React, { useState } from 'react';

export default function Header({ currentPath, onNavigate, settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoSrc = settings?.logo || '/images/logo.png';
  const logoSizePx = parseInt(settings?.logo_size || '44', 10);

  const navLinks = [
    { id: 'home', label: 'الرئيسية', icon: 'home' },
    { id: 'about-us', label: 'من نحن', icon: 'info' },
    { id: 'our-services', label: 'خدماتنا', icon: 'construction' },
    { id: 'our-work', label: 'أعمالنا', icon: 'photo_library' },
    { id: 'articles', label: 'المقالات والكتالوج', icon: 'article' },
    { id: 'contact-us', label: 'اتصل بنا', icon: 'phone_in_talk' }
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_4px_rgba(28,28,24,0.06)] border-b border-outline-variant/30 transition-all duration-300">
      <div className="h-16 sm:h-20 max-w-[1280px] mx-auto px-3 sm:px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-2">
        
        {/* Brand Official Logo & Title */}
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          onClick={() => onNavigate('home')}
        >
          <div 
            className="rounded-full overflow-hidden bg-surface p-0.5 shadow-sm border border-outline-variant/40 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center shrink-0"
            style={{ width: `${Math.min(logoSizePx, 48)}px`, height: `${Math.min(logoSizePx, 48)}px` }}
          >
            <img
              src={logoSrc}
              alt="شعار إعمار وهدم للمقاولات العامة"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-headline-sm text-sm sm:text-headline-sm font-bold text-on-surface tracking-tight leading-none transition-colors group-hover:text-secondary">
              إعمار وهدم
            </span>
            <span className="hidden sm:inline font-label-sm text-label-sm text-on-surface-variant font-medium mt-space-2xs">
              للمقاولات العامة - الدمام
            </span>
            <span className="sm:hidden text-[10px] text-on-surface-variant font-medium">
              الدمام والشرقية
            </span>
          </div>
        </div>

        {/* Desktop Public Navigation */}
        <nav className="hidden lg:flex items-center gap-space-xs p-space-2xs bg-surface-container rounded-DEFAULT border border-outline-variant/20">
          {navLinks.map((link) => {
            const isActive = currentPath === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-space-md py-space-xs rounded-DEFAULT transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm scale-[1.02]'
                    : 'font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Actions & Mobile 3-Bars Hamburger Toggler */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Call Phone Button (Desktop & Tablet) */}
          <a
            href="tel:0546735579"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all duration-200 rounded-xl font-label-md text-xs sm:text-label-md font-semibold border border-outline-variant/40 hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">call</span>
            <span className="font-technical-code font-bold" dir="ltr">
              0546735579
            </span>
          </a>

          {/* WhatsApp Direct Button */}
          <a
            href="https://wa.me/966542703260"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-secondary text-on-secondary hover:bg-on-secondary-container transition-all duration-200 rounded-xl font-label-md text-xs sm:text-label-md font-bold shadow-sm hover:scale-105 active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span className="hidden sm:inline">واتساب 0542703260</span>
            <span className="sm:hidden">واتساب</span>
          </a>

          {/* Prominent 3-Bars Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl font-bold transition-all shadow-md border border-outline-variant/20 shrink-0 cursor-pointer active:scale-95"
            aria-label="القائمة الرئيسية"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
            <span className="text-xs font-bold">القائمة</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest/98 backdrop-blur-xl border-b border-outline-variant/40 p-4 flex flex-col gap-2 shadow-2xl animate-fade-in text-right">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-outline-variant/30 text-on-surface-variant text-xs font-bold">
            <span>قائمة الصفحات والملاحة</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface hover:text-error transition-colors p-1"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentPath === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-right px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-on-primary font-bold shadow-md'
                      : 'text-on-surface hover:bg-surface-container-high font-label-md border border-outline-variant/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
              );
            })}
          </div>

          {/* Quick Mobile Action Buttons inside drawer */}
          <div className="mt-3 pt-3 border-t border-outline-variant/30 flex flex-col gap-2">
            <a
              href="tel:0546735579"
              className="w-full py-2.5 bg-surface-container-high text-on-surface font-label-md font-bold rounded-xl flex items-center justify-center gap-2 border border-outline-variant/40"
            >
              <span className="material-symbols-outlined text-secondary text-lg">call</span>
              <span>اتصال مباشر: <span dir="ltr">0546735579</span></span>
            </a>
            <a
              href="https://wa.me/966542703260"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-secondary text-on-secondary font-label-md font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              <span>محادثة واتساب فورية</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
