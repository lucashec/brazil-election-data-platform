export const TSE_DEFAULT_BASE_URL = 'https://resultados.tse.jus.br/oficial';

export const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre', ibgeCode: 12 },
  { code: 'AL', name: 'Alagoas', ibgeCode: 27 },
  { code: 'AM', name: 'Amazonas', ibgeCode: 13 },
  { code: 'AP', name: 'Amapá', ibgeCode: 16 },
  { code: 'BA', name: 'Bahia', ibgeCode: 29 },
  { code: 'CE', name: 'Ceará', ibgeCode: 23 },
  { code: 'DF', name: 'Distrito Federal', ibgeCode: 53 },
  { code: 'ES', name: 'Espírito Santo', ibgeCode: 32 },
  { code: 'GO', name: 'Goiás', ibgeCode: 52 },
  { code: 'MA', name: 'Maranhão', ibgeCode: 21 },
  { code: 'MG', name: 'Minas Gerais', ibgeCode: 31 },
  { code: 'MS', name: 'Mato Grosso do Sul', ibgeCode: 50 },
  { code: 'MT', name: 'Mato Grosso', ibgeCode: 51 },
  { code: 'PA', name: 'Pará', ibgeCode: 15 },
  { code: 'PB', name: 'Paraíba', ibgeCode: 25 },
  { code: 'PE', name: 'Pernambuco', ibgeCode: 26 },
  { code: 'PI', name: 'Piauí', ibgeCode: 22 },
  { code: 'PR', name: 'Paraná', ibgeCode: 41 },
  { code: 'RJ', name: 'Rio de Janeiro', ibgeCode: 33 },
  { code: 'RN', name: 'Rio Grande do Norte', ibgeCode: 24 },
  { code: 'RO', name: 'Rondônia', ibgeCode: 11 },
  { code: 'RR', name: 'Roraima', ibgeCode: 14 },
  { code: 'RS', name: 'Rio Grande do Sul', ibgeCode: 43 },
  { code: 'SC', name: 'Santa Catarina', ibgeCode: 42 },
  { code: 'SE', name: 'Sergipe', ibgeCode: 28 },
  { code: 'SP', name: 'São Paulo', ibgeCode: 35 },
  { code: 'TO', name: 'Tocantins', ibgeCode: 17 },
];

export const ELECTORAL_POSITIONS = [
  { tseCode: 1, name: 'Presidente', scope: 'federal' },
  { tseCode: 3, name: 'Governador', scope: 'state' },
  { tseCode: 5, name: 'Senador', scope: 'state' },
  { tseCode: 6, name: 'Deputado Federal', scope: 'state' },
  { tseCode: 7, name: 'Deputado Estadual', scope: 'state' },
  { tseCode: 8, name: 'Deputado Distrital', scope: 'state' },
  { tseCode: 11, name: 'Prefeito', scope: 'municipal' },
  { tseCode: 13, name: 'Vereador', scope: 'municipal' },
];

export function padPositionCode(code: number): string {
  return String(code).padStart(4, '0');
}

export function padElectionId(id: string): string {
  return id.padStart(6, '0');
}
