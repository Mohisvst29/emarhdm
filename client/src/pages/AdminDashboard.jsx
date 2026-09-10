import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('requests');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [settings, setSettings] = useState({
    phone: '0546735579',
    whatsapp: '0542703260',
    location: 'الدمام، المنطقة الشرقية، المملكة العربية السعودية',
    work_hours: 'السبت - الخميس: من 7:00 صباحاً حتى 6:00 مساءً',
    emergency_text: 'خدمة طوارئ الهدم والسلامة الإنشائية متاحة 24/7',
    logo: '/images/logo.png',
    logo_size: '44',
    social_twitter: 'https://twitter.com',
    social_instagram: 'https://instagram.com',
    social_tiktok: 'https://tiktok.com',
    social_linkedin: 'https://linkedin.com'
  });

  const [stats, setStats] = useState({ total: 0, pending: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  // Modals & Active Edit States
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);

  // Security Credentials Form State
  const [credForm, setCredForm] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  // Forms
  const [newReq, setNewReq] = useState({
    name: '',
    phone: '',
    service: 'هدم كلي للمباني والمنشآت',
    location: '',
    details: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Device File Upload Handler
  const handleFileUpload = (e, onComplete) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = event.target.result;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, data: base64Data })
        });
        const result = await res.json();
        if (result.success) {
          onComplete(result.url);
          showToast('تم رفع الصورة من جهازك وحفظها بنجاح!');
        } else {
          showToast(result.message || 'حدث خطأ أثناء رفع الصورة');
        }
      } catch (err) {
        console.error(err);
        showToast('فشل الاتصال بالخادم لرفع الصورة');
      }
    };
    reader.readAsDataURL(file);
  };

  // Fetch all dashboard data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [reqRes, statsRes, srvRes, prjRes, setRes, artRes] = await Promise.all([
        fetch('/api/requests'),
        fetch('/api/stats'),
        fetch('/api/services'),
        fetch('/api/projects'),
        fetch('/api/settings'),
        fetch('/api/articles')
      ]);

      const reqData = await reqRes.json();
      const statsData = await statsRes.json();
      const srvData = await srvRes.json();
      const prjData = await prjRes.json();
      const setData = await setRes.json();
      const artData = await artRes.json();

      if (reqData.success) setRequests(reqData.data);
      if (statsData.success) setStats(statsData.data);
      if (srvData.success) setServices(srvData.data);
      if (prjData.success) setProjects(prjData.data);
      if (setData.success && Object.keys(setData.data).length > 0) setSettings(setData.data);
      if (artData.success) setArticles(artData.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Request Handlers
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (result.success) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        showToast(`تم تحديث حالة الطلب ${id} إلى: ${newStatus}`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm(`هل أنت تأكد من إغلاق/حذف الطلب ${id}؟`)) return;
    try {
      const res = await fetch(`/api/requests/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
        setSelectedRequest(null);
        showToast(`تم حذف الطلب ${id} بنجاح.`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
      const result = await res.json();
      if (result.success) {
        setShowAddReqModal(false);
        setNewReq({ name: '', phone: '', service: 'هدم كلي للمباني والمنشآت', location: '', details: '' });
        showToast(`تم إضافة الطلب الميداني جديد ${result.data.id}`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const result = await res.json();
      if (result.success) {
        showToast('تم حفظ أرقام التواصل وإعدادات الموقع بنجاح!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Service Save
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingService.id);
      const url = isEdit ? `/api/services/${editingService.id}` : '/api/services';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      const result = await res.json();
      if (result.success) {
        setEditingService(null);
        showToast(isEdit ? 'تم تحديث بيانات الخدمة بنجاح' : 'تم إضافة خدمة جديدة بالكتالوج');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('هل أنت تأكد من حذف هذه الخدمة من الكتالوج؟')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showToast('تم حذف الخدمة.');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetServicesDefaults = async () => {
    if (!window.confirm('هل أنت تأكد من سحب وإعادة مزامنة جميع خدمات الموقع الأساسية؟')) return;
    try {
      const res = await fetch('/api/services/reset-defaults', { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        showToast(result.message);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Project Save
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingProject.id);
      const url = isEdit ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject)
      });
      const result = await res.json();
      if (result.success) {
        setEditingProject(null);
        showToast(isEdit ? 'تم تحديث مشروع المعرض بنجاح' : 'تم إضافة مشروع جديد إلى المعرض');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('هل أنت تأكد من حذف هذا المشروع من المعرض؟')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showToast('تم حذف المشروع.');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Article Save
  const handleSaveArticle = async (e) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingArticle.id);
      const url = isEdit ? `/api/articles/${editingArticle.id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle)
      });
      const result = await res.json();
      if (result.success) {
        setEditingArticle(null);
        showToast(isEdit ? 'تم تحديث مقال السيو بنجاح' : 'تم نشر المقال الجديد بنجاح في الموقع والسايت ماب!');
        fetchAllData();
      } else {
        showToast(result.message || 'حدث خطأ أثناء حفظ المقال');
      }
    } catch (err) {
      console.error(err);
      showToast('فشل الاتصال بالخادم لحفظ المقال');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('هل أنت تأكد من حذف هذا المقال؟ سيتأثر أرشفة السايت ماب.')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        showToast('تم حذف المقال بنجاح وتحديث خريطة الموقع تلقائياً.');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Admin Credentials
  const handleChangeCredentials = async (e) => {
    e.preventDefault();
    if (credForm.newPassword && credForm.newPassword !== credForm.confirmPassword) {
      showToast('كلمة المرور الجديدة وغير المتطابقة!');
      return;
    }
    try {
      const res = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: credForm.currentPassword,
          newUsername: credForm.newUsername || undefined,
          newPassword: credForm.newPassword || undefined
        })
      });
      const result = await res.json();
      if (result.success) {
        showToast(result.message);
        setCredForm({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(result.message || 'فشل تغيير البيانات');
      }
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء التواصل مع الخادم');
    }
  };

  // Hero Background Images Helpers
  const handleAddHeroImage = (newUrl) => {
    if (!newUrl) return;
    const currentBgs = settings.hero_images ? settings.hero_images.split(',').filter(Boolean) : [];
    if (!currentBgs.includes(newUrl)) {
      const updatedBgs = [...currentBgs, newUrl].join(',');
      setSettings(prev => ({ ...prev, hero_images: updatedBgs }));
      showToast('تم إضافة صورة جديدة لخلفية الصفحة الرئيسية!');
    }
  };

  const handleRemoveHeroImage = (idxToRemove) => {
    const currentBgs = settings.hero_images ? settings.hero_images.split(',').filter(Boolean) : [];
    const updated = currentBgs.filter((_, i) => i !== idxToRemove).join(',');
    setSettings(prev => ({ ...prev, hero_images: updated }));
    showToast('تم إزالة الصورة من خلفية الصفحة الرئيسية');
  };

  // Export CSV
  const handleExportCSV = () => {
    window.open('/api/export', '_blank');
    showToast('جاري تصدير سجل الطلبات بصيغة Excel/CSV...');
  };

  // Filter & Search Logic
  const filteredRequests = requests.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      r.name.includes(searchQuery) || 
      r.location.includes(searchQuery) || 
      r.id.includes(searchQuery) ||
      r.phone.includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-surface text-right">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-surface-container border-l border-outline-variant/30 p-space-md flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center gap-space-sm pb-space-sm border-b border-outline-variant/30">
            <img src="/images/logo.png" alt="Logo" className="w-9 h-9 rounded-full object-contain bg-surface p-0.5" />
            <div className="flex flex-col">
              <span className="font-label-md font-bold text-on-surface">إدارة العمليات</span>
              <span className="font-label-sm text-secondary font-bold">لوحة التحكم الميدانية</span>
            </div>
          </div>

          <nav className="flex flex-col gap-space-xs">
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full text-right px-space-md py-space-sm rounded-DEFAULT font-label-md font-bold transition-all flex items-center justify-between ${
                activeTab === 'requests'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>طلبات المعاينة والتسعير</span>
              </div>
              <span className="px-1.5 py-0.5 text-[11px] bg-secondary text-on-secondary rounded-full font-bold">
                {requests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full text-right px-space-md py-space-sm rounded-DEFAULT font-label-md font-bold transition-all flex items-center gap-space-xs ${
                activeTab === 'services'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">construction</span>
              <span>إدارة قائمة الخدمات</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full text-right px-space-md py-space-sm rounded-DEFAULT font-label-md font-bold transition-all flex items-center gap-space-xs ${
                activeTab === 'contact'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">contact_phone</span>
              <span>أرقام التواصل وساعات العمل</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full text-right px-space-md py-space-sm rounded-DEFAULT font-label-md font-bold transition-all flex items-center gap-space-xs ${
                activeTab === 'gallery'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">photo_library</span>
              <span>معرض صور المشاريع</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full text-right px-space-md py-space-sm rounded-DEFAULT font-label-md font-bold transition-all flex items-center justify-between ${
                activeTab === 'articles'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px]">article</span>
                <span>إدارة مقالات السيو (Blog)</span>
              </div>
              <span className="px-1.5 py-0.5 text-[11px] bg-secondary text-on-secondary rounded-full font-bold">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hero_images')}
              className={`w-full text-right px-space-md py-space-sm rounded-DEFAULT font-label-md font-bold transition-all flex items-center gap-space-xs ${
                activeTab === 'hero_images'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">wallpaper</span>
              <span>خلفيات الصفحة الرئيسية (Hero)</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-right px-space-md py-space-sm rounded-DEFAULT font-label-md font-bold transition-all flex items-center gap-space-xs ${
                activeTab === 'security'
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">lock_person</span>
              <span>تغيير اسم المستخدم والباسورد</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full text-right px-space-md py-space-sm rounded-DEFAULT font-label-md font-bold text-error hover:bg-error/10 transition-all flex items-center gap-space-xs mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>تسجيل الخروج</span>
            </button>
          </nav>
        </div>

        {/* Emergency Contacts Box */}
        <div className="mt-space-2xl p-space-sm bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/30 flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm text-on-surface font-bold">طوارئ الدمام الحالية</span>
          <span className="font-technical-code text-technical-code text-secondary font-bold" dir="ltr">{settings.phone}</span>
          <span className="font-technical-code text-technical-code text-on-surface-variant font-bold" dir="ltr">{settings.whatsapp}</span>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col w-full bg-surface">
        
        {/* Top Status Header */}
        <section className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg bg-surface-container-low border-b border-outline-variant/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            
            <div className="flex flex-col gap-space-2xs">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  الموقع الميداني: متصل ونشط | الدمام والمنطقة الشرقية
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                لوحة إدارة العمليات والإعدادات المباشرة
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                التحكم الكامل في طلبات العملاء، كتالوج الخدمات، أرقام التواصل المعروضة، ومعرض الصور
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-xs">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-highest text-on-surface hover:bg-surface-dim transition-colors rounded-DEFAULT font-label-md font-semibold border border-outline-variant/40 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>تصدير السجل (Excel / CSV)</span>
              </button>

              <button
                onClick={() => setShowAddReqModal(true)}
                className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-primary text-on-primary hover:bg-primary-container transition-colors rounded-DEFAULT font-label-md font-bold shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>تسجيل طلب جديد</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-secondary text-on-secondary hover:bg-on-secondary-container transition-colors rounded-DEFAULT font-label-md font-bold shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                <span>معاينة الموقع العام</span>
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-error/10 text-error hover:bg-error/20 transition-colors rounded-DEFAULT font-label-md font-bold shadow-sm border border-error/30"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>تسجيل الخروج</span>
              </button>
            </div>

          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-space-sm bg-primary-container text-on-primary rounded-DEFAULT flex items-center justify-between border border-outline-variant/30 animate-fadeIn">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary">verified</span>
                <span className="font-label-md font-medium">{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage('')} className="text-on-primary hover:text-secondary-fixed">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}

          {/* Operational Counter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">إجمالي الطلبات</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">inbox</span>
              </div>
              <div className="mt-space-md flex items-baseline justify-between">
                <span className="font-headline-hero text-headline-hero font-bold text-on-surface leading-none">{stats.total}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">طلب وارد</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">بانتظار المعاينة</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">pending_actions</span>
              </div>
              <div className="mt-space-md flex items-baseline justify-between">
                <span className="font-headline-hero text-headline-hero font-bold text-secondary leading-none">{stats.pending}</span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">تحتاج إجراء عاجل</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">جاري التنفيذ</span>
                <span className="material-symbols-outlined text-on-surface text-[20px]">engineering</span>
              </div>
              <div className="mt-space-md flex items-baseline justify-between">
                <span className="font-headline-hero text-headline-hero font-bold text-on-surface leading-none">{stats.active}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">مواقع نشطة</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT flex flex-col justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">مشاريع مسلمة</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">task_alt</span>
              </div>
              <div className="mt-space-md flex items-baseline justify-between">
                <span className="font-headline-hero text-headline-hero font-bold text-on-surface leading-none">{stats.completed}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">إخلاء طرف وترحيل</span>
              </div>
            </div>
          </div>
        </section>

        {/* TAB 1: Requests Content */}
        {activeTab === 'requests' && (
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg animate-fade-in">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-sm border border-outline-variant/30">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">فلترة حسب الحالة:</span>
                {['all', 'جديد', 'تم التواصل', 'قيد المعاينة', 'قيد التنفيذ', 'مكتمل', 'ملغي'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-space-sm py-space-2xs rounded-DEFAULT font-label-sm font-bold transition-all ${
                      statusFilter === st
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
                    }`}
                  >
                    {st === 'all' ? 'الكل' : st}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث باسم العميل أو الحي..."
                  className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm px-space-sm py-space-xs pr-9 rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/40"
                />
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline text-[18px]">search</span>
              </div>
            </div>

            <div className="w-full overflow-x-auto bg-surface-container-lowest rounded-DEFAULT shadow-sm border border-outline-variant/30">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-surface-container-high text-on-surface font-label-md border-b border-outline-variant/40">
                    <th className="p-space-sm font-bold">كود الطلب</th>
                    <th className="p-space-sm font-bold">اسم العميل</th>
                    <th className="p-space-sm font-bold">رقم الجوال</th>
                    <th className="p-space-sm font-bold">نوع الخدمة الميدانية</th>
                    <th className="p-space-sm font-bold">الموقع / الحي</th>
                    <th className="p-space-sm font-bold">التاريخ</th>
                    <th className="p-space-sm font-bold">حالة الطلب</th>
                    <th className="p-space-sm font-bold text-center">الإجراءات</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-surface-container font-body-sm text-on-surface">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="p-space-xl text-center text-on-surface-variant font-bold">جاري التحميل...</td>
                    </tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-space-xl text-center text-on-surface-variant font-bold">لا توجد طلبات مطابقة.</td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-space-sm font-technical-code font-bold text-secondary">{req.id}</td>
                        <td className="p-space-sm font-semibold">{req.name}</td>
                        <td className="p-space-sm font-technical-code text-on-surface-variant" dir="ltr">{req.phone}</td>
                        <td className="p-space-sm">
                          <span className="px-space-xs py-space-2xs bg-surface-container-high text-on-surface rounded-DEFAULT font-label-sm font-semibold border border-outline-variant/30">
                            {req.service}
                          </span>
                        </td>
                        <td className="p-space-sm">{req.location}</td>
                        <td className="p-space-sm font-technical-code text-on-surface-variant">{req.date}</td>
                        <td className="p-space-sm">
                          <select
                            value={req.status}
                            onChange={(e) => handleStatusChange(req.id, e.target.value)}
                            className="font-label-sm font-bold px-space-xs py-1 rounded-DEFAULT focus:outline-none cursor-pointer border border-outline-variant/40 bg-surface-container-high text-on-surface"
                          >
                            <option value="جديد">جديد</option>
                            <option value="تم التواصل">تم التواصل</option>
                            <option value="قيد المعاينة">قيد المعاينة</option>
                            <option value="قيد التنفيذ">قيد التنفيذ</option>
                            <option value="مكتمل">مكتمل</option>
                            <option value="ملغي">ملغي</option>
                          </select>
                        </td>
                        <td className="p-space-sm">
                          <div className="flex items-center justify-center gap-space-xs">
                            <a href={`tel:${req.phone}`} className="p-1.5 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface rounded-DEFAULT transition-colors">
                              <span className="material-symbols-outlined text-[18px]">call</span>
                            </a>
                            <a href={`https://wa.me/966${req.phone.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-on-surface rounded-DEFAULT transition-colors">
                              <span className="material-symbols-outlined text-[18px]">chat</span>
                            </a>
                            <button onClick={() => setSelectedRequest(req)} className="p-1.5 bg-surface-container-high hover:bg-surface-dim text-on-surface rounded-DEFAULT transition-colors">
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                            <button onClick={() => handleDeleteRequest(req.id)} className="p-1.5 bg-surface-container-high hover:bg-error hover:text-on-error text-on-surface rounded-DEFAULT transition-colors">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Services Management */}
        {activeTab === 'services' && (
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-sm border border-outline-variant/40">
              <div>
                <h2 className="font-headline-md font-bold text-on-surface">إدارة كتالوج خدمات المقاولات والهدم ({services.length})</h2>
                <p className="font-body-md text-on-surface-variant">التحكم الكامل في كافة الخدمات المعروضة بالموقع والمواصفات الفنية وصور التنفيذ.</p>
              </div>
              <div className="flex flex-wrap items-center gap-space-xs">
                <button
                  onClick={handleResetServicesDefaults}
                  className="px-space-md py-space-xs bg-surface-container-high text-on-surface hover:bg-secondary hover:text-on-secondary font-label-md font-bold rounded-DEFAULT shadow-sm flex items-center gap-space-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">sync</span>
                  <span>سحب / استيراد خدمات الموقع الأصلية</span>
                </button>
                <button
                  onClick={() => setEditingService({
                    code: `SRV-0${services.length + 1}`,
                    tag: 'خدمة ميدانية جديدة',
                    icon: 'construction',
                    title: '',
                    category: 'خدمات مقاولات',
                    description: '',
                    image: '/images/construction.png',
                    specs: 'مواصفة تنفيذية أولى|مواصفة تنفيذية ثانية',
                    wa_text: 'طلب%20معاينة%20خدمة%20جديدة'
                  })}
                  className="px-space-md py-space-xs bg-primary text-on-primary hover:bg-primary-container font-label-md font-bold rounded-DEFAULT shadow-sm flex items-center gap-space-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>إضافة خدمة جديدة</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {services.map((srv) => {
                const specsList = srv.specs ? srv.specs.split(/[,|]/) : [];
                return (
                  <div key={srv.id} className="bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/40 shadow-sm overflow-hidden flex flex-col justify-between text-right hover:shadow-md transition-shadow">
                    
                    {/* Header Image Thumbnail & Code */}
                    <div className="relative h-40 w-full overflow-hidden bg-surface-container-high">
                      <img src={srv.image || '/images/construction.png'} alt={srv.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-primary-container text-on-primary px-2 py-0.5 rounded-DEFAULT font-technical-code font-bold text-xs shadow-md">
                        {srv.code}
                      </div>
                      {srv.icon && (
                        <div className="absolute bottom-2 left-2 bg-surface/90 text-primary p-1.5 rounded-full shadow-sm backdrop-blur-sm">
                          <span className="material-symbols-outlined text-[18px]">{srv.icon}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                      <div className="flex flex-col gap-space-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm font-bold text-secondary">{srv.tag || srv.category}</span>
                          <span className="font-technical-code text-xs text-on-surface-variant font-bold">{srv.category}</span>
                        </div>
                        <h3 className="font-headline-sm font-bold text-on-surface leading-tight">{srv.title}</h3>
                        <p className="font-body-sm text-on-surface-variant leading-relaxed line-clamp-3">{srv.description}</p>
                        
                        {specsList.length > 0 && (
                          <div className="mt-space-xs pt-space-xs border-t border-outline-variant/30">
                            <span className="font-label-sm font-bold text-on-surface block mb-1">المواصفات:</span>
                            <ul className="flex flex-col gap-1">
                              {specsList.slice(0, 3).map((sp, idx) => (
                                <li key={idx} className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                  <span className="truncate">{sp.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/30 mt-space-xs">
                        <span className="font-technical-code text-[11px] text-on-surface-variant truncate max-w-[140px]">
                          WA: {srv.wa_text || 'طلب%20معاينة'}
                        </span>
                        <div className="flex items-center gap-space-xs">
                          <button
                            onClick={() => setEditingService(srv)}
                            className="px-space-sm py-1 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface rounded-DEFAULT font-label-sm font-bold transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv.id)}
                            className="px-space-sm py-1 bg-surface-container-high hover:bg-error hover:text-on-error text-on-surface rounded-DEFAULT font-label-sm font-bold transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Contact & Website Settings Manager */}
        {activeTab === 'contact' && (
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg animate-fade-in">
            <div>
              <h2 className="font-headline-md font-bold text-on-surface">إعدادات الموقع، الشعار، وأرقام التواصل</h2>
              <p className="font-body-md text-on-surface-variant">التحكم بالشعار وحجمه والعنوان الميداني وأرقام الاتصال وروابط التواصل الاجتماعي.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-surface-container-lowest p-space-xl rounded-DEFAULT border border-outline-variant/40 shadow-sm flex flex-col gap-space-lg max-w-3xl text-right">
              
              {/* SECTION: LOGO CONTROL & SIZE SLIDER */}
              <div className="p-space-md bg-surface-container-low rounded-DEFAULT border border-outline-variant/30 flex flex-col gap-space-md">
                <span className="font-label-lg font-bold text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary">image</span>
                  <span>الشعار الرسمي للموقع وحجم العرض</span>
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-space-md">
                  <div 
                    className="rounded-full bg-surface p-1 shadow-sm border border-outline-variant/50 flex items-center justify-center shrink-0"
                    style={{ width: `${settings.logo_size || '44'}px`, height: `${settings.logo_size || '44'}px` }}
                  >
                    <img src={settings.logo || '/images/logo.png'} alt="معاينة الشعار" className="w-full h-full object-contain rounded-full" />
                  </div>

                  <div className="flex flex-col gap-space-2xs w-full">
                    <label className="font-label-sm font-bold text-on-surface">رفع شعار جديد من جهازك</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, logo: url }))}
                      className="bg-surface border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-xs cursor-pointer"
                    />
                    <span className="text-[11px] text-on-surface-variant font-medium">أو المسار:</span>
                    <input
                      type="text"
                      value={settings.logo || ''}
                      onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                      className="bg-surface border border-outline-variant/60 p-1.5 rounded-DEFAULT font-technical-code text-xs"
                      placeholder="/images/logo.png"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 border-t border-outline-variant/20 pt-space-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-label-sm font-bold text-on-surface">التحكم في حجم الشعار (بالأبكسل)</label>
                    <span className="font-technical-code font-bold text-secondary text-sm">{settings.logo_size || '44'}px</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="120"
                    step="2"
                    value={settings.logo_size || '44'}
                    onChange={(e) => setSettings({ ...settings, logo_size: e.target.value })}
                    className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant font-technical-code">
                    <span>صغير (24px)</span>
                    <span>متوسط (44px)</span>
                    <span>كبير (120px)</span>
                  </div>
                </div>
              </div>

              {/* SECTION: ABOUT SECTION IMAGE CONTROL */}
              <div className="p-space-md bg-surface-container-low rounded-DEFAULT border border-outline-variant/30 flex flex-col gap-space-md">
                <span className="font-label-lg font-bold text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary">engineering</span>
                  <span>صورة قسم (عن المؤسسة والإشراف الهندسي الميداني)</span>
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-space-md">
                  <div className="w-28 h-20 rounded-DEFAULT bg-surface overflow-hidden shadow-sm border border-outline-variant/50 shrink-0">
                    <img src={settings.about_image || '/images/renovation.png'} alt="معاينة صورة قسم عن المؤسسة" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex flex-col gap-space-2xs w-full">
                    <label className="font-label-sm font-bold text-on-surface">رفع صورة جديدة من جهازك لقسم عن المؤسسة</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, (url) => setSettings({ ...settings, about_image: url }))}
                      className="bg-surface border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-xs cursor-pointer"
                    />
                    <span className="text-[11px] text-on-surface-variant font-medium">أو المسار / الرابط المباشر:</span>
                    <input
                      type="text"
                      value={settings.about_image || ''}
                      onChange={(e) => setSettings({ ...settings, about_image: e.target.value })}
                      className="bg-surface border border-outline-variant/60 p-1.5 rounded-DEFAULT font-technical-code text-xs"
                      placeholder="/images/renovation.png"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: LOCATION & CONTACT NUMBERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-on-surface">رقم الهاتف المباشر (للاتصال)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT font-body-sm font-bold text-right"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-on-surface">رقم الواتساب الميداني (لالمعاينة)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={settings.whatsapp || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT font-body-sm font-bold text-right"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md font-bold text-on-surface">العنوان والمقر الميداني والمعروض بالموقع</label>
                <input
                  type="text"
                  value={settings.location || ''}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT font-body-sm font-bold"
                  placeholder="الدمام، المنطقة الشرقية، المملكة العربية السعودية"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-on-surface">ساعات العمل الرسمية</label>
                  <input
                    type="text"
                    value={settings.work_hours || ''}
                    onChange={(e) => setSettings({ ...settings, work_hours: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT font-body-sm font-bold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-md font-bold text-on-surface">نص خط الطوارئ 24/7</label>
                  <input
                    type="text"
                    value={settings.emergency_text || ''}
                    onChange={(e) => setSettings({ ...settings, emergency_text: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT font-body-sm font-bold"
                  />
                </div>
              </div>

              {/* SECTION: SOCIAL LINKS */}
              <div className="p-space-md bg-surface-container-low rounded-DEFAULT border border-outline-variant/30 flex flex-col gap-space-sm">
                <span className="font-label-md font-bold text-on-surface">روابط التواصل الاجتماعي</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="رابط تويتر / X"
                    value={settings.social_twitter || ''}
                    onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                    className="bg-surface border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-xs"
                  />
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="رابط انستغرام"
                    value={settings.social_instagram || ''}
                    onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                    className="bg-surface border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-xs"
                  />
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="رابط تيك توك"
                    value={settings.social_tiktok || ''}
                    onChange={(e) => setSettings({ ...settings, social_tiktok: e.target.value })}
                    className="bg-surface border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-xs"
                  />
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="رابط لينكد إن"
                    value={settings.social_linkedin || ''}
                    onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                    className="bg-surface border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-space-xl py-space-sm bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-lg font-bold rounded-DEFAULT shadow-md self-start transition-colors"
              >
                حفظ الإعدادات والشعار
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Projects Gallery Manager */}
        {activeTab === 'gallery' && (
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md font-bold text-on-surface">إدارة معرض صور المشاريع الميدانية</h2>
                <p className="font-body-md text-on-surface-variant">إضافة وتعديل صور ومواصفات المشاريع الواقعية في الشرقية.</p>
              </div>
              <button
                onClick={() => setEditingProject({ title: '', category: 'هدم كلي', location: 'الدمام', description: '', image: '/images/construction.png', specs: '', featured: 0 })}
                className="px-space-md py-space-xs bg-primary text-on-primary font-label-md font-bold rounded-DEFAULT shadow-sm flex items-center gap-space-xs"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>إضافة مشروع للمعرض</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {projects.map((prj) => (
                <div key={prj.id} className="bg-surface-container-lowest p-space-md rounded-DEFAULT border border-outline-variant/40 shadow-sm flex flex-col justify-between text-right">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-label-sm font-bold text-secondary">{prj.category}</span>
                      <span className="font-technical-code font-bold text-on-surface-variant">{prj.location}</span>
                    </div>
                    <h3 className="font-headline-sm font-bold text-on-surface mb-2">{prj.title}</h3>
                    <p className="font-body-sm text-on-surface-variant leading-relaxed mb-4">{prj.description}</p>
                  </div>
                  <div className="flex justify-end gap-space-xs pt-space-xs border-t border-outline-variant/30">
                    <button
                      onClick={() => setEditingProject(prj)}
                      className="px-space-sm py-1 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface rounded-DEFAULT font-label-sm font-bold transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteProject(prj.id)}
                      className="px-space-sm py-1 bg-surface-container-high hover:bg-error hover:text-on-error text-on-surface rounded-DEFAULT font-label-sm font-bold transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Articles (SEO Blog) */}
        {activeTab === 'articles' && (
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-sm border border-outline-variant/30">
              <div>
                <h2 className="font-headline-sm font-bold text-on-surface">مقالات المدونة وأرشفة محركات البحث (SEO Articles)</h2>
                <p className="font-body-sm text-on-surface-variant">جميع المقالات المضافة هنا تظهر مباشرة للعميل وتتحدث تلقائياً في sitemap.xml و Schema.org للأرشفة التلقائية.</p>
              </div>
              <button
                onClick={() => setEditingArticle({
                  title: '',
                  slug: '',
                  category: 'هدم مباني',
                  excerpt: '',
                  content: '',
                  keywords: 'هدم مباني الدمام, مقاول هدم, تكسير مباني',
                  image: '/images/hero-demolition.png',
                  author: 'م. أحمد الشمري',
                  read_time: '5 دقائق'
                })}
                className="px-space-md py-space-xs bg-primary text-on-primary hover:bg-primary-container transition-colors rounded-DEFAULT font-label-md font-bold flex items-center gap-space-xs shadow-sm shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>إضافة مقال سيو جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {articles.map((art) => (
                <div key={art.id} className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-space-xs py-0.5 bg-primary/10 text-primary font-label-sm font-bold rounded-DEFAULT text-xs">{art.category}</span>
                      <span className="font-technical-code text-xs text-on-surface-variant">{art.created_at}</span>
                    </div>
                    <h3 className="font-headline-xs font-bold text-on-surface line-clamp-1">{art.title}</h3>
                    <p className="font-body-xs text-on-surface-variant line-clamp-2">{art.excerpt}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="font-technical-code text-[11px] text-secondary bg-surface-container-high px-2 py-0.5 rounded-DEFAULT">Slug: /{art.slug}</span>
                      <span className="font-technical-code text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-DEFAULT">مشاهدات: {art.views || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/30">
                    <a href={`/#/articles/${art.slug}`} target="_blank" rel="noopener noreferrer" className="font-label-sm font-bold text-primary flex items-center gap-1">
                      <span>معاينة المقال</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                    <div className="flex items-center gap-space-xs">
                      <button
                        onClick={() => setEditingArticle(art)}
                        className="px-space-sm py-1 bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface rounded-DEFAULT font-label-sm font-bold transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="px-space-sm py-1 bg-surface-container-high hover:bg-error hover:text-on-error text-on-surface rounded-DEFAULT font-label-sm font-bold transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Hero Background Images Manager */}
        {activeTab === 'hero_images' && (
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg animate-fade-in text-right">
            <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-sm border border-outline-variant/30 flex flex-col gap-space-xs">
              <h2 className="font-headline-sm font-bold text-on-surface">إدارة خلفيات الصفحة الرئيسية (Hero Slider Images)</h2>
              <p className="font-body-sm text-on-surface-variant">يمكنك رفع عدة صور لربطها بسلايدر الهيدر الرئيسي التفاعلي بالصفحة الرئيسية للموقع.</p>
            </div>

            {/* Add New Hero Image Card */}
            <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
              <h3 className="font-label-lg font-bold text-on-surface">إضافة صورة خلفية جديدة للهيدر</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm items-center">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold">رفع صورة من جهازك</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => handleAddHeroImage(url))}
                    className="bg-surface border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-xs cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold">أو إدخال مسار / رابط الصورة</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newHeroUrlInput"
                      placeholder="/images/construction.png"
                      className="flex-1 bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-technical-code text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newHeroUrlInput');
                        if (input && input.value) {
                          handleAddHeroImage(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-space-md py-2 bg-primary text-on-primary font-label-sm font-bold rounded-DEFAULT"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Active Hero Images Grid */}
            <div className="flex flex-col gap-space-sm">
              <h3 className="font-label-lg font-bold text-on-surface">الصور المفعلة حالياً بسلايدر الهيدر ({settings.hero_images ? settings.hero_images.split(',').filter(Boolean).length : 0})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
                {(settings.hero_images ? settings.hero_images.split(',').filter(Boolean) : []).map((imgUrl, idx) => (
                  <div key={idx} className="bg-surface-container-lowest p-space-xs rounded-DEFAULT border border-outline-variant/40 shadow-sm flex flex-col gap-2 relative group">
                    <div className="w-full h-36 rounded-DEFAULT overflow-hidden bg-surface-container-high relative">
                      <img src={imgUrl} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-primary/80 text-on-primary text-[11px] font-bold rounded-full">
                        صورة {idx + 1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1">
                      <span className="font-technical-code text-[11px] text-on-surface-variant truncate max-w-[140px]">{imgUrl}</span>
                      <button
                        onClick={() => handleRemoveHeroImage(idx)}
                        className="p-1 text-error hover:bg-error/10 rounded-full transition-colors"
                        title="إزالة من السلايدر"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="px-space-xl py-space-sm bg-secondary text-on-secondary font-label-lg font-bold rounded-DEFAULT shadow-md self-start transition-colors"
            >
              حفظ قائمة خلفيات الهيدر في قاعدة البيانات
            </button>
          </div>
        )}

        {/* TAB 7: Security & Credentials Settings */}
        {activeTab === 'security' && (
          <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg animate-fade-in text-right max-w-2xl">
            <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT shadow-sm border border-outline-variant/30 flex flex-col gap-space-xs">
              <h2 className="font-headline-sm font-bold text-on-surface">إعدادات حساب الأدمن والأمان</h2>
              <p className="font-body-sm text-on-surface-variant">تغيير اسم المستخدم وكلمة المرور الخاصة بلوحة تحكم الأدمن في MongoDB Atlas.</p>
            </div>

            <form onSubmit={handleChangeCredentials} className="bg-surface-container-lowest p-space-xl rounded-DEFAULT shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md font-bold text-on-surface">كلمة المرور الحالية (مطلوبة للتحقق)</label>
                <input
                  type="password"
                  required
                  value={credForm.currentPassword}
                  onChange={(e) => setCredForm({ ...credForm, currentPassword: e.target.value })}
                  placeholder="أدخل كلمة المرور الحالية (Default: admin215)"
                  className="bg-surface-container-low border border-outline-variant/60 p-3 rounded-DEFAULT font-body-sm"
                />
              </div>

              <hr className="border-outline-variant/30 my-1" />

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md font-bold text-on-surface">اسم المستخدم الجديد (اختياري)</label>
                <input
                  type="text"
                  value={credForm.newUsername}
                  onChange={(e) => setCredForm({ ...credForm, newUsername: e.target.value })}
                  placeholder="اسم المستخدم الجديد"
                  className="bg-surface-container-low border border-outline-variant/60 p-3 rounded-DEFAULT font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md font-bold text-on-surface">كلمة المرور الجديدة (اختياري)</label>
                <input
                  type="password"
                  value={credForm.newPassword}
                  onChange={(e) => setCredForm({ ...credForm, newPassword: e.target.value })}
                  placeholder="كلمة المرور الجديدة"
                  className="bg-surface-container-low border border-outline-variant/60 p-3 rounded-DEFAULT font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md font-bold text-on-surface">تأكيد كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={credForm.confirmPassword}
                  onChange={(e) => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                  placeholder="تأكيد كلمة المرور الجديدة"
                  className="bg-surface-container-low border border-outline-variant/60 p-3 rounded-DEFAULT font-body-sm"
                />
              </div>

              <button
                type="submit"
                className="mt-2 px-space-xl py-space-sm bg-primary text-on-primary hover:bg-primary-container font-label-lg font-bold rounded-DEFAULT shadow-md transition-colors"
              >
                تحديث بيانات الأمان
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Modal: View Details */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="bg-surface text-on-surface w-full max-w-lg p-space-xl rounded-DEFAULT shadow-2xl border border-outline-variant/40 flex flex-col gap-space-md animate-scale-in text-right">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
              <span className="font-technical-code font-bold text-secondary">{selectedRequest.id}</span>
              <h3 className="font-headline-sm font-bold text-on-surface">تفاصيل طلب المعاينة</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-on-surface hover:text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-xs font-body-sm">
              <div><strong className="text-on-surface-variant">اسم العميل:</strong> {selectedRequest.name}</div>
              <div><strong className="text-on-surface-variant">الجوال:</strong> <span dir="ltr">{selectedRequest.phone}</span></div>
              <div><strong className="text-on-surface-variant">نوع الخدمة:</strong> {selectedRequest.service}</div>
              <div><strong className="text-on-surface-variant">الموقع/الحي:</strong> {selectedRequest.location}</div>
              <div><strong className="text-on-surface-variant">التاريخ:</strong> {selectedRequest.date}</div>
              <div><strong className="text-on-surface-variant">حالة الطلب:</strong> {selectedRequest.status}</div>
              <div className="mt-space-xs pt-space-xs border-t border-outline-variant/30">
                <strong className="text-on-surface-variant block mb-1">تفاصيل وملاحظات الموقع:</strong>
                <p className="p-space-sm bg-surface-container rounded-DEFAULT leading-relaxed">
                  {selectedRequest.details || 'لا توجد ملاحظات إضافية.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-space-xs pt-space-sm border-t border-outline-variant/30">
              <a
                href={`https://wa.me/966${selectedRequest.phone.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-space-md py-space-xs bg-secondary text-on-secondary font-label-md font-bold rounded-DEFAULT"
              >
                تواصل عبر واتساب
              </a>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-space-md py-space-xs bg-surface-container-high font-label-md font-bold rounded-DEFAULT"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Request */}
      {showAddReqModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="bg-surface text-on-surface w-full max-w-lg p-space-xl rounded-DEFAULT shadow-2xl border border-outline-variant/40 flex flex-col gap-space-md text-right animate-scale-in">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
              <h3 className="font-headline-sm font-bold text-on-surface">تسجيل طلب جديد يدوي</h3>
              <button onClick={() => setShowAddReqModal(false)} className="text-on-surface hover:text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">اسم العميل</label>
                <input
                  type="text"
                  required
                  value={newReq.name}
                  onChange={(e) => setNewReq({ ...newReq, name: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">رقم الجوال</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={newReq.phone}
                  onChange={(e) => setNewReq({ ...newReq, phone: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-right"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">نوع الخدمة</label>
                <input
                  type="text"
                  required
                  value={newReq.service}
                  onChange={(e) => setNewReq({ ...newReq, service: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">الحي / الموقع</label>
                <input
                  type="text"
                  required
                  value={newReq.location}
                  onChange={(e) => setNewReq({ ...newReq, location: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">ملاحظات الموقع</label>
                <textarea
                  rows="3"
                  value={newReq.details}
                  onChange={(e) => setNewReq({ ...newReq, details: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-space-xs pt-space-sm border-t border-outline-variant/30">
                <button
                  type="submit"
                  className="px-space-md py-space-xs bg-primary text-on-primary font-label-md font-bold rounded-DEFAULT"
                >
                  حفظ الطلب
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="px-space-md py-space-xs bg-surface-container-high font-label-md font-bold rounded-DEFAULT"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Service */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-space-md overflow-y-auto">
          <div className="bg-surface text-on-surface w-full max-w-xl my-8 p-space-xl rounded-DEFAULT shadow-2xl border border-outline-variant/40 flex flex-col gap-space-md text-right animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
              <h3 className="font-headline-sm font-bold text-on-surface">
                {editingService.id ? 'تعديل بيانات الخدمة الميدانية' : 'إضافة خدمة جديدة إلى الكتالوج'}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-on-surface hover:text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveService} className="flex flex-col gap-space-sm">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">كود الخدمة</label>
                  <input
                    type="text"
                    required
                    value={editingService.code || ''}
                    onChange={(e) => setEditingService({ ...editingService, code: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                    placeholder="مثال: SRV-01"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">العنوان والوسم الفرعي (Tag)</label>
                  <input
                    type="text"
                    value={editingService.tag || ''}
                    onChange={(e) => setEditingService({ ...editingService, tag: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                    placeholder="مثال: أعمال الهدم الكلي الثقيل"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">عنوان الخدمة الرئيسي</label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                    placeholder="عنوان الخدمة"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">التصنيف الإنشائي / الرقمي</label>
                  <input
                    type="text"
                    required
                    value={editingService.category || ''}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                    placeholder="مثال: 01 / هدم إنشائي"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">رمز الأيقونة (Material Icon)</label>
                  <select
                    value={editingService.icon || 'construction'}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm cursor-pointer"
                  >
                    <option value="corporate_fare">corporate_fare (هدم مبانِ)</option>
                    <option value="content_cut">content_cut (هدم جزئي)</option>
                    <option value="grid_view">grid_view (تكسير سيراميك)</option>
                    <option value="splitscreen">splitscreen (قواطع وجدران)</option>
                    <option value="layers_clear">layers_clear (تجريد أرضيات)</option>
                    <option value="local_shipping">local_shipping (ترحيل ونقل)</option>
                    <option value="construction">construction (عام)</option>
                    <option value="engineering">engineering (إشراف هندسي)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">صورة الخدمة (رفع من الجهاز أو ادخال مسار)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingService({ ...editingService, image: url }))}
                    className="bg-surface border border-outline-variant/60 p-1.5 rounded-DEFAULT font-body-sm text-xs cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingService.image || ''}
                    onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-1.5 rounded-DEFAULT font-technical-code text-xs"
                    placeholder="/images/construction.png أو رابط الصورة"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold text-on-surface">الوصف التفصيلي للخدمة</label>
                <textarea
                  rows="3"
                  required
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                  placeholder="اكتب وصفاً شاملاً للخدمة وآلية التنفيذ..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold text-on-surface">المواصفات الفنية والنطاق (مفصولة بعلامة |)</label>
                <input
                  type="text"
                  value={editingService.specs || ''}
                  onChange={(e) => setEditingService({ ...editingService, specs: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                  placeholder="مواصفة 1|مواصفة 2|مواصفة 3"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold text-on-surface">نص طلب الواتساب (URL Encoded Text)</label>
                <input
                  type="text"
                  value={editingService.wa_text || ''}
                  onChange={(e) => setEditingService({ ...editingService, wa_text: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-technical-code text-xs"
                  placeholder="مثال: طلب%20معاينة%20هدم%20مبنى"
                />
              </div>

              <div className="flex justify-end gap-space-xs pt-space-sm border-t border-outline-variant/30">
                <button type="submit" className="px-space-md py-space-xs bg-primary text-on-primary font-label-md font-bold rounded-DEFAULT hover:bg-primary-container transition-colors">
                  حفظ الخدمة بالكتالوج
                </button>
                <button type="button" onClick={() => setEditingService(null)} className="px-space-md py-space-xs bg-surface-container-high font-label-md font-bold rounded-DEFAULT">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Project */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="bg-surface text-on-surface w-full max-w-lg p-space-xl rounded-DEFAULT shadow-2xl border border-outline-variant/40 flex flex-col gap-space-md text-right animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
              <h3 className="font-headline-sm font-bold text-on-surface">إضافة / تعديل مشروع بمعرض الأعمال</h3>
              <button onClick={() => setEditingProject(null)} className="text-on-surface hover:text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="flex flex-col gap-space-sm">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">عنوان المشروع</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">التصنيف</label>
                <input
                  type="text"
                  required
                  value={editingProject.category || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">الموقع / الحي</label>
                <input
                  type="text"
                  required
                  value={editingProject.location || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">صورة المشروع (رفع من الجهاز أو رابط)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setEditingProject({ ...editingProject, image: url }))}
                  className="bg-surface border border-outline-variant/60 p-1.5 rounded-DEFAULT font-body-sm text-xs cursor-pointer"
                />
                <input
                  type="text"
                  value={editingProject.image || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-1.5 rounded-DEFAULT font-technical-code text-xs"
                  placeholder="/images/construction.png أو رابط الصورة"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">الوصف والتفاصيل</label>
                <textarea
                  rows="3"
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-space-xs pt-space-sm border-t border-outline-variant/30">
                <button type="submit" className="px-space-md py-space-xs bg-primary text-on-primary font-label-md font-bold rounded-DEFAULT">
                  حفظ التغيرات
                </button>
                <button type="button" onClick={() => setEditingProject(null)} className="px-space-md py-space-xs bg-surface-container-high font-label-md font-bold rounded-DEFAULT">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Article */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-space-md">
          <div className="bg-surface text-on-surface w-full max-w-2xl p-space-xl rounded-DEFAULT shadow-2xl border border-outline-variant/40 flex flex-col gap-space-md text-right animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
              <h3 className="font-headline-sm font-bold text-on-surface">
                {editingArticle.id ? 'تعديل مقال سيو' : 'إضافة مقال جديد وأرشفته تلقائياً'}
              </h3>
              <button onClick={() => setEditingArticle(null)} className="text-on-surface hover:text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="flex flex-col gap-space-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold">عنوان المقال (مستهدف السيو)</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title || ''}
                    onChange={(e) => {
                      const titleVal = e.target.value;
                      const slugVal = editingArticle.slug || titleVal.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '');
                      setEditingArticle({ ...editingArticle, title: titleVal, slug: slugVal });
                    }}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                    placeholder="عنوان المقال الرئيسي"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold">الرابط الدائم (Slug)</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.slug || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-technical-code text-xs"
                    placeholder="demolition-dammam-guide"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold">التصنيف</label>
                  <select
                    value={editingArticle.category || 'هدم مباني'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                  >
                    <option value="هدم مباني">هدم مباني</option>
                    <option value="تكسير جدران">تكسير جدران</option>
                    <option value="إزالة سيراميك">إزالة سيراميك</option>
                    <option value="شراء سكراب">شراء سكراب</option>
                    <option value="أعمال الأسفلت">أعمال الأسفلت</option>
                    <option value="إرشادات ونصائح">إرشادات ونصائح</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold">الكاتب</label>
                  <input
                    type="text"
                    value={editingArticle.author || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                    placeholder="م. أحمد الشمري"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold">زمن القراءة</label>
                  <input
                    type="text"
                    value={editingArticle.read_time || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, read_time: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                    placeholder="5 دقائق"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">صورة المقال (رفع من الجهاز أو ادخال مسار)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setEditingArticle({ ...editingArticle, image: url }))}
                  className="bg-surface border border-outline-variant/60 p-1.5 rounded-DEFAULT font-body-sm text-xs cursor-pointer"
                />
                <input
                  type="text"
                  value={editingArticle.image || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-1.5 rounded-DEFAULT font-technical-code text-xs"
                  placeholder="/images/hero-demolition.png"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">الملخص المختصر (Excerpt - يظهر في نتائج جوجل ومعاينة المقال)</label>
                <textarea
                  rows="2"
                  required
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm"
                  placeholder="ملخص المقال في 20 إلى 30 كلمة..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">محتوى المقال الشامل (HTML / Text)</label>
                <textarea
                  rows="7"
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm leading-relaxed"
                  placeholder="محتوى المقال كاملاً..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm font-bold">الكلمات المفتاحية للسيو (Keywords مفصولة بفواصل)</label>
                <input
                  type="text"
                  value={editingArticle.keywords || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, keywords: e.target.value })}
                  className="bg-surface-container-low border border-outline-variant/60 p-2 rounded-DEFAULT font-body-sm text-xs"
                  placeholder="هدم مباني الدمام, مقاول هدم الشرقية, تكسير مباني"
                />
              </div>

              <div className="flex justify-end gap-space-xs pt-space-sm border-t border-outline-variant/30">
                <button type="submit" className="px-space-md py-space-xs bg-primary text-on-primary font-label-md font-bold rounded-DEFAULT hover:bg-primary-container transition-colors">
                  حفظ وأرشفة المقال
                </button>
                <button type="button" onClick={() => setEditingArticle(null)} className="px-space-md py-space-xs bg-surface-container-high font-label-md font-bold rounded-DEFAULT">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
