import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Button, Chip, Typography } from "@mui/material";

const ExpansionPlans = ({ data, errors, onChange }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [statesData, setStatesData] = useState({});
  const [citiesData, setCitiesData] = useState({});
  const [indianStatesWithDistricts] = useState({
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur"],
    Karnataka: ["Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belgaum"],
    Maharashtra: ["Ahmednagar", "Akola", "Amravati", "Aurangabad"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Cuddalore", "Dharmapuri"],
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states"
        );
        const data = await response.json();
        setCountriesData(data.data || []);
      } catch (error) {
        console.error("Error fetching countries and states:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleExpansionTypeChange = (type) => {
    onChange("expansionType", type);
  };

  const handleCountryToggle = (countryName) => {
    if (data.selectedCountries.includes(countryName)) {
      onChange(
        "selectedCountries",
        data.selectedCountries.filter((c) => c !== countryName)
      );
      onChange(
        "selectedStates",
        data.selectedStates.filter((s) => s.country !== countryName)
      );
      onChange(
        "selectedCities",
        data.selectedCities.filter((c) => c.country !== countryName)
      );
    } else {
      onChange("selectedCountries", [...data.selectedCountries, countryName]);
      const country = countriesData.find((c) => c.name === countryName);
      setStatesData((prev) => ({
        ...prev,
        [countryName]: country?.states || [],
      }));
    }
  };

  const handleStateToggle = (countryName, stateName) => {
    const exists = data.selectedStates.some(
      (s) => s.country === countryName && s.state === stateName
    );
    if (exists) {
      onChange(
        "selectedStates",
        data.selectedStates.filter(
          (s) => !(s.country === countryName && s.state === stateName)
        )
      );
      onChange(
        "selectedCities",
        data.selectedCities.filter(
          (c) => !(c.country === countryName && c.state === stateName)
        )
      );
    } else {
      onChange("selectedStates", [
        ...data.selectedStates,
        { country: countryName, state: stateName },
      ]);
      fetchCities(countryName, stateName);
    }
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName, state: stateName }),
        }
      );
      const result = await response.json();
      setCitiesData((prev) => ({
        ...prev,
        [`${countryName}-${stateName}`]: result.data || [],
      }));
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const handleCityToggle = (country, state, city) => {
    const exists = data.selectedCities.some(
      (c) => c.country === country && c.state === state && c.city === city
    );
    if (exists) {
      onChange(
        "selectedCities",
        data.selectedCities.filter(
          (c) =>
            !(c.country === country && c.state === state && c.city === city)
        )
      );
    } else {
      onChange("selectedCities", [
        ...data.selectedCities,
        { country, state, city },
      ]);
    }
  };

  const handleIndianStateToggle = (stateName) => {
    if (data.selectedIndianStates.includes(stateName)) {
      onChange(
        "selectedIndianStates",
        data.selectedIndianStates.filter((s) => s !== stateName)
      );
      onChange(
        "selectedIndianDistricts",
        data.selectedIndianDistricts.filter((d) => d.state !== stateName)
      );
    } else {
      onChange("selectedIndianStates", [
        ...data.selectedIndianStates,
        stateName,
      ]);
    }
  };

  const handleIndianDistrictToggle = (stateName, districtName) => {
    const exists = data.selectedIndianDistricts.some(
      (d) => d.state === stateName && d.district === districtName
    );
    if (exists) {
      onChange(
        "selectedIndianDistricts",
        data.selectedIndianDistricts.filter(
          (d) => !(d.state === stateName && d.district === districtName)
        )
      );
    } else {
      onChange("selectedIndianDistricts", [
        ...data.selectedIndianDistricts,
        { state: stateName, district: districtName },
      ]);
    }
  };

  const removeSelection = (type, item) => {
    if (type === "country") handleCountryToggle(item);
    if (type === "state") handleStateToggle(item.country, item.state);
    if (type === "city") handleCityToggle(item.country, item.state, item.city);
    if (type === "indianState") handleIndianStateToggle(item);
    if (type === "indianDistrict")
      handleIndianDistrictToggle(item.state, item.district);
  };

  return (
    <div>
      <h3>Expansion Plans</h3>

      <div>
        <p>Select Expansion Type:</p>
        <div>
          <Button
            variant={
              data.expansionType === "international" ? "contained" : "outlined"
            }
            onClick={() => handleExpansionTypeChange("international")}
            sx={{ mr: 2 }}
          >
            International Expansion
          </Button>
          <Button
            variant={
              data.expansionType === "domestic" ? "contained" : "outlined"
            }
            onClick={() => handleExpansionTypeChange("domestic")}
          >
            Domestic (India) Expansion
          </Button>
        </div>
        {errors?.expansionType && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errors.expansionType}
          </Typography>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Selected Items:</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {data.selectedCountries.map((c) => (
            <Chip
              key={c}
              label={`Country: ${c}`}
              onDelete={() => removeSelection("country", c)}
              sx={{ m: 0.5 }}
            />
          ))}
          {data.selectedStates.map((s, i) => (
            <Chip
              key={i + s.state}
              label={`State: ${s.state} (${s.country})`}
              onDelete={() => removeSelection("state", s)}
              sx={{ m: 0.5 }}
            />
          ))}
          {data.selectedCities.map((c, i) => (
            <Chip
              key={i + c.city}
              label={`City: ${c.city} (${c.state}, ${c.country})`}
              onDelete={() => removeSelection("city", c)}
              sx={{ m: 0.5 }}
            />
          ))}
          {data.selectedIndianStates.map((s) => (
            <Chip
              key={s}
              label={`State: ${s}`}
              onDelete={() => removeSelection("indianState", s)}
              sx={{ m: 0.5 }}
            />
          ))}
          {data.selectedIndianDistricts.map((d, i) => (
            <Chip
              key={i + d.district}
              label={`District: ${d.district} (${d.state})`}
              onDelete={() => removeSelection("indianDistrict", d)}
              sx={{ m: 0.5 }}
            />
          ))}
        </div>
      </div>

      {data.expansionType === "international" && (
        <div>
          <div style={{ marginTop: "20px" }}>
            <TextField
              select
              label="Select Country"
              value=""
              onChange={(e) => handleCountryToggle(e.target.value)}
              size="small"
              fullWidth
              error={!!errors?.selectedCountries}
              helperText={
                errors?.selectedCountries || "Select at least one country"
              }
            >
              {countriesData.map((country) => (
                <MenuItem key={country.name} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {data.selectedCountries.map((countryName) => (
            <div key={countryName} style={{ marginTop: "20px" }}>
              <h5>States in {countryName}:</h5>
              {errors?.selectedStates?.[countryName] && (
                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                  {errors.selectedStates[countryName]}
                </Typography>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {(statesData[countryName] || []).map((state) => (
                  <Button
                    key={state.name}
                    variant={
                      data.selectedStates.some(
                        (s) =>
                          s.country === countryName && s.state === state.name
                      )
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => handleStateToggle(countryName, state.name)}
                    sx={{ m: 0.5 }}
                  >
                    {state.name}
                  </Button>
                ))}
              </div>

              {data.selectedStates
                .filter((s) => s.country === countryName)
                .map((s) => (
                  <div key={s.state} style={{ marginTop: "15px" }}>
                    <h5>Cities in {s.state}:</h5>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {(citiesData[`${countryName}-${s.state}`] || []).map(
                        (city) => (
                          <Button
                            key={city}
                            variant={
                              data.selectedCities.some(
                                (c) =>
                                  c.country === countryName &&
                                  c.state === s.state &&
                                  c.city === city
                              )
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() =>
                              handleCityToggle(countryName, s.state, city)
                            }
                            sx={{ m: 0.5 }}
                          >
                            {city}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {data.expansionType === "domestic" && (
        <div>
          <div style={{ marginTop: "20px" }}>
            <h5>Select Indian States:</h5>
            {errors?.selectedIndianStates && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {errors.selectedIndianStates}
              </Typography>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {Object.keys(indianStatesWithDistricts).map((state) => (
                <Button
                  key={state}
                  variant={
                    data.selectedIndianStates.includes(state)
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleIndianStateToggle(state)}
                  sx={{ m: 0.5 }}
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>

          {data.selectedIndianStates.map((stateName) => (
            <div key={stateName} style={{ marginTop: "15px" }}>
              <h5>Districts in {stateName}:</h5>
              <div>
                {errors?.selectedIndianDistricts?.[stateName] && (
                  <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                    {errors.selectedIndianDistricts[stateName]}
                  </Typography>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {(indianStatesWithDistricts[stateName] || []).map(
                  (district) => (
                    <Button
                      key={district}
                      variant={
                        data.selectedIndianDistricts.some(
                          (d) =>
                            d.state === stateName && d.district === district
                        )
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() =>
                        handleIndianDistrictToggle(stateName, district)
                      }
                      sx={{ m: 0.5 }}
                    >
                      {district}
                    </Button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpansionPlans;