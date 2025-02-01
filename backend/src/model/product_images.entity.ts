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

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  image_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
