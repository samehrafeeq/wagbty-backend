import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Restaurant } from '../entities/restaurant.entity';

dotenv.config();

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@wagbty.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

/**
 * Seed script — يُنشئ حساب الأدمن إن لم يكن موجوداً بالفعل
 * يعمل تلقائياً عند تشغيل التطبيق أو يمكن تشغيله يدوياً:
 *   npx ts-node -r tsconfig-paths/register src/seed/seed.ts
 */
async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'wagbty',
    entities: [User, Restaurant],
    synchronize: false,
    charset: 'utf8mb4',
  });

  await dataSource.initialize();
  console.log('🌱 Seed: متصل بقاعدة البيانات');

  const userRepo = dataSource.getRepository(User);

  // التحقق من وجود حساب الأدمن
  const existingAdmin = await userRepo.findOne({
    where: { email: ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log(`✅ Seed: حساب الأدمن موجود بالفعل (${ADMIN_EMAIL}) — لم يتم إنشاء حساب جديد`);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = userRepo.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    } as any);

    await userRepo.save(admin);
    console.log(`🎉 Seed: تم إنشاء حساب الأدمن بنجاح (${ADMIN_EMAIL})`);
  }

  await dataSource.destroy();
}

// يمكن تشغيله مباشرة أو استيراده
seed().catch((err) => {
  console.error('❌ Seed: فشل التشغيل', err);
  process.exit(1);
});

export { seed };
