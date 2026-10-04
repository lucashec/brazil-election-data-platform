export interface TseStateResults {
  ele: string;
  tpabr: string;
  cdcgo: string;
  nmcgo: string;
  t: string;
  dt: string;
  ht: string;
  dg: string;
  hg: string;
  f: string;
  s: TseTotalization;
  cand: TseCandidateResult[];
}

export interface TseTotalization {
  pst: string;
  tot: string;
  pstTot: string;
  tpSec: string;
}

export interface TseCandidateResult {
  seq: string;
  sqcand: string;
  nm: string;
  nv: string;
  e: string;
  st: string;
  dvt: string;
  vap: string;
  pvap: string;
  n: string;
  sgp: string;
  nmp: string;
}

export interface TseMunicipalityConfig {
  cd: string;
  nm: string;
  cdi: string;
}

export interface TseMunicipalityListResponse {
  dg: string;
  hg: string;
  mu: TseMunicipalityConfig[];
}
