import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { State } from './state.entity';
import { VotingResult } from './voting-result.entity';

@Entity('municipalities')
export class Municipality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'int' })
  @Index()
  stateId: number;

  @Column({ type: 'int', unique: true })
  tseCode: number;

  @Column({ type: 'int', unique: true })
  ibgeCode: number;

  @ManyToOne(() => State, (state) => state.municipalities)
  @JoinColumn({ name: 'stateId' })
  state: State;

  @OneToMany(() => VotingResult, (result) => result.municipality)
  votingResults: VotingResult[];
}
