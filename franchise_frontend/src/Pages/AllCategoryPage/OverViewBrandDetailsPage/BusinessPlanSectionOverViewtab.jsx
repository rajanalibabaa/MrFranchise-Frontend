import React from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Typography, Button, Slide } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const BusinessPlanSection = ({ documents }) => {
  const Row = ({ index, style }) => {
    const doc = documents[index];
    return (
      <Slide direction="up" in={true} timeout={index * 200}>
        <div style={style}>
          <BusinessPlanItem doc={doc} />
        </div>
      </Slide>
    );
  };

  return (
    <>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4, color: "#7ad03a" }}>
        Business Plan Documentation
      </Typography>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height || 300}
            itemCount={documents.length}
            itemSize={250}
            width={width}
            layout="horizontal"
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </>
  );
};

const BusinessPlanItem = ({ doc }) => (
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
      margin: "0 8px",
    }}
  >
    <DescriptionIcon sx={{ fontSize: 60, color: "#3f51b5", mb: 1 }} />
    <Typography
      variant="body2"
      align="center"
      sx={{ color: "#212121", fontWeight: 500, mb: 1 }}
    >
      {doc.title || "Business Document"}
    </Typography>
    <Button
      variant="contained"
      size="small"
      sx={{ backgroundColor: "#ff9800", color: "white", mt: 1 }}
      href={doc.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Document
    </Button>
  </Box>
);

export default BusinessPlanSection;