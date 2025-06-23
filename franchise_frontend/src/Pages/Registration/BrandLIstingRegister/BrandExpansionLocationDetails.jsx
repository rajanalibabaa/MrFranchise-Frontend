import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Grid, Box, Typography, RadioGroup, FormControlLabel, Radio, Button, Checkbox, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Divider, FormGroup, Backdrop, CircularProgress, IconButton, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

// Cache for API responses
const apiCache = {
  domestic: null,
  countries: null,
  cities: {}
};

function BrandExpansionLocationDetails({ data = {}, errors = {}, onChange }) {
  const { enqueueSnackbar } = useSnackbar();

  // Location type state
  const [locationType, setLocationType] = useState("domestic");
  const [currentOutletLocationType, setCurrentOutletLocationType] = useState("domestic");
  
  // Domestic selections for expansion locations
  const [domesticSelections, setDomesticSelections] = useState({
    states: [],
    districts: [],
    cities: []
  });
  
  // International selections for expansion locations
  const [internationalSelections, setInternationalSelections] = useState({
    countries: [],
    cities: []
  });

  // Current outlet selections
  const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
    states: [],
    districts: [],
    cities: []
  });
  
  const [currentInternationalSelections, setCurrentInternationalSelections] = useState({
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
  console.log("BrandExpansionLocationDetails data:",error);

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

  // Memoized sorted states
  const sortedStates = useMemo(() => {
    return states.sort((a, b) => a.name.localeCompare(b.name));
  }, [states]);

  // Memoized sorted countries
  const sortedCountries = useMemo(() => {
    return countries.sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);

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

  // Get cities by country with caching
  const getCitiesByCountry = useCallback(async (countryName) => {
    if (apiCache.cities[countryName]) {
      return apiCache.cities[countryName];
    }

    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        { country: countryName }
      );
      const cities = response.data.data || [];
      apiCache.cities[countryName] = cities;
      return cities;
    } catch (error) {
      console.error("Error fetching cities for country:", countryName, error);
      enqueueSnackbar(`Failed to load cities for ${countryName}`, { variant: 'error' });
      return [];
    }
  }, [enqueueSnackbar]);

  // Fetch domestic data on mount
  useEffect(() => {
    fetchDomesticData();
  }, [fetchDomesticData]);

  // Fetch international countries on mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Fetch international cities when countries are selected
  useEffect(() => {
    const fetchInternationalCities = async () => {
      if (internationalSelections.countries.length > 0) {
        setLoading(prev => ({ ...prev, intCities: true }));
        try {
          const citiesByCountry = {};
          
          await Promise.all(
            internationalSelections.countries.map(async (country) => {
              const cities = await getCitiesByCountry(country);
              citiesByCountry[country] = cities;
            })
          );
          
          setInternationalCities(citiesByCountry);
        } catch (error) {
          console.error("Error fetching international cities:", error);
          setError("Failed to load some cities. Please try again.");
        } finally {
          setLoading(prev => ({ ...prev, intCities: false }));
        }
      }
    };

    fetchInternationalCities();
  }, [internationalSelections.countries, getCitiesByCountry]);

  // Fetch current international cities when countries are selected
  useEffect(() => {
    const fetchCurrentInternationalCities = async () => {
      if (currentInternationalSelections.countries.length > 0) {
        setLoading(prev => ({ ...prev, currentIntCities: true }));
        try {
          const citiesByCountry = {};
          
          await Promise.all(
            currentInternationalSelections.countries.map(async (country) => {
              const cities = await getCitiesByCountry(country);
              citiesByCountry[country] = cities;
            })
          );
          
          setCurrentInternationalCities(citiesByCountry);
        } catch (error) {
          console.error("Error fetching international cities:", error);
          setError("Failed to load some cities. Please try again.");
        } finally {
          setLoading(prev => ({ ...prev, currentIntCities: false }));
        }
      }
    };

    fetchCurrentInternationalCities();
  }, [currentInternationalSelections.countries, getCitiesByCountry]);

  // Call onChange whenever formData changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData]);

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
    if (type === "domestic") {
      setDomesticSelections({
        states: [],
        districts: [],
        cities: []
      });
    } else {
      setInternationalSelections({
        countries: [],
        cities: []
      });
    }
  }, []);

  // Handle current outlet location type change
  const handleCurrentOutletLocationTypeChange = useCallback((e) => {
    const type = e.target.value;
    setCurrentOutletLocationType(type);
    if (type === "domestic") {
      setCurrentDomesticSelections({
        states: [],
        districts: [],
        cities: []
      });
    } else {
      setCurrentInternationalSelections({
        countries: [],
        cities: []
      });
    }
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
        setCurrentDomesticSelections({
          states: [],
          districts: [],
          cities: []
        });
      } else {
        setDomesticSelections({
          states: [],
          districts: [],
          cities: []
        });
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
        setCurrentInternationalSelections({
          countries: [],
          cities: []
        });
      } else {
        setInternationalSelections({
          countries: [],
          cities: []
        });
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
      locationArray.splice(index, 1);
      newData[type][locationType][field] = locationArray;
      return newData;
    });
  }, []);

  // Render domestic location selection UI
  const renderDomesticLocationSelection = useCallback((selections, setSelections, type) => {
    if (loading.states) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
          <Typography variant="body1" ml={2}>Loading states...</Typography>
        </Box>
      );
    }
    return (
      <Box>
        <Typography variant="h5" color='#ff9800' m={2}>
          Select States
        </Typography>
        <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(7, 1fr)' }} sx={{ mb: 2 }}>
          {sortedStates.map((state) => (
            <Grid item xs={12} sm={6} md={4} key={`state-${state.id}-${state.name}`}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.states.includes(state.name)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelections(prev => ({
                        ...prev,
                        states: isChecked 
                          ? [...prev.states, state.name]
                          : prev.states.filter(s => s !== state.name),
                        districts: [],
                        cities: []
                      }));
                    }}

                    color="primary"
                    sx={{
              transform: 'scale(0.8)', // ⬅️ Smaller checkbox
              padding: '2px' // ⬅️ Less padding
            }}
                  />
                }
                label={state.name}
 sx={{
          fontSize: '1rem', // ⬅️ Smaller label text
          '& .MuiFormControlLabel-label': {
            fontSize: '0.8rem'
          }
        }}              />
            </Grid>
          ))}
        </Grid>

        {selections.states.length > 0 && (
          <>
            <Typography variant="h6" color='#ff9800'>
              Select Districts
            </Typography>
            {selections.states.map(state => {
              const stateObj = statesData.find(s => s.name === state);
              if (!stateObj) return null;
              
              return (
                <Box key={`state-container-${state}`} sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#ff9800' }}>
                    Selected State: {state}
                  </Typography>
                  <Grid display={'Grid'} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(8, 1fr)' }} sx={{ mb: 2 }}>
                    {stateObj.districts.map((district, districtIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={`district-${state}-${district}-${districtIndex}`}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selections.districts.includes(district)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSelections(prev => ({
                                  ...prev,
                                  districts: isChecked 
                                    ? [...prev.districts, district]
                                    : prev.districts.filter(d => d !== district),
                                  cities: []
                                }));
                              }}
                              color="primary"
                              sx={{
              transform: 'scale(0.8)', // ⬅️ Smaller checkbox
              padding: '2px' // ⬅️ Less padding
            }}
                            />
                          }
                          label={district}
                           sx={{
          fontSize: '1rem', // ⬅️ Smaller label text
          '& .MuiFormControlLabel-label': {
            fontSize: '0.8rem'
          }
        }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}
          </>
        )}

        {selections.districts.length > 0 && (
          <>
            <Typography variant="h6" color='#ff9800'>
              Select Cities
            </Typography>
            {selections.states.flatMap(state => {
              const stateObj = statesData.find(s => s.name === state);
              if (!stateObj) return [];
              
              return selections.districts.map((district, districtIdx) => {
                const citiesInDistrict = stateObj.cities
                  .filter(city => city.district === district)
                  .map(city => city.name);
                
                if (citiesInDistrict.length === 0) return null;
                
                return (
                  <Box key={`city-container-${state}-${district}-${districtIdx}`} sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#ff9800' }}>
                      Select Cities in - {district} ({state})
                    </Typography>
                    <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(7, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                      {citiesInDistrict.map((city, cityIndex) => (
                        <Grid item xs={12} sm={6} md={4} key={`city-${state}-${district}-${city}-${cityIndex}`}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selections.cities.includes(city)}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  setSelections(prev => ({
                                    ...prev,
                                    cities: isChecked 
                                      ? [...prev.cities, city]
                                      : prev.cities.filter(c => c !== city)
                                  }));
                                }}
                                color="primary"
                                sx={{
              transform: 'scale(0.8)', // ⬅️ Smaller checkbox
              padding: '2px' // ⬅️ Less padding
            }}
                              />
                            }
                            label={city}
                             sx={{
          fontSize: '1rem', // ⬅️ Smaller label text
          '& .MuiFormControlLabel-label': {
            fontSize: '0.8rem'
          }
        }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              });
            })}
          </>
        )}

        {selections.cities.length > 0 && (
          <Button
            variant="contained"
            onClick={() => addDomesticLocations(type)}
            sx={{ mt: 2 }}
            color="primary"
            disabled={loading.formSubmit}
            startIcon={loading.formSubmit ? <CircularProgress size={20} /> : null}
          >
            {loading.formSubmit ? 'Adding...' : `Add Selected Cities (${selections.cities.length})`}
          </Button>
        )}
      </Box>
    );
  }, [addDomesticLocations, loading.states, loading.formSubmit, sortedStates, statesData]);

  // Render international location selection UI
  const renderInternationalLocationSelection = useCallback((selections, setSelections, citiesData, type) => {
    if (loading.countries) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
          <Typography variant="body1" ml={2}>Loading countries...</Typography>
        </Box>
      );
    }

    if ((type === 'current' ? loading.currentIntCities : loading.intCities) && selections.countries.length > 0) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
          <Typography variant="body1" ml={2}>Loading cities...</Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography color='#ff9800' variant="h6">
          Select Countries
        </Typography>
        <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(7, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
          {sortedCountries.map((country) => (
            <Grid item xs={12} sm={6} md={4} key={`country-${country.id}-${country.name}`}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selections.countries.includes(country.name)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelections(prev => ({
                        ...prev,
                        countries: isChecked 
                          ? [...prev.countries, country.name]
                          : prev.countries.filter(c => c !== country.name),
                        cities: []
                      }));
                    }}
                    color="primary"
                    sx={{
                      transform: 'scale(0.8)', // ⬅️ Smaller checkbox
                      padding: '2px' // ⬅️ Less padding
                    }}
                  />
                }
                label={country.name}
                 sx={{
                  fontSize: '0.7rem', // ⬅️ Smaller label text
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.8rem'
                  }
                 }}
              />
            </Grid>
          ))}
        </Grid>

        {selections.countries.length > 0 && (
          <>
            <Typography color='#ff9800' variant="h6">
              Select Cities
            </Typography>
            {Object.entries(citiesData).map(([country, cities], countryIndex) => (
              <Box key={`country-cities-${country}-${countryIndex}`} sx={{ mb: 2 }}>
                <Typography variant="body1" textAlign={'center'} color='#ff9800' sx={{ fontWeight: 500, mb: 1 }}>
                  {country}
                </Typography>
                <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(7, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                  {cities.map((city, cityIndex) => (
                    <Grid item xs={12} sm={6} md={4} key={`int-city-${country}-${city}-${cityIndex}`}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selections.cities.includes(city)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;f=
                              setSelections(prev => ({
                                ...prev,
                                cities: isChecked 
                                  ? [...prev.cities, city]
                                  : prev.cities.filter(c => c !== city)
                              }));
                            }}
                            color="primary"
                            sx={{
                              transform: 'scale(0.8)', // ⬅️ Smaller checkbox
                              padding: '2px' // ⬅️ Less padding
                            }}
                          />
                        }
                        label={city}
                         sx={{
                          fontSize: '0.7rem', // ⬅️ Smaller label text
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.8rem'
                          }
                         }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </>
        )}

        {selections.cities.length > 0 && (
          <Button
            variant="contained"
            onClick={() => addInternationalLocations(type)}
            sx={{ mt: 2 }}
            color="secondary"
            disabled={loading.formSubmit}
            startIcon={loading.formSubmit ? <CircularProgress size={20} /> : null}
          >
            {loading.formSubmit ? 'Adding...' : `Add Selected Cities (${selections.cities.length})`}
          </Button>
        )}
      </Box>
    );
  }, [addInternationalLocations, loading.countries, loading.currentIntCities, loading.intCities, loading.formSubmit, sortedCountries]);

  // Render location tables with improved display
  const renderLocationTables = useCallback((type, locationType) => {
  const locations = formData[type][locationType];
  const fields = locationType === 'domestic'
    ? ['states', 'districts', 'cities']
    : ['countries', 'cities'];

  const rowCount = Math.max(...fields.map(f => locations[f]?.length || 0));

  const hasData = fields.some(field => locations[field]?.length > 0);

  // Filter out column indexes with NO values across all fields
  const visibleColumns = Array.from({ length: rowCount }, (_, index) => index).filter(index =>
    fields.some(field => locations[field]?.[index])
  );

  if (!hasData) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color='#ff9800'>
          {type === 'currentOutletLocations' ? 'Current' : 'Expansion'}{' '}
          {locationType === 'domestic' ? 'Domestic' : 'International'} Locations
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No {locationType === 'domestic' ? 'domestic' : 'international'} locations added yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {type === 'currentOutletLocations' ? 'Current' : 'Expansion'}{' '}
        {locationType === 'domestic' ? 'Domestic' : 'International'} Locations
      </Typography>

      {/* ✅ Summary at top */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: 2 }}>
        {fields.map((field) => (
          <Typography
            key={`summary-${field}`}
            variant="body2"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}:{' '}
            <span style={{ color: '#1976d2' }}>
              {locations[field].length > 0 ? locations[field].join(', ') : 'None'}
            </span>
          </Typography>
        ))}
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table size="small" stickyHeader>
            {/* <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                  Field
                </TableCell>
                {visibleColumns.map((index) => (
                  <TableCell
                    key={`header-${index}`}
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      minWidth: 180,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {/* Only number if values exist 
                    {`#${index + 1}`}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead> */}

            <TableBody>
              {fields.map((field) => (
                <TableRow key={`row-${field}`}>
                  <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </TableCell>
                  {visibleColumns.map((index) => {
                    const value = locations[field]?.[index];
                    return (
                      <TableCell
                        key={`cell-${field}-${index}`}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {value ? (
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            {value}
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeLocationItems(type, locationType, field, index)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          '-' // No delete icon for empty values
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}, [formData, removeLocationItems]);


  // Close error alert
  const handleCloseError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <>
      <Backdrop open={loading.states || loading.countries} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Box display={"flex"} sx={{ p: 3 }} gap={5}>
        <Typography variant="h6" fontWeight={"400"} mt={0.5}>
          Are You Looking International Expansion:
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={isInternationalExpansion === true}
                onChange={() => handleInternationalExpansionChange(true)}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isInternationalExpansion === false}
                onChange={() => handleInternationalExpansionChange(false)}
              />
            }
            label="No"
          />
        </FormGroup>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Current Outlet Locations Section */}
        <Typography variant="h5" fontWeight={"700"} color='#ff9800'>
          Current Outlet Locations:
        </Typography>
        
        <RadioGroup
          row
          value={currentOutletLocationType}
          onChange={handleCurrentOutletLocationTypeChange}
          sx={{ mb: 3, justifyContent: 'center', gap: 7 }}
        >
          <FormControlLabel
            value="domestic"
            control={<Radio color="primary" />}
            label="Domestic (India)"
          />
          <FormControlLabel
            value="international"
            control={<Radio color="secondary" />}
            label="International"
          />
        </RadioGroup>

        {currentOutletLocationType === 'domestic' ? 
          renderDomesticLocationSelection(currentDomesticSelections, setCurrentDomesticSelections, 'current') :
          renderInternationalLocationSelection(currentInternationalSelections, setCurrentInternationalSelections, currentInternationalCities, 'current')
        }

        {renderLocationTables('currentOutletLocations', 'domestic')}
        {renderLocationTables('currentOutletLocations', 'international')}

        <Divider sx={{ mt: 2, mb: 2, borderColor: '#7ad03a', borderWidth: '1px' }} />

        {/* Expansion Locations Section */}
        <Typography variant="h5" fontWeight={"700"} color='#ff9800'>
          Expansion Locations
        </Typography>
        
        <RadioGroup
          row
          value={locationType}
          onChange={handleLocationTypeChange}
          sx={{ mb: 3, justifyContent: 'center', gap: 7 }}
        >
          <FormControlLabel
            value="domestic"
            control={<Radio color="primary" />}
            label="Domestic (India)"
          />
          <FormControlLabel
            value="international"
            control={<Radio color="secondary" />}
            label="International"
          />
        </RadioGroup>

        {locationType === 'domestic' ? 
          renderDomesticLocationSelection(domesticSelections, setDomesticSelections, 'expansion') :
          renderInternationalLocationSelection(internationalSelections, setInternationalSelections, internationalCities, 'expansion')
        }

        {renderLocationTables('expansionLocations', 'domestic')}
        {renderLocationTables('expansionLocations', 'international')}
      </Box>
    </>
  );
}

export default BrandExpansionLocationDetails;