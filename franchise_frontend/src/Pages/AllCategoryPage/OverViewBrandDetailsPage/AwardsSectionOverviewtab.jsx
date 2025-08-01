import React from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Typography, Box, Grid, Slide } from "@mui/material";

const AwardsSection = ({ awards }) => {
  const Row = ({ index, style }) => {
    const award = awards[index];
    return (
      <Slide direction="up" in={true} timeout={index * 200}>
        <div style={style}>
          <Grid item xs={12} sm={6} md={4}>
            <AwardItem award={award} index={index} />
          </Grid>
        </div>
      </Slide>
    );
  };

  return (
    <>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4, color: "#7ad03a" }}>
        Awards
      </Typography>
      {awards.length > 0 ? (
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height || 400}
              itemCount={awards.length}
              itemSize={180}
              width={width}
              layout="horizontal"
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No awards available.
        </Typography>
      )}
    </>
  );
};

const AwardItem = ({ award, index }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mb: 2,
      p: 2,
      borderRadius: "12px",
      background: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      },
      height: "100%",
    }}
  >
    {award.awardImage ? (
      <img
        src={award.awardImage}
        loading="lazy"
        alt={`Award ${index + 1}`}
        style={{
          width: "100%",
          maxWidth: 180,
          height: 120,
          borderRadius: 8,
          marginBottom: 12,
          objectFit: "cover",
          background: "#f0f0f0",
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    ) : (
      <Box
        sx={{
          width: "100%",
          maxWidth: 180,
          height: 120,
          borderRadius: 2,
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          No Image
        </Typography>
      </Box>
    )}
    <Typography variant="body2" align="center" sx={{ color: "#212121" }}>
      {award.awardDescription || "No Description"}
    </Typography>
  </Box>
);

export default AwardsSection;