import { useQuery } from '@tanstack/react-query';

import {
  calculateWhatIfImpact,
  getCriticalSections,
  getElectoralFilterOptions,
  getHistoricalTrend,
  getMetricsByAlcaldia,
} from '@/src/services/electoralService';
import type { ElectoralFilters, ElectionYear, WhatIfParams } from '@/src/types/electoral';

export function useElectoralMetrics(filters: ElectoralFilters, year?: ElectionYear) {
  return useQuery({
    queryKey: ['electoral-metrics', filters, year],
    queryFn: () => getMetricsByAlcaldia(filters, year),
  });
}

export function useHistoricalTrend(filters: ElectoralFilters) {
  return useQuery({
    queryKey: ['electoral-historical-trend', filters],
    queryFn: () => getHistoricalTrend(filters),
  });
}

export function useCriticalSections(filters: ElectoralFilters, year: ElectionYear | undefined) {
  return useQuery({
    queryKey: ['electoral-critical-sections', year, filters],
    queryFn: () => {
      if (!year) {
        return [];
      }

      return getCriticalSections(year, filters);
    },
    enabled: year !== undefined,
  });
}

export function useElectoralFilterOptions() {
  return useQuery({
    queryKey: ['electoral-filter-options'],
    queryFn: getElectoralFilterOptions,
    staleTime: Infinity,
  });
}

export function useWhatIfSimulation(params: WhatIfParams | undefined) {
  return useQuery({
    queryKey: ['electoral-what-if', params],
    queryFn: () => {
      if (!params) {
        throw new Error('Se requieren parámetros de movilización.');
      }

      return calculateWhatIfImpact(params);
    },
    enabled: params !== undefined,
  });
}
