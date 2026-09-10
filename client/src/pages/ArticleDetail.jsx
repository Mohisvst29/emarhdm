import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function ArticleDetail({ articleSlug, onNavigate }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!articleSlug) return;
    setLoading(true);
    fetch(`/api/articles/${articleSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArticle(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [articleSlug]);

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-space-2xl text-on-surface-variant font-bold text-lg">
        جاري فتح المقال والأرشفة...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-space-2xl gap-space-md text-right">
        <h2 className="font-headline-md font-bold text-on-surface">المقال المطلوب غير موجود</h2>
        <button
          onClick={() => onNavigate('articles')}
          className="px-space-lg py-space-xs bg-primary text-on-primary font-label-md font-bold rounded-DEFAULT"
        >
          العودة لقائمة المقالات
        </button>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": `${window.location.origin}${article.image}`,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "إعمار وهدم للمقاولات العامة",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/images/logo.png`
      }
    },
    "datePublished": article.date ? article.date.replace(/\//g, '-') : '2026-09-10',
    "description": article.excerpt
  };

  return (
    <div className="flex flex-col w-full text-right bg-surface min-h-screen">
      
      <SEOHead
        title={article.title}
        description={article.excerpt}
        keywords={article.keywords}
        image={article.image}
        type="article"
        schemaData={articleSchema}
      />

      {/* Top Banner */}
      <section className="w-full bg-surface-container-low border-b border-outline-variant/30 py-space-2xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-[1020px] mx-auto flex flex-col gap-space-md">
          
          <div className="flex flex-wrap items-center justify-between gap-space-xs border-b border-outline-variant/30 pb-space-xs">
            <button
              onClick={() => onNavigate('articles')}
              className="inline-flex items-center gap-space-2xs text-secondary font-label-md font-bold hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              <span>العودة لكافة المقالات</span>
            </button>

            <div className="flex items-center gap-space-xs text-xs font-label-sm text-on-surface-variant">
              <span>تاريخ النشر: {article.date}</span>
              <span>•</span>
              <span>زمن القراءة: {article.read_time}</span>
              <span>•</span>
              <span>{article.views || 0} مشاهدة</span>
            </div>
          </div>

          <div className="flex items-center gap-space-2xs font-label-sm text-secondary font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>{article.category}</span>
          </div>

          <h1 className="font-headline-hero text-headline-hero font-bold text-on-surface leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between gap-space-md pt-space-xs font-body-sm">
            <div className="flex items-center gap-space-xs text-on-surface">
              <span className="material-symbols-outlined text-secondary">person</span>
              <span className="font-bold">{article.author}</span>
            </div>

            <div className="flex items-center gap-space-xs">
              <button
                onClick={copyArticleLink}
                className="px-space-sm py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-DEFAULT font-label-sm font-bold flex items-center gap-1 transition-colors border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>{copied ? 'تم نسخ الرابط' : 'مشاركة الرابط'}</span>
              </button>

              <a
                href={`https://wa.me/966542703260?text=${encodeURIComponent('قمت بقراءة مقال: ' + article.title + ' وأرغب في استفسار بالموقع')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-space-sm py-1 bg-secondary text-on-secondary rounded-DEFAULT font-label-sm font-bold flex items-center gap-1 hover:bg-on-secondary-container transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>استفسر حول هذا المقال</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <section className="w-full max-w-[1020px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-start">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8 flex flex-col gap-space-xl">
            
            {/* Featured Image */}
            <div className="w-full aspect-[16/9] rounded-DEFAULT overflow-hidden shadow-md border border-outline-variant/40 bg-surface-container-high">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>

            {/* Excerpt Box */}
            <div className="p-space-md bg-surface-container-low border-r-4 border-secondary rounded-DEFAULT font-body-lg text-body-lg text-on-surface font-semibold leading-relaxed">
              {article.excerpt}
            </div>

            {/* Article Content Render */}
            <div 
              className="font-body-md text-body-md text-on-surface leading-loose space-y-4 article-content prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Article Keywords Tags */}
            {article.keywords && (
              <div className="mt-space-lg pt-space-md border-t border-outline-variant/30 flex flex-wrap items-center gap-space-xs">
                <span className="font-label-sm font-bold text-on-surface-variant">الكلمات المفتاحية والسيو:</span>
                {article.keywords.split(/[,|]/).map((kw, idx) => (
                  <span key={idx} className="px-space-xs py-1 bg-surface-container-high text-on-surface rounded-DEFAULT font-label-sm text-xs border border-outline-variant/30">
                    #{kw.trim()}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* Sidebar Action Card */}
          <div className="lg:col-span-4 flex flex-col gap-space-md sticky top-24">
            <div className="bg-surface-container-lowest p-space-lg rounded-DEFAULT shadow-md border border-outline-variant/40 flex flex-col gap-space-md text-right">
              <div className="flex items-center gap-space-xs text-secondary font-technical-code text-technical-code font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                <span>خدمات ميدانية مرتبطة بالخبر</span>
              </div>

              <h3 className="font-headline-sm font-bold text-on-surface">
                عندك موقع يحتاج تنفيذ بالدمام والشرقية؟
              </h3>

              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                يقوم فريقنا الميداني بالمعاينة المجانية فوراً واستخراج التراخيص اللازمة وتزويدك بتسعير واضح وشامل.
              </p>

              <div className="flex flex-col gap-space-xs">
                <a
                  href="https://wa.me/966542703260"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-space-xs bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-DEFAULT font-label-md font-bold text-center flex items-center justify-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>تواصل عبر واتساب (0542703260)</span>
                </a>

                <a
                  href="tel:0546735579"
                  className="w-full py-space-xs bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-DEFAULT font-label-md font-bold text-center flex items-center justify-center gap-1 border border-outline-variant/40"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                  <span dir="ltr">0546735579</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
