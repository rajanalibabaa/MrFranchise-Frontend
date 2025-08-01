import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

// Memoized FormControlLabel for checkboxes
const MemoizedCheckboxLabel = React.memo(({ id, label, checked, onChange }) => (
  <FormControlLabel
    control={<Checkbox checked={checked} onChange={onChange} color="primary" />}
    label={label}
    sx={{ display: "block", ml: 1 }}
  />
));

const FilterPanel = React.memo(
  ({
    filters,
    onFilterChange,
    onClearFilters,
    activeFilterCount,
    categories = [],
    subCategories = [],
    childCategories = [],
    modelTypes = [],
    investmentRanges = [],
    locationData = { states: [], districts: [], cities: [] },
    resultStats = { showing: 0, total: 0 },
    isLoading = false,
  }) => {
    const [searchTerms, setSearchTerms] = useState({
      subCategory: "",
      modelType: "",
      investmentRange: "",
      state: "",
      district: "",
      city: "",
    });

    const [expandedSections, setExpandedSections] = useState({
      subCategory: true,
      childCategory: true,
      modelType: true,
      location: true,
      investment: true,
    });

    const toggleSection = useCallback((section) => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    }, []);

    // Debounce search terms with useMemo to prevent unnecessary state updates
    const debouncedSearchTerms = useMemo(() => {
      const debounced = {};
      Object.keys(searchTerms).forEach((key) => {
        debounced[key] = searchTerms[key];
      });
      return debounced;
    }, [searchTerms]);

    // Memoized filtered options with proper null checks
    const filteredSubCategories = useMemo(() => {
      const term = debouncedSearchTerms.subCategory.toLowerCase();
      return subCategories
        .filter((sub) => sub.toLowerCase().includes(term))
        .slice(0, 100);
    }, [subCategories, debouncedSearchTerms.subCategory]);

    const filteredChildCategories = useMemo(() => {
      if (!filters.selectedSubCategory) return [];
      return (childCategories || [])
        .filter(
          (child) => child.parentSubCategory === filters.selectedSubCategory
        )
        .slice(0, 50);
    }, [filters.selectedSubCategory, childCategories]);

    const filteredModelTypes = useMemo(() => {
      const term = debouncedSearchTerms.modelType.toLowerCase().trim();
      return modelTypes.filter((type) => type.toLowerCase().includes(term));
    }, [modelTypes, debouncedSearchTerms.modelType]);

    const filteredInvestmentRanges = useMemo(() => {
      const term = debouncedSearchTerms.investmentRange.toLowerCase();
      return investmentRanges
        .filter((range) => range.toLowerCase().includes(term))
        .slice(0, 50);
    }, [investmentRanges, debouncedSearchTerms.investmentRange]);

    const filteredStates = useMemo(() => {
      const term = debouncedSearchTerms.state.toLowerCase();
      return (locationData.states || [])
        .filter((state) => state.toLowerCase().includes(term))
        .slice(0, 100);
    }, [locationData.states, debouncedSearchTerms.state]);

    const filteredDistricts = useMemo(() => {
      if (!filters.selectedState) return [];
      const term = debouncedSearchTerms.district.toLowerCase();
      return (locationData.districts || [])
        .filter((d) => d.state === filters.selectedState)
        .filter((d) => d.district.toLowerCase().includes(term))
        .slice(0, 100);
    }, [
      filters.selectedState,
      locationData.districts,
      debouncedSearchTerms.district,
    ]);

    const filteredCities = useMemo(() => {
      if (!filters.selectedDistrict) return [];
      const term = debouncedSearchTerms.city.toLowerCase();
      return (locationData.cities || [])
        .filter((c) => c.district === filters.selectedDistrict)
        .filter((c) => c.city.toLowerCase().includes(term))
        .slice(0, 100);
    }, [
      filters.selectedDistrict,
      locationData.cities,
      debouncedSearchTerms.city,
    ]);

    const handleSubCategoryChange = useCallback(
      (value) => {
        onFilterChange("selectedSubCategory", value);
        onFilterChange("selectedChildCategory", []);
      },
      [onFilterChange]
    );
    // Safe result stats calculation
    const safeResultStats = useMemo(
      () => ({
        showing: resultStats?.showing || 0,
        total: resultStats?.total || 0,
      }),
      [resultStats]
    );

    const handleChildCategoryToggle = useCallback(
      (value) => (e) => {
        const checked = e.target.checked;
        const newSelection = checked
          ? [...(filters.selectedChildCategory || []), value]
          : (filters.selectedChildCategory || []).filter(
              (item) => item !== value
            );
        onFilterChange("selectedChildCategory", newSelection);
      },
      [filters.selectedChildCategory, onFilterChange]
    );

    // Generic select change handler
    const handleSelectChange = useCallback(
      (field) => (e) => {
        // For location hierarchy, clear dependent fields when parent changes
        if (field === "selectedState") {
          onFilterChange("selectedDistrict", "");
          onFilterChange("selectedCity", "");
        } else if (field === "selectedDistrict") {
          onFilterChange("selectedCity", "");
        }
        onFilterChange(field, e.target.value);
      },
      [onFilterChange]
    );

    // Loading state
    if (isLoading) {
      return (
        <Box sx={{ p: 2 }}>
          {[...Array(6)].map((_, i) => (
            <Box key={`skeleton-${i}`} sx={{ mb: 3 }}>
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="rectangular" height={56} />
            </Box>
          ))}
        </Box>
      );
    }

    return (
      <Box sx={{ pr: 2, height: "calc(100vh - 120px)", overflowY: "auto" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Filters</Typography>
          <Button
            size="small"
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
            startIcon={<ClearIcon />}
            sx={{ color: "#ff9800" }}
          >
            Clear
          </Button>
        </Box>

        {/* Search Input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search brands..."
          value={filters.searchTerm || ""}
          onChange={(e) => onFilterChange("searchTerm", e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "#ff9800" }} />,
          }}
          sx={{ mb: 3 }}
        />

        {/* Sub Category Filter */}
        <Accordion
          expanded={expandedSections.subCategory}
          onChange={() => toggleSection("subCategory")}
          disableGutters
          elevation={0}
          sx={{
            mb: 2,
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "&.Mui-expanded": {
                minHeight: "48px",
              },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Sub Category
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filters.selectedSubCategory || ""}
                onChange={(e) => handleSubCategoryChange(e.target.value)}
              >
                <FormControlLabel
                  value=""
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#ff9800",
                        "&.Mui-checked": { color: "#4caf50" },
                        padding: "6px",
                      }}
                    />
                  }
                  label={
                    <Typography fontSize="0.8125rem">
                      All Sub Categories
                    </Typography>
                  }
                  sx={{ mb: 0, mr: 0 }}
                />

                {filteredSubCategories.map((subCategory) => (
                  <Box key={`subcat-container-${subCategory}`} sx={{ mb: 0 }}>
                    <FormControlLabel
                      key={`subcat-${subCategory}`}
                      value={subCategory}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            color: "#ff9800",
                            "&.Mui-checked": { color: "#4caf50" },
                            padding: "6px",
                          }}
                        />
                      }
                      label={
                        <Typography fontSize="0.8125rem">
                          {subCategory}
                        </Typography>
                      }
                      sx={{ mb: 0, mr: 0 }}
                    />

                    {/* Child Categories for this specific subcategory */}
                    {filters.selectedSubCategory === subCategory &&
                      filteredChildCategories.length > 0 && (
                        <Collapse
                          in={filters.selectedSubCategory === subCategory}
                        >
                          <Accordion
                            expanded={expandedSections.childCategory}
                            onChange={() => toggleSection("childCategory")}
                            disableGutters
                            elevation={0}
                            sx={{
                              ml: 3,
                              mt: 0.5,
                              backgroundColor: "rgba(0, 0, 0, 0.02)",
                              "&:before": { display: "none" },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ fontSize: "1rem" }} />
                              }
                              sx={{
                                minHeight: "36px",
                                px: 1,
                                "& .MuiAccordionSummary-content": {
                                  my: "2px",
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "#4caf50",
                                  fontWeight: "bold",
                                  fontSize: "0.8125rem",
                                }}
                              >
                                Child Categories
                              </Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ pt: 0, px: 1 }}>
                              <Box
                                sx={{
                                  maxHeight: 200,
                                  overflow: "auto",
                                  "&::-webkit-scrollbar": {
                                    width: "4px",
                                  },
                                  "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "#e0e0e0",
                                    borderRadius: "2px",
                                  },
                                }}
                              >
                                {filteredChildCategories.map(
                                  (childCategory) => (
                                    <MemoizedCheckboxLabel
                                      key={`childcat-${childCategory.id}`}
                                      id={childCategory.id}
                                      label={
                                        <Typography fontSize="0.8125rem">
                                          {childCategory.name}
                                        </Typography>
                                      }
                                      checked={(
                                        filters.selectedChildCategory || []
                                      ).includes(childCategory.id)}
                                      onChange={handleChildCategoryToggle(
                                        childCategory.id
                                      )}
                                      sx={{ mb: 0 }}
                                    />
                                  )
                                )}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </Collapse>
                      )}
                  </Box>
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Model Type Filter */}
        <Accordion
          expanded={expandedSections.modelType}
          onChange={() => toggleSection("modelType")}
          disableGutters
          elevation={0}
          sx={{
            mb: 2,
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "&.Mui-expanded": {
                minHeight: "48px",
              },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Model Type
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filters.selectedModelType || ""}
                onChange={handleSelectChange("selectedModelType")}
              >
                <FormControlLabel
                  value=""
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#ff9800",
                        "&.Mui-checked": { color: "#4caf50" },
                        padding: "6px",
                      }}
                    />
                  }
                  label={
                    <Typography fontSize="0.8125rem">
                      All Model Types
                    </Typography>
                  }
                  sx={{ mb: 0, mr: 0 }}
                />
                {filteredModelTypes.map((type) => (
                  <FormControlLabel
                    key={`modeltype-${type}`}
                    value={type}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={<Typography fontSize="0.8125rem">{type}</Typography>}
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Location Filters */}
        <Accordion
          expanded={expandedSections.location}
          onChange={() => toggleSection("location")}
          disableGutters
          elevation={0}
          sx={{
            mb: 2,
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "&.Mui-expanded": {
                minHeight: "48px",
              },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Location Filters
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            {/* State Radio List with Scroll */}
            <FormControl
              component="fieldset"
              sx={{
                mb: 1,
                maxHeight: 200,
                overflowY: "auto",
                px: 1,
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#e0e0e0",
                  borderRadius: "2px",
                },
              }}
            >
              <RadioGroup
                value={filters.selectedState || ""}
                onChange={handleSelectChange("selectedState")}
              >
                <FormControlLabel
                  value=""
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#ff9800",
                        "&.Mui-checked": { color: "#4caf50" },
                        padding: "6px",
                      }}
                    />
                  }
                  label={
                    <Typography fontSize="0.8125rem">All States</Typography>
                  }
                  sx={{ mb: 0, mr: 0 }}
                />
                {filteredStates.map((state) => (
                  <FormControlLabel
                    key={`state-${state}`}
                    value={state}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="0.8125rem">{state}</Typography>
                    }
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* District Accordion */}
            <Accordion
              expanded={!!filters.selectedState}
              disabled={!filters.selectedState}
              elevation={0}
              sx={{
                mb: 1,
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: "1rem" }} />}
                sx={{
                  minHeight: "36px",
                  px: 1,
                  "& .MuiAccordionSummary-content": {
                    my: "2px",
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  fontSize="0.8125rem"
                >
                  District
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  maxHeight: 200,
                  overflowY: "auto",
                  px: 1,
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#e0e0e0",
                    borderRadius: "2px",
                  },
                }}
              >
                <RadioGroup
                  value={filters.selectedDistrict || ""}
                  onChange={handleSelectChange("selectedDistrict")}
                >
                  <FormControlLabel
                    value=""
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="0.8125rem">
                        All Districts
                      </Typography>
                    }
                    sx={{ mb: 0, mr: 0 }}
                  />
                  {filteredDistricts.map((district, index) => (
                    <FormControlLabel
                      key={`district-${index}`}
                      value={district.district}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            color: "#ff9800",
                            "&.Mui-checked": { color: "#4caf50" },
                            padding: "6px",
                          }}
                        />
                      }
                      label={
                        <Typography fontSize="0.8125rem">
                          {district.district}
                        </Typography>
                      }
                      sx={{ mb: 0, mr: 0 }}
                    />
                  ))}
                </RadioGroup>
              </AccordionDetails>
            </Accordion>

            {/* City Accordion */}
            <Accordion
              expanded={!!filters.selectedDistrict}
              disabled={!filters.selectedDistrict}
              elevation={0}
              sx={{
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: "1rem" }} />}
                sx={{
                  minHeight: "36px",
                  px: 1,
                  "& .MuiAccordionSummary-content": {
                    my: "2px",
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  fontSize="0.8125rem"
                >
                  City
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  maxHeight: 200,
                  overflowY: "auto",
                  px: 1,
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#e0e0e0",
                    borderRadius: "2px",
                  },
                }}
              >
                <RadioGroup
                  value={filters.selectedCity || ""}
                  onChange={handleSelectChange("selectedCity")}
                >
                  <FormControlLabel
                    value=""
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="0.8125rem">All Cities</Typography>
                    }
                    sx={{ mb: 0, mr: 0 }}
                  />
                  {filteredCities.map((city, index) => (
                    <FormControlLabel
                      key={`city-${index}`}
                      value={city.city}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            color: "#ff9800",
                            "&.Mui-checked": { color: "#4caf50" },
                            padding: "6px",
                          }}
                        />
                      }
                      label={
                        <Typography fontSize="0.8125rem">
                          {city.city}
                        </Typography>
                      }
                      sx={{ mb: 0, mr: 0 }}
                    />
                  ))}
                </RadioGroup>
              </AccordionDetails>
            </Accordion>
          </AccordionDetails>
        </Accordion>

        {/* Investment Range Filter */}
        <Accordion
          expanded={expandedSections.investment}
          onChange={() => toggleSection("investment")}
          disableGutters
          elevation={0}
          sx={{
            mb: 2,
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "&.Mui-expanded": {
                minHeight: "48px",
              },
            }}
          >
            <Typography
              sx={{
                color: "#4caf50",
                fontWeight: "bold",
                fontSize: "0.875rem",
              }}
            >
              Investment Range
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 3, pt: 1 }}>
              <RadioGroup
                value={filters.selectedInvestmentRange || ""}
                onChange={handleSelectChange("selectedInvestmentRange")}
              >
                <FormControlLabel
                  value=""
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#ff9800",
                        "&.Mui-checked": { color: "#4caf50" },
                        padding: "6px",
                      }}
                    />
                  }
                  label={
                    <Typography fontSize="0.8125rem">All Ranges</Typography>
                  }
                  sx={{ mb: 0, mr: 0 }}
                />
                {filteredInvestmentRanges.map((range) => (
                  <FormControlLabel
                    key={`range-${range}`}
                    value={range}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": { color: "#4caf50" },
                          padding: "6px",
                        }}
                      />
                    }
                    label={
                      <Typography fontSize="0.8125rem">{range}</Typography>
                    }
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Results Count */}
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="body2"
          sx={{ color: "#4caf50", textAlign: "center" }}
        >
          Showing {safeResultStats.showing || 0} of {safeResultStats.total || 0}{" "}
          brands
        </Typography>
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
      prevProps.filters === nextProps.filters &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.activeFilterCount === nextProps.activeFilterCount &&
      prevProps.resultStats?.showing === nextProps.resultStats?.showing &&
      prevProps.resultStats?.total === nextProps.resultStats?.total &&
      prevProps.subCategories === nextProps.subCategories &&
      prevProps.childCategories === nextProps.childCategories &&
      prevProps.modelTypes === nextProps.modelTypes &&
      prevProps.investmentRanges === nextProps.investmentRanges &&
      prevProps.locationData.states === nextProps.locationData.states &&
      prevProps.locationData.districts === nextProps.locationData.districts &&
      prevProps.locationData.cities === nextProps.locationData.cities
    );
  }
);

export default FilterPanel;
