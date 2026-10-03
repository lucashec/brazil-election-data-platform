import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity('parties')
export class Party {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint', unique: true })
  number: number;

  @Column({ type: 'varchar', length: 20 })
  abbreviation: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @OneToMany(() => Candidate, (candidate) => candidate.party)
  candidates: Candidate[];
}
