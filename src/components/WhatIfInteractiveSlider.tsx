import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const BALLOT_SIZE = 48;
const MAX_MOBILIZATION = 100;
const DROP_THRESHOLD = 98;

interface WhatIfInteractiveSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export function WhatIfInteractiveSlider({ value, onValueChange }: WhatIfInteractiveSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useSharedValue(value);
  const dragStartProgress = useSharedValue(value);
  const reportedProgress = useSharedValue(value);
  const isDragging = useSharedValue(false);
  const dropProgress = useSharedValue(0);
  const urnBounce = useSharedValue(0);
  const travel = Math.max(0, trackWidth - BALLOT_SIZE);

  useEffect(() => {
    if (!isDragging.value) {
      progress.value = withSpring(value, { damping: 20, stiffness: 180 });
    }
  }, [isDragging, progress, value]);

  const ballotStyle = useAnimatedStyle(() => ({
    opacity: 1 - dropProgress.value,
    transform: [
      { translateX: (progress.value / MAX_MOBILIZATION) * travel },
      { translateY: dropProgress.value * 30 },
      { scale: 1 - dropProgress.value * 0.55 },
    ],
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: `${(progress.value / MAX_MOBILIZATION) * 100}%`,
  }));
  const urnStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: urnBounce.value }],
  }));

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(2)
        .onBegin(() => {
          // Gesture callbacks are UI-thread worklets and intentionally update shared values.
          // eslint-disable-next-line react-hooks/immutability
          isDragging.value = true;
          // eslint-disable-next-line react-hooks/immutability
          dragStartProgress.value = progress.value;
          // eslint-disable-next-line react-hooks/immutability
          reportedProgress.value = Math.round(progress.value);
          // eslint-disable-next-line react-hooks/immutability
          dropProgress.value = 0;
        })
        .onUpdate((event) => {
          const availableTravel = Math.max(1, travel);
          const nextProgress =
            dragStartProgress.value + (event.translationX / availableTravel) * MAX_MOBILIZATION;
          // eslint-disable-next-line react-hooks/immutability
          progress.value = Math.min(MAX_MOBILIZATION, Math.max(0, nextProgress));
          const roundedProgress = Math.round(progress.value);
          if (roundedProgress !== reportedProgress.value) {
            // eslint-disable-next-line react-hooks/immutability
            reportedProgress.value = roundedProgress;
            runOnJS(onValueChange)(roundedProgress);
          }
        })
        .onEnd(() => {
          // eslint-disable-next-line react-hooks/immutability
          isDragging.value = false;
          const finalProgress = Math.round(progress.value);
          if (finalProgress !== reportedProgress.value) {
            runOnJS(onValueChange)(finalProgress);
          }

          if (finalProgress >= DROP_THRESHOLD) {
            // eslint-disable-next-line react-hooks/immutability
            dropProgress.value = withSequence(
              withTiming(1, { duration: 180 }),
              withTiming(0, { duration: 260 })
            );
            // eslint-disable-next-line react-hooks/immutability
            urnBounce.value = withSequence(
              withSpring(-8, { damping: 5, stiffness: 260 }),
              withSpring(0, { damping: 7, stiffness: 200 })
            );
          }
        }),
    [
      dragStartProgress,
      dropProgress,
      isDragging,
      onValueChange,
      progress,
      reportedProgress,
      travel,
      urnBounce,
    ]
  );

  return (
    <View className="rounded-3xl border border-secondary bg-surface p-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-black text-text">
            ¿Qué pasa si los jóvenes se movilizan?
          </Text>
          <Text className="mt-2 text-sm leading-5 text-muted">
            Escenario hipotético: supone que el porcentaje elegido de personas registradas como no
            votantes emitiría un voto. No es un pronóstico electoral.
          </Text>
        </View>
        <Text className="text-2xl font-black text-primary">+{value}%</Text>
      </View>

      <Text className="mb-2 mt-5 text-sm font-bold text-text">
        Porcentaje hipotético de movilización
      </Text>
      <GestureDetector gesture={pan}>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel="Porcentaje de jóvenes movilizados"
          accessibilityValue={{ min: 0, max: MAX_MOBILIZATION, now: value }}
          onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
          className="h-[92px] justify-center overflow-hidden rounded-2xl border-2 border-secondary bg-background px-2">
          <View className="absolute left-2 right-2 top-1/2 h-2 -translate-y-1/2 rounded-full bg-surface">
            <Animated.View className="h-2 rounded-full bg-primary" style={fillStyle} />
          </View>
          <Animated.View
            className="absolute left-0 top-[22px] z-10 h-12 w-12 items-center justify-center rounded-xl border-2 border-primary bg-surface shadow-md"
            style={ballotStyle}>
            <Text className="text-2xl">✓</Text>
            <Text className="text-[7px] font-black text-primary">TU VOTO</Text>
          </Animated.View>
          <Animated.View
            className="absolute right-0 top-[17px] h-[58px] w-12 items-center justify-center"
            style={urnStyle}>
            <Text className="text-[42px] leading-[50px]">🗳️</Text>
          </Animated.View>
        </View>
      </GestureDetector>
      <View className="mt-2 flex-row justify-between">
        <Text className="text-[10px] text-muted">Arrastra la boleta</Text>
        <Text className="text-[10px] text-muted">Hasta la urna · +100%</Text>
      </View>
    </View>
  );
}
