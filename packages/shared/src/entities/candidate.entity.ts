import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { Election } from './election.entity';
import { Position } from './position.entity';
import { Party } from './party.entity';
import { State } from './state.entity';
import { VotingResult } from './voting-result.entity';

@Entity('candidates')
@Index(['electionId', 'number'], { unique: true })
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  electionId: number;

  @Column({ type: 'int' })
  positionId: number;

  @Column({ type: 'int' })
  partyId: number;

  @Column({ type: 'int', nullable: true })
  stateId: number | null;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  photoUrl: string | null;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @ManyToOne(() => Election, (election) => election.candidates)
  @JoinColumn({ name: 'electionId' })
  election: Election;

  @ManyToOne(() => Position, (position) => position.candidates)
  @JoinColumn({ name: 'positionId' })
  position: Position;

  @ManyToOne(() => Party, (party) => party.candidates)
  @JoinColumn({ name: 'partyId' })
  party: Party;

  @ManyToOne(() => State, (state) => state.candidates, { nullable: true })
  @JoinColumn({ name: 'stateId' })
  state: State | null;

  @OneToMany(() => VotingResult, (result) => result.candidate)
  votingResults: VotingResult[];
}
