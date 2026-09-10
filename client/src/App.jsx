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

  // Sync with browser URL / hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const parts = hash.split('/');
      const path = parts[0] || 'home';
      const param = parts[1] || '';

      setCurrentPath(path);
      if (param) setArticleSlug(param);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path, param = '') => {
    setCurrentPath(path);
    if (param) setArticleSlug(param);
    window.location.hash = param ? `#/${path}/${param}` : `#/${path}`;
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
        if (articleSlug && currentPath === 'articles' && window.location.hash.includes('/articles/')) {
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
        {/* Smooth Page Enter Transition Wrapper */}
        <div key={currentPath} className="animate-page-enter">
          {renderPage()}
        </div>
      </main>

      {!isDashboard && <FloatingContact />}
      <Footer onNavigate={handleNavigate} settings={settings} />
    </div>
  );
}
