import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Election } from './election.entity';

export enum IngestionStatus {
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('ingestion_runs')
export class IngestionRun {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  electionId: number;

  @Column({ type: 'enum', enum: IngestionStatus, default: IngestionStatus.RUNNING })
  status: IngestionStatus;

  @Column({ type: 'int', default: 0 })
  recordsProcessed: number;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt: Date | null;

  @ManyToOne(() => Election, (election) => election.ingestionRuns)
  @JoinColumn({ name: 'electionId' })
  election: Election;
}
