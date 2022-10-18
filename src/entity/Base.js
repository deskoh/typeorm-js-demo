import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class Base extends BaseEntity {
  @CreateDateColumn({ select: false, createDate: true })
  createdAt;

  @UpdateDateColumn({ select: false, updateDate: true })
  updatedAt;

  // Add this column to your entity!
  @DeleteDateColumn({ select: false, deleteDate: true })
  deletedAt;
}
