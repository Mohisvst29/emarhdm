import React, { useState } from 'react';

export default function CostCalculator({ onSelectService }) {
  const [serviceType, setServiceType] = useState('total');
  const [area, setArea] = useState(250);
  const [buildingType, setBuildingType] = useState('residential');
  const [includeDebris, setIncludeDebris] = useState(true);

  // Base rates per m² in SAR
  const rates = {
    total: { base: 45, label: 'هدم كلي للمباني والمنشآت' },
    selective: { base: 35, label: 'هدم جزئي وتوسعة واجهات' },
    tiles: { base: 18, label: 'تكسير وإزالة السيراميك والبلاط' },
    partitions: { base: 22, label: 'تكسير قواطع وجدران بلوك' },
    flooring: { base: 25, label: 'تجريد أرضيات المعارض' },
    debris: { base: 15, label: 'ترحيل أنقاض ومخلفات' }
  };

  const buildingMultipliers = {
    residential: 1.0, // سكني (فيلا / عمارة)
    commercial: 1.15, // تجاري (معرض / مكتب)
    industrial: 1.25, // مستودع / مصنع
  };

  const selectedRate = rates[serviceType] || rates.total;
  const multiplier = buildingMultipliers[buildingType] || 1.0;
  const debrisCost = includeDebris ? area * 10 : 0;

  const estimatedMin = Math.round((area * selectedRate.base * multiplier + debrisCost) * 0.9);
  const estimatedMax = Math.round((area * selectedRate.base * multiplier + debrisCost) * 1.15);

  const getWhatsAppMessage = () => {
    const text = `السلام عليكم، أرغب في استفسار عن تسعير مشروع:
- نوع الخدمة: ${selectedRate.label}
- المساحة التقديرية: ${area} م²
- نوع المبنى: ${buildingType === 'residential' ? 'سكني' : buildingType === 'commercial' ? 'تجاري' : 'صناعي'}
- التقدير المبدئي: ${estimatedMin.toLocaleString('ar-SA')} - ${estimatedMax.toLocaleString('ar-SA')} ريال
- يتضمن ترحيل الأنقاض: ${includeDebris ? 'نعم' : 'لا'}`;
    return encodeURIComponent(text);
  };

  return (
    <div className="bg-surface-container-low p-space-lg lg:p-space-xl rounded-DEFAULT border border-outline-variant/40 shadow-sm text-right">
      <div className="flex flex-col gap-space-2xs mb-space-lg">
        <div className="inline-flex items-center gap-space-xs text-secondary font-technical-code text-technical-code font-bold">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span>حاسبة التقدير المالي المباشرة</span>
        </div>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
          احسب التكلفة التقديرية لمشروعك
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          حدد مواصفات الموقع للحصول على نطاق سعري تقريبي استرشادي مع إمكانية المعاينة المجانية بالموقع.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        
        {/* Service Type Selection */}
        <div className="flex flex-col gap-space-2xs">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            1. نوع الخدمة الميدانية المطلوب تنفيذها:
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/60 p-space-sm rounded-DEFAULT focus:outline-none focus:border-primary font-body-sm font-semibold"
          >
            <option value="total">هدم كلي للمباني والفلل والمستودعات</option>
            <option value="selective">هدم جزئي وتوسعة واجهات مبنى</option>
            <option value="tiles">تكسير وإزالة السيراميك والبلاط</option>
            <option value="partitions">تكسير قواطع وجدران بلوك داخلية</option>
            <option value="flooring">إزالة وتجريد أرضيات معارض ومحلات</option>
            <option value="debris">تحميل وترحيل أنقاض ومخلفات هدم</option>
          </select>
        </div>

        {/* Building Type */}
        <div className="flex flex-col gap-space-2xs">
          <label className="font-label-md text-label-md font-bold text-on-surface">
            2. تصنيف المبنى أو العقار:
          </label>
          <select
            value={buildingType}
            onChange={(e) => setBuildingType(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant/60 p-space-sm rounded-DEFAULT focus:outline-none focus:border-primary font-body-sm font-semibold"
          >
            <option value="residential">سكني (فيلا / عمارة / ملحق)</option>
            <option value="commercial">تجاري (معرض / مكاتب / معرض)</option>
            <option value="industrial">صناعي (مستودع / منشأة / هنجر)</option>
          </select>
        </div>

        {/* Area Input Slider */}
        <div className="md:col-span-2 flex flex-col gap-space-xs bg-surface-container-lowest p-space-md rounded-DEFAULT border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md font-bold text-on-surface">
              3. المساحة التقديرية بالمتر المربع (م²):
            </label>
            <span className="font-technical-code text-headline-sm font-bold text-secondary">
              {area} م²
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="3000"
            step="10"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full accent-secondary h-2 bg-surface-container rounded-lg cursor-pointer"
          />
          <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>20 م²</span>
            <span>1,000 م²</span>
            <span>3,000 م²</span>
          </div>
        </div>

        {/* Checkbox Debris */}
        <div className="md:col-span-2 flex items-center gap-space-xs p-space-xs">
          <input
            type="checkbox"
            id="debris-check"
            checked={includeDebris}
            onChange={(e) => setIncludeDebris(e.target.checked)}
            className="w-4 h-4 accent-secondary cursor-pointer"
          />
          <label htmlFor="debris-check" className="font-body-sm text-body-sm text-on-surface cursor-pointer font-semibold">
            تضمين شحن وترحيل الأنقاض بالكامل إلى المرامي البلدية المعتمدة
          </label>
        </div>

      </div>

      {/* Result Card */}
      <div className="mt-space-lg p-space-lg bg-primary-container text-surface rounded-DEFAULT shadow-md flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex flex-col text-right">
          <span className="font-label-sm text-label-sm text-secondary-fixed-dim font-bold">
            التكلفة التقديرية التقريبية للمشروع:
          </span>
          <div className="font-headline-lg text-headline-lg font-bold text-surface mt-space-2xs">
            {estimatedMin.toLocaleString('ar-SA')} - {estimatedMax.toLocaleString('ar-SA')} <span className="text-secondary-fixed-dim text-headline-sm">ر.س</span>
          </div>
          <span className="font-body-sm text-body-sm text-on-primary-container mt-space-2xs">
            * التقدير النهائي يتم بعد المعاينة الميدانية المجانية للموقع بالدمام.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-space-xs w-full md:w-auto">
          <a
            href={`https://wa.me/966542703260?text=${getWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm bg-secondary text-on-secondary hover:bg-on-secondary-container rounded-DEFAULT font-label-md text-label-md font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>اطلب معاينة بهذا التقدير</span>
          </a>
        </div>
      </div>
    </div>
  );
}
