import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Country, Governorate, City } from '../entities/location.entity';

dotenv.config();

// Arab countries (only Egypt active)
const arabCountries = [
  { name: 'مصر', code: 'EG', isActive: true, sortOrder: 1 },
  { name: 'السعودية', code: 'SA', isActive: false, sortOrder: 2 },
  { name: 'الإمارات', code: 'AE', isActive: false, sortOrder: 3 },
  { name: 'الكويت', code: 'KW', isActive: false, sortOrder: 4 },
  { name: 'قطر', code: 'QA', isActive: false, sortOrder: 5 },
  { name: 'البحرين', code: 'BH', isActive: false, sortOrder: 6 },
  { name: 'عُمان', code: 'OM', isActive: false, sortOrder: 7 },
  { name: 'العراق', code: 'IQ', isActive: false, sortOrder: 8 },
  { name: 'الأردن', code: 'JO', isActive: false, sortOrder: 9 },
  { name: 'لبنان', code: 'LB', isActive: false, sortOrder: 10 },
  { name: 'فلسطين', code: 'PS', isActive: false, sortOrder: 11 },
  { name: 'سوريا', code: 'SY', isActive: false, sortOrder: 12 },
  { name: 'اليمن', code: 'YE', isActive: false, sortOrder: 13 },
  { name: 'ليبيا', code: 'LY', isActive: false, sortOrder: 14 },
  { name: 'تونس', code: 'TN', isActive: false, sortOrder: 15 },
  { name: 'الجزائر', code: 'DZ', isActive: false, sortOrder: 16 },
  { name: 'المغرب', code: 'MA', isActive: false, sortOrder: 17 },
  { name: 'السودان', code: 'SD', isActive: false, sortOrder: 18 },
  { name: 'الصومال', code: 'SO', isActive: false, sortOrder: 19 },
  { name: 'موريتانيا', code: 'MR', isActive: false, sortOrder: 20 },
  { name: 'جيبوتي', code: 'DJ', isActive: false, sortOrder: 21 },
  { name: 'جزر القمر', code: 'KM', isActive: false, sortOrder: 22 },
];

// Egypt's 27 governorates with their cities
const egyptData: Record<string, string[]> = {
  'القاهرة': [
    'مدينة نصر', 'المعادي', 'حلوان', 'التجمع الخامس', 'مصر الجديدة',
    'الزمالك', 'وسط البلد', 'شبرا', 'عين شمس', 'المطرية',
    'المرج', 'السلام', 'النزهة', 'الزيتون', 'حدائق القبة',
    'باب الشعرية', 'الأزبكية', 'عابدين', 'السيدة زينب', 'مصر القديمة',
    'المنيل', 'البساتين', 'دار السلام', 'التبين', 'الخليفة',
    'المقطم', 'منشأة ناصر', '15 مايو', 'الشروق', 'بدر',
    'العبور', 'الرحاب',
  ],
  'الجيزة': [
    'الدقي', 'العجوزة', 'المهندسين', 'فيصل', 'الهرم',
    'إمبابة', 'بولاق الدكرور', '6 أكتوبر', 'الشيخ زايد', 'حدائق الأهرام',
    'أبو النمرس', 'البدرشين', 'الصف', 'أطفيح', 'العياط',
    'الواحات البحرية', 'منشأة القناطر', 'أوسيم', 'كرداسة', 'حدائق أكتوبر',
  ],
  'الإسكندرية': [
    'المنتزه', 'شرق', 'وسط', 'غرب', 'العجمي',
    'العامرية', 'الجمرك', 'المنشية', 'كرموز', 'اللبان',
    'المندرة', 'سيدي بشر', 'سموحة', 'محرم بك', 'سيدي جابر',
    'لوران', 'كليوباترا', 'ستانلي', 'بحري', 'برج العرب',
  ],
  'القليوبية': [
    'بنها', 'شبرا الخيمة', 'قليوب', 'الخانكة', 'كفر شكر',
    'طوخ', 'القناطر الخيرية', 'شبين القناطر', 'العبور',
  ],
  'الشرقية': [
    'الزقازيق', 'العاشر من رمضان', 'منيا القمح', 'بلبيس', 'أبو حماد',
    'أبو كبير', 'فاقوس', 'الحسينية', 'ههيا', 'ديرب نجم',
    'الإبراهيمية', 'مشتول السوق', 'القرين', 'أولاد صقر', 'كفر صقر',
    'صان الحجر',
  ],
  'الدقهلية': [
    'المنصورة', 'طلخا', 'ميت غمر', 'دكرنس', 'أجا',
    'السنبلاوين', 'المنزلة', 'تمي الأمديد', 'الجمالية', 'شربين',
    'بلقاس', 'منية النصر', 'المطرية', 'بني عبيد', 'نبروه',
    'محلة دمنة',
  ],
  'الغربية': [
    'طنطا', 'المحلة الكبرى', 'كفر الزيات', 'زفتى', 'السنطة',
    'سمنود', 'قطور', 'بسيون',
  ],
  'المنوفية': [
    'شبين الكوم', 'مدينة السادات', 'منوف', 'أشمون', 'الباجور',
    'قويسنا', 'بركة السبع', 'تلا', 'الشهداء',
  ],
  'كفر الشيخ': [
    'كفر الشيخ', 'دسوق', 'فوه', 'سيدي سالم', 'بيلا',
    'مطوبس', 'الحامول', 'قلين', 'البرلس', 'الرياض',
  ],
  'البحيرة': [
    'دمنهور', 'كفر الدوار', 'رشيد', 'إدكو', 'أبو المطامير',
    'أبو حمص', 'الدلنجات', 'المحمودية', 'الرحمانية', 'إيتاي البارود',
    'حوش عيسى', 'شبراخيت', 'كوم حمادة', 'بدر', 'وادي النطرون',
  ],
  'الإسماعيلية': [
    'الإسماعيلية', 'فايد', 'القنطرة شرق', 'القنطرة غرب', 'التل الكبير',
    'أبو صوير', 'القصاصين',
  ],
  'بورسعيد': [
    'بورسعيد', 'بورفؤاد', 'العرب', 'حي الزهور', 'حي الشرق',
    'حي المناخ', 'حي الجنوب',
  ],
  'السويس': [
    'السويس', 'الأربعين', 'عتاقة', 'حي الجناين', 'فيصل',
  ],
  'دمياط': [
    'دمياط', 'دمياط الجديدة', 'رأس البر', 'فارسكور', 'كفر سعد',
    'الزرقا', 'السرو', 'كفر البطيخ',
  ],
  'الفيوم': [
    'الفيوم', 'الفيوم الجديدة', 'إبشواي', 'طامية', 'سنورس',
    'إطسا', 'يوسف الصديق',
  ],
  'بني سويف': [
    'بني سويف', 'بني سويف الجديدة', 'الواسطى', 'ناصر', 'إهناسيا',
    'ببا', 'الفشن', 'سمسطا',
  ],
  'المنيا': [
    'المنيا', 'المنيا الجديدة', 'ملوي', 'سمالوط', 'أبو قرقاص',
    'مطاي', 'بني مزار', 'مغاغة', 'العدوة', 'دير مواس',
  ],
  'أسيوط': [
    'أسيوط', 'أسيوط الجديدة', 'ديروط', 'القوصية', 'منفلوط',
    'أبنوب', 'الفتح', 'الغنايم', 'ساحل سليم', 'أبو تيج',
    'البداري',
  ],
  'سوهاج': [
    'سوهاج', 'سوهاج الجديدة', 'أخميم', 'طهطا', 'جرجا',
    'المراغة', 'البلينا', 'ساقلتة', 'طما', 'جهينة',
    'المنشأة', 'دار السلام',
  ],
  'قنا': [
    'قنا', 'قنا الجديدة', 'نجع حمادي', 'أبو تشت', 'فرشوط',
    'نقادة', 'دشنا', 'الوقف', 'قوص', 'قفط',
  ],
  'الأقصر': [
    'الأقصر', 'الأقصر الجديدة', 'إسنا', 'أرمنت', 'الطود',
    'البياضية', 'القرنة', 'الزينية',
  ],
  'أسوان': [
    'أسوان', 'أسوان الجديدة', 'إدفو', 'كوم أمبو', 'نصر النوبة',
    'دراو', 'أبو سمبل',
  ],
  'البحر الأحمر': [
    'الغردقة', 'سفاجا', 'مرسى علم', 'القصير', 'رأس غارب',
    'الشلاتين', 'حلايب',
  ],
  'الوادي الجديد': [
    'الخارجة', 'الداخلة', 'الفرافرة', 'باريس', 'بلاط',
  ],
  'مطروح': [
    'مرسى مطروح', 'الحمام', 'العلمين', 'الضبعة', 'سيدي براني',
    'السلوم', 'سيوة',
  ],
  'شمال سيناء': [
    'العريش', 'الشيخ زويد', 'رفح', 'بئر العبد', 'الحسنة',
    'نخل',
  ],
  'جنوب سيناء': [
    'شرم الشيخ', 'دهب', 'نويبع', 'طابا', 'سانت كاترين',
    'الطور', 'أبو رديس', 'أبو زنيمة', 'رأس سدر',
  ],
};

/**
 * Seed locations using an existing DataSource (called from main.ts)
 */
export async function seedLocationsFromApp(ds: DataSource): Promise<void> {
  const countryRepo = ds.getRepository(Country);
  const govRepo = ds.getRepository(Governorate);
  const cityRepo = ds.getRepository(City);

  const existingCountries = await countryRepo.count();
  if (existingCountries > 0) {
    console.log('✅ Seed: بيانات المواقع موجودة بالفعل');
    return;
  }

  console.log('🌍 Seed: جارٍ إضافة الدول العربية...');
  const savedCountries: Record<string, Country> = {};
  for (const c of arabCountries) {
    const country = countryRepo.create(c);
    const saved = await countryRepo.save(country);
    savedCountries[c.name] = saved;
  }

  const egypt = savedCountries['مصر'];
  if (!egypt) {
    console.error('❌ Seed: لم يتم العثور على مصر');
    return;
  }

  console.log('🏛️ Seed: جارٍ إضافة محافظات ومدن مصر...');
  let govOrder = 0;
  for (const [govName, cities] of Object.entries(egyptData)) {
    govOrder++;
    const gov = govRepo.create({
      name: govName,
      countryId: egypt.id,
      isActive: true,
      sortOrder: govOrder,
    } as any);
    const savedGov = await govRepo.save(gov) as any;

    let cityOrder = 0;
    for (const cityName of cities) {
      cityOrder++;
      const city = cityRepo.create({
        name: cityName,
        governorateId: savedGov.id,
        isActive: true,
        sortOrder: cityOrder,
      } as any);
      await cityRepo.save(city);
    }
  }

  const totalGovs = Object.keys(egyptData).length;
  const totalCities = Object.values(egyptData).reduce((sum, c) => sum + c.length, 0);
  console.log(`🎉 Seed: تم إضافة ${arabCountries.length} دولة + ${totalGovs} محافظة + ${totalCities} مدينة`);
}

/**
 * Standalone runner — `npm run seed:locations`
 */
async function main() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'wagbty',
    entities: [Country, Governorate, City],
    charset: 'utf8mb4',
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');
    await seedLocationsFromApp(dataSource);
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
}

// Run standalone only when executed directly
const isDirectRun = require.main === module || process.argv[1]?.includes('seed-locations');
if (isDirectRun) {
  main();
}
