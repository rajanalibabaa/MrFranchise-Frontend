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
  Place,
  Map,
  LocationCity,
  ArrowBack,
  LocationOff,
  FiberManualRecord,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ExpansionLocationGrid = ({ data }) => {
  const [expandedState, setExpandedState] = useState(0);
  const [expandedDistrict, setExpandedDistrict] = useState(
    data?.locations?.[0]?.districts?.length > 0 ? "0-0" : null
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data || !Array.isArray(data.locations)) return null;

  const visibleLocations = data.locations;
  const hasData = data.locations.length > 0;

  const toggleState = (stateIndex) => {
    if (expandedState === stateIndex) {
      setExpandedState(null);
      setExpandedDistrict(null);
    } else {
      setExpandedState(stateIndex);
      setExpandedDistrict(null);
    }
  };

  const toggleDistrict = (stateIndex, distIndex) => {
    const districtKey = `${stateIndex}-${distIndex}`;
    setExpandedDistrict(expandedDistrict === districtKey ? null : districtKey);
  };

  const renderItemsWithFallback = (items, parentName) => {
    if (Array.isArray(items) && items.length > 0) {
      return items;
    }
    return [parentName];
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
          <Typography variant="body1">No locations available</Typography>
        </Box>
      ) : (
        <Box sx={{ display: isMobile ? "block" : "flex", height: isMobile ? "auto" : "400px" }}>
          <Box sx={{ display: isMobile ? "block" : "flex", flex: 1 }}>
            {/* States Column */}
            <Box
              sx={{
                width: isMobile ? "100%" : "300px",
                minWidth: isMobile ? "100%" : "300px",
                borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                bgcolor: "background.paper",
              }}
            >
              <Header title="States" icon={<Place sx={{ mr: 1, color: "#fff" }} />} />
              <Box sx={{ p: 1, maxHeight: "calc(75vh - 200px)", overflowY: "auto" }}>
                {renderItemsWithFallback(visibleLocations, "Country").map((loc, stateIndex) => (
                  <LocationCard
                    key={`state-${stateIndex}`}
                    onClick={() => toggleState(stateIndex)}
                    isActive={expandedState === stateIndex}
                    title={typeof loc === 'string' ? loc : (loc.state || "Unknown State")}
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
                bgcolor: expandedState !== null ? "background.paper" : "rgba(0,0,0,0.02)",
                display: isMobile ? (expandedState !== null ? "block" : "none") : "block",
              }}
            >
              <Header 
                title="Districts" 
                icon={<Map sx={{ mr: 1, color: "#fff" }} />}
                showBack={isMobile && expandedState !== null}
                onBack={() => setExpandedState(null)}
              />
              <Box sx={{ p: 1, maxHeight: "calc(75vh - 200px)", overflowY: "auto" }}>
                {expandedState !== null ? (
                  renderItemsWithFallback(
                    data.locations[expandedState]?.districts,
                    data.locations[expandedState]?.state || "Unknown State"
                  ).map((dist, distIndex) => {
                    const districtKey = `${expandedState}-${distIndex}`;
                    return (
                      <LocationCard
                        key={`district-${districtKey}`}
                        onClick={() => typeof dist !== 'string' && toggleDistrict(expandedState, distIndex)}
                        isActive={expandedDistrict === districtKey}
                        isSecondary
                        title={typeof dist === 'string' ? dist : (dist.district || "N/A")}
                      />
                    );
                  })
                ) : (
                  <EmptyState 
                    icon={<ArrowBack sx={{ fontSize: 40, color: "action.disabled", mb: 1 }} />}
                    text="Select a state"
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
                title={expandedDistrict !== null 
                  ? `${data.locations[expandedDistrict.split("-")[0]]?.districts[expandedDistrict.split("-")[1]]?.name} Cities`
                  : "Cities"}
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
                  maxHeight: "calc(75vh - 200px)",
                  overflowY: "auto",
                }}
              >
                {expandedDistrict !== null ? (
                  renderItemsWithFallback(
                    data.locations[expandedDistrict.split("-")[0]]?.districts[expandedDistrict.split("-")[1]]?.cities,
                    data.locations[expandedDistrict.split("-")[0]]?.districts[expandedDistrict.split("-")[1]]?.name || "Unknown District"
                  ).map((item, cityIndex) => (
                    <CityCard key={`city-${cityIndex}`} name={item} />
                  ))
                ) : (
                  <EmptyState 
                    icon={<ArrowBack sx={{ fontSize: 40, color: "action.disabled", mb: 1 }} />}
                    text="Select a district"
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

const Header = ({ title, icon, showBack = false, onBack }) => (
  <Typography
    variant="subtitle1"
    sx={{
      p: 2,
      position: "sticky",
      top: 0,
      bgcolor: "#7ad03a",
      zIndex: 2,
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
    }}
  >
    {icon}
    {title}
    {showBack && (
      <IconButton size="small" onClick={onBack} sx={{ ml: "auto" }}>
        <ArrowBack fontSize="small" />
      </IconButton>
    )}
  </Typography>
);

const LocationCard = ({ title, count, isActive, isSecondary = false, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      mb: 1,
      cursor: "pointer",
      borderRadius: "6px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderLeft: `4px solid ${isActive 
        ? isSecondary ? "#ff9800" : "#3f51b5" 
        : "transparent"}`,
      bgcolor: isActive
        ? isSecondary ? "rgba(255, 152, 0, 0.08)" : "rgba(25, 118, 210, 0.08)"
        : "background.paper",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      },
    }}
  >
    <CardContent sx={{ py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography fontWeight={isSecondary ? 500 : 600}>{title}</Typography>
      {count !== undefined && (
        <Chip
          label={count}
          size="small"
          color={isActive ? (isSecondary ? "secondary" : "primary") : "default"}
        />
      )}
    </CardContent>
  </Card>
);

const CityCard = ({ name }) => (
  <Card
    sx={{
      borderRadius: "6px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      bgcolor: "background.paper",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      },
    }}
  >
    <CardContent sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
      <FiberManualRecord sx={{ fontSize: 8, color: "primary.main", mr: 1 }} />
      <Typography variant="body2">{name}</Typography>
    </CardContent>
  </Card>
);

const EmptyState = ({ icon, text }) => (
  <Box sx={{ p: 2, textAlign: "center" }}>
    <Typography variant="body2" color="text.secondary">
      {icon}
      <br />
      {text}
    </Typography>
  </Box>
);

export default ExpansionLocationGrid;