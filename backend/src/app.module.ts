import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSourceOptions } from 'db/data-source';
import { UserModule } from './module/user.module';
import { LinkModule } from './module/link.module';
import { MailerModule } from './module/mailer.module';
import { AuthModule } from './module/auth.module';
import { CategoryModule } from './module/category.module';
import { ProductModule } from './module/product.module';
import { VariantModule } from './module/variant.module';
import { ImageModule } from './module/image.module';
import { TagModule } from './module/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigModule globally available
    }),
    TypeOrmModule.forRoot(getDataSourceOptions()),
    AuthModule,
    UserModule,
    LinkModule,
    MailerModule,
    CategoryModule,
    ProductModule,
    VariantModule,
    ImageModule,
    TagModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
