"use client";
import { ResponsiveHeatMap } from "@nivo/heatmap";

export default function Heatmap({ correlations, traits }) {
  if (!correlations || typeof correlations !== "object") {
    return (
      <div className="p-4 text-red-500">Error: Data korelasi tidak valid</div>
    );
  }

  const transformData = () => {
    if (
      Array.isArray(correlations) &&
      correlations.length > 0 &&
      Array.isArray(correlations[0])
    ) {
      return traits.map((rowTrait, i) => ({
        id: rowTrait,
        data: traits.map((colTrait, j) => ({
          x: colTrait,
          y: correlations[i]?.[j] ?? (i === j ? 1 : 0),
        })),
      }));
    } else if (!Array.isArray(correlations)) {
      return traits.map((rowTrait) => {
        const rowObj = correlations[rowTrait];
        if (!rowObj) {
          console.warn(`Trait "${rowTrait}" tidak ditemukan di correlations`);
          return {
            id: rowTrait,
            data: traits.map((colTrait) => ({
              x: colTrait,
              y: rowTrait === colTrait ? 1 : 0,
            })),
          };
        }
        return {
          id: rowTrait,
          data: traits.map((colTrait) => ({
            x: colTrait,
            y: rowObj[colTrait] ?? (rowTrait === colTrait ? 1 : 0),
          })),
        };
      });
    }
    return [];
  };

  const data = transformData();

  if (data.length === 0) {
    return (
      <div className="p-4 text-gray-500">Tidak ada data untuk heatmap</div>
    );
  }

  return (
    <div style={{ height: 500, width: "100%" }}>
      <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
        valueFormat=">-.2f"
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "",
          legendOffset: 46,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Trait",
          legendPosition: "middle",
          legendOffset: 46,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Trait",
          legendPosition: "middle",
          legendOffset: -72,
        }}
        colors={{
          type: "diverging",
          scheme: "red_blue",
          divergeAt: 0.5,
          minValue: -1,
          maxValue: 1,
        }}
        emptyColor="#555555"
        borderWidth={1}
        borderColor={{ theme: "background" }}
        enableLabels={true}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.8]] }}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
}
