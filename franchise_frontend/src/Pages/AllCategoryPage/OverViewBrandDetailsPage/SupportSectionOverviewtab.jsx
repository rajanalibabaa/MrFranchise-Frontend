import React from "react";
import { Grid, Typography, Divider, Box, Chip } from "@mui/material";
import Business from "@mui/icons-material/Business";
import { Zoom } from "@mui/material";

const SupportSection = ({ trainingSupport, aidFinancing, isInternational }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Zoom in={true} timeout={700}>
          <Box
            sx={{
              borderRadius: "16px",
              p: 3,
              background: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              height: "100%",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              display="flex"
              alignItems="center"
              color="#7ad03a"
            >
              <Business sx={{ color: "#ff9800", mr: 1 }} />
              Support Provided By Brand
            </Typography>
            <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.1)" }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "180px auto" },
                rowGap: 1,
                columnGap: 2,
                pl: 1,
              }}
            >
              {trainingSupport && trainingSupport.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ color: "#212121", fontWeight: 600 }}>
                    Training Support:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {trainingSupport.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        size="small"
                        sx={{ mb: 0.5,backgroundColor: "rgba(238, 238, 238, 1)" }}
                        icon={<span style={{ marginLeft: 8 , color: "green"}}>✓</span>}
                      />
                    ))}
                  </Box>
                </>
              )}

              {aidFinancing && (
                <>
                  <Typography variant="body2" sx={{ color: "#212121", fontWeight: 600 }}>
                    Financing Aid:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#212121" }}>
                    {aidFinancing}
                  </Typography>
                </>
              )}

              <Typography variant="body2" sx={{ color: "#212121", fontWeight: 600 }}>
                International Expansion:
              </Typography>
              <Typography variant="body2" component={"span"} sx={{ color: "#212121" }}>
                {isInternational ? (
                  <Chip label="Yes" color="success" size="small" />
                ) : (
                  <Chip label="No" color="default" size="small" />
                )}
              </Typography>
            </Box>
          </Box>
        </Zoom>
      </Grid>
    </Grid>
  );
};

export default SupportSection;