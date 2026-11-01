import { useMemo, useState } from 'react';
import { PanResponder, Text, View } from 'react-native';

import type { WhatIfResult } from '@/src/types/electoral';

interface WhatIfSliderProps {
  value: number;
  onChange: (value: number) => void;
  result?: WhatIfResult;
  isLoading?: boolean;
}

const formatNumber = (value: number) => new Intl.NumberFormat('es-MX').format(value);

export function WhatIfSlider({ value, onChange, result, isLoading = false }: WhatIfSliderProps) {
  const [trackWidth, setTrackWidth] = useState(1);
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const percentage = (event.nativeEvent.locationX / trackWidth) * 100;
          onChange(Math.round(Math.min(100, Math.max(0, percentage)) / 5) * 5);
        },
        onPanResponderMove: (event) => {
          const percentage = (event.nativeEvent.locationX / trackWidth) * 100;
          onChange(Math.round(Math.min(100, Math.max(0, percentage)) / 5) * 5);
        },
      }),
    [onChange, trackWidth]
  );

  return (
    <View className="rounded-2xl border border-secondary bg-surface p-5">
      <Text className="text-lg font-bold text-text">Simulador de movilización</Text>
      <Text className="mt-1 text-sm leading-5 text-muted">
        ¿Qué pasaría si movilizamos parte de las personas jóvenes que se abstuvieron?
      </Text>

      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-sm text-muted">Porcentaje movilizado</Text>
        <Text className="text-lg font-bold text-primary">{value}%</Text>
      </View>
      <View
        accessibilityRole="adjustable"
        accessibilityLabel="Porcentaje de jóvenes abstencionistas movilizados"
        accessibilityValue={{ min: 0, max: 100, now: value }}
        onLayout={(event) => {
          setTrackWidth(Math.max(1, event.nativeEvent.layout.width));
        }}
        {...panResponder.panHandlers}
        className="mt-4 h-10 justify-center">
        <View className="h-2 rounded-full bg-background">
          <View className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
        </View>
        <View
          className="absolute h-6 w-6 rounded-full border-2 border-surface bg-primary"
          style={{ left: `${value}%`, marginLeft: -12 }}
        />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-xs text-muted">0%</Text>
        <Text className="text-xs text-muted">100%</Text>
      </View>

      <View className="mt-5 rounded-xl bg-background p-4">
        {isLoading ? (
          <Text className="text-sm text-muted">Calculando impacto...</Text>
        ) : result ? (
          <>
            <Text className="text-sm text-muted">Votos adicionales</Text>
            <Text className="mt-1 text-2xl font-bold text-text">
              {formatNumber(result.votosAdicionales)}
            </Text>
            <View className="mt-3 flex-row items-center justify-between">
              <Text className="text-sm text-muted">Participación resultante</Text>
              <Text className="text-base font-bold text-primary">
                {result.nuevaTasaParticipacion.toFixed(1)}%
              </Text>
            </View>
          </>
        ) : (
          <Text className="text-sm text-muted">No hay abstencionistas para calcular.</Text>
        )}
      </View>
      <Text className="mt-3 text-xs leading-4 text-muted">
        Los votos adicionales se suman a la participación de la selección actual.
      </Text>
    </View>
  );
}
