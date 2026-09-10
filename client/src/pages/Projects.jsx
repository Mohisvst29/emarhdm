import React, { useState } from 'react';

export default function Projects({ onNavigate }) {
  const [filter, setFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'مشروع هدم هيكل خرساني وترحيل مخلفات',
      category: 'هدم كلي',
      catKey: 'total',
      location: 'حي الشاطئ الغربي - الدمام',
      desc: 'إزالة 3 طوابق خرسانية مسلحة مع ترحيل 420 طن أنقاض وتسليم الأرض مستوية وجاهزة للبدء في أعمال الأساسات والخرسانات الجديدة.',
      image: '/images/construction.png',
      specs: 'المساحة: 750م² • المدة: 6 أيام • المعدات: بوكلين كوماتسو PC400'
    },
    {
      id: 2,
      title: 'هدم جزئي وتوسعة واجهات مبنى سكني',
      category: 'هدم جزئي',
      catKey: 'selective',
      location: 'حي الحزام الذهبي - الخبر',
      desc: 'تفكيك وإزالة الملحق الخارجي والسور والواجهة الجانبية مع المحافظة الكاملة والسلامة الإنشائية للهيكل الرئيسي للفيلا.',
      image: '/images/selective_demolition.png',
      specs: 'المساحة: 220م² • المدة: 3 أيام • المعدات: جاك هامر + بوكلين خفيف'
    },
    {
      id: 3,
      title: 'تجريد سيراميك وتجهيز معرض تجاري 800م²',
      category: 'إزالة سيراميك',
      catKey: 'tiles',
      location: 'طريق الملك فهد - الدمام',
      desc: 'قشط وتكسير أرضيات البلاط والسيراميك القديم لصالة عرض تجارية وإزالة طبقات الغراء وتجهيز السطح لاستقبال صبة الإيبوكسي.',
      image: '/images/tile_removal.png',
      specs: 'المساحة: 800م² • المدة: 48 ساعة • المعدات: هيلتيات هوائية عالية القدرة'
    },
    {
      id: 4,
      title: 'تكسير جدران وإعادة توزيع مساحات إدارية',
      category: 'ترميم داخلي',
      catKey: 'interior',
      location: 'برج مكتبي - وسط الدمام',
      desc: 'تفريغ قواطع بلوك داخلية وفصل التمديدات الكهربائية والسباكة مع المحافظة التامة على الأعمدة والجسور الخرسانية.',
      image: '/images/renovation.png',
      specs: 'المساحة: 450م² • المدة: 3 أيام • الكادر: فريق قص وتكسير متخصص'
    },
    {
      id: 5,
      title: 'هدم مستودع قديم وتجهيز أرضية صناعية',
      category: 'هدم كلي',
      catKey: 'total',
      location: 'المنطقة الصناعية الثانية - الدمام',
      desc: 'تقويض جملونات حديدية وقواعد خرسانية مسلحة لهنجر صناعي بمساحة 1500م² وترحيل كامل الأنقاض إلى المرامي البلدية المعتمدة.',
      image: '/images/construction.png',
      specs: 'المساحة: 1500م² • المدة: 5 أيام • المعدات: بوكلين مقص + 8 شاحنات قلاب'
    },
    {
      id: 6,
      title: 'إزالة وتكسير بلاط وجدران مطابخ مجمع تجاري',
      category: 'إزالة سيراميك',
      catKey: 'tiles',
      location: 'حي الفاخرية - الدمام',
      desc: 'تجريد كامل للحوائط والأرضيات لمجموعة مطابخ ومقاهي تجارية مع العزل والتنظيف الدقيق للموقع.',
      image: '/images/tile_removal.png',
      specs: 'المساحة: 380م² • المدة: 3 أيام • المعدات: هيلتيات قشط هيدروليكية'
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.catKey === filter);

  return (
    <div className="flex flex-col w-full text-right">
      
      {/* Header */}
      <section className="w-full bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop py-space-2xl border-b border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-space-md">
          <div className="inline-flex items-center gap-space-xs text-secondary font-technical-code text-technical-code font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span>سجل الإنجازات الميدانية بالمستندات والصور</span>
          </div>
          <h1 className="font-headline-hero text-headline-hero text-on-surface font-bold tracking-tight">
            سجل أعمالنا ومشاريعنا في الدمام والشرقية
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            توثيق حقيقي لعمليات الهدم الإنشائي، الهدم الجزئي، إزالة السيراميك، وتعديل المساحات في المواقع السكنية والتجارية والصناعية.
          </p>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-space-xs pt-space-sm">
            <span className="font-label-sm text-label-sm font-bold text-on-surface ml-space-xs">التصنيف:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-space-md py-space-xs rounded-DEFAULT font-label-sm font-bold transition-all ${
                filter === 'all'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
              }`}
            >
              جميع المشاريع ({projects.length})
            </button>
            <button
              onClick={() => setFilter('total')}
              className={`px-space-md py-space-xs rounded-DEFAULT font-label-sm font-bold transition-all ${
                filter === 'total'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
              }`}
            >
              هدم كلي وتسوية
            </button>
            <button
              onClick={() => setFilter('selective')}
              className={`px-space-md py-space-xs rounded-DEFAULT font-label-sm font-bold transition-all ${
                filter === 'selective'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
              }`}
            >
              هدم جزئي وتوسعة
            </button>
            <button
              onClick={() => setFilter('tiles')}
              className={`px-space-md py-space-xs rounded-DEFAULT font-label-sm font-bold transition-all ${
                filter === 'tiles'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
              }`}
            >
              إزالة سيراميك وأرضيات
            </button>
            <button
              onClick={() => setFilter('interior')}
              className={`px-space-md py-space-xs rounded-DEFAULT font-label-sm font-bold transition-all ${
                filter === 'interior'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
              }`}
            >
              ترميم وتعديل داخلي
            </button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="w-full px-gutter-mobile lg:px-gutter-desktop py-space-3xl bg-surface">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-space-xl">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-surface-container-low rounded-DEFAULT overflow-hidden shadow-sm border border-outline-variant/40 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-highest">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-space-xs right-space-xs bg-primary-container text-on-primary px-space-xs py-space-2xs rounded-DEFAULT font-label-sm text-label-sm font-bold shadow-md">
                    {project.category}
                  </div>
                  <div className="absolute bottom-space-xs right-space-xs bg-surface/90 backdrop-blur-sm text-on-surface px-space-xs py-space-2xs rounded-DEFAULT font-technical-code text-technical-code font-bold shadow-sm">
                    {project.location}
                  </div>
                </div>

                <div className="p-space-lg flex flex-col gap-space-xs">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {project.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {project.desc}
                  </p>
                </div>
              </div>

              <div className="p-space-lg pt-0 flex flex-col gap-space-sm">
                <div className="bg-surface-container p-space-xs rounded-DEFAULT font-technical-code text-technical-code text-on-surface font-semibold">
                  {project.specs}
                </div>
                <a
                  href={`https://wa.me/966542703260?text=${encodeURIComponent('استفسار عن مشروع مماثل لـ: ' + project.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-space-xs w-full py-space-xs bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-DEFAULT font-label-md font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>اطلب تنفيذ مشروع مماثل</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="w-full bg-primary-container text-surface py-space-3xl px-gutter-mobile lg:px-gutter-desktop border-t border-outline-variant/20">
        <div className="max-w-[1280px] mx-auto text-center flex flex-col items-center gap-space-md">
          <h2 className="font-headline-lg text-headline-lg font-bold text-surface">
            ترغب في تجهيز موقعك بالدقة والاحترافية ذاتها؟
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl">
            أرسل تفاصيل موقعك أو اللوكيشن وسيتجه المشرف الميداني لمعاينة المشروع فوراً.
          </p>
          <button
            onClick={() => onNavigate('contact-us')}
            className="inline-flex items-center gap-space-xs px-space-2xl py-space-md bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-DEFAULT font-label-lg font-bold shadow-md"
          >
            <span>احجز موعد معاينة ميدانية مجاناً</span>
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        </div>
      </section>

    </div>
  );
}
