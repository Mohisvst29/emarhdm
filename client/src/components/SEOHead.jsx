import React, { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, image, type = 'website', schemaData }) {
  useEffect(() => {
    const siteDomain = 'https://www.eamareldamam.com';
    const siteTitle = 'مؤسسة إعمار وهدم للمقاولات العامة بالدمام والشرقية | 0546735579';
    
    // Page Title
    const pageTitle = title 
      ? (title.includes('0546735579') ? title : `${title} | مؤسسة إعمار وهدم بالدمام 0546735579`)
      : siteTitle;

    // Meta Description with phone number
    const defaultDesc = 'مؤسسة إعمار وهدم للمقاولات العامة بالدمام والمنطقة الشرقية: متخصصون في هدم المباني والمنشآت الكلي والجزئي، تكسير السيراميك والجدران، أعمال الأسفلت، ترحيل الأنقاض وشراء سكراب المباني. للتواصل والطلب مباشر: 0546735579';
    let metaDesc = description || defaultDesc;
    if (!metaDesc.includes('0546735579') && !metaDesc.includes('0542703260')) {
      metaDesc = `${metaDesc} | للتواصل والطلب: 0546735579`;
    }

    const metaKeywords = keywords || 'مؤسسة هدم بالدمام, مقاول هدم الدمام, تكسير سيراميك بالشرقية, اعمال اسفلت الدمام, شراء سكراب الدمام, 0546735579, مؤسسة هدم مرخصة, تكسير جدران الدمام';
    
    const absoluteImage = image 
      ? (image.startsWith('http') ? image : `${siteDomain}${image.startsWith('/') ? '' : '/'}${image}`)
      : `${siteDomain}/images/logo.png`;

    const currentUrl = window.location.href.startsWith('http') ? window.location.href : `${siteDomain}/`;

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
    
    // Open Graph Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDesc);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', absoluteImage);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
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

    schemaScript.textContent = JSON.stringify(schemaData || defaultSchema);

  }, [title, description, keywords, image, type, schemaData]);

  return null;
}
