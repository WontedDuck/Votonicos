import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { HeaderBar } from '@/src/components/HeaderBar';
import { ElectoralProfileForm } from '@/src/components/ElectoralProfileForm';
import { ElectoralRadiography } from '@/src/components/ElectoralRadiography';
import {
  useCriticalSections,
  useElectoralMetrics,
  useHistoricalTrend,
} from '@/src/hooks/useElectoralData';
import type {
  AgeFilterOption,
  ElectoralFilters,
  ElectionYear,
  SexFilterOption,
} from '@/src/types/electoral';

const ages: AgeFilterOption[] = ['Todos', '18-19', '20-24', '25-29'];
const sexes: SexFilterOption[] = ['Todos', 'Mujer', 'Hombre', 'No especificado'];

function firstParam(value: string | string[] | undefined, fallback: string) {
  return Array.isArray(value) ? (value[0] ?? fallback) : (value ?? fallback);
}

function readFilters(params: Record<string, string | string[] | undefined>): ElectoralFilters {
  const rangoEdad = firstParam(params.rangoEdad, 'Todos');
  const sexo = firstParam(params.sexo, 'Todos');

  return {
    alcaldia: firstParam(params.alcaldia, 'Todas'),
    rangoEdad: ages.includes(rangoEdad as AgeFilterOption)
      ? (rangoEdad as AgeFilterOption)
      : 'Todos',
    sexo: sexes.includes(sexo as SexFilterOption) ? (sexo as SexFilterOption) : 'Todos',
  };
}

export function RadiographyScreen() {
  const params = useLocalSearchParams<{
    alcaldia?: string | string[];
    rangoEdad?: string | string[];
    sexo?: string | string[];
  }>();
  const [filters, setFilters] = useState<ElectoralFilters>(() => readFilters(params));
  const [selectedYear, setSelectedYear] = useState<ElectionYear>();
  const metricsQuery = useElectoralMetrics(filters, selectedYear);
  const trendQuery = useHistoricalTrend(filters);
  const sectionsQuery = useCriticalSections(filters, selectedYear ?? metricsQuery.data?.[0]?.AELEC);

  function applyFilters(nextFilters: ElectoralFilters) {
    setFilters(nextFilters);
    setSelectedYear(undefined);
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <HeaderBar />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 p-5 pb-10"
        showsVerticalScrollIndicator={false}>
        <ElectoralProfileForm
          key={`${filters.alcaldia}|${filters.rangoEdad}|${filters.sexo}`}
          initialFilters={filters}
          onSubmit={applyFilters}
        />
        {(metricsQuery.isPending || trendQuery.isPending) && (
          <View className="items-center rounded-2xl border border-secondary bg-surface p-8">
            <ActivityIndicator />
            <Text className="mt-3 text-sm text-muted">Armando tu radiografía...</Text>
          </View>
        )}
        {(metricsQuery.isError || trendQuery.isError) && (
          <Text className="rounded-2xl bg-surface p-4 text-sm text-error">
            No se pudo cargar la radiografía:{' '}
            {metricsQuery.error?.message ?? trendQuery.error?.message}
          </Text>
        )}
        {metricsQuery.data && trendQuery.data && (
          <ElectoralRadiography
            key={`${filters.alcaldia}|${filters.rangoEdad}|${filters.sexo}`}
            filters={filters}
            records={metricsQuery.data}
            trend={trendQuery.data}
            criticalSections={sectionsQuery.data ?? []}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        )}
      </ScrollView>
    </View>
  );
}
