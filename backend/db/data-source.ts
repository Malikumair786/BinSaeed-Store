import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config(); // Load .env file if it exists
export const getDataSourceOptions = () : DataSourceOptions => {
    const configService = new ConfigService();
    return{
      type: 'mysql',
      host: configService.get<string>('DATABASE_HOST') || 'localhost',
      port: configService.get<number>('DATABASE_PORT') || 3306,
      username: configService.get<string>('DATABASE_USER') || 'root',
      password: configService.get<string>('DATABASE_PASSWORD') || 'root',
      database: configService.get<string>('DATABASE_NAME') || 'ecommerce-store',
      entities: ['dist/**/*.entity.js'],  // Add your entity classes here
      migrations: ['dist/db/migrations/*.js'],
      synchronize: false,
      migrationsRun: true, // Automatically runs pending migrations on application startup
};
};

const dataSource = new DataSource(getDataSourceOptions());
export default dataSource;
