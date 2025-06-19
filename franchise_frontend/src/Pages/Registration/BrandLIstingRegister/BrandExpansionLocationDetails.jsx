import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Typography, RadioGroup, FormControlLabel, Radio, Button, Checkbox, FormControl, FormLabel, Select, MenuItem, FormGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Divider
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tab } from '@mui/icons-material';

function BrandExpansionLocationDetails({ data = {}, errors = {}, onChange }) {
  const [locationType, setLocationType] = useState("domestic");
  const [currentOutletLocationType, setCurrentOutletLocationType] = useState("domestic");
  
  // Domestic Location State
  const [domesticSelections, setDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
    selectedCities: []
  });
  
  // International Location State
  const [internationalSelections, setInternationalSelections] = useState({
    selectedCountries: [],
    selectedCities: []
  });

  // Current Outlet Locations
  const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
    selectedCities: []
  });
  
  const [currentInternationalSelections, setCurrentInternationalSelections] = useState({
    selectedCountries: [],
    selectedCities: []
  });

  // Location Data
  const [statesData, setStatesData] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [internationalCities, setInternationalCities] = useState({});
  const [currentInternationalCities, setCurrentInternationalCities] = useState({});

  const [loading, setLoading] = useState({
    states: false,
    countries: false,
    intCities: false,
    currentIntCities: false
  });

  const [isInternationalExpansion, setIsInternationalExpansion] = useState(null);

  // Fetch domestic data (Indian states, districts, cities)
  useEffect(() => {
    const fetchDomesticData = async () => {
      setLoading(prev => ({ ...prev, states: true }));
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
        );
        setStatesData(response.data);
        setStates(
          response.data
            .map(state => ({ id: state.iso2, name: state.name }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Error fetching domestic data:", error);
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    };

    fetchDomesticData();
  }, []);

  // Fetch international countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(prev => ({ ...prev, countries: true }));
      try {
        const response = await axios.get(
          "https://countriesnow.space/api/v0.1/countries"
        );
        const sortedCountries = response.data.data
          .map(country => ({
            id: country.iso2,
            name: country.country
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };

    fetchCountries();
  }, []);

  const getCitiesByCountry = async (countryName) => {
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        { country: countryName }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching cities for country:", countryName, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchInternationalCities = async () => {
      if (internationalSelections.selectedCountries.length > 0) {
        setLoading(prev => ({ ...prev, intCities: true }));
        try {
          const citiesByCountry = {};
          
          await Promise.all(
            internationalSelections.selectedCountries.map(async (country) => {
              const cities = await getCitiesByCountry(country);
              citiesByCountry[country] = cities;
            })
          );
          
          setInternationalCities(citiesByCountry);
        } catch (error) {
          console.error("Error fetching international cities:", error);
        } finally {
          setLoading(prev => ({ ...prev, intCities: false }));
        }
      }
    };

    fetchInternationalCities();
  }, [internationalSelections.selectedCountries]);

  useEffect(() => {
    const fetchCurrentInternationalCities = async () => {
      if (currentInternationalSelections.selectedCountries.length > 0) {
        setLoading(prev => ({ ...prev, currentIntCities: true }));
        try {
          const citiesByCountry = {};
          
          await Promise.all(
            currentInternationalSelections.selectedCountries.map(async (country) => {
              const cities = await getCitiesByCountry(country);
              citiesByCountry[country] = cities;
            })
          );
          
          setCurrentInternationalCities(citiesByCountry);
        } catch (error) {
          console.error("Error fetching international cities:", error);
        } finally {
          setLoading(prev => ({ ...prev, currentIntCities: false }));
        }
      }
    };

    fetchCurrentInternationalCities();
  }, [currentInternationalSelections.selectedCountries]);

  const handleLocationTypeChange = (e) => {
    const type = e.target.value;
    setLocationType(type);
    if (type === "domestic") {
      setDomesticSelections({
        selectedStates: [],
        selectedDistricts: [],
        selectedCities: []
      });
    } else {
      setInternationalSelections({
        selectedCountries: [],
        selectedCities: []
      });
    }
  };

  const handleCurrentOutletLocationTypeChange = (e) => {
    const type = e.target.value;
    setCurrentOutletLocationType(type);
    if (type === "domestic") {
      setCurrentDomesticSelections({
        selectedStates: [],
        selectedDistricts: [],
        selectedCities: []
      });
    } else {
      setCurrentInternationalSelections({
        selectedCountries: [],
        selectedCities: []
      });
    }
  };

  const handleRemoveLocation = (type, index) => {
    if (type === 'current') {
      const updatedLocations = [...(data.currentOutletLocations || [])];
      updatedLocations.splice(index, 1);
      onChange({ 
        ...data,
        currentOutletLocations: updatedLocations 
      });
    } else {
      const updatedLocations = [...(data.expansionLocations || [])];
      updatedLocations.splice(index, 1);
      onChange({ 
        ...data,
        expansionLocations: updatedLocations 
      });
    }
  };

  const addDomesticLocations = (type) => {
    const selections = type === 'current' ? currentDomesticSelections : domesticSelections;
    
    const newLocations = selections.selectedCities.map(city => {
      const stateObj = statesData.find(state => 
        state.cities.some(c => c.name === city)
      );
      const cityObj = stateObj?.cities.find(c => c.name === city);
      
      return {
        type: "domestic",
        country: "India",
        state: stateObj?.name || "",
        district: cityObj?.district || "",
        city: city
      };
    });

    if (type === 'current') {
      const updatedLocations = [
        ...(data.currentOutletLocations || []),
        ...newLocations
      ];
      
      onChange({ 
        ...data,
        currentOutletLocations: updatedLocations,
        isInternationalExpansion
      });
      
      setCurrentDomesticSelections({
        selectedStates: [],
        selectedDistricts: [],
        selectedCities: []
      });
    } else {
      const updatedLocations = [
        ...(data.expansionLocations || []),
        ...newLocations
      ];
      
      onChange({ 
        ...data,
        expansionLocations: updatedLocations,
        isInternationalExpansion
      });
      
      setDomesticSelections({
        selectedStates: [],
        selectedDistricts: [],
        selectedCities: []
      });
    }
  };

  const addInternationalLocations = (type) => {
    const selections = type === 'current' ? currentInternationalSelections : internationalSelections;
    const citiesData = type === 'current' ? currentInternationalCities : internationalCities;
    
    const newLocations = selections.selectedCities.map(city => {
      const country = Object.entries(citiesData).find(([_, cities]) => 
        cities.includes(city)
      )?.[0] || "";
      
      return {
        type: "international",
        country: country,
        state: "-",
        district: "-",
        city: city
      };
    });

    if (type === 'current') {
      const updatedLocations = [
        ...(data.currentOutletLocations || []),
        ...newLocations
      ];
      
      onChange({ 
        ...data,
        currentOutletLocations: updatedLocations,
        isInternationalExpansion
      });
      
      setCurrentInternationalSelections({
        selectedCountries: [],
        selectedCities: []
      });
    } else {
      const updatedLocations = [
        ...(data.expansionLocations || []),
        ...newLocations
      ];
      
      onChange({ 
        ...data,
        expansionLocations: updatedLocations,
        isInternationalExpansion
      });
      
      setInternationalSelections({
        selectedCountries: [],
        selectedCities: []
      });
    }
  };

  const handleInternationalExpansionChange = (value) => {
    setIsInternationalExpansion(value);
    onChange({ 
      ...data,
      isInternationalExpansion: value 
    });
  };

  return (
    <>
      <Box display={"flex"} sx={{ p: 3 }} gap={5}>
        <Typography variant="h6" fontWeight={"400"} mt={0.5}>Are You Looking International Expansion :</Typography>
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
        <Typography variant="h5" fontWeight={"700"} color='#ff9800'>
          Current Outlet Locations :
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
            label={
              <Box display="flex" alignItems="center">
                <Typography>Domestic (India)</Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="international"
            control={<Radio color="secondary" />}
            label={
              <Box display="flex" alignItems="center">
                <Typography>International</Typography>
              </Box>
            }
          />
        </RadioGroup>

        {currentOutletLocationType === 'domestic' && (
          <Box>
            <Typography variant="h5" m={2}>
              Select States
            </Typography>
            <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
              {states.map((state) => (
                <Grid item xs={12} sm={6} md={4} key={state.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentDomesticSelections.selectedStates.includes(state.name)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setCurrentDomesticSelections(prev => ({
                            ...prev,
                            selectedStates: isChecked 
                              ? [...prev.selectedStates, state.name]
                              : prev.selectedStates.filter(s => s !== state.name),
                            selectedDistricts: [],
                            selectedCities: []
                          }));
                        }}
                        color="primary"
                      />
                    }
                    label={state.name}
                  />
                </Grid>
              ))}
            </Grid>

            {currentDomesticSelections.selectedStates.length > 0 && (
              <>
                <Typography variant="h6">
                  Select Districts
                </Typography>
                {currentDomesticSelections.selectedStates.map(state => {
                  const stateObj = statesData.find(s => s.name === state);
                  if (!stateObj) return null;
                  
                  return (
                    <Box key={state} sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#ff9800' }}>
                        Selected State: {state}
                      </Typography>
                      <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                        {stateObj.districts.map((district) => (
                          <Grid item xs={12} sm={6} md={4} key={`${state}-${district}`}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={currentDomesticSelections.selectedDistricts.includes(district)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setCurrentDomesticSelections(prev => ({
                                      ...prev,
                                      selectedDistricts: isChecked 
                                        ? [...prev.selectedDistricts, district]
                                        : prev.selectedDistricts.filter(d => d !== district),
                                      selectedCities: []
                                    }));
                                  }}
                                  color="primary"
                                />
                              }
                              label={district}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  );
                })}
              </>
            )}

            {currentDomesticSelections.selectedDistricts.length > 0 && (
              <>
                <Typography variant="h6">
                  Select Cities
                </Typography>
                {currentDomesticSelections.selectedStates.flatMap(state => {
                  const stateObj = statesData.find(s => s.name === state);
                  if (!stateObj) return [];
                  
                  return currentDomesticSelections.selectedDistricts.map(district => {
                    const citiesInDistrict = stateObj.cities
                      .filter(city => city.district === district)
                      .map(city => city.name);
                    
                    if (citiesInDistrict.length === 0) return null;
                    
                    return (
                      <Box key={`${state}-${district}`} sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#ff9800' }}>
                          Select Cities in - ({state}), {district}
                        </Typography>
                        <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                          {citiesInDistrict.map((city) => (
                            <Grid item xs={12} sm={6} md={4} key={`${state}-${district}-${city}`}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={currentDomesticSelections.selectedCities.includes(city)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setCurrentDomesticSelections(prev => ({
                                        ...prev,
                                        selectedCities: isChecked 
                                          ? [...prev.selectedCities, city]
                                          : prev.selectedCities.filter(c => c !== city)
                                      }));
                                    }}
                                    color="primary"
                                  />
                                }
                                label={city}
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

            {currentDomesticSelections.selectedCities.length > 0 && (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Selected States</strong></TableCell>
                        <TableCell><strong>Selected Districts</strong></TableCell>
                        <TableCell><strong>Selected Cities</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(currentDomesticSelections.selectedCities || []).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>{currentDomesticSelections.selectedStates[index] || "-"}</TableCell>
                          <TableCell>{currentDomesticSelections.selectedDistricts[index] || "-"}</TableCell>
                          <TableCell>{currentDomesticSelections.selectedCities[index]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="contained"
                  onClick={() => addDomesticLocations('current')}
                  sx={{ mt: 2 }}
                  color="primary"
                >
                  Add Selected Cities ({currentDomesticSelections.selectedCities.length})
                </Button>
              </>
            )}
          </Box>
        )}

        {currentOutletLocationType === 'international' && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Select Countries
            </Typography>
            <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
              {countries.map((country) => (
                <Grid item xs={12} sm={6} md={4} key={country.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentInternationalSelections.selectedCountries.includes(country.name)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setCurrentInternationalSelections(prev => ({
                            ...prev,
                            selectedCountries: isChecked 
                              ? [...prev.selectedCountries, country.name]
                              : prev.selectedCountries.filter(c => c !== country.name),
                            selectedCities: []
                          }));
                        }}
                        color="secondary"
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center">
                        {country.name}
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>

            {currentInternationalSelections.selectedCountries.length > 0 && (
              <>
                <Typography variant="h6">
                  Select Cities
                </Typography>
                {Object.entries(currentInternationalCities).map(([country, cities]) => (
                  <Box key={country} sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      {country}
                    </Typography>
                    <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                      {cities.map((city) => (
                        <Grid item xs={12} sm={6} md={4} key={`${country}-${city}`}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={currentInternationalSelections.selectedCities.includes(city)}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  setCurrentInternationalSelections(prev => ({
                                    ...prev,
                                    selectedCities: isChecked 
                                      ? [...prev.selectedCities, city]
                                      : prev.selectedCities.filter(c => c !== city)
                                  }));
                                }}
                                color="secondary"
                              />
                            }
                            label={city}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </>
            )}

            {currentInternationalSelections.selectedCities.length > 0 && (
              <Button
                variant="contained"
                onClick={() => addInternationalLocations('current')}
                sx={{ mt: 2 }}
                color="secondary"
              >
                Add Selected Cities ({currentInternationalSelections.selectedCities.length})
              </Button>
            )}
          </Box>
        )}

        {/* Display current outlet locations */}
        {(data.currentOutletLocations && data.currentOutletLocations.length > 0) && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Current Outlet Locations Added:
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.currentOutletLocations.map((location, index) => (
                    <TableRow key={index}>
                      <TableCell>{location.type}</TableCell>
                      <TableCell>{location.country}</TableCell>
                      <TableCell>{location.state}</TableCell>
                      <TableCell>{location.district}</TableCell>
                      <TableCell>{location.city}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveLocation('current', index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Divider sx={{ mt: 2, mb: 2, borderColor: '#7ad03a', borderWidth: '1px' }} />

        {/* Expansion Locations Section */}
        <Box>
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
              label={
                <Box display="flex" alignItems="center">
                  <Typography>Domestic (India)</Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="international"
              control={<Radio color="secondary" />}
              label={
                <Box display="flex" alignItems="center">
                  <Typography>International</Typography>
                </Box>
              }
            />
          </RadioGroup>

          {locationType === 'domestic' && (
            <Box>
              <Typography variant="h5" m={2}>
                Select States
              </Typography>
              <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                {states.map((state) => (
                  <Grid item xs={12} sm={6} md={4} key={state.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={domesticSelections.selectedStates.includes(state.name)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setDomesticSelections(prev => ({
                              ...prev,
                              selectedStates: isChecked 
                                ? [...prev.selectedStates, state.name]
                                : prev.selectedStates.filter(s => s !== state.name),
                              selectedDistricts: [],
                              selectedCities: []
                            }));
                          }}
                          color="primary"
                        />
                      }
                      label={state.name}
                    />
                  </Grid>
                ))}
              </Grid>

              {domesticSelections.selectedStates.length > 0 && (
                <>
                  <Typography variant="h6">
                    Select Districts
                  </Typography>
                  {domesticSelections.selectedStates.map(state => {
                    const stateObj = statesData.find(s => s.name === state);
                    if (!stateObj) return null;
                    
                    return (
                      <Box key={state} sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#ff9800' }}>
                          Selected State: {state}
                        </Typography>
                        <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                          {stateObj.districts.map((district) => (
                            <Grid item xs={12} sm={6} md={4} key={`${state}-${district}`}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={domesticSelections.selectedDistricts.includes(district)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setDomesticSelections(prev => ({
                                        ...prev,
                                        selectedDistricts: isChecked 
                                          ? [...prev.selectedDistricts, district]
                                          : prev.selectedDistricts.filter(d => d !== district),
                                        selectedCities: []
                                      }));
                                    }}
                                    color="primary"
                                  />
                                }
                                label={district}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    );
                  })}
                </>
              )}

              {domesticSelections.selectedDistricts.length > 0 && (
                <>
                  <Typography variant="h6">
                    Select Cities
                  </Typography>
                  {domesticSelections.selectedStates.flatMap(state => {
                    const stateObj = statesData.find(s => s.name === state);
                    if (!stateObj) return [];
                    
                    return domesticSelections.selectedDistricts.map(district => {
                      const citiesInDistrict = stateObj.cities
                        .filter(city => city.district === district)
                        .map(city => city.name);
                      
                      if (citiesInDistrict.length === 0) return null;
                      
                      return (
                        <Box key={`${state}-${district}`} sx={{ mb: 2 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#ff9800' }}>
                            Select Cities in - {district} ({state})
                          </Typography>
                          <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                            {citiesInDistrict.map((city) => (
                              <Grid item xs={12} sm={6} md={4} key={`${state}-${district}-${city}`}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={domesticSelections.selectedCities.includes(city)}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setDomesticSelections(prev => ({
                                          ...prev,
                                          selectedCities: isChecked 
                                            ? [...prev.selectedCities, city]
                                            : prev.selectedCities.filter(c => c !== city)
                                        }));
                                      }}
                                      color="primary"
                                    />
                                  }
                                  label={city}
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

              {domesticSelections.selectedCities.length > 0 && (
                <Button
                  variant="contained"
                  onClick={() => addDomesticLocations('expansion')}
                  sx={{ mt: 2 }}
                  color="primary"
                >
                  Add Selected Cities ({domesticSelections.selectedCities.length})
                </Button>
              )}
            </Box>
          )}

          {locationType === 'international' && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Select Countries
              </Typography>
              <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                {countries.map((country) => (
                  <Grid item xs={12} sm={6} md={4} key={country.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={internationalSelections.selectedCountries.includes(country.name)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setInternationalSelections(prev => ({
                              ...prev,
                              selectedCountries: isChecked 
                                ? [...prev.selectedCountries, country.name]
                                : prev.selectedCountries.filter(c => c !== country.name),
                              selectedCities: []
                            }));
                          }}
                          color="secondary"
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center">
                          {country.name}
                        </Box>
                      }
                    />
                  </Grid>
                ))}
              </Grid>

              {internationalSelections.selectedCountries.length > 0 && (
                <>
                  <Typography variant="h6">
                    Select Cities
                  </Typography>
                  {Object.entries(internationalCities).map(([country, cities]) => (
                    <Box key={country} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        {country}
                      </Typography>
                      <Grid display={'grid'} gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }} spacing={2} sx={{ mb: 2 }}>
                        {cities.map((city) => (
                          <Grid item xs={12} sm={6} md={4} key={`${country}-${city}`}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={internationalSelections.selectedCities.includes(city)}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setInternationalSelections(prev => ({
                                      ...prev,
                                      selectedCities: isChecked 
                                        ? [...prev.selectedCities, city]
                                        : prev.selectedCities.filter(c => c !== city)
                                    }));
                                  }}
                                  color="secondary"
                                />
                              }
                              label={city}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                </>
              )}

              {internationalSelections.selectedCities.length > 0 && (
                <Button
                  variant="contained"
                  onClick={() => addInternationalLocations('expansion')}
                  sx={{ mt: 2 }}
                  color="secondary"
                >
                  Add Selected Cities ({internationalSelections.selectedCities.length})
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Display expansion locations */}
        {(data.expansionLocations && data.expansionLocations.length > 0) && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Expansion Locations Added:
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.expansionLocations.map((location, index) => (
                    <TableRow key={index}>
                      <TableCell>{location.type}</TableCell>
                      <TableCell>{location.country}</TableCell>
                      <TableCell>{location.state}</TableCell>
                      <TableCell>{location.district}</TableCell>
                      <TableCell>{location.city}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveLocation('expansion', index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </>
  );
}

export default BrandExpansionLocationDetails;