import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config(); // Load .env file if it exists
export const getDataSourceOptions = (): DataSourceOptions => {
  const configService = new ConfigService();
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: 3306,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'binsaeed-store',
    entities: ['dist/**/*.entity.js'], // Add your entity classes here
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
    migrationsRun: true,
    timezone: 'Z',
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
};

const dataSource = new DataSource(getDataSourceOptions());
export default dataSource;
