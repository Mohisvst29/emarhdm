import React from 'react';

export default function Footer({ onNavigate, settings }) {
  const logoSrc = settings?.logo || '/images/logo.png';
  const logoSizePx = parseInt(settings?.logo_size || '44', 10) + 12; // slightly larger for footer
  const locationText = settings?.location || 'الدمام، المنطقة الشرقية، المملكة العربية السعودية';

  return (
    <footer className="w-full bg-primary-container text-surface-container-high py-space-3xl border-t border-outline-variant/20">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl pb-space-2xl">
          
          {/* Brand Info with Official Emblem */}
          <div className="md:col-span-5 flex flex-col items-start gap-space-sm text-right">
            <div className="flex items-center gap-space-md">
              <div 
                className="rounded-full bg-surface p-1 shadow-md border border-outline-variant/40 shrink-0 flex items-center justify-center"
                style={{ width: `${logoSizePx}px`, height: `${logoSizePx}px` }}
              >
                <img
                  src={logoSrc}
                  alt="شعار إعمار وهدم للمقاولات العامة"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-headline-md text-headline-md font-bold text-surface tracking-tight leading-snug">
                  إعمار وهدم للمقاولات العامة
                </span>
                <span className="font-label-md text-label-md text-secondary-fixed-dim font-medium">
                  {locationText}
                </span>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
              مؤسسة مقاولات عامة متخصصة في أعمال الهدم الكلي والجزئي، الأسفلت والسفلتة، شراء السكراب، التسوية الإنشائية، ترحيل الأنقاض، وحفريات المشاريع الكبرى وفق المعايير واللوائح البلدية المعتمدة بالمنطقة الشرقية.
            </p>

            {/* Modern Social Media Icons */}
            <div className="flex items-center gap-2 pt-2">
              <span className="font-label-md font-bold text-surface ml-2">تابعنا:</span>
              
              {/* WhatsApp */}
              <a
                href={`https://wa.me/966${(settings?.whatsapp || '0542703260').replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110"
                title="واتساب"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.483 1.332 5.001L2 22l5.148-1.348a9.96 9.96 0 004.86 1.258h.004c5.507 0 9.99-4.479 9.99-9.985.001-2.668-1.034-5.176-2.916-7.059A9.919 9.919 0 0012.012 2zm0 1.664a8.27 8.27 0 015.867 2.43 8.27 8.27 0 012.433 5.874c0 4.57-3.719 8.288-8.289 8.288a8.24 8.24 0 01-4.218-1.157l-.302-.18-3.053.8.814-2.977-.197-.314A8.247 8.247 0 013.676 11.99c0-4.57 3.719-8.288 8.289-8.288z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href={settings?.social_twitter || "https://twitter.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-surface-container-high text-surface hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110"
                title="تويتر / منصة X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={settings?.social_instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110"
                title="انستغرام"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href={settings?.social_tiktok || "https://tiktok.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-black text-white hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110"
                title="تيك توك"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.29 0 .56.04.82.12V9.4a6.27 6.27 0 00-1-.08A6.34 6.34 0 003 15.66a6.34 6.34 0 0010.82 4.47v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-3-1.03z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={settings?.social_linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm hover:scale-110"
                title="لينكد إن"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-space-sm text-right">
            <span className="font-headline-sm text-headline-sm font-semibold text-surface">
              التنقل السريع
            </span>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-primary-container">
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-outline">chevron_left</span>
                <button onClick={() => onNavigate('home')} className="hover:text-surface transition-colors">
                  الرئيسية
                </button>
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-outline">chevron_left</span>
                <button onClick={() => onNavigate('about-us')} className="hover:text-surface transition-colors">
                  من نحن
                </button>
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-outline">chevron_left</span>
                <button onClick={() => onNavigate('our-services')} className="hover:text-surface transition-colors">
                  خدمات الهدم والمقاولات
                </button>
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-outline">chevron_left</span>
                <button onClick={() => onNavigate('our-work')} className="hover:text-surface transition-colors">
                  سجل الأعمال والمشاريع
                </button>
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-outline">chevron_left</span>
                <button onClick={() => onNavigate('articles')} className="hover:text-surface transition-colors">
                  المقالات والكتالوج الإرشادي (SEO)
                </button>
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-outline">chevron_left</span>
                <button onClick={() => onNavigate('contact-us')} className="hover:text-surface transition-colors">
                  طلب تسعيرة ومعاينة ميدانية
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="md:col-span-4 flex flex-col gap-space-sm text-right">
            <span className="font-headline-sm text-headline-sm font-semibold text-surface">
              التواصل والمقر
            </span>
            <div className="flex flex-col gap-space-sm font-body-sm text-body-sm text-on-primary-container">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary-fixed-dim mt-space-2xs text-[18px]">location_on</span>
                <span>الدمام، حي الشاطئ - المنطقة الشرقية، المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">call</span>
                <a href="tel:0546735579" className="font-technical-code text-technical-code font-bold text-surface hover:text-secondary-fixed-dim transition-colors" dir="ltr">
                  0546735579
                </a>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">chat</span>
                <a href="https://wa.me/966542703260" target="_blank" rel="noopener noreferrer" className="font-technical-code text-technical-code font-bold text-surface hover:text-secondary-fixed-dim transition-colors" dir="ltr">
                  0542703260
                </a>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">schedule</span>
                <span>السبت - الخميس: ٧:٠٠ ص - ٦:٠٠ م (الطوارئ الميدانية ٢٤/٧)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Clean Footer Bottom Bar */}
        <div className="pt-space-lg border-t border-on-primary-fixed-variant/40 flex flex-col sm:flex-row items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-primary-container">
          <p>© {new Date().getFullYear()} إعمار وهدم للمقاولات العامة - الدمام. جميع الحقوق محفوظة.</p>
          <span className="text-outline-variant font-technical-code text-technical-code">
            DAMMAM - KSA
          </span>
        </div>
      </div>
    </footer>
  );
}
