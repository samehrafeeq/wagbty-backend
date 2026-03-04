import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as mysql from 'mysql2/promise';
import { AppModule } from './app.module';
import { User } from './entities/user.entity';
import { seedLocationsFromApp } from './seed/seed-locations';

async function ensureDatabase() {
  const dbName = process.env.DB_DATABASE || 'wagbty';
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();
  console.log(`✅ Database: قاعدة البيانات "${dbName}" جاهزة`);
}

async function bootstrap() {
  await ensureDatabase();

  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes: /api
  app.setGlobalPrefix('api');

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // === Admin Seed ===
  try {
    const dataSource = app.get(DataSource);
    const userRepo = dataSource.getRepository(User);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wagbty.com';
    const existing = await userRepo.findOne({ where: { email: adminEmail } });

    if (!existing) {
      const admin = userRepo.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: adminEmail,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10),
        role: 'admin',
      } as any);
      await userRepo.save(admin);
      console.log(`🎉 Seed: تم إنشاء حساب الأدمن (${adminEmail})`);
    } else {
      console.log(`✅ Seed: حساب الأدمن موجود بالفعل (${adminEmail})`);
    }
  } catch (err) {
    console.error('⚠️ Seed: فشل إنشاء الأدمن', err);
  }

  // === Locations Seed ===
  try {
    const dataSource = app.get(DataSource);
    await seedLocationsFromApp(dataSource);
  } catch (err) {
    console.error('⚠️ Seed: فشل إضافة بيانات المواقع', err);
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api`);
}
bootstrap();
