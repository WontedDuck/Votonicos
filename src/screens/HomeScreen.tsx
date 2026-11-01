import { ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';

import { HeaderBar } from '@/src/components/HeaderBar';
import { ElectoralProfileForm } from '@/src/components/ElectoralProfileForm';
import { MemeSpotlight } from '@/src/components/MemeSpotlight';

export function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <HeaderBar />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 p-5 pb-10"
        showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl bg-primary p-6">
          <Text className="text-xs font-bold tracking-widest text-textbutton">
            CDMX · PARTICIPACIÓN JOVEN
          </Text>
          <Text className="mt-3 text-3xl font-black leading-9 text-textbutton">
            Tu voto también mueve la ciudad.
          </Text>
          <Text className="mt-3 text-sm leading-6 text-textbutton">
            Explora los datos electorales de forma clara, cercana y sin rollo.
          </Text>
        </View>
        <ElectoralProfileForm />
        <MemeSpotlight category="abstencion_alta" />
      </ScrollView>
    </View>
  );
}
