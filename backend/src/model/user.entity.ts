import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserType } from 'src/common/user-type.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { LoggedInWith } from 'src/common/logged-in-with.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @IsNotEmpty()
  username: string;

  @Column({ nullable: true })
  @IsOptional()
  phoneNo?: string;

  @Column({ nullable: true })
  @IsOptional()
  address?: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  @IsOptional()
  password?: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.USER,
  })
  role: UserType;

  @Column({
    type: 'enum',
    enum: LoggedInWith,
    default: LoggedInWith.EMAIL,
    nullable: true,
  })
  loggedInWith?: LoggedInWith;

  @Column({ nullable: true })
  apiKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
