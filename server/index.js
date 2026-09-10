const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Setting, Service, Project, Request, Article } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static assets from public images folder
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// API: Upload Image file from device
app.post('/api/upload', (req, res) => {
  try {
    const { name, data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, message: 'لم يتم توفير بيانات الصورة' });
    }

    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already a URL or pure base64
      return res.json({ success: true, url: data, message: 'تم التمرير بنجاح' });
    }

    const extMatch = matches[1].match(/\/([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1] : 'png';
    const filename = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
    const targetDir = path.join(__dirname, '../client/public/images/uploads');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/uploads/${filename}`;
    res.json({ success: true, url: publicUrl, message: 'تم رفع الصورة وحفظها بنجاح' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حفظ الملف على الخادم' });
  }
});

// API: Get Settings
app.get('/api/settings', async (req, res) => {
  try {
    const rows = await Setting.find({});
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Save Settings
app.post('/api/settings', async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await Setting.findOneAndUpdate(
        { key },
        { key, value: String(value) },
        { upsert: true, new: true }
      );
    }
    res.json({ success: true, message: 'تم حفظ الإعدادات بنجاح في قاعدة البيانات' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
    }

    const dbUserDoc = await Setting.findOne({ key: 'admin_username' });
    const dbPassDoc = await Setting.findOne({ key: 'admin_password' });

    const expectedUser = (dbUserDoc ? dbUserDoc.value : 'admin').trim();
    const expectedPass = (dbPassDoc ? dbPassDoc.value : 'admin215').trim();

    const inputUser = String(username).trim();
    const inputPass = String(password).trim();

    if (inputUser.toLowerCase() === expectedUser.toLowerCase() && inputPass === expectedPass) {
      const token = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await Setting.findOneAndUpdate({ key: 'admin_active_token' }, { key: 'admin_active_token', value: token }, { upsert: true });
      return res.json({ success: true, token, username: expectedUser, message: 'تم تسجيل الدخول بنجاح' });
    }

    return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Verify Admin Token
app.post('/api/admin/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.json({ success: true, valid: false });
    const tokenDoc = await Setting.findOne({ key: 'admin_active_token' });
    if (tokenDoc && tokenDoc.value === token) {
      return res.json({ success: true, valid: true });
    }
    return res.json({ success: true, valid: false });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Change Admin Credentials
app.post('/api/admin/change-credentials', async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    const dbPassDoc = await Setting.findOne({ key: 'admin_password' });
    const expectedPass = dbPassDoc ? dbPassDoc.value : 'admin215';

    if (currentPassword !== expectedPass) {
      return res.status(400).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' });
    }

    if (newUsername) {
      await Setting.findOneAndUpdate({ key: 'admin_username' }, { key: 'admin_username', value: newUsername }, { upsert: true });
    }
    if (newPassword) {
      await Setting.findOneAndUpdate({ key: 'admin_password' }, { key: 'admin_password', value: newPassword }, { upsert: true });
    }

    res.json({ success: true, message: 'تم تحديث اسم المستخدم وكلمة المرور بنجاح في قاعدة البيانات MongoDB Atlas' });
  } catch (error) {
    console.error('Error changing admin credentials:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Get all requests (with filtering & search)
app.get('/api/requests', async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== 'all' && status !== 'الكل') {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { service: searchRegex },
        { id: searchRegex },
        { phone: searchRegex }
      ];
    }

    const requests = await Request.find(filter).sort({ created_at: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Get Dashboard Stats
app.get('/api/stats', async (req, res) => {
  try {
    const total = await Request.countDocuments();
    const pending = await Request.countDocuments({ status: { $in: ['جديد', 'تم التواصل'] } });
    const active = await Request.countDocuments({ status: { $in: ['قيد المعاينة', 'قيد التنفيذ'] } });
    const completed = await Request.countDocuments({ status: 'مكتمل' });

    res.json({
      success: true,
      data: { total, pending, active, completed }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Create a new request
app.post('/api/requests', async (req, res) => {
  try {
    const { name, phone, service, location, details } = req.body;

    if (!name || !phone || !service || !location) {
      return res.status(400).json({ success: false, message: 'يرجى تزويد جميع البيانات المطلوبة' });
    }

    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `REQ-${year}-${randomNum}`;
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');

    const newReq = await Request.create({
      id,
      name,
      phone,
      service,
      location,
      date: today,
      status: 'جديد',
      details: details || ''
    });

    res.json({
      success: true,
      message: 'تم إرسال طلبكم بنجاح وحفظه في قاعدة البيانات. سيتصل بكم المشرف الميداني لتحديد موعد المعاينة.',
      data: newReq
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Update request status / details
app.patch('/api/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.details !== undefined) updateData.details = req.body.details;

    await Request.findOneAndUpdate({ id }, updateData);
    res.json({ success: true, message: 'تم تحديث الطلب بنجاح' });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Delete request
app.delete('/api/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Request.findOneAndDelete({ id });
    res.json({ success: true, message: 'تم حذف الطلب' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Services CRUD
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({});
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const { code, tag, icon, title, category, description, image, specs, wa_text } = req.body;
    const id = `srv-${Date.now()}`;
    await Service.create({
      id,
      code: code || 'SRV-NEW',
      tag: tag || 'خدمة تنفيذية',
      icon: icon || 'construction',
      title,
      category: category || 'خدمات المقاولات',
      description,
      image: image || '/images/construction.png',
      specs: specs || '',
      wa_text: wa_text || 'استفسار'
    });
    res.json({ success: true, message: 'تم إضافة الخدمة بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, tag, icon, title, category, description, image, specs, wa_text } = req.body;
    await Service.findOneAndUpdate({ id }, {
      code, tag, icon, title, category, description, image, specs, wa_text
    });
    res.json({ success: true, message: 'تم تحديث الخدمة بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findOneAndDelete({ id });
    res.json({ success: true, message: 'تم حذف الخدمة' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Sync/Reset Services to Default Site Services
app.post('/api/services/reset-defaults', async (req, res) => {
  try {
    await Service.deleteMany({});
    const defaultServices = [
      {
        id: 'srv-1', code: 'SRV-01', tag: 'أعمال الهدم الكلي الثقيل', icon: 'corporate_fare',
        title: 'هدم المباني والمنشآت الخرسانية بالكامل', category: '01 / هدم إنشائي',
        description: 'خدمة الهدم الإنشائي الشامل للفيلا السكنية، العماير، الفنادق والمباني التجارية والمستودعات في الدمام والشرقية. تشمل تفكيك الأسقف وتقويض الأعمدة الخرسانية والأساسات باستخدام بوكلينات متخصصة مع ترحيل الأنقاض وتسوية التربة.',
        image: '/images/construction.png',
        specs: 'هدم المنشآت الخرسانية والمصانع والهناجر|تقويض القواعد والأساسات الأرضية|تأمين سياج السلامة ورشاشات رذاذ الماء لقمع الأتربة|عزل خطوط الخدمة والكهرباء بالتنسيق مع الجهات المعنية',
        wa_text: 'طلب%20معاينة%20هدم%20مبنى'
      },
      {
        id: 'srv-2', code: 'SRV-02', tag: 'هدم جزئي وتفريغ إنشائي', icon: 'content_cut',
        title: 'الهدم الجزئي والتوسعة المعمارية الآمنة', category: '02 / هدم دقيق',
        description: 'إزالة أجزاء محددة من الهيكل الخرساني (مثل الملاحق الخارجية، الأسوار، أو الواجهات الجانبية) بغرض التوسعة وتعديل التصميم بدون التأثير على الأعمدة والجسور الرئيسية الحاملة للعقار.',
        image: '/images/selective_demolition.png',
        specs: 'قص وقشط خرسانات الأسوار والملاحق|حماية الأعمدة والجسور الخرسانية الحاملة|تفكيك المظلات والهياكل الحديدية الملحقة|تقارير سلامة إنشائية قبل المباشرة',
        wa_text: 'طلب%20معاينة%20هدم%20جزئي'
      },
      {
        id: 'srv-3', code: 'SRV-03', tag: 'تكسيرات داخلية وتشطيبات', icon: 'grid_view',
        title: 'تكسير وإزالة السيراميك والبورسلان والبلاط', category: '03 / تشطيبات أولية',
        description: 'إزالة وتكسير بلاط الأرضيات والجدران للمطابخ والحمامات والصالات والمحلات التجارية بالدمام بأحدث الهيلتيات الهوائية دون أحداث اهتزازات تؤثر على صبة الخرسانة السفلية.',
        image: '/images/tile_removal.png',
        specs: 'تكسير سيراميك وبورسلان الأرضيات والجدران|قشط طبقة الغراء والخلطة الإسمنتية القديمة|تجهيز السطح لاستقبال السيراميك والسباكة الجديدة|تنظيف وتكييس المخلفات ونقلها فوراً',
        wa_text: 'طلب%20خدمة%20إزالة%20سيراميك'
      },
      {
        id: 'srv-4', code: 'SRV-04', tag: 'تعديل المساقط الداخلية', icon: 'splitscreen',
        title: 'تكسير الجدران والقواطع البلوك والجبس', category: '04 / تعديل معماري',
        description: 'فتح مساحات معمارية جديدة وإزالة جدران البلوك والقواطع الجبسية والمباني غير الحاملة لتوسعة الصالات، المحلات التجارية، والمكاتب الإدارية مع حماية التمديدات.',
        image: '/images/renovation.png',
        specs: 'تكسير قواطع البلوك والجبسم بورد بدقة|فتح فتحات الأبواب والنوافذ بالخرسانة والبلوك|فصل تمديدات الكهرباء والسباكة بأمان|تدعيم الأعتاب العلوية عند الحاجة',
        wa_text: 'طلب%20تكسير%20جدران%20وقواطع'
      },
      {
        id: 'srv-5', code: 'SRV-05', tag: 'تجهيز مسطحات تجارية', icon: 'layers_clear',
        title: 'إزالة وتجريد أرضيات المعارض والمستودعات', category: '05 / تجهيز مسطحات',
        description: 'تجريد مسطحات الأرضيات الصلبة والمعارض التجارية وتجهيزها لاستقبال أعمال الإيبوكسي أو الرخام والبورسلان الحديث من خلال إزالة الطبقات القديمة وتسوية المنسوب.',
        image: '/images/tile_removal.png',
        specs: 'تجريد أرضيات الإيبوكسي والرخام والجرانيت|إزالة الطبقات العازلة والخرسانات الضعيفة|تهيئة منسوب الأرضية للمقاول التالي|سرعة إنجاز عالية للمساحات الكبيرة',
        wa_text: 'طلب%20تجريد%20وإزالة%20أرضيات'
      },
      {
        id: 'srv-6', code: 'SRV-06', tag: 'إخلاء ونقل مرخص', icon: 'local_shipping',
        title: 'ترحيل المخلفات والركام وإصدار الشهادات', category: '06 / نقل وإخلاء',
        description: 'تحميل ونقل مخلفات التكسير والهدم بواسطة أسطول شاحنات قلاب إلى المرامي الرسمية المعتمدة من أمانة المنطقة الشرقية وتسليم الموقع خاوياً ونظيفاً تماماً.',
        image: '/images/construction.png',
        specs: 'تحميل وتجريف ركام الهدم الكلي والجزئي|تنظيف مواقع الترميم الداخلي|تسوية الدفان والتربة|إصدار شهادات ترحيل بلدية معتمدة',
        wa_text: 'طلب%20ترحيل%20مخلفات%20وتجهيز%20موقع'
      },
      {
        id: 'srv-7', code: 'SRV-07', tag: 'سفلتة وترميم الطرق والساحات', icon: 'construction',
        title: 'أعمال الأسفلت والسفلتة', category: '07 / أعمال الأسفلت',
        description: 'تنفيذ أعمال الأسفلت والسفلتة للساحات، المواقف، الطرق الداخلية، وأمام المباني والمنشآت التجارية والسكنية بالدمام والشرقية بأعلى جودة ودك هندسي.',
        image: '/images/construction.png',
        specs: 'سفلتة الطرق والساحات والمواقف|تمهيد ودك طبقات الأساس والتربة|معالجة وتعبئة التشققات والحفر|تخطيط ورسم المسارات وحركة المرور',
        wa_text: 'طلب%20معاينة%20أعمال%20أسفلت'
      },
      {
        id: 'srv-8', code: 'SRV-08', tag: 'شراء وتثمين السكراب والحديد', icon: 'local_shipping',
        title: 'شراء سكراب وهياكل حديد', category: '08 / شراء سكراب',
        description: 'شراء ومعاينة كافة أنواع السكراب والحديد الناتج عن هدم المباني، الهياكل المعدنية، ومخلفات المصانع والورش بالدمام بأعلى أسعار السوق مع النقل الفوري.',
        image: '/images/selective_demolition.png',
        specs: 'شراء حديد الهدم والخردة بالسعر الجاري|تثمين الهياكل والمظلات الحديدية والمستودعات|نقل وتحميل السكراب بأسطولنا الخاص|دفع فوري وتسليم الموقع نظيفاً',
        wa_text: 'طلب%20معاينة%20وتثمين%20سكراب'
      }
    ];
    await Service.insertMany(defaultServices);
    res.json({ success: true, message: 'تم إعادة مزامنة واستيراد جميع خدمات الموقع الأساسية بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Projects CRUD
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({});
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, category, location, description, image, specs, featured } = req.body;
    const count = await Project.countDocuments();
    await Project.create({
      id: count + 1,
      title,
      category,
      location,
      description,
      image: image || '/images/construction.png',
      specs: specs || '',
      featured: featured ? 1 : 0
    });
    res.json({ success: true, message: 'تم إضافة المشروع بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, location, description, image, specs, featured } = req.body;
    await Project.findOneAndUpdate({ id: Number(id) }, {
      title, category, location, description, image, specs, featured: featured ? 1 : 0
    });
    res.json({ success: true, message: 'تم تحديث المشروع بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findOneAndDelete({ id: Number(id) });
    res.json({ success: true, message: 'تم حذف المشروع' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API: Articles CRUD (Blog)
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ created_at: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await Article.findOneAndUpdate(
      { $or: [{ slug }, { id: slug }] },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ success: false, message: 'المقال غير موجود' });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching single article:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/articles', async (req, res) => {
  try {
    const { title, slug, excerpt, content, image, category, date, author, read_time, keywords } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'يرجى تزويد عنوان المقال والمحتوى' });
    }

    const id = `art-${Date.now()}`;
    const finalSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]+/g, '-').replace(/^-+|-+$/g, '');
    const today = date || new Date().toISOString().split('T')[0].replace(/-/g, '/');

    await Article.create({
      id,
      slug: finalSlug || `article-${Date.now()}`,
      title,
      excerpt: excerpt || title,
      content,
      image: image || '/images/construction.png',
      category: category || 'مقاولات عامة',
      date: today,
      author: author || 'فريق الإشراف الهندسي',
      read_time: read_time || '5 دقائق',
      keywords: keywords || title,
      views: 0
    });

    res.json({ success: true, message: 'تم نشر المقال بنجاح وأرشفته بالسيو' });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, image, category, date, author, read_time, keywords } = req.body;

    await Article.findOneAndUpdate({ id }, {
      title, slug, excerpt, content, image, category, date, author, read_time, keywords
    });

    res.json({ success: true, message: 'تم تحديث المقال وإعادة الأرشفة بنجاح' });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Article.findOneAndDelete({ id });
    res.json({ success: true, message: 'تم حذف المقال' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Export Requests CSV Endpoint
app.get('/api/export', async (req, res) => {
  try {
    const requests = await Request.find({}).sort({ created_at: -1 });
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += 'رقم الطلب,اسم العميل,رقم الجوال,نوع الخدمة,الحي والموقع,تاريخ الطلب,الحالة,تفاصيل الطلب\n';
    
    requests.forEach(r => {
      const cleanDetails = (r.details || '').replace(/"/g, '""').replace(/\n/g, ' ');
      csv += `"${r.id}","${r.name}","${r.phone}","${r.service}","${r.location}","${r.date}","${r.status}","${cleanDetails}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="demolition_requests.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).send('Error generating export file');
  }
});

// Dynamic Sitemap.xml Route (Auto-Indexes all site pages, services, projects, articles)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const host = req.get('host') || 'localhost:5000';
    const baseUrl = `${req.protocol}://${host}`;
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
      { path: '#/home', priority: '1.0', changefreq: 'daily' },
      { path: '#/about-us', priority: '0.8', changefreq: 'weekly' },
      { path: '#/our-services', priority: '0.9', changefreq: 'daily' },
      { path: '#/our-work', priority: '0.8', changefreq: 'weekly' },
      { path: '#/articles', priority: '0.9', changefreq: 'daily' },
      { path: '#/contact-us', priority: '0.8', changefreq: 'monthly' }
    ];

    const services = await Service.find({});
    const projects = await Project.find({});
    const articles = await Article.find({});

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    staticPages.forEach(p => {
      xml += `  <url>\n    <loc>${baseUrl}/${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    });

    services.forEach(s => {
      xml += `  <url>\n    <loc>${baseUrl}/#/our-services?srv=${encodeURIComponent(s.id)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    });

    projects.forEach(prj => {
      xml += `  <url>\n    <loc>${baseUrl}/#/our-work?prj=${prj.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.75</priority>\n  </url>\n`;
    });

    articles.forEach(art => {
      xml += `  <url>\n    <loc>${baseUrl}/#/articles/${art.slug}</loc>\n    <lastmod>${art.date ? art.date.replace(/\//g, '-') : today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Dynamic Robots.txt Route
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'localhost:5000';
  const baseUrl = `${req.protocol}://${host}`;

  const robots = `User-agent: *
Allow: /
Disallow: /#/admin-dashboard

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

// Serve frontend build if dist folder exists
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
