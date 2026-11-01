import { useRef, useState } from 'react';
import { Alert, Image, Platform, Pressable, Share, Text, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import ViewShot, { type ViewShotRef } from 'react-native-view-shot';

import { getRandomMeme } from '@/src/constants/memesData';
import { getRandomMemeImage } from '@/src/constants/memeImages';
import type { WhatIfResult } from '@/src/types/electoral';
import type { MemePhrase } from '@/src/types/memes';

interface ImpactResultCardProps {
  result: WhatIfResult;
  isLoading?: boolean;
}

const numberFormat = new Intl.NumberFormat('es-MX');

export function ImpactResultCard({ result, isLoading = false }: ImpactResultCardProps) {
  const [shareMeme, setShareMeme] = useState<MemePhrase>(() => getRandomMeme('equivalencia_real'));
  const [shareImage, setShareImage] = useState(() => getRandomMemeImage());
  const [isShareImageReady, setIsShareImageReady] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const shareCardRef = useRef<ViewShotRef>(null);

  const getShareMessage = (meme: MemePhrase) =>
    `${meme.frase}\n\nEscenario hipotético en Votonicos: +${numberFormat.format(result.votosAdicionales)} votos potenciales. Participación: ${result.tasaParticipacionActual.toFixed(1)}% → ${result.nuevaTasaParticipacion.toFixed(1)}%. Representación del grupo seleccionado en el voto joven: ${result.proporcionJovenActual.toFixed(1)}% → ${result.nuevaProporcionJoven.toFixed(1)}%. No es un resultado ni pronóstico electoral.`;

  const shareResult = async () => {
    setIsSharing(true);
    try {
      const message = getShareMessage(shareMeme);
      if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
        await Share.share({ message });
      } else {
        if (!isShareImageReady) {
          throw new Error('La imagen para compartir todavía se está preparando.');
        }
        const imageUri = await shareCardRef.current?.capture();
        if (!imageUri) {
          throw new Error('No se pudo generar la imagen del resultado.');
        }
        await Sharing.shareAsync(imageUri, {
          dialogTitle: 'Compartir este escenario',
          mimeType: 'image/png',
          UTI: 'public.png',
        });
      }

      setShareMeme(getRandomMeme('equivalencia_real'));
      setShareImage(getRandomMemeImage(shareImage.id));
      setIsShareImageReady(false);
    } catch (error) {
      Alert.alert(
        'No se pudo compartir',
        error instanceof Error ? error.message : 'Ocurrió un error al preparar el resultado.'
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View className="gap-4">
      <View className="overflow-hidden rounded-3xl bg-primary p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xs font-black tracking-[2px] text-textbutton">
            ESCENARIO HIPOTÉTICO
          </Text>
          {isLoading ? (
            <Text className="text-xs font-semibold text-textbutton">Actualizando…</Text>
          ) : null}
        </View>
        <Text className="text-center text-4xl font-black text-textbutton">
          +{numberFormat.format(result.votosAdicionales)}
        </Text>
        <Text className="mt-1 text-center text-sm font-bold uppercase tracking-widest text-textbutton">
          votos adicionales
        </Text>

        <View className="mt-5 flex-row items-center justify-between rounded-2xl bg-background p-4">
          <View>
            <Text className="text-[10px] font-semibold text-muted">Tasa reportada</Text>
            <Text className="mt-1 text-lg font-black text-text">
              {result.tasaParticipacionActual.toFixed(1)}%
            </Text>
          </View>
          <Text className="text-xl font-bold text-muted">→</Text>
          <View className="items-end">
            <Text className="text-[10px] font-semibold text-muted">Tasa bajo este supuesto</Text>
            <Text className="mt-1 text-lg font-black text-text">
              {result.nuevaTasaParticipacion.toFixed(1)}%
            </Text>
          </View>
        </View>

        <View className="mt-3 rounded-2xl bg-background p-4">
          <Text className="text-xs font-bold text-text">Representación juvenil en las urnas</Text>
          <Text className="mt-1 text-[10px] leading-4 text-muted">
            Parte del voto joven que aporta el grupo seleccionado en este escenario.
          </Text>
          <View className="mt-3 flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-semibold text-muted">Actual</Text>
              <Text className="mt-1 text-lg font-black text-text">
                {result.proporcionJovenActual.toFixed(1)}%
              </Text>
            </View>
            <Text className="text-xl font-bold text-muted">→</Text>
            <View className="items-end">
              <Text className="text-[10px] font-semibold text-muted">Con movilización</Text>
              <Text className="mt-1 text-lg font-black text-text">
                {result.nuevaProporcionJoven.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={shareResult}
        disabled={isLoading || isSharing || (Platform.OS !== 'web' && !isShareImageReady)}
        className="items-center rounded-2xl bg-primary px-5 py-4">
        <Text className="font-bold text-textbutton">
          {isSharing
            ? 'Preparando imagen…'
            : !isShareImageReady && Platform.OS !== 'web'
              ? 'Cargando imagen…'
              : 'Compartir este dato'}
        </Text>
      </Pressable>

      <ViewShot
        ref={shareCardRef}
        options={{ format: 'png', quality: 1 }}
        style={{
          alignSelf: 'center',
          backgroundColor: '#3d2066',
          borderRadius: 24,
          overflow: 'hidden',
          width: '100%',
        }}>
        <Image
          source={shareImage.source}
          onLoad={() => setIsShareImageReady(true)}
          onError={() => setIsShareImageReady(false)}
          resizeMode="cover"
          style={{ height: 190, width: '100%' }}
        />
        <View style={{ padding: 20 }}>
          <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '900' }}>
            {shareMeme.titulo}
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '900', marginTop: 8 }}>
            {shareMeme.frase}
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 14, marginTop: 12 }}>
            +{numberFormat.format(result.votosAdicionales)} votos potenciales
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 13, marginTop: 6 }}>
            Participación: {result.tasaParticipacionActual.toFixed(1)}% →{' '}
            {result.nuevaTasaParticipacion.toFixed(1)}%
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 13, marginTop: 4 }}>
            Representación juvenil: {result.proporcionJovenActual.toFixed(1)}% →{' '}
            {result.nuevaProporcionJoven.toFixed(1)}%
          </Text>
          <Text style={{ color: '#e8def8', fontSize: 11, marginTop: 12 }}>
            Escenario hipotético · No es un resultado ni pronóstico electoral.
          </Text>
        </View>
      </ViewShot>
    </View>
  );
}
