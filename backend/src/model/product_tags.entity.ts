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

@Entity('product_tags')
export class ProductTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  tag: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
