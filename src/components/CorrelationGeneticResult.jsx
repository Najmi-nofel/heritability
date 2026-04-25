"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Grid,
  Paper,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Remove as Minus,
  AccountTree as GitBranch,
} from "@mui/icons-material";
import Heatmap from "./genetic-corr-heatmap";

function CorrelationGeneticResult({ result, faktor, traits }) {
  const [viewMode, setViewMode] = useState("table");
  const theme = useTheme();

  if (
    !result ||
    !result.correlations ||
    Object.keys(result.correlations).length === 0
  ) {
    return null;
  }

  const { correlations, sireCount, totalRecords, k } = result;
  const traitNames = Object.keys(correlations);

  // Helper Warna Berbasis Tema
  const getCorrelationStyle = (r) => {
    if (r === undefined || r === null || isNaN(r))
      return { label: "N/A", color: "grey", icon: null };
    if (r >= 1.0) return { label: null, color: "grey", icon: null };

    if (r > 0.4)
      return {
        label: "High Positive",
        color: "success",
        icon: <TrendingUp fontSize="small" />,
      };
    if (r > 0.1)
      return {
        label: "Intermediate Positive",
        color: "info",
        icon: <TrendingUp fontSize="small" />,
      };
    if (r >= -0.1)
      return {
        label: "Neutral",
        color: "default",
        icon: <Minus fontSize="small" />,
      };
    if (r >= -0.4)
      return {
        label: "Intermediate Negative",
        color: "warning",
        icon: <TrendingDown fontSize="small" />,
      };
    return {
      label: "High Negative",
      color: "error",
      icon: <TrendingDown fontSize="small" />,
    };
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ borderRadius: 3, overflow: "hidden", border: "none" }}>
        
        <Box
          sx={{
            p: 3,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.background.paper})`
                : `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
            color: "success.contrastText",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              🧬 Genetic Correlation
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                mt: 0.5,
                opacity: 0.9,
              }}
            >
              <Typography variant="caption">
                Factor: <strong>{faktor}</strong>
              </Typography>
              <Typography variant="caption">|</Typography>
              <Typography variant="caption">
                Traits: <strong>{traits.length}</strong>
              </Typography>
              <Typography variant="caption">|</Typography>
              <Typography variant="caption">
                {faktor}: <strong>{sireCount}</strong>
              </Typography>
              <Typography variant="caption">|</Typography>
              <Typography variant="caption">
                Total: <strong>{totalRecords}</strong>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                setViewMode(viewMode === "table" ? "heatmap" : "table")
              }
              sx={{
                bgcolor: "background.paper",
                color: "text.primary",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              {viewMode === "table" ? "View Heatmap" : "View Table"}
            </Button>
            <GitBranch sx={{ fontSize: 40, opacity: 0.3 }} />
          </Box>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {viewMode === "table" ? (
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: "action.hover" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Trait</TableCell>
                    {traitNames.map((t) => (
                      <TableCell
                        key={t}
                        align="center"
                        sx={{ fontWeight: "bold" }}
                      >
                        {t}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {traitNames.map((rowTrait) => (
                    <TableRow key={rowTrait} hover>
                      <TableCell
                        sx={{ fontWeight: "medium", bgcolor: "action.hover" }}
                      >
                        {rowTrait}
                      </TableCell>
                      {traitNames.map((colTrait) => {
                        let r =
                          rowTrait === colTrait
                            ? 1.0
                            : correlations[rowTrait]?.[colTrait];
                        const style = getCorrelationStyle(r);

                        return (
                          <TableCell key={colTrait} align="center">
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color={r > 0 ? "primary.main" : "error.main"}
                              >
                                {r !== null ? r.toFixed(3) : "-"}
                              </Typography>
                              {r !== 1.0 && r !== null && (
                                <Chip
                                  label={style.label}
                                  size="small"
                                  color={style.color}
                                  icon={style.icon}
                                  variant="outlined"
                                  sx={{ fontSize: "0.65rem", height: 20 }}
                                />
                              )}
                            </Box>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 2 }}>
              <Heatmap correlations={correlations} traits={traits} />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Box Interpretasi (Grid) */}
      <Grid container spacing={2}>
        {[
          {
            range: "Positif Tinggi (> 0.6)",
            color: "success",
            desc: "Seleksi tidak langsung sangat efektif.",
          },
          {
            range: "Netral (-0.1 s/d 0.1)",
            color: "grey",
            desc: "Seleksi satu sifat tidak mempengaruhi sifat lain.",
          },
          {
            range: "Negatif Tinggi (< -0.6)",
            color: "error",
            desc: "Perbaikan satu sifat merugikan sifat lain.",
          },
        ].map((item, i) => (
          <Grid key={i} xs={12} md={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                gap: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    alpha(
                      theme.palette[
                        item.color === "grey" ? "action" : item.color
                      ].main || "#ccc",
                      0.1,
                    ),
                  color: `${item.color}.main`,
                  display: "flex",
                  alignItems: "center",
                  height: "fit-content",
                }}
              >
                {item.color === "error" ? <TrendingDown /> : <TrendingUp />}
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  {item.range}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  {item.desc}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CorrelationGeneticResult;
