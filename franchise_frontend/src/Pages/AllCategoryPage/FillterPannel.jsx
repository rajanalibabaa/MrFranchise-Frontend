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
import { useDispatch, useSelector } from "react-redux";
import {
  setFilter,
  resetFilters,
  fetchFilteredBrands,
} from "../../Redux/Slices/FilterBrandSlice";
import { fetchFilterOptions } from "../../Redux/Slices/filterDropdownData";

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
    const dispatch = useDispatch();
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

    const handleSearchTermChange = useCallback((field) => (e) => {
      setSearchTerms((prev) => ({ ...prev, [field]: e.target.value }));
    }, []);

    const handleMainCategoryChange = useCallback(
      (value) => {
        dispatch(setFilter({ filterName: "maincat", value }));
        dispatch(setFilter({ filterName: "subcat", value: "" }));
        dispatch(setFilter({ filterName: "childcat", value: "" }));
        dispatch(fetchFilteredBrands({ ...filters, maincat: value, subcat: "", childcat: "" }));
        
        if (value) {
          dispatch(fetchFilterOptions({ main: value }));
        }
      },
      [dispatch, filters]
    );

    const handleSubCategoryChange = useCallback(
      (value) => {
        dispatch(setFilter({ filterName: "subcat", value }));
        dispatch(setFilter({ filterName: "childcat", value: "" }));
        dispatch(fetchFilteredBrands({ ...filters, subcat: value, childcat: "" }));
        
        if (value) {
          dispatch(fetchFilterOptions({ sub: value }));
        }
      },
      [dispatch, filters]
    );

    const handleChildCategoryToggle = useCallback(
      (value) => (e) => {
        const checked = e.target.checked;
        const newSelection = checked
          ? [...(filters.childcat || []), value]
          : (filters.childcat || []).filter((item) => item !== value);
        
        dispatch(setFilter({ filterName: "childcat", value: newSelection }));
        dispatch(fetchFilteredBrands({ ...filters, childcat: newSelection }));
      },
      [dispatch, filters]
    );

    const handleLocationFilterChange = useCallback(
      (field, value) => {
        // Reset dependent filters when parent changes
        if (field === "state") {
          dispatch(setFilter({ filterName: "district", value: "" }));
          dispatch(setFilter({ filterName: "city", value: "" }));
          dispatch(fetchFilteredBrands({ 
            ...filters, 
            state: value, 
            district: "", 
            city: "" 
          }));
          
          if (value) {
            dispatch(fetchFilterOptions({ state: value }));
          }
        } else if (field === "district") {
          dispatch(setFilter({ filterName: "city", value: "" }));
          dispatch(fetchFilteredBrands({ 
            ...filters, 
            district: value, 
            city: "" 
          }));
          
          if (value) {
            dispatch(fetchFilterOptions({ district: value }));
          }
        } else {
          dispatch(setFilter({ filterName: field, value }));
          dispatch(fetchFilteredBrands({ ...filters, [field]: value }));
        }
      },
      [dispatch, filters]
    );

    const handleClearAllFilters = useCallback(() => {
      dispatch(resetFilters());
      dispatch(fetchFilteredBrands(initialFilters));
    }, [dispatch]);

    const handleSearchTermFilter = useCallback(
      (e) => {
        const value = e.target.value;
        dispatch(setFilter({ filterName: "serchterm", value }));
        dispatch(fetchFilteredBrands({ ...filters, serchterm: value }));
      },
      [dispatch, filters]
    );

    // Filter options based on search terms
    const filteredSubCategories = useMemo(() => {
      const term = searchTerms.subCategory.toLowerCase();
      return subCategories
        .filter((sub) => sub?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [subCategories, searchTerms.subCategory]);

    const filteredModelTypes = useMemo(() => {
      const term = searchTerms.modelType.toLowerCase().trim();
      return modelTypes.filter((type) => type?.toLowerCase().includes(term));
    }, [modelTypes, searchTerms.modelType]);

    const filteredInvestmentRanges = useMemo(() => {
      const term = searchTerms.investmentRange.toLowerCase();
      return investmentRanges
        .filter((range) => range?.toLowerCase().includes(term))
        .slice(0, 50);
    }, [investmentRanges, searchTerms.investmentRange]);

    const filteredStates = useMemo(() => {
      const term = searchTerms.state.toLowerCase();
      return locationData.states
        .filter((state) => state?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [locationData.states, searchTerms.state]);

    const filteredDistricts = useMemo(() => {
      if (!filters.state) return [];
      const term = searchTerms.district.toLowerCase();
      return locationData.districts
        .filter((d) => d?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [filters.state, locationData.districts, searchTerms.district]);

    const filteredCities = useMemo(() => {
      if (!filters.district) return [];
      const term = searchTerms.city.toLowerCase();
      return locationData.cities
        .filter((c) => c?.toLowerCase().includes(term))
        .slice(0, 100);
    }, [filters.district, locationData.cities, searchTerms.city]);

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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filters</Typography>
          <Button
            size="small"
            onClick={handleClearAllFilters}
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
          onChange={handleSearchTermFilter}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "#ff9800" }} />,
          }}
          sx={{ mb: 3 }}
        />

        {/* Main Category Filter */}
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
                onChange={(e) => handleMainCategoryChange(e.target.value)}
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
                {categories.map((category) => (
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
        </Accordion>

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
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
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
              <RadioGroup
                value={filters.subcat || ""}
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
                    {filters.subcat === subCategory && childCategories.length > 0 && (
                      <Collapse in={filters.subcat === subCategory}>
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
                            expandIcon={<ExpandMoreIcon sx={{ fontSize: "1rem" }} />}
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
                            <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                              {childCategories.map((childCategory) => (
                                <MemoizedCheckboxLabel
                                  key={`childcat-${childCategory}`}
                                  id={childCategory}
                                  label={<Typography fontSize="0.8125rem">{childCategory}</Typography>}
                                  checked={(filters.childcat || []).includes(childCategory)}
                                  onChange={handleChildCategoryToggle(childCategory)}
                                />
                              ))}
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
                onChange={(e) => handleLocationFilterChange("modelType", e.target.value)}
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
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
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
                onChange={(e) => handleLocationFilterChange("state", e.target.value)}
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
                  District
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
                <RadioGroup
                  value={filters.district || ""}
                  onChange={(e) => handleLocationFilterChange("district", e.target.value)}
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
              </AccordionDetails>
            </Accordion>

            {/* City Filter */}
            <Accordion
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
                <RadioGroup
                  value={filters.city || ""}
                  onChange={(e) => handleLocationFilterChange("city", e.target.value)}
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
                onChange={(e) => handleLocationFilterChange("investmentRange", e.target.value)}
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.filters === nextProps.filters &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.activeFilterCount === nextProps.activeFilterCount &&
      prevProps.resultStats?.showing === nextProps.resultStats?.showing &&
      prevProps.resultStats?.total === nextProps.resultStats?.total &&
      JSON.stringify(prevProps.categories) === JSON.stringify(nextProps.categories) &&
      JSON.stringify(prevProps.subCategories) === JSON.stringify(nextProps.subCategories) &&
      JSON.stringify(prevProps.childCategories) === JSON.stringify(nextProps.childCategories) &&
      JSON.stringify(prevProps.modelTypes) === JSON.stringify(nextProps.modelTypes) &&
      JSON.stringify(prevProps.investmentRanges) === JSON.stringify(nextProps.investmentRanges) &&
      JSON.stringify(prevProps.locationData.states) === JSON.stringify(nextProps.locationData.states) &&
      JSON.stringify(prevProps.locationData.districts) === JSON.stringify(nextProps.locationData.districts) &&
      JSON.stringify(prevProps.locationData.cities) === JSON.stringify(nextProps.locationData.cities)
    );
  }
);

export default FilterPanel;

const initialFilters = {
  id: null,
  maincat: null,
  subcat: null,
  childcat: null,
  serchterm: '',
  country: null,
  state: null,
  district: null,
  city: null,
  investmentRange: null,
  modelType: null,
};