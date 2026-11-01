export type MemeCategory = 'abstencion_alta' | 'movilizacion_activa' | 'equivalencia_real';

export interface MemePhrase {
  id: string;
  titulo: string;
  frase: string;
  descripcion: string;
  categoria: MemeCategory;
  rangoPorcentaje: [number, number];
}
