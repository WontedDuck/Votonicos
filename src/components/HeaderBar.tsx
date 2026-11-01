import { Text, View } from 'react-native';

export function HeaderBar() {
  return (
    <View
      accessibilityRole="header"
      accessibilityLabel="Votonicos, datos cívicos sin rollo"
      className="flex-row items-center border-b border-secondary bg-surface px-5 py-3">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary">
        <Text className="text-lg font-black text-textbutton">V</Text>
      </View>
      <View>
        <Text className="text-xl font-black tracking-tight text-primary">Votonicos</Text>
        <Text className="text-xs text-muted">El tónico cívico que transforma la indiferencia</Text>
      </View>
    </View>
  );
}
