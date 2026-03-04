import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  countryId: string;

  @Column({ nullable: true })
  governorateId: string;

  @Column({ nullable: true })
  cityId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
