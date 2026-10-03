import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn } from 'typeorm';
import { Election } from './election.entity';
import { Position } from './position.entity';
import { Candidate } from './candidate.entity';
import { State } from './state.entity';
import { Municipality } from './municipality.entity';

@Entity('voting_results')
@Index(['electionId', 'positionId', 'candidateId', 'municipalityId'], { unique: true })
export class VotingResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  electionId: number;

  @Column({ type: 'int' })
  positionId: number;

  @Column({ type: 'int' })
  candidateId: number;

  @Column({ type: 'int' })
  stateId: number;

  @Column({ type: 'int' })
  municipalityId: number;

  @Column({ type: 'int', default: 0 })
  votes: number;

  @Column({ type: 'int', default: 0 })
  sectionsScrutinized: number;

  @Column({ type: 'int', default: 0 })
  totalSections: number;

  @ManyToOne(() => Election, (election) => election.votingResults)
  @JoinColumn({ name: 'electionId' })
  election: Election;

  @ManyToOne(() => Position, (position) => position.votingResults)
  @JoinColumn({ name: 'positionId' })
  position: Position;

  @ManyToOne(() => Candidate, (candidate) => candidate.votingResults)
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate;

  @ManyToOne(() => State, (state) => state.votingResults)
  @JoinColumn({ name: 'stateId' })
  state: State;

  @ManyToOne(() => Municipality, (municipality) => municipality.votingResults)
  @JoinColumn({ name: 'municipalityId' })
  municipality: Municipality;

  @CreateDateColumn()
  createdAt: Date;
}
