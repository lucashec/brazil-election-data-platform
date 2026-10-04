export interface NormalizedElection {
  tseId: string;
  year: number;
  round: number;
  type: string;
  date: string | null;
  description: string | null;
}

export interface NormalizedParty {
  number: number;
  abbreviation: string;
  name: string;
}

export interface NormalizedCandidate {
  electionTseId: string;
  positionTseCode: number;
  partyNumber: number;
  uf: string | null;
  name: string;
  number: number;
  status: string;
  sequentialId: string;
}

export interface NormalizedVotingResult {
  electionTseId: string;
  positionTseCode: number;
  candidateNumber: number;
  uf: string;
  votes: number;
  candidateName: string;
  partyAbbreviation: string;
  partyNumber: number;
  partyName: string;
  status: string;
  sequentialId: string;
  votePercentage: string;
}

export interface NormalizedTotalization {
  electionTseId: string;
  positionTseCode: number;
  uf: string;
  scrutinizedPercentage: number;
  totalScrutinized: number;
  totalSections: string;
  timestamp: string;
}

export interface NormalizedCollectionResult {
  election: NormalizedElection;
  parties: NormalizedParty[];
  candidates: NormalizedCandidate[];
  votingResults: NormalizedVotingResult[];
  totalization: NormalizedTotalization;
}
