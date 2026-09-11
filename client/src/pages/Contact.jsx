import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function Contact({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'هدم كلي للمباني والمنشآت',
    location: '',
    details: ''
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [phoneCopied, setPhoneCopied] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setAvailableServices(data.data);
          setFormData(prev => ({ ...prev, service: data.data[0].title }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitSuccess(null);
    setSubmitError('');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (result.success) {
        setSubmitSuccess(result);
        setFormData({
          name: '',
          phone: '',
          service: 'هدم كلي للمباني والمنشآت',
          location: '',
          details: ''
        });
      } else {
        setSubmitError(result.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('تعذر الاتصال بالخادم. يمكنك التواصل المباشر عبر واتساب.');
    } finally {
      setLoading(false);
    }
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText('0546735579');
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 3000);
  };

  return (
    <div className="flex flex-col w-full text-right">
      <SEOHead 
        title="اتصل بنا - هدم المباني بالدمام 0546735579"
        description="تواصل مباشرة مع فريق مؤسسة إعمار وهدم للمقاولات العامة بالدمام والمنطقة الشرقية. اتصل الآن على 0546735579 أو تراسل واتساب 0542703260 لطلب معاينة فورية مجانية للموقع."
      />
      
      {/* Top Visual Strip */}
      <section className="relative w-full bg-primary-container text-surface overflow-hidden border-b border-outline-variant/30">
        <div className="relative max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl lg:py-space-3xl flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-xs font-technical-code text-technical-code text-secondary-fixed-dim uppercase tracking-wider">
            <span className="inline-block w-2 h-2 bg-secondary rounded-none"></span>
            <span>بوابة التواصل المباشر وطلبات التقدير الميداني</span>
            <span className="text-outline-variant">/</span>
            <span dir="ltr">FIELD OPS - DAMMAM</span>
          </div>

          <h1 className="font-headline-hero text-headline-hero text-surface tracking-tight max-w-3xl font-bold">
            خلنا نبدأ... تواصل مع فريق العمل الميداني
          </h1>
          <p className="font-body-lg text-body-lg text-surface-container-high max-w-3xl leading-relaxed">
            سواء كان لديك مشروع هدم كلي، إزالة سيراميك، أو تكسير قواطع وتجهيز موقعك في الدمام ومحافظات الشرقية، نحن جاهزون للمعاينة الفورية وتقديم عرض سعر دقيق وعادل وفق المعايير البلدية والسلامة الإنشائية.
          </p>

          {/* Trust Badges Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm pt-space-md mt-space-sm border-t border-on-primary-fixed-variant/40">
            <div className="bg-tertiary-container p-space-sm rounded-DEFAULT flex items-center gap-space-xs border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary-container text-[22px]">engineering</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-surface font-bold">معاينة فنية فورية</span>
                <span className="font-label-sm text-label-sm text-on-tertiary-container">تقييم هندسي دقيق بالموقع</span>
              </div>
            </div>

            <div className="bg-tertiary-container p-space-sm rounded-DEFAULT flex items-center gap-space-xs border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary-container text-[22px]">domain_verification</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-surface font-bold">تراخيص بلدية معتمدة</span>
                <span className="font-label-sm text-label-sm text-on-tertiary-container">الدمام وكافة محافظات الشرقية</span>
              </div>
            </div>

            <div className="bg-tertiary-container p-space-sm rounded-DEFAULT flex items-center gap-space-xs border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary-container text-[22px]">local_shipping</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-surface font-bold">معدات ثقيلة وخفيفة</span>
                <span className="font-label-sm text-label-sm text-on-tertiary-container">جاهزية تشغيلية سريعة</span>
              </div>
            </div>

            <div className="bg-tertiary-container p-space-sm rounded-DEFAULT flex items-center gap-space-xs border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary-container text-[22px]">safety_check</span>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-surface font-bold">التزام تام بالسلامة</span>
                <span className="font-label-sm text-label-sm text-on-tertiary-container">اشتراطات الدفاع المدني والبلدية</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Section: Form & Direct Channels */}
      <section className="w-full max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          
          {/* Right Column: Direct Channels */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="flex flex-col gap-space-2xs">
              <span className="font-technical-code text-technical-code text-secondary font-bold uppercase tracking-wider">
                قنوات الاتصال المباشرة
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                جاهزون للرد والتنفيذ الفوري
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                تواصل مباشرة مع المشرفين الميدانيين لتحديد موعد زيارة للموقع أو استفسار عاجل عن مشاريع الهدم والإزالة.
              </p>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-surface-container p-space-lg rounded-DEFAULT flex flex-col gap-space-md shadow-sm border border-outline-variant/40">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-DEFAULT bg-tertiary-container text-secondary-fixed-dim flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">chat</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">واتساب العمليات الميدانية</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">إرسال اللوكيشن والصور مباشرة</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-space-xs py-space-2xs bg-surface-container-high rounded-full font-technical-code text-technical-code text-secondary font-bold border border-secondary/30">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  متاح الآن
                </span>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT flex items-center justify-between border border-outline-variant/30">
                <div className="flex flex-col text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">الرقم المعتمد للرسائل</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface" dir="ltr">0542703260</span>
                </div>
                <a
                  href="https://wa.me/966542703260?text=السلام%20عليكم%D8%8C%20أرغب%20في%20حجز%20معاينة%20ميدانية%20لمشروع%20هدم%20وتكسير"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-space-2xs px-space-md py-space-xs bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-DEFAULT font-label-md text-label-md font-bold transition-colors shadow-sm"
                >
                  <span>بدء محادثة</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </a>
              </div>
            </div>

            {/* Direct Phone Card */}
            <div className="bg-surface-container p-space-lg rounded-DEFAULT flex flex-col gap-space-md shadow-sm border border-outline-variant/40">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-DEFAULT bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">call</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">الاتصال الهاتفي السريع</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">للاستفسارات العاجلة وعروض الأسعار</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-space-xs py-space-2xs bg-surface-container-high rounded-full font-technical-code text-technical-code text-on-surface-variant">
                  هاتف مباشر
                </span>
              </div>

              <div className="bg-surface-container-lowest p-space-md rounded-DEFAULT flex items-center justify-between border border-outline-variant/30">
                <div className="flex flex-col text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">رقم التواصل الميداني</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface" dir="ltr">0546735579</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button
                    onClick={copyPhoneNumber}
                    title="نسخ الرقم"
                    className="inline-flex items-center justify-center p-space-xs bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded-DEFAULT transition-colors border border-outline-variant/40"
                  >
                    <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  </button>
                  <a
                    href="tel:0546735579"
                    className="inline-flex items-center gap-space-2xs px-space-md py-space-xs bg-primary text-on-primary hover:bg-on-primary-fixed-variant rounded-DEFAULT font-label-md text-label-md font-bold transition-colors"
                  >
                    <span>اتصال فوري</span>
                    <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                  </a>
                </div>
              </div>
              {phoneCopied && (
                <span className="text-secondary font-label-sm text-label-sm font-bold animate-fadeIn">
                  تم نسخ الرقم إلى الحافظة بنجاح (0546735579).
                </span>
              )}
            </div>

            {/* Headquarters Card */}
            <div className="bg-surface-container-low p-space-lg rounded-DEFAULT flex flex-col gap-space-md border border-outline-variant/40">
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[24px] mt-space-2xs">location_on</span>
                <div className="flex flex-col text-right">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">المقر الميداني والإداري</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs leading-relaxed">
                    الدمام، حي الشاطئ - المنطقة الشرقية، المملكة العربية السعودية.
                  </span>
                </div>
              </div>
              <div className="h-[1px] w-full bg-outline-variant/30"></div>
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[24px] mt-space-2xs">schedule</span>
                <div className="flex flex-col text-right">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">ساعات العمل والمتابعة</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                    السبت - الخميس: من 7:00 صباحاً حتى 6:00 مساءً
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold mt-space-2xs flex items-center gap-space-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    خدمة طوارئ الهدم والسلامة الإنشائية متاحة 24/7
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Left Column: Request Form */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest p-space-lg lg:p-space-xl rounded-DEFAULT shadow-md border border-outline-variant/40 flex flex-col gap-space-lg">
              
              <div className="flex flex-col gap-space-2xs text-right">
                <div className="flex items-center justify-between">
                  <span className="font-technical-code text-technical-code text-secondary font-bold uppercase">نموذج التقدير الهندسي</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-xs py-space-2xs rounded-DEFAULT">استجابة سريعة</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">طلب معاينة وعرض سعر فوري</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  املأ بيانات الموقع وسيصلك اتصال أو رسالة من المشرف الميداني خلال ساعتين لتحديد موعد المعاينة.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-space-lg bg-surface-container-low border border-secondary text-on-surface rounded-DEFAULT flex flex-col gap-space-md animate-fadeIn">
                  <div className="flex items-center gap-space-xs text-secondary font-bold font-headline-sm">
                    <span className="material-symbols-outlined text-[28px]">verified</span>
                    <span>تم استلام طلب المعاينة بنجاح!</span>
                  </div>
                  <div className="bg-surface p-space-md rounded-DEFAULT flex flex-col gap-space-xs border border-outline-variant/30 font-body-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant font-bold">كود الطلب المرجعي:</span>
                      <span className="font-technical-code font-bold text-secondary">{submitSuccess.data.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">اسم العميل:</span>
                      <span className="font-bold">{submitSuccess.data.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">نوع الخدمة:</span>
                      <span className="font-bold">{submitSuccess.data.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">الحي / الموقع:</span>
                      <span className="font-bold">{submitSuccess.data.location}</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    قام النظام بتسجيل طلبك فورياً في لوحة المتابعة الميدانية. سيتواصل معك فريقنا قريباً.
                  </p>
                  <div className="flex gap-space-xs">
                    <button
                      onClick={() => setSubmitSuccess(null)}
                      className="px-space-md py-space-xs bg-primary text-on-primary font-label-md font-bold rounded-DEFAULT"
                    >
                      إرسال طلب جديد
                    </button>
                    <button
                      onClick={() => onNavigate('admin-dashboard')}
                      className="px-space-md py-space-xs bg-surface-container-high text-on-surface font-label-md font-bold rounded-DEFAULT"
                    >
                      متابعة الطلب في لوحة التحكم
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-space-md text-right">
                  {submitError && (
                    <div className="p-space-sm bg-error-container text-on-error-container rounded-DEFAULT font-label-sm font-bold flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    
                    {/* Name */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-md text-label-md font-bold text-on-surface">
                        الاسم الكامل / اسم الشركة <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="مثال: م. فهد الدوسري"
                        className="w-full bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-body-sm font-semibold"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-md text-label-md font-bold text-on-surface">
                        رقم الجوال <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        dir="ltr"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="05xxxxxxxx"
                        className="w-full bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-body-sm font-semibold text-right"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    
                    {/* Service */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-md text-label-md font-bold text-on-surface">
                        نوع الخدمة المطلوب تنفيذها <span className="text-error">*</span>
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-body-sm font-semibold cursor-pointer"
                      >
                        {availableServices.length > 0 ? (
                          availableServices.map(srv => (
                            <option key={srv.id} value={srv.title}>{srv.title}</option>
                          ))
                        ) : (
                          <>
                            <option value="هدم كلي للمباني والمنشآت">هدم كلي للمباني والمنشآت</option>
                            <option value="هدم جزئي وتوسعة واجهات">هدم جزئي وتوسعة واجهات</option>
                            <option value="تكسير وإزالة السيراميك والبلاط">تكسير وإزالة السيراميك والبلاط</option>
                            <option value="تكسير قواطع وجدران بلوك">تكسير قواطع وجدران بلوك</option>
                            <option value="إزالة وتجريد أرضيات معارض">إزالة وتجريد أرضيات معارض</option>
                            <option value="ترحيل أنقاض ومخلفات هدم">ترحيل أنقاض ومخلفات هدم</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-md text-label-md font-bold text-on-surface">
                        الحي / المدينة في الشرقية <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="مثال: الدمام - حي الشاطئ"
                        className="w-full bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-body-sm font-semibold"
                      />
                    </div>

                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-space-2xs">
                    <label className="font-label-md text-label-md font-bold text-on-surface">
                      تفاصيل إضافية عن الموقع والمساحة
                    </label>
                    <textarea
                      name="details"
                      rows="4"
                      value={formData.details}
                      onChange={handleInputChange}
                      placeholder="اذكر نوع المبنى، عدد الأدوار، المساحة التقريبية، أو أي ملاحظات حول مجاورة المباني..."
                      className="w-full bg-surface-container-low border border-outline-variant/60 p-space-sm rounded-DEFAULT focus:outline-none focus:bg-surface-container-lowest focus:border-primary font-body-sm font-semibold"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-space-sm bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-lg font-bold rounded-DEFAULT transition-all shadow-md flex items-center justify-center gap-space-xs cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>جاري إرسال الطلب...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        <span>إرسال طلب المعاينة الفورية</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Coverage Section */}
      <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/30 px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-space-lg text-right">
          <div className="flex flex-col gap-space-2xs">
            <span className="font-technical-code text-technical-code text-secondary font-bold">COVERAGE MATRIX</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">مناطق التغطية الميدانية بالشرقية</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md font-label-md font-bold text-on-surface">
            <div className="p-space-md bg-surface rounded-DEFAULT border border-outline-variant/30 flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary">pin_drop</span>
              <span>مدينة الدمام (كافة الأحياء)</span>
            </div>
            <div className="p-space-md bg-surface rounded-DEFAULT border border-outline-variant/30 flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary">pin_drop</span>
              <span>محافظة الخبر والحزام الذهبي</span>
            </div>
            <div className="p-space-md bg-surface rounded-DEFAULT border border-outline-variant/30 flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary">pin_drop</span>
              <span>مدينة الظهران والمجمعات</span>
            </div>
            <div className="p-space-md bg-surface rounded-DEFAULT border border-outline-variant/30 flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary">pin_drop</span>
              <span>القطيف وسيهات والصناعيات</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
