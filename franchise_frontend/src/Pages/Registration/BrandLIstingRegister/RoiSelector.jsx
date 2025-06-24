import React, { useState } from "react";
import {
  Box,
  Button,
  Popover,
  Typography,
  Grid,
  FormHelperText,
} from "@mui/material";

const roiOptions = Array.from({ length: 99 }, (_, i) => i + 1);

export default function RoiSelector({ value, onChange, error }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (val) => {
    onChange(`${val}%`);
    handleClose();
  };

  return (
    <Box>
      <Typography
        variant="outlined"
        component={Button}
        onClick={handleOpen}
        sx={{
          width: 120,
          justifyContent: "flex-start",
          border: "1px solid #ccc",
          borderRadius: 1,
          padding: "8px 12px",
          background: "#fff",
        }}
      >
        {value || "Select ROI (%)"}
      </Typography>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Grid
          container
          sx={{
            width: 400,
            p: 2,
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: 1,
          }}
        >
          {roiOptions.map((option) => (
            <Button
              key={option}
              variant={value === `${option}%` ? "contained" : "outlined"}
              onClick={() => handleSelect(option)}
              sx={{
                minWidth: 0,
                padding: "6px 0",
                fontSize: 14,
                borderRadius: 1,
              }}
            >
              {option}
            </Button>
          ))}
        </Grid>
      </Popover>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}