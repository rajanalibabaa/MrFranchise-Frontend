import React from "react";
import { Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";

const BrandDescription = ({ brandDescription, uniqueSellingPoints }) => {
  const isMobile = window.innerWidth <= 768; // Adjust based on your breakpoint
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
      
      {/* Scrollable description container */}
      <Box
        sx={{
          maxHeight: "150px", // Reduced height to accommodate USP section
          overflowY: "auto",
          pr: 2,
          mb: uniqueSellingPoints?.length > 0 ? 2 : 0,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Typography 
          variant={isMobile ? "body2" : "body1"} 
          component="div" 
          sx={{ 
            color: "#212121",
            "& h1": {
              fontSize: "1.5rem",
              fontWeight: 600,
              mb: 2,
              color: "#3f51b5"
            },
            "& p": {
              mb: 2,
              lineHeight: 1.6
            }
          }}
          dangerouslySetInnerHTML={{ __html: brandDescription }}
        />
      </Box>
      
      {/* Non-scrollable unique points section */}
      {uniqueSellingPoints && uniqueSellingPoints.length > 0 && (
        <>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{ 
              mt: 2,
              mb: 1,
              color: "#3f51b5",
              fontSize: "1.25rem",
              fontWeight: 600
            }}
          >
            Unique Points:
          </Typography>
          <List dense sx={{ py: 0 }}>
            {uniqueSellingPoints.map((point, index) => (
              <ListItem key={index} sx={{ py: 0, px: 0 }}>
                <ListItemText
                  primary={`• ${point}`}
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "#212121"
                  }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default BrandDescription;