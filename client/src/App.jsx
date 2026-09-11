import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';

export default function App() {
  const [currentPath, setCurrentPath] = useState('home');
  const [articleSlug, setArticleSlug] = useState('');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token') || '');
  
  const [settings, setSettings] = useState({
    logo: '/images/logo.png',
    logo_size: '44',
    phone: '0546735579',
    whatsapp: '0542703260',
    location: 'الدمام، المنطقة الشرقية، المملكة العربية السعودية'
  });

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && Object.keys(data.data).length > 0) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSettings();
  }, [currentPath]);

  // Sync with browser Clean HTML5 Path & legacy hash
  useEffect(() => {
    const syncRoute = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
      const pathname = window.location.pathname.trim();
      const search = window.location.search;

      let path = 'home';
      let param = '';

      if (hash) {
        const parts = hash.split('/');
        path = parts[0] || 'home';
        param = parts[1] || '';
      } else if (pathname && pathname !== '/') {
        const parts = pathname.replace(/^\//, '').split('/');
        path = parts[0] || 'home';
        param = parts[1] || '';
      }

      // Query param fallback (e.g. ?srv=srv-1)
      if (search.includes('srv=')) {
        const srvId = new URLSearchParams(search).get('srv');
        if (srvId) param = srvId;
      }

      setCurrentPath(path);
      setArticleSlug(param);
    };

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);

    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const handleNavigate = (path, param = '') => {
    setCurrentPath(path);
    setArticleSlug(param);

    let targetUrl = '/';
    if (path && path !== 'home') {
      targetUrl = param ? `/${path}/${param}` : `/${path}`;
    }

    try {
      window.history.pushState(null, '', targetUrl);
    } catch (e) {
      window.location.hash = param ? `#/${path}/${param}` : `#/${path}`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminToken('');
    handleNavigate('home');
  };

  const renderPage = () => {
    switch (currentPath) {
      case 'about-us':
      case 'about':
        return <About onNavigate={handleNavigate} settings={settings} />;
      case 'our-services':
      case 'services':
        return <Services onNavigate={handleNavigate} />;
      case 'our-work':
      case 'projects':
        return <Projects onNavigate={handleNavigate} />;
      case 'articles':
      case 'blog':
        if (articleSlug) {
          return <ArticleDetail articleSlug={articleSlug} onNavigate={handleNavigate} />;
        }
        return <Articles onNavigate={handleNavigate} />;
      case 'article-detail':
        return <ArticleDetail articleSlug={articleSlug} onNavigate={handleNavigate} />;
      case 'contact-us':
      case 'contact':
        return <Contact onNavigate={handleNavigate} />;
      case 'admin-dashboard':
      case 'admin':
        if (!adminToken) {
          return <AdminLogin onLoginSuccess={(token) => setAdminToken(token)} onNavigate={handleNavigate} />;
        }
        return <AdminDashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'home':
      default:
        return <Home onNavigate={handleNavigate} settings={settings} />;
    }
  };

  const isDashboard = currentPath === 'admin-dashboard' || currentPath === 'admin';

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Header currentPath={currentPath} onNavigate={handleNavigate} settings={settings} />
      
      <main className="w-full pt-20 flex-grow">
        <div key={`${currentPath}-${articleSlug}`} className="animate-page-enter">
          {renderPage()}
        </div>
      </main>

      {!isDashboard && <FloatingContact />}
      <Footer onNavigate={handleNavigate} settings={settings} />
    </div>
  );
}
