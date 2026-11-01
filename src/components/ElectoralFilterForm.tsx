import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { ElectoralFilterOptions, ElectoralFilters } from '@/src/types/electoral';

interface ElectoralFilterFormProps {
  options: ElectoralFilterOptions;
  filters: ElectoralFilters;
  onChange: (filters: ElectoralFilters) => void;
}

interface DropdownSelectProps<T extends string> {
  label: string;
  options: T[];
  value: T;
  onSelect: (value: T) => void;
}

function DropdownSelect<T extends string>({
  label,
  options,
  value,
  onSelect,
}: DropdownSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-text">{label}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        className="flex-row items-center justify-between rounded-xl border border-secondary bg-background px-4 py-3">
        <Text className="text-base font-medium text-text">{value}</Text>
        <Text className="text-sm font-bold text-muted">{isOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {/* Menú modal desplegable */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable
          className="flex-1 justify-center bg-black/50 p-6"
          onPress={() => setIsOpen(false)}>
          <View className="max-h-[60%] rounded-2xl border border-secondary bg-surface p-4 shadow-lg">
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
                      className={`text-base ${
                        selected ? 'font-bold text-primary' : 'text-text'
                      }`}>
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

interface FilterChoicesProps<T extends string> {
  label: string;
  options: T[];
  value: T;
  onSelect: (value: T) => void;
}

function FilterChoices<T extends string>({
  label,
  options,
  value,
  onSelect,
}: FilterChoicesProps<T>) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-text">{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelect(option)}
              className={`rounded-full border px-4 py-2 ${
                selected ? 'border-primary bg-primary' : 'border-secondary bg-surface'
              }`}>
              <Text
                className={`text-sm ${selected ? 'font-semibold text-textbutton' : 'text-text'}`}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function ElectoralFilterForm({ options, filters, onChange }: ElectoralFilterFormProps) {
  return (
    <View className="rounded-2xl border border-secondary bg-surface p-4">
      <Text className="mb-4 text-lg font-bold text-text">Filtros de consulta</Text>
      <DropdownSelect
        label="Alcaldía"
        options={options.alcaldias}
        value={filters.alcaldia}
        onSelect={(alcaldia) => onChange({ ...filters, alcaldia })}
      />
      <FilterChoices
        label="Rango de edad"
        options={options.rangosEdad}
        value={filters.rangoEdad}
        onSelect={(rangoEdad) => onChange({ ...filters, rangoEdad })}
      />
      <FilterChoices
        label="Sexo"
        options={options.sexos}
        value={filters.sexo}
        onSelect={(sexo) => onChange({ ...filters, sexo })}
      />
    </View>
  );
}