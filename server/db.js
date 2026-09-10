require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mshebl215_db_user:aJjcEGq14Ydfiq2m@cluster01.imv0ivg.mongodb.net/demolition_db?retryWrites=true&w=majority&appName=Cluster01';

// Mongoose Schemas & Models
const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true }
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: String,
  tag: String,
  icon: String,
  title: { type: String, required: true },
  category: String,
  description: String,
  image: String,
  specs: String,
  wa_text: String
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  category: String,
  location: String,
  description: String,
  image: String,
  specs: String,
  featured: { type: Number, default: 0 }
}, { timestamps: true });

const RequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  location: { type: String, required: true },
  date: String,
  status: { type: String, default: 'جديد' },
  details: String,
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

const ArticleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: String,
  content: String,
  image: String,
  category: String,
  date: String,
  author: String,
  read_time: String,
  keywords: String,
  views: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

const Setting = mongoose.model('Setting', SettingSchema);
const Service = mongoose.model('Service', ServiceSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Request = mongoose.model('Request', RequestSchema);
const Article = mongoose.model('Article', ArticleSchema);

// Connection & Seeding
async function connectDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas Connected Successfully!');
    await seedDefaults();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

async function seedDefaults() {
  try {
    // 1. Settings
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
      const defaultSettings = [
        { key: 'phone', value: '0546735579' },
        { key: 'whatsapp', value: '0542703260' },
        { key: 'location', value: 'الدمام، المنطقة الشرقية، المملكة العربية السعودية' },
        { key: 'work_hours', value: 'السبت - الخميس: من 7:00 صباحاً حتى 6:00 مساءً' },
        { key: 'emergency_text', value: 'خدمة طوارئ الهدم والسلامة الإنشائية متاحة 24/7' },
        { key: 'logo', value: '/images/logo.png' },
        { key: 'logo_size', value: '44' },
        { key: 'hero_images', value: '/images/construction.png,/images/selective_demolition.png,/images/renovation.png,/images/tile_removal.png' },
        { key: 'social_twitter', value: 'https://twitter.com' },
        { key: 'social_instagram', value: 'https://instagram.com' },
        { key: 'social_tiktok', value: 'https://tiktok.com' },
        { key: 'social_linkedin', value: 'https://linkedin.com' },
        { key: 'admin_username', value: 'admin' },
        { key: 'admin_password', value: 'admin215' }
      ];
      await Setting.insertMany(defaultSettings);
      console.log('Default settings seeded to MongoDB');
    }

    // Ensure admin credentials exist even if settings existed previously
    const adminUser = await Setting.findOne({ key: 'admin_username' });
    if (!adminUser) {
      await Setting.create({ key: 'admin_username', value: 'admin' });
      await Setting.create({ key: 'admin_password', value: 'admin215' });
    }

    const aboutImg = await Setting.findOne({ key: 'about_image' });
    if (!aboutImg) {
      await Setting.create({ key: 'about_image', value: '/images/renovation.png' });
    }

    // 2. Services
    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      const defaultServices = [
        {
          id: 'srv-1',
          code: 'SRV-01',
          tag: 'أعمال الهدم الكلي الثقيل',
          icon: 'corporate_fare',
          title: 'هدم المباني والمنشآت الخرسانية بالكامل',
          category: '01 / هدم إنشائي',
          description: 'خدمة الهدم الإنشائي الشامل للفيلا السكنية، العماير، الفنادق والمباني التجارية والمستودعات في الدمام والشرقية. تشمل تفكيك الأسقف وتقويض الأعمدة الخرسانية والأساسات باستخدام بوكلينات متخصصة مع ترحيل الأنقاض وتسوية التربة.',
          image: '/images/construction.png',
          specs: 'هدم المنشآت الخرسانية والمصانع والهناجر|تقويض القواعد والأساسات الأرضية|تأمين سياج السلامة ورشاشات رذاذ الماء لقمع الأتربة|عزل خطوط الخدمة والكهرباء بالتنسيق مع الجهات المعنية',
          wa_text: 'طلب%20معاينة%20هدم%20مبنى'
        },
        {
          id: 'srv-2',
          code: 'SRV-02',
          tag: 'هدم جزئي وتفريغ إنشائي',
          icon: 'content_cut',
          title: 'الهدم الجزئي والتوسعة المعمارية الآمنة',
          category: '02 / هدم دقيق',
          description: 'إزالة أجزاء محددة من الهيكل الخرساني (مثل الملاحق الخارجية، الأسوار، أو الواجهات الجانبية) بغرض التوسعة وتعديل التصميم بدون التأثير على الأعمدة والجسور الرئيسية الحاملة للعقار.',
          image: '/images/selective_demolition.png',
          specs: 'قص وقشط خرسانات الأسوار والملاحق|حماية الأعمدة والجسور الخرسانية الحاملة|تفكيك المظلات والهياكل الحديدية الملحقة|تقارير سلامة إنشائية قبل المباشرة',
          wa_text: 'طلب%20معاينة%20هدم%20جزئي'
        },
        {
          id: 'srv-3',
          code: 'SRV-03',
          tag: 'تكسيرات داخلية وتشطيبات',
          icon: 'grid_view',
          title: 'تكسير وإزالة السيراميك والبورسلان والبلاط',
          category: '03 / تشطيبات أولية',
          description: 'إزالة وتكسير بلاط الأرضيات والجدران للمطابخ والحمامات والصالات والمحلات التجارية بالدمام بأحدث الهيلتيات الهوائية دون أحداث اهتزازات تؤثر على صبة الخرسانة السفلية.',
          image: '/images/tile_removal.png',
          specs: 'تكسير سيراميك وبورسلان الأرضيات والجدران|قشط طبقة الغراء والخلطة الإسمنتية القديمة|تجهيز السطح لاستقبال السيراميك والسباكة الجديدة|تنظيف وتكييس المخلفات ونقلها فوراً',
          wa_text: 'طلب%20خدمة%20إزالة%20سيراميك'
        },
        {
          id: 'srv-4',
          code: 'SRV-04',
          tag: 'تعديل المساقط الداخلية',
          icon: 'splitscreen',
          title: 'تكسير الجدران والقواطع البلوك والجبس',
          category: '04 / تعديل معماري',
          description: 'فتح مساحات معمارية جديدة وإزالة جدران البلوك والقواطع الجبسية والمباني غير الحاملة لتوسعة الصالات، المحلات التجارية، والمكاتب الإدارية مع حماية التمديدات.',
          image: '/images/renovation.png',
          specs: 'تكسير قواطع البلوك والجبسم بورد بدقة|فتح فتحات الأبواب والنوافذ بالخرسانة والبلوك|فصل تمديدات الكهرباء والسباكة بأمان|تدعيم الأعتاب العلوية عند الحاجة',
          wa_text: 'طلب%20تكسير%20جدران%20وقواطع'
        },
        {
          id: 'srv-5',
          code: 'SRV-05',
          tag: 'تجهيز مسطحات تجارية',
          icon: 'layers_clear',
          title: 'إزالة وتجريد أرضيات المعارض والمستودعات',
          category: '05 / تجهيز مسطحات',
          description: 'تجريد مسطحات الأرضيات الصلبة والمعارض التجارية وتجهيزها لاستقبال أعمال الإيبوكسي أو الرخام والبورسلان الحديث من خلال إزالة الطبقات القديمة وتسوية المنسوب.',
          image: '/images/tile_removal.png',
          specs: 'تجريد أرضيات الإيبوكسي والرخام والجرانيت|إزالة الطبقات العازلة والخرسانات الضعيفة|تهيئة منسوب الأرضية للمقاول التالي|سرعة إنجاز عالية للمساحات الكبيرة',
          wa_text: 'طلب%20تجريد%20وإزالة%20أرضيات'
        },
        {
          id: 'srv-6',
          code: 'SRV-06',
          tag: 'إخلاء ونقل مرخص',
          icon: 'local_shipping',
          title: 'ترحيل المخلفات والركام وإصدار الشهادات',
          category: '06 / نقل وإخلاء',
          description: 'تحميل ونقل مخلفات التكسير والهدم بواسطة أسطول شاحنات قلاب إلى المرامي الرسمية المعتمدة من أمانة المنطقة الشرقية وتسليم الموقع خاوياً ونظيفاً تماماً.',
          image: '/images/construction.png',
          specs: 'تحميل وتجريف ركام الهدم الكلي والجزئي|تنظيف مواقع الترميم الداخلي|تسوية الدفان والتربة|إصدار شهادات ترحيل بلدية معتمدة',
          wa_text: 'طلب%20ترحيل%20مخلفات%20وتجهيز%20موقع'
        },
        {
          id: 'srv-7',
          code: 'SRV-07',
          tag: 'سفلتة وترميم الطرق والساحات',
          icon: 'construction',
          title: 'أعمال الأسفلت والسفلتة',
          category: '07 / أعمال الأسفلت',
          description: 'تنفيذ أعمال الأسفلت والسفلتة للساحات، المواقف، الطرق الداخلية، وأمام المباني والمنشآت التجارية والسكنية بالدمام والشرقية بأعلى جودة ودك هندسي.',
          image: '/images/construction.png',
          specs: 'سفلتة الطرق والساحات والمواقف|تمهيد ودك طبقات الأساس والتربة|معالجة وتعبئة التشققات والحفر|تخطيط ورسم المسارات وحركة المرور',
          wa_text: 'طلب%20معاينة%20أعمال%20أسفلت'
        },
        {
          id: 'srv-8',
          code: 'SRV-08',
          tag: 'شراء وتثمين السكراب والحديد',
          icon: 'local_shipping',
          title: 'شراء سكراب وهياكل حديد',
          category: '08 / شراء سكراب',
          description: 'شراء ومعاينة كافة أنواع السكراب والحديد الناتج عن هدم المباني، الهياكل المعدنية، ومخلفات المصانع والورش بالدمام بأعلى أسعار السوق مع النقل الفوري.',
          image: '/images/selective_demolition.png',
          specs: 'شراء حديد الهدم والخردة بالسعر الجاري|تثمين الهياكل والمظلات الحديدية والمستودعات|نقل وتحميل السكراب بأسطولنا الخاص|دفع فوري وتسليم الموقع نظيفاً',
          wa_text: 'طلب%20معاينة%20وتثمين%20سكراب'
        }
      ];
      await Service.insertMany(defaultServices);
      console.log('Default services seeded to MongoDB');
    }

    // 3. Projects
    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      const defaultProjects = [
        {
          id: 1,
          title: 'مشروع هدم مجمع تجاري بالدمام',
          category: 'هدم كلي للمباني والمنشآت',
          location: 'حي الشاطئ الغربي، الدمام',
          description: 'هدم مجمع تجاري مكوّن من 3 طوابق خرسانية مسلحة مجاورة لمبانٍ سكنية مع استخدام أنظمة كتم الغبار وترحيل الأنقاض بالكامل.',
          image: '/images/construction.png',
          specs: 'المساحة: 1,400م² | المدة: 6 أيام | المعدات: 2 بوكلين جاك هامر + 4 شاحنات ترحيل',
          featured: 1
        },
        {
          id: 2,
          title: 'مشروع التكسير والهدم الجزئي لفيلا سكنية',
          category: 'هدم جزئي وتوسعات معمارية',
          location: 'حي الفاخرية، الدمام',
          description: 'تفريغ وهدم الملحق الخارجي وقص السور الجانبي وتوسعة الفناء الداخلي للفيلا دون التأثير على الهيكل الخرساني الأساسي.',
          image: '/images/selective_demolition.png',
          specs: 'المساحة: 280م² | المدة: 48 ساعة | المعدات: كور خرسانة دقيق + منشار ماسي',
          featured: 1
        },
        {
          id: 3,
          title: 'تكسير وإزالة بلاط وسيراميك برج مكاتب',
          category: 'إزالة سيراميك وتجريف أرضيات',
          location: 'حي النزهة، الخبر',
          description: 'تكسير وإزالة البلاط القديم لـ 5 أدوار إدارية وقشط الخلطة الإسمنتية القديمة وتجهيز الأسطح لتركيب البورسلان الحديث.',
          image: '/images/tile_removal.png',
          specs: 'المساحة: 3,200م² | المدة: 4 أيام | التكييس ونقل المخلفات مرخص',
          featured: 1
        },
        {
          id: 4,
          title: 'تكسير قواطع وإعادة تقسيم مسار إداري',
          category: 'تكسير جدران وقواطع',
          location: 'طريق الملك فهد، الدمام',
          description: 'إزالة الجدران والقواطع البلوك وتفكيك القواطع الجبسية الممتدة على مساحة واسعة لتهيئة المقر لشركة مقاولات عالمية.',
          image: '/images/renovation.png',
          specs: 'المساحة: 850م² | المدة: 3 أيام | حماية تمديدات الشبكات والكهرباء',
          featured: 1
        }
      ];
      await Project.insertMany(defaultProjects);
      console.log('Default projects seeded to MongoDB');
    }

    // 4. Requests
    const requestsCount = await Request.countDocuments();
    if (requestsCount === 0) {
      const defaultRequests = [
        {
          id: 'REQ-2024-089',
          name: 'م. فهد بن عبدالعزيز الدوسري',
          phone: '0504829104',
          service: 'هدم كلي لمبنى تجاري (3 أدوار)',
          location: 'حي الشاطئ الغربي',
          date: '2024/05/18',
          status: 'جديد',
          details: 'الموقع يحتوي على قواطع خرسانية مسلحة مجاورة لعمارة سكنية، يتطلب هدم دقيق باستخدام جاك هامر وترحيل الأنقاض فوراً مع توفير رشاشات رذاذ الماء لقمع الأتربة.'
        },
        {
          id: 'REQ-2024-090',
          name: 'سلطان حمود القحطاني',
          phone: '0551934820',
          service: 'تكسير قواطع وإزالة بلاط وسيراميك',
          location: 'حي الفاخرية',
          date: '2024/05/18',
          status: 'جديد',
          details: 'تجديد فيلا سكنية دورين. المطلوب تكسير سيراميك الأرضيات 350م² وإزالة 4 جدران بلوك قواطع مع ترحيل الأنقاض.'
        },
        {
          id: 'REQ-2024-091',
          name: 'شركة الأفق للمقاولات',
          phone: '0538201944',
          service: 'تجهيز وتجريد أرضيات معرض تجاري',
          location: 'طريق الملك فهد - الدمام',
          date: '2024/05/17',
          status: 'قيد المعاينة',
          details: 'تجهيز مساحة 1200 متر مربع لقشط الأرضيات القديمة وتجهيز الصبة لاستقبال أرضيات الإيبوكسي الصناعية.'
        }
      ];
      await Request.insertMany(defaultRequests);
      console.log('Default requests seeded to MongoDB');
    }

    // 5. Articles
    const articlesCount = await Article.countDocuments();
    if (articlesCount === 0) {
      const defaultArticles = [
        {
          id: 'art-1',
          slug: 'guide-to-safe-building-demolition-in-dammam',
          title: 'دليل هدم المباني والمنشآت بالدمام: التراخيص والسلامة وتجهيز المواقع',
          excerpt: 'تعرف على الخطوات الميدانية والقانونية لهدم المنشآت السكنية والتجارية بالدمام، بدءاً من التراخيص البلدية وفصل الخدمات، وحتى الهدم بالمعدات الثقيلة وترحيل الأنقاض.',
          content: `<h2>مقدمة في أعمال الهدم الإنشائي بالدمام</h2>
<p>تعتبر عملية هدم المباني والمنشآت الخرسانية القديمة في حاضرة الدمام والمنطقة الشرقية الخطوة التمهيدية الأولى والأهم قبل البدء بأي مشروع بناء جديد. تتطلب العملية دراسة هندسية دقيقة لتأمين سلامة المباني المجاورة والمارة.</p>

<h3>1. استخراج التراخيص البلدية المعتمدة</h3>
<p>قبل المباشرة بأعمال الهدم بالدمام، يلزم الحصول على ترخيص هدم رسمي من بلدية حاضرة الدمام أو أمانة المنطقة الشرقية، وتتطلب الآتي:</p>
<ul>
  <li>صورة السجل التجاري أو صك الملكية الإلكتروني.</li>
  <li>تقرير سلامة إنشائية معتمد من مكتب هندسي ترخيص ساري.</li>
  <li>موافقة وتعهد شركة الكهرباء والمياه بصل وفصل الخدمات.</li>
</ul>

<h3>2. إجراءات تأمين الموقع وفصل التمديدات</h3>
<p>نقوم في مؤسسة إعمار وهدم بوضع سياج أمني لحجب الأتربة والركام، وتوفير رشاشات رذاذ الماء لقمع الغبار، وتوفير المعدات الثقيلة كالبوكلينات المزودة بجاك هامر لتفكيك الأسقف والجسور بأعلى درجات السلامة.</p>

<h3>3. ترحيل الأنقاض والتسليم النظيف</h3>
<p>بعد الانتهاء من تقويض القواعد الخرسانية، يتم تحميل الركام والحديد بواسطة قلابات إلى المرامي البلدية المعتمدة وتسليم الأرض مستوية كلياً للبدء بأعمال الحفريات والأساسات.</p>`,
          image: '/images/construction.png',
          category: 'هدم إنشائي',
          date: '2026/09/10',
          author: 'م. فهد بن عبدالعزيز الدوسري',
          read_time: '6 دقائق',
          keywords: 'مقاول هدم بالدمام, هدم مباني بالشرقية, تراخيص الهدم أمانة الشرقية, بوكلين هدم الدمام',
          views: 142
        },
        {
          id: 'art-2',
          slug: 'selective-demolition-and-interior-wall-removal-guide',
          title: 'دليل الهدم الجزئي وتكسير الجدران بالشرقية: حماية الهيكل الخرساني القائم',
          excerpt: 'كيف تجري تعديلات معمارية وهدم جزئي للملاحق والأسوار بالدمام والخبر دون التأثير على سلامة الأعمدة والجسور الخرسانية الحاملة للمبنى.',
          content: `<h2>مفهوم الهدم الجزئي والتعديل المعماري</h2>
<p>الهدم الجزئي ينطوي على تفكيك وإزالة مقاطع محددة من العقار مثل الملاحق العلوية، الأسوار الخارجية، أو الجدران الفاصلة بغرض توسعة المساحة وتحديث المساقط المعمارية للمباني السكنية والتجارية بالدمام والخبر.</p>

<h3>خطوات حماية الأعمدة والجسور الخرسانية</h3>
<ul>
  <li>الفحص الإنشائي لتحديد الجدران الحاملة وغير الحاملة (البلوك والجبسم بورد).</li>
  <li>استخدام معدات القص الماسية والجاك هامر الخفيف لمنع اهتزاز الصبة الخرسانية.</li>
  <li>تدعيم الأعتاب والأعمدة عند فتح الفتحات الكبيرة في المبنى.</li>
</ul>

<p>تضمن مؤسسة إعمار وهدم إنجاز أعمال القص والتكسير الجزئي بسرعة متناهية ونظافة تامة للموقع بعد الإخلاء.</p>`,
          image: '/images/selective_demolition.png',
          category: 'هدم دقيق وتعديل',
          date: '2026/09/08',
          author: 'مهندس التعديلات الإنشائية',
          read_time: '5 دقائق',
          keywords: 'تكسير جدران الدمام, هدم جزئي ملحق الخبر, قواطع بلوك بالشرقية, قص خرسانة الدمام',
          views: 98
        },
        {
          id: 'art-3',
          slug: 'tile-removal-and-floor-stripping-best-practices',
          title: 'أفضل الطرق الفنية لتكسير وإزالة السيراميك وتجريد أرضيات المعارض بالدمام',
          excerpt: 'نصائح وإرشادات هندسية لتكسير بلاط الأرضيات والجدران للمطابخ والمحلات التجارية بالدمام باستخدام الهيلتيات الهوائية بدون أحداث تشققات لصبة الخرسانة.',
          content: `<h2>أهمية التجريد الصحيح قبل إعادة التشطيب</h2>
<p>عند التخطيط لتجديد حمام، مطبخ، أو معرض تجاري بالدمام، يعتبر التكسير الصحيح للبلاط القديم وقشط طبقة الخلطة الإسمنتية القديمة الركيزة الأساسية لضمان نجاح السباكة واستواء أرضيات البورسلان أو الإيبوكسي الجديدة.</p>

<h3>تقنيات التكسير والتجريد الحديثة</h3>
<ul>
  <li>تكسير السيراميك بهيلتيات هوائية زاوية دقيقة لعدم الإضرار بالصبة.</li>
  <li>قشط بقايا العوازل القديمة والغراء وتجهيز السطح أفقياً.</li>
  <li>تكييس ونقل المخلفات فوراً للحفاظ على نظافة الموقع والممرات.</li>
</ul>`,
          image: '/images/tile_removal.png',
          category: 'تشطيبات وتكسير',
          date: '2026/09/05',
          author: 'مشرف أعمال التكسيرات',
          read_time: '4 دقائق',
          keywords: 'تكسير سيراميك الدمام, إزالة بلاط بالشرقية, قشط أرضيات معارض, تجهيز أرضيات إيبوكسي',
          views: 175
        },
        {
          id: 'art-4',
          slug: 'scrap-iron-and-asphalt-contracting-in-eastern-province',
          title: 'أعمال الأسفلت وشراء سكراب المباني بالشرقية: حلول متكاملة لتجهيز المواقع',
          excerpt: 'استعراض شامل لفوائد سفلتة الساحات والمواقف بالدمام، وكيفية الاستفادة من سكراب وهياكل حديد الهدم بتقييم عادل ونقل فوري.',
          content: `<h2>التكامل الإنشائي في تجهيز المواقع بالدمام</h2>
<p>لا تقتصر خدمات المقاولات الميدانية بالشرقية على الهدم والتكسير فحسب، بل تمتد لتشمل إعادة تدوير الركام، شراء سكراب الهياكل الحديدية، ورصف وأعمال السفلتة للساحات والمواقف التجارية والحكومية.</p>

<h3>فوائد تثمين شراء السكراب</h3>
<p>تسهم عملية بيع سكراب حديد الهدم والهياكل المعدنية في تخفيض التكلفة الإجمالية لمشروع الهدم، حيث نقوم بتثمين السكراب بأسعار السوق الجارية ودفع قيمته فوراً مع التكفل بنقله بأسطول قلاباتنا.</p>

<h3>أعمال الأسفلت والسفلتة الاحترافية</h3>
<p>نوفر خدمات سفلتة الساحات ومواقف السيارات بالدمام والخبر عبر تمهيد ودك التربة، رش الطبقة اللاصقة (MC/RC)، ورصف الأسفلت الحار بدك هندسي مضمون يمنع التشققات والانخفاضات.</p>`,
          image: '/images/renovation.png',
          category: 'مقاولات عامة واسفلت',
          date: '2026/09/01',
          author: 'فريق التثمين والتجهيز الميداني',
          read_time: '5 دقائق',
          keywords: 'شراء سكراب الدمام, اعمال اسفلت بالشرقية, سفلتة مواقف السيارات, تثمين حديد الهدم',
          views: 210
        }
      ];
      await Article.insertMany(defaultArticles);
      console.log('Default articles seeded to MongoDB');
    }
  } catch (err) {
    console.error('Error seeding MongoDB defaults:', err);
  }
}

connectDb();

module.exports = {
  Setting,
  Service,
  Project,
  Request,
  Article,
  mongoose
};
