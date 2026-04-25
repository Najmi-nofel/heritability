"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
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
  useTheme,
} from "@mui/material";
import estimateHeritability from "@/lib/heritability";
import {
  CheckCircleOutlined,
  ErrorOutlineOutlined,
  InfoOutlined,
} from "@mui/icons-material";

function HeeritabilityResult({ result, faktor, traits }) {
  const theme = useTheme();

  if (!result || Object.keys(result).length === 0) return null;

  const getStatusProps = (h2) => {
    if (h2 > 0.3) return { label: "High", color: "success" };
    if (h2 >= 0.1) return { label: "Intermediate", color: "info" };
    if (h2 <= 0) return { label: "Not Significant", color: "error" };
    return { label: "Low", color: "warning" };
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: 3,
            background: (theme) =>
              theme.palette.mode === "light"
                ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                : `linear-gradient(45deg, ${theme.palette.primary.dark}, #1e1e1e)`, // Gunakan warna gelap di dark mode

            color: "primary.contrastText",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              📈 Estimated Heritability
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {faktor} • {traits.length} Traits ({traits.join(", ")})
            </Typography>
          </Box>
          <CheckCircleOutlined sx={{ fontSize: 40, opacity: 0.5 }} />
        </Box>

        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell>Trait</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {faktor}
                  </TableCell>
                  <TableCell>Population</TableCell>
                  <TableCell>h² ± SE</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(result).map(([trait, data]) => {
                  const status = getStatusProps(data.h2);
                  return (
                    <TableRow key={trait} hover>
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {trait}
                      </TableCell>
                      <TableCell>{data?.nGroups}</TableCell>
                      <TableCell>{data?.nValid}</TableCell>
                      <TableCell
                        sx={{ color: "primary.main", fontWeight: "bold" }}
                      >
                        {data.heritability}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                            variant="soft" // Jika menggunakan MUI Joy atau kustom tema, jika tidak gunakan 'outlined'
                          />
                          {data.warning && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <ErrorOutlineOutlined sx={{ fontSize: 14 }} />{" "}
                              Ragam Negatif
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Grid Interpretasi Menggunakan Paper agar ikut Dark Mode */}
      <Grid container spacing={2}>
        {[
          {
            label: "High (> 0.3)",
            color: "success",
            desc: "Seleksi massa sangat efektif.",
          },
          {
            label: "Intermediate",
            color: "info",
            desc: "Kemajuan genetik cukup stabil.",
          },
          {
            label: "Low",
            color: "warning",
            desc: "Lingkungan sangat dominan.",
          },
        ].map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item.label}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                gap: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                height: 90,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    alpha(theme.palette[item.color].main, 0.1),
                  color: `${item.color}.main`,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <InfoOutlined sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  {item.label}
                </Typography>
                <Typography variant="body2">{item.desc}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HeeritabilityResult;
