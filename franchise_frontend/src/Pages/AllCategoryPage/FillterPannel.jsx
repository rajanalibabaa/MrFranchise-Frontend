
import React, { useState, useMemo,useEffect } from "react";
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
    mainCategories = [],
    subCategories = [],
    childCategories = [],
    franchiseModels = [],
    investmentRanges = [],
    states = [],
    districts = [],
    cities = [],
    isLoading = false,
    loadingSubCategories = false,
    loadingChildCategories = false,
    loadingDistricts = false,
    loadingCities = false,
    resultStats = { showing: 0, total: 0 },
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
      mainCategory: true,
      subCategory: true,
      modelType: true,
      location: true,
      investment: true,
    });

      useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const subcat = params.get('subcat');
      const state = params.get('state');
      const investmentRange = params.get('investmentRange');

      if (subcat) onFilterChange("subcat", subcat);
      if (state) onFilterChange("state", state);
      if (investmentRange) onFilterChange("investmentRange", investmentRange);
    }, [onFilterChange]);

    const toggleSection = (section) => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSearchTermChange = (field) => (e) => {
      setSearchTerms((prev) => ({ ...prev, [field]: e.target.value }));
    };

    // Filter options based on search terms
    const filteredSubCategories = useMemo(() => {
      const term = searchTerms.subCategory.toLowerCase();
      return subCategories
        .filter((sub) => sub?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [subCategories, searchTerms.subCategory]);

    const filteredModelTypes = useMemo(() => {
      const term = searchTerms.modelType.toLowerCase().trim();
      return franchiseModels.filter((type) => type?.toLowerCase().includes(term));
    }, [franchiseModels, searchTerms.modelType]);

    const filteredInvestmentRanges = useMemo(() => {
      const term = searchTerms.investmentRange.toLowerCase();
      return investmentRanges
        .filter((range) => range?.toLowerCase().includes(term))
        .slice(0, 50);
    }, [investmentRanges, searchTerms.investmentRange]);

    const filteredStates = useMemo(() => {
      const term = searchTerms.state.toLowerCase();
      return states
        .filter((state) => state?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [states, searchTerms.state]);

    const filteredDistricts = useMemo(() => {
      if (!filters.state) return [];
      const term = searchTerms.district.toLowerCase();
      return districts
        .filter((d) => d?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [filters.state, districts, searchTerms.district]);

    const filteredCities = useMemo(() => {
      if (!filters.district) return [];
      const term = searchTerms.city.toLowerCase();
      return cities
        .filter((c) => c?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [filters.district, cities, searchTerms.city]);

  

    return (
      <Box sx={{ pr: 2, height: "calc(100vh - 120px)", overflowY: "auto" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search brands..."
          value={filters.serchterm || ""}
          onChange={(e) => onFilterChange("serchterm", e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "#ff9800" }} />,
          }}
          sx={{ mb: 3 }}
        />

        {/* Main Category Filter
        <Accordion
          expanded={expandedSections.mainCategory}
          onChange={() => toggleSection("mainCategory")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Main Category
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <RadioGroup
                value={filters.maincat || ""}
                onChange={(e) => onFilterChange("maincat", e.target.value)}
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
                  label={<Typography fontSize="0.8125rem">All Categories</Typography>}
                  sx={{ mb: 0, mr: 0 }}
                />
                {mainCategories.map((category) => (
                  <FormControlLabel
                    key={`cat-${category}`}
                    value={category}
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
                    label={<Typography fontSize="0.8125rem">{category}</Typography>}
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion> */}

        {/* <Box>
          <Typography variant="h6">Industry</Typography>
          <Typography ml={5}color="#ff9800">Food & Beverage</Typography>
        </Box> */}

        {/* Sub Category Filter */}
        <Accordion
          expanded={expandedSections.subCategory}
          onChange={() => toggleSection("subCategory")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Sub Category
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search sub categories..."
                value={searchTerms.subCategory}
                onChange={handleSearchTermChange("subCategory")}
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "#ff9800" }} />,
                }}
              />
              {loadingSubCategories ? (
                <Box sx={{ p: 2 }}>
                  <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                </Box>
              ) : (
                <RadioGroup
                  value={filters.subcat || ""}
                  onChange={(e) => onFilterChange("subcat", e.target.value)}
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
                    label={<Typography fontSize="0.8125rem">All Sub Categories</Typography>}
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
                        label={<Typography fontSize="0.8125rem">{subCategory}</Typography>}
                        sx={{ mb: 0, mr: 0 }}
                      />
                      {filters.subcat === subCategory && (
                        <Collapse in={filters.subcat === subCategory}>
                          <Accordion
                            expanded={expandedSections.subCategory}
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
                              sx={{
                                minHeight: "36px",
                                px: 1,
                                "& .MuiAccordionSummary-content": { my: "2px" },
                              }}
                            >
                              <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.8125rem" }}>
                                Child Categories
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 0, px: 1 }}>
  {loadingChildCategories ? (
    <Box sx={{ p: 2 }}>
      <CircularProgress size={20} sx={{ color: "#ff9800" }} />
    </Box>
  ) : (
    <RadioGroup
      value={filters.childcat || ""}
      onChange={(e) => onFilterChange("childcat", e.target.value)}
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
        label={<Typography fontSize="0.8125rem">All Child Categories</Typography>}
        sx={{ mb: 0, mr: 0 }}
      />
      {childCategories.map((childCategory) => (
        <FormControlLabel
          key={`childcat-${childCategory}`}
          value={childCategory}
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
          label={<Typography fontSize="0.8125rem">{childCategory}</Typography>}
          sx={{ mb: 0, mr: 0 }}
        />
      ))}
    </RadioGroup>
  )}
</AccordionDetails>

                          </Accordion>
                        </Collapse>
                      )}
                    </Box>
                  ))}
                </RadioGroup>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Model Type Filter */}
        <Accordion
          expanded={expandedSections.modelType}
          onChange={() => toggleSection("modelType")}
          disableGutters
          elevation={0}
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Model Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ px: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search model types..."
                value={searchTerms.modelType}
                onChange={handleSearchTermChange("modelType")}
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "#ff9800" }} />,
                }}
              />
              <RadioGroup
                value={filters.modelType || ""}
                onChange={(e) => onFilterChange("modelType", e.target.value)}
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
                  label={<Typography fontSize="0.8125rem">All Model Types</Typography>}
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
          sx={{ mb: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
            sx={{
              px: 1,
              "&.Mui-expanded": { minHeight: "48px" },
            }}
          >
            <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
              Location Filters
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {/* State Filter */}
            <Box sx={{ px: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search states..."
                value={searchTerms.state}
                onChange={handleSearchTermChange("state")}
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "#ff9800" }} />,
                }}
              />
              <RadioGroup
                value={filters.state || ""}
                onChange={(e) => onFilterChange("state", e.target.value)}
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
                  label={<Typography fontSize="0.8125rem">All States</Typography>}
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
                    label={<Typography fontSize="0.8125rem">{state}</Typography>}
                    sx={{ mb: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>

            {/* District Filter */}
            <Accordion
              expanded={!!filters.state}
              disabled={!filters.state}
              elevation={0}
              sx={{ mb: 1, "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: "1rem" }} />}
                sx={{
                  minHeight: "36px",
                  px: 1,
                  "& .MuiAccordionSummary-content": { my: "2px" },
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" fontSize="0.8125rem">
                  Cities
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search districts..."
                  value={searchTerms.district}
                  onChange={handleSearchTermChange("district")}
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "#ff9800" }} />,
                  }}
                />
                {loadingDistricts ? (
                  <Box sx={{ p: 2 }}>
                    <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                  </Box>
                ) : (
                  <RadioGroup
                    value={filters.district || ""}
                    onChange={(e) => onFilterChange("district", e.target.value)}
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
                      label={<Typography fontSize="0.8125rem">All Districts</Typography>}
                      sx={{ mb: 0, mr: 0 }}
                    />
                    {filteredDistricts.map((district) => (
                      <FormControlLabel
                        key={`district-${district}`}
                        value={district}
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
                        label={<Typography fontSize="0.8125rem">{district}</Typography>}
                        sx={{ mb: 0, mr: 0 }}
                      />
                    ))}
                  </RadioGroup>
                )}
              </AccordionDetails>
            </Accordion>

            {/* City Filter */}
            {/* <Accordion
              expanded={!!filters.district}
              disabled={!filters.district}
              elevation={0}
              sx={{ "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: "1rem" }} />}
                sx={{
                  minHeight: "36px",
                  px: 1,
                  "& .MuiAccordionSummary-content": { my: "2px" },
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" fontSize="0.8125rem">
                  City
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search cities..."
                  value={searchTerms.city}
                  onChange={handleSearchTermChange("city")}
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "#ff9800" }} />,
                  }}
                />
                {loadingCities ? (
                  <Box sx={{ p: 2 }}>
                    <CircularProgress size={20} sx={{ color: "#ff9800" }} />
                  </Box>
                ) : (
                  <RadioGroup
                    value={filters.city || ""}
                    onChange={(e) => onFilterChange("city", e.target.value)}
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
                      label={<Typography fontSize="0.8125rem">All Cities</Typography>}
                      sx={{ mb: 0, mr: 0 }}
                    />
                    {filteredCities.map((city) => (
                      <FormControlLabel
                        key={`city-${city}`}
                        value={city}
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
                        label={<Typography fontSize="0.8125rem">{city}</Typography>}
                        sx={{ mb: 0, mr: 0 }}
                      />
                    ))}
                  </RadioGroup>
                )}
              </AccordionDetails>
            </Accordion> */}
          </AccordionDetails>
        </Accordion>

        {/* Investment Range Filter */}
      {/* Investment Range Filter */}
<Accordion
  expanded={expandedSections.investment}
  onChange={() => toggleSection("investment")}
  disableGutters
  elevation={0}
  sx={{ mb: 2, "&:before": { display: "none" } }}
>
  <AccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: "#4caf50" }} />}
    sx={{
      px: 1,
      "&.Mui-expanded": { minHeight: "48px" },
    }}
  >
    <Typography sx={{ color: "#4caf50", fontWeight: "bold", fontSize: "0.875rem" }}>
      Investment Range
    </Typography>
  </AccordionSummary>
  <AccordionDetails sx={{ p: 0 }}>
    <Box sx={{ px: 3, pt: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search investment ranges..."
        value={searchTerms.investmentRange}
        onChange={handleSearchTermChange("investmentRange")}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "#ff9800" }} />,
        }}
      />
      <RadioGroup
        value={filters.investmentRange || ""}
        onChange={(e) => onFilterChange("investmentRange", e.target.value)}
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
          label={<Typography fontSize="0.8125rem">All Ranges</Typography>}
          sx={{ mb: 0, mr: 0 }}
        />
        {filteredInvestmentRanges
          .slice() // Create a copy to avoid mutating the original array
          .sort((a, b) => {
            // Create a priority map for special cases
            const priorityMap = {
              "Below - 50,000": 0,
              "Rs. 50,000 - 2 L": 1,
              "Rs. 2 L - 5 L": 2,
              "Rs. 5 L - 10 L": 3,
              "Rs. 10 L - 20 L": 4,
              "Rs. 20 L - 30 L": 5,
              "Rs. 30 L - 50 L": 6,
              "Rs. 50 L - 1 Cr": 7,
              "Rs. 1 Cr - 2 Crs": 8,
              "Rs. 2 Crs - 5 Crs": 9
            };

            // If both ranges are in our priority map, use that order
            if (priorityMap[a] !== undefined && priorityMap[b] !== undefined) {
              return priorityMap[a] - priorityMap[b];
            }

            // Fallback to numerical comparison for unknown ranges
            const getValue = (range) => {
              if (range.includes("Below")) return 0;
              const match = range.match(/(\d[\d,.]*)/);
              if (!match) return 0;
              const num = parseFloat(match[0].replace(/,/g, ''));
              if (range.includes("Cr")) return num * 10000000;
              if (range.includes("L")) return num * 100000;
              return num;
            };

            return getValue(a) - getValue(b);
          })
          .map((range) => (
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
              label={<Typography fontSize="0.8125rem">{range}</Typography>}
              sx={{ mb: 0, mr: 0 }}
            />
          ))}
      </RadioGroup>
    </Box>
  </AccordionDetails>
</Accordion>


        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" sx={{ color: "#4caf50", textAlign: "center" }}>
          Showing {resultStats.showing || 0} of {resultStats.total || 0} brands
        </Typography>
      </Box>
    );
  }
);

export default FilterPanel;