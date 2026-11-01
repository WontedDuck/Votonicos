import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useElectoralFilterOptions } from '@/src/hooks/useElectoralData';
import { getCurrentAlcaldia } from '@/src/services/locationService';
import type { ElectoralFilters } from '@/src/types/electoral';

interface ElectoralProfileFormProps {
  initialFilters?: ElectoralFilters;
  onSubmit?: (filters: ElectoralFilters) => void;
}

interface ChoiceProps<T extends string> {
  label: string;
  options: T[];
  value: T;
  onSelect: (value: T) => void;
}

interface DropdownSelectProps<T extends string> {
  label: string;
  options: T[];
  value: T;
  onSelect: (value: T) => void;
}

const defaultFilters: ElectoralFilters = {
  alcaldia: 'Todas',
  rangoEdad: 'Todos',
  sexo: 'Todos',
};

function DropdownSelect<T extends string>({
  label,
  options,
  value,
  onSelect,
}: DropdownSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-bold text-text">{label}</Text>

      {/* Botón de selección principal */}
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        className="flex-row items-center justify-between rounded-2xl border border-secondary bg-background px-4 py-3.5">
        <Text className="text-base font-medium text-text">{value}</Text>
        <Text className="text-sm font-bold text-muted">{isOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {/* Modal con la lista desplegable de alcaldías */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable
          className="flex-1 justify-center bg-black/50 p-6"
          onPress={() => setIsOpen(false)}>
          <View className="max-h-[60%] rounded-3xl border border-secondary bg-surface p-5 shadow-xl">
            <Text className="mb-3 text-base font-bold text-text">Selecciona una {label}</Text>
            <ScrollView showsVerticalScrollIndicator>
              {options.map((option) => {
                const selected = option === value;
                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onSelect(option);
                      setIsOpen(false);
                    }}
                    className={`mb-1 flex-row items-center justify-between rounded-xl p-3.5 ${
                      selected ? 'bg-primary/10' : 'active:bg-background'
                    }`}>
                    <Text
                      className={`text-base ${selected ? 'font-bold text-primary' : 'text-text'}`}>
                      {option}
                    </Text>
                    {selected && <Text className="font-bold text-primary">✓</Text>}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function Choice<T extends string>({ label, options, value, onSelect }: ChoiceProps<T>) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-bold text-text">{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2">
        {options.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: option === value }}
            onPress={() => onSelect(option)}
            className={`rounded-full border px-4 py-2 ${
              option === value ? 'border-primary bg-primary' : 'border-secondary bg-surface'
            }`}>
            <Text
              className={`text-sm ${
                option === value ? 'font-semibold text-textbutton' : 'text-text'
              }`}>
              {option}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function ElectoralProfileForm({
  initialFilters = defaultFilters,
  onSubmit,
}: ElectoralProfileFormProps) {
  const router = useRouter();
  const optionsQuery = useElectoralFilterOptions();
  const [filters, setFilters] = useState<ElectoralFilters>(initialFilters);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string>();

  const useLocation = async () => {
    setIsLocating(true);
    setLocationError(undefined);

    try {
      const alcaldia = await getCurrentAlcaldia();
      setFilters((currentFilters) => ({ ...currentFilters, alcaldia }));
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'No se pudo obtener tu ubicación.');
    } finally {
      setIsLocating(false);
    }
  };

  const submit = () => {
    if (onSubmit) {
      onSubmit(filters);
      return;
    }

    router.push({
      pathname: '/radiography',
      params: {
        alcaldia: filters.alcaldia,
        rangoEdad: filters.rangoEdad,
        sexo: filters.sexo,
      },
    });
  };

  return (
    <View className="rounded-3xl border border-secondary bg-surface p-5">
      <Text className="text-2xl font-black text-text">Tu perfil electoral</Text>
      <Text className="mb-5 mt-1 text-sm leading-5 text-muted">
        Elige una zona y un grupo para explorar los datos publicados. Al combinar edad y sexo, las
        cifras se estiman proporcionalmente porque la fuente no publica ese cruce.
      </Text>

      {optionsQuery.isPending ? (
        <Text className="py-4 text-sm text-muted">Cargando opciones de consulta…</Text>
      ) : optionsQuery.isError ? (
        <Text className="py-4 text-sm text-error">
          No se pudieron cargar las opciones: {optionsQuery.error.message}
        </Text>
      ) : optionsQuery.data ? (
        <>
          {/* Desplegable interactivo para Alcaldías */}
          <DropdownSelect
            label="Alcaldía"
            options={optionsQuery.data.alcaldias}
            value={filters.alcaldia}
            onSelect={(alcaldia) => setFilters({ ...filters, alcaldia })}
          />

          {/* Opciones de selección en píldoras horizontales para Edad y Sexo */}
          <Choice
            label="Rango de edad"
            options={optionsQuery.data.rangosEdad}
            value={filters.rangoEdad}
            onSelect={(rangoEdad) => setFilters({ ...filters, rangoEdad })}
          />
          <Choice
            label="Sexo"
            options={optionsQuery.data.sexos}
            value={filters.sexo}
            onSelect={(sexo) => setFilters({ ...filters, sexo })}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isLocating }}
            disabled={isLocating}
            onPress={useLocation}
            className="mb-3 flex-row items-center justify-center gap-2 rounded-2xl border border-primary px-5 py-3">
            {isLocating ? <ActivityIndicator /> : null}
            <Text className="font-bold text-primary">
              {isLocating ? 'Buscando tu alcaldía…' : 'Usar mi ubicación'}
            </Text>
          </Pressable>

          {locationError ? (
            <Text accessibilityRole="alert" className="mb-3 text-sm text-error">
              {locationError}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={submit}
            className="items-center rounded-2xl bg-primary px-5 py-4">
            <Text className="text-base font-bold text-textbutton">
              Ver mi impacto electoral &gt;
            </Text>
          </Pressable>

          <Text className="mt-4 text-center text-xs leading-5 text-muted">
            No guardamos información personal. Tus respuestas son anónimas.
          </Text>
        </>
      ) : null}
    </View>
  );
}
