import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { MemeCard } from '@/src/components/MemeCard';
import { getRandomMeme } from '@/src/constants/memesData';
import { getRandomMemeImage } from '@/src/constants/memeImages';
import type { MemeCategory, MemePhrase } from '@/src/types/memes';

interface MemeSpotlightProps {
  category: MemeCategory;
}

export function MemeSpotlight({ category }: MemeSpotlightProps) {
  const [meme, setMeme] = useState<MemePhrase>(() => getRandomMeme(category));
  const [image, setImage] = useState(() => getRandomMemeImage());

  function showAnotherMeme() {
    const nextMeme = getRandomMeme(category);
    setMeme(nextMeme);
    setImage(getRandomMemeImage(image.id));
  }

  return (
    <View className="gap-2">
      <MemeCard meme={meme} image={image.source} />
      <Pressable
        accessibilityRole="button"
        onPress={showAnotherMeme}
        className="self-end rounded-full border border-secondary bg-surface px-4 py-2">
        <Text className="text-sm font-semibold text-primary">Ver otro meme</Text>
      </Pressable>
    </View>
  );
}
