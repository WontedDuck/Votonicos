/* global __dirname */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const ts = require('typescript');

const appDirectory = path.resolve(__dirname, '..');
const servicePath = path.join(appDirectory, 'src/services/electoralService.ts');
const source = fs.readFileSync(servicePath, 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    resolveJsonModule: true,
    target: ts.ScriptTarget.ES2022,
  },
});
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith('@/src/mocks/')) {
    return path.join(appDirectory, 'src/mocks', request.slice('@/src/mocks/'.length));
  }
  if (request.startsWith('@/src/data/')) {
    return path.join(appDirectory, 'src/data', request.slice('@/src/data/'.length));
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const serviceModule = new Module(servicePath, module);
serviceModule.filename = servicePath;
serviceModule.paths = Module._nodeModulePaths(path.dirname(servicePath));
serviceModule._compile(outputText, servicePath);
Module._resolveFilename = originalResolveFilename;

async function main() {
  const filters = { alcaldia: 'Todas', rangoEdad: 'Todos', sexo: 'Todos' };
  const options = await serviceModule.exports.getElectoralFilterOptions();
  const latestRecords = await serviceModule.exports.getMetricsByAlcaldia(filters);
  const records2012 = await serviceModule.exports.getMetricsByAlcaldia(filters, 2012);
  const history = await serviceModule.exports.getHistoricalTrend(filters);
  const ageRecords = await serviceModule.exports.getMetricsByAlcaldia({
    ...filters,
    rangoEdad: '18-19',
  });
  const raw2024Alcaldias = require('../src/mocks/2024/paso1_alcaldias_jovenes.json');
  const raw2024Ages = require('../src/mocks/2024/paso2_desglose_por_edad.json');
  const raw2024Sexes = require('../src/mocks/2024/paso3_brecha_genero.json');
  const cdmxAlcaldias = require('../src/data/cdmxAlcaldias.json');
  const rawTlahuac = raw2024Alcaldias.find((row) => row.MPIONOM === 'Tláhuac');
  const azcapotzalcoAges = raw2024Ages.filter(
    (row) => row.MPIONOM === 'Azcapotzalco' && row.EDAD >= 18 && row.EDAD <= 19
  );
  const expectedAgeRate =
    azcapotzalcoAges.reduce((sum, row) => sum + row.LN * row.PCT_ABSTENCION, 0) /
    azcapotzalcoAges.reduce((sum, row) => sum + row.LN, 0);
  const womenRecords = await serviceModule.exports.getMetricsByAlcaldia({
    ...filters,
    sexo: 'Mujer',
  });
  const unspecifiedSexRecords = await serviceModule.exports.getMetricsByAlcaldia({
    ...filters,
    sexo: 'No especificado',
  });
  const estimatedCross = await serviceModule.exports.getMetricsByAlcaldia({
    ...filters,
    rangoEdad: '18-19',
    sexo: 'Mujer',
  });
  const sections = await serviceModule.exports.getCriticalSections(2024, filters);

  assert.equal(latestRecords.length, 16);
  assert.equal(latestRecords[0].AELEC, 2024);
  assert.equal(records2012.length, 16);
  assert.ok(records2012.every((record) => record.AELEC === 2012));
  for (const year of [2009, 2012, 2015, 2018, 2021, 2024]) {
    const records = await serviceModule.exports.getMetricsByAlcaldia(filters, year);
    assert.ok(records.length > 0, `Expected records for ${year}`);
    assert.ok(records.every((record) => record.AELEC === year));
  }
  assert.equal(
    latestRecords.find((row) => row.MPIONOM === 'Tláhuac').tasaParticipacion,
    rawTlahuac.PCT_PARTICIPACION
  );
  assert.deepEqual(
    history.map((row) => row.AELEC),
    [2009, 2012, 2015, 2018, 2021, 2024]
  );
  assert.equal(ageRecords.length, 16);
  assert.equal(ageRecords[0].AELEC, 2024);
  assert.equal(ageRecords[0].tasaAbstencion, expectedAgeRate);
  assert.ok(ageRecords.every((row) => Number.isFinite(row.tasaParticipacion)));
  assert.equal(womenRecords.length, 16);
  assert.equal(unspecifiedSexRecords.length, 14);
  assert.ok(options.sexos.includes('No especificado'));
  assert.equal(estimatedCross.length, 16);
  assert.ok(estimatedCross.every((record) => record.esEstimado));
  const azcapotzalcoEstimatedCross = estimatedCross.find(
    (record) => record.MPIONOM === 'Azcapotzalco'
  );
  const azcapotzalcoAgeTotals = azcapotzalcoAges.reduce(
    (totals, row) => ({
      LN: totals.LN + row.LN,
      SV: totals.SV + row.SV,
      NV: totals.NV + row.NV,
    }),
    { LN: 0, SV: 0, NV: 0 }
  );
  const azcapotzalcoSexRows = raw2024Sexes.filter((row) => row.MPIONOM === 'Azcapotzalco');
  const azcapotzalcoWomen = azcapotzalcoSexRows.find((row) => row.SEXO_TXT === 'Mujeres');
  const azcapotzalcoSexTotals = azcapotzalcoSexRows.reduce(
    (totals, row) => ({
      LN: totals.LN + row.LN,
      SV: totals.SV + row.SV,
      NV: totals.NV + row.NV,
    }),
    { LN: 0, SV: 0, NV: 0 }
  );
  assert.equal(
    azcapotzalcoEstimatedCross.LN,
    Math.round((azcapotzalcoAgeTotals.LN * azcapotzalcoWomen.LN) / azcapotzalcoSexTotals.LN)
  );
  assert.equal(
    azcapotzalcoEstimatedCross.SV,
    Math.round((azcapotzalcoAgeTotals.SV * azcapotzalcoWomen.SV) / azcapotzalcoSexTotals.SV)
  );
  assert.equal(
    azcapotzalcoEstimatedCross.NV,
    Math.round((azcapotzalcoAgeTotals.NV * azcapotzalcoWomen.NV) / azcapotzalcoSexTotals.NV)
  );
  for (const rangoEdad of ['18-19', '20-24', '25-29']) {
    for (const sexo of ['Mujer', 'Hombre', 'No especificado']) {
      const combinedRecords = await serviceModule.exports.getMetricsByAlcaldia({
        ...filters,
        rangoEdad,
        sexo,
      });
      assert.ok(combinedRecords.length > 0, `Expected data for ${rangoEdad} / ${sexo}`);
      assert.ok(combinedRecords.every((record) => record.esEstimado));
      assert.ok(
        combinedRecords.every(
          (record) =>
            Number.isFinite(record.LN) &&
            Number.isFinite(record.SV) &&
            Number.isFinite(record.NV) &&
            Number.isFinite(record.tasaParticipacion) &&
            Number.isFinite(record.tasaAbstencion)
        )
      );
    }
  }
  assert.equal(sections.length, 5);
  assert.ok(sections.every((row) => Number.isFinite(row.tasaAbstencion)));
  assert.ok(
    sections.every(
      (row, index) => index === 0 || sections[index - 1].tasaAbstencion >= row.tasaAbstencion
    )
  );

  const scenario = await serviceModule.exports.calculateWhatIfImpact({
    ...filters,
    porcentajeMovilizacion: 0,
  });
  assert.equal(scenario.votosAdicionales, 0);
  assert.equal(scenario.tasaParticipacionActual, scenario.nuevaTasaParticipacion);
  assert.equal(scenario.proporcionJovenActual, 100);
  assert.equal(scenario.nuevaProporcionJoven, 100);

  const selectedYouthRecords = await serviceModule.exports.getMetricsByAlcaldia({
    alcaldia: 'Azcapotzalco',
    rangoEdad: '18-19',
    sexo: 'Todos',
  });
  const selectedYouthRecord = selectedYouthRecords[0];
  const totalYouthRecord = latestRecords.find((row) => row.MPIONOM === 'Azcapotzalco');
  const ageScenario = await serviceModule.exports.calculateWhatIfImpact({
    alcaldia: 'Azcapotzalco',
    rangoEdad: '18-19',
    sexo: 'Todos',
    porcentajeMovilizacion: 100,
  });
  assert.equal(
    ageScenario.proporcionJovenActual,
    (selectedYouthRecord.SV / totalYouthRecord.SV) * 100
  );
  assert.equal(
    ageScenario.nuevaProporcionJoven,
    ((selectedYouthRecord.SV + selectedYouthRecord.NV) /
      (totalYouthRecord.SV + selectedYouthRecord.NV)) *
      100
  );

  const locationSource = fs.readFileSync(
    path.join(appDirectory, 'src/services/locationService.ts'),
    'utf8'
  );
  const locationCode = ts.transpileModule(locationSource, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const mockLocation = {
    Accuracy: { High: 4 },
    hasServicesEnabledAsync: async () => true,
    getCurrentPositionAsync: async () => {
      const cuajimalpa = cdmxAlcaldias.features.find(
        (feature) => feature.properties.nombre === 'Cuajimalpa de Morelos'
      );
      return {
        coords: {
          latitude: cuajimalpa.properties.label_lat,
          longitude: cuajimalpa.properties.label_lng,
        },
      };
    },
    requestForegroundPermissionsAsync: async () => ({
      status: 'granted',
      canAskAgain: true,
    }),
    reverseGeocodeAsync: async () => [
      {
        district: 'Colonia Centro',
        subregion: 'Mexico City',
        name: 'Cuajimalpa de Morelos',
        city: 'Ciudad de México',
      },
    ],
  };
  const originalLoad = Module._load;
  Module._load = function (request, parent, isMain) {
    if (request === '@/src/data/cdmxAlcaldias.json') {
      return cdmxAlcaldias;
    }
    if (request === 'expo-location') {
      return mockLocation;
    }
    if (request === '@/src/services/electoralService') {
      return serviceModule.exports;
    }
    return originalLoad.call(this, request, parent, isMain);
  };

  const locationPath = path.join(appDirectory, 'src/services/locationService.ts');
  const locationModule = new Module(locationPath, module);
  locationModule.filename = locationPath;
  locationModule.paths = Module._nodeModulePaths(path.dirname(locationPath));
  locationModule._compile(locationCode, locationPath);
  const detectedAlcaldia = await locationModule.exports.getCurrentAlcaldia();
  Module._load = originalLoad;

  assert.equal(detectedAlcaldia, 'Cuajimalpa de Morelos');
  const alcaldias = options.alcaldias.filter((alcaldia) => alcaldia !== 'Todas');
  for (const feature of cdmxAlcaldias.features) {
    assert.equal(
      locationModule.exports.findAlcaldiaByCoordinates(
        {
          latitude: feature.properties.label_lat,
          longitude: feature.properties.label_lng,
        },
        alcaldias
      ),
      feature.properties.nombre
    );
  }
  assert.equal(
    locationModule.exports.findAlcaldiaInAddressFields(
      ['Colonia Lindavista', 'Gustavo A. Madero', 'Ciudad de México'],
      alcaldias
    ),
    'Gustavo A. Madero'
  );
  assert.equal(
    locationModule.exports.findAlcaldiaInAddressFields(
      ['Av. Insurgentes Sur', 'Alcaldía Benito Juárez, CDMX'],
      alcaldias
    ),
    'Benito Juárez'
  );
  assert.equal(
    locationModule.exports.findAlcaldiaInAddressFields(
      ['Ciudad de México', 'Delegación La Magdalena Contreras'],
      alcaldias
    ),
    'La Magdalena Contreras'
  );
  assert.equal(
    locationModule.exports.findAlcaldiaInAddressFields(
      ['Colonia Centro', 'Tláhuac, Ciudad de México'],
      alcaldias
    ),
    'Tláhuac'
  );

  const memeImagesPath = path.join(appDirectory, 'src/constants/memeImages.ts');
  const memeImagesCode = ts.transpileModule(fs.readFileSync(memeImagesPath, 'utf8'), {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const memeImagesModule = new Module(memeImagesPath, module);
  memeImagesModule.filename = memeImagesPath;
  memeImagesModule.paths = Module._nodeModulePaths(path.dirname(memeImagesPath));
  const originalPngLoader = require.extensions['.png'];
  require.extensions['.png'] = (loadedModule, filename) => {
    loadedModule.exports = filename;
  };
  try {
    memeImagesModule._compile(memeImagesCode, memeImagesPath);
  } finally {
    if (originalPngLoader) {
      require.extensions['.png'] = originalPngLoader;
    } else {
      delete require.extensions['.png'];
    }
  }
  let previousImageId;
  for (let index = 0; index < 12; index += 1) {
    const image = memeImagesModule.exports.getRandomMemeImage(previousImageId);
    assert.ok(image.id.startsWith('meme-'));
    assert.ok(fs.existsSync(path.join(appDirectory, 'assets/memes', `${image.id}.png`)));
    assert.notEqual(image.id, previousImageId);
    previousImageId = image.id;
  }
  console.log('Electoral service checks passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
