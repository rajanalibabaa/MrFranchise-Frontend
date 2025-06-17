
import React from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputAdornment,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  FormHelperText,
  Divider
} from "@mui/material";

const FranchiseDetails = ({ data = {}, errors = {}, onChange = () => {} }) => {
  const [ficoModel, setFicoModel] = React.useState({
    investmentRange: "",
    areaRequired: "",
    franchiseModel: "",
    franchiseType: "",
    franchiseFee: "",
    royaltyFee: "",
    royaltyFeeUnit: "%",
    interiorCost: "",
    stockCost: "",
    otherCost: "",
    roi: "",
    payBackPeriod: "",
    breakEven: "",
    requireWorkingCapital: "",
    marginOnSales: "",
    // fixedReturn: "",
    propertyType: "",
    // StatergicPlan:"",

  });

  const handleChange = (e) => { 
    const { name, value } = e.target;

    if (name === "companyOwnedOutlets" || name === "franchiseOutlets") {
      const companyOwned =
        name === "companyOwnedOutlets"
          ? parseInt(value || 0)
          : parseInt(data.companyOwnedOutlets || 0);
      const franchise =
        name === "franchiseOutlets"
          ? parseInt(value || 0)
          : parseInt(data.franchiseOutlets || 0);
      const total = companyOwned + franchise;

      onChange({
        [name]: value,
        totalOutlets: total.toString(),
      });
    } else {
      onChange({ [name]: value });
    }
  };
  
  const handleFicoChange = (e) => {
  const { name, value } = e.target;

  setFicoModel((prev) => {
    const updated = {
      ...prev,
      [name]: value,
    };

    // If ROI is being changed, calculate Payback Period
    if (name === "roi") {
      const roi = parseFloat(value);
      if (!isNaN(roi) && roi > 0) {
        const totalMonths = (100 / roi) * 12;
        const years = Math.floor(totalMonths / 12);
        const months = Math.round(totalMonths % 12);
        updated.payBackPeriod = `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
      } else {
        updated.payBackPeriod = "";
      }
    }

    return updated;
  });
};

  const handleRoyaltyFeeUnitChange = (e) => {
    const { value } = e.target;
    setFicoModel((prev) => ({
      ...prev,
      royaltyFeeUnit: value,
    }));
  };

  const handleAddFicoModel = () => {
    if (
      !ficoModel.investmentRange ||
      !ficoModel.areaRequired ||
      !ficoModel.franchiseModel ||
      !ficoModel.franchiseType ||
      !ficoModel.franchiseFee ||
      !ficoModel.royaltyFee ||
      !ficoModel.interiorCost ||
      !ficoModel.stockCost ||
      !ficoModel.otherCost ||
      !ficoModel.roi ||
      !ficoModel.payBackPeriod ||
      !ficoModel.breakEven ||
      !ficoModel.requireWorkingCapital ||
      !ficoModel.marginOnSales ||
      !ficoModel.propertyType
    ) {
      alert("Please fill in all required fields for the FICO model");
      return;
    }

    const formattedFicoModel = {
      ...ficoModel,
      royaltyFee: `${ficoModel.royaltyFee}${ficoModel.royaltyFeeUnit}`,
    };

    const updatedFico = [...(data.fico || []), formattedFicoModel];
    onChange({ fico: updatedFico });

    // console.log(" updatedFico :",updatedFico)
    // console.log(" fico :",fico)

    setFicoModel({
      investmentRange: "",
      areaRequired: "",
      franchiseModel: "",
      franchiseType: "",
      franchiseFee: "",
      royaltyFee: "",
      royaltyFeeUnit: "%",
      interiorCost: "",
      stockCost: "",
      otherCost: "",
      roi: "",
      payBackPeriod: "",
      breakEven: "",
      requireWorkingCapital: "",
      marginOnSales: "",
      // fixedReturn: "",
      propertyType: "",
    });
  };

  const royaltyFeeUnits = [
    { value: "%", label: "%" },
    { value: "K", label: "Thousands" },
    { value: "L", label: "Lakhs" },
  ];

  const franchiseTypes = [
    "Unit Franchise",
    "Master Franchise",
    "City Franchise",
    "Area Franchise",
    "District Franchise",
    "State Franchise",
    // 'Area Delaership',
    // 'State Delaership',
    // 'City Delaership'
  ];

  const franchiseModels = [
    "FOFO (Franchise Owned Franchise Operated)",
    "FOCO (Franchise Owned Company Operated)",
    "FICO (Franchise Invested Company Operated)",
    "COCO (Company Owned Company Operated)",
    // "C&F (Clearing & Forwarding)",
    // "DEALERSHIP",
    // "DISTRIBUTORSHIP",
  ];

  const investmentRanges = [
    { label: "Below ₹50K", value:"Below-50,000" },
  { label: "₹50K - ₹2 Lakhs", value:"Rs.50,000-2L" },
  { label: "₹2 - ₹5 Lakhs", value:"Rs.2L-5L" },
  { label: "₹5 - ₹10 Lakhs", value:"Rs.5L-10L" },
  { label: "₹10 - ₹20 Lakhs", value:"Rs.10L-20L" },
  { label: "₹20 - ₹30 Lakhs", value:"Rs.20L-30L"},
  { label: "₹30 - ₹50 Lakhs", value:"Rs.30L-50L" },
  { label: "₹50 Lakhs - ₹1 Crore", value:"Rs.50L-1Cr" },
  { label: "₹1 - ₹2 Crores", value:"Rs.1Cr-2Cr" },
  { label: "₹2 - ₹5 Crores", value:"Rs.2Cr-5Cr" },
  { label: "Above ₹5 Crores", value:"Rs.5Cr-above" },
  ];

  const propertyTypes = ["Owned Property", "Rented Property"];
  const internationalExpansion = ["Yes", "No"];
  const aidFinancing = ["Yes", "No"];
  const statergicPlan = ["Yes", "No"];
  const operatingProcedure = ["Yes", "No"];
  const finacialOperating = ["Yes", "No"];
  const marketingSales = ["Yes", "No"];
  const agreementFranchise= ["Yes", "No"];
  

  const agreementPeriods = [
    "1 Year",
    "3 Years",
    "5 Years",
    "7 Years",
    "10 Years",
  ];

  return (
    <Box sx={{}}>
      <Grid container spacing={3}>
        {/* Franchise Details Section */}
        <Grid item xs={12}>
          
            <Typography variant="h6" sx={{ mb: 3, color: "#ff9800" }}>
              Franchise Details
            </Typography>

            {/* Show general FICO error if exists */}
            {errors.fico && typeof errors.fico === 'string' && (
              <Typography color="error" sx={{ mb: 2 }}>
                {errors.fico}
              </Typography>
            )}

            {/* 5-column grid layout */}
            <Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: { md: "repeat(5, 1fr)", xs: "1fr" },
                gap: 5,
              }}
            >
              {/* Column 1 - Investment Range */}
              <Grid item>
                <FormControl fullWidth error={!!errors["fico[0].investmentRange"]} required>
                  <InputLabel>Investment Range</InputLabel>
                  <Select
                    value={ficoModel.investmentRange}
                    onChange={handleFicoChange}
                    name="investmentRange"
                    label="Investment Range*"
                  >
                    {investmentRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors["fico[0].investmentRange"] && (
                    <FormHelperText error>{errors["fico[0].investmentRange"]}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Column 2 - Area Required */}
              <Grid item>
                <TextField
                  fullWidth
                  label="Area Required"
                  name="areaRequired"
                  value={ficoModel.areaRequired}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].areaRequired"]}
                  helperText={errors["fico[0].areaRequired"]}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">sq.ft</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              {/* Column 3 - Franchise Model */}
              <Grid item>
                <FormControl fullWidth error={!!errors["fico[0].franchiseModel"]} required>
                  <InputLabel>Franchise Model</InputLabel>
                  <Select
                    value={ficoModel.franchiseModel}
                    onChange={handleFicoChange}
                    name="franchiseModel"
                    label="Franchise Model"
                  >
                    {franchiseModels.map((model) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors["fico[0].franchiseModel"] && (
                    <FormHelperText error>{errors["fico[0].franchiseModel"]}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Column 4 - Franchise Type */}
              <Grid item>
                <FormControl fullWidth error={!!errors["fico[0].franchiseType"]} required>
                  <InputLabel>Franchise Type</InputLabel>
                  <Select
                    value={ficoModel.franchiseType}
                    onChange={handleFicoChange}
                    name="franchiseType"
                    label="Franchise Type*"
                  >
                    {franchiseTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors["fico[0].franchiseType"] && (
                    <FormHelperText error>{errors["fico[0].franchiseType"]}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Column 5 - Franchise Fee */}
              <Grid item>
                <TextField
                  fullWidth
                  label="Franchise Fee (₹)"
                  name="franchiseFee"
                  value={ficoModel.franchiseFee}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].franchiseFee"]}
                  helperText={errors["fico[0].franchiseFee"]}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              {/* Second Row - Column 1 - Royalty Fee */}
              <Grid item>
                <TextField
                  fullWidth
                  label="Royalty Fee"
                  name="royaltyFee"
                  value={ficoModel.royaltyFee}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].royaltyFee"]}
                  helperText={errors["fico[0].royaltyFee"]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={ficoModel.royaltyFeeUnit}
                          onChange={handleRoyaltyFeeUnitChange}
                          sx={{
                            "& .MuiSelect-select": {
                              padding: "8px 8px",
                              fontSize: "0.875rem",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        >
                          {royaltyFeeUnits.map((unit) => (
                            <MenuItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>

              {/* Second Row - Column 2 - Interior Cost */}
              <Grid item>
                <TextField
                  fullWidth
                  label="Interior Cost (₹)"
                  name="interiorCost"
                  value={ficoModel.interiorCost}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].interiorCost"]}
                  helperText={errors["fico[0].interiorCost"]}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              {/* Second Row - Column 3 - Exterior Cost */}
              <Grid item>
                <TextField
                  fullWidth
                  label="Stock Investment (₹)"
                  name="stockCost"
                  value={ficoModel.stockCost}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].stockCost"]}
                  helperText={errors["fico[0].stockCost"]}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              {/* Second Row - Column 4 - Other Cost */}
              <Grid item>
                <TextField
                  fullWidth
                  label="Additional Cost (₹)"
                  name="otherCost"
                  value={ficoModel.otherCost}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].otherCost"]}
                  helperText={errors["fico[0].otherCost"]}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              {/* Second Row - Column 5 - ROI */}
              <Grid item>
                <TextField
                  fullWidth
                  label="ROI (%)"
                  name="roi"
                  value={ficoModel.roi}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].roi"]}
                  helperText={errors["fico[0].roi"]}
                  // InputProps={{
                  //   endAdornment: <InputAdornment position="end">months</InputAdornment>,
                  // }}
                  required
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="PayBack Period"
                  name="payBackPeriod"
                  value={ficoModel.payBackPeriod}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].payBackPeriod"]}
                  helperText={errors["fico[0].payBackPeriod"]}
                  InputProps={{
                    readOnly: true,
                    // endAdornment: <InputAdornment position="end">months</InputAdornment>,
                  }}
                  required
                />
              </Grid>

              {/* Third Row - Column 1 - Break Even */}
              <Grid item>
                <TextField
                  fullWidth
                  label="Break Even (months)*"
                  name="breakEven"
                  value={ficoModel.breakEven}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].breakEven"]}
                  helperText={errors["fico[0].breakEven"]}
                  // InputProps={{
                  //   endAdornment: <InputAdornment position="end">months</InputAdornment>,
                  // }}
                  required
                />
              </Grid>

              {/* Third Row - Column 2 - Required Investment Capital */}
              <Grid item>
                <TextField
                  fullWidth
                  label="Required Working Capital"
                  name="requireWorkingCapital"
                  value={ficoModel.requireWorkingCapital}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].requireWorkingCapital"]}
                  helperText={errors["fico[0].requireWorkingCapital"]}
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label="Margin On Sales"
                  name="marginOnSales"
                  value={ficoModel.marginOnSales}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].marginOnSales"]}
                  helperText={errors["fico[0].marginOnSales"]}
                  required
                />
              </Grid>
              {/* <Grid item>
                <TextField
                  fullWidth
                  label="Fixed Return"
                  name="fixedReturn"
                  value={ficoModel.fixedReturn}
                  onChange={handleFicoChange}
                  error={!!errors["fico[0].fixedReturn"]}
                  helperText={errors["fico[0].fixedReturn"]}
                  required
                />
              </Grid> */}

              {/* Third Row - Column 3 - Property Type */}
              <Grid item>
                <FormControl component="fieldset" fullWidth error={!!errors["fico[0].propertyType"]} required>
                  <FormLabel component="legend" >Property Type</FormLabel>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    {propertyTypes.map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type}
                        checked={ficoModel.propertyType === type}
                        onChange={() =>
                          handleFicoChange({
                            target: { name: "propertyType", value: type },
                          })
                        }
                      />
                    ))}
                  </Box>
                  {errors["fico[0].propertyType"] && (
                    <FormHelperText error>{errors["fico[0].propertyType"]}</FormHelperText>
                  )}
                </FormControl>
              </Grid>


              {/* Add FICO Model Button - spans remaining columns */}
              <Grid item sx={{ gridColumn: { md: "3 / span 1", xs: "1" } }}>
                <Button
                  variant="contained"
                  onClick={handleAddFicoModel}
                  fullWidth
                  size="large"
                  sx={{ height: "70%" ,backgroundColor: "#ff9800", color: "#fff", "&:hover": { backgroundColor: "#f57c00" } }}
                >
                  Add Your Model
                </Button>
              </Grid>
            </Grid>
         
        </Grid>
      </Grid>
<Divider 
  sx={{ 
    my: 2, // vertical margin
    backgroundColor: 'rgba(0, 0, 0, 0.08)', // light gray color
    height: '1px' // thin line
  }} 
/>
      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(2, 1fr)", xs: "1fr" },
          gap: 2,
          mt: 3,
        }}
      >
        {/* Franchise Network Section */}
        <Grid item xs={12}>
          
            <Typography variant="h6"  color="#ff9800" sx={{ mb: 2, fontWeight: "bold" }}>
              Franchise Network
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
                gap: 2,
              }}
            >
              <Grid item>
                <TextField
                  fullWidth
                  label="Company Owned Outlets"
                  name="companyOwnedOutlets"
                  value={data.companyOwnedOutlets || ""}
                  onChange={handleChange}
                  placeholder="0"
                  inputProps={{ min: 0 }}
                  error={!!errors.companyOwnedOutlets}
                  helperText={errors.companyOwnedOutlets}
                  required
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Franchise Outlets"
                  name="franchiseOutlets"
                  value={data.franchiseOutlets || ""}
                  onChange={handleChange}
                  placeholder="0"
                  inputProps={{min: 0}}
                  error={!!errors.franchiseOutlets}
                  helperText={errors.franchiseOutlets}
                  required
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Total Outlets"
                  name="totalOutlets"
                  value={data.totalOutlets || ""}
                  type="number"
                  InputProps={{ readOnly: true }}
                  variant="filled"
                  error={!!errors.totalOutlets}
                  helperText={errors.totalOutlets}
                  required
                />
              </Grid>

<Grid item>
      <TextField
        fullWidth
        label="Current Outlets Located At"
        name="currentOutletsLocatedAt"
        value={data.currentOutletsLocatedAt || ""}
        onChange={handleChange}
        error={!!errors.currentOutletsLocatedAt}
        helperText={errors.currentOutletsLocatedAt}
        required
        // multiline
        // minRows={2}
      />
    </Grid>
               <Grid item>
                <FormControl component="fieldset" fullWidth error={!!errors.internationalExpansion} required>
                  <FormLabel component="legend" >Are You Looking For Internation Expansion</FormLabel>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {internationalExpansion.map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type}
                        checked={data.internationalExpansion === type}
                        onChange={() =>
                          handleChange({
                            target: { name: "internationalExpansion", value: type },
                          })
                        }
                      />
                    ))}
                  </Box>
                  {errors.internationalExpansion && (
                    <FormHelperText error>{errors.internationalExpansion}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item>
                <FormControl component="fieldset" fullWidth error={!!errors.aidFinancing} required>
                  <FormLabel component="legend" >Do You Provide Aid In Financing</FormLabel>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {aidFinancing.map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type}
                        checked={data.aidFinancing === type}
                        onChange={() =>
                          handleChange({
                            target: { name:"aidFinancing", value: type },
                          })
                        }
                      />
                    ))}
                  </Box>
                  {errors.aidFinancing && (
                    <FormHelperText error>{errors.aidFinancing}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
            </Grid>
    
        </Grid>

        {/* Support and Training Section */}
        <Grid item xs={12}>
          
            <Typography variant="h6"  color="#ff9800" sx={{ mb: 2, fontWeight: "bold" }}>
              Support and Training
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
                gap: 2,
              }}
            >
              <Grid item>
                <TextField
                  fullWidth
                  label="Requirement Support"
                  name="requirementSupport"
                  value={data.requirementSupport || ""}
                  onChange={handleChange}
                  error={!!errors.requirementSupport}
                  helperText={errors.requirementSupport}
                  required
                />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Staff Training"
                  name="staffTraining"
                  value={data.staffTraining || ""}
                  onChange={handleChange}
                  error={!!errors.staffTraining}
                  helperText={errors.staffTraining}
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label="Staff Recruitment"
                  name="staffRecruitment"
                  value={data.staffRecruitment || ""}
                  onChange={handleChange}
                  error={!!errors.staffRecruitment}
                  helperText={errors.staffRecruitment}
                  required
                />
              </Grid>

              <Grid item>
                <FormControl fullWidth error={!!errors.agreementPeriod} required>
                  <InputLabel>Agreement Period</InputLabel>
                  <Select
                    value={data.agreementPeriod || ""}
                    onChange={handleChange}
                    name="agreementPeriod"
                    label="Agreement Period*"
                  >
                    {agreementPeriods.map((period) => (
                      <MenuItem key={period} value={period}>
                        {period}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.agreementPeriod && (
                    <FormHelperText error>{errors.agreementPeriod}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
        </Grid>
        
      </Grid>
      <Divider 
  sx={{ 
    my: 2, // vertical margin
    backgroundColor: 'rgba(0, 0, 0, 0.08)', // light gray color
    height: '1px' // thin line
  }} 
/>
      <Grid item xs={12}>
          
            <Typography variant="h6"  color="#ff9800" sx={{ mb: 2, fontWeight: "bold" }}>
              Business Model
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
                gap: 2,
              }}
            >
               <Grid item>
                <FormControl component="fieldset" fullWidth error={!!errors.statergicPlan} required>
                  <FormLabel component="legend" >Do you have a Strategic Business plan? to drive your business</FormLabel>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {statergicPlan.map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type}
                        checked={data.statergicPlan === type}
                        onChange={() =>
                          handleChange({
                            target: { name: "statergicPlan", value: type },
                          })
                        }
                      />
                    ))}
                  </Box>
                  {errors.statergicPlan && (
                    <FormHelperText error>{errors.statergicPlan}</FormHelperText>
                  )}
                </FormControl>
                
              </Grid>
               <Grid item>
                <FormControl component="fieldset" fullWidth error={!!errors.operatingProcedure} required>
                  <FormLabel component="legend" >Do you have a Standard Operating procedure for your franchise business?</FormLabel>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {operatingProcedure.map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type}
                        checked={data.operatingProcedure === type}
                        onChange={() =>
                          handleChange({
                            target: { name: "operatingProcedure", value: type },
                          })
                        }
                      />
                    ))}
                  </Box>
                  {errors.operatingProcedure && (
                    <FormHelperText error>{errors.operatingProcedure}</FormHelperText>
                  )}
                </FormControl>
                
              </Grid>
               <Grid item>
  <FormControl component="fieldset" fullWidth error={!!errors.finacialOperating} required>
    <FormLabel component="legend">
      Do you have a Financial Operating procedure for your franchise business?
    </FormLabel>
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {finacialOperating.map((type) => (
        <FormControlLabel
          key={type}
          value={type}
          control={<Radio />}
          label={type}
          checked={data.finacialOperating === type}
          onChange={() =>
            handleChange({
              target: { name: "finacialOperating", value: type },
            })
          }
        />
      ))}
    </Box>
    {errors.finacialOperating && (
      <FormHelperText error>{errors.finacialOperating}</FormHelperText>
    )}
  </FormControl>
</Grid>
               <Grid item>
                <FormControl component="fieldset" fullWidth error={!!errors.marketingSales} required>
                  <FormLabel component="legend" >Do you have a Marketing and Sales plan to expand across India?</FormLabel>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {marketingSales.map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type}
                        checked={data.marketingSales === type}
                        onChange={() =>
                          handleChange
                          ({
                            target: { name: "marketingSales", value: type },
                          })
                        }
                      />
                    ))}
                  </Box>
                  {errors.marketingSales && (
                    <FormHelperText error>{errors.marketingSales}</FormHelperText>
                  )}
                </FormControl>
                
              </Grid>
               <Grid item>
                <FormControl component="fieldset" fullWidth error={!!errors.agreementFranchise} required>
                  <FormLabel component="legend" >Do you have a customized franchise agreement?</FormLabel>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {agreementFranchise.map((type) => (
                      <FormControlLabel
                        key={type}
                        value={type}
                        control={<Radio />}
                        label={type}
                        checked={data.agreementFranchise === type}
                        onChange={() =>
                          handleChange({
                            target: { name: "agreementFranchise", value: type },
                          })
                        }
                      />
                    ))}
                  </Box>
                  {errors.agreementFranchise && (
                    <FormHelperText error>{errors.agreementFranchise}</FormHelperText>
                  )}
                </FormControl>
                
              </Grid>

              
            </Grid>
    
        </Grid>
      
    </Box>
  );
};

export default FranchiseDetails;


