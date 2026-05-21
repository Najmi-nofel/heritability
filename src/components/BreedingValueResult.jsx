"use client";
import * as React from "react";
import { Box, Paper, Typography, alpha } from "@mui/material";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";

function BreedingValueResult({ result, faktor }) {
  const rows = React.useMemo(() => {
    if (!result || !Array.isArray(result)) return [];
    return result.map((item, index) => ({
      id: index,
      ...item,
    }));
  }, [result]);

  const columns = React.useMemo(() => {
    if (rows.length === 0) return [];

    return Object.keys(result[0]).map((key) => {
      const isNameColumn = key === "undefined";

      return {
        field: key,
        headerName: isNameColumn
          ? faktor
          : key.replace("Ebv_", "EBV ").toUpperCase(),
        flex: 1,
        minWidth: 150,
        headerClassName: "super-app-theme--header",

        valueFormatter: (value) => {
          if (value === null || value === undefined || isNaN(value)) {
            return "-";
          }
          if (typeof value === "number") {
            return value.toFixed(3);
          }
          return value;
        },

        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{ fontWeight: isNameColumn ? "bold" : "normal" }}
          >
            {params.value || "-"}
          </Typography>
        ),
      };
    });
  }, [result, rows, faktor]);

  if (rows.length === 0) return <Typography>Data tidak ditemukan.</Typography>;

  return (
    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
      >
        📊 Estimated Breeding Value
      </Typography>

      <Box
        sx={{
          height: 500,
          width: "100%",

          "& .super-app-theme--header": {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          showToolbar
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 15, 20, 25]}
          sx={{
            border: "none",
            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
              {
                outline: "none",
              },
            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
              {
                outline: "none",
              },
          }}
        />
      </Box>
    </Paper>
  );
}

export default BreedingValueResult;
