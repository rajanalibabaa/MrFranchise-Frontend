import React from "react";
import { Typography, Box } from "@mui/material";
import ExpansionLocationGrid from "./ExpansionLocationGridOverTab";
import ExpansionLocationGridInternational from "./ExpansionLocationGridInternationalOverviewtab";

const LocationSections = ({ expansionLocationData }) => {
  const hasData = (data) => {
    if (Array.isArray(data)) return data.length > 0;
    return !!data;
  };

  return (
    <>
      {/* Current Outlets Domestic */}
      {hasData(expansionLocationData?.currentOutletLocations?.domestic?.locations) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 8, color: "#7ad03a" }}>
            Current Outlets (India)
          </Typography>
          <ExpansionLocationGrid
            data={expansionLocationData.currentOutletLocations.domestic}
          />
        </>
      )}

      {/* Current Outlets International */}
      {hasData(expansionLocationData?.currentOutletLocations?.international?.country) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 8, color: "#7ad03a" }}>
            Current Outlets (International)
          </Typography>
          <ExpansionLocationGridInternational
            data={expansionLocationData.currentOutletLocations.international}
          />
        </>
      )}

      {/* Expansion Locations Domestic */}
      {hasData(expansionLocationData?.expansionLocations?.domestic?.locations) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 8, color: "#7ad03a" }}>
            Expansion Locations (India)
          </Typography>
          <ExpansionLocationGrid
            data={expansionLocationData.expansionLocations.domestic}
          />
        </>
      )}

      {/* Expansion Locations International */}
      {hasData(expansionLocationData?.expansionLocations?.international?.country) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 8, color: "#7ad03a" }}>
            Expansion Locations (International)
          </Typography>
          <ExpansionLocationGridInternational
            data={expansionLocationData.expansionLocations.international}
          />
        </>
      )}
    </>
  );
};

export default LocationSections;