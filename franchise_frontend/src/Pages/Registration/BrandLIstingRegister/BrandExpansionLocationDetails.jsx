import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  Chip,
  Checkbox,
  TextField,
  Backdrop,
  CircularProgress,
  Drawer,
  Alert,
  Snackbar,
} from "@mui/material";
import { ChevronDown, Search } from "lucide-react";
import { useSnackbar } from "notistack";
import debounce from "lodash.debounce";
import axios from "axios";

// Cache for API responses
const apiCache = {
  domestic: null,
  countries: null,
  states: {},
  cities: {},
};

const BrandExpansionLocationDetails = ({ data, onChange }) => {
  const { enqueueSnackbar } = useSnackbar();

  // Location type state
  const [locationType, setLocationType] = useState("domestic");
  const [currentOutletLocationType, setCurrentOutletLocationType] =
    useState("domestic");

  // Domestic selections for expansion locations
  const [domesticSelections, setDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
    selectedCities: [],
  });

  // International selections for expansion locations
  const [internationalSelections, setInternationalSelections] = useState({
    selectedCountries: [],
    selectedStates: {},
    selectedCities: {},
  });

  // Current outlet selections
  const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
    selectedCities: [],
  });

  const [currentInternationalSelections, setCurrentInternationalSelections] =
    useState({
      selectedCountries: [],
      selectedStates: {},
      selectedCities: {},
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
    formSubmit: false,
  });

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
  const debouncedGetStatesByCountry = useMemo(
    () => debounce(getStatesByCountry, 500),
    [getStatesByCountry]
  );

  const debouncedGetCitiesByCountryAndState = useMemo(
    () => debounce(getCitiesByCountryAndState, 500),
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
      const newValue =
        value === data?.isInternationalExpansion ? null : value;
      onChange({
        isInternationalExpansion: newValue,
      });
    },
    [data?.isInternationalExpansion, onChange]
  );

  // Handle location type change (domestic/international)
  const handleLocationTypeChange = useCallback((e) => {
    setLocationType(e.target.value);
  }, []);

  // Handle current outlet location type change
  const handleCurrentOutletLocationTypeChange = useCallback((e) => {
    setCurrentOutletLocationType(e.target.value);
  }, []);

  // Handle domestic state selection
  const handleDomesticStateSelection = useCallback((selectedStates, type) => {
    const setSelections =
      type === "current" ? setCurrentDomesticSelections : setDomesticSelections;

    setSelections((prev) => ({
      ...prev,
      selectedStates,
      selectedDistricts: [],
      selectedCities: [],
    }));
  }, []);

  // Handle domestic district selection
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

  // Handle domestic city selection
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

        return { ...prev, selectedCities: newSelectedCities };
      });
    },
    []
  );

  const addDomesticLocation = useCallback(
    (type) => {
      const selections =
        type === "current" ? currentDomesticSelections : domesticSelections;
      const locationKey =
        type === "current" ? "currentOutletLocations" : "expansionLocations";

      if (selections.selectedStates.length === 0) {
        enqueueSnackbar("Please select at least one state", {
          variant: "warning",
        });
        return;
      }

      const newLocations = [];

      // Process states
      selections.selectedStates.forEach((stateName) => {
        const existingStateIndex = newLocations.findIndex(
          (loc) => loc.state === stateName
        );

        if (existingStateIndex === -1) {
          // Add new state with empty districts
          newLocations.push({
            state: stateName,
            districts: [],
          });
        }
      });

      // Process districts
      selections.selectedDistricts.forEach(({ state, district }) => {
        const stateIndex = newLocations.findIndex((loc) => loc.state === state);

        if (stateIndex !== -1) {
          const districtExists = newLocations[stateIndex].districts.some(
            (d) => d.district === district
          );

          if (!districtExists) {
            newLocations[stateIndex].districts.push({
              district,
              cities: [],
            });
          }
        }
      });

      // Process cities
      selections.selectedCities.forEach(({ state, district, city }) => {
        const stateIndex = newLocations.findIndex((loc) => loc.state === state);

        if (stateIndex !== -1) {
          const districtIndex = newLocations[stateIndex].districts.findIndex(
            (d) => d.district === district
          );

          if (districtIndex === -1) {
            // Add district if it doesn't exist
            newLocations[stateIndex].districts.push({
              district,
              cities: [city],
            });
          } else {
            // Add city to existing district if not already present
            if (
              !newLocations[stateIndex].districts[districtIndex].cities.includes(
                city
              )
            ) {
              newLocations[stateIndex].districts[districtIndex].cities.push(city);
            }
          }
        }
      });

      const updatedData = {
        ...data,
        [locationKey]: {
          ...data[locationKey],
          domestic: {
            locations: [
              ...(data[locationKey]?.domestic?.locations || []),
              ...newLocations,
            ],
          },
        },
      };

      onChange(updatedData);

      // Clear selections
      if (type === "current") {
        setCurrentDomesticSelections({
          selectedStates: [],
          selectedDistricts: [],
          selectedCities: [],
        });
      } else {
        setDomesticSelections({
          selectedStates: [],
          selectedDistricts: [],
          selectedCities: [],
        });
      }
    },
    [currentDomesticSelections, domesticSelections, enqueueSnackbar, onChange, data]
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
        selectedStates: {},
        selectedCities: {},
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

  // Handle international state selection
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

  // Handle international city selection
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

        return { ...prev, selectedCities: newSelectedCities };
      });
    },
    []
  );

  const addInternationalLocation = useCallback(
    (type) => {
      const selections =
        type === "current"
          ? currentInternationalSelections
          : internationalSelections;
      const locationKey =
        type === "current" ? "currentOutletLocations" : "expansionLocations";

      if (selections.selectedCountries.length === 0) {
        enqueueSnackbar("Please select at least one country", {
          variant: "warning",
        });
        return;
      }

      setLoading((prev) => ({ ...prev, formSubmit: true }));
      try {
        const newLocations = [];

        // Process countries
        selections.selectedCountries.forEach((country) => {
          const countryExists = newLocations.some(
            (loc) => loc.country === country
          );
          if (!countryExists) {
            newLocations.push({
              country,
              states: [],
            });
          }
        });

        // Process states
        Object.entries(selections.selectedStates).forEach(
          ([country, states]) => {
            const countryIndex = newLocations.findIndex(
              (loc) => loc.country === country
            );

            if (countryIndex !== -1) {
              states.forEach((state) => {
                const stateExists = newLocations[countryIndex].states.some(
                  (s) => s.state === state
                );

                if (!stateExists) {
                  newLocations[countryIndex].states.push({
                    state,
                    cities: [],
                  });
                }
              });
            }
          }
        );

        // Process cities
        Object.entries(selections.selectedCities).forEach(
          ([stateKey, cities]) => {
            const [country, state] = stateKey.split("-");
            const countryIndex = newLocations.findIndex(
              (loc) => loc.country === country
            );

            if (countryIndex !== -1) {
              const stateIndex = newLocations[countryIndex].states.findIndex(
                (s) => s.state === state
              );

              if (stateIndex === -1) {
                // Add state if it doesn't exist
                newLocations[countryIndex].states.push({
                  state,
                  cities,
                });
              } else {
                // Add cities to existing state
                cities.forEach((city) => {
                  if (
                    !newLocations[countryIndex].states[stateIndex].cities.includes(
                      city
                    )
                  ) {
                    newLocations[countryIndex].states[stateIndex].cities.push(
                      city
                    );
                  }
                });
              }
            }
          }
        );

        const updatedData = {
          ...data,
          [locationKey]: {
            ...data[locationKey],
            international: {
              locations: [
                ...(data[locationKey]?.international?.locations || []),
                ...newLocations,
              ],
            },
          },
        };

        onChange(updatedData);

        // Clear selections
        if (type === "current") {
          setCurrentInternationalSelections({
            selectedCountries: [],
            selectedStates: {},
            selectedCities: {},
          });
        } else {
          setInternationalSelections({
            selectedCountries: [],
            selectedStates: {},
            selectedCities: {},
          });
        }
      } catch (error) {
        console.error("Error adding international locations:", error);
        setError("Failed to add locations. Please try again.");
      } finally {
        setLoading((prev) => ({ ...prev, formSubmit: false }));
      }
    },
    [currentInternationalSelections, internationalSelections, enqueueSnackbar, onChange, data]
  );

  const removeLocationItems = useCallback(
    (type, locationType, field, index) => {
      const updatedData = { ...data };
      const locations = [...updatedData[type][locationType].locations];

      if (field === "state" && locationType === "domestic") {
        // Remove state and all its districts/cities
        locations.splice(index, 1);
      } else if (field === "district" && locationType === "domestic") {
        // Remove district and all its cities
        const stateIndex = Math.floor(index / 1000);
        const districtIndex = index % 1000;
        if (locations[stateIndex] && locations[stateIndex].districts) {
          locations[stateIndex].districts.splice(districtIndex, 1);
        }
      } else if (field === "city" && locationType === "domestic") {
        // Remove city
        const stateIndex = Math.floor(index / 1000000);
        const districtIndex = Math.floor((index % 1000000) / 1000);
        const cityIndex = index % 1000;
        if (
          locations[stateIndex] &&
          locations[stateIndex].districts &&
          locations[stateIndex].districts[districtIndex]
        ) {
          locations[stateIndex].districts[districtIndex].cities.splice(
            cityIndex,
            1
          );
        }
      } else if (field === "country" && locationType === "international") {
        // Remove country and all its states/cities
        locations.splice(index, 1);
      } else if (field === "state" && locationType === "international") {
        // Remove state and all its cities
        const countryIndex = Math.floor(index / 1000);
        const stateIndex = index % 1000;
        if (
          locations[countryIndex] &&
          locations[countryIndex].states
        ) {
          locations[countryIndex].states.splice(stateIndex, 1);
        }
      } else if (field === "city" && locationType === "international") {
        // Remove city
        const countryIndex = Math.floor(index / 1000000);
        const stateIndex = Math.floor((index % 1000000) / 1000);
        const cityIndex = index % 1000;
        if (
          locations[countryIndex] &&
          locations[countryIndex].states &&
          locations[countryIndex].states[stateIndex]
        ) {
          locations[countryIndex].states[stateIndex].cities.splice(
            cityIndex,
            1
          );
        }
      }

      updatedData[type][locationType].locations = locations;
      onChange(updatedData);
    },
    [data, onChange]
  );

  // Helper function to flatten locations for display
  const flattenLocations = (locations = [], type) => {
    const result = [];

    if (!locations || !Array.isArray(locations)) return result;

    if (type === "domestic") {
      locations.forEach((stateObj, stateIndex) => {
        if (!stateObj) return;

        // Add state
        result.push({
          type: "state",
          label: stateObj.state,
          index: stateIndex,
        });

        // Add districts
        stateObj.districts?.forEach((districtObj, districtIndex) => {
          if (!districtObj) return;

          result.push({
            type: "district",
            label: `${stateObj.state} - ${districtObj.district}`,
            index: stateIndex * 1000 + districtIndex,
          });

          // Add cities
          districtObj.cities?.forEach((city, cityIndex) => {
            result.push({
              type: "city",
              label: `${stateObj.state} - ${districtObj.district} - ${city}`,
              index: stateIndex * 1000000 + districtIndex * 1000 + cityIndex,
            });
          });
        });
      });
    } else {
      // international
      locations.forEach((countryObj, countryIndex) => {
        if (!countryObj) return;

        // Add country
        result.push({
          type: "country",
          label: countryObj.country,
          index: countryIndex,
        });

        // Add states
        countryObj.states?.forEach((stateObj, stateIndex) => {
          if (!stateObj) return;

          result.push({
            type: "state",
            label: `${countryObj.country} - ${stateObj.state}`,
            index: countryIndex * 1000 + stateIndex,
          });

          // Add cities
          stateObj.cities?.forEach((city, cityIndex) => {
            result.push({
              type: "city",
              label: `${countryObj.country} - ${stateObj.state} - ${city}`,
              index: countryIndex * 1000000 + stateIndex * 1000 + cityIndex,
            });
          });
        });
      });
    }

    return result;
  };

  // Render domestic state drawer
  const renderDomesticStateDrawer = useCallback(
    (type) => {
      const selections =
        type === "current" ? currentDomesticSelections : domesticSelections;
      const toggle = (open) => toggleDrawer(type, { states: open });

      return (
        <Box sx={{ mt: 4, mb: 3 }}>
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
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 3, color: "#ff9800" }}
              >
                Select States :
              </Typography>
              <Button
                variant="outlined"
                color="warning"
                sx={{ padding: "10px", borderRadius: "5px", mb: 3 }}
                onClick={() => toggle(false)}
              >
                Add Your Selected States
              </Button>
            </Box>

            <TextField
              placeholder="Search states..."
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              onChange={(e) => handleSearchChange("states", e.target.value)}
              InputProps={{
                startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
              }}
            />

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
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 1, color: "#ff9800" }}
                >
                  Selected States:
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
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

            <Box sx={{ flex: 1, overflow: "auto", mt: 1 }}>
              <Box
                sx={{
                  display: "grid",
                  m: 5,
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 1,
                }}
              >
                {sortedStates.map((state) => {
                  const isSelected = selections.selectedStates.includes(
                    state.name
                  );
                  return (
                    <Box key={`state-${state.name}`}>
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
      toggleDrawer,
    ]
  );

  // Render domestic district drawer
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
        <Box sx={{ mt: 3, mb: 3 }}>
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
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 3, color: "#ff9800" }}
              >
                Select Districts
              </Typography>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => toggle(false)}
              >
                Add Your Selected District
              </Button>
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
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
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
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, color: "orange" }}
                    >
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
                        const isSelected =
                          selectedDistrictsForState.includes(district);
                        return (
                          <Box key={`district-${stateName}-${district}`}>
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
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
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
      toggleDrawer,
    ]
  );

  // Render domestic city drawer
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
        <Box sx={{ mt: 3, mb: 3 }}>
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
              <Button
                variant="outlined"
                color="warning"
                onClick={() => toggle(false)}
              >
                Add Your Selected Cities
              </Button>
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
                {Object.entries(citiesByDistrict).map(
                  ([districtKey, cities]) => {
                    const [state, district] = districtKey.split("-");
                    return (
                      <Box
                        key={`selected-cities-${districtKey}`}
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold" }}
                        >
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
                  }
                )}
              </Box>
            )}

            <Box sx={{ flex: 1, overflow: "auto" }}>
              {Object.entries(districtsByState).map(
                ([stateName, districts]) => {
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
                        <Typography
                          variant="subtitle1"
                          sx={{ mb: 1, color: "orange" }}
                        >
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
                            const isSelected =
                              selectedCitiesForDistrict.includes(city);
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
                }
              )}
            </Box>
          </Drawer>

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
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
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
      toggleDrawer,
    ]
  );

  // Render international country drawer
  const renderInternationalCountryDrawer = useCallback(
    (type) => {
      const selections =
        type === "current"
          ? currentInternationalSelections
          : internationalSelections;
      const toggle = (open) => toggleDrawer(type, { countries: open });

      return (
        <Box sx={{ mt: 3, mb: 3 }}>
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
              <Button
                variant="outlined"
                color="warning"
                onClick={() => toggle(false)}
              >
                Add Your Selected Country
              </Button>
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
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
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

            <Box sx={{ flex: 1, overflow: "auto", mt: 1 }}>
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
                                : [
                                    ...selections.selectedCountries,
                                    country.name,
                                  ];
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
      toggleDrawer,
    ]
  );

  // Render international state drawer
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
        <Box sx={{ mt: 3, mb: 3 }}>
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
              <Button
                variant="outlined"
                color="warning"
                onClick={() => toggle(false)}
              >
                Add Your Selected States
              </Button>
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
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, color: "orange" }}
                    >
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
                        const isSelected = countrySelectedStates.includes(
                          state.name
                        );
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
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
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
      toggleDrawer,
    ]
  );

  // Render international city drawer
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
        <Box sx={{ mt: 3, mb: 3 }}>
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
              <Button
                color="warning"
                variant="outlined"
                onClick={() => toggle(false)}
              >
                Add Your Selected Cities
              </Button>
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
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold" }}
                        >
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
                      .sort((a, b) => a.localeCompare(b.name));

                    const stateSelectedCities =
                      selections.selectedCities[stateKey] || [];

                    if (filteredCities.length === 0) return null;

                    return (
                      <Box key={`cities-section-${stateKey}`} sx={{ mb: 4 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ mb: 1, color: "orange" }}
                        >
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
                            const isSelected =
                              stateSelectedCities.includes(city);
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
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
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
      toggleDrawer,
    ]
  );

  // Main render
  return (
    <Box sx={{ mr: { sm: 0, md: 25 }, ml: { sm: 0, md: 25 } }}>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Brand Expansion Location Details
      </Typography>

      {/* International Expansion Toggle */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
  <Typography variant="subtitle2" mt={0} gap={2}>
    Is your brand expanding internationally? :
  </Typography>

  <RadioGroup
    row
    value={data?.isInternationalExpansion || ""}
    sx={{ gap: 11, justifyContent: "start", ml: 15.1 }}
    onChange={(e) => handleInternationalExpansionChange(e.target.value)} // 👈 no conversion to boolean
  >
    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
    <FormControlLabel value="No" control={<Radio />} label="No" />
  </RadioGroup>
</Box>


      {/* Current Outlet Locations */}
      <Divider sx={{ my: 2 }} />

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 0, color: "#ff9800" }}
      >
        Current Outlet Locations
      </Typography>

      <RadioGroup
        sx={{ justifyContent: "center", gap: 10 }}
        row
        value={currentOutletLocationType}
        onChange={handleCurrentOutletLocationTypeChange}
      >
        <FormControlLabel value="domestic" control={<Radio />} label="India" />
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
              {flattenLocations(
                data?.currentOutletLocations?.domestic?.locations || [],
                "domestic"
              ).map((item) => (
                <Chip
                  key={`current-${item.type}-${item.index}`}
                  label={item.label}
                  onDelete={() =>
                    removeLocationItems(
                      "currentOutletLocations",
                      "domestic",
                      item.type,
                      item.index
                    )
                  }
                  color={
                    item.type === "state"
                      ? "primary"
                      : item.type === "district"
                      ? "secondary"
                      : "success"
                  }
                  variant="outlined"
                />
              ))}
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
              {flattenLocations(
                data?.currentOutletLocations?.international?.locations || [],
                "international"
              ).map((item) => (
                <Chip
                  key={`current-${item.type}-${item.index}`}
                  label={item.label}
                  onDelete={() =>
                    removeLocationItems(
                      "currentOutletLocations",
                      "international",
                      item.type,
                      item.index
                    )
                  }
                  color={
                    item.type === "country"
                      ? "primary"
                      : item.type === "state"
                      ? "secondary"
                      : "success"
                  }
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* Expansion Locations */}
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Expansion Locations
      </Typography>
      <RadioGroup
        row
        value={locationType}
        onChange={handleLocationTypeChange}
        sx={{ justifyContent: "center", gap: 10 }}
      >
        <FormControlLabel value="domestic" control={<Radio />} label="India" />
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
              {flattenLocations(
                data?.expansionLocations?.domestic?.locations || [],
                "domestic"
              ).map((item) => (
                <Chip
                  key={`expansion-${item.type}-${item.index}`}
                  label={item.label}
                  onDelete={() =>
                    removeLocationItems(
                      "expansionLocations",
                      "domestic",
                      item.type,
                      item.index
                    )
                  }
                  color={
                    item.type === "state"
                      ? "primary"
                      : item.type === "district"
                      ? "secondary"
                      : "success"
                  }
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
              {flattenLocations(
                data?.expansionLocations?.international?.locations || [],
                "international"
              ).map((item) => (
                <Chip
                  key={`expansion-${item.type}-${item.index}`}
                  label={item.label}
                  onDelete={() =>
                    removeLocationItems(
                      "expansionLocations",
                      "international",
                      item.type,
                      item.index
                    )
                  }
                  color={
                    item.type === "country"
                      ? "primary"
                      : item.type === "state"
                      ? "secondary"
                      : "success"
                  }
                  variant="outlined"
                />
              ))}
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
};

export default BrandExpansionLocationDetails;