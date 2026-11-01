import municipalityRows2009 from '@/src/mocks/2009/paso1_alcaldias_jovenes.json';
import ageRows2009 from '@/src/mocks/2009/paso2_desglose_por_edad.json';
import sexRows2009 from '@/src/mocks/2009/paso3_brecha_genero.json';
import sectionRows2009 from '@/src/mocks/2009/paso4_secciones_criticas.json';
import municipalityRows2012 from '@/src/mocks/2012/paso1_alcaldias_jovenes.json';
import ageRows2012 from '@/src/mocks/2012/paso2_desglose_por_edad.json';
import sexRows2012 from '@/src/mocks/2012/paso3_brecha_genero.json';
import sectionRows2012 from '@/src/mocks/2012/paso4_secciones_criticas.json';
import municipalityRows2015 from '@/src/mocks/2015/paso1_alcaldias_jovenes.json';
import ageRows2015 from '@/src/mocks/2015/paso2_desglose_por_edad.json';
import sexRows2015 from '@/src/mocks/2015/paso3_brecha_genero.json';
import sectionRows2015 from '@/src/mocks/2015/paso4_secciones_criticas.json';
import municipalityRows2018 from '@/src/mocks/2018/paso1_alcaldias_jovenes.json';
import ageRows2018 from '@/src/mocks/2018/paso2_desglose_por_edad.json';
import sexRows2018 from '@/src/mocks/2018/paso3_brecha_genero.json';
import sectionRows2018 from '@/src/mocks/2018/paso4_secciones_criticas.json';
import municipalityRows2021 from '@/src/mocks/2021/paso1_alcaldias_jovenes.json';
import ageRows2021 from '@/src/mocks/2021/paso2_desglose_por_edad.json';
import sexRows2021 from '@/src/mocks/2021/paso3_brecha_genero.json';
import sectionRows2021 from '@/src/mocks/2021/paso4_secciones_criticas.json';
import municipalityRows2024 from '@/src/mocks/2024/paso1_alcaldias_jovenes.json';
import ageRows2024 from '@/src/mocks/2024/paso2_desglose_por_edad.json';
import sexRows2024 from '@/src/mocks/2024/paso3_brecha_genero.json';
import sectionRows2024 from '@/src/mocks/2024/paso4_secciones_criticas.json';
import type {
  AgeFilterOption,
  AgeRange,
  CriticalSectionRecord,
  ElectoralFilterOptions,
  ElectoralFilters,
  ElectoralRecord,
  ElectionYear,
  HistoricalMetric,
  SexFilterOption,
  WhatIfParams,
  WhatIfResult,
} from '@/src/types/electoral';

const ageRanges: { label: AgeRange; min: number; max: number }[] = [
  { label: '18-19', min: 18, max: 19 },
  { label: '20-24', min: 20, max: 24 },
  { label: '25-29', min: 25, max: 29 },
];

type Counts = Pick<ElectoralRecord, 'LN' | 'NV' | 'SV'>;
type SourceRates = {
  PCT_ABSTENCION: number;
  PCT_PARTICIPACION: number;
};

interface AggregatedRates {
  tasaAbstencion: number;
  tasaParticipacion: number;
}

interface SourceRow extends Counts, SourceRates {
  MPIONOM: string;
}

interface AgeSourceRow extends SourceRow {
  EDAD: number;
}

interface SexSourceRow extends SourceRow {
  SEXO: number;
  SEXO_TXT: string | null;
}

interface SectionSourceRow extends SourceRow {
  SECCION: number;
  TIPOSEC_TXT: string;
  PRIORIDAD: string;
}

interface ElectionDataset {
  AELEC: ElectionYear;
  municipalityRows: SourceRow[];
  ageRows: AgeSourceRow[];
  sexRows: SexSourceRow[];
  sectionRows: SectionSourceRow[];
}

const electionDatasets: ElectionDataset[] = [
  {
    AELEC: 2009,
    municipalityRows: municipalityRows2009,
    ageRows: ageRows2009,
    sexRows: sexRows2009,
    sectionRows: sectionRows2009,
  },
  {
    AELEC: 2012,
    municipalityRows: municipalityRows2012,
    ageRows: ageRows2012,
    sexRows: sexRows2012,
    sectionRows: sectionRows2012,
  },
  {
    AELEC: 2015,
    municipalityRows: municipalityRows2015,
    ageRows: ageRows2015,
    sexRows: sexRows2015,
    sectionRows: sectionRows2015,
  },
  {
    AELEC: 2018,
    municipalityRows: municipalityRows2018,
    ageRows: ageRows2018,
    sexRows: sexRows2018,
    sectionRows: sectionRows2018,
  },
  {
    AELEC: 2021,
    municipalityRows: municipalityRows2021,
    ageRows: ageRows2021,
    sexRows: sexRows2021,
    sectionRows: sectionRows2021,
  },
  {
    AELEC: 2024,
    municipalityRows: municipalityRows2024,
    ageRows: ageRows2024,
    sexRows: sexRows2024,
    sectionRows: sectionRows2024,
  },
];

function makeRecord(
  AELEC: ElectionYear,
  MPIONOM: string,
  EDAD: AgeFilterOption,
  SEXO: SexFilterOption,
  source: SourceRow
): ElectoralRecord {
  return {
    AELEC,
    MPIONOM,
    EDAD,
    SEXO,
    LN: source.LN,
    NV: source.NV,
    SV: source.SV,
    tasaAbstencion: source.PCT_ABSTENCION,
    tasaParticipacion: source.PCT_PARTICIPACION,
    esEstimado: false,
  };
}

function makeWeightedAgeRecord(
  AELEC: ElectionYear,
  MPIONOM: string,
  EDAD: AgeRange,
  rows: AgeSourceRow[]
): ElectoralRecord {
  const LN = rows.reduce((sum, row) => sum + row.LN, 0);
  const weightedRate = (key: keyof SourceRates) =>
    LN === 0 ? 0 : rows.reduce((sum, row) => sum + row.LN * row[key], 0) / LN;

  return {
    AELEC,
    MPIONOM,
    EDAD,
    SEXO: 'Todos',
    LN,
    NV: rows.reduce((sum, row) => sum + row.NV, 0),
    SV: rows.reduce((sum, row) => sum + row.SV, 0),
    tasaAbstencion: weightedRate('PCT_ABSTENCION'),
    tasaParticipacion: weightedRate('PCT_PARTICIPACION'),
    esEstimado: false,
  };
}

function getSexLabel(row: SexSourceRow): SexFilterOption {
  return row.SEXO_TXT === 'Mujeres'
    ? 'Mujer'
    : row.SEXO_TXT === 'Hombres'
      ? 'Hombre'
      : 'No especificado';
}

function estimateIntersectionCount(ageCount: number, sexCount: number, totalSexCount: number) {
  return totalSexCount === 0 ? 0 : Math.round((ageCount * sexCount) / totalSexCount);
}

function makeEstimatedAgeSexRecords(
  dataset: ElectionDataset,
  rangoEdad: AgeRange,
  sexo: SexFilterOption
): ElectoralRecord[] {
  const range = ageRanges.find((item) => item.label === rangoEdad);
  if (!range) {
    throw new RangeError(`El rango de edad ${rangoEdad} no está disponible.`);
  }

  const groupedAges = new Map<string, AgeSourceRow[]>();
  for (const row of dataset.ageRows) {
    if (row.EDAD < range.min || row.EDAD > range.max) {
      continue;
    }

    const rows = groupedAges.get(row.MPIONOM) ?? [];
    rows.push(row);
    groupedAges.set(row.MPIONOM, rows);
  }

  return [...groupedAges.entries()].flatMap(([MPIONOM, rows]) => {
    const sexRows = dataset.sexRows.filter((row) => row.MPIONOM === MPIONOM);
    const selectedSex = sexRows.find((row) => getSexLabel(row) === sexo);
    if (!selectedSex) {
      return [];
    }

    const ageRecord = makeWeightedAgeRecord(dataset.AELEC, MPIONOM, rangoEdad, rows);
    const totalSexLN = sexRows.reduce((sum, row) => sum + row.LN, 0);
    const totalSexSV = sexRows.reduce((sum, row) => sum + row.SV, 0);
    const totalSexNV = sexRows.reduce((sum, row) => sum + row.NV, 0);
    // The source tables are separate marginals, so each intersection is a proportional estimate.
    const LN = estimateIntersectionCount(ageRecord.LN, selectedSex.LN, totalSexLN);
    const SV = Math.min(LN, estimateIntersectionCount(ageRecord.SV, selectedSex.SV, totalSexSV));
    const NV = Math.min(LN, estimateIntersectionCount(ageRecord.NV, selectedSex.NV, totalSexNV));

    return [
      {
        ...ageRecord,
        SEXO: sexo,
        LN,
        SV,
        NV,
        tasaAbstencion: LN === 0 ? 0 : (NV / LN) * 100,
        tasaParticipacion: LN === 0 ? 0 : (SV / LN) * 100,
        esEstimado: true,
      },
    ];
  });
}

function aggregateSourceRates(records: ElectoralRecord[]): AggregatedRates {
  const LN = records.reduce((sum, record) => sum + record.LN, 0);
  if (LN === 0) {
    return { tasaAbstencion: 0, tasaParticipacion: 0 };
  }

  return {
    tasaAbstencion:
      records.reduce((sum, record) => sum + record.LN * record.tasaAbstencion, 0) / LN,
    tasaParticipacion:
      records.reduce((sum, record) => sum + record.LN * record.tasaParticipacion, 0) / LN,
  };
}

function recordsForFilters(dataset: ElectionDataset, filters: ElectoralFilters) {
  const { rangoEdad, sexo } = filters;

  if (rangoEdad !== 'Todos' && sexo !== 'Todos') {
    return makeEstimatedAgeSexRecords(dataset, rangoEdad, sexo);
  }

  if (rangoEdad === 'Todos' && sexo === 'Todos') {
    return dataset.municipalityRows.map((row) =>
      makeRecord(dataset.AELEC, row.MPIONOM, 'Todos', 'Todos', row)
    );
  }

  if (rangoEdad !== 'Todos') {
    const range = ageRanges.find((item) => item.label === rangoEdad);
    if (!range) {
      throw new RangeError(`El rango de edad ${rangoEdad} no está disponible.`);
    }

    const grouped = new Map<string, AgeSourceRow[]>();
    for (const row of dataset.ageRows) {
      if (row.EDAD < range.min || row.EDAD > range.max) {
        continue;
      }

      const rows = grouped.get(row.MPIONOM) ?? [];
      rows.push(row);
      grouped.set(row.MPIONOM, rows);
    }

    return [...grouped.entries()].map(([MPIONOM, rows]) =>
      makeWeightedAgeRecord(dataset.AELEC, MPIONOM, rangoEdad, rows)
    );
  }

  return dataset.sexRows.flatMap((row) => {
    const label = getSexLabel(row);

    return sexo === label ? [makeRecord(dataset.AELEC, row.MPIONOM, 'Todos', label, row)] : [];
  });
}

function filterMunicipality(records: ElectoralRecord[], filters: ElectoralFilters) {
  return records.filter(
    (record) => filters.alcaldia === 'Todas' || record.MPIONOM === filters.alcaldia
  );
}

export async function getElectoralFilterOptions(): Promise<ElectoralFilterOptions> {
  const alcaldias = [
    ...new Set(
      electionDatasets.flatMap((dataset) => [
        ...dataset.municipalityRows.map((record) => record.MPIONOM),
        ...dataset.ageRows.map((record) => record.MPIONOM),
        ...dataset.sexRows.map((record) => record.MPIONOM),
      ])
    ),
  ].sort((a, b) => a.localeCompare(b, 'es'));
  const hasUnspecifiedSex = electionDatasets.some((dataset) =>
    dataset.sexRows.some((record) => record.SEXO_TXT === null)
  );

  return {
    alcaldias: ['Todas', ...alcaldias],
    rangosEdad: ['Todos', ...ageRanges.map((range) => range.label)],
    sexos: [
      'Todos',
      'Hombre',
      'Mujer',
      ...(hasUnspecifiedSex ? (['No especificado'] as const) : []),
    ],
  };
}

export async function getMetricsByAlcaldia(
  filters: ElectoralFilters,
  year?: ElectionYear
): Promise<ElectoralRecord[]> {
  const datasets = year
    ? electionDatasets.filter((dataset) => dataset.AELEC === year)
    : [...electionDatasets].sort((left, right) => right.AELEC - left.AELEC);

  for (const dataset of datasets) {
    const records = filterMunicipality(recordsForFilters(dataset, filters), filters);
    if (records.length > 0) {
      return records;
    }
  }

  return [];
}

export async function getHistoricalTrend(filters: ElectoralFilters): Promise<HistoricalMetric[]> {
  return electionDatasets
    .map((dataset) => filterMunicipality(recordsForFilters(dataset, filters), filters))
    .filter((records) => records.length > 0)
    .map((records) => ({
      AELEC: records[0].AELEC,
      LN: records.reduce((sum, record) => sum + record.LN, 0),
      NV: records.reduce((sum, record) => sum + record.NV, 0),
      SV: records.reduce((sum, record) => sum + record.SV, 0),
      ...aggregateSourceRates(records),
    }))
    .sort((metricA, metricB) => metricA.AELEC - metricB.AELEC);
}

export async function getCriticalSections(
  AELEC: ElectionYear,
  filters: ElectoralFilters
): Promise<CriticalSectionRecord[]> {
  if (filters.rangoEdad !== 'Todos' || filters.sexo !== 'Todos') {
    return [];
  }

  const dataset = electionDatasets.find((item) => item.AELEC === AELEC);
  if (!dataset) {
    return [];
  }

  return dataset.sectionRows
    .filter((row) => filters.alcaldia === 'Todas' || row.MPIONOM === filters.alcaldia)
    .sort((left, right) => right.PCT_ABSTENCION - left.PCT_ABSTENCION)
    .slice(0, 5)
    .map((row) => ({
      MPIONOM: row.MPIONOM,
      SECCION: row.SECCION,
      TIPOSEC_TXT: row.TIPOSEC_TXT,
      LN: row.LN,
      SV: row.SV,
      NV: row.NV,
      tasaAbstencion: row.PCT_ABSTENCION,
      tasaParticipacion: row.PCT_PARTICIPACION,
      PRIORIDAD: row.PRIORIDAD,
    }));
}

export async function calculateWhatIfImpact(params: WhatIfParams): Promise<WhatIfResult> {
  const { porcentajeMovilizacion } = params;
  if (
    !Number.isFinite(porcentajeMovilizacion) ||
    porcentajeMovilizacion < 0 ||
    porcentajeMovilizacion > 100
  ) {
    throw new RangeError('El porcentaje de movilización debe estar entre 0 y 100.');
  }

  const filters: ElectoralFilters = {
    alcaldia: params.alcaldia,
    rangoEdad: params.rangoEdad,
    sexo: params.sexo,
  };
  const [records, comparativaHistorica] = await Promise.all([
    getMetricsByAlcaldia(filters),
    getHistoricalTrend(filters),
  ]);
  const LN = records.reduce((sum, record) => sum + record.LN, 0);
  const NV = records.reduce((sum, record) => sum + record.NV, 0);
  const dataset = electionDatasets.find((item) => item.AELEC === records[0]?.AELEC);
  const totalVotosEfectivosJovenes =
    dataset?.municipalityRows
      .filter((record) => params.alcaldia === 'Todas' || record.MPIONOM === params.alcaldia)
      .reduce((sum, record) => sum + record.SV, 0) ?? 0;
  const votosEfectivosSeleccionados = records.reduce((sum, record) => sum + record.SV, 0);
  const tasaParticipacionActual = aggregateSourceRates(records).tasaParticipacion;

  if (LN === 0) {
    return {
      votosAdicionales: 0,
      nuevaTasaParticipacion: 0,
      comparativaHistorica,
      tasaParticipacionActual: 0,
      listaNominal: 0,
      proporcionJovenActual: 0,
      nuevaProporcionJoven: 0,
    };
  }

  const votosAdicionales = Math.floor((NV * porcentajeMovilizacion) / 100);
  const proporcionJovenActual =
    totalVotosEfectivosJovenes === 0
      ? 0
      : (votosEfectivosSeleccionados / totalVotosEfectivosJovenes) * 100;
  const nuevaProporcionJoven =
    totalVotosEfectivosJovenes + votosAdicionales === 0
      ? 0
      : ((votosEfectivosSeleccionados + votosAdicionales) /
          (totalVotosEfectivosJovenes + votosAdicionales)) *
        100;

  return {
    votosAdicionales,
    nuevaTasaParticipacion: tasaParticipacionActual + (votosAdicionales / LN) * 100,
    comparativaHistorica,
    tasaParticipacionActual,
    listaNominal: LN,
    proporcionJovenActual,
    nuevaProporcionJoven,
  };
}
