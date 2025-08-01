import React from "react";
import { Button, Box } from "@mui/material";

const FloatingApplyButton = ({ isMobile, brand, toggleDrawer }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? 35 : 300,
        right: isMobile ? 0 : 20,
        left: isMobile ? 0 : "auto",
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        size={isMobile ? "medium" : "large"}
        onClick={toggleDrawer(true)}
        sx={{
          backgroundColor: "#ff9800",
          color: "white",
          borderRadius: 50,
          px: 4,
          py: 1.5,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          "&:hover": {
            backgroundColor: "#e65100",
          },
          fontSize: isMobile ? "0.875rem" : "1rem",
        }}
      >
        Apply Now&nbsp; for&nbsp; <strong>{brand?.brandDetails?.brandName}</strong>
      </Button>
    </Box>
  );
};

export default FloatingApplyButton;