import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Municipality } from './municipality.entity';
import { Candidate } from './candidate.entity';
import { VotingResult } from './voting-result.entity';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 2, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', unique: true })
  ibgeCode: number;

  @OneToMany(() => Municipality, (municipality) => municipality.state)
  municipalities: Municipality[];

  @OneToMany(() => Candidate, (candidate) => candidate.state)
  candidates: Candidate[];

  @OneToMany(() => VotingResult, (result) => result.state)
  votingResults: VotingResult[];
}
