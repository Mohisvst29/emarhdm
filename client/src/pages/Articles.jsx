import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function Articles({ onNavigate }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArticles(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['الكل', ...new Set(articles.map(a => a.category))];

  const filteredArticles = articles.filter(art => {
    const matchesCat = selectedCategory === 'الكل' || art.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      art.title.includes(searchQuery) || 
      art.excerpt.includes(searchQuery) ||
      (art.keywords && art.keywords.includes(searchQuery));

    return matchesCat && matchesSearch;
  });

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = featuredArticle ? filteredArticles.filter(a => a.id !== featuredArticle.id) : filteredArticles;

  return (
    <div className="flex flex-col w-full text-right bg-surface min-h-screen">
      
      <SEOHead 
        title="المقالات والدليل الفني للهدم والمقاولات بالدمام" 
        description="اقرأ أحدث المقالات الإرشادية والنصائح الهندسيّة لأعمال هدم المباني، التكسير الجزئي، إزالة السيراميك، أعمال الأسفلت، وشراء سكراب المباني بالدمام والشرقية."
        keywords="مقالات هدم المباني, نصائح مقاولات الشرقية, دليل الهدم الجزئي, اسفلت الدمام, سكراب الشرقية"
      />

      {/* Header Banner */}
      <section className="w-full bg-primary-container text-surface px-gutter-mobile lg:px-gutter-desktop py-space-3xl border-b border-outline-variant/30 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-space-md relative z-10">
          <div className="flex items-center gap-space-xs font-technical-code text-technical-code text-secondary-fixed-dim uppercase tracking-wider">
            <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></span>
            <span>الكتالوج الإرشادي والمقالات الميدانية السيو</span>
            <span className="text-outline">/</span>
            <span dir="ltr">SEO KNOWLEDGE HUB</span>
          </div>

          <h1 className="font-headline-hero text-headline-hero text-surface font-bold tracking-tight max-w-4xl">
            مقالات وأدلة فنية في أعمال الهدم والمقاولات بالشرقية
          </h1>
          <p className="font-body-lg text-body-lg text-surface-variant max-w-3xl leading-relaxed">
            نشارككم خبرتنا الميدانية في أساليب الهدم الآمن، التكسير الدقيق، نصائح التراخيص البلدية، وإعادة التدوير والأسفلت لحماية منشأتك وتقديم قيمة حقيقية لمشروعك بالدمام.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-space-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md bg-surface-container-lowest/10 backdrop-blur-md p-space-md rounded-DEFAULT border border-surface/20">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-sm text-surface-variant font-bold">التصنيفات:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-space-md py-1.5 rounded-DEFAULT font-label-sm font-bold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-secondary text-on-secondary shadow-md scale-105'
                      : 'bg-surface/20 text-surface hover:bg-surface/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المقالات والأدلة..."
                className="w-full bg-surface text-on-surface placeholder:text-outline font-body-sm px-space-sm py-space-xs pr-9 rounded-DEFAULT focus:outline-none focus:ring-2 focus:ring-secondary border border-outline-variant/40"
              />
              <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline text-[18px]">search</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Articles Listing Grid */}
      <section className="w-full px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-space-2xl">
          
          {loading ? (
            <div className="p-space-3xl text-center text-on-surface-variant font-bold text-lg">
              جاري تحميل المقالات والأدلة الإرشادية...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-space-2xl text-center text-on-surface-variant font-bold bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/30">
              لا توجد مقالات مطابقة للبحث الحياتي المكتوب.
            </div>
          ) : (
            <>
              {/* Featured Article Card (Top) */}
              {selectedCategory === 'الكل' && searchQuery === '' && featuredArticle && (
                <article 
                  onClick={() => onNavigate('articles', featuredArticle.slug)}
                  className="group bg-surface-container-low rounded-DEFAULT overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-outline-variant/40 grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
                >
                  <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[400px] overflow-hidden">
                    <img 
                      src={featuredArticle.image} 
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-space-md right-space-md bg-secondary text-on-secondary px-space-sm py-1 rounded-DEFAULT font-label-sm font-bold shadow-md">
                      مقال مميز
                    </div>
                  </div>

                  <div className="lg:col-span-6 p-space-xl lg:p-space-2xl flex flex-col justify-between gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center gap-space-sm font-label-sm text-on-surface-variant">
                        <span className="font-bold text-secondary">{featuredArticle.category}</span>
                        <span>•</span>
                        <span>{featuredArticle.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span>{featuredArticle.read_time}</span>
                        </span>
                      </div>

                      <h2 className="font-headline-hero text-headline-md font-bold text-on-surface group-hover:text-secondary transition-colors leading-tight">
                        {featuredArticle.title}
                      </h2>

                      <p className="font-body-lg text-body-md text-on-surface-variant leading-relaxed mt-space-xs">
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-space-md border-t border-outline-variant/30">
                      <div className="flex items-center gap-space-xs font-label-sm font-bold text-on-surface">
                        <span className="material-symbols-outlined text-secondary">person</span>
                        <span>{featuredArticle.author}</span>
                      </div>

                      <span className="inline-flex items-center gap-space-2xs text-secondary font-label-md font-bold group-hover:translate-x-[-4px] transition-transform">
                        <span>قراءة المقال كاملاً</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      </span>
                    </div>
                  </div>
                </article>
              )}

              {/* Grid of Remaining / Filtered Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-xl">
                {(selectedCategory === 'الكل' && searchQuery === '' ? remainingArticles : filteredArticles).map((art) => (
                  <article
                    key={art.id}
                    onClick={() => onNavigate('articles', art.slug)}
                    className="group bg-surface-container-lowest rounded-DEFAULT overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-outline-variant/40 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-surface-container-high">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-space-xs right-space-xs bg-surface/90 backdrop-blur-sm text-on-surface px-space-xs py-1 rounded-DEFAULT font-label-sm font-bold text-xs shadow-sm border border-outline-variant/30">
                        {art.category}
                      </div>
                    </div>

                    <div className="p-space-lg flex flex-col flex-grow justify-between gap-space-md">
                      <div className="flex flex-col gap-space-xs">
                        <div className="flex items-center justify-between font-label-sm text-xs text-on-surface-variant">
                          <span>{art.date}</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>{art.views || 0} مشاهدة</span>
                          </span>
                        </div>

                        <h3 className="font-headline-sm font-bold text-on-surface group-hover:text-secondary transition-colors leading-tight">
                          {art.title}
                        </h3>

                        <p className="font-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
                          {art.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/30">
                        <span className="font-label-sm text-xs font-semibold text-on-surface-variant">{art.read_time}</span>
                        <span className="inline-flex items-center gap-space-2xs text-secondary font-label-sm font-bold group-hover:translate-x-[-2px] transition-transform">
                          <span>اقرأ المزيد</span>
                          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

        </div>
      </section>

      {/* CTA Newsletter / Contact Strip */}
      <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/30 px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-[1280px] mx-auto p-space-2xl bg-primary-container text-surface rounded-DEFAULT shadow-xl flex flex-col md:flex-row items-center justify-between gap-space-xl text-right">
          <div className="flex flex-col items-start max-w-2xl">
            <span className="font-technical-code text-technical-code text-secondary-fixed-dim font-bold mb-space-xs">استشارة فنية مجانية بالموقع</span>
            <h2 className="font-headline-md text-headline-md font-bold text-surface mb-space-xs">
              تحتاج تقييم هندسي دقيق لموقعك في الدمام؟
            </h2>
            <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
              تواصل مع مهندسي الميدان مباشرة لمعاينة الموقع مجاناً وحساب الأنقاض والتكاليف بدقة وشفافية.
            </p>
          </div>

          <button
            onClick={() => onNavigate('contact-us')}
            className="px-space-xl py-space-sm bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-lg font-bold rounded-DEFAULT shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            حجز موعد معاينة ميدانية
          </button>
        </div>
      </section>

    </div>
  );
}
