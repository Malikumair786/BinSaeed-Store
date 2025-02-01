import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantService } from 'src/service/variant.service';
import { ProductVariant } from 'src/model/product_Variants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
