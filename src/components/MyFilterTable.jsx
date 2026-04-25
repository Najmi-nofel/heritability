"use client";

import React, { useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Paper, Box } from "@mui/material";

export default function MyFilterTable({ data }) {
  const rowsWithId = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((row, index) => ({
      ...row,
      internal_id: index + 1,
    }));
  }, [data]);

  const columns = useMemo(() => {
    if (!rowsWithId || rowsWithId.length === 0) return [];

    return Object.keys(rowsWithId[0])
      .filter((key) => key !== "internal_id")
      .map((key) => ({
        field: key,
        headerName: key,
        width: 150,

        type: typeof rowsWithId[0][key] === "number" ? "number" : "string",
      }));
  }, [rowsWithId]);

  return (
    <Paper sx={{ height: 600, width: "100%", p: 2, borderRadius: "15px" }}>
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={rowsWithId}
          columns={columns}
          getRowId={(row) => row.internal_id}
          showToolbar
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          }}
        />
      </Box>
    </Paper>
  );
}
