"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from "@mui/material";
import { AnalyticsOutlined, BarChartOutlined } from "@mui/icons-material";

function DescriptiveAnalytics({ result, faktor, traits }) {
  if (!result || Object.keys(result).length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: 3,
            background: (theme) =>
              theme.palette.mode === "light"
                ? `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`
                : `linear-gradient(45deg, ${theme.palette.secondary.dark}, #1e1e1e)`,
            color: "secondary.contrastText",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              📊 Descriptive Statistics
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {faktor} • {traits.length} Traits Analysis
            </Typography>
          </Box>
          <AnalyticsOutlined sx={{ fontSize: 40, opacity: 0.5 }} />
        </Box>

        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ p: 0 }}>
            <Table sx={{ p: 0 }}>
              <caption style={{ padding: 1, margin: 0, marginLeft: 5 }}>
                n: Number of population; {faktor}: Number of {faktor};
              </caption>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell>Trait</TableCell>
                  <TableCell align="right">{faktor}</TableCell>
                  <TableCell align="right">n (Progeny)</TableCell>
                  <TableCell align="right">Average</TableCell>
                  <TableCell align="right">Std. Deviation</TableCell>
                  <TableCell align="right">Min</TableCell>
                  <TableCell align="right">Max</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(result).map(([trait, data]) => (
                  <TableRow key={trait} hover>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "secondary.main" }}
                    >
                      {trait}
                    </TableCell>
                    <TableCell align="right">{data[faktor]}</TableCell>
                    <TableCell align="right">{data.nValid}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "medium" }}>
                      {data.average}
                    </TableCell>
                    <TableCell align="right">{data.SD}</TableCell>
                    <TableCell align="right" sx={{ color: "text.secondary" }}>
                      {data.minValue}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "text.secondary" }}>
                      {data.maxValue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/*
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            >
              <BarChartOutlined />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Data Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Statistik deskriptif di atas dihitung berdasarkan total{" "}
                {result.length} observasi data ternak.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid> */}
    </Box>
  );
}

export default DescriptiveAnalytics;
