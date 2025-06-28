import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Divider,
  FormGroup,
  Backdrop,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemButton,
  Drawer,
  Checkbox,
  ListItemText,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import axios from "axios";
import { X, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useSnackbar } from "notistack";
import { FixedSizeList } from "react-window";
import debounce from "lodash.debounce";

// Cache for API responses
const apiCache = {
  domestic: null,
  countries: null,
  states: {},
  cities: {},
};

const ITEMS_PER_ROW = 5;

// Utility function to chunk states into grid rows
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// Virtualized list item renderer
const VirtualizedGridRow = ({ data, index, style }) => {
  const { chunkedItems, selectedItems, handleToggle, type } = data;
  const rowItems = chunkedItems[index];

  return (
    <div style={style}>
      <Grid
        display={"grid"}
        gridTemplateColumns={`repeat(${ITEMS_PER_ROW}, 1fr)`}
        spacing={2}
      >
        {rowItems.map((item, idx) => (
          <Grid
            item
            xs={12 / ITEMS_PER_ROW}
            key={`${type}-${item.name}-${index}-${idx}`}
          >
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle(item)} dense>
                <Checkbox
                  edge="start"
                  checked={selectedItems.includes(item.name)}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

function BrandExpansionLocationDetails() {
  const { enqueueSnackbar } = useSnackbar();

  // Location type state
  const [locationType, setLocationType] = useState("domestic");
  const [currentOutletLocationType, setCurrentOutletLocationType] =
    useState("domestic");

  // Domestic selections for expansion locations
  const [domesticSelections, setDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [], // Changed to array of objects {state, district}
    selectedCities: [], // Changed to array of objects {state, district, city}
  });
  // International selections for expansion locations
  const [internationalSelections, setInternationalSelections] = useState({
    selectedCountries: [],
    selectedStates: [],
    selectedCities: [],
    countries: [],
    states: [],
    cities: [],
  });

  // Current outlet selections
  const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [], // Changed to array of objects {state, district}
    selectedCities: [], // Changed to array of objects {state, district, city}
  });

  const [currentInternationalSelections, setCurrentInternationalSelections] =
    useState({
      selectedCountries: [],
      selectedStates: [],
      selectedCities: [],
      countries: [],
      states: [],
      cities: [],
    });

  // Location data
  const [statesData, setStatesData] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [internationalStates, setInternationalStates] = useState({});
  const [internationalCities, setInternationalCities] = useState({});
  const [currentInternationalStates, setCurrentInternationalStates] = useState(
    {}
  );
  const [currentInternationalCities, setCurrentInternationalCities] = useState(
    {}
  );

  const [loading, setLoading] = useState({
    states: false,
    countries: false,
    intStates: false,
    intCities: false,
    currentIntStates: false,
    currentIntCities: false,
    formSubmit: false,
  });

  const [isInternationalExpansion, setIsInternationalExpansion] =
    useState(null);
  const [error, setError] = useState(null);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState({
    states: false,
    districts: false,
    cities: false,
    countries: false,
    intStates: false,
    intCities: false,
  });

  // Collapse states for current locations
  const [currentDrawerOpen, setCurrentDrawerOpen] = useState({
    states: false,
    districts: false,
    cities: false,
    countries: false,
    intStates: false,
    intCities: false,
  });

  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    states: "",
    districts: "",
    cities: "",
    countries: "",
    intStates: "",
    intCities: "",
  });

  // Initialize form data structure
  const [formData, setFormData] = useState({
    isInternationalExpansion: null,
    currentOutletLocations: {
      domestic: {
        states: [],
        districts: [],
        cities: [],
      },
      international: {
        countries: [],
        states: [],
        cities: [],
      },
    },
    expansionLocations: {
      domestic: {
        states: [],
        districts: [],
        cities: [],
      },
      international: {
        countries: [],
        states: [],
        cities: [],
      },
    },
  });

  // Debounced search functions
  const handleSearchChange = useCallback(
    debounce((type, value) => {
      setSearchFilters((prev) => ({ ...prev, [type]: value.toLowerCase() }));
    }, 300),
    []
  );

  // Toggle drawer
  const toggleDrawer = useCallback((type, open) => {
    if (type === "current") {
      setCurrentDrawerOpen((prev) => ({ ...prev, ...open }));
    } else {
      setDrawerOpen((prev) => ({ ...prev, ...open }));
    }
  }, []);

  // Memoized sorted and filtered states
  const sortedStates = useMemo(() => {
    return states
      .filter((state) =>
        state.name.toLowerCase().includes(searchFilters.states)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [states, searchFilters.states]);

  // Memoized sorted and filtered countries
  const sortedCountries = useMemo(() => {
    return countries
      .filter((country) =>
        country.name.toLowerCase().includes(searchFilters.countries)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, searchFilters.countries]);

  // Get districts for selected states
  const getDistrictsForStates = useCallback(
    (stateNames) => {
      const districtsByState = {};
      stateNames.forEach((stateName) => {
        const state = statesData.find((s) => s.name === stateName);
        if (state) {
          districtsByState[stateName] = state.districts;
        }
      });
      return districtsByState;
    },
    [statesData]
  );

  // Get cities for selected districts
  const getCitiesForDistricts = useCallback(
    (stateNames, districtNames) => {
      const citiesByDistrict = {};

      stateNames.forEach((stateName) => {
        const state = statesData.find((s) => s.name === stateName);
        if (!state) return;

        districtNames[stateName]?.forEach((districtName) => {
          const districtCities = state.cities
            .filter((city) => city.district === districtName)
            .map((city) => city.name);

          if (districtCities.length > 0) {
            citiesByDistrict[`${stateName}-${districtName}`] = districtCities;
          }
        });
      });

      return citiesByDistrict;
    },
    [statesData]
  );

  // Fetch domestic data (Indian states, districts, cities) with caching
  const fetchDomesticData = useCallback(async () => {
    if (apiCache.domestic) {
      setStatesData(apiCache.domestic);
      setStates(
        apiCache.domestic.map((state) => ({ id: state.iso2, name: state.name }))
      );
      return;
    }

    setLoading((prev) => ({ ...prev, states: true }));
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
      );
      apiCache.domestic = response.data;
      setStatesData(response.data);
      setStates(
        response.data.map((state) => ({ id: state.iso2, name: state.name }))
      );
    } catch (error) {
      console.error("Error fetching domestic data:", error);
      setError("Failed to load domestic locations. Please try again later.");
      enqueueSnackbar("Failed to load domestic locations", {
        variant: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, states: false }));
    }
  }, [enqueueSnackbar]);

  // Fetch international countries with caching
  const fetchCountries = useCallback(async () => {
    if (apiCache.countries) {
      setCountries(apiCache.countries);
      return;
    }

    setLoading((prev) => ({ ...prev, countries: true }));
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries"
      );
      const countryData = response.data.data.map((country) => ({
        id: country.iso2,
        name: country.country,
      }));

      apiCache.countries = countryData;
      setCountries(countryData);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to load countries. Please try again later.");
      enqueueSnackbar("Failed to load countries", { variant: "error" });
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }));
    }
  }, [enqueueSnackbar]);

  // Fetch states for a country
  const getStatesByCountry = useCallback(
    async (countryName, callback) => {
      if (apiCache.states[countryName]) {
        callback(apiCache.states[countryName]);
        return;
      }

      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: countryName }
        );
        const states = response.data.data?.states || [];
        apiCache.states[countryName] = states;
        callback(states);
      } catch (error) {
        console.error("Error fetching states for country:", countryName, error);
        enqueueSnackbar(`Failed to load states for ${countryName}`, {
          variant: "error",
        });
        callback([]);
      }
    },
    [enqueueSnackbar]
  );

  // Fetch cities for a country and state
  const getCitiesByCountryAndState = useCallback(
    async (countryName, stateName, callback) => {
      const cacheKey = `${countryName}-${stateName}`;
      if (apiCache.cities[cacheKey]) {
        callback(apiCache.cities[cacheKey]);
        return;
      }

      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          { country: countryName, state: stateName }
        );
        const cities = response.data.data || [];
        apiCache.cities[cacheKey] = cities;
        callback(cities);
      } catch (error) {
        console.error(
          "Error fetching cities for country and state:",
          countryName,
          stateName,
          error
        );
        enqueueSnackbar(
          `Failed to load cities for ${stateName}, ${countryName}`,
          { variant: "error" }
        );
        callback([]);
      }
    },
    [enqueueSnackbar]
  );

  // Debounced versions of API calls
  const debouncedGetStatesByCountry = useCallback(
    debounce(getStatesByCountry, 500),
    [getStatesByCountry]
  );
  const debouncedGetCitiesByCountryAndState = useCallback(
    debounce(getCitiesByCountryAndState, 500),
    [getCitiesByCountryAndState]
  );

  // Fetch domestic data on mount
  useEffect(() => {
    fetchDomesticData();
  }, [fetchDomesticData]);

  // Fetch international countries on mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Handle international expansion selection
  const handleInternationalExpansionChange = useCallback(
    (value) => {
      const newValue = value === isInternationalExpansion ? null : value;
      setIsInternationalExpansion(newValue);
      setFormData((prev) => ({
        ...prev,
        isInternationalExpansion: newValue,
      }));
    },
    [isInternationalExpansion]
  );

  // Handle location type change (domestic/international)
  const handleLocationTypeChange = useCallback((e) => {
    const type = e.target.value;
    setLocationType(type);
  }, []);

  // Handle current outlet location type change
  const handleCurrentOutletLocationTypeChange = useCallback((e) => {
    const type = e.target.value;
    setCurrentOutletLocationType(type);
  }, []);

  // Add domestic locations to form data
  const addDomesticLocations = useCallback(
    (type) => {
      setLoading((prev) => ({ ...prev, formSubmit: true }));
      try {
        const selections =
          type === "current" ? currentDomesticSelections : domesticSelections;
        const locationKey =
          type === "current" ? "currentOutletLocations" : "expansionLocations";

        // Convert the selected districts and cities from objects to arrays
        const allDistricts = [];
        const allCities = [];

        // Process districts
        for (const stateName in selections.selectedDistricts) {
          selections.selectedDistricts[stateName].forEach((district) => {
            allDistricts.push(district);
          });
        }

        // Process cities
        for (const key in selections.selectedCities) {
          selections.selectedCities[key].forEach((city) => {
            allCities.push(city);
          });
        }

        setFormData((prev) => {
          const newData = {
            ...prev,
            [locationKey]: {
              ...prev[locationKey],
              domestic: {
                states: [
                  ...new Set([
                    ...prev[locationKey].domestic.states,
                    ...selections.selectedStates,
                  ]),
                ],
                districts: [
                  ...new Set([
                    ...prev[locationKey].domestic.districts,
                    ...allDistricts,
                  ]),
                ],
                cities: [
                  ...new Set([
                    ...prev[locationKey].domestic.cities,
                    ...allCities,
                  ]),
                ],
              },
            },
          };
          return newData;
        });

        if (type === "current") {
          setCurrentDomesticSelections((prev) => ({
            ...prev,
            states: [],
            districts: [],
            cities: [],
            selectedStates: [],
            selectedDistricts: {},
            selectedCities: {},
          }));
        } else {
          setDomesticSelections((prev) => ({
            ...prev,
            states: [],
            districts: [],
            cities: [],
            selectedStates: [],
            selectedDistricts: {},
            selectedCities: {},
          }));
        }
      } catch (error) {
        console.error("Error adding domestic locations:", error);
        setError("Failed to add locations. Please try again.");
      } finally {
        setLoading((prev) => ({ ...prev, formSubmit: false }));
      }
    },
    [currentDomesticSelections, domesticSelections]
  );

  // Add international locations to form data
  const addInternationalLocations = useCallback(
    (type) => {
      setLoading((prev) => ({ ...prev, formSubmit: true }));
      try {
        const selections =
          type === "current"
            ? currentInternationalSelections
            : internationalSelections;
        const locationKey =
          type === "current" ? "currentOutletLocations" : "expansionLocations";

        setFormData((prev) => {
          const newData = {
            ...prev,
            [locationKey]: {
              ...prev[locationKey],
              international: {
                countries: [
                  ...new Set([
                    ...prev[locationKey].international.countries,
                    ...selections.countries,
                  ]),
                ],
                states: [
                  ...new Set([
                    ...prev[locationKey].international.states,
                    ...selections.states,
                  ]),
                ],
                cities: [
                  ...new Set([
                    ...prev[locationKey].international.cities,
                    ...selections.cities,
                  ]),
                ],
              },
            },
          };
          return newData;
        });

        if (type === "current") {
          setCurrentInternationalSelections((prev) => ({
            ...prev,
            countries: [],
            states: [],
            cities: [],
            selectedCountries: [],
            selectedStates: [],
            selectedCities: [],
          }));
        } else {
          setInternationalSelections((prev) => ({
            ...prev,
            countries: [],
            states: [],
            cities: [],
            selectedCountries: [],
            selectedStates: [],
            selectedCities: [],
          }));
        }
      } catch (error) {
        console.error("Error adding international locations:", error);
        setError("Failed to add locations. Please try again.");
      } finally {
        setLoading((prev) => ({ ...prev, formSubmit: false }));
      }
    },
    [currentInternationalSelections, internationalSelections]
  );

  const removeLocationItems = useCallback(
    (type, locationType, field, index) => {
      setFormData((prev) => {
        const newData = { ...prev };
        const locationArray = [...newData[type][locationType][field]];

        // If removing a state, also remove associated districts and cities
        if (field === "states" && locationType === "domestic") {
          const stateToRemove = locationArray[index];

          // Remove all associated districts
          newData[type][locationType].districts = newData[type][
            locationType
          ].districts.filter((item) => item.state !== stateToRemove);

          // Remove all associated cities
          newData[type][locationType].cities = newData[type][
            locationType
          ].cities.filter((item) => item.state !== stateToRemove);
        }

        // If removing a district, also remove associated cities
        if (field === "districts" && locationType === "domestic") {
          const districtToRemove = locationArray[index];

          newData[type][locationType].cities = newData[type][
            locationType
          ].cities.filter(
            (item) =>
              !(
                item.state === districtToRemove.state &&
                item.district === districtToRemove.district
              )
          );
        }

        locationArray.splice(index, 1);
        newData[type][locationType][field] = locationArray;
        return newData;
      });
    },
    []
  );
  const handleDomesticStateSelection = useCallback(
    (selectedStates, type) => {
      const setSelections =
        type === "current"
          ? setCurrentDomesticSelections
          : setDomesticSelections;

      setSelections((prev) => ({
        ...prev,
        selectedStates,
        selectedDistricts: [], // Changed from {} to []
        selectedCities: [], // Changed from {} to []
        districts: getDistrictsForStates(selectedStates),
      }));
    },
    [getDistrictsForStates]
  );

  const handleDomesticDistrictSelection = useCallback(
    (stateName, districtName, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentDomesticSelections
          : setDomesticSelections;

      setSelections((prev) => {
        if (isSelected) {
          return {
            ...prev,
            selectedDistricts: [
              ...prev.selectedDistricts,
              { state: stateName, district: districtName },
            ],
            selectedCities: prev.selectedCities.filter(
              (city) =>
                !(city.state === stateName && city.district === districtName)
            ),
          };
        } else {
          return {
            ...prev,
            selectedDistricts: prev.selectedDistricts.filter(
              (d) => !(d.state === stateName && d.district === districtName)
            ),
            selectedCities: prev.selectedCities.filter(
              (city) =>
                !(city.state === stateName && city.district === districtName)
            ),
          };
        }
      });
    },
    []
  );

  const handleDomesticCitySelection = useCallback(
    (stateName, districtName, cityName, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentDomesticSelections
          : setDomesticSelections;

      setSelections((prev) => {
        const newSelectedCities = [...prev.selectedCities];
        const cityObj = {
          state: stateName,
          district: districtName,
          city: cityName,
        };

        if (isSelected) {
          newSelectedCities.push(cityObj);
        } else {
          const index = newSelectedCities.findIndex(
            (c) =>
              c.state === stateName &&
              c.district === districtName &&
              c.city === cityName
          );
          if (index !== -1) {
            newSelectedCities.splice(index, 1);
          }
        }

        return {
          ...prev,
          selectedCities: newSelectedCities,
        };
      });
    },
    []
  );

  const addDomesticLocation = useCallback(
    (type) => {
      const selections =
        type === "current" ? currentDomesticSelections : domesticSelections;

      if (selections.selectedStates.length === 0) {
        enqueueSnackbar("Please select at least one state", {
          variant: "warning",
        });
        return;
      }

      setFormData((prev) => {
        const locationKey =
          type === "current" ? "currentOutletLocations" : "expansionLocations";

        // Create new arrays without duplicates
        const newStates = [
          ...new Set([
            ...prev[locationKey].domestic.states,
            ...selections.selectedStates,
          ]),
        ];

        const newDistricts = [
          ...new Set([
            ...prev[locationKey].domestic.districts,
            ...selections.selectedDistricts,
          ]),
        ];

        const newCities = [
          ...new Set([
            ...prev[locationKey].domestic.cities,
            ...selections.selectedCities,
          ]),
        ];

        return {
          ...prev,
          [locationKey]: {
            ...prev[locationKey],
            domestic: {
              states: newStates,
              districts: newDistricts,
              cities: newCities,
            },
          },
        };
      });

      // Clear selections
      if (type === "current") {
        setCurrentDomesticSelections((prev) => ({
          ...prev,
          selectedStates: [],
          selectedDistricts: [],
          selectedCities: [],
        }));
      } else {
        setDomesticSelections((prev) => ({
          ...prev,
          selectedStates: [],
          selectedDistricts: [],
          selectedCities: [],
        }));
      }
    },
    [currentDomesticSelections, domesticSelections, enqueueSnackbar]
  );

  // Handle international country selection
  const handleInternationalCountrySelection = useCallback(
    async (selectedCountries, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;
      const setStatesData =
        type === "current"
          ? setCurrentInternationalStates
          : setInternationalStates;

      setSelections((prev) => ({
        ...prev,
        selectedCountries,
        selectedStates: [],
        selectedCities: [],
      }));

      // Fetch states for newly selected countries
      const newStatesData = {};
      for (const country of selectedCountries) {
        if (!apiCache.states[country]) {
          debouncedGetStatesByCountry(country, (states) => {
            setStatesData((prev) => ({ ...prev, [country]: states }));
          });
        }
      }
    },
    [debouncedGetStatesByCountry]
  );

  // Updated handleInternationalStateSelection to support multi-select
  const handleInternationalStateSelection = useCallback(
    async (countryName, stateName, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedStates = { ...prev.selectedStates };

        if (!newSelectedStates[countryName]) {
          newSelectedStates[countryName] = [];
        }

        if (isSelected) {
          newSelectedStates[countryName] = [
            ...newSelectedStates[countryName],
            stateName,
          ];
        } else {
          newSelectedStates[countryName] = newSelectedStates[
            countryName
          ].filter((s) => s !== stateName);
          if (newSelectedStates[countryName].length === 0) {
            delete newSelectedStates[countryName];
          }
        }

        // Clear cities for the country-state combination when states change
        const newSelectedCities = { ...prev.selectedCities };
        const stateKey = `${countryName}-${stateName}`;
        if (newSelectedCities[stateKey]) {
          delete newSelectedCities[stateKey];
        }

        return {
          ...prev,
          selectedStates: newSelectedStates,
          selectedCities: newSelectedCities,
        };
      });

      // Fetch cities for newly selected states
      if (isSelected) {
        const setCitiesData =
          type === "current"
            ? setCurrentInternationalCities
            : setInternationalCities;
        const cacheKey = `${countryName}-${stateName}`;

        if (!apiCache.cities[cacheKey]) {
          debouncedGetCitiesByCountryAndState(
            countryName,
            stateName,
            (cities) => {
              setCitiesData((prev) => ({ ...prev, [cacheKey]: cities }));
            }
          );
        }
      }
    },
    [debouncedGetCitiesByCountryAndState]
  );

  // Updated handleInternationalCitySelection to support multi-select
  const handleInternationalCitySelection = useCallback(
    (countryName, stateName, cityName, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedCities = { ...prev.selectedCities };
        const stateKey = `${countryName}-${stateName}`;

        if (!newSelectedCities[stateKey]) {
          newSelectedCities[stateKey] = [];
        }

        if (isSelected) {
          newSelectedCities[stateKey] = [
            ...newSelectedCities[stateKey],
            cityName,
          ];
        } else {
          newSelectedCities[stateKey] = newSelectedCities[stateKey].filter(
            (c) => c !== cityName
          );
          if (newSelectedCities[stateKey].length === 0) {
            delete newSelectedCities[stateKey];
          }
        }

        return {
          ...prev,
          selectedCities: newSelectedCities,
        };
      });
    },
    []
  );

const renderDomesticStateDrawer = useCallback(
  (type) => {
    const selections =
      type === "current" ? currentDomesticSelections : domesticSelections;
    const toggle = (open) => toggleDrawer(type, { states: open });

    return (
      <Box sx={{ mt: 4,mb:3 }}>
        <Button
          variant="outlined"
          fullWidth
          color="warning"
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: "space-between" }}
        >
          {selections.selectedStates.length > 0
            ? `${selections.selectedStates.length} states selected`
            : "Select States"}
        </Button>

        <Drawer
        
          anchor="top"
          open={
            type === "current" ? currentDrawerOpen.states : drawerOpen.states
          }
          onClose={() => toggle(false)}
          PaperProps={{
            sx: {
              width: "98%",
              height: "100vh",
              maxHeight: "none",
              borderRadius: 0,
              p: 2,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              
            }}
          >
            <Typography  variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}>Select States :</Typography>
                                          <Button variant="outlined" color="warning" sx={{ padding: "10px", borderRadius: "5px",mb: 3}}  onClick={() => toggle(false)}>Add Your Selected States</Button>

          </Box>

          <TextField
            // fullWidth
            placeholder="Search states..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange("states", e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            }}
          />


          {/* Selected states chips */}
          {selections.selectedStates.length > 0 && (
            <Box
              sx={{
                mb: 2,
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography  variant="subtitle1"
        fontWeight={500}
        sx={{ mb:1, color: "#ff9800" }} >
                Selected States:
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 1,
                }}
              >
                {selections.selectedStates.map((state, index) => (
                  <Chip
                    key={`selected-state-${index}`}
                    label={state}
                    onDelete={() => {
                      const newSelected = selections.selectedStates.filter(
                        (_, i) => i !== index
                      );
                      handleDomesticStateSelection(newSelected, type);
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ flex: 1, overflow: "auto" ,mt:1 }}>
            <Box
              sx={{
                display: "grid",
                m: 5,
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 1,
                
              }}
            >
              {sortedStates.map((state) => {
                const isSelected = selections.selectedStates.includes(state.name);
                return (
                  <Box key={`state-${state.name}`} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={() => {
                            const newSelected = isSelected
                              ? selections.selectedStates.filter(
                                  (s) => s !== state.name
                                )
                              : [...selections.selectedStates, state.name];
                            handleDomesticStateSelection(newSelected, type);
                          }}
                        />
                      }
                      label={state.name}
                    />
                  </Box>
                );
              })}
            </Box>

          </Box>
          
        </Drawer>

        {/* Selected states outside drawer */}
        {selections.selectedStates.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected States:
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 1,
              }}
            >
              {selections.selectedStates.map((state, index) => (
                <Chip
                  key={`selected-state-${index}`}
                  label={state}
                  onDelete={() => {
                    const newSelected = selections.selectedStates.filter(
                      (_, i) => i !== index
                    );
                    handleDomesticStateSelection(newSelected, type);
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  },
  [
    sortedStates,
    currentDomesticSelections,
    domesticSelections,
    currentDrawerOpen.states,
    drawerOpen.states,
    handleDomesticStateSelection,
    handleSearchChange,
  ]
);
  const renderDomesticDistrictDrawer = useCallback(
  (type) => {
    const selections =
      type === "current" ? currentDomesticSelections : domesticSelections;
    const toggle = (open) => toggleDrawer(type, { districts: open });

    if (selections.selectedStates.length === 0) return null;

    // Group districts by state for rendering
    const districtsByState = {};
    selections.selectedDistricts.forEach(({ state, district }) => {
      if (!districtsByState[state]) {
        districtsByState[state] = [];
      }
      districtsByState[state].push(district);
    });

    return (
      <Box sx={{ mt: 3,mb: 3 }}>
        <Button
          variant="outlined"
          color="warning"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: "space-between" }}
          disabled={selections.selectedStates.length === 0}
        >
          {selections.selectedDistricts.length > 0
            ? `${selections.selectedDistricts.length} districts selected`
            : "Select Districts"}
        </Button>

        <Drawer
          anchor="top"
          open={
            type === "current"
              ? currentDrawerOpen.districts
              : drawerOpen.districts
          }
          onClose={() => toggle(false)}
          PaperProps={{
            sx: {
              width: "98%",
              height: "100vh",
              maxHeight: "none",
              borderRadius: 0,
              p: 2,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography  variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}>Select Districts</Typography>
            <Button variant="outlined" color="warning" onClick={() => toggle(false)}>Add Your Selected District</Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search districts..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange("districts", e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            }}
          />

          {/* Selected districts chips */}
          {selections.selectedDistricts.length > 0 && (
            <Box
              sx={{
                mb: 2,
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected Districts:
              </Typography>
              {Object.entries(districtsByState).map(([state, districts]) => (
                <Box key={`selected-districts-${state}`} sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    {state}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {districts.map((district, index) => (
                      <Chip
                        key={`selected-district-${state}-${district}-${index}`}
                        label={district}
                        onDelete={() =>
                          handleDomesticDistrictSelection(
                            state,
                            district,
                            false,
                            type
                          )
                        }
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {selections.selectedStates.map((stateName) => {
              const state = statesData.find((s) => s.name === stateName);
              if (!state) return null;

              const districts = state.districts
                .filter((district) =>
                  district.toLowerCase().includes(searchFilters.districts)
                )
                .sort((a, b) => a.localeCompare(b));

              if (districts.length === 0) return null;

              const selectedDistrictsForState = selections.selectedDistricts
                .filter((d) => d.state === stateName)
                .map((d) => d.district);

              return (
                <Box key={`districts-section-${stateName}`} sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: "orange" }}>
                    {stateName}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: 1,
                    }}
                  >
                    {districts.map((district) => {
                      const isSelected = selectedDistrictsForState.includes(district);
                      return (
                        <Box key={`district-${stateName}-${district}`} >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isSelected}
                                onChange={() =>
                                  handleDomesticDistrictSelection(
                                    stateName,
                                    district,
                                    !isSelected,
                                    type
                                  )
                                }
                              />
                            }
                            label={district}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Drawer>

        {/* Selected districts outside drawer grouped by state */}
        {selections.selectedDistricts.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Districts:
            </Typography>
            {Object.entries(districtsByState).map(([state, districts]) => (
              <Box key={`selected-districts-${state}`} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                  {state}
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  {districts.map((district, index) => (
                    <Chip
                      key={`selected-district-${state}-${district}-${index}`}
                      label={district}
                      onDelete={() =>
                        handleDomesticDistrictSelection(
                          state,
                          district,
                          false,
                          type
                        )
                      }
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  },
  [
    currentDomesticSelections,
    domesticSelections,
    currentDrawerOpen.districts,
    drawerOpen.districts,
    handleDomesticDistrictSelection,
    handleSearchChange,
    searchFilters.districts,
    statesData,
  ]
);

const renderDomesticCityDrawer = useCallback(
  (type) => {
    const selections =
      type === "current" ? currentDomesticSelections : domesticSelections;
    const toggle = (open) => toggleDrawer(type, { cities: open });

    if (selections.selectedDistricts.length === 0) return null;

    // Group selected districts by state for easier access
    const districtsByState = {};
    selections.selectedDistricts.forEach(({ state, district }) => {
      if (!districtsByState[state]) {
        districtsByState[state] = [];
      }
      districtsByState[state].push(district);
    });

    // Group selected cities by state and district for easier access
    const citiesByDistrict = {};
    selections.selectedCities.forEach(({ state, district, city }) => {
      const key = `${state}-${district}`;
      if (!citiesByDistrict[key]) {
        citiesByDistrict[key] = [];
      }
      citiesByDistrict[key].push(city);
    });

    return (
      <Box sx={{ mt: 3,mb:3 }}>
        <Button
          color="warning"
          variant="outlined"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: "space-between" }}
          disabled={selections.selectedDistricts.length === 0}
        >
          {selections.selectedCities.length > 0
            ? `${selections.selectedCities.length} cities selected`
            : "Select Cities"}
        </Button>

        <Drawer
          anchor="top"
          open={
            type === "current" ? currentDrawerOpen.cities : drawerOpen.cities
          }
          onClose={() => toggle(false)}
          PaperProps={{
            sx: {
              width: "98%",
              height: "100vh",
              maxHeight: "none",
              borderRadius: 0,
              p: 2,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Select Cities</Typography>
            <Button variant="outlined" color="warning" onClick={() => toggle(false)}>Add Your Selected Cities</Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search cities..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange("cities", e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            }}
          />

          {/* Selected cities chips */}
          {selections.selectedCities.length > 0 && (
            <Box
              sx={{
                mb: 2,
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected Cities:
              </Typography>
              {Object.entries(citiesByDistrict).map(([districtKey, cities]) => {
                const [state, district] = districtKey.split("-");
                return (
                  <Box key={`selected-cities-${districtKey}`} sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {state} - {district}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {cities.map((city, index) => (
                        <Chip
                          key={`selected-city-${districtKey}-${city}-${index}`}
                          label={city}
                          onDelete={() =>
                            handleDomesticCitySelection(
                              state,
                              district,
                              city,
                              false,
                              type
                            )
                          }
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {Object.entries(districtsByState).map(([stateName, districts]) => {
              const state = statesData.find((s) => s.name === stateName);
              if (!state) return null;

              return districts.map((districtName) => {
                const districtKey = `${stateName}-${districtName}`;
                const cities = state.cities
                  .filter((city) => city.district === districtName)
                  .map((city) => city.name)
                  .filter((city) =>
                    city.toLowerCase().includes(searchFilters.cities)
                  )
                  .sort((a, b) => a.localeCompare(b));

                if (cities.length === 0) return null;

                const selectedCitiesForDistrict =
                  citiesByDistrict[districtKey] || [];

                return (
                  <Box key={`cities-section-${districtKey}`} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: "orange" }}>
                      {stateName} - {districtName}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: 1,
                      }}
                    >
                      {cities.map((city) => {
                        const isSelected = selectedCitiesForDistrict.includes(city);
                        return (
                          <Box key={`city-${districtKey}-${city}`}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() =>
                                    handleDomesticCitySelection(
                                      stateName,
                                      districtName,
                                      city,
                                      !isSelected,
                                      type
                                    )
                                  }
                                />
                              }
                              label={city}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                );
              });
            })}
          </Box>
        </Drawer>

        {/* Selected cities outside drawer grouped by state and district */}
        {selections.selectedCities.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Cities:
            </Typography>
            {Object.entries(citiesByDistrict).map(([districtKey, cities]) => {
              const [state, district] = districtKey.split("-");
              return (
                <Box key={`selected-cities-${districtKey}`} sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    {state} - {district}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {cities.map((city, index) => (
                      <Chip
                        key={`selected-city-${districtKey}-${city}-${index}`}
                        label={city}
                        onDelete={() =>
                          handleDomesticCitySelection(
                            state,
                            district,
                            city,
                            false,
                            type
                          )
                        }
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    );
  },
  [
    currentDomesticSelections,
    domesticSelections,
    currentDrawerOpen.cities,
    drawerOpen.cities,
    handleDomesticCitySelection,
    handleSearchChange,
    searchFilters.cities,
    statesData,
  ]
);
  // Render international country selection drawer
const renderInternationalCountryDrawer = useCallback(
  (type) => {
    const selections =
      type === "current"
        ? currentInternationalSelections
        : internationalSelections;
    const toggle = (open) => toggleDrawer(type, { countries: open });

    return (
      <Box sx={{ mt: 3,mb: 3 }}>
        <Button
          variant="outlined"
          color="success"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: "space-between" }}
        >
          {selections.selectedCountries.length > 0
            ? `${selections.selectedCountries.length} countries selected`
            : "Select Countries"}
        </Button>

        <Drawer
          anchor="top"
          open={
            type === "current"
              ? currentDrawerOpen.countries
              : drawerOpen.countries
          }
          onClose={() => toggle(false)}
          PaperProps={{
            sx: {
              width: "98%",
              height: "100vh",
              maxHeight: "none",
              borderRadius: 0,
              p: 2,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Select Countries</Typography>
            <Button variant="outlined" color="warning" onClick={() => toggle(false)}>Add Your Selected Country</Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search countries..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange("countries", e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            }}
          />

          {/* Selected countries chips */}
          {selections.selectedCountries.length > 0 && (
            <Box
              sx={{
                mb: 2,
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected Countries:
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 1,
                }}
              >
                {selections.selectedCountries.map((country, index) => (
                  <Chip
                    key={`selected-country-${index}`}
                    label={country}
                    onDelete={async () => {
                      const newSelected = selections.selectedCountries.filter(
                        (_, i) => i !== index
                      );
                      await handleInternationalCountrySelection(
                        newSelected,
                        type
                      );
                    }}
                    variant="outlined" 
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ flex: 1, overflow: "auto", mt:1 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 1,
              }}
            >
              {sortedCountries.map((country) => {
                const isSelected = selections.selectedCountries.includes(
                  country.name
                );
                return (
                  <Box key={`country-${country.name}`}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          onChange={async () => {
                            const newSelected = isSelected
                              ? selections.selectedCountries.filter(
                                  (c) => c !== country.name
                                )
                              : [...selections.selectedCountries, country.name];
                            await handleInternationalCountrySelection(
                              newSelected,
                              type
                            );
                          }}
                        />
                      }
                      label={country.name}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Drawer>

        {/* Selected countries outside drawer */}
        {selections.selectedCountries.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Countries:
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 1,
              }}
            >
              {selections.selectedCountries.map((country, index) => (
                <Chip
                  key={`selected-country-${index}`}
                  label={country}
                  onDelete={async () => {
                    const newSelected = selections.selectedCountries.filter(
                      (_, i) => i !== index
                    );
                    await handleInternationalCountrySelection(
                      newSelected,
                      type
                    );
                  }}
                  
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  },
  [
    sortedCountries,
    currentInternationalSelections,
    internationalSelections,
    currentDrawerOpen.countries,
    drawerOpen.countries,
    handleInternationalCountrySelection,
    handleSearchChange,
  ]
);

 const renderInternationalStateDrawer = useCallback(
  (type) => {
    const selections =
      type === "current"
        ? currentInternationalSelections
        : internationalSelections;
    const statesData =
      type === "current" ? currentInternationalStates : internationalStates;
    const toggle = (open) => toggleDrawer(type, { intStates: open });

    if (selections.selectedCountries.length === 0) return null;

    return (
      <Box sx={{ mt: 3 ,mb:3}}>
        <Button
          variant="outlined"
          color="success"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: "space-between" }}
          disabled={selections.selectedCountries.length === 0}
        >
          {Object.keys(selections.selectedStates).length > 0
            ? `${
                Object.values(selections.selectedStates).flat().length
              } states selected`
            : "Select States"}
        </Button>

        <Drawer
          anchor="top"
          open={
            type === "current"
              ? currentDrawerOpen.intStates
              : drawerOpen.intStates
          }
          onClose={() => toggle(false)}
          PaperProps={{
            sx: {
              width: "98%",
              height: "100vh",
              maxHeight: "none",
              borderRadius: 0,
              p: 2,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Select States</Typography>
            <Button variant="outlined" color="warning" onClick={() => toggle(false)}>Add Your Selected States</Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search states..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange("intStates", e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            }}
          />

          {/* Selected states chips */}
          {Object.keys(selections.selectedStates).length > 0 && (
            <Box
              sx={{
                mb: 2,
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected States:
              </Typography>
              {Object.entries(selections.selectedStates).map(
                ([country, states]) => (
                  <Box key={`selected-states-${country}`} sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {country}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {states.map((state, index) => (
                        <Chip
                          key={`drawer-selected-state-${country}-${state}-${index}`}
                          label={state}
                          onDelete={() =>
                            handleInternationalStateSelection(
                              country,
                              state,
                              false,
                              type
                            )
                          }
                          
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )
              )}
            </Box>
          )}

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {selections.selectedCountries.map((country) => {
              const states = statesData[country] || [];
              const filteredStates = states
                .filter((state) =>
                  state.name.toLowerCase().includes(searchFilters.intStates)
                )
                .sort((a, b) => a.name.localeCompare(b.name));

              const countrySelectedStates =
                selections.selectedStates[country] || [];

              if (filteredStates.length === 0) return null;

              return (
                <Box key={`states-section-${country}`} sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb:1, color:"orange" }}>
                    {country}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: 1,
                      
                    }}
                  >
                    {filteredStates.map((state) => {
                      const isSelected = countrySelectedStates.includes(state.name);
                      return (
                        <Box key={`state-${country}-${state.name}`}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isSelected}
                                onChange={() =>
                                  handleInternationalStateSelection(
                                    country,
                                    state.name,
                                    !isSelected,
                                    type
                                  )
                                }
                              />
                            }
                            label={state.name}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Drawer>

        {/* Selected states outside drawer grouped by country */}
        {Object.keys(selections.selectedStates).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected States:
            </Typography>
            {Object.entries(selections.selectedStates).map(
              ([country, states]) => (
                <Box key={`selected-states-${country}`} sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    {country}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {states.map((state, index) => (
                      <Chip
                        key={`selected-state-${country}-${state}-${index}`}
                        label={state}
                        onDelete={() =>
                          handleInternationalStateSelection(
                            country,
                            state,
                            false,
                            type
                          )
                        }
                        
                        variant="outlined"
                        sx={{
                          "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )
            )}
          </Box>
        )}
      </Box>
    );
  },
  [
    currentInternationalSelections,
    internationalSelections,
    currentInternationalStates,
    internationalStates,
    currentDrawerOpen.intStates,
    drawerOpen.intStates,
    handleInternationalStateSelection,
    handleSearchChange,
    searchFilters.intStates,
  ]
);

const renderInternationalCityDrawer = useCallback(
  (type) => {
    const selections =
      type === "current"
        ? currentInternationalSelections
        : internationalSelections;
    const citiesData =
      type === "current" ? currentInternationalCities : internationalCities;
    const toggle = (open) => toggleDrawer(type, { intCities: open });

    if (Object.keys(selections.selectedStates).length === 0) return null;

    return (
      <Box sx={{ mt: 3,mb: 3 }}>
        <Button
          variant="outlined"
          color="success"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: "space-between" }}
          disabled={Object.keys(selections.selectedStates).length === 0}
        >
          {Object.keys(selections.selectedCities).length > 0
            ? `${
                Object.values(selections.selectedCities).flat().length
              } cities selected`
            : "Select Cities"}
        </Button>

        <Drawer
          anchor="top"
          open={
            type === "current"
              ? currentDrawerOpen.intCities
              : drawerOpen.intCities
          }
          onClose={() => toggle(false)}
          PaperProps={{
            sx: {
              width: "98%",
              height: "100vh",
              maxHeight: "none",
              borderRadius: 0,
              p: 2,
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Select Cities</Typography>
            <Button  color="warning" variant="outlined" onClick={() => toggle(false)}>Add Your Selected Cities</Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search cities..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange("intCities", e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            }}
          />

          {/* Selected cities chips */}
          {Object.keys(selections.selectedCities).length > 0 && (
            <Box
              sx={{
                mb: 2,
                maxHeight: "120px",
                overflowY: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected Cities:
              </Typography>
              {Object.entries(selections.selectedCities).map(
                ([stateKey, cities]) => {
                  const [country, state] = stateKey.split("-");
                  return (
                    <Box key={`selected-cities-${stateKey}`} sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                        {country} - {state}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {cities.map((city, index) => (
                          <Chip
                            key={`drawer-selected-city-${stateKey}-${city}-${index}`}
                            label={city}
                            onDelete={() =>
                              handleInternationalCitySelection(
                                country,
                                state,
                                city,
                                false,
                                type
                              )
                            }
                            
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                }
              )}
            </Box>
          )}

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {Object.entries(selections.selectedStates).map(
              ([country, states]) => {
                return states.map((state) => {
                  const stateKey = `${country}-${state}`;
                  const cities = citiesData[stateKey] || [];
                  const filteredCities = cities
                    .filter((city) =>
                      city.toLowerCase().includes(searchFilters.intCities)
                    )
                    .sort((a, b) => a.localeCompare(b));

                  const stateSelectedCities =
                    selections.selectedCities[stateKey] || [];

                  if (filteredCities.length === 0) return null;

                  return (
                    <Box key={`cities-section-${stateKey}`} sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 ,color:"orange" }}>
                        {country} - {state}
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(5, 1fr)",
                          gap: 1,
                        }}
                      >
                        {filteredCities.map((city) => {
                          const isSelected = stateSelectedCities.includes(city);
                          return (
                            <Box key={`city-${stateKey}-${city}`}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={isSelected}
                                    onChange={() =>
                                      handleInternationalCitySelection(
                                        country,
                                        state,
                                        city,
                                        !isSelected,
                                        type
                                      )
                                    }
                                  />
                                }
                                label={city}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  );
                });
              }
            )}
          </Box>
        </Drawer>

        {/* Selected cities outside drawer grouped by country and state */}
        {Object.keys(selections.selectedCities).length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected Cities:
            </Typography>
            {Object.entries(selections.selectedCities).map(
              ([stateKey, cities]) => {
                const [country, state] = stateKey.split("-");
                return (
                  <Box key={`selected-cities-${stateKey}`} sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                      {country} - {state}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {cities.map((city, index) => (
                        <Chip
                          key={`selected-city-${stateKey}-${city}-${index}`}
                          label={city}
                          onDelete={() =>
                            handleInternationalCitySelection(
                              country,
                              state,
                              city,
                              false,
                              type
                            )
                          }
                          color="success"
                          variant="outlined"
                          sx={{
                            "& .MuiChip-label": {
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              }
            )}
          </Box>
        )}
      </Box>
    );
  },
  [
    currentInternationalSelections,
    internationalSelections,
    currentInternationalCities,
    internationalCities,
    currentDrawerOpen.intCities,
    drawerOpen.intCities,
    handleInternationalCitySelection,
    handleSearchChange,
    searchFilters.intCities,
  ]
);
  // Main render
  return (
    <Box sx={{ mr: { sm: 0, md: 25 }, ml: { sm: 0, md: 25 } }}>
      <Typography  variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}>Brand Expansion Location Details</Typography>

      {/* International Expansion Toggle */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle2" mt={0}    gap={2}>
          Is your brand expanding internationally? :
          
        </Typography>
        <RadioGroup
          row
          value={
            isInternationalExpansion === null ? "" : isInternationalExpansion
          }
          sx={{gap:11,justifyContent:'start',ml:15}}
          onChange={(e) =>
            handleInternationalExpansionChange(e.target.value === "true")
          }
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </Box>

      {/* Current Outlet Locations */}
      <Divider sx={{ my: 2 }} />
      
      <Typography  variant="h6"
        fontWeight={700}
        sx={{ mb: 0, color: "#ff9800" }}>
        Current Outlet Locations
      </Typography>

      <RadioGroup
      sx={{justifyContent:"center",gap:10}}
        row
        value={currentOutletLocationType}
        onChange={handleCurrentOutletLocationTypeChange}
      >
        <FormControlLabel
          value="domestic"
          control={<Radio />}
          label="India"
        />
        <FormControlLabel
          value="international"
          control={<Radio />}
          label="International"
        />
      </RadioGroup>

      {currentOutletLocationType === "domestic" ? (
        <>
          {renderDomesticStateDrawer("current")}
          {renderDomesticDistrictDrawer("current")}
          {renderDomesticCityDrawer("current")}
          <Button
            variant="outlined"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => addDomesticLocation("current")}
            disabled={loading.formSubmit}
          >
            Add Location
          </Button>
          {/* Display selected locations */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Locations:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.currentOutletLocations.domestic.states.map(
                (state, idx) => (
                  <Chip
                    key={`current-state-${idx}`}
                    label={state}
                    onDelete={() =>
                      removeLocationItems(
                        "currentOutletLocations",
                        "domestic",
                        "states",
                        idx
                      )
                    }
                    color="primary"
                    variant="outlined"
                  />
                )
              )}
              {formData.currentOutletLocations.domestic.districts.map(
                (item, idx) => (
                  <Chip
                    key={`current-district-${idx}`}
                    label={`${item.state} - ${item.district}`}
                    onDelete={() =>
                      removeLocationItems(
                        "currentOutletLocations",
                        "domestic",
                        "districts",
                        idx
                      )
                    }
                    color="secondary"
                    variant="outlined"
                  />
                )
              )}
              {formData.currentOutletLocations.domestic.cities.map(
                (item, idx) => (
                  <Chip
                    key={`current-city-${idx}`}
                    label={`${item.state} - ${item.district} - ${item.city}`}
                    onDelete={() =>
                      removeLocationItems(
                        "currentOutletLocations",
                        "domestic",
                        "cities",
                        idx
                      )
                    }
                    color="success"
                    variant="outlined"
                  />
                )
              )}
            </Box>
          </Box>
        </>
      ) : (
        <>
          {renderInternationalCountryDrawer("current")}
          {renderInternationalStateDrawer("current")}
          {renderInternationalCityDrawer("current")}
          <Button
            variant="outlined"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => addInternationalLocation("current")}
            disabled={loading.formSubmit}
          >
            Add Location
          </Button>
          {/* Display selected locations */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Locations:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.currentOutletLocations.international.countries.map(
                (country, idx) => (
                  <Chip
                    key={`current-country-${idx}`}
                    label={country}
                    onDelete={() =>
                      removeLocationItems(
                        "currentOutletLocations",
                        "international",
                        "countries",
                        idx
                      )
                    }
                    color="primary"
                    variant="outlined"
                  />
                )
              )}
              {formData.currentOutletLocations.international.states.map(
                (state, idx) => (
                  <Chip
                    key={`current-state-${idx}`}
                    label={state}
                    onDelete={() =>
                      removeLocationItems(
                        "currentOutletLocations",
                        "international",
                        "states",
                        idx
                      )
                    }
                    color="secondary"
                    variant="outlined"
                  />
                )
              )}
              {formData.currentOutletLocations.international.cities.map(
                (city, idx) => (
                  <Chip
                    key={`current-int-city-${idx}`}
                    label={city}
                    onDelete={() =>
                      removeLocationItems(
                        "currentOutletLocations",
                        "international",
                        "cities",
                        idx
                      )
                    }
                    color="success"
                    variant="outlined"
                  />
                )
              )}
            </Box>
          </Box>
        </>
      )}

      {/* Expansion Locations */}
      <Divider sx={{ my: 2 }} />
      <Typography  variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}>
        Expansion Locations
      </Typography>
      <RadioGroup row value={locationType} onChange={handleLocationTypeChange}       sx={{justifyContent:"center",gap:10}}
>
        <FormControlLabel
          value="domestic"
          control={<Radio />}
          label="India"
        />
        <FormControlLabel
          value="international"
          control={<Radio />}
          label="International"
        />
      </RadioGroup>

      {locationType === "domestic" ? (
        <>
          {renderDomesticStateDrawer("expansion")}
          {renderDomesticDistrictDrawer("expansion")}
          {renderDomesticCityDrawer("expansion")}
          <Button
            variant="outlined"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => addDomesticLocation("expansion")}
            disabled={loading.formSubmit}
          >
            Add Location
          </Button>
          {/* Display selected locations */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Locations:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.expansionLocations.domestic.states.map((state, idx) => (
                <Chip
                  key={`expansion-state-${idx}`}
                  label={state}
                  onDelete={() =>
                    removeLocationItems(
                      "expansionLocations",
                      "domestic",
                      "states",
                      idx
                    )
                  }
                  color="primary"
                  variant="outlined"
                />
              ))}
              {formData.expansionLocations.domestic.districts.map(
                (district, idx) => (
                  <Chip
                    key={`expansion-district-${idx}`}
                    label={district}
                    onDelete={() =>
                      removeLocationItems(
                        "expansionLocations",
                        "domestic",
                        "districts",
                        idx
                      )
                    }
                    color="secondary"
                    variant="outlined"
                  />
                )
              )}
              {formData.expansionLocations.domestic.cities.map((city, idx) => (
                <Chip
                  key={`expansion-city-${idx}`}
                  label={city}
                  onDelete={() =>
                    removeLocationItems(
                      "expansionLocations",
                      "domestic",
                      "cities",
                      idx
                    )
                  }
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </>
      ) : (
        <>
          {renderInternationalCountryDrawer("expansion")}
          {renderInternationalStateDrawer("expansion")}
          {renderInternationalCityDrawer("expansion")}
          <Button
            variant="outlined"
            color="success"
            sx={{ mt: 2 }}
            onClick={() => addInternationalLocation("expansion")}
            disabled={loading.formSubmit}
          >
            Add Location
          </Button>
          {/* Display selected locations */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Locations:</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.expansionLocations.international.countries.map(
                (country, idx) => (
                  <Chip
                    key={`expansion-country-${idx}`}
                    label={country}
                    onDelete={() =>
                      removeLocationItems(
                        "expansionLocations",
                        "international",
                        "countries",
                        idx
                      )
                    }
                    color="primary"
                    variant="outlined"
                  />
                )
              )}
              {formData.expansionLocations.international.states.map(
                (state, idx) => (
                  <Chip
                    key={`expansion-state-${idx}`}
                    label={state}
                    onDelete={() =>
                      removeLocationItems(
                        "expansionLocations",
                        "international",
                        "states",
                        idx
                      )
                    }
                    color="secondary"
                    variant="outlined"
                  />
                )
              )}
              {formData.expansionLocations.international.cities.map(
                (city, idx) => (
                  <Chip
                    key={`expansion-int-city-${idx}`}
                    label={city}
                    onDelete={() =>
                      removeLocationItems(
                        "expansionLocations",
                        "international",
                        "cities",
                        idx
                      )
                    }
                    color="success"
                    variant="outlined"
                  />
                )
              )}
            </Box>
          </Box>
        </>
      )}

      {/* Loading and Error Handling */}
      <Backdrop
        open={loading.states || loading.countries || loading.formSubmit}
        sx={{ zIndex: 9999 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BrandExpansionLocationDetails;