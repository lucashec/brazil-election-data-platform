import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Election, Party, Candidate, Position, State } from '@election/shared';
import { ResultCollectedPayload } from '@election/types';

@Injectable()
export class ResultProcessorService {
  private readonly logger = new Logger(ResultProcessorService.name);

  constructor(
    @InjectRepository(Election)
    private readonly electionRepo: Repository<Election>,
    @InjectRepository(Party)
    private readonly partyRepo: Repository<Party>,
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
    @InjectRepository(Position)
    private readonly positionRepo: Repository<Position>,
    @InjectRepository(State)
    private readonly stateRepo: Repository<State>,
  ) {}

  async process(payload: ResultCollectedPayload): Promise<void> {
    const { data } = payload;

    const election = await this.upsertElection(data.election);
    const position = await this.positionRepo.findOneBy({ tseCode: data.totalization.positionTseCode });

    if (!position) {
      this.logger.warn(`Position not found for tseCode=${data.totalization.positionTseCode}`);
      return;
    }

    const partyMap = await this.upsertParties(data.parties);
    await this.upsertCandidates(data.candidates, election, position, partyMap);

    this.logger.log(
      `Processed: election=${election.tseId} position=${position.name} uf=${data.totalization.uf} candidates=${data.candidates.length}`,
    );
  }

  private async upsertElection(normalized: ResultCollectedPayload['data']['election']): Promise<Election> {
    let election = await this.electionRepo.findOneBy({ tseId: normalized.tseId });

    if (!election) {
      election = this.electionRepo.create({
        tseId: normalized.tseId,
        year: normalized.year,
        round: normalized.round,
        type: normalized.type,
        date: normalized.date,
        description: normalized.description,
      });
      election = await this.electionRepo.save(election);
      this.logger.log(`Created election: ${election.tseId}`);
    }

    return election;
  }

  private async upsertParties(
    normalized: ResultCollectedPayload['data']['parties'],
  ): Promise<Map<number, Party>> {
    const partyMap = new Map<number, Party>();

    for (const p of normalized) {
      let party = await this.partyRepo.findOneBy({ number: p.number });

      if (!party) {
        party = this.partyRepo.create({
          number: p.number,
          abbreviation: p.abbreviation,
          name: p.name,
        });
        party = await this.partyRepo.save(party);
      }

      partyMap.set(p.number, party);
    }

    return partyMap;
  }

  private async upsertCandidates(
    normalized: ResultCollectedPayload['data']['candidates'],
    election: Election,
    position: Position,
    partyMap: Map<number, Party>,
  ): Promise<void> {
    for (const c of normalized) {
      const party = partyMap.get(c.partyNumber);
      if (!party) continue;

      let state: State | null = null;
      if (c.uf) {
        state = await this.stateRepo.findOneBy({ code: c.uf });
      }

      const existing = await this.candidateRepo.findOneBy({
        electionId: election.id,
        number: c.number,
      });

      if (!existing) {
        const candidate = this.candidateRepo.create({
          electionId: election.id,
          positionId: position.id,
          partyId: party.id,
          stateId: state?.id ?? null,
          name: c.name,
          number: c.number,
          status: c.status,
        });
        await this.candidateRepo.save(candidate);
      } else if (existing.status !== c.status) {
        existing.status = c.status;
        await this.candidateRepo.save(existing);
      }
    }
  }
}
