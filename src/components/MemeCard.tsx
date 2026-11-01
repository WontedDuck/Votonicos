import { Image, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import type { MemePhrase } from '@/src/types/memes';

interface MemeCardProps {
  meme: MemePhrase;
  image: ImageSourcePropType;
}

export function MemeCard({ meme, image }: MemeCardProps) {
  return (
    <View className="overflow-hidden rounded-2xl border border-secondary bg-surface">
      <View className="h-40 w-full items-center justify-center bg-secondary">
        <Image
          source={image}
          accessibilityLabel={meme.frase}
          resizeMode="cover"
          className="h-40 w-full"
        />
      </View>
      <View className="p-4">
        <Text className="text-xs font-black tracking-widest text-primary">{meme.titulo}</Text>
        <Text className="mt-2 text-lg font-extrabold leading-6 text-text">{meme.frase}</Text>
        <Text className="mt-2 text-sm leading-5 text-muted">{meme.descripcion}</Text>
      </View>
    </View>
  );
}
