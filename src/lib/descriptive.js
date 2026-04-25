import { filterValidData } from "./heritability.js";

export default function estimateDescriptiveAnalytics(data, faktor, traitList) {
  const result = {};
  traitList.forEach((trait) => {
    const validData = filterValidData(data, trait, faktor);

    const groups = {};
    validData.forEach((row) => {
      const faktorValue = row[faktor];
      const traitValue = row[trait];

      if (!groups[faktorValue]) {
        groups[faktorValue] = [];
      }
      groups[faktorValue].push(parseFloat(traitValue));
    });

    const S = Object.keys(groups);
    let total = 0;
    for (let s in groups) {
      const sum = groups[s].reduce((a, b) => a + b, 0);
      total += sum;
    }
    const average = total / validData.length;
    let ragam = 0;

    for (let s in groups) {
      let X = groups[s];
      X.forEach((x) => {
        const simpangBaku = x - average;
        ragam += simpangBaku * simpangBaku;
      });
    }

    const populationValueArr = validData
      .map((row) => parseFloat(row[trait]))
      .filter((item) => item !== undefined);

    result[trait] = {
      Trait: trait,
      [`${faktor}`]: S.length,
      nValid: validData.length,
      average: average.toFixed(2),
      SD: Math.sqrt(ragam / (validData.length - 1)).toFixed(2),
      maxValue: Math.max(...populationValueArr).toFixed(2),
      minValue: Math.min(...populationValueArr).toFixed(2),
    };
  });
  return result;
}
