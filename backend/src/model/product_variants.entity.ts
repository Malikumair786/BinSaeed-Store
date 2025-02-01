import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  variant_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
