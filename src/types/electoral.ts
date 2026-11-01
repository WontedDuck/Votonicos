export type AgeRange = '18-19' | '20-24' | '25-29';
export type Sex = 'Hombre' | 'Mujer';
export type AgeFilterOption = 'Todos' | AgeRange;
export type SexFilterOption = 'Todos' | Sex | 'No especificado';

export type ElectionYear = 2009 | 2012 | 2015 | 2018 | 2021 | 2024;

export interface ElectoralRecord {
  /** Año de elección. El CCPC contempla procesos entre 2009 y 2024. */
  AELEC: ElectionYear;
  MPIONOM: string;
  EDAD: AgeFilterOption;
  SEXO: SexFilterOption;
  LN: number;
  NV: number;
  SV: number;
  tasaAbstencion: number;
  tasaParticipacion: number;
  esEstimado: boolean;
}

export interface ElectoralFilters {
  alcaldia: string;
  rangoEdad: AgeFilterOption;
  sexo: SexFilterOption;
}

export interface ElectoralFilterOptions {
  alcaldias: string[];
  rangosEdad: AgeFilterOption[];
  sexos: SexFilterOption[];
}

export interface HistoricalMetric {
  AELEC: ElectionYear;
  LN: number;
  NV: number;
  SV: number;
  tasaAbstencion: number;
  tasaParticipacion: number;
}

export interface CriticalSectionRecord {
  MPIONOM: string;
  SECCION: number;
  TIPOSEC_TXT: string;
  LN: number;
  SV: number;
  NV: number;
  tasaAbstencion: number;
  tasaParticipacion: number;
  PRIORIDAD: string;
}

export interface WhatIfParams {
  alcaldia: string;
  rangoEdad: AgeFilterOption;
  sexo: SexFilterOption;
  porcentajeMovilizacion: number;
}

export interface WhatIfResult {
  votosAdicionales: number;
  nuevaTasaParticipacion: number;
  comparativaHistorica: HistoricalMetric[];
  tasaParticipacionActual: number;
  listaNominal: number;
  proporcionJovenActual: number;
  nuevaProporcionJoven: number;
}
