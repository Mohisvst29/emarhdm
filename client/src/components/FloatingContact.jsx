import React, { useState } from 'react';

export default function FloatingContact() {
  const [showTooltipWa, setShowTooltipWa] = useState(false);
  const [showTooltipCall, setShowTooltipCall] = useState(false);

  return (
    <aside aria-label="الاتصال السريع الميداني" className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 items-center">
      
      {/* Floating WhatsApp Button */}
      <div className="relative flex items-center">
        {/* Tooltip on Hover */}
        {showTooltipWa && (
          <div className="absolute left-16 bg-primary-container text-surface px-space-md py-space-xs rounded-lg shadow-xl font-label-md font-bold whitespace-nowrap animate-fadeIn flex items-center gap-space-xs border border-outline-variant/30 text-right">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>واتساب الميداني: 0542703260</span>
          </div>
        )}

        <a
          href="https://wa.me/966542703260"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltipWa(true)}
          onMouseLeave={() => setShowTooltipWa(false)}
          className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="تواصل عبر واتساب 0542703260"
        >
          {/* Active status pulse dot */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping"></span>
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>

          {/* SVG WhatsApp Modern Icon */}
          <svg className="w-7 h-7 fill-current transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.099 4.019 4.075-1.069z"/>
          </svg>
        </a>
      </div>

      {/* Floating Call Button */}
      <div className="relative flex items-center">
        {/* Tooltip on Hover */}
        {showTooltipCall && (
          <div className="absolute left-16 bg-primary-container text-surface px-space-md py-space-xs rounded-lg shadow-xl font-label-md font-bold whitespace-nowrap animate-fadeIn flex items-center gap-space-xs border border-outline-variant/30 text-right">
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed-dim">call</span>
            <span dir="ltr">اتصال مباشر: 0546735579</span>
          </div>
        )}

        <a
          href="tel:0546735579"
          onMouseEnter={() => setShowTooltipCall(true)}
          onMouseLeave={() => setShowTooltipCall(false)}
          className="w-14 h-14 rounded-full bg-primary-container text-surface-container-high border-2 border-secondary/60 flex items-center justify-center shadow-[0_6px_20px_rgba(28,28,26,0.35)] hover:shadow-[0_8px_25px_rgba(144,77,0,0.5)] hover:bg-secondary hover:text-on-secondary hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label="اتصال هاتف مباشر 0546735579"
        >
          <span className="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:scale-110">
            call
          </span>
        </a>
      </div>

    </aside>
  );
}
