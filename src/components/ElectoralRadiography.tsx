import { useMemo } from 'react';
import { Pressable, Text, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

import { MemeSpotlight } from '@/src/components/MemeSpotlight';
import type {
  CriticalSectionRecord,
  ElectoralFilters,
  ElectoralRecord,
  ElectionYear,
  HistoricalMetric,
} from '@/src/types/electoral';

interface ElectoralRadiographyProps {
  filters: ElectoralFilters;
  records: ElectoralRecord[];
  trend: HistoricalMetric[];
  criticalSections: CriticalSectionRecord[];
  selectedYear: ElectionYear | undefined;
  onSelectYear: (year: ElectionYear) => void;
}

const numberFormat = new Intl.NumberFormat('es-MX');
const compactFormat = new Intl.NumberFormat('es-MX', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const percentFormat = (value: number) => `${value.toFixed(1)}%`;

export function ElectoralRadiography({
  filters,
  records,
  trend,
  criticalSections,
  selectedYear,
  onSelectYear,
}: ElectoralRadiographyProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors =
    colorScheme === 'dark'
      ? {
          background: '#141210',
          error: '#cf6679',
          primary: '#c6a486',
          secondary: '#9e836a',
        }
      : {
          background: '#f7f5f9',
          error: '#b00020',
          primary: '#3d2066',
          secondary: '#7e57c2',
        };

  const totals = useMemo(
    () =>
      records.reduce(
        (result, record) => ({
          LN: result.LN + record.LN,
          NV: result.NV + record.NV,
          SV: result.SV + record.SV,
        }),
        { LN: 0, NV: 0, SV: 0 }
      ),
    [records]
  );
  const abstentionRate =
    totals.LN === 0
      ? 0
      : records.reduce((sum, record) => sum + record.LN * record.tasaAbstencion, 0) / totals.LN;
  const participationRate =
    totals.LN === 0
      ? 0
      : records.reduce((sum, record) => sum + record.LN * record.tasaParticipacion, 0) / totals.LN;
  const activeYear = selectedYear ?? records[0]?.AELEC;

  if (records.length === 0) {
    return (
      <View className="rounded-2xl border border-secondary bg-surface p-5">
        <Text className="text-base font-bold text-text">No hay datos para estos filtros.</Text>
      </View>
    );
  }

  const maxRate = Math.max(...trend.map((item) => item.tasaParticipacion), 1);
  const severityColor =
    abstentionRate >= 50 ? 'bg-error' : abstentionRate >= 40 ? 'bg-secondary' : 'bg-primary';
  const chartColor =
    abstentionRate >= 50 ? colors.error : abstentionRate >= 40 ? colors.secondary : colors.primary;
  const donutCircumference = 2 * Math.PI * 58;
  const abstentionDenominator =
    abstentionRate === 0 ? 0 : Math.max(1, Math.round(100 / abstentionRate));
  const memeCategory = abstentionRate >= 40 ? 'abstencion_alta' : 'movilizacion_activa';

  return (
    <View className="gap-4">
      <View className="rounded-2xl border border-secondary bg-surface p-5">
        <Text className="text-lg font-bold text-text">Radiografía por elección</Text>
        <Text className="mb-3 mt-1 text-sm text-muted">
          Selecciona el año que quieres consultar.
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {trend.map((item) => {
            const isSelected = item.AELEC === activeYear;
            return (
              <Pressable
                key={item.AELEC}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => onSelectYear(item.AELEC)}
                className={`rounded-full border px-4 py-2 ${
                  isSelected ? 'border-primary bg-primary' : 'border-secondary bg-background'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    isSelected ? 'text-textbutton' : 'text-text'
                  }`}>
                  {item.AELEC}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="rounded-3xl border border-secondary bg-surface p-5">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-2xl font-black text-text">Radiografía electoral</Text>
            <Text className="mt-1 text-sm text-muted">
              {filters.alcaldia} · elección {records[0].AELEC} · edad {filters.rangoEdad} · sexo{' '}
              {filters.sexo}
            </Text>
          </View>
          <View className={`rounded-full px-3 py-1 ${severityColor}`}>
            <Text className="text-xs font-bold text-textbutton">
              {abstentionRate >= 50 ? '≥50%' : abstentionRate >= 40 ? '40–<50%' : '<40%'}
            </Text>
          </View>
        </View>

        <View className="my-5 items-center">
          <View
            accessibilityRole="image"
            accessibilityLabel={`Abstención crítica: ${percentFormat(abstentionRate)}`}
            className="h-40 w-40 items-center justify-center">
            <Svg width="160" height="160" viewBox="0 0 160 160">
              <Circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke={colors.background}
                strokeWidth="16"
              />
              <Circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke={chartColor}
                strokeWidth="16"
                strokeDasharray={`${donutCircumference} ${donutCircumference}`}
                strokeDashoffset={donutCircumference * (1 - abstentionRate / 100)}
                strokeLinecap="round"
                rotation="-90"
                origin="80, 80"
              />
            </Svg>
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-xs font-semibold text-muted">ABSTENCIÓN</Text>
              <Text className="mt-1 text-3xl font-black text-text">
                {percentFormat(abstentionRate)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2">
          <Metric label="Lista nominal" value={compactFormat.format(totals.LN)} />
          <Metric label="No votaron" value={compactFormat.format(totals.NV)} />
          <Metric label="Participación reportada" value={percentFormat(participationRate)} />
        </View>
        <Text className="mt-3 text-xs leading-5 text-muted">
          Conteos y porcentajes extraidos de los estudios censales realizados en las elecciones
          federales. En consultas con varias filas, las tasas se ponderan por lista nominal usando
          los porcentajes publicados.
        </Text>
        {records.some((record) => record.esEstimado) ? (
          <Text className="mt-2 text-xs leading-5 text-muted">
            Estimación proporcional: la fuente no publica el cruce conjunto de edad y sexo.
          </Text>
        ) : null}
      </View>

      <View className="rounded-2xl border border-secondary bg-surface p-5">
        <Text className="text-lg font-bold text-text">Participación por elección</Text>
        <Text className="mb-4 mt-1 text-sm text-muted">
          Años con datos disponibles para estos filtros.
        </Text>
        <View className="h-40 flex-row items-end justify-around gap-2">
          {trend.map((item) => (
            <View key={item.AELEC} className="h-full flex-1 items-center justify-end">
              <Text className="mb-1 text-[10px] text-muted">
                {percentFormat(item.tasaParticipacion)}
              </Text>
              <View
                className="w-full max-w-10 rounded-t-lg bg-primary"
                style={{ height: `${Math.max(8, (item.tasaParticipacion / maxRate) * 70)}%` }}
              />
              <Text className="mt-2 text-[10px] text-muted">{item.AELEC}</Text>
            </View>
          ))}
          {trend.length === 0 && <Text className="text-sm text-muted">Sin datos históricos.</Text>}
        </View>
      </View>

      {criticalSections.length > 0 ? (
        <View className="rounded-2xl border border-secondary bg-surface p-5">
          <Text className="text-lg font-bold text-text">Secciones con mayor abstención</Text>
          <Text className="mb-3 mt-1 text-sm text-muted">
            Datos del archivo de secciones críticas de {records[0].AELEC}.
          </Text>
          {criticalSections.map((section) => (
            <View
              key={`${section.MPIONOM}-${section.SECCION}`}
              className="mb-2 rounded-xl bg-background p-3">
              <View className="flex-row items-start justify-between gap-2">
                <Text className="flex-1 text-sm font-bold text-text">
                  Sección {section.SECCION} · {section.MPIONOM}
                </Text>
                <Text className="text-sm font-bold text-error">
                  {percentFormat(section.tasaAbstencion)}
                </Text>
              </View>
              <Text className="mt-1 text-xs text-muted">
                {section.TIPOSEC_TXT} · Prioridad: {section.PRIORIDAD} · Lista nominal:{' '}
                {numberFormat.format(section.LN)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className="rounded-2xl bg-primary p-4">
        <Text className="text-base font-bold text-textbutton">
          {abstentionDenominator === 0
            ? 'La tasa de abstención reportada es 0% en esta selección.'
            : `Según la tasa reportada, equivale aproximadamente a 1 de cada ${abstentionDenominator} personas de esta selección.`}
        </Text>
        <Text className="mt-1 text-sm text-textbutton">
          En esta selección: {numberFormat.format(totals.NV)} personas no votaron.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() =>
          router.push({
            pathname: '/simulator',
            params: {
              alcaldia: filters.alcaldia,
              rangoEdad: filters.rangoEdad,
              sexo: filters.sexo,
            },
          })
        }
        className="items-center rounded-2xl bg-primary px-5 py-4">
        <Text className="text-base font-bold text-textbutton">Simular una movilización &gt;</Text>
      </Pressable>
      <MemeSpotlight key={memeCategory} category={memeCategory} />
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-h-20 flex-1 justify-center rounded-xl bg-background p-3">
      <Text className="text-[11px] leading-4 text-muted">{label}</Text>
      <Text className="mt-1 text-base font-black text-text">{value}</Text>
    </View>
  );
}
