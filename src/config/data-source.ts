import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * TypeORM CLI Data Source
 * يُستخدم لتشغيل أوامر الـ migration من سطر الأوامر:
 *   npm run migration:generate -- src/migrations/InitialSchema
 *   npm run migration:run
 *   npm run migration:revert
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'wagbty',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  charset: 'utf8mb4',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
