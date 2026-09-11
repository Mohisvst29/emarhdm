import React, { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, image, type = 'website', schemaData }) {
  useEffect(() => {
    const siteDomain = 'https://www.eamareldamam.com';
    const siteTitle = 'مؤسسة إعمار وهدم للمقاولات العامة بالدمام والشرقية | 0546735579';

    // Helper to sanitize URLs against XSS / JavaScript protocol injection
    const sanitizeUrl = (urlStr) => {
      if (!urlStr || typeof urlStr !== 'string') return `${siteDomain}/`;
      try {
        const parsed = new URL(urlStr, siteDomain);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          return parsed.href;
        }
      } catch (e) {
        // Fallback for relative paths
        if (urlStr.startsWith('/')) {
          return `${siteDomain}${urlStr}`;
        }
      }
      return `${siteDomain}/`;
    };

    // Helper to sanitize text strings against HTML injection
    const sanitizeText = (textStr) => {
      if (!textStr || typeof textStr !== 'string') return '';
      return textStr.replace(/[<>"']/g, (match) => {
        switch (match) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '"': return '&quot;';
          case "'": return '&#39;';
          default: return match;
        }
      }).trim();
    };

    // Page Title
    const rawTitle = title 
      ? (title.includes('0546735579') ? title : `${title} | مؤسسة إعمار وهدم بالدمام 0546735579`)
      : siteTitle;
    const pageTitle = sanitizeText(rawTitle);

    // Meta Description with phone number
    const defaultDesc = 'مؤسسة إعمار وهدم للمقاولات العامة بالدمام والمنطقة الشرقية: متخصصون في هدم المباني والمنشآت الكلي والجزئي، تكسير السيراميك والجدران، أعمال الأسفلت، ترحيل الأنقاض وشراء سكراب المباني. للتواصل والطلب مباشر: 0546735579';
    let rawDesc = description || defaultDesc;
    if (!rawDesc.includes('0546735579') && !rawDesc.includes('0542703260')) {
      rawDesc = `${rawDesc} | للتواصل والطلب: 0546735579`;
    }
    const metaDesc = sanitizeText(rawDesc);

    const defaultKeywords = 'مؤسسة هدم بالدمام, مقاول هدم الدمام, تكسير سيراميك بالشرقية, اعمال اسفلت الدمام, شراء سكراب الدمام, 0546735579, مؤسسة هدم مرخصة, تكسير جدران الدمام';
    const metaKeywords = sanitizeText(keywords || defaultKeywords);

    const absoluteImage = sanitizeUrl(image || '/images/logo.png');
    const currentUrl = sanitizeUrl(window.location.href);

    // Update document title safely
    document.title = pageTitle;

    // Helper function to update or create meta tags safely
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
    
    // Open Graph Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDesc);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', absoluteImage);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', sanitizeText(type));
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'إعمار وهدم للمقاولات العامة');
    updateMetaTag('meta[property="og:phone_number"]', 'property', 'og:phone_number', '0546735579');

    // Twitter Tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDesc);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // JSON-LD Schema.org structured data (Safely escaped against inline script injection)
    let schemaScript = document.querySelector('script[id="json-ld-schema"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'json-ld-schema');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "name": "مؤسسة إعمار وهدم للمقاولات العامة",
      "image": `${siteDomain}/images/logo.png`,
      "logo": `${siteDomain}/images/logo.png`,
      "telephone": "0546735579",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "الدمام",
        "addressRegion": "المنطقة الشرقية",
        "addressCountry": "SA"
      },
      "url": siteDomain,
      "priceRange": "$$",
      "description": metaDesc
    };

    const rawJson = JSON.stringify(schemaData || defaultSchema);
    // Escape < and > to prevent XSS script breakout inside JSON-LD
    const safeJson = rawJson.replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
    schemaScript.textContent = safeJson;

  }, [title, description, keywords, image, type, schemaData]);

  return null;
}
