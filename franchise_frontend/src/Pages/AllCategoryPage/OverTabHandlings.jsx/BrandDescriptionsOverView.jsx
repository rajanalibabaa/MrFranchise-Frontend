// BrandDescription.jsx
import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const BrandDescription = ({ brandDescription, uniqueSellingPoints }) => {
  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: "16px",
        background: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#7ad03a" }}>
        Brand Description
      </Typography>
      <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.1)" }} />
      <Box
        dangerouslySetInnerHTML={{
          __html: brandDescription,
        }}
        sx={{
          color: "#212121",
          "& p": { mb: 2 },
          "& strong": { color: "#3f51b5" },
        }}
      />
      {uniqueSellingPoints && uniqueSellingPoints.length > 0 && (
        <>
          <Typography variant="body1" sx={{ color: "#212121", fontWeight: 600 }}>
            Unique Points:
          </Typography>
          <Typography variant="body2" sx={{ color: "#212121" }}>
            {uniqueSellingPoints.join(", ")}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default BrandDescription;