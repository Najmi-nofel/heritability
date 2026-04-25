"use client";
import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function HiddenInput({ onChange }) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      sx={{ borderRadius: 8, textTransform: "none" }}
    >
      Upload file
      <VisuallyHiddenInput
        type="file"
        onChange={onChange}
        accept=".xlsx, .xls, .csv"
      />
    </Button>
  );
}

export default HiddenInput;
