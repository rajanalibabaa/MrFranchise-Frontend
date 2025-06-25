import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, RadioGroup, FormControlLabel, Radio, Button, 
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Divider, FormGroup, Backdrop, CircularProgress, IconButton, Snackbar, Alert,
  TextField, Chip, List, ListItem, ListItemButton, Drawer, Checkbox, ListItemText
} from '@mui/material';
import axios from 'axios';
import { X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { FixedSizeList } from 'react-window';
import debounce from 'lodash.debounce';

// Cache for API responses
const apiCache = {
  domestic: null,
  countries: null,
  cities: {}
};

// Virtualized list item renderer
const VirtualizedListItem = ({ data, index, style }) => {
  const { items, selectedItems, handleToggle, type } = data;
  const item = items[index];
  
  return (
    <ListItem style={style} key={`${type}-${item.id || item}`} disablePadding>
      <ListItemButton
        role={undefined}
        onClick={() => handleToggle(item)}
        dense
      >
        <Checkbox
          edge="start"
          checked={selectedItems.includes(item.name || item)}
          tabIndex={-1}
          disableRipple
        />
        <ListItemText primary={item.name || item} />
      </ListItemButton>
    </ListItem>
  );
};

function BrandExpansionLocationDetails({ onChange }) {
  const { enqueueSnackbar } = useSnackbar();

  // Location type state
  const [locationType, setLocationType] = useState("domestic");
  const [currentOutletLocationType, setCurrentOutletLocationType] = useState("domestic");
  
  // Domestic selections for expansion locations
  const [domesticSelections, setDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
    selectedCities: [],
    states: [],
    districts: [],
    cities: []
  });
  
  // International selections for expansion locations
  const [internationalSelections, setInternationalSelections] = useState({
    selectedCountries: [],
    selectedCities: [],
    countries: [],
    cities: []
  });

  // Current outlet selections
  const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
    selectedCities: [],
    states: [],
    districts: [],
    cities: []
  });
  
  const [currentInternationalSelections, setCurrentInternationalSelections] = useState({
    selectedCountries: [],
    selectedCities: [],
    countries: [],
    cities: []
  });

  // Location data
  const [statesData, setStatesData] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [internationalCities, setInternationalCities] = useState({});
  const [currentInternationalCities, setCurrentInternationalCities] = useState({});

  const [loading, setLoading] = useState({
    states: false,
    countries: false,
    intCities: false,
    currentIntCities: false,
    formSubmit: false
  });

  const [isInternationalExpansion, setIsInternationalExpansion] = useState(null);
  const [error, setError] = useState(null);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState({
    states: false,
    districts: false,
    cities: false,
    countries: false,
    intCities: false
  });

  // Collapse states for current locations
  const [currentDrawerOpen, setCurrentDrawerOpen] = useState({
    states: false,
    districts: false,
    cities: false,
    countries: false,
    intCities: false
  });

  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    states: '',
    districts: '',
    cities: '',
    countries: '',
    intCities: ''
  });

  // Initialize form data structure
  const [formData, setFormData] = useState({
    isInternationalExpansion: null,
    currentOutletLocations: {
      domestic: {
        states: [],
        districts: [],
        cities: []
      },
      international: {
        countries: [],
        cities: []
      }
    },
    expansionLocations: {
      domestic: {
        states: [],
        districts: [],
        cities: []
      },
      international: {
        countries: [],
        cities: []
      }
    }
  });

  // Debounced search functions
  const handleSearchChange = useCallback(debounce((type, value) => {
    setSearchFilters(prev => ({ ...prev, [type]: value.toLowerCase() }));
  }, 300), []);

  // Toggle drawer
  const toggleDrawer = useCallback((type, open) => {
    if (type === 'current') {
      setCurrentDrawerOpen(prev => ({ ...prev, ...open }));
    } else {
      setDrawerOpen(prev => ({ ...prev, ...open }));
    }
  }, []);

  // Memoized sorted and filtered states
  const sortedStates = useMemo(() => {
    return states
      .filter(state => state.name.toLowerCase().includes(searchFilters.states))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [states, searchFilters.states]);

  // Memoized sorted and filtered countries
  const sortedCountries = useMemo(() => {
    return countries
      .filter(country => country.name.toLowerCase().includes(searchFilters.countries))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, searchFilters.countries]);

  // Get districts for selected states
  const getDistrictsForStates = useCallback((stateNames) => {
    const districts = [];
    stateNames.forEach(stateName => {
      const state = statesData.find(s => s.name === stateName);
      if (state) {
        districts.push(...state.districts);
      }
    });
    return [...new Set(districts)]; // Remove duplicates
  }, [statesData]);

  // Get cities for selected districts
  const getCitiesForDistricts = useCallback((stateNames, districtNames) => {
    const cities = [];
    stateNames.forEach(stateName => {
      const state = statesData.find(s => s.name === stateName);
      if (!state) return;
      
      districtNames.forEach(districtName => {
        const districtCities = state.cities
          .filter(city => city.district === districtName)
          .map(city => city.name);
        cities.push(...districtCities);
      });
    });
    return [...new Set(cities)]; // Remove duplicates
  }, [statesData]);

  // Fetch domestic data (Indian states, districts, cities) with caching
  const fetchDomesticData = useCallback(async () => {
    if (apiCache.domestic) {
      setStatesData(apiCache.domestic);
      setStates(
        apiCache.domestic
          .map(state => ({ id: state.iso2, name: state.name }))
      );
      return;
    }

    setLoading(prev => ({ ...prev, states: true }));
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
      );
      apiCache.domestic = response.data;
      setStatesData(response.data);
      setStates(
        response.data
          .map(state => ({ id: state.iso2, name: state.name }))
      );
    } catch (error) {
      console.error("Error fetching domestic data:", error);
      setError("Failed to load domestic locations. Please try again later.");
      enqueueSnackbar("Failed to load domestic locations", { variant: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  }, [enqueueSnackbar]);

  // Fetch international countries with caching
  const fetchCountries = useCallback(async () => {
    if (apiCache.countries) {
      setCountries(apiCache.countries);
      return;
    }

    setLoading(prev => ({ ...prev, countries: true }));
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries"
      );
      const countryData = response.data.data
        .map(country => ({
          id: country.iso2,
          name: country.country
        }));
      
      apiCache.countries = countryData;
      setCountries(countryData);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to load countries. Please try again later.");
      enqueueSnackbar("Failed to load countries", { variant: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, countries: false }));
    }
  }, [enqueueSnackbar]);

  // Debounced version of getCitiesByCountry
  const debouncedGetCitiesByCountry = useCallback(debounce(async (countryName, callback) => {
    if (apiCache.cities[countryName]) {
      callback(apiCache.cities[countryName]);
      return;
    }

    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        { country: countryName }
      );
      const cities = response.data.data || [];
      apiCache.cities[countryName] = cities;
      callback(cities);
    } catch (error) {
      console.error("Error fetching cities for country:", countryName, error);
      enqueueSnackbar(`Failed to load cities for ${countryName}`, { variant: 'error' });
      callback([]);
    }
  }, 500), [enqueueSnackbar]);

  // Fetch domestic data on mount
  useEffect(() => {
    fetchDomesticData();
  }, [fetchDomesticData]);

  // Fetch international countries on mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Call onChange whenever formData changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Handle international expansion selection
  const handleInternationalExpansionChange = useCallback((value) => {
    const newValue = value === isInternationalExpansion ? null : value;
    setIsInternationalExpansion(newValue);
    setFormData(prev => ({
      ...prev,
      isInternationalExpansion: newValue
    }));
  }, [isInternationalExpansion]);

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
  const addDomesticLocations = useCallback((type) => {
    setLoading(prev => ({ ...prev, formSubmit: true }));
    try {
      const selections = type === 'current' ? currentDomesticSelections : domesticSelections;
      const locationKey = type === 'current' ? 'currentOutletLocations' : 'expansionLocations';

      setFormData(prev => {
        const newData = {
          ...prev,
          [locationKey]: {
            ...prev[locationKey],
            domestic: {
              states: [...new Set([...prev[locationKey].domestic.states, ...selections.states])],
              districts: [...new Set([...prev[locationKey].domestic.districts, ...selections.districts])],
              cities: [...new Set([...prev[locationKey].domestic.cities, ...selections.cities])]
            }
          }
        };
        return newData;
      });

      if (type === 'current') {
        setCurrentDomesticSelections(prev => ({
          ...prev,
          states: [],
          districts: [],
          cities: [],
          selectedStates: [],
          selectedDistricts: [],
          selectedCities: []
        }));
      } else {
        setDomesticSelections(prev => ({
          ...prev,
          states: [],
          districts: [],
          cities: [],
          selectedStates: [],
          selectedDistricts: [],
          selectedCities: []
        }));
      }
    } catch (error) {
      console.error("Error adding domestic locations:", error);
      setError("Failed to add locations. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, formSubmit: false }));
    }
  }, [currentDomesticSelections, domesticSelections]);

  // Add international locations to form data
  const addInternationalLocations = useCallback((type) => {
    setLoading(prev => ({ ...prev, formSubmit: true }));
    try {
      const selections = type === 'current' ? currentInternationalSelections : internationalSelections;
      const locationKey = type === 'current' ? 'currentOutletLocations' : 'expansionLocations';

      setFormData(prev => {
        const newData = {
          ...prev,
          [locationKey]: {
            ...prev[locationKey],
            international: {
              countries: [...new Set([...prev[locationKey].international.countries, ...selections.countries])],
              cities: [...new Set([...prev[locationKey].international.cities, ...selections.cities])]
            }
          }
        };
        return newData;
      });

      if (type === 'current') {
        setCurrentInternationalSelections(prev => ({
          ...prev,
          countries: [],
          cities: [],
          selectedCountries: [],
          selectedCities: []
        }));
      } else {
        setInternationalSelections(prev => ({
          ...prev,
          countries: [],
          cities: [],
          selectedCountries: [],
          selectedCities: []
        }));
      }
    } catch (error) {
      console.error("Error adding international locations:", error);
      setError("Failed to add locations. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, formSubmit: false }));
    }
  }, [currentInternationalSelections, internationalSelections]);

  // Remove location items
  const removeLocationItems = useCallback((type, locationType, field, index) => {
    setFormData(prev => {
      const newData = { ...prev };
      const locationArray = [...newData[type][locationType][field]];
      
      // If removing a state, also remove associated districts and cities
      if (field === 'states') {
        const stateToRemove = locationArray[index];
        
        // Find all districts for this state
        const districtsToRemove = newData[type][locationType].districts
          .filter((_, i) => newData[type][locationType].states[i] === stateToRemove);
          
        // Find all cities for this state
        const citiesToRemove = newData[type][locationType].cities
          .filter((_, i) => newData[type][locationType].states[i] === stateToRemove);
          
        // Remove all associated districts and cities
        newData[type][locationType].districts = newData[type][locationType].districts
          .filter((_, i) => newData[type][locationType].states[i] !== stateToRemove);
          
        newData[type][locationType].cities = newData[type][locationType].cities
          .filter((_, i) => newData[type][locationType].states[i] !== stateToRemove);
      }
      
      // If removing a district, also remove associated cities
      if (field === 'districts') {
        const districtToRemove = locationArray[index];
        const stateForDistrict = newData[type][locationType].states[index];
        
        newData[type][locationType].cities = newData[type][locationType].cities
          .filter((_, i) => !(
            newData[type][locationType].states[i] === stateForDistrict &&
            newData[type][locationType].districts[i] === districtToRemove
          ));
      }
      
      // For international, if removing a country, remove associated cities
      if (locationType === 'international' && field === 'countries') {
        const countryToRemove = locationArray[index];
        
        newData[type][locationType].cities = newData[type][locationType].cities
          .filter((_, i) => newData[type][locationType].countries[i] !== countryToRemove);
      }
      
      locationArray.splice(index, 1);
      newData[type][locationType][field] = locationArray;
      return newData;
    });
  }, []);

  // Handle domestic state selection
  const handleDomesticStateSelection = useCallback((selectedStates, type) => {
    const setSelections = type === 'current' ? setCurrentDomesticSelections : setDomesticSelections;
    
    setSelections(prev => ({
      ...prev,
      selectedStates,
      selectedDistricts: [],
      selectedCities: [],
      districts: getDistrictsForStates(selectedStates)
    }));
  }, [getDistrictsForStates]);

  // Handle domestic district selection
  const handleDomesticDistrictSelection = useCallback((selectedDistricts, type) => {
    const setSelections = type === 'current' ? setCurrentDomesticSelections : setDomesticSelections;
    const selections = type === 'current' ? currentDomesticSelections : domesticSelections;
    
    setSelections(prev => ({
      ...prev,
      selectedDistricts,
      selectedCities: [],
      cities: getCitiesForDistricts(prev.selectedStates, selectedDistricts)
    }));
  }, [currentDomesticSelections, domesticSelections, getCitiesForDistricts]);

  // Handle domestic city selection
  const handleDomesticCitySelection = useCallback((selectedCities, type) => {
    const setSelections = type === 'current' ? setCurrentDomesticSelections : setDomesticSelections;
    
    setSelections(prev => ({
      ...prev,
      selectedCities
    }));
  }, []);

  // Add domestic location to selection
  const addDomesticLocation = useCallback((type) => {
    const setSelections = type === 'current' ? setCurrentDomesticSelections : setDomesticSelections;
    const selections = type === 'current' ? currentDomesticSelections : domesticSelections;
    
    if (selections.selectedStates.length === 0) {
      enqueueSnackbar("Please select at least one state", { variant: 'warning' });
      return;
    }

    setSelections(prev => ({
      ...prev,
      states: [...prev.states, ...prev.selectedStates],
      districts: [...prev.districts, ...prev.selectedDistricts],
      cities: [...prev.cities, ...prev.selectedCities],
      selectedStates: [],
      selectedDistricts: [],
      selectedCities: []
    }));
  }, [currentDomesticSelections, domesticSelections, enqueueSnackbar]);

  // Handle international country selection
  const handleInternationalCountrySelection = useCallback(async (selectedCountries, type) => {
    const setSelections = type === 'current' ? setCurrentInternationalSelections : setInternationalSelections;
    const setCitiesData = type === 'current' ? setCurrentInternationalCities : setInternationalCities;
    
    setSelections(prev => ({
      ...prev,
      selectedCountries,
      selectedCities: []
    }));

    // Fetch cities for newly selected countries
    const newCitiesData = {};
    for (const country of selectedCountries) {
      if (!apiCache.cities[country]) {
        debouncedGetCitiesByCountry(country, (cities) => {
          setCitiesData(prev => ({ ...prev, [country]: cities }));
        });
      }
    }
  }, [debouncedGetCitiesByCountry]);

  // Handle international city selection
  const handleInternationalCitySelection = useCallback((selectedCities, type) => {
    const setSelections = type === 'current' ? setCurrentInternationalSelections : setInternationalSelections;
    
    setSelections(prev => ({
      ...prev,
      selectedCities
    }));
  }, []);

  // Add international location to selection
  const addInternationalLocation = useCallback((type) => {
    const setSelections = type === 'current' ? setCurrentInternationalSelections : setInternationalSelections;
    const selections = type === 'current' ? currentInternationalSelections : internationalSelections;
    
    if (selections.selectedCountries.length === 0) {
      enqueueSnackbar("Please select at least one country", { variant: 'warning' });
      return;
    }

    setSelections(prev => ({
      ...prev,
      countries: [...prev.countries, ...prev.selectedCountries],
      cities: [...prev.cities, ...prev.selectedCities],
      selectedCountries: [],
      selectedCities: []
    }));
  }, [currentInternationalSelections, internationalSelections, enqueueSnackbar]);

  // Render domestic state selection drawer
  const renderDomesticStateDrawer = useCallback((type) => {
    const selections = type === 'current' ? currentDomesticSelections : domesticSelections;
    const toggle = (open) => toggleDrawer(type, { states: open });

    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: 'space-between' }}
        >
          {selections.selectedStates.length > 0 ? 
            `${selections.selectedStates.length} states selected` : 
            "Select States"}
        </Button>

        <Drawer
          anchor="bottom"
          open={type === 'current' ? currentDrawerOpen.states : drawerOpen.states}
          onClose={() => toggle(false)}
          PaperProps={{ sx: { maxHeight: '60vh', p: 2 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Select States</Typography>
            <Button onClick={() => toggle(false)}>Done</Button>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Search states..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange('states', e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />
            }}
          />
          
          <FixedSizeList
            height={300}
            width="100%"
            itemSize={50}
            itemCount={sortedStates.length}
            itemData={{
              items: sortedStates,
              selectedItems: selections.selectedStates,
              handleToggle: (state) => {
                const currentSelected = type === 'current' ? 
                  currentDomesticSelections.selectedStates : 
                  domesticSelections.selectedStates;
                
                const newSelected = currentSelected.includes(state.name) ?
                  currentSelected.filter(s => s !== state.name) :
                  [...currentSelected, state.name];
                
                handleDomesticStateSelection(newSelected, type);
              },
              type: 'states'
            }}
          >
            {VirtualizedListItem}
          </FixedSizeList>
        </Drawer>

        {selections.selectedStates.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selections.selectedStates.map((state, index) => (
              <Chip
                key={`selected-state-${index}`}
                label={state}
                onDelete={() => {
                  const newSelected = selections.selectedStates.filter((_, i) => i !== index);
                  handleDomesticStateSelection(newSelected, type);
                }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }, [
    sortedStates,
    currentDomesticSelections,
    domesticSelections,
    currentDrawerOpen.states,
    drawerOpen.states,
    handleDomesticStateSelection,
    handleSearchChange
  ]);

  // Render domestic district selection drawer
  const renderDomesticDistrictDrawer = useCallback((type) => {
    const selections = type === 'current' ? currentDomesticSelections : domesticSelections;
    const toggle = (open) => toggleDrawer(type, { districts: open });

    if (selections.selectedStates.length === 0) return null;

    const districts = selections.districts
      .filter(district => district.toLowerCase().includes(searchFilters.districts));

    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: 'space-between' }}
          disabled={selections.selectedStates.length === 0}
        >
          {selections.selectedDistricts.length > 0 ? 
            `${selections.selectedDistricts.length} districts selected` : 
            "Select Districts"}
        </Button>

        <Drawer
          anchor="bottom"
          open={type === 'current' ? currentDrawerOpen.districts : drawerOpen.districts}
          onClose={() => toggle(false)}
          PaperProps={{ sx: { maxHeight: '60vh', p: 2 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Select Districts</Typography>
            <Button onClick={() => toggle(false)}>Done</Button>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Search districts..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange('districts', e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />
            }}
          />
          
          <FixedSizeList
            height={300}
            width="100%"
            itemSize={50}
            itemCount={districts.length}
            itemData={{
              items: districts.map(d => ({ name: d })),
              selectedItems: selections.selectedDistricts,
              handleToggle: (district) => {
                const currentSelected = type === 'current' ? 
                  currentDomesticSelections.selectedDistricts : 
                  domesticSelections.selectedDistricts;
                
                const newSelected = currentSelected.includes(district.name) ?
                  currentSelected.filter(d => d !== district.name) :
                  [...currentSelected, district.name];
                
                handleDomesticDistrictSelection(newSelected, type);
              },
              type: 'districts'
            }}
          >
            {VirtualizedListItem}
          </FixedSizeList>
        </Drawer>

        {selections.selectedDistricts.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selections.selectedDistricts.map((district, index) => (
              <Chip
                key={`selected-district-${index}`}
                label={district}
                onDelete={() => {
                  const newSelected = selections.selectedDistricts.filter((_, i) => i !== index);
                  handleDomesticDistrictSelection(newSelected, type);
                }}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }, [
    currentDomesticSelections,
    domesticSelections,
    currentDrawerOpen.districts,
    drawerOpen.districts,
    handleDomesticDistrictSelection,
    handleSearchChange,
    searchFilters.districts
  ]);

  // Render domestic city selection drawer
  const renderDomesticCityDrawer = useCallback((type) => {
    const selections = type === 'current' ? currentDomesticSelections : domesticSelections;
    const toggle = (open) => toggleDrawer(type, { cities: open });

    if (selections.selectedDistricts.length === 0) return null;

    const cities = selections.cities
      .filter(city => city.toLowerCase().includes(searchFilters.cities));

    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: 'space-between' }}
          disabled={selections.selectedDistricts.length === 0}
        >
          {selections.selectedCities.length > 0 ? 
            `${selections.selectedCities.length} cities selected` : 
            "Select Cities"}
        </Button>

        <Drawer
          anchor="bottom"
          open={type === 'current' ? currentDrawerOpen.cities : drawerOpen.cities}
          onClose={() => toggle(false)}
          PaperProps={{ sx: { maxHeight: '60vh', p: 2 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Select Cities</Typography>
            <Button onClick={() => toggle(false)}>Done</Button>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Search cities..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange('cities', e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />
            }}
          />
          
          <FixedSizeList
            height={300}
            width="100%"
            itemSize={50}
            itemCount={cities.length}
            itemData={{
              items: cities.map(c => ({ name: c })),
              selectedItems: selections.selectedCities,
              handleToggle: (city) => {
                const currentSelected = type === 'current' ? 
                  currentDomesticSelections.selectedCities : 
                  domesticSelections.selectedCities;
                
                const newSelected = currentSelected.includes(city.name) ?
                  currentSelected.filter(c => c !== city.name) :
                  [...currentSelected, city.name];
                
                handleDomesticCitySelection(newSelected, type);
              },
              type: 'cities'
            }}
          >
            {VirtualizedListItem}
          </FixedSizeList>
        </Drawer>

        {selections.selectedCities.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selections.selectedCities.map((city, index) => (
              <Chip
                key={`selected-city-${index}`}
                label={city}
                onDelete={() => {
                  const newSelected = selections.selectedCities.filter((_, i) => i !== index);
                  handleDomesticCitySelection(newSelected, type);
                }}
                color="success"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }, [
    currentDomesticSelections,
    domesticSelections,
    currentDrawerOpen.cities,
    drawerOpen.cities,
    handleDomesticCitySelection,
    handleSearchChange,
    searchFilters.cities
  ]);

  // Render international country selection drawer
  const renderInternationalCountryDrawer = useCallback((type) => {
    const selections = type === 'current' ? currentInternationalSelections : internationalSelections;
    const toggle = (open) => toggleDrawer(type, { countries: open });

    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: 'space-between' }}
        >
          {selections.selectedCountries.length > 0 ? 
            `${selections.selectedCountries.length} countries selected` : 
            "Select Countries"}
        </Button>

        <Drawer
          anchor="bottom"
          open={type === 'current' ? currentDrawerOpen.countries : drawerOpen.countries}
          onClose={() => toggle(false)}
          PaperProps={{ sx: { maxHeight: '60vh', p: 2 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Select Countries</Typography>
            <Button onClick={() => toggle(false)}>Done</Button>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Search countries..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange('countries', e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />
            }}
          />
          
          <FixedSizeList
            height={300}
            width="100%"
            itemSize={50}
            itemCount={sortedCountries.length}
            itemData={{
              items: sortedCountries,
              selectedItems: selections.selectedCountries,
              handleToggle: async (country) => {
                const currentSelected = type === 'current' ? 
                  currentInternationalSelections.selectedCountries : 
                  internationalSelections.selectedCountries;
                
                const newSelected = currentSelected.includes(country.name) ?
                  currentSelected.filter(c => c !== country.name) :
                  [...currentSelected, country.name];
                
                await handleInternationalCountrySelection(newSelected, type);
              },
              type: 'countries'
            }}
          >
            {VirtualizedListItem}
          </FixedSizeList>
        </Drawer>

        {selections.selectedCountries.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selections.selectedCountries.map((country, index) => (
              <Chip
                key={`selected-country-${index}`}
                label={country}
                onDelete={async () => {
                  const newSelected = selections.selectedCountries.filter((_, i) => i !== index);
                  await handleInternationalCountrySelection(newSelected, type);
                }}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }, [
    sortedCountries,
    currentInternationalSelections,
    internationalSelections,
    currentDrawerOpen.countries,
    drawerOpen.countries,
    handleInternationalCountrySelection,
    handleSearchChange
  ]);

  // Render international city selection drawer
  const renderInternationalCityDrawer = useCallback((type) => {
    const selections = type === 'current' ? currentInternationalSelections : internationalSelections;
    const citiesData = type === 'current' ? currentInternationalCities : internationalCities;
    const toggle = (open) => toggleDrawer(type, { intCities: open });

    if (selections.selectedCountries.length === 0) return null;

    // Get cities for all selected countries
    const cities = [];
    selections.selectedCountries.forEach(country => {
      if (citiesData[country]) {
        cities.push(...citiesData[country]);
      }
    });

    const filteredCities = cities
      .filter(city => city.toLowerCase().includes(searchFilters.intCities));

    return (
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => toggle(true)}
          endIcon={<ChevronDown />}
          sx={{ justifyContent: 'space-between' }}
          disabled={selections.selectedCountries.length === 0}
        >
          {selections.selectedCities.length > 0 ? 
            `${selections.selectedCities.length} cities selected` : 
            "Select Cities"}
        </Button>

        <Drawer
          anchor="bottom"
          open={type === 'current' ? currentDrawerOpen.intCities : drawerOpen.intCities}
          onClose={() => toggle(false)}
          PaperProps={{ sx: { maxHeight: '60vh', p: 2 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Select Cities</Typography>
            <Button onClick={() => toggle(false)}>Done</Button>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Search cities..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
            onChange={(e) => handleSearchChange('intCities', e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />
            }}
          />
          
          <FixedSizeList
            height={300}
            width="100%"
            itemSize={50}
            itemCount={filteredCities.length}
            itemData={{
              items: filteredCities.map(c => ({ name: c })),
              selectedItems: selections.selectedCities,
              handleToggle: (city) => {
// ...existing code...
                const currentSelected = type === 'current' ?
                  currentInternationalSelections.selectedCities :
                  internationalSelections.selectedCities;

                const newSelected = currentSelected.includes(city.name) ?
                  currentSelected.filter(c => c !== city.name) :
                  [...currentSelected, city.name];

                handleInternationalCitySelection(newSelected, type);
              },
              type: 'intCities'
            }}
          >
            {VirtualizedListItem}
          </FixedSizeList>
        </Drawer>

        {selections.selectedCities.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selections.selectedCities.map((city, index) => (
              <Chip
                key={`selected-int-city-${index}`}
                label={city}
                onDelete={() => {
                  const newSelected = selections.selectedCities.filter((_, i) => i !== index);
                  handleInternationalCitySelection(newSelected, type);
                }}
                color="success"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }, [
    currentInternationalSelections,
    internationalSelections,
    currentInternationalCities,
    internationalCities,
    currentDrawerOpen.intCities,
    drawerOpen.intCities,
    handleInternationalCitySelection,
    handleSearchChange,
    searchFilters.intCities
  ]);

  // Main render
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Brand Expansion Location Details
      </Typography>

      {/* International Expansion Toggle */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Is your brand expanding internationally?</Typography>
        <RadioGroup
          row
          value={isInternationalExpansion === null ? '' : isInternationalExpansion}
          onChange={e => handleInternationalExpansionChange(e.target.value === 'true')}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </Box>

      {/* Current Outlet Locations */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Current Outlet Locations
      </Typography>
      <RadioGroup
        row
        value={currentOutletLocationType}
        onChange={handleCurrentOutletLocationTypeChange}
      >
        <FormControlLabel value="domestic" control={<Radio />} label="Domestic" />
        <FormControlLabel value="international" control={<Radio />} label="International" />
      </RadioGroup>

      {currentOutletLocationType === 'domestic' ? (
        <>
          {renderDomesticStateDrawer('current')}
          {renderDomesticDistrictDrawer('current')}
          {renderDomesticCityDrawer('current')}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => addDomesticLocation('current')}
            disabled={loading.formSubmit}
          >
            Add Location
          </Button>
          {/* Display selected locations */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Locations:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.currentOutletLocations.domestic.states.map((state, idx) => (
                <Chip
                  key={`current-state-${idx}`}
                  label={state}
                  onDelete={() => removeLocationItems('currentOutletLocations', 'domestic', 'states', idx)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {formData.currentOutletLocations.domestic.districts.map((district, idx) => (
                <Chip
                  key={`current-district-${idx}`}
                  label={district}
                  onDelete={() => removeLocationItems('currentOutletLocations', 'domestic', 'districts', idx)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
              {formData.currentOutletLocations.domestic.cities.map((city, idx) => (
                <Chip
                  key={`current-city-${idx}`}
                  label={city}
                  onDelete={() => removeLocationItems('currentOutletLocations', 'domestic', 'cities', idx)}
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </>
      ) : (
        <>
          {renderInternationalCountryDrawer('current')}
          {renderInternationalCityDrawer('current')}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => addInternationalLocation('current')}
            disabled={loading.formSubmit}
          >
            Add Location
          </Button>
          {/* Display selected locations */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Locations:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.currentOutletLocations.international.countries.map((country, idx) => (
                <Chip
                  key={`current-country-${idx}`}
                  label={country}
                  onDelete={() => removeLocationItems('currentOutletLocations', 'international', 'countries', idx)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {formData.currentOutletLocations.international.cities.map((city, idx) => (
                <Chip
                  key={`current-int-city-${idx}`}
                  label={city}
                  onDelete={() => removeLocationItems('currentOutletLocations', 'international', 'cities', idx)}
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* Expansion Locations */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Expansion Locations
      </Typography>
      <RadioGroup
        row
        value={locationType}
        onChange={handleLocationTypeChange}
      >
        <FormControlLabel value="domestic" control={<Radio />} label="Domestic" />
        <FormControlLabel value="international" control={<Radio />} label="International" />
      </RadioGroup>

      {locationType === 'domestic' ? (
        <>
          {renderDomesticStateDrawer('expansion')}
          {renderDomesticDistrictDrawer('expansion')}
          {renderDomesticCityDrawer('expansion')}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => addDomesticLocation('expansion')}
            disabled={loading.formSubmit}
          >
            Add Location
          </Button>
          {/* Display selected locations */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Locations:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.expansionLocations.domestic.states.map((state, idx) => (
                <Chip
                  key={`expansion-state-${idx}`}
                  label={state}
                  onDelete={() => removeLocationItems('expansionLocations', 'domestic', 'states', idx)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {formData.expansionLocations.domestic.districts.map((district, idx) => (
                <Chip
                  key={`expansion-district-${idx}`}
                  label={district}
                  onDelete={() => removeLocationItems('expansionLocations', 'domestic', 'districts', idx)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
              {formData.expansionLocations.domestic.cities.map((city, idx) => (
                <Chip
                  key={`expansion-city-${idx}`}
                  label={city}
                  onDelete={() => removeLocationItems('expansionLocations', 'domestic', 'cities', idx)}
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </>
      ) : (
        <>
          {renderInternationalCountryDrawer('expansion')}
          {renderInternationalCityDrawer('expansion')}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => addInternationalLocation('expansion')}
            disabled={loading.formSubmit}
          >
            Add Location
          </Button>
          {/* Display selected locations */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Selected Locations:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.expansionLocations.international.countries.map((country, idx) => (
                <Chip
                  key={`expansion-country-${idx}`}
                  label={country}
                  onDelete={() => removeLocationItems('expansionLocations', 'international', 'countries', idx)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {formData.expansionLocations.international.cities.map((city, idx) => (
                <Chip
                  key={`expansion-int-city-${idx}`}
                  label={city}
                  onDelete={() => removeLocationItems('expansionLocations', 'international', 'cities', idx)}
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* Loading and Error Handling */}
      <Backdrop open={loading.states || loading.countries || loading.formSubmit} sx={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BrandExpansionLocationDetails;                 