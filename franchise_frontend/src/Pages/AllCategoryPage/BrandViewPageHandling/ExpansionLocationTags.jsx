import React , { useMemo } from "react";
import { Box, Typography } from "@mui/material";

const ExpansionLocationTags = ({
  brand,
  isMobile,
  isTablet,
  isSmallDesktop,
  isLargeDesktop,
}) => {

  // Process location data more safely with null checks
  const locations = useMemo(() => {
    try {
      return (
        brand?.[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations
          ?.flatMap((loc) =>
            loc?.districts?.flatMap((dist) =>
              dist?.cities?.map((city) => ({
                city,
                district: dist?.district,
                state: loc?.state,
              })) || []
            ) || []
          ) || []
      );
    } catch (error) {
      console.error("Error processing location data:", error);
      return [];
    }
  }, [brand]);

  const category = useMemo(
    () => brand?.[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories || {},
    [brand]
  );

  // Create formatted chips with unique keys
  const formattedChipsState = useMemo(
    () =>
      locations.map((loc, index) => ({
        key: `${loc.state}-${index}-${Date.now()}`,
        label: `${category.child || ""} franchise in ${loc.state}`,
      })),
    [locations, category]
  );

  const formattedChipsDistrict = useMemo(
    () =>
      locations.map((loc, index) => ({
        key: `${loc.district}-${index}-${Date.now()}`,
        label: `${category.child || ""} franchise in ${loc.district}`,
      })),
    [locations, category]
  );

  const formattedChipsCity = useMemo(
    () =>
      locations.map((loc, index) => ({
        key: `${loc.city}-${index}-${Date.now()}`,
        label: `${category.child || ""} franchise in ${loc.city}`,
      })),
    [locations, category]
  );

  // Filter out duplicates
  const uniqueStateChips = useMemo(
    () =>
      Array.from(
        new Map(formattedChipsState.map((item) => [item.label, item])).values()
      ),
    [formattedChipsState]
  );

  const uniqueDistrictChips = useMemo(
    () =>
      Array.from(
        new Map(formattedChipsDistrict.map((item) => [item.label, item])).values()
      ),
    [formattedChipsDistrict]
  );

  const uniqueCityChips = useMemo(
    () =>
      Array.from(
        new Map(formattedChipsCity.map((item) => [item.label, item])).values()
      ),
    [formattedChipsCity]
  );

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        p: 2,
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : isTablet
          ? "repeat(2, 1fr)"
          : "repeat(3, 1fr)",
        gap: 2,
        height: isMobile ? "auto" : "50px",
        overflowY: "auto",
      }}
    >
      {/* State Column - Always visible */}
      <Box>
        {uniqueStateChips.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {uniqueStateChips
              .slice(0, isMobile ? 3 : uniqueStateChips.length)
              .map((chip) => (
                <Typography
                  key={chip.key}
                  variant="caption"
                  sx={{
                    borderRadius: "4px",
                    color: "black",
                    whiteSpace: "nowrap",
                    fontSize: isMobile ? "0.7rem" : "0.8rem",
                  }}
                >
                  {chip.label}
                </Typography>
              ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              mt: 2,
            }}
          >
            No state locations available
          </Typography>
        )}
      </Box>

      {/* District Column - hidden on mobile */}
      {!isMobile && (
        <Box>
          {uniqueDistrictChips.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {uniqueDistrictChips
                .slice(0, isMobile ? 3 : uniqueDistrictChips.length)
                .map((chip) => (
                  <Typography
                    key={chip.key}
                    variant="caption"
                    sx={{
                      borderRadius: "4px",
                      color: "black",
                      whiteSpace: "nowrap",
                      fontSize: isMobile ? "0.7rem" : "0.8rem",
                    }}
                  >
                    {chip.label}
                  </Typography>
                ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                mt: 2,
              }}
            >
              No district locations available
            </Typography>
          )}
        </Box>
      )}

      {/* City Column - only visible on desktop */}
      {(isLargeDesktop || isSmallDesktop) && (
        <Box>
          {uniqueCityChips.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {uniqueCityChips
                .slice(0, isMobile ? 3 : uniqueCityChips.length)
                .map((chip) => (
                  <Typography
                    key={chip.key}
                    variant="caption"
                    sx={{
                      borderRadius: "4px",
                      color: "black",
                      whiteSpace: "nowrap",
                      fontSize: isMobile ? "0.7rem" : "0.8rem",
                    }}
                  >
                    {chip.label}
                  </Typography>
                ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                mt: 2,
              }}
            >
              No city locations available
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ExpansionLocationTags);