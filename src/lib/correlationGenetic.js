import estimateHeritability from "./heritability.js";

export function filterValidData(data, traitList, faktor) {
  return data.filter((row) => {
    const faktorValue = row[faktor];

    if (
      faktorValue === undefined ||
      faktorValue === null ||
      faktorValue === ""
    ) {
      return false;
    }

    for (let trait of traitList) {
      const traitValue = row[trait];

      if (
        traitValue === undefined ||
        traitValue === null ||
        traitValue === ""
      ) {
        return false;
      }

      const num = parseFloat(traitValue);

      if (isNaN(num)) {
        return false;
      }
    }

    return true;
  });
}

export default function estimateGeneticCorrelation(data, faktor, traitList) {
  const validData = filterValidData(data, traitList, faktor);

  const h = estimateHeritability(validData, faktor, traitList);
  let k;

  const ragamFaktor = {};
  for (const trait of traitList) {
    const ragam_s = (h[trait].MSs - h[trait].MSw) / h[trait].k;
    ragamFaktor[trait] = ragam_s;
    k = h[trait].k;
  }
  const N = validData.length;
  const sireGroups = {};
  validData.forEach((row) => {
    const sire = row[faktor];
    if (!sireGroups[sire]) sireGroups[sire] = [];
    sireGroups[sire].push(row);
  });

  const sires = Object.keys(sireGroups);
  const s = sires.length;
  const ni = sires.map((sire) => sireGroups[sire].length);

  const totalSums = {};
  traitList.forEach((trait) => {
    totalSums[trait] = 0;
  });
  for (let row of validData) {
    for (let trait of traitList) {
      totalSums[trait] += row[trait];
    }
  }

  const sumXY = {}; // sum (trait 1 * trait 2)
  for (let i = 0; i < traitList.length; i++) {
    for (let j = i + 1; j < traitList.length; j++) {
      const t1 = traitList[i],
        t2 = traitList[j];
      const key = `${t1}_${t2}`;
      sumXY[key] = 0;
    }
  }
  validData.forEach((row) => {
    for (let i = 0; i < traitList.length; i++) {
      for (let j = i + 1; j < traitList.length; j++) {
        const t1 = traitList[i],
          t2 = traitList[j];
        const key = `${t1}_${t2}`;
        sumXY[key] += row[t1] * row[t2];
      }
    }
  });

  const correlations = {};
  for (let i = 0; i < traitList.length; i++) {
    for (let j = i + 1; j < traitList.length; j++) {
      const t1 = traitList[i],
        t2 = traitList[j];
      const key = `${t1}_${t2}`;

      let sumSireT1 = {},
        sumSireT2 = {};
      sires.forEach((sire) => {
        let sum1 = 0,
          sum2 = 0;
        sireGroups[sire].forEach((row) => {
          sum1 += row[t1];
          sum2 += row[t2];
        });
        sumSireT1[sire] = sum1;
        sumSireT2[sire] = sum2;
      });

      let scpSire = 0;
      for (let idx = 0; idx < s; idx++) {
        const sire = sires[idx];
        const n_i = ni[idx];
        scpSire += (sumSireT1[sire] * sumSireT2[sire]) / n_i;
      }
      const totalProd = (totalSums[t1] * totalSums[t2]) / N;
      scpSire -= totalProd;

      const scpTotal = sumXY[key] - totalProd;
      const scpError = scpTotal - scpSire;

      const dfSire = s - 1;
      const dfError = N - s;
      const mpSire = scpSire / dfSire;
      const mpError = scpError / dfError;

      const cov_s = (mpSire - mpError) / k;
      const var1 = ragamFaktor[t1];
      const var2 = ragamFaktor[t2];
      let rG = cov_s / Math.sqrt(var1 * var2);
      if (isNaN(rG)) rG = 0;
      rG = Math.min(1, Math.max(-1, rG));
      correlations[key] = rG;
    }
  }

  const matrix = {};
  traitList.forEach((t) => {
    matrix[t] = {};
  });
  for (let i = 0; i < traitList.length; i++) {
    matrix[traitList[i]][traitList[i]] = 1.0;
    for (let j = i + 1; j < traitList.length; j++) {
      const key = `${traitList[i]}_${traitList[j]}`;
      const val = correlations[key];
      matrix[traitList[i]][traitList[j]] = val;
      matrix[traitList[j]][traitList[i]] = val;
    }
  }

  return {
    correlations: matrix,
    ragamFaktor: ragamFaktor,
    k: k,
    sireCount: s,
    totalRecords: N,
  };
}
