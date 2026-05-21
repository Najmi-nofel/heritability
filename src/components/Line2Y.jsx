"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Tabs, Tab, Box, Paper } from "@mui/material";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function DualAxisAreaChart({ result, faktor, traits }) {
  const [value, setValue] = useState(traits[0] || "");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const target = result[value] || [];
  const data = {
    labels: target.map((t) => t.sire),
    datasets: [
      {
        label: "Average (kg)",
        data: target.map((t) => t.average),
        yAxisID: "y",
        fill: true,
        tension: 0.4,
        borderColor: "rgba(34, 139, 34, 1)",

        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return "rgba(34, 139, 34, 0.5)";

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, "rgba(34, 139, 34, 0.8)"); // Darker green at the top
          gradient.addColorStop(1, "rgba(34, 139, 34, 0.0)"); // Fades to transparent at the bottom

          return gradient;
        },
      },
      {
        label: `Count per ${faktor}`,
        data: target.map((t) => t.count),
        yAxisID: "y1",
        fill: true,
        tension: 0.4,
        borderColor: "rgba(60, 179, 113, 1)",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return "rgba(60, 179, 113, 0.5)";

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, "rgba(60, 179, 113, 0.7)");
          gradient.addColorStop(1, "rgba(60, 179, 113, 0.0)");

          return gradient;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: `Average and Count per ${faktor} of ${value} Trait`,
      },
      tooltip: {
        shared: true,
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Average",
        },

        beginAtZero: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Count",
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  return (
    <Paper sx={{ p: 3, borderRadius: "20px", width: "100%", mt: 2 }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons={traits.length > 4}
        >
          {traits.map((trait) => (
            <Tab
              key={trait}
              label={trait}
              value={trait}
              sx={{ textTransform: "none" }}
            />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          py: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {target.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <Box sx={{ p: 5, textAlign: "center" }}>
            No valid data in this category
          </Box>
        )}
      </Box>
    </Paper>
  );
}
