import type { MemeCategory, MemePhrase } from '@/src/types/memes';

export const MEMES_CATALOGO: MemePhrase[] = [
  {
    id: 'estadio-azul',
    titulo: 'DATO CON TANTITO BARRIO',
    frase: 'Una grada llena también puede ser una cifra.',
    descripcion: 'Compara el volumen de votos con espacios conocidos de la ciudad.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },
  {
    id: 'fila-de-tacos',
    titulo: 'DATO CON TANTITO BARRIO',
    frase: 'Más larga que la fila de los tacos de canasta a la hora de salida.',
    descripcion: 'Las equivalencias cotidianas ayudan a poner los números en contexto.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },
  {
    id: 'metro-pantitlan',
    titulo: 'EQUIVALENCIA CHILANGA',
    frase: 'Más gente junta que en el transbordo de Pantitlán a las 8:00 AM.',
    descripcion: 'Si toda esta banda se juntara, no caben ni en el andén principal.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },
  {
    id: 'zocalo-lleno',
    titulo: 'EQUIVALENCIA CHILANGA',
    frase: 'Suficiente banda para llenar el Zócalo en concierto gratuito.',
    descripcion: 'Visualiza la cantidad de votos adicionales ocupando la plaza principal.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },
  {
    id: 'auditorio-nacional',
    titulo: 'EQUIVALENCIA CHILANGA',
    frase: 'Es como llenar 4 veces seguidas el Auditorio Nacional.',
    descripcion: 'Ponemos en dimensión física a las personas que faltaron a las urnas.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },
  {
    id: 'cablebus-iztapalapa',
    titulo: 'EQUIVALENCIA CHILANGA',
    frase: 'Toda la fila del Cablebús en hora pico multiplicada por diez.',
    descripcion: 'Compara el volumen de la Lista Nominal con el transporte masivo.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },
  {
    id: 'metrobus-insurgentes',
    titulo: 'EQUIVALENCIA CHILANGA',
    frase: 'Llenaría una fila de Metrobuses de Indios Verdes a El Caminero.',
    descripcion: 'El volumen de abstención joven equivale a la masa del transporte público.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },
  {
    id: 'tianguis-el-salado',
    titulo: 'EQUIVALENCIA CHILANGA',
    frase: 'Más apretados que tianguis dominguero en día de quincena.',
    descripcion: 'Comparación del volumen poblacional con mercados tradicionales de la CDMX.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },
  {
    id: 'palacio-de-deportes',
    titulo: 'EQUIVALENCIA CHILANGA',
    frase: 'Suficientes jóvenes como para retacar el Domo de Cobre.',
    descripcion: 'Una cifra impresionante cuando la conviertes en presencia ciudadana.',
    categoria: 'equivalencia_real',
    rangoPorcentaje: [0, 100],
  },

  // --- ABSTENCIÓN ALTA (HUMOR BLANCO E IRÓNICO) ---
  {
    id: 'ine-para-el-antro',
    titulo: 'MOMENTO MÁS HUMILDE',
    frase: 'La sacaste a los 18 solo para el trámite y ahí sigue empolvada.',
    descripcion: 'Tu credencial sirve para definir tu alcaldía, no solo para guardarla en la cartera.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [40, 100],
  },
  {
    id: 'paloma-bellas-artes',
    titulo: 'ALERTA DE ABSTENCIÓN',
    frase: 'La paloma de Bellas Artes ha tenido más participación activa.',
    descripcion: 'En las secciones con alta abstención la casilla parece escenario desértico.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [50, 100],
  },
  {
    id: 'evento-canonico',
    titulo: 'EVENTO CANÓNICO',
    frase: 'Quejarse del tráfico y los baches sin haber parado en la casilla.',
    descripcion: 'No se puede exigir buen lore en la ciudad si nadie va a decidirlo.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [30, 100],
  },
  {
    id: 'metro-domingo-6am',
    titulo: 'ALERTA DE DESIERTO',
    frase: 'La casilla estuvo más sola que el Metro La Raza un domingo a las 6:00 AM.',
    descripcion: 'Refleja zonas donde más de la mitad de los jóvenes no asistieron a votar.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [45, 100],
  },
  {
    id: 'ex-que-no-vuelve',
    titulo: 'MOMENTO HUMILDE',
    frase: 'Le diste 5 oportunidades a tu ex, pero 0 a tu boleta electoral.',
    descripcion: 'Hay decisiones que sí cambian tu futuro de verdad.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [35, 100],
  },
  {
    id: 'clima-excusa',
    titulo: 'RATING DE EXCUSAS',
    frase: '10/10: "Iba a ir a votar pero empezó a lloviznar en la tarde".',
    descripcion: 'La apatía suele disfrazarse de pretextos climáticos cotidianos.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [40, 100],
  },
  {
    id: 'stories-instagram',
    titulo: 'MOMENTO HUMILDE',
    frase: 'Viste 80 historias en el celular, pero te dio flojera cruzar la calle a la casilla.',
    descripcion: '15 minutos en la urna frente al tiempo promedio en redes sociales.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [35, 100],
  },
  {
    id: 'tarifa-dinamica',
    titulo: 'ALERTA DE DESIERTO',
    frase: 'Casilla más abandonada que viaje en aplicación con tarifa 4.0x.',
    descripcion: 'Representación irónica de la baja afluencia en votaciones locales.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [50, 100],
  },
  {
    id: 'cadenas-whatsapp',
    titulo: 'REALITY CHECK',
    frase: 'Dejaste que el futuro de tu alcaldía lo decidiera la tía de las cadenas de internet.',
    descripcion: 'Cuando los jóvenes no participan, otros grupos deciden el resultado total.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [45, 100],
  },
  {
    id: 'maraton-series',
    titulo: 'RATING DE EXCUSAS',
    frase: 'Te aventaste 8 capítulos seguidos, pero te pesó caminar dos cuadras.',
    descripcion: 'Prioridades del fin de semana electoral frente al compromiso cívico.',
    categoria: 'abstencion_alta',
    rangoPorcentaje: [40, 100],
  },
  {
    id: 'cardio-civico',
    titulo: 'MOVILIZACIÓN FLASH',
    frase: 'Tu boleta acaba de hacer más cardio que tú en todo el mes.',
    descripcion: 'Cada porcentaje que mueves representa miles de jóvenes despertando.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [1, 50],
  },
  {
    id: 'microbusero-furia',
    titulo: 'DATO CON TANTITO BARRIO',
    frase: 'Con esta movilización traes más vuelo que microbús en Periférico.',
    descripcion: 'El voto joven coordinado cambia por completo la velocidad del resultado.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [20, 50],
  },
  {
    id: 'foro-sol-soldout',
    titulo: 'FULL HOUSE CÍVICO',
    frase: 'Hiciste Sold Out en el escenario, pero con puros votos jóvenes.',
    descripcion: 'Cifra de movilización suficiente para dar vuelta a cualquier elección.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [15, 50],
  },
  {
    id: 'beca-quincena',
    titulo: 'PODER JUVENIL',
    frase: 'Se siente más potencia que cobrar la beca en viernes de quincena.',
    descripcion: 'Cuando la franja de 18 a 29 años se activa, se vuelve la primera fuerza.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [10, 50],
  },
  {
    id: 'volteando-la-tortilla',
    titulo: 'MOVILIZACIÓN FLASH',
    frase: 'Le acabas de dar la vuelta a la tortilla democrática de tu zona.',
    descripcion: 'Pasamos de ser minoría en urnas a controlar la decisión de la alcaldía.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [30, 50],
  },
  {
    id: 'prime-civico',
    titulo: 'PRIME CÍVICO',
    frase: 'Entraste en tu Prime: los jóvenes ya representan el 38% del total de votantes.',
    descripcion: 'Reversión del peso democrático al subir la participación juvenil.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [25, 50],
  },
  {
    id: 'remontada-epic',
    titulo: 'PODER JUVENIL',
    frase: 'Ni la mejor remontada en tiempo extra tuvo tanta épica.',
    descripcion: 'Demostración de cómo el abstencionismo se revierte con organización.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [35, 50],
  },
  {
    id: 'tacos-gratis',
    titulo: 'MOVILIZACIÓN FLASH',
    frase: 'Casillas más llenas que si estuvieran regalando tacos de pastor con todo.',
    descripcion: 'Simulación de alta concurrencia juvenil en las urnas.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [15, 50],
  },
  {
    id: 'modo-legendario',
    titulo: 'PRIME CÍVICO',
    frase: 'Desbloqueaste la alcaldía en modo legendario a puros votos jóvenes.',
    descripcion: 'El impacto directo cuando el sector de 18 a 29 años vota masivamente.',
    categoria: 'movilizacion_activa',
    rangoPorcentaje: [40, 50],
  },
];

const lastMemeByCategory = new Map<MemeCategory, string>();

export function getRandomMeme(categoria: string, porcentaje?: number): MemePhrase {
  const validCategory = MEMES_CATALOGO.some((meme) => meme.categoria === categoria)
    ? (categoria as MemeCategory)
    : 'abstencion_alta';
  const candidates = MEMES_CATALOGO.filter(
    (meme) =>
      meme.categoria === validCategory &&
      (porcentaje === undefined ||
        (porcentaje >= meme.rangoPorcentaje[0] && porcentaje <= meme.rangoPorcentaje[1]))
  );
  const categoryCandidates =
    candidates.length > 0
      ? candidates
      : MEMES_CATALOGO.filter((meme) => meme.categoria === validCategory);
  const previousId = lastMemeByCategory.get(validCategory);
  const alternatives = categoryCandidates.filter((meme) => meme.id !== previousId);
  const selectionPool = alternatives.length > 0 ? alternatives : categoryCandidates;
  const selected = selectionPool[Math.floor(Math.random() * selectionPool.length)];
  lastMemeByCategory.set(validCategory, selected.id);

  return selected;
}
