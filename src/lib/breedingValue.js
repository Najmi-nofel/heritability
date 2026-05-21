import estimateHeritability from "./heritability.js";

function filterValidData(data, trait, faktor) {
  return data.filter((row) => {
    const faktorValue = row[faktor];
    if (faktorValue === undefined || faktorValue === null || faktorValue === "")
      return false;
    const traitValue = row[trait];
    if (traitValue === undefined || traitValue === null || traitValue === "")
      return false;
    const numValue = parseFloat(traitValue);
    if (isNaN(numValue)) return false;
    return true;
  });
}

export function breedingValueToTable(bvResults, faktorColumn) {
  if (!bvResults || typeof bvResults !== "object") return [];

  const allFaktors = new Set();
  for (const trait in bvResults) {
    const faktorMap = bvResults[trait];
    if (faktorMap && typeof faktorMap === "object") {
      Object.keys(faktorMap).forEach((sire) => allFaktors.add(sire));
    }
  }

  const table = [];
  for (const sire of allFaktors) {
    const row = { [faktorColumn]: sire };
    for (const trait in bvResults) {
      const faktorMap = bvResults[trait];
      if (faktorMap && faktorMap[sire] !== undefined) {
        row[`Ebv_${trait}`] = faktorMap[sire];
      } else {
        row[`Ebv_${trait}`] = null;
      }
    }
    table.push(row);
  }

  return table;
}

export default function estimateBreedingValue(
  data,
  faktor,
  traits,
  h2Map = null,
) {
  let heritabilityResults;
  if (h2Map) {
    heritabilityResults = h2Map;
  } else {
    heritabilityResults = estimateHeritability(data, faktor, traits);

    if (heritabilityResults.error) {
      console.error(
        "Gagal menghitung heritabilitas:",
        heritabilityResults.error,
      );
      return { error: heritabilityResults.error };
    }
  }

  const result = {};

  for (const trait of traits) {
    const h2Info = heritabilityResults[trait];

    if (!h2Info || h2Info.h2 === undefined || h2Info.average === undefined) {
      console.warn(
        `Trait ${trait}: data heritabilitas tidak lengkap, dilewati`,
      );
      result[trait] = { error: "Heritabilitas tidak tersedia" };
      continue;
    }

    const h2 = h2Info.h2;
    const overallMean = h2Info.average;

    const validData = filterValidData(data, trait, faktor);
    if (validData.length === 0) {
      result[trait] = { error: "Tidak ada data valid" };
      continue;
    }

    const groups = {};
    for (const row of validData) {
      const sire = String(row[faktor]);
      const value = parseFloat(row[trait]);
      if (!groups[sire]) groups[sire] = [];
      groups[sire].push(value);
    }

    const sireList = Object.keys(groups);
    const breedingValues = {};

    for (const sire of sireList) {
      const n = groups[sire].length;
      const sum = groups[sire].reduce((a, b) => a + b, 0);
      const groupMean = sum / n;

      const numerator = 2 * n * h2;
      const denominator = 4 + (n - 1) * h2;
      const b = numerator / denominator;
      const bv = b * (groupMean - overallMean) + overallMean;

      breedingValues[sire] = parseFloat(bv.toFixed(2));
    }

    result[trait] = breedingValues;
  }

  return result;
}
