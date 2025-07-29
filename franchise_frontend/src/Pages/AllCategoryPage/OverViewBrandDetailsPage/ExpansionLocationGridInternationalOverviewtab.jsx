import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Public,
  Map,
  LocationCity,
  ArrowBack,
  LocationOff,
  FiberManualRecord,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ExpansionLocationGridInternational = ({ data }) => {
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data || !Array.isArray(data.country)) return null;

  const visibleCountries = data.country;
  const hasData = data.country.length > 0;

  const toggleCountry = (countryIndex) => {
    if (expandedCountry === countryIndex) {
      setExpandedCountry(null);
      setExpandedDistrict(null);
    } else {
      setExpandedCountry(countryIndex);
      setExpandedDistrict(null);
    }
  };

  const toggleDistrict = (countryIndex, distIndex) => {
    const districtKey = `${countryIndex}-${distIndex}`;
    setExpandedDistrict(expandedDistrict === districtKey ? null : districtKey);
  };

  return (
    <Box
      sx={{
        mt: 2,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {!hasData ? (
        <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body1">No international locations available</Typography>
        </Box>
      ) : (
        <Box sx={{ display: isMobile ? "block" : "flex", height: isMobile ? "auto" : "400px" }}>
          <Box sx={{ display: isMobile ? "block" : "flex", flex: 1, overflow: isMobile ? "visible" : "auto" }}>
            {/* Countries Column */}
            <Box
              sx={{
                width: isMobile ? "100%" : "300px",
                minWidth: isMobile ? "100%" : "300px",
                borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                bgcolor: "background.paper",
              }}
            >
              <Header title="Countries" icon={<Public sx={{ mr: 1, color: "#fff" }} />} />
              <Box sx={{ p: 1 }}>
                {visibleCountries.map((countryItem, countryIndex) => (
                  <LocationCard
                    key={`country-${countryIndex}`}
                    onClick={() => toggleCountry(countryIndex)}
                    isActive={expandedCountry === countryIndex}
                    title={countryItem.states || "Unknown Country"}
                    subtitle={countryItem.region}
                  />
                ))}
              </Box>
            </Box>

            {/* Districts Column */}
            <Box
              sx={{
                width: isMobile ? "100%" : "300px",
                minWidth: isMobile ? "100%" : "300px",
                borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                bgcolor: expandedCountry !== null ? "background.paper" : "rgba(0,0,0,0.02)",
                display: isMobile ? (expandedCountry !== null ? "block" : "none") : "block",
              }}
            >
              <Header 
                title="Districts/States" 
                icon={<Map sx={{ mr: 1, color: "#fff" }} />}
                showBack={isMobile && expandedCountry !== null}
                onBack={() => setExpandedCountry(null)}
              />
              <Box sx={{ p: 1 }}>
                {expandedCountry !== null && Array.isArray(data.country[expandedCountry].district) ? (
                  data.country[expandedCountry].district.length > 0 ? (
                    data.country[expandedCountry].district.map((distItem, distIndex) => {
                      const districtKey = `${expandedCountry}-${distIndex}`;
                      return (
                        <LocationCard
                          key={`district-${districtKey}`}
                          onClick={() => toggleDistrict(expandedCountry, distIndex)}
                          isActive={expandedDistrict === districtKey}
                          isSecondary
                          title={distItem.district || "N/A"}
                        />
                      );
                    })
                  ) : (
                    <EmptyState 
                      icon={<LocationOff sx={{ fontSize: 40, color: "action.disabled", mb: 1 }} />}
                      text="No districts/states available"
                    />
                  )
                ) : (
                  <EmptyState 
                    icon={<ArrowBack sx={{ fontSize: 40, color: "action.disabled", mb: 1 }} />}
                    text={expandedCountry === null ? "Select a country" : "Loading districts..."}
                  />
                )}
              </Box>
            </Box>

            {/* Cities Column */}
            <Box
              sx={{
                flex: 1,
                bgcolor: expandedDistrict !== null ? "background.paper" : "rgba(0,0,0,0.02)",
                display: isMobile ? (expandedDistrict !== null ? "block" : "none") : "block",
              }}
            >
              <Header 
                title="Cities"
                icon={<LocationCity sx={{ mr: 1, color: "#fff" }} />}
                showBack={isMobile && expandedDistrict !== null}
                onBack={() => setExpandedDistrict(null)}
              />
              <Box
                sx={{
                  p: 1,
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 1,
                }}
              >
                {expandedDistrict !== null ? (
                  (() => {
                    const [countryIdx, districtIdx] = expandedDistrict.split("-").map(Number);
                    const cities = data.country[countryIdx]?.district[districtIdx]?.cities;

                    return Array.isArray(cities) && cities.length > 0 ? (
                      cities.map((city, cityIndex) => (
                        <CityCard key={`city-${cityIndex}`} name={city} />
                      ))
                    ) : (
                      <EmptyState 
                        icon={<LocationOff sx={{ fontSize: 40, color: "action.disabled", mb: 1 }} />}
                        text="No cities available"
                      />
                    );
                  })()
                ) : (
                  <EmptyState 
                    icon={<ArrowBack sx={{ fontSize: 40, color: "action.disabled", mb: 1 }} />}
                    text={expandedCountry === null ? "Select a district" : "Select a district to view cities"}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

// Reuse the same Header, LocationCard, CityCard, and EmptyState components from ExpansionLocationGrid.js

export default ExpansionLocationGridInternational;