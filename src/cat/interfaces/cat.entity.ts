import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false, length: 255 })
  name: string;

  @Column()
  breed: string;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
