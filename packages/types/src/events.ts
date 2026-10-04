import { NormalizedCollectionResult } from './normalized';

export const ELECTION_EVENTS = {
  RESULT_COLLECTED: 'election.result.collected',
  INGESTION_COMPLETED: 'election.ingestion.completed',
} as const;

export interface ResultCollectedPayload {
  collectedAt: string;
  electionTseId: string;
  positionTseCode: number;
  uf: string;
  data: NormalizedCollectionResult;
}

export interface IngestionCompletedPayload {
  completedAt: string;
  electionYear: number;
  totalResultSets: number;
  totalCandidates: number;
}
