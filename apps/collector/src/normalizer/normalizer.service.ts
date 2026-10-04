import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TsePleito,
  TseStateResults,
  TseCandidateResult,
  NormalizedCollectionResult,
  NormalizedElection,
  NormalizedParty,
  NormalizedCandidate,
  NormalizedVotingResult,
  NormalizedTotalization,
} from '@election/types';
import { CollectedResult } from '../tse/tse-collector.service';

@Injectable()
export class NormalizerService {
  private readonly logger = new Logger(NormalizerService.name);
  private readonly year: number;

  constructor(private readonly config: ConfigService) {
    this.year = this.config.get<number>('TSE_ELECTION_YEAR', 2024);
  }

  normalize(collected: CollectedResult): NormalizedCollectionResult {
    const { pleito, uf, positionCode, data } = collected;

    const election = this.normalizeElection(pleito);
    const parties = this.normalizeParties(data.cand);
    const candidates = this.normalizeCandidates(data.cand, pleito.cd, positionCode, uf);
    const votingResults = this.normalizeVotingResults(data.cand, pleito.cd, positionCode, uf);
    const totalization = this.normalizeTotalization(data, pleito.cd, positionCode, uf);

    this.logger.debug(
      `Normalized ${uf}/${positionCode}: ${candidates.length} candidates, ${parties.length} parties`,
    );

    return { election, parties, candidates, votingResults, totalization };
  }

  normalizeMany(collected: CollectedResult[]): NormalizedCollectionResult[] {
    return collected.map((c) => this.normalize(c));
  }

  private normalizeElection(pleito: TsePleito): NormalizedElection {
    return {
      tseId: pleito.cd,
      year: this.year,
      round: parseInt(pleito.t, 10) || 1,
      type: pleito.tpab,
      date: this.parseDate(pleito.dtpl || pleito.dt),
      description: `${pleito.tpab} ${this.year} - ${pleito.t}º Turno`,
    };
  }

  private normalizeParties(candidates: TseCandidateResult[]): NormalizedParty[] {
    const seen = new Map<number, NormalizedParty>();

    for (const cand of candidates) {
      const number = parseInt(cand.n, 10);
      const partyNumber = this.extractPartyNumber(number);

      if (!seen.has(partyNumber)) {
        seen.set(partyNumber, {
          number: partyNumber,
          abbreviation: cand.sgp || 'N/A',
          name: cand.nmp || cand.sgp || 'N/A',
        });
      }
    }

    return Array.from(seen.values());
  }

  private normalizeCandidates(
    candidates: TseCandidateResult[],
    electionTseId: string,
    positionTseCode: number,
    uf: string,
  ): NormalizedCandidate[] {
    return candidates.map((cand) => {
      const number = parseInt(cand.n, 10);
      return {
        electionTseId,
        positionTseCode,
        partyNumber: this.extractPartyNumber(number),
        uf,
        name: cand.nm,
        number,
        status: this.mapCandidateStatus(cand.st),
        sequentialId: cand.sqcand,
      };
    });
  }

  private normalizeVotingResults(
    candidates: TseCandidateResult[],
    electionTseId: string,
    positionTseCode: number,
    uf: string,
  ): NormalizedVotingResult[] {
    return candidates.map((cand) => {
      const number = parseInt(cand.n, 10);
      return {
        electionTseId,
        positionTseCode,
        candidateNumber: number,
        uf,
        votes: parseInt(cand.vap, 10) || 0,
        candidateName: cand.nm,
        partyAbbreviation: cand.sgp || 'N/A',
        partyNumber: this.extractPartyNumber(number),
        partyName: cand.nmp || cand.sgp || 'N/A',
        status: this.mapCandidateStatus(cand.st),
        sequentialId: cand.sqcand,
        votePercentage: cand.pvap || '0',
      };
    });
  }

  private normalizeTotalization(
    data: TseStateResults,
    electionTseId: string,
    positionTseCode: number,
    uf: string,
  ): NormalizedTotalization {
    return {
      electionTseId,
      positionTseCode,
      uf,
      scrutinizedPercentage: parseFloat(data.s.pst) || 0,
      totalScrutinized: parseInt(data.s.tot, 10) || 0,
      totalSections: data.s.tpSec || '0',
      timestamp: `${data.dg} ${data.hg}`,
    };
  }

  private extractPartyNumber(candidateNumber: number): number {
    if (candidateNumber < 100) return candidateNumber;
    return Math.floor(candidateNumber / Math.pow(10, Math.floor(Math.log10(candidateNumber)) - 1));
  }

  private parseDate(dateStr: string | undefined): string | null {
    if (!dateStr) return null;
    const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    return dateStr;
  }

  private mapCandidateStatus(tseStatus: string): string {
    const statusMap: Record<string, string> = {
      'Válido': 'valid',
      'Eleito': 'elected',
      '2º Turno': 'runoff',
      'Não Eleito': 'not_elected',
      'Suplente': 'alternate',
      '#Nulo#': 'null_vote',
      '#Branco#': 'blank_vote',
    };
    return statusMap[tseStatus] || tseStatus.toLowerCase().replace(/\s+/g, '_');
  }
}
