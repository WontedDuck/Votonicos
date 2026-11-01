import { useDeferredValue, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { HeaderBar } from '@/src/components/HeaderBar';
import { ImpactResultCard } from '@/src/components/ImpactResultCard';
import { MemeSpotlight } from '@/src/components/MemeSpotlight';
import { WhatIfInteractiveSlider } from '@/src/components/WhatIfInteractiveSlider';
import { useWhatIfSimulation } from '@/src/hooks/useElectoralData';
import type { AgeFilterOption, ElectoralFilters, SexFilterOption } from '@/src/types/electoral';

const ages: AgeFilterOption[] = ['Todos', '18-19', '20-24', '25-29'];
const sexes: SexFilterOption[] = ['Todos', 'Mujer', 'Hombre', 'No especificado'];

function firstParam(value: string | string[] | undefined, fallback: string) {
  return Array.isArray(value) ? (value[0] ?? fallback) : (value ?? fallback);
}

function parseFilters(params: Record<string, string | string[] | undefined>): ElectoralFilters {
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

export function SimulatorScreen() {
  const params = useLocalSearchParams<{
    alcaldia?: string | string[];
    rangoEdad?: string | string[];
    sexo?: string | string[];
  }>();
  const router = useRouter();
  const filters = useMemo(() => parseFilters(params), [params]);
  const [sliderValue, setSliderValue] = useState(20);
  const deferredSliderValue = useDeferredValue(sliderValue);
  const simulationParams = useMemo(
    () => ({ ...filters, porcentajeMovilizacion: deferredSliderValue }),
    [filters, deferredSliderValue]
  );
  const simulationQuery = useWhatIfSimulation(simulationParams);
  const isEstimatedCross = filters.rangoEdad !== 'Todos' && filters.sexo !== 'Todos';

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <HeaderBar />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 p-5 pb-10"
        showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="self-start py-1">
          <Text className="font-semibold text-primary">‹ Volver a la radiografía</Text>
        </Pressable>
        <View>
          <Text className="text-3xl font-black text-text">
            Escenario hipotético de participación
          </Text>
          <Text className="mt-2 text-sm leading-5 text-muted">
            No es un resultado ni pronóstico electoral. El escenario supone que las personas
            movilizadas emitirían un voto.
          </Text>
          <Text className="mt-2 text-xs leading-5 text-muted">
            Alcaldía: {filters.alcaldia} · Edad: {filters.rangoEdad} · Sexo: {filters.sexo}
          </Text>
          {isEstimatedCross ? (
            <Text className="mt-2 text-xs leading-5 text-muted">
              El cruce de edad y sexo es una estimación proporcional; la fuente no publica datos
              conjuntos.
            </Text>
          ) : null}
        </View>
        <WhatIfInteractiveSlider value={sliderValue} onValueChange={setSliderValue} />
        {simulationQuery.isPending && (
          <View className="items-center rounded-2xl border border-secondary bg-surface p-7">
            <ActivityIndicator />
            <Text className="mt-3 text-sm text-muted">Procesando participación...</Text>
          </View>
        )}
        {simulationQuery.isError && (
          <Text className="rounded-2xl bg-surface p-4 text-sm text-error">
            No se pudo calcular el impacto: {simulationQuery.error.message}
          </Text>
        )}
        {simulationQuery.data && simulationQuery.data.listaNominal === 0 ? (
          <View className="rounded-2xl border border-secondary bg-surface p-4">
            <Text className="text-sm font-bold text-text">No hay datos para estos filtros</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">
              No se genera un escenario sin registros de la fuente para la selección actual.
            </Text>
          </View>
        ) : null}
        {simulationQuery.data && simulationQuery.data.listaNominal > 0 ? (
          <ImpactResultCard result={simulationQuery.data} isLoading={simulationQuery.isFetching} />
        ) : null}
        <MemeSpotlight category="movilizacion_activa" />
      </ScrollView>
    </View>
  );
}
