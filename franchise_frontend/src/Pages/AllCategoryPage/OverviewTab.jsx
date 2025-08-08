
import React, { useState, useEffect, useRef, lazy } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Card,
  CardContent,
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";

// Import components
import FranchiseDetailsTable from "./OverTabHandlings.jsx/FranchiseDetailsOverView.jsx";
import BrandDescription from "./OverTabHandlings.jsx/BrandDescriptionsOverView.jsx";
import SupportProvided from "./OverTabHandlings.jsx/SupportProvidedOverView.jsx";
import ExpansionLocationGrid from "./OverTabHandlings.jsx/BrandOverViewExpansionLocationDomestic.jsx";
import ExpansionLocationGridInternational from "./OverTabHandlings.jsx/BrandExpansionLOcationOverviewInternational.jsx";

// Lazy load icons
const DescriptionIcon = lazy(() => import("@mui/icons-material/Description"));
const Business = lazy(() => import("@mui/icons-material/Business"));

const OverviewTab = ({ brand }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const overviewRef = useRef(null);

  const formatCurrency = (value) => {
    const number = Number(value);
    return isNaN(number) ? "N/A" : `₹${number.toLocaleString("en-IN")}`;
  };

  const hasData = (sectionData) => {
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0;
    }
    return !!sectionData;
  };

  const franchiseDetails = brand?.[0]?.brandfranchisedetails?.franchiseDetails || {};
  const expansionLocationData = brand?.[0]?.brandexpansionlocationdatas || {};
  const uploads = brand?.[0]?.uploads || {};

  return (
    <Box ref={overviewRef}>
      {/* Franchise Details */}
      {hasData(franchiseDetails.fico) && (
        <FranchiseDetailsTable 
          ficoDetails={franchiseDetails.fico} 
          formatCurrency={formatCurrency} 
        />
      )}

      {/* Brand Description */}
      {franchiseDetails.brandDescription && (
        <BrandDescription
          brandDescription={franchiseDetails.brandDescription}
          uniqueSellingPoints={franchiseDetails.uniqueSellingPoints}
        />
      )}

      {/* Support Provided */}
      {(hasData(franchiseDetails.trainingSupport) ||
        franchiseDetails.aidFinancing ||
        hasData(franchiseDetails.uniqueSellingPoints)) && (
        <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
          <Grid item xs={12} md={6}>
            <SupportProvided
              trainingSupport={franchiseDetails.trainingSupport}
              aidFinancing={franchiseDetails.aidFinancing}
              isInternationalExpansion={franchiseDetails.isInternationalExpansion}
            />
          </Grid>
        </Grid>
      )}

      {/* Current Outlets (Domestic) */}
      {hasData(expansionLocationData.currentOutletLocations?.domestic?.locations) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Current Outlets (India)
          </Typography>
          <ExpansionLocationGrid
            data={expansionLocationData.currentOutletLocations.domestic}
          />
        </>
      )}

      {/* Current Outlets (International) */}
      {hasData(expansionLocationData.currentOutletLocations?.international?.country) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Current Outlets (International)
          </Typography>
          <ExpansionLocationGridInternational
            data={expansionLocationData.currentOutletLocations.international}
          />
        </>
      )}

      {/* Expansion Locations (Domestic) */}
      {hasData(expansionLocationData.expansionLocations?.domestic?.locations) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }} id="expansion-location">
            Expansion Locations (India)
          </Typography>
          <ExpansionLocationGrid
            data={expansionLocationData.expansionLocations.domestic}
          />
        </>
      )}

      {/* Expansion Locations (International) */}
      {hasData(expansionLocationData.expansionLocations?.international?.country) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Expansion Locations (International)
          </Typography>
          <ExpansionLocationGridInternational
            data={expansionLocationData.expansionLocations.international}
          />
        </>
      )}

      {/* Awards */}
      {hasData(uploads.awards) && (
        <>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4, color: "#7ad03a" }}>
            Awards
          </Typography>
          {uploads.awards.length > 0 ? (
            <Grid container spacing={2}>
              {uploads.awards.map((award, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Slide direction="up" in={true} timeout={idx * 200}>
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
                      }}
                    >
                      {award.awardImage ? (
                        <img
                          src={award.awardImage}
                          loading="lazy"
                          alt={`Award ${idx + 1}`}
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
                  </Slide>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No awards available.
            </Typography>
          )}
        </>
      )}

      {/* Business Plan Documentation */}
      {hasData(uploads.businessPlan) && (
        <>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4, color: "#7ad03a" }}>
            Business Plan Documentation
          </Typography>
          <Grid container spacing={2}>
            {uploads.businessPlan.map((doc, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Slide direction="up" in={true} timeout={idx * 200}>
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
                    }}
                  >
                    <DescriptionIcon
                      sx={{
                        fontSize: 60,
                        color: "#3f51b5",
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{
                        color: "#212121",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {doc.title || "Business Document"}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#ff9800",
                        color: "white",
                        mt: 1,
                      }}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </Button>
                  </Box>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Disclaimer */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: "12px",
          bgcolor: "rgba(244, 67, 54, 0.05)",
        }}
      >
        <Typography variant="body1" fontWeight={700} color="#f44336">
          Disclaimer:
        </Typography>
        {!isMobile ? (
          <Typography variant="caption" color="#212121">
            Mr Franchise and the site sponsors accept no liability for the
            accuracy of any information contained on this site or on other
            linked sites. We recommend you take advice from a lawyer,
            accountant and franchise consultant experienced in franchising
            before you commit yourself. It is user's responsibility to satisfy
            yourself as to the accuracy and reliability of the information
            supplied. Please read the terms & conditions on MrFranchise.in
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', minWidth: '300px', py: 1 }}>
            <Typography variant="caption" color="#212121">
              Mr Franchise and the site sponsors accept no liability for the
              accuracy of any information contained on this site or on other
              linked sites. We recommend you take advice from a lawyer,
              accountant and franchise consultant experienced in franchising
              before you commit yourself. It is user's responsibility to satisfy
              yourself as to the accuracy and reliability of the information
              supplied. Please read the terms & conditions on MrFranchise.in
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(OverviewTab);