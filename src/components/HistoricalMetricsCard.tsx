import { Text, View } from 'react-native';

import type { ElectoralRecord, HistoricalMetric } from '@/src/types/electoral';

interface HistoricalMetricsCardProps {
  records: ElectoralRecord[];
  trend: HistoricalMetric[];
}

const formatNumber = (value: number) => new Intl.NumberFormat('es-MX').format(value);
const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export function HistoricalMetricsCard({ records, trend }: HistoricalMetricsCardProps) {
  if (records.length === 0) {
    return (
      <View className="rounded-2xl border border-secondary bg-surface p-5">
        <Text className="text-base font-semibold text-text">Sin datos para esta selección</Text>
        <Text className="mt-1 text-sm text-muted">
          Prueba con otra alcaldía, rango de edad o sexo.
        </Text>
      </View>
    );
  }

  const totals = records.reduce(
    (result, record) => ({
      LN: result.LN + record.LN,
      NV: result.NV + record.NV,
      SV: result.SV + record.SV,
    }),
    { LN: 0, NV: 0, SV: 0 }
  );
  const abstentionRate = totals.LN === 0 ? 0 : (totals.NV / totals.LN) * 100;
  const participationRate = totals.LN === 0 ? 0 : (totals.SV / totals.LN) * 100;
  const signalColor =
    abstentionRate >= 50 ? 'bg-error' : abstentionRate >= 40 ? 'bg-secondary' : 'bg-primary';
  const year = records[0].AELEC;

  return (
    <View className="rounded-2xl border border-secondary bg-surface p-5">
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-text">Indicadores históricos</Text>
          <Text className="mt-1 text-sm text-muted">Elección {year} · jóvenes de 18 a 29 años</Text>
        </View>
        <View className={`h-4 w-4 rounded-full ${signalColor}`} />
      </View>

      <View className="mb-4 flex-row gap-3">
        <View className="flex-1 rounded-xl bg-background p-3">
          <Text className="text-xs text-muted">Lista nominal</Text>
          <Text className="mt-1 text-lg font-bold text-text">{formatNumber(totals.LN)}</Text>
        </View>
        <View className="flex-1 rounded-xl bg-background p-3">
          <Text className="text-xs text-muted">Abstención</Text>
          <Text className="mt-1 text-lg font-bold text-text">{formatPercent(abstentionRate)}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-secondary pt-3">
        <Text className="text-sm text-muted">Participación histórica</Text>
        <Text className="text-base font-bold text-primary">{formatPercent(participationRate)}</Text>
      </View>

      {trend.length > 0 && (
        <View className="mt-4">
          <Text className="mb-2 text-sm font-semibold text-text">Comparativa disponible</Text>
          {trend.map((item) => (
            <View key={item.AELEC} className="flex-row justify-between py-1">
              <Text className="text-sm text-muted">{item.AELEC}</Text>
              <Text className="text-sm text-text">
                Participación {formatPercent(item.tasaParticipacion)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
