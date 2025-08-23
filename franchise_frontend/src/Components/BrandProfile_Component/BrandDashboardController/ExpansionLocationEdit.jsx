import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  FormHelperText,
  Button,
  Checkbox,
  TextField,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,

} from "@mui/material";
import { ChevronDown, Search } from "lucide-react";
import { useSnackbar } from "notistack";
import debounce from "lodash/debounce";
import axios from "axios";

// Import local JSON data for Indian states and districts
import indianStatesData from "../../../pages/Registration/BrandLIstingRegister/data/IndiaStateDistrictFile.json";

// Cache for API responses (only for international now)
const apiCache = {
  countries: null,
  states: {},
  cities: {},
};

const ExpansionLocationEdit = ({ data, onChange, onNestedChange, onObjectChange, errors, isEditing }) => {
  const { enqueueSnackbar } = useSnackbar();


  console.log("ExpansionLocationEdit data:", data);

  // Location type state
  const [locationType, setLocationType] = useState("domestic");
  const [currentOutletLocationType, setCurrentOutletLocationType] = useState("domestic");

  // Domestic selections for expansion locations
  const [domesticSelections, setDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
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
  });

  const [currentInternationalSelections, setCurrentInternationalSelections] = useState({
    selectedCountries: [],
    selectedStates: {},
    selectedCities: {},
  });

  // Location data
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState({});
  const [countries, setCountries] = useState([]);
  const [internationalStates, setInternationalStates] = useState({});
  const [internationalCities, setInternationalCities] = useState({});
  const [currentInternationalStates, setCurrentInternationalStates] = useState({});
  const [currentInternationalCities, setCurrentInternationalCities] = useState({});

  const [loading, setLoading] = useState({
    countries: false,
    formSubmit: false,
  });

  const [error, setError] = useState(null);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState({
    states: false,
    districts: false,
    countries: false,
    intStates: false,
    intCities: false,
  });

  // Collapse states for current locations
  const [currentDrawerOpen, setCurrentDrawerOpen] = useState({
    states: false,
    districts: false,
    countries: false,
    intStates: false,
    intCities: false,
  });

  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    states: "",
    districts: "",
    countries: "",
    intStates: "",
    intCities: "",
  });

  // Define updateFormData first, before any functions that use it
  const updateFormData = useCallback(
    (type, locationType, selections) => {
      const locationKey = type === "current" ? "currentOutletLocations" : "expansionLocations";

      if (locationType === "domestic") {
      // Process domestic locations
      const existingLocations = data[locationKey]?.domestic?.locations || [];
      const newLocationsMap = {};

      existingLocations.forEach((loc) => {
        newLocationsMap[loc.state] = loc.districts;
      });

      selections.selectedStates.forEach((stateName) => {
        if (!newLocationsMap[stateName]) {
          newLocationsMap[stateName] = [];
        }
      });

      selections.selectedDistricts.forEach(({ state, district }) => {
        if (newLocationsMap[state]) {
          if (!newLocationsMap[state].some((d) => d.district === district)) {
            newLocationsMap[state].push({ district });
          }
        }
      });

      const newLocations = Object.entries(newLocationsMap).map(([state, districts]) => ({
        state,
        districts,
      }));

      onObjectChange(locationKey, {
        ...data[locationKey],
        domestic: {
          locations: newLocations,
        },
      });
    } else {
        // International locations
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
                newLocations[countryIndex].states.push({
                  state,
                  cities,
                });
              } else {
                cities.forEach((city) => {
                  if (
                    !newLocations[countryIndex].states[
                      stateIndex
                    ].cities.includes(city)
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

        // Update the form data using the provided onChange function
        onObjectChange(locationKey, {
          ...data[locationKey],
          international: {
            locations: newLocations,
          },
        });
      }
    },
    [data, onObjectChange]
  );

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

  // Memoized sorted and filtered districts
  const sortedDistricts = useMemo(() => {
    const result = {};
    Object.keys(districts).forEach((state) => {
      result[state] = districts[state]
        .filter((district) =>
          district.toLowerCase().includes(searchFilters.districts)
        )
        .sort((a, b) => a.localeCompare(b));
    });
    return result;
  }, [districts, searchFilters.districts]);

  // Memoized sorted and filtered countries
  const sortedCountries = useMemo(() => {
    return countries
      .filter((country) =>
        country.name.toLowerCase().includes(searchFilters.countries)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, searchFilters.countries]);

  // Load domestic data from local JSON files
  const loadDomesticData = useCallback(() => {
    try {
      // Build array of state objects
      console.log("indianStatesData", indianStatesData); // <-- Add this line
  
      const statesList = Object.keys(indianStatesData)
  .filter(Boolean)
  .map((stateName) => ({
    id: stateName,
    name: stateName
  }));
setStates(statesList);
console.log("Loaded states:", statesList);

      // Build districts mapping
      const districtsMap = {};
      Object.entries(indianStatesData).forEach(([stateName, stateData]) => {
        districtsMap[stateName] = stateData.districts || [];
      });
      setDistricts(districtsMap);
    } catch (error) {
      console.error("Error loading domestic data:", error);
      setError("Failed to load domestic locations data.");
      enqueueSnackbar("Failed to load domestic locations data", { variant: "error" });
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

      // Update form data immediately
      updateFormData(type, "international", {
        selectedCountries,
        selectedStates: {},
        selectedCities: {},
      });

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
    [debouncedGetStatesByCountry, updateFormData]
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
        const newSelectedCities = { ...prev.selectedCities };

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
        const stateKey = `${countryName}-${stateName}`;
        if (newSelectedCities[stateKey]) {
          delete newSelectedCities[stateKey];
        }

        const newSelections = {
          ...prev,
          selectedStates: newSelectedStates,
          selectedCities: newSelectedCities,
        };

        // Update form data immediately
        updateFormData(type, "international", newSelections);

        return newSelections;
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
    [debouncedGetCitiesByCountryAndState, updateFormData]
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

        const newSelections = {
          ...prev,
          selectedCities: newSelectedCities,
        };

        // Update form data immediately
        updateFormData(type, "international", newSelections);

        return newSelections;
      });
    },
    [updateFormData]
  );

  // Handle "Select All" for states in a country
// const handleSelectAllStates = useCallback(
//   (isSelected, type) => {
//     const setSelections =
//       type === "current"
//         ? setCurrentDomesticSelections
//         : setDomesticSelections;

//     setSelections((prev) => {
//       const newStates = isSelected ? states.map(s => s.name) : [];
//       const newDistricts = isSelected ? Object.keys(districts).reduce((acc, stateName) => {
//         acc.push(...(districts[stateName] || []).map(district => ({
//           state: stateName,
//           district,
//         })));
//         return acc;
//       }, []) : []; // clear districts if unselected.

//       const newSelections = {
//         selectedStates: newStates,
//         selectedDistricts: newDistricts,
//       };

//       updateFormData(type === "current" ? "current" : "expansion", "domestic", newSelections);
//       return newSelections;
//     });
//   },
//   [states, districts, updateFormData]
// );
// // ...existing code...


  // Handle "Select All" for cities in a state
  const handleSelectAllStateCities = useCallback(
    (countryName, stateName, cities, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedCities = { ...prev.selectedCities };
        const stateKey = `${countryName}-${stateName}`;

        if (isSelected) {
          newSelectedCities[stateKey] = [...cities];
        } else {
          delete newSelectedCities[stateKey];
        }

        const newSelections = {
          ...prev,
          selectedCities: newSelectedCities,
        };

        // Update form data immediately
        updateFormData(type, "international", newSelections);

        return newSelections;
      });
    },
    [updateFormData]
  );

  // Initialize component with data
  useEffect(() => {
    loadDomesticData();
    fetchCountries();

    if (data?.currentOutletLocations) {
      // Initialize domestic selections if data exists
      if (data.currentOutletLocations.domestic?.locations?.length > 0) {
        const domesticLocations = data.currentOutletLocations.domestic.locations;
        const selectedStates = domesticLocations.map(loc => loc.state);
        const selectedDistricts = domesticLocations.flatMap(
          loc => loc.districts?.map(district => ({
            state: loc.state,
            district: district.district,
          })) || []
        );

        setCurrentDomesticSelections({
          selectedStates,
          selectedDistricts,
        });
      }

      // Initialize international selections if data exists
      if (data.currentOutletLocations.international?.locations?.length > 0) {
        const intlLocations = data.currentOutletLocations.international.locations;
        const selectedCountries = intlLocations.map(loc => loc.country);
        const selectedStates = {};
        const selectedCities = {};

        intlLocations.forEach(loc => {
          if (loc.states?.length > 0) {
            selectedStates[loc.country] = loc.states.map(state => state.state);
            loc.states.forEach(state => {
              const stateKey = `${loc.country}-${state.state}`;
              if (state.cities?.length > 0) {
                selectedCities[stateKey] = state.cities;
              }
            });
          }
        });

        setCurrentInternationalSelections({
          selectedCountries,
          selectedStates,
          selectedCities,
        });
      }
    }

    if (data?.expansionLocations) {
      // Initialize domestic selections if data exists
      if (data.expansionLocations.domestic?.locations?.length > 0) {
        const domesticLocations = data.expansionLocations.domestic.locations;
        const selectedStates = domesticLocations.map(loc => loc.state);
        const selectedDistricts = domesticLocations.flatMap(
          loc => loc.districts?.map(district => ({
            state: loc.state,
            district: district.district,
          })) || []
        );

        setDomesticSelections({
          selectedStates,
          selectedDistricts,
        });
      }

      // Initialize international selections if data exists
      if (data.expansionLocations.international?.locations?.length > 0) {
        const intlLocations = data.expansionLocations.international.locations;
        const selectedCountries = intlLocations.map(loc => loc.country);
        const selectedStates = {};
        const selectedCities = {};

        intlLocations.forEach(loc => {
          if (loc.states?.length > 0) {
            selectedStates[loc.country] = loc.states.map(state => state.state);
            loc.states.forEach(state => {
              const stateKey = `${loc.country}-${state.state}`;
              if (state.cities?.length > 0) {
                selectedCities[stateKey] = state.cities;
              }
            });
          }
        });

        setInternationalSelections({
          selectedCountries,
          selectedStates,
          selectedCities,
        });
      }
    }
  }, [data, loadDomesticData, fetchCountries]);

  // Handle international expansion selection
  const handleInternationalExpansionChange = useCallback(
    (value) => {
      const newValue = value === data?.isInternationalExpansion ? null : value;
      onChange("isInternationalExpansion", newValue);
    },
    [data, onChange]
  );

  // Handle location type change (domestic/international)
  const handleLocationTypeChange = useCallback((e) => {
    const newType = e.target.value;
    setLocationType(newType);
  }, []);

  // Handle current outlet location type change
  const handleCurrentOutletLocationTypeChange = useCallback((e) => {
    const newType = e.target.value;
    setCurrentOutletLocationType(newType);
  }, []);

  // Handle domestic state selection
const handleDomesticStateSelection = useCallback(
  (selectedStates, type) => {
    const setSelections =
      type === "current"
        ? setCurrentDomesticSelections
        : setDomesticSelections;

    // Filter districts to only include those from the selected states
    const newDistricts = (type === "current"
      ? currentDomesticSelections.selectedDistricts
      : domesticSelections.selectedDistricts
    ).filter((district) =>
      selectedStates.includes(district.state)
    );

    const newSelections = {
      selectedStates,
      selectedDistricts: newDistricts,
    };

    setSelections(newSelections); // <-- Direct set, not callback

    updateFormData(
      type === "current" ? "current" : "expansion",
      "domestic",
      newSelections
    );
  },
  [updateFormData, currentDomesticSelections.selectedDistricts, domesticSelections.selectedDistricts]
);

  const handleSelectAllDomesticStates = useCallback(
  (isSelected, type) => {
    const setSelections =
      type === "current"
        ? setCurrentDomesticSelections
        : setDomesticSelections;

    setSelections((prev) => {
      const newStates = isSelected ? states.map(s => s.name) : [];
      const newDistricts = isSelected
        ? newStates.flatMap(stateName =>
            (districts[stateName] || []).map(district => ({
              state: stateName,
              district,
            }))
          )
        : [];
      const newSelections = {
        selectedStates: newStates,
        selectedDistricts: newDistricts,
      };
      updateFormData(type === "current" ? "current" : "expansion", "domestic", newSelections);
      return newSelections;
    });
  },
  [states, districts, updateFormData]
);


  // Handle domestic district selection
  const handleDomesticDistrictSelection = useCallback(
    (stateName, districtName, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentDomesticSelections
          : setDomesticSelections;

      setSelections((prev) => {
        const newSelections = {
          selectedStates: [...prev.selectedStates],
          selectedDistricts: [...prev.selectedDistricts],
        };

        if (isSelected) {
          newSelections.selectedDistricts = [
            ...newSelections.selectedDistricts,
            { state: stateName, district: districtName },
          ];
        } else {
          newSelections.selectedDistricts =
            newSelections.selectedDistricts.filter(
              (d) => !(d.state === stateName && d.district === districtName)
            );
        }

        // Update form data immediately
        updateFormData(type === "current" ? "current" : "expansion", "domestic", newSelections);

        return newSelections;
      });
    },
    [updateFormData]
  );

  // Handle "Select All" for districts in a state
  const handleSelectAllDistricts = useCallback(
    (stateName, districts, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentDomesticSelections
          : setDomesticSelections;

      setSelections((prev) => {
        let newSelectedDistricts = [...prev.selectedDistricts];

        if (isSelected) {
          // Add all districts
          districts.forEach((district) => {
            if (
              !newSelectedDistricts.some(
                (d) => d.state === stateName && d.district === district
              )
            ) {
              newSelectedDistricts.push({ state: stateName, district });
            }
          });
        } else {
          // Remove all districts for this state
          newSelectedDistricts = newSelectedDistricts.filter(
            (d) => d.state !== stateName
          );
        }

        const newSelections = {
          ...prev,
          selectedDistricts: newSelectedDistricts,
        };

        // Update form data immediately
        updateFormData(type, "domestic", newSelections);

        return newSelections;
      });
    },
    [updateFormData]
  );

  // Remove location items
  const removeLocationItems = useCallback(
    (type, locationType, field, index) => {
      const locationKey = type === "current" ? "currentOutletLocations" : "expansionLocations";
      const currentData = data[locationKey] || {
        domestic: { locations: [] },
        international: { locations: [] }
      };

      if (locationType === "domestic") {
        if (field === "state") {
          // Remove specific state
          // currentData.domestic.locations = 
          //   currentData.domestic.locations.filter((_, i) => i !== index);

          currentData.domestic.locations.splice(index, 1);
        } else if (field === "district") {
          // Remove specific district from its state
          const stateIndex = Math.floor(index / 1000);
          const districtIndex = index % 1000;
          
          if (currentData.domestic.locations[stateIndex]?.districts) {
            // currentData.domestic.locations[stateIndex].districts = 
            //   currentData.domestic.locations[stateIndex].districts
            //     .filter((_, i) => i !== districtIndex);
                currentData.domestic.locations[stateIndex].districts.splice(districtIndex, 1);

            // Remove the state if it has no districts left
            if (currentData.domestic.locations[stateIndex].districts.length === 0) {
              currentData.domestic.locations.splice(stateIndex, 1);
            }
          }
        }
      } else {
        // International locations
        if (field === "country") {
          currentData.international.locations = 
            currentData.international.locations.filter((_, i) => i !== index);
        } else if (field === "state") {
          const countryIndex = Math.floor(index / 1000);
          const stateIndex = index % 1000;
          
          if (currentData.international.locations[countryIndex]?.states) {
            currentData.international.locations[countryIndex].states = 
              currentData.international.locations[countryIndex].states
                .filter((_, i) => i !== stateIndex);
                
            // Remove the country if it has no states left
            if (currentData.international.locations[countryIndex].states.length === 0) {
              currentData.international.locations.splice(countryIndex, 1);
            }
          }
        } else if (field === "city") {
          const countryIndex = Math.floor(index / 1000000);
          const stateIndex = Math.floor((index % 1000000) / 1000);
          const cityIndex = index % 1000;
          
          if (currentData.international.locations[countryIndex]?.states?.[stateIndex]?.cities) {
            currentData.international.locations[countryIndex].states[stateIndex].cities = 
              currentData.international.locations[countryIndex].states[stateIndex].cities
                .filter((_, i) => i !== cityIndex);
                
            // Remove the state if it has no cities left
            if (currentData.international.locations[countryIndex].states[stateIndex].cities.length === 0) {
              currentData.international.locations[countryIndex].states.splice(stateIndex, 1);
              
              // Remove the country if it has no states left
              if (currentData.international.locations[countryIndex].states.length === 0) {
                currentData.international.locations.splice(countryIndex, 1);
              }
            }
          }
        }
      }

      // Update the form data
      onObjectChange(locationKey, currentData);
      
      // Also update the local state to match
      if (type === "current") {
        if (locationType === "domestic") {
          setCurrentDomesticSelections({
            selectedStates: currentData?.domestic?.locations?.map(loc => loc.state) || [],
            selectedDistricts: currentData?.domestic?.locations?.flatMap(loc => 
              loc.districts?.map(district => ({
                state: loc.state,
                district: district.district
              })) || []
            ) || []
          });
        } else {
          setCurrentInternationalSelections({
            selectedCountries: currentData?.international?.locations?.map(loc => loc.country) || [],
            selectedStates: currentData?.international?.locations?.reduce((acc, loc) => {
              if (loc.states?.length) {
                acc[loc.country] = loc.states.map(state => state.state);
              }
              return acc;
            }, {}),
            selectedCities: currentData?.international?.locations?.reduce((acc, loc) => {
              loc.states?.forEach(state => {
                const key = `${loc.country}-${state.state}`;
                if (state.cities?.length) {
                  acc[key] = state.cities;
                }
              });
              return acc;
            }, {})
          });
        }
      } else {
        if (locationType === "domestic") {
          setDomesticSelections({
            selectedStates: currentData?.domestic?.locations?.map(loc => loc.state) || [],
            selectedDistricts: currentData?.domestic?.locations?.flatMap(loc => 
              loc.districts?.map(district => ({
                state: loc.state,
                district: district.district
              })) || []
            ) || []
          });
        } else {
          setInternationalSelections({
            selectedCountries: currentData?.international?.locations?.map(loc => loc.country) || [],
            selectedStates: currentData?.international?.locations?.reduce((acc, loc) => {
              if (loc.states?.length) {
                acc[loc.country] = loc.states.map(state => state.state);
              }
              return acc;
            }, {}),
            selectedCities: currentData?.international?.locations?.reduce((acc, loc) => {
              loc.states?.forEach(state => {
                const key = `${loc.country}-${state.state}`;
                if (state.cities?.length) {
                  acc[key] = state.cities;
                }
              });
              return acc;
            }, {})
          });
        }
      }
    },
    [data, onObjectChange]
  );

  // Main render
  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
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
          value={
            data?.isInternationalExpansion === null
              ? ""
              : data?.isInternationalExpansion
          }
          sx={{ gap: 11, justifyContent: "start", ml: 15 }}
          onChange={(e) =>
            handleInternationalExpansionChange(e.target.value === "true")
          }
          disabled={!isEditing}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
        {errors?.isInternationalExpansion && (
          <FormHelperText error sx={{ ml: 2 }}>
            {errors.isInternationalExpansion}
          </FormHelperText>
        )}
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
        disabled={!isEditing}
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
          <DomesticStateDrawer
    type="current"
  selections={currentDomesticSelections}
  drawerOpen={currentDrawerOpen.states}
  sortedStates={sortedStates}
  handleDomesticStateSelection={handleDomesticStateSelection}
  handleSelectAllDomesticStates={handleSelectAllDomesticStates} // Add this line
  handleSearchChange={handleSearchChange}
  toggleDrawer={toggleDrawer}
  isEditing={true}
  removeLocationItems={removeLocationItems}
/>
          <DomesticDistrictDrawer
            type="current"
            selections={currentDomesticSelections}
            drawerOpen={currentDrawerOpen.districts}
            districtsData={districts}
            sortedDistricts={sortedDistricts}
            searchFilters={searchFilters}
            handleDomesticDistrictSelection={handleDomesticDistrictSelection}
            handleSearchChange={handleSearchChange}
            handleSelectAllDistricts={handleSelectAllDistricts}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
        </>
      ) : (
        <>
          <InternationalCountryDrawer
            type="current"
            selections={currentInternationalSelections}
            drawerOpen={currentDrawerOpen.countries}
            sortedCountries={sortedCountries}
            searchFilters={searchFilters}
            handleInternationalCountrySelection={handleInternationalCountrySelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
          <InternationalStateDrawer
            type="current"
            selections={currentInternationalSelections}
            drawerOpen={currentDrawerOpen.intStates}
            statesData={currentInternationalStates}
            searchFilters={searchFilters}
            handleInternationalStateSelection={handleInternationalStateSelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
          <InternationalCityDrawer
            type="current"
            selections={currentInternationalSelections}
            drawerOpen={currentDrawerOpen.intCities}
            citiesData={currentInternationalCities}
            searchFilters={searchFilters}
            handleInternationalCitySelection={handleInternationalCitySelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
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
        disabled={!isEditing}
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
          <DomesticStateDrawer
type="expansion"
  selections={domesticSelections}
  drawerOpen={drawerOpen.states}
  sortedStates={sortedStates}
  handleDomesticStateSelection={handleDomesticStateSelection}
  handleSelectAllDomesticStates={handleSelectAllDomesticStates} // Add this line
  handleSearchChange={handleSearchChange}
  toggleDrawer={toggleDrawer}
  isEditing={true}
  removeLocationItems={removeLocationItems}
/>
          <DomesticDistrictDrawer
            type="expansion"
            selections={domesticSelections}
            drawerOpen={drawerOpen.districts}
            districtsData={districts}
            sortedDistricts={sortedDistricts}
            searchFilters={searchFilters}
            handleDomesticDistrictSelection={handleDomesticDistrictSelection}
            handleSearchChange={handleSearchChange}
            handleSelectAllDistricts={handleSelectAllDistricts}
            toggleDrawer={toggleDrawer}
            isEditing={true}
            removeLocationItems={removeLocationItems}
          />
        </>
      ) : (
        <>
          <InternationalCountryDrawer
            type="expansion"
            selections={internationalSelections}
            drawerOpen={drawerOpen.countries}
            sortedCountries={sortedCountries}
            searchFilters={searchFilters}
            handleInternationalCountrySelection={handleInternationalCountrySelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
          <InternationalStateDrawer
            type="expansion"
            selections={internationalSelections}
            drawerOpen={drawerOpen.intStates}
            statesData={internationalStates}
            searchFilters={searchFilters}
            handleInternationalStateSelection={handleInternationalStateSelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
          <InternationalCityDrawer
            type="expansion"
            selections={internationalSelections}
            drawerOpen={drawerOpen.intCities}
            citiesData={internationalCities}
            searchFilters={searchFilters}
            handleInternationalCitySelection={handleInternationalCitySelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
        </>
      )}
    </Box>
  );
};

// Domestic State Drawer Component
// Domestic State Drawer Component - Fixed version
const DomesticStateDrawer = ({
  type,
  selections,
  drawerOpen,
  sortedStates,
  handleDomesticStateSelection,
  handleSelectAllDomesticStates,
  handleSearchChange,
  toggleDrawer,
  isEditing,
  removeLocationItems,
}) => {
  const allStatesSelected = selections.selectedStates.length === sortedStates.length;
  const someStatesSelected = selections.selectedStates.length > 0 && !allStatesSelected;

  const handleStateCheckboxChange = (stateName, isChecked) => {
    const newSelectedStates = isChecked
      ? [...selections.selectedStates, stateName]
      : selections.selectedStates.filter(s => s !== stateName);

    handleDomesticStateSelection(newSelectedStates, type);
  };

  return (
    <Box sx={{ mt: 4, mb: 3 }}>
      <Button
        variant="outlined"
        fullWidth
        color="warning"
        onClick={() => toggleDrawer(type, { states: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selections.selectedStates.length > 0
          ? `${selections.selectedStates.length} states selected`
          : "Select States"}
      </Button>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { states: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
            Select States
          </Typography>
          <Button variant="outlined" color="warning" onClick={() => toggleDrawer(type, { states: false })}>
            Done
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

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={allStatesSelected}
            indeterminate={someStatesSelected}
            onChange={(e) => handleSelectAllDomesticStates(e.target.checked, type)}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All States
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", mt: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, px: 5 }}>
            {sortedStates.map((state) => {
              const isSelected = selections.selectedStates.includes(state.name);
              return (
                <FormControlLabel
                  key={`state-${state.name}`}
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleStateCheckboxChange(state.name, e.target.checked)}
                    />
                  }
                  label={state.name}
                />
              );
            })}
          </Box>
        </Box>
      </Drawer>

      {/* Accordion for Selected States */}
      {selections.selectedStates.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected States ({selections.selectedStates.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1 }}>
                {selections.selectedStates.map((state, index) => (
                  <Chip
                    key={`selected-state-${index}`}
                    label={state}
                    onDelete={() => {
                      const newSelectedStates = selections.selectedStates.filter((_, i) => i !== index);
                      handleDomesticStateSelection(newSelectedStates, type);
                    }}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};




// Domestic District Drawer Component
const DomesticDistrictDrawer = ({
  type,
  selections,
  drawerOpen,
  districtsData,
  sortedDistricts,
  searchFilters,
  handleDomesticDistrictSelection,
  handleSearchChange,
  handleSelectAllDistricts,
  toggleDrawer,
  isEditing,
  removeLocationItems
}) => {
  if (selections.selectedStates.length === 0) return null;

  // Group selected districts by state
  const districtsByState = selections.selectedDistricts.reduce(
    (acc, { state, district }) => {
      if (!acc[state]) acc[state] = [];
      acc[state].push(district);
      return acc;
    },
    {}
  );

  // Calculate total available districts
  const totalDistricts = selections.selectedStates.reduce(
    (total, stateName) => {
      return total + (districtsData[stateName]?.length || 0);
    },
    0
  );

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { districts: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selections.selectedDistricts.length > 0
          ? `${selections.selectedDistricts.length} districts selected`
          : "Select Districts"}
      </Button>

      {/* Drawer for District Selection */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { districts: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
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
            sx={{ color: "#ff9800" }}
          >
            Select Districts
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { districts: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search Field */}
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

        {/* Select All */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={
              selections.selectedDistricts.length > 0 &&
              selections.selectedDistricts.length === totalDistricts
            }
            indeterminate={
              selections.selectedDistricts.length > 0 &&
              selections.selectedDistricts.length < totalDistricts
            }
            onChange={() => {
              selections.selectedStates.forEach((stateName) => {
                const stateDistricts = districtsData[stateName] || [];
                handleSelectAllDistricts(
                  stateName,
                  stateDistricts,
                  selections.selectedDistricts.length !== totalDistricts,
                  type
                );
              });
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Districts
          </Typography>
        </Box>

        {/* District Checkboxes */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {selections.selectedStates.map((stateName) => {
            const stateDistricts = (districtsData[stateName] || [])
              .filter((d) =>
                d.toLowerCase().includes(searchFilters.districts.toLowerCase())
              )
              .sort((a, b) => a.localeCompare(b));

            if (stateDistricts.length === 0) return null;

            const selectedDistrictsForState = selections.selectedDistricts
              .filter((d) => d.state === stateName)
              .map((d) => d.district);

            const allSelected = stateDistricts.every((d) =>
              selectedDistrictsForState.includes(d)
            );

            return (
              <Box key={`districts-section-${stateName}`} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={
                      selectedDistrictsForState.length > 0 && !allSelected
                    }
                    onChange={() =>
                      handleSelectAllDistricts(
                        stateName,
                        stateDistricts,
                        !allSelected,
                        type
                      )
                    }
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "orange", ml: 1 }}
                  >
                    {stateName}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 1,
                    ml: 4,
                  }}
                >
                  {stateDistricts.map((district) => {
                    const isSelected = selectedDistrictsForState.includes(district);
                    return (
                      <FormControlLabel
                        key={`district-${stateName}-${district}`}
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
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Drawer>

      {/* Accordion for Selected Districts */}
      {selections.selectedDistricts.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Districts ({selections.selectedDistricts.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(districtsByState).map(
                ([state, districts]) => (
                  <Box key={`selected-districts-${state}`} sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "orange", mb: 1 }}
                    >
                      {state}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: 1,
                        ml: 2,
                      }}
                    >
                      {districts.map((district, index) => (
                        <Chip
                          key={`selected-district-${state}-${district}-${index}`}
                          label={district}
                          onDelete={() => {
                            if (isEditing) {
                              // Find the index of this district in the selections
                              const districtIndex = selections.selectedDistricts.findIndex(
                                d => d.state === state && d.district === district
                              );
                              if (districtIndex !== -1) {
                                removeLocationItems(type, "domestic", "district", districtIndex);
                              }
                            }
                          }}
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

// International Country Drawer Component
const InternationalCountryDrawer = ({
  type,
  selections,
  drawerOpen,
  sortedCountries,
  searchFilters,
  handleInternationalCountrySelection,
  handleSearchChange,
  toggleDrawer,
  isEditing,
  removeLocationItems
}) => {
  const allSelected =
    selections.selectedCountries.length === sortedCountries.length;
  const someSelected =
    selections.selectedCountries.length > 0 && !allSelected;

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        color="success"
        fullWidth
        onClick={() => toggleDrawer(type, { countries: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selections.selectedCountries.length > 0
          ? `${selections.selectedCountries.length} countries selected`
          : "Select Countries"}
      </Button>

      {/* Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { countries: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Select Countries
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { countries: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search */}
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

        {/* Select All */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={async () => {
              const updated = allSelected
                ? []
                : sortedCountries.map((c) => c.name);
              await handleInternationalCountrySelection(updated, type);
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Countries
          </Typography>
        </Box>

        {/* Country List */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
            }}
          >
            {sortedCountries
              .filter((country) =>
                country.name
                  .toLowerCase()
                  .includes(searchFilters.countries.toLowerCase())
              )
              .map((country) => {
                const isSelected = selections.selectedCountries.includes(
                  country.name
                );
                return (
                  <FormControlLabel
                    key={`country-${country.name}`}
                    control={
                      <Checkbox
                        checked={isSelected}
                        onChange={async () => {
                          const updated = isSelected
                            ? selections.selectedCountries.filter(
                                (c) => c !== country.name
                              )
                            : [
                                ...selections.selectedCountries,
                                country.name,
                              ];
                          await handleInternationalCountrySelection(
                            updated,
                            type
                          );
                        }}
                      />
                    }
                    label={country.name}
                  />
                );
              })}
          </Box>
        </Box>
      </Drawer>

      {/* Accordion: Selected Countries */}
      {selections.selectedCountries.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Countries (
                {selections.selectedCountries.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                      if (isEditing) {
                        const updated = selections.selectedCountries.filter(
                          (_, i) => i !== index
                        );
                        await handleInternationalCountrySelection(
                          updated,
                          type
                        );
                      }
                    }}
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

// International State Drawer Component
const InternationalStateDrawer = ({
  type,
  selections,
  drawerOpen,
  statesData,
  searchFilters,
  handleInternationalStateSelection,
  handleSelectAllStates,
  handleSearchChange,
  toggleDrawer,
  isEditing,
  removeLocationItems
}) => {
  if (selections.selectedCountries.length === 0) return null;

  // Group selected states by country
  const statesByCountry = selections.selectedStates;

  // Calculate total available states
  const totalStates = selections.selectedCountries.reduce(
    (total, country) => {
      const states = statesData[country] || [];
      return total + states.length;
    },
    0
  );

  const selectedCount = Object.values(statesByCountry).reduce(
    (acc, states) => acc + states.length,
    0
  );

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { intStates: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selectedCount > 0
          ? `${selectedCount} states selected`
          : "Select States"}
      </Button>

      {/* Drawer for State Selection */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { intStates: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
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
            sx={{ color: "#ff9800" }}
          >
            Select States
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { intStates: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search Field */}
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

        {/* Select All */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={selectedCount > 0 && selectedCount === totalStates}
            indeterminate={selectedCount > 0 && selectedCount < totalStates}
            onChange={() => {
              selections.selectedCountries.forEach((country) => {
                const states = (statesData[country] || []).map(
                  (s) => s.name
                );
                handleSelectAllStates(
                  country,
                  states,
                  selectedCount !== totalStates,
                  type
                );
              });
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All States
          </Typography>
        </Box>

        {/* State Checkboxes */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {selections.selectedCountries.map((country) => {
            const allStates = statesData[country] || [];
            const filteredStates = allStates
              .filter((s) =>
                s.name
                  .toLowerCase()
                  .includes(searchFilters.intStates.toLowerCase())
              )
              .sort((a, b) => a.name.localeCompare(b.name));

            if (filteredStates.length === 0) return null;

            const selectedStates = statesByCountry[country] || [];
            const allSelected = filteredStates.every((s) =>
              selectedStates.includes(s.name)
            );

            return (
              <Box key={`states-section-${country}`} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={
                      selectedStates.length > 0 && !allSelected
                    }
                    onChange={() => {
                      const stateNames = filteredStates.map((s) => s.name);
                      handleSelectAllStates(
                        country,
                        stateNames,
                        !allSelected,
                        type
                      );
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "orange", ml: 1 }}
                  >
                    {country}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 1,
                    ml: 4,
                  }}
                >
                  {filteredStates.map((state) => {
                    const isSelected = selectedStates.includes(state.name);
                    return (
                      <FormControlLabel
                        key={`state-${country}-${state.name}`}
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
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Drawer>

      {/* Accordion for Selected States */}
      {selectedCount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected States ({selectedCount})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(statesByCountry).map(([country, states]) => (
                <Box key={`selected-states-${country}`} sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "orange", mb: 1 }}
                  >
                    {country}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 1,
                      ml: 2,
                    }}
                  >
                    {states.map((state, index) => (
                      <Chip
                        key={`selected-state-${country}-${state}-${index}`}
                        label={state}
                        onDelete={() => {
                          if (isEditing) {
                            // Find the index of this state in the selections
                            const countryStates = selections.selectedStates[country] || [];
                            const stateIndex = countryStates.indexOf(state);
                            if (stateIndex !== -1) {
                              // Calculate the global index for removal
                              const globalIndex = Object.keys(selections.selectedStates)
                                .filter(c => c !== country)
                                .reduce((acc, c) => acc + selections.selectedStates[c].length, 0) + stateIndex;
                              removeLocationItems(type, "international", "state", globalIndex);
                            }
                          }
                        }}
                        variant="outlined"
                        color="success"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

// International City Drawer Component
const InternationalCityDrawer = ({
  type,
  selections,
  drawerOpen,
  citiesData,
  searchFilters,
  handleInternationalCitySelection,
  handleSelectAllStateCities,
  handleSearchChange,
  toggleDrawer,
  isEditing,
  removeLocationItems
}) => {
  if (Object.keys(selections.selectedStates).length === 0) return null;

  // Calculate total cities
  const totalCities = Object.entries(selections.selectedStates).reduce(
    (total, [country, states]) =>
      total +
      states.reduce((acc, state) => {
        const stateKey = `${country}-${state}`;
        const cities = citiesData[stateKey] || [];
        return acc + cities.length;
      }, 0),
    0
  );

  const selectedCityCount = Object.values(selections.selectedCities).flat()
    .length;

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {/* Trigger Button */}
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { intCities: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selectedCityCount > 0
          ? `${selectedCityCount} cities selected`
          : "Select Cities"}
      </Button>

      {/* Drawer UI */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { intCities: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
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
            sx={{ color: "#ff9800" }}
          >
            Select Cities
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => toggleDrawer(type, { intCities: false })}
          >
            Done
          </Button>
        </Box>

        {/* Search */}
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

        {/* Select All Cities */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={
              selectedCityCount > 0 && selectedCityCount === totalCities
            }
            indeterminate={
              selectedCityCount > 0 && selectedCityCount < totalCities
            }
            onChange={() => {
              const shouldSelectAll = selectedCityCount !== totalCities;

              Object.entries(selections.selectedStates).forEach(
                ([country, states]) => {
                  states.forEach((state) => {
                    const stateKey = `${country}-${state}`;
                    const cities = citiesData[stateKey] || [];
                    handleSelectAllStateCities(
                      country,
                      state,
                      cities,
                      shouldSelectAll,
                      type
                    );
                  });
                }
              );
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Cities
          </Typography>
        </Box>

        {/* Country / State Sections */}
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {Object.entries(selections.selectedStates).map(
            ([country, states]) =>
              states.map((state) => {
                const stateKey = `${country}-${state}`;
                const cities = citiesData[stateKey] || [];

                const filteredCities = cities
                  .filter((city) =>
                    city
                      .toLowerCase()
                      .includes(searchFilters.intCities.toLowerCase())
                  )
                  .sort((a, b) => a.localeCompare(b));

                const selectedCities =
                  selections.selectedCities[stateKey] || [];
                const allSelected = filteredCities.every((city) =>
                  selectedCities.includes(city)
                );

                if (filteredCities.length === 0) return null;

                return (
                  <Box key={`cities-section-${stateKey}`} sx={{ mb: 4 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Checkbox
                        checked={allSelected}
                        indeterminate={
                          selectedCities.length > 0 && !allSelected
                        }
                        onChange={() =>
                          handleSelectAllStateCities(
                            country,
                            state,
                            filteredCities,
                            !allSelected,
                            type
                          )
                        }
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "orange", ml: 1 }}
                      >
                        {country} - {state}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: 1,
                        ml: 4,
                      }}
                    >
                      {filteredCities.map((city) => {
                        const isSelected = selectedCities.includes(city);
                        return (
                          <FormControlLabel
                            key={`city-${stateKey}-${city}`}
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
                        );
                      })}
                    </Box>
                  </Box>
                );
              })
          )}
        </Box>
      </Drawer>

      {/* Accordion for Selected Cities */}
      {selectedCityCount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Cities ({selectedCityCount})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(selections.selectedCities).map(
                ([stateKey, cities]) => {
                  const [country, state] = stateKey.split("-");
                  return (
                    <Box key={`selected-cities-${stateKey}`} sx={{ mb: 4 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "orange", mb: 1 }}
                      >
                        {country} - {state}
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: 1,
                          ml: 2,
                        }}
                      >
                        {cities.map((city, index) => (
                          <Chip
                            key={`selected-city-${stateKey}-${city}-${index}`}
                            label={city}
                            onDelete={() => {
                              if (isEditing) {
                                // Find the index of this city in the selections
                                const cityIndex = index;
                                // Calculate the global index for removal
                                const globalIndex = Object.keys(selections.selectedCities)
                                  .filter(key => key !== stateKey)
                                  .reduce((acc, key) => acc + selections.selectedCities[key].length, 0) + cityIndex;
                                removeLocationItems(type, "international", "city", globalIndex);
                              }
                            }}
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
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default ExpansionLocationEdit; 