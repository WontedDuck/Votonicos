import * as Location from 'expo-location';

import cdmxAlcaldias from '@/src/data/cdmxAlcaldias.json';
import { getElectoralFilterOptions } from '@/src/services/electoralService';

type Ring = number[][];
type PolygonCoordinates = Ring[];
type BoundaryGeometry =
  | { type: 'Polygon'; coordinates: PolygonCoordinates }
  | { type: 'MultiPolygon'; coordinates: PolygonCoordinates[] };
type BoundaryFeature = {
  properties: { nombre: string };
  geometry: BoundaryGeometry;
};

const boundaryFeatures = cdmxAlcaldias.features as BoundaryFeature[];

function normalizeAddress(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const knownAliases: Record<string, string[]> = {
  'alvaro obregon': ['alvaro obregon'],
  azcapotzalco: ['azcapotzalco'],
  'benito juarez': ['benito juarez'],
  coyoacan: ['coyoacan'],
  'cuajimalpa de morelos': ['cuajimalpa de morelos', 'cuajimalpa'],
  cuauhtemoc: ['cuauhtemoc'],
  'gustavo a madero': ['gustavo a madero', 'gustavo madero', 'gam'],
  iztacalco: ['iztacalco'],
  iztapalapa: ['iztapalapa'],
  'la magdalena contreras': ['la magdalena contreras', 'magdalena contreras'],
  'miguel hidalgo': ['miguel hidalgo'],
  'milpa alta': ['milpa alta'],
  tlahuac: ['tlahuac'],
  tlalpan: ['tlalpan'],
  'venustiano carranza': ['venustiano carranza'],
  xochimilco: ['xochimilco'],
};

export function findAlcaldiaInAddressFields(
  addressFields: (string | null | undefined)[],
  alcaldias: string[]
) {
  const normalizedFields = addressFields
    .filter((field): field is string => Boolean(field))
    .map(normalizeAddress);

  for (const field of normalizedFields) {
    const match = alcaldias.find((alcaldia) => {
      const normalizedAlcaldia = normalizeAddress(alcaldia);
      const aliases = knownAliases[normalizedAlcaldia] ?? [normalizedAlcaldia];

      return aliases.some((alias) => ` ${field} `.includes(` ${alias} `));
    });
    if (match) {
      return match;
    }
  }

  return undefined;
}

function isPointOnSegment(longitude: number, latitude: number, start: number[], end: number[]) {
  const startLongitude = start[0];
  const startLatitude = start[1];
  const endLongitude = end[0];
  const endLatitude = end[1];
  if (
    startLongitude === undefined ||
    startLatitude === undefined ||
    endLongitude === undefined ||
    endLatitude === undefined
  ) {
    return false;
  }

  const cross =
    (longitude - startLongitude) * (endLatitude - startLatitude) -
    (latitude - startLatitude) * (endLongitude - startLongitude);
  const tolerance = 1e-10;
  return (
    Math.abs(cross) <= tolerance &&
    longitude >= Math.min(startLongitude, endLongitude) - tolerance &&
    longitude <= Math.max(startLongitude, endLongitude) + tolerance &&
    latitude >= Math.min(startLatitude, endLatitude) - tolerance &&
    latitude <= Math.max(startLatitude, endLatitude) + tolerance
  );
}

function isPointInRing(longitude: number, latitude: number, ring: Ring) {
  let isInside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const point = ring[index];
    const previousPoint = ring[previous];
    if (!point || !previousPoint) {
      continue;
    }

    if (isPointOnSegment(longitude, latitude, point, previousPoint)) {
      return true;
    }

    const pointLongitude = point[0];
    const pointLatitude = point[1];
    const previousLongitude = previousPoint[0];
    const previousLatitude = previousPoint[1];
    if (
      pointLongitude === undefined ||
      pointLatitude === undefined ||
      previousLongitude === undefined ||
      previousLatitude === undefined
    ) {
      continue;
    }

    if (
      pointLatitude > latitude !== previousLatitude > latitude &&
      longitude <
        ((previousLongitude - pointLongitude) * (latitude - pointLatitude)) /
          (previousLatitude - pointLatitude) +
          pointLongitude
    ) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function isPointInPolygon(longitude: number, latitude: number, rings: PolygonCoordinates) {
  const [outerRing, ...holes] = rings;
  return (
    outerRing !== undefined &&
    isPointInRing(longitude, latitude, outerRing) &&
    !holes.some((hole) => isPointInRing(longitude, latitude, hole))
  );
}

export function findAlcaldiaByCoordinates(
  coordinates: Pick<Location.LocationObjectCoords, 'latitude' | 'longitude'>,
  alcaldias: string[]
) {
  // Use local INEGI boundaries first because reverse geocoders may only return the city or colonia.
  const match = boundaryFeatures.find((feature) => {
    const polygonParts =
      feature.geometry.type === 'Polygon'
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;

    return polygonParts.some((polygon) =>
      isPointInPolygon(coordinates.longitude, coordinates.latitude, polygon)
    );
  });

  return alcaldias.find(
    (alcaldia) => match && normalizeAddress(alcaldia) === normalizeAddress(match.properties.nombre)
  );
}

export async function getCurrentAlcaldia(): Promise<string> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') {
    throw new Error(
      permission.canAskAgain
        ? 'Se necesita permiso de ubicación para identificar tu alcaldía.'
        : 'El permiso de ubicación está bloqueado. Habilítalo en los ajustes de la aplicación.'
    );
  }

  if (!(await Location.hasServicesEnabledAsync())) {
    throw new Error('Activa los servicios de ubicación del teléfono e inténtalo de nuevo.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
    mayShowUserSettingsDialog: true,
  });
  const alcaldias = (await getElectoralFilterOptions()).alcaldias.filter(
    (alcaldia) => alcaldia !== 'Todas'
  );
  const coordinateMatch = findAlcaldiaByCoordinates(position.coords, alcaldias);
  if (coordinateMatch) {
    return coordinateMatch;
  }

  let addresses: Location.LocationGeocodedAddress[];
  try {
    addresses = await Location.reverseGeocodeAsync(position.coords);
  } catch (error) {
    const reason = error instanceof Error ? ` ${error.message}` : '';
    throw new Error(
      `El teléfono obtuvo tu ubicación, pero no pudo convertirla en una dirección. Revisa tu conexión y vuelve a intentar.${reason}`
    );
  }

  const addressFields = addresses.flatMap((address) => [
    address.subregion,
    address.district,
    address.city,
    address.region,
    address.name,
    address.street,
    address.streetNumber,
    address.postalCode,
    address.country,
  ]);

  const match = findAlcaldiaInAddressFields(addressFields, alcaldias);
  if (match) {
    return match;
  }

  throw new Error(
    addresses.length === 0
      ? 'El teléfono obtuvo tu ubicación, pero el servicio de direcciones no devolvió resultados. Puedes elegir la alcaldía manualmente.'
      : 'Se obtuvo una dirección, pero no contiene una alcaldía reconocible de CDMX. Puedes elegirla manualmente.'
  );
}
