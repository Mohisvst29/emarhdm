import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function Services({ onNavigate }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setServices(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col w-full text-right">
      <SEOHead 
        title="خدمات الهدم والتكسير والسفلتة بالدمام"
        description="خدمات هدم المباني الكلي والجزئي، تكسير السيراميك والجدران، أعمال الأسفلت، ترحيل الأنقاض وشراء سكراب بالدمام والشرقية. اتصل الآن: 0546735579"
      />
      
      {/* Header Banner */}
      <section className="w-full bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop py-space-2xl border-b border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/30">
            <div className="flex items-center gap-space-xs">
              <span className="inline-block w-3 h-3 bg-secondary"></span>
              <span className="font-technical-code text-technical-code text-on-surface-variant font-bold">DOC-ID: DEM-KSA-EAMAR-2026</span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-sm text-label-sm text-secondary font-bold">المنطقة الشرقية • حاضرة الدمام</span>
            </div>
            <div className="flex items-center gap-space-xs bg-surface px-space-sm py-space-2xs rounded-DEFAULT shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
              <span className="font-label-sm text-label-sm text-on-surface font-bold">ترخيص بلدي معتمد لأعمال الهدم والإزالة الإنشائية</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end pt-space-xs">
            <div className="lg:col-span-8 flex flex-col gap-space-xs">
              <h1 className="font-headline-hero text-headline-hero text-on-surface font-bold tracking-tight">
                خدماتنا الميدانية المعتمدة في الدمام
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                حلول متكاملة تبدأ من التكسير الدقيق وإزالة التشطيبات وحتى هدم المباني وترحيل الأنقاض بأعلى درجات الأمان الهندسي.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-space-xs justify-end">
              <button
                onClick={() => onNavigate('contact-us')}
                className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm bg-secondary text-on-secondary hover:bg-on-secondary-container transition-colors rounded-DEFAULT font-label-lg text-label-lg font-bold shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">assignment_add</span>
                <span>طلب معاينة فنية مجانية فورية</span>
              </button>
              <a
                href="tel:0546735579"
                className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm bg-primary text-on-primary hover:bg-tertiary-container transition-colors rounded-DEFAULT font-label-md text-label-md font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span className="font-technical-code text-technical-code" dir="ltr">0546735579 المباشر الميداني</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Services List Grid */}
      <section className="w-full px-gutter-mobile lg:px-gutter-desktop py-space-3xl bg-surface">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-space-2xl">
          
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="font-technical-code text-technical-code bg-surface-container-high px-space-xs py-space-2xs text-on-surface font-bold">LIVE CATALOG</span>
              <span className="font-label-md text-label-md text-on-surface font-bold">قائمة الأعمال التنفيذية المباشرة ({services.length})</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline-block">تغطية تشمل: الدمام، الخبر، الظهران، سيهات والقطيف</span>
          </div>

          <div className="flex flex-col gap-space-2xl">
            {loading ? (
              <div className="p-space-2xl text-center text-on-surface-variant font-bold">جاري تحميل كتالوج الخدمات الميدانية...</div>
            ) : (
              services.map((srv) => {
                const specsList = srv.specs ? srv.specs.split(/[,|]/) : [];
                return (
                  <article
                    key={srv.id}
                    className="bg-surface-container-low rounded-DEFAULT overflow-hidden shadow-sm border border-outline-variant/40 flex flex-col lg:grid lg:grid-cols-12"
                  >
                    <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
                      <img
                        src={srv.image || '/images/construction.png'}
                        alt={srv.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-space-sm right-space-sm bg-primary-container text-on-primary px-space-sm py-space-2xs rounded-DEFAULT shadow-md flex items-center gap-space-2xs border border-outline-variant/30">
                        <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                        <span className="font-technical-code text-technical-code font-bold">{srv.code}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 p-space-lg lg:p-space-xl flex flex-col justify-between gap-space-md">
                      <div className="flex flex-col gap-space-xs">
                        <span className="font-label-sm text-label-sm font-bold text-secondary">{srv.tag || srv.category}</span>
                        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{srv.title}</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-space-2xs">
                          {srv.description}
                        </p>

                        {specsList.length > 0 && (
                          <div className="mt-space-sm pt-space-sm border-t border-outline-variant/30">
                            <span className="font-label-md text-label-md font-bold text-on-surface mb-space-xs block">
                              نطاق التنفيذ والمواصفات الفنية:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                              {specsList.map((spec, sIdx) => (
                                <li key={sIdx} className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface">
                                  <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                                  <span>{spec.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-outline-variant/30 bg-surface-container-lowest/60 p-space-sm rounded-DEFAULT">
                        <span className="font-label-md text-label-md text-on-surface font-semibold">تنفيذ ميداني مرخص ومضمون بالكامل</span>
                        <a
                          href={`https://wa.me/966542703260?text=${encodeURIComponent(srv.wa_text || 'استفسار عن خدمة: ' + srv.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-secondary text-on-secondary hover:bg-on-secondary-container transition-colors rounded-DEFAULT font-label-md text-label-md font-bold"
                        >
                          <span>طلب معاينة هذه الخدمة</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

        </div>
      </section>

      {/* Execution Workflow Steps */}
      <section className="w-full bg-surface-container-high py-space-3xl px-gutter-mobile lg:px-gutter-desktop border-t border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-space-2xl">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <span className="font-technical-code text-technical-code text-secondary font-bold">WORKFLOW EXECUTION STANDARDS</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">معايير ومراحل تنفيذ الخدمة الميدانية</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              نتبع في مؤسسة إعمار وهدم منهجية تشغيلية دقيقة مطابقة للاشتراطات الفنية لتأمين أرواح العاملين وسلامة المنشآت المجاورة في الدمام.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface p-space-lg rounded-DEFAULT flex flex-col justify-between gap-space-md shadow-sm border border-outline-variant/30">
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-technical-code text-headline-sm font-bold text-secondary">01</span>
                  <span className="material-symbols-outlined text-[28px] text-on-surface-variant">straighten</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">المعاينة الميدانية المجانية</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  زيارة مهندس أو مشرف ميداني للموقع في الدمام والخبر، فحص المخططات الإنشائية، ورفع المساحات وحجم الركام بدقة متناهية.
                </p>
              </div>
              <div className="bg-surface-container-low px-space-xs py-space-2xs rounded-DEFAULT border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface font-medium">كشف ميداني مدروس بدون رسوم</span>
              </div>
            </div>

            <div className="bg-surface p-space-lg rounded-DEFAULT flex flex-col justify-between gap-space-md shadow-sm border border-outline-variant/30">
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-technical-code text-headline-sm font-bold text-secondary">02</span>
                  <span className="material-symbols-outlined text-[28px] text-on-surface-variant">security</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">التأمين وتراخيص العمل</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  استخراج التراخيص البلدية المطلوبة، فصل وتأمين شبكات المياه والكهرباء، وعزل الموقع بسياج أمني لحماية الجيران والمارة.
                </p>
              </div>
              <div className="bg-surface-container-low px-space-xs py-space-2xs rounded-DEFAULT border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface font-medium">وفق اشتراطات الدفاع المدني والأمانة</span>
              </div>
            </div>

            <div className="bg-surface p-space-lg rounded-DEFAULT flex flex-col justify-between gap-space-md shadow-sm border border-outline-variant/30">
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-technical-code text-headline-sm font-bold text-secondary">03</span>
                  <span className="material-symbols-outlined text-[28px] text-on-surface-variant">construction</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">المباشرة والتنفيذ الملتزم</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  إنزال المعدات الثقيلة والكوادر المتخصصة، والبدء وفق الجدول الزمني المحدد سلفاً بالعقد مع تقارير يومية لسير العمل.
                </p>
              </div>
              <div className="bg-surface-container-low px-space-xs py-space-2xs rounded-DEFAULT border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface font-medium">التزام بالوقت وسرعة في الإنجاز</span>
              </div>
            </div>

            <div className="bg-surface p-space-lg rounded-DEFAULT flex flex-col justify-between gap-space-md shadow-sm border border-outline-variant/30">
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-technical-code text-headline-sm font-bold text-secondary">04</span>
                  <span className="material-symbols-outlined text-[28px] text-on-surface-variant">task_alt</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">التسليم النظيف المعتمد</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  ترحيل كامل الأنقاض، تسوية الأرضية ودكها عند الحاجة، وتسليم الموقع خالياً تماماً وجاهزاً لمرحلة البناء أو التشطيب.
                </p>
              </div>
              <div className="bg-surface-container-low px-space-xs py-space-2xs rounded-DEFAULT border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface font-medium">محضر تسليم رسمي موثق</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
