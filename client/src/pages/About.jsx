import React from 'react';

export default function About({ onNavigate, settings }) {
  return (
    <div className="flex flex-col w-full text-right">
      
      {/* SECTION 1: Architectural Hero Header */}
      <section className="relative w-full bg-surface-container-low py-space-3xl border-b border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            
            <div className="lg:col-span-7 flex flex-col items-start text-right">
              {/* Construction Meta Badge */}
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-2xs bg-surface-container-high rounded-DEFAULT text-on-surface-variant font-technical-code text-technical-code mb-space-md border border-outline-variant/30">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span>ملف المؤسسة الميداني — ترخيص أمانة المنطقة الشرقية</span>
              </div>
              <h1 className="font-headline-hero text-headline-hero text-on-surface font-bold tracking-tight mb-space-md">
                من نحن — ركيزة البداية الصحيحة لمشاريع الإعمار
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
                مؤسسة إعمار وهدم للمقاولات العامة، فريق ميداني متخصص في أعمال الهدم والتكسير وإزالة السيراميك وتجهيز المواقع في الدمام وكافة مدن المنطقة الشرقية وفق المعايير الإنشائية وأنظمة السلامة المعتمدة.
              </p>

              {/* Direct Field Readiness Indicators */}
              <div className="mt-space-xl pt-space-md flex flex-wrap items-center gap-space-md">
                <div className="flex items-center gap-space-xs bg-surface p-space-sm rounded-DEFAULT shadow-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[22px]">engineering</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">إشراف هندسي وتنفيذي سعودي</span>
                </div>
                <div className="flex items-center gap-space-xs bg-surface p-space-sm rounded-DEFAULT shadow-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">امتثال كامل لاشتراطات الدفاع المدني</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              {/* Heavy Blueprint Box */}
              <div className="bg-primary-container text-surface p-space-lg rounded-DEFAULT shadow-xl relative z-10 border border-outline-variant/40">
                <div className="flex items-center justify-between pb-space-sm mb-space-md bg-tertiary-container p-space-xs rounded-DEFAULT">
                  <span className="font-technical-code text-technical-code text-secondary-fixed-dim font-bold">DOC: SPEC-ABOUT-KSA</span>
                  <span className="font-label-sm text-label-sm text-surface-variant">الدمام — الخبر — الظهران</span>
                </div>
                <p className="font-headline-sm text-headline-sm text-surface mb-space-sm font-bold">
                  «الهدم المنظم أساس الإعمار المتين»
                </p>
                <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
                  كل مشروع هدم أو تكسير يبدأ بمسح تفصيلي للعناصر الإنشائية الحاملة. نتولى المواقع بكل ثقلها ونسلّمها أرضاً مستوية نظيفة، مهيأة بالكامل للمقاول التالي دون أي مفاجآت بنيوية.
                </p>
                <div className="mt-space-lg pt-space-sm flex items-center justify-between font-technical-code text-technical-code text-surface-dim border-t border-on-primary-fixed-variant/40">
                  <span>نطاق العمليات: المباني والتجاري والصناعي</span>
                  <span className="text-secondary-fixed-dim font-bold">جاهزية ميدانية</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: Profile & Real Field Operations */}
      <section className="w-full py-space-4xl bg-surface">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
            
            <div className="lg:col-span-6 relative">
              <div className="w-full aspect-[4/3] rounded-DEFAULT overflow-hidden bg-surface-container-highest shadow-md border border-outline-variant/40">
                <img
                  src={settings?.about_image || "/images/renovation.png"}
                  alt="فريق إعمار وهدم للمقاولات العامة في الموقع بالدمام"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <span className="font-technical-code text-technical-code text-secondary font-bold uppercase tracking-wider">
                رؤية التأسيس والعمل الميداني
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                خبرة ميدانية تتجاوز التنفيذ السطحي
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                نحن لا نكتفي بإحضار المعدات وبدء التهديم؛ بل نعمل وفق خطة هندسية واضحة تشمل مسح المنشأة، تقييم الأحمال الخرسانية، وعزل المنطقة المحيطة لتفادي التصدعات بالمباني المجاورة.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                سواء كنت صاحب فيلا سكنية ترغب في إعادة التأسيس والتوسعة، أو مطوراً تجارياً يتطلع لتجهيز موقع معرض بالدمام، نوفر الكوادر والمعدات المناسبة للحجم والتحدي.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-sm">
                <div className="p-space-md bg-surface-container rounded-DEFAULT border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[24px] mb-space-2xs">security</span>
                  <h3 className="font-label-lg text-label-lg font-bold text-on-surface mb-space-2xs">الأمان والسلامة أولاً</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">تأمين كلي لمحيط الهدم ومنع انتشار الغبار والركام للمجاورين.</p>
                </div>
                <div className="p-space-md bg-surface-container rounded-DEFAULT border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[24px] mb-space-2xs">local_shipping</span>
                  <h3 className="font-label-lg text-label-lg font-bold text-on-surface">ترحيل فوري معتمد</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">نقل الأنقاض أولاً بأول إلى مرامي الأمانة الرسمية مع شهادات النقل.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: Values & Capabilities */}
      <section className="w-full bg-surface-container-high py-space-3xl border-t border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="text-right mb-space-2xl">
            <span className="font-technical-code text-technical-code text-secondary font-bold">FOUNDATION VALUES</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
              ركائز الاعتمادية في مقاولات الهدم
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="p-space-xl bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/40 shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-technical-code text-headline-md font-bold text-secondary">01</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface my-space-xs">الالتزام بالجدول الزمني</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  نعلم أن تأخير تسليم موقع الهدم يربك خطة المقاول الرئيسي ومواعيد صب الأساسات، لذلك نفي بالمواعيد الدقيقة المبرمة بالعقد.
                </p>
              </div>
            </div>

            <div className="p-space-xl bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/40 shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-technical-code text-headline-md font-bold text-secondary">02</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface my-space-xs">التسعير العادل والشفاف</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  تحديد التكاليف بناءً على المعاينة الميدانية الواقعية ورفع الأمتار بدون أي مصاريف مفاجئة أثناء سير العمل الميداني.
                </p>
              </div>
            </div>

            <div className="p-space-xl bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/40 shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-technical-code text-headline-md font-bold text-secondary">03</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface my-space-xs">المعدات والتجهيز</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  استخدام بوكلينات مزودة برؤوس تكسير هيدروليكية، هيلتيات هوائية للداخلي، وشاحنات قلاب سريعة التجاوب.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-space-2xl bg-primary-container text-surface p-space-xl rounded-DEFAULT shadow-lg flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
            <div className="flex flex-col text-right">
              <h3 className="font-headline-sm text-headline-sm font-bold text-surface">ترغب في معاينة ميدانية لموقعك بالدمام؟</h3>
              <p className="font-body-sm text-body-sm text-on-primary-container mt-space-2xs">تواصل مباشر مع المشرف التنفيذي لتحديد موعد الكشف المجاني.</p>
            </div>
            <button
              onClick={() => onNavigate('contact-us')}
              className="inline-flex items-center gap-space-xs px-space-xl py-space-sm bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-DEFAULT font-label-lg font-bold shadow-sm shrink-0"
            >
              <span>طلب معاينة ميدانية فورية</span>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
