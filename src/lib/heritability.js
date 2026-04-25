// lib/heritabilitas.js

/**
 * Filter data yang valid untuk trait tertentu
 * Hanya menyertakan baris yang memiliki nilai trait (tidak null/undefined/empty)
 * DAN faktor tidak null/undefined/empty
 */
export function filterValidData(data, trait, faktor) {
  return data.filter((row) => {
    // Cek faktor (sire) - harus ada dan tidak kosong
    const faktorValue = row[faktor];
    if (
      faktorValue === undefined ||
      faktorValue === null ||
      faktorValue === ""
    ) {
      return false;
    }

    // Cek trait - harus ada, tidak null, tidak empty, dan bisa dikonversi ke number
    const traitValue = row[trait];
    if (traitValue === undefined || traitValue === null || traitValue === "") {
      return false;
    }

    // Cek apakah bisa dikonversi ke number (valid)
    const numValue = parseFloat(traitValue);
    if (isNaN(numValue)) {
      return false;
    }

    return true;
  });
}

/**
 * Mendapatkan statistik ringkasan data per trait
 */
function getDataSummary(data, trait, faktor) {
  const validData = filterValidData(data, trait, faktor);

  // Kelompokkan berdasarkan faktor untuk melihat kelompok yang memiliki data
  const groupsWithData = {};
  validData.forEach((row) => {
    const faktorValue = String(row[faktor]);
    if (!groupsWithData[faktorValue]) {
      groupsWithData[faktorValue] = [];
    }
    groupsWithData[faktorValue].push(parseFloat(row[trait]));
  });

  const uniqueFaktor = Object.keys(groupsWithData);

  return {
    totalData: data.length,
    validData: validData.length,
    missingData: data.length - validData.length,
    uniqueFaktor: uniqueFaktor.length,
    faktorList: uniqueFaktor,
    groupsWithData: groupsWithData,
  };
}

function estimateAnova(data, trait, faktor) {
  // Filter data yang valid
  const validData = filterValidData(data, trait, faktor);

  if (validData.length === 0) {
    console.warn(`Trait ${trait}: tidak ada data valid`);
    return null;
  }

  // Group data berdasarkan faktor, hanya untuk faktor yang memiliki data
  const groups = {};
  validData.forEach((row) => {
    const faktorValue = String(row[faktor]);
    const traitValue = parseFloat(row[trait]);

    if (!groups[faktorValue]) {
      groups[faktorValue] = [];
    }
    groups[faktorValue].push(traitValue);
  });

  const sireList = Object.keys(groups);
  const countFaktor = sireList.length;

  // Minimal harus ada 2 kelompok dengan data
  if (countFaktor < 2) {
    console.warn(
      `Trait ${trait}: hanya ${countFaktor} kelompok valid, minimal 2`,
    );
    return null;
  }

  const countDataSire = {}; // jumlah anak per sire
  const sumPerSire = {}; // sum bobot anak per sire
  const sumPerSiresquare = {}; // (sum bobot anak per sire)^2
  const n = validData.length; // jumlah populasi
  const antarPejantann = {}; // untuk hitung SSs pada metode anova
  let SSs = 0;

  for (let i in groups) {
    countDataSire[i] = groups[i].length;
  }

  for (let i in groups) {
    const sum = groups[i].reduce((a, b) => a + b, 0);
    sumPerSire[i] = sum;
    sumPerSiresquare[i] = Math.pow(sum, 2);
  }

  for (let i in sumPerSiresquare) {
    const devide = sumPerSiresquare[i] / countDataSire[i];
    antarPejantann[i] = devide;
    SSs += antarPejantann[i];
  }

  let sumTotal = 0; // sum bobot populasi
  let sumSquare = 0; // sum bobot populasi kuadrat
  validData.forEach((g) => {
    const val = parseFloat(g[trait]);
    sumTotal += val;
    sumSquare += Math.pow(val, 2);
  });

  const average = sumTotal / n;
  const fk = Math.pow(sumTotal, 2) / n;
  const sumOfSquareSire = SSs - fk;
  const SSw = sumSquare - SSs;
  const dfSire = countFaktor - 1;
  const dfProgeny = n - countFaktor;

  // Cegah division by zero
  if (dfSire === 0 || dfProgeny === 0) {
    console.warn(`Trait ${trait}: derajat bebas 0`);
    return null;
  }

  const MSs = sumOfSquareSire / dfSire;
  const MSw = SSw / dfProgeny;

  return {
    dfSire,
    dfProgeny,
    sumOfSquareSire,
    SSw,
    MSs,
    MSw,
    nValid: n,
    countFaktor: countFaktor,
    average,
  };
}

function calculateK(data, faktor, trait) {
  // Filter data valid
  const validData = filterValidData(data, trait, faktor);

  if (validData.length === 0) {
    return null;
  }

  const groupByFaktor = {};
  for (let i in validData) {
    const faktorValue = String(validData[i][faktor]);
    if (!groupByFaktor[faktorValue]) {
      groupByFaktor[faktorValue] = [];
    }
    groupByFaktor[faktorValue].push(parseFloat(validData[i][trait]));
  }

  let sumN = 0;
  let sumNSquare = 0;
  for (let n in groupByFaktor) {
    sumN += groupByFaktor[n].length;
    sumNSquare += Math.pow(groupByFaktor[n].length, 2);
  }
  const countFaktor = Object.keys(groupByFaktor).length;

  // Cegah division by zero
  if (countFaktor <= 1) {
    return null;
  }

  const K = (1 / (countFaktor - 1)) * (sumN - sumNSquare / sumN);
  return K;
}

function getUniqueValue(data, attr, trait = null) {
  // Jika trait diberikan, hanya hitung dari data valid untuk trait tersebut
  let sourceData = data;
  if (trait) {
    sourceData = filterValidData(data, trait, attr);
  }

  const uniqueValue = new Set();
  sourceData.forEach((row) => {
    const val = row[attr];
    if (val !== undefined && val !== null && val !== "") {
      uniqueValue.add(String(val));
    }
  });
  return uniqueValue.size;
}

/**
 * Konversi string ke number - hanya konversi nilai yang valid
 */
function convertString(data, traitList) {
  for (let row of data) {
    for (let trait of traitList) {
      let value = row[trait];

      // Skip jika value kosong
      if (value === undefined || value === null || value === "") {
        continue;
      }

      if (typeof value === "string") {
        const converted = parseFloat(value);
        if (!isNaN(converted)) {
          row[trait] = converted;
        }
      }
    }
  }
  return data;
}

export default function estimateHeritability(data, faktor, traitList) {
  // Validasi data
  if (!data || data.length === 0) {
    return { error: "Data kosong" };
  }

  // Konversi string ke number
  convertString(data, traitList);

  const result = {};

  traitList.forEach((trait) => {
    console.log(`\n=== Memproses trait: ${trait} ===`);

    // Cek apakah trait ada dalam data
    if (!data[0] || data[0][trait] === undefined) {
      console.warn(`Trait "${trait}" tidak ditemukan`);
      result[trait] = {
        heritability: "N/A",
        h2: null,
        SE: null,
        error: `Trait "${trait}" tidak ditemukan`,
      };
      return;
    }

    // Dapatkan statistik data
    const summary = getDataSummary(data, trait, faktor);
    console.log(
      `Data summary: total=${summary.totalData}, valid=${summary.validData}, missing=${summary.missingData}, kelompok valid=${summary.uniqueFaktor}`,
    );

    if (summary.validData === 0) {
      result[trait] = {
        heritability: "N/A",
        h2: null,
        SE: null,
        error: `Tidak ada data valid untuk ${trait} (semua kosong)`,
        nTotal: summary.totalData,
        nValid: 0,
        nMissing: summary.missingData,
      };
      return;
    }

    if (summary.uniqueFaktor < 2) {
      result[trait] = {
        heritability: "N/A",
        h2: null,
        SE: null,
        error: `Minimal 2 kelompok diperlukan, hanya ${summary.uniqueFaktor} kelompok valid`,
        nTotal: summary.totalData,
        nValid: summary.validData,
        nMissing: summary.missingData,
        uniqueFaktor: summary.uniqueFaktor,
      };
      return;
    }

    const anovaTable = estimateAnova(data, trait, faktor);

    if (!anovaTable) {
      result[trait] = {
        heritability: "N/A",
        h2: null,
        SE: null,
        error: "ANOVA gagal - data tidak cukup",
        nTotal: summary.totalData,
        nValid: summary.validData,
        nMissing: summary.missingData,
      };
      return;
    }

    const k = calculateK(data, faktor, trait);

    if (k === null || isNaN(k) || k === 0) {
      result[trait] = {
        heritability: "N/A",
        h2: null,
        SE: null,
        error: "Koefisien k tidak valid",
        nTotal: summary.totalData,
        nValid: anovaTable.nValid,
        nMissing: summary.missingData,
      };
      return;
    }

    const { MSs, MSw } = anovaTable;

    // Cek MSs dan MSw valid
    if (isNaN(MSs) || isNaN(MSw)) {
      result[trait] = {
        heritability: "N/A",
        h2: null,
        SE: null,
        error: "MSs atau MSw tidak valid",
        nTotal: summary.totalData,
        nValid: anovaTable.nValid,
        nMissing: summary.missingData,
      };
      return;
    }

    const kthFaktor = (MSs - MSw) / k;

    // Handle negative variance component
    if (kthFaktor < 0) {
      console.warn(`Komponen ragam negatif untuk ${trait}, ditetapkan 0`);
      result[trait] = {
        heritability: "0.00 ± 0.00",
        h2: 0,
        SE: 0,
        warning: "Komponen ragam negatif",
        MSs: MSs,
        MSw: MSw,
        k: k,
        nValid: anovaTable.nValid,
        nTotal: summary.totalData,
        nMissing: summary.missingData,
        nGroups: anovaTable.countFaktor,
      };
      return;
    }

    const heritability = (4 * kthFaktor) / (MSw + kthFaktor);

    // Hitung SE - gunakan jumlah kelompok valid untuk trait ini
    const t = kthFaktor / (MSw + kthFaktor);
    const s = getUniqueValue(data, faktor, trait); // Hitung unique faktor hanya dari data valid
    const dividen = 2 * (1 - t) * Math.pow(1 + (k - 1) * t, 2);
    const divisor = k * (k - 1) * (s - 1);

    let SE = 0;
    if (divisor > 0 && dividen > 0) {
      SE = 4 * Math.sqrt(dividen / divisor);
    }

    result[trait] = {
      heritability: `${heritability.toFixed(3)} ± ${SE.toFixed(3)}`,
      h2: heritability,
      SE: SE,
      MSs: MSs,
      MSw: MSw,
      k: k,
      nValid: anovaTable.nValid,
      nTotal: summary.totalData,
      nMissing: summary.missingData,
      nGroups: anovaTable.countFaktor,
      average: anovaTable.average,
    };
  });

  return result;
}
