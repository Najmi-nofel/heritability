"use client";
import React from "react";
import { filterValidData } from "@/lib/heritability.js";

function DataChart(data, faktor, traitlist) {
  // agregat data
  const result = {};

  traitlist.forEach((trait) => {
    const validData = filterValidData(data, trait, faktor);
    result[trait] = {};
    validData.forEach((row) => {
      const sire = String(row[faktor]);
      const value = parseFloat(row[trait]);

      if (!result[trait][sire]) {
        result[trait][sire] = { sire: sire, total: 0, count: 0 };
      }
      result[trait][sire].total += value;
      result[trait][sire].count += 1;
    });
  });
  const formatData = {};
  traitlist.forEach((trait) => {
    formatData[trait] = Object.values(result[trait])
      .map((item) => ({
        sire: item.sire,
        average: item.total / item.count,
        count: item.count,
      }))
      .sort((a, b) => a.sire.localeCompare(b.sire));
  });
  return formatData;
}

export default DataChart;
