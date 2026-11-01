import type { ImageSourcePropType } from 'react-native';

const memeImages = [
  { id: 'meme-01', source: require('../../assets/memes/gato.jpg') },
  { id: 'meme-03', source: require('../../assets/memes/kurt_angle_meme.jpg') },
  { id: 'meme-04', source: require('../../assets/memes/militar.jpg') },
  { id: 'meme-05', source: require('../../assets/memes/Pensando.jpg') },
  { id: 'meme-06', source: require('../../assets/memes/gato2.jpg') },
] satisfies { id: string; source: ImageSourcePropType }[];

export function getRandomMemeImage(previousId?: string) {
  const alternatives = memeImages.filter((image) => image.id !== previousId);
  const choices = alternatives.length > 0 ? alternatives : memeImages;
  return choices[Math.floor(Math.random() * choices.length)];
}
