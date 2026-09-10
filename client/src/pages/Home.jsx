import React, { useState, useEffect } from 'react';

export default function Home({ onNavigate, settings }) {
  // Multi Hero Background Images Carousel
  const defaultBgs = [
    '/images/construction.png',
    '/images/selective_demolition.png',
    '/images/renovation.png',
    '/images/tile_removal.png'
  ];

  const heroBackgrounds = (settings && settings.hero_images)
    ? settings.hero_images.split(',').filter(Boolean)
    : defaultBgs;

  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBackgrounds.length]);

  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setServices(data.data);
        }
      })
      .catch(err => console.error('Error fetching services for home:', err));

    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setProjects(data.data);
        }
      })
      .catch(err => console.error('Error fetching projects for home:', err));
  }, []);

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. CINEMATIC ARCHITECTURAL HERO WITH MULTI-BACKGROUND SLIDER */}
      <section className="relative w-full bg-primary-container text-surface overflow-hidden pt-12 pb-space-4xl">
        
        {/* Animated Background Slider */}
        <div className="absolute inset-0 z-0">
          {heroBackgrounds.map((bg, idx) => (
            <img
              key={idx}
              src={bg}
              alt="أعمال هدم ومعدات ثقيلة"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroIdx ? 'opacity-35 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/85 to-primary-container/60"></div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 right-1/2 translate-x-1/2 z-20 flex items-center gap-2">
          {heroBackgrounds.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentHeroIdx ? 'w-8 bg-secondary' : 'w-2 bg-surface/40 hover:bg-surface/70'
              }`}
              aria-label={`خلفية ${idx + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-2xl pb-space-3xl flex flex-col items-start text-right">
          
          {/* Location & License Badge */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-space-2xs bg-surface/10 backdrop-blur-sm rounded-DEFAULT text-surface-container-high mb-space-lg shadow-sm border border-surface/20">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
            <span className="font-label-sm text-label-sm font-semibold tracking-wide text-secondary-fixed-dim">
              الدمام، المنطقة الشرقية
            </span>
            <span className="text-outline text-xs">|</span>
            <span className="font-label-sm text-label-sm text-surface-variant">
              مقاولات عامة وهدم إنشائي معتمد
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline-hero text-headline-hero text-surface font-bold max-w-4xl tracking-tight leading-tight mb-space-md">
            نهدم باحتراف... <br />
            <span className="text-secondary-fixed-dim">لنبدأ مرحلة الإعمار</span>
          </h1>

          {/* Supporting Subtitle */}
          <p className="font-body-lg text-body-lg text-surface-variant max-w-2xl leading-relaxed mb-space-2xl">
            متخصصون في أعمال الهدم والتكسير وإزالة السيراميك وتجهيز المواقع الإنشائية والتجارية والسكنية في الدمام بأعلى معايير السلامة والتنفيذ الهندسي المنظم.
          </p>

          {/* Action Buttons Panel */}
          <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto">
            <button
              onClick={() => onNavigate('contact-us')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-space-sm bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-lg text-label-lg font-bold rounded-DEFAULT transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">request_quote</span>
              <span>اطلب معاينة مجانية بالموقع</span>
            </button>

            <a
              href="https://wa.me/966542703260"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm bg-surface-container-highest text-on-surface hover:bg-surface font-label-lg text-label-lg font-bold rounded-DEFAULT transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">chat</span>
              <span>تواصل عبر واتساب (0542703260)</span>
            </a>

            <a
              href="tel:0546735579"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm text-surface-container-high hover:text-surface font-technical-code text-technical-code font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed-dim">call</span>
              <span dir="ltr">0546735579</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="w-full bg-surface-container-high py-space-lg border-y border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md text-right">
            
            <div className="flex items-center gap-space-sm p-space-md bg-surface-container-lowest rounded-DEFAULT shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
              <div className="p-space-xs bg-surface-container rounded-DEFAULT text-primary">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg font-bold text-on-surface">تنفيذ احترافي</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">وفق معايير واشتراطات السلامة</span>
              </div>
            </div>

            <div className="flex items-center gap-space-sm p-space-md bg-surface-container-lowest rounded-DEFAULT shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
              <div className="p-space-xs bg-surface-container rounded-DEFAULT text-primary">
                <span className="material-symbols-outlined text-[24px]">schedule</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg font-bold text-on-surface">سرعة في الإنجاز</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">تسليم الموقع وفق الجداول المحددة</span>
              </div>
            </div>

            <div className="flex items-center gap-space-sm p-space-md bg-surface-container-lowest rounded-DEFAULT shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
              <div className="p-space-xs bg-surface-container rounded-DEFAULT text-primary">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg font-bold text-on-surface">أسعار تنافسية وشفافة</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">عقود واضحة بلا تكاليف خفية</span>
              </div>
            </div>

            <div className="flex items-center gap-space-sm p-space-md bg-surface-container-lowest rounded-DEFAULT shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300">
              <div className="p-space-xs bg-surface-container rounded-DEFAULT text-primary">
                <span className="material-symbols-outlined text-[24px]">near_me</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg font-bold text-on-surface">تغطية شاملة</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">لكافة أحياء الدمام ومحافظات الشرقية</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section className="w-full bg-surface py-space-4xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-6 relative">
              <div className="w-full aspect-[4/3] rounded-DEFAULT overflow-hidden bg-surface-container-highest shadow-md border border-outline-variant/40 group">
                <img
                  src={settings?.about_image || "/images/renovation.png"}
                  alt="أعمال تكسير داخلية وإشراف ميداني بالدمام"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-space-md -right-space-md hidden sm:flex items-center gap-space-sm p-space-md bg-primary-container text-surface rounded-DEFAULT shadow-xl max-w-xs border border-outline-variant/40">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-[32px]">engineering</span>
                <div className="flex flex-col text-right">
                  <span className="font-label-md text-label-md font-bold text-surface">إشراف هندسي ميداني</span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">كادر وطني ومعدات متقدمة</span>
                </div>
              </div>
            </div>

            {/* Copy Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-right">
              <span className="font-label-md text-label-md font-bold text-secondary uppercase tracking-widest mb-space-xs">
                عن المؤسسة
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface leading-tight mb-space-md">
                الهدم الصحيح... <br />
                <span className="text-on-surface-variant">هو بداية البناء الصحيح.</span>
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-space-md">
                تأسست «إعمار وهدم للمقاولات العامة» لتكون الشريك الموثوق للمطورين، المقاولين، وأصحاب العقارات في مدينة الدمام ومحافظات المنطقة الشرقية.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-xl">
                ندرك أن مرحلة الإزالة وتجهيز المواقع هي الأساس الحرج لأي مشروع إعماري ناجح، لذا نعتمد على أسطول معدات متخصصة وكوادر ميدانية متمرسة تضمن الدقة المتناهية، النظافة، والسلامة الإنشائية للعقارات المجاورة.
              </p>

              <div className="flex flex-wrap gap-space-sm w-full">
                <button
                  onClick={() => onNavigate('about-us')}
                  className="inline-flex items-center gap-space-xs px-space-lg py-space-sm bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold rounded-DEFAULT transition-all hover:scale-105 active:scale-95"
                >
                  <span>اقرأ المزيد عن هويتنا الميدانية</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                </button>
                <div className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container rounded-DEFAULT text-on-surface font-label-md text-label-md font-semibold border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[20px]">task_alt</span>
                  <span>سجل تجاري وترخيص بلدي ساري</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION (3x2 GRID) */}
      <section className="w-full bg-surface-container-low py-space-4xl border-y border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl text-right">
            <div>
              <span className="font-label-md text-label-md font-bold text-secondary uppercase tracking-wider">نطاق العمليات</span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">خدماتنا الميدانية المعتمدة</h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-space-xs md:mt-0">
              نجهز موقعك للخطوة التالية بأعلى معايير الدقة والالتزام بسلامة المنشأة والمباني المجاورة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {services.map((srv, idx) => (
              <div
                key={idx}
                className="flex flex-col bg-surface-container-lowest rounded-DEFAULT overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-outline-variant/40 text-right group"
              >
                <div className="h-48 w-full overflow-hidden bg-surface-container relative">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-space-xs right-space-xs bg-primary-container text-surface px-space-xs py-space-2xs rounded-DEFAULT text-technical-code font-bold">
                    {srv.code}
                  </div>
                </div>

                <div className="p-space-lg flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-technical-code text-technical-code font-bold text-secondary">{srv.code}</span>
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{srv.icon}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-xs">{srv.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-lg">
                      {srv.desc || srv.description}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/966542703260?text=${srv.waText || srv.wa_text || 'طلب%20معاينة%20خدمة'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full pt-space-sm border-t border-outline-variant/30 text-on-surface hover:text-secondary font-label-md text-label-md font-bold transition-colors"
                  >
                    <span>اطلب الخدمة عبر واتساب</span>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-space-2xl text-center">
            <button
              onClick={() => onNavigate('our-services')}
              className="inline-flex items-center gap-space-xs px-space-xl py-space-sm bg-primary text-on-primary hover:bg-primary-container rounded-DEFAULT font-label-lg font-bold shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              <span>استعرض التفاصيل الفنية لكافة الخدمات</span>
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. PROJECTS GALLERY TEASER */}
      <section className="w-full bg-surface-container-low py-space-4xl border-t border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl text-right">
            <div>
              <span className="font-label-md text-label-md font-bold text-secondary uppercase tracking-wider">سجل الإنجاز الميداني</span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">من واقع مشاريعنا في الدمام</h2>
            </div>
            <button
              onClick={() => onNavigate('our-work')}
              className="inline-flex items-center gap-space-2xs text-secondary font-label-md font-bold hover:underline mt-space-xs md:mt-0"
            >
              <span>عرض المعرض الميداني الكامل</span>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
            {projects.slice(0, 4).map((prj, idx) => {
              const isLarge = idx === 0 || idx === 3;
              const spanClass = isLarge ? 'md:col-span-8' : 'md:col-span-4';
              const aspectClass = isLarge ? 'aspect-[16/10]' : 'aspect-[4/3]';
              return (
                <div key={prj.id || idx} className={`${spanClass} group relative rounded-DEFAULT overflow-hidden bg-surface-container-highest ${aspectClass} shadow-sm border border-outline-variant/40`}>
                  <img
                    src={prj.image || '/images/construction.png'}
                    alt={prj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/40 to-transparent"></div>
                  <div className="absolute bottom-0 inset-x-0 p-space-lg text-right flex flex-col items-start">
                    <span className="px-space-xs py-space-2xs bg-secondary text-on-secondary rounded-DEFAULT font-label-sm text-label-sm font-bold mb-space-2xs">
                      {prj.category || 'هدم ومقاولات'}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-surface">
                      {prj.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-surface-variant mt-space-2xs line-clamp-2">
                      {prj.description || prj.desc || prj.location}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. DIRECT CTA FOOTER STRIP */}
      <section className="w-full bg-primary-container text-surface py-space-4xl relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
          <div className="p-space-2xl bg-tertiary-container rounded-DEFAULT shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-space-xl text-right border border-outline-variant/20">
            <div className="flex flex-col items-start max-w-2xl">
              <div className="inline-flex items-center gap-space-2xs text-secondary-fixed-dim font-technical-code text-technical-code font-bold mb-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
                <span>جاهزون للمعاينة الفورية اليوم في الدمام والشرقية</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-surface mb-space-xs">
                عندك موقع يحتاج هدم أو تكسير؟
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed">
                تواصل معنا الآن ودع أعمال الهدم والتجهيز علينا. نقوم بالمعاينة الميدانية السريعة وتقديم أفضل تسعير دقيق وواضح لمشروعك.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-space-md w-full lg:w-auto">
              <a
                href="https://wa.me/966542703260"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-space-xs px-space-xl py-space-md bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-lg text-label-lg font-bold rounded-DEFAULT transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>واتساب الآن: 0542703260</span>
              </a>
              <a
                href="tel:0546735579"
                className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-md bg-surface-container-highest text-on-surface hover:bg-surface font-label-lg text-label-lg font-bold rounded-DEFAULT transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">call</span>
                <span className="font-technical-code" dir="ltr">0546735579</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
