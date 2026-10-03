import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Candidate } from './candidate.entity';
import { VotingResult } from './voting-result.entity';
import { IngestionRun } from './ingestion-run.entity';

@Entity('elections')
export class Election {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint' })
  year: number;

  @Column({ type: 'smallint' })
  round: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'date', nullable: true })
  date: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 20, unique: true })
  tseId: string;

  @OneToMany(() => Candidate, (candidate) => candidate.election)
  candidates: Candidate[];

  @OneToMany(() => VotingResult, (result) => result.election)
  votingResults: VotingResult[];

  @OneToMany(() => IngestionRun, (run) => run.election)
  ingestionRuns: IngestionRun[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
