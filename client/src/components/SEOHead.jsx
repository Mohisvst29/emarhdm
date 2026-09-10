import React, { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, image, type = 'website', schemaData }) {
  useEffect(() => {
    // Site defaults
    const siteTitle = 'إعمار وهدم للمقاولات العامة - الدمام والشرقية';
    const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDesc = description || 'مؤسسة إعمار وهدم للمقاولات العامة بالدمام والشرقية: متخصصون في هدم المباني والمنشآت، الهدم الجزئي، تكسير السيراميك والجدران، أعمال الأسفلت، وشراء سكراب المباني بأعلى معايير السلامة.';
    const metaKeywords = keywords || 'مقاول هدم بالدمام, هدم مباني الدمام, تكسير سيراميك بالشرقية, اعمال اسفلت الدمام, شراء سكراب الدمام, مؤسسة هدم مرخصة';
    const ogImage = image || '/images/construction.png';

    // Update document title
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('meta[name="description"]', 'name', 'description', metaDesc);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', metaKeywords);
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDesc);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDesc);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // JSON-LD Schema.org structured data
    let schemaScript = document.querySelector('script[id="json-ld-schema"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'json-ld-schema');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "إعمار وهدم للمقاولات العامة",
      "image": `${window.location.origin}/images/logo.png`,
      "telephone": "0546735579",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "الدمام",
        "addressRegion": "المنطقة الشرقية",
        "addressCountry": "SA"
      },
      "url": window.location.origin,
      "priceRange": "$$",
      "description": metaDesc
    };

    schemaScript.textContent = JSON.stringify(schemaData || defaultSchema);

  }, [title, description, keywords, image, type, schemaData]);

  return null;
}
