import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const STADIUM_CAPACITY = 36_000;
const SEAT_COUNT = 60;
const numberFormat = new Intl.NumberFormat('es-MX');

interface StadiumVisualizerProps {
  votosAdicionales: number;
}

export function StadiumVisualizer({ votosAdicionales }: StadiumVisualizerProps) {
  const filledStadiums = votosAdicionales / STADIUM_CAPACITY;
  const occupancy = Math.min(votosAdicionales / STADIUM_CAPACITY, 1);
  const activePeople = Math.ceil(occupancy * SEAT_COUNT);

  return (
    <View className="rounded-3xl border border-secondary bg-surface p-5">
      <Text className="text-xs font-black tracking-widest text-primary">
        PARA PONERLO EN PERSPECTIVA
      </Text>
      <Text className="mt-2 text-sm leading-5 text-muted">
        Cada persona representa alrededor de {numberFormat.format(STADIUM_CAPACITY / SEAT_COUNT)}{' '}
        votos.
      </Text>

      <View className="mt-4 overflow-hidden rounded-b-2xl rounded-t-[80px] border-2 border-secondary bg-background px-4 pb-4 pt-5">
        <View className="flex-row flex-wrap justify-center gap-x-1 gap-y-2">
          {Array.from({ length: SEAT_COUNT }, (_, index) => (
            <StadiumPerson
              key={index}
              active={index < activePeople}
              delay={index * 12}
            />
          ))}
        </View>
        <View className="bg-secondary/30 mt-4 h-2 rounded-full">
          <View className="h-2 rounded-full bg-primary" style={{ width: `${occupancy * 100}%` }} />
        </View>
      </View>

      <Text className="mt-4 text-center text-base font-extrabold text-text">
        Equivale a llenar {filledStadiums.toFixed(2)} veces el Estadio Azul
      </Text>
      <Text className="mt-1 text-center text-xs text-muted">
        Aforo de referencia: 36,000 personas
      </Text>
    </View>
  );
}

function StadiumPerson({
  active,
  delay,
}: {
  active: boolean;
  delay: number;
}) {
  const activation = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    const fade = withTiming(active ? 1 : 0, { duration: 360 });
    activation.value = active ? withDelay(delay, fade) : fade;
  }, [activation, active, delay]);

  const silhouetteStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + activation.value * 0.55,
    transform: [{ scale: 0.82 + activation.value * 0.18 }],
  }));

  return (
    <View
      accessibilityLabel={active ? 'Persona movilizada' : 'Lugar disponible'}
      className="h-[18px] w-[10px] items-center justify-start">
      <Animated.View
        className={`h-[5px] w-[5px] rounded-full ${active ? 'bg-primary' : 'bg-muted'}`}
        style={silhouetteStyle}
      />
      <Animated.View
        className={`mt-[1px] h-[9px] w-[8px] rounded-b-sm rounded-t-full ${
          active ? 'bg-primary' : 'bg-muted'
        }`}
        style={silhouetteStyle}
      />
    </View>
  );
}
