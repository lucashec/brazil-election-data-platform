import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Candidate } from './candidate.entity';
import { VotingResult } from './voting-result.entity';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  tseCode: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  scope: string;

  @OneToMany(() => Candidate, (candidate) => candidate.position)
  candidates: Candidate[];

  @OneToMany(() => VotingResult, (result) => result.position)
  votingResults: VotingResult[];
}
