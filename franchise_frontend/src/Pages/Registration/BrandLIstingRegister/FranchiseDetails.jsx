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
  Divider,
    Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import categories from "./BrandCategories";
import Chip from "@mui/material/Chip";

const FranchiseDetails = ({ data = {}, errors = {}, onChange = () => {} }) => {
  const [currentFicoModel, setCurrentFicoModel] = React.useState({
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
    agreementPeriod: "",
  });

  const [savedFicoModels, setSavedFicoModels] = React.useState([]);

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
    
    setCurrentFicoModel(prev => {
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
          updated.payBackPeriod = `${years} year${
            years !== 1 ? "s" : ""
          } ${months} month${months !== 1 ? "s" : ""}`;
        } else {
          updated.payBackPeriod = "";
        }
      }

      return updated;
    });
  };

  const handleRoyaltyFeeUnitChange = (e) => {
    const { value } = e.target;
    setCurrentFicoModel(prev => ({
      ...prev,
      royaltyFeeUnit: value,
    }));
  };

  const handleAddFicoModel = () => {
    // Validate the model before adding
    if (
      !currentFicoModel.investmentRange ||
      !currentFicoModel.areaRequired ||
      !currentFicoModel.franchiseModel ||
      !currentFicoModel.franchiseType ||
      !currentFicoModel.franchiseFee ||
      !currentFicoModel.royaltyFee ||
      !currentFicoModel.interiorCost ||
      !currentFicoModel.stockCost ||
      !currentFicoModel.otherCost ||
      !currentFicoModel.roi ||
      !currentFicoModel.payBackPeriod ||
      !currentFicoModel.breakEven ||
      !currentFicoModel.requireWorkingCapital ||
      !currentFicoModel.marginOnSales ||
      !currentFicoModel.agreementPeriod 
    ) {
      alert("Please fill in all required fields for the FICO model");
      return;
    }

    const formattedFicoModel = {
      ...currentFicoModel,
      royaltyFee: `${currentFicoModel.royaltyFee}${currentFicoModel.royaltyFeeUnit}`,
    };

    const updatedFico = [...(data.fico || []), formattedFicoModel];
    onChange({ fico: updatedFico });
    setSavedFicoModels(updatedFico);

    // Reset the form
    setCurrentFicoModel({
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
      agreementPeriod: "",
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
  ];

  const franchiseModels = [
    "FOFO ",
    "FOCO ",
    "FICO ",
    "COCO ",
  ];

  const investmentRanges = [
    { label: "Below ₹50K", value: "Below-50,000" },
    { label: "₹50K - ₹2 Lakhs", value: "Rs.50,000-2L" },
    { label: "₹2 - ₹5 Lakhs", value: "Rs.2L-5L" },
    { label: "₹5 - ₹10 Lakhs", value: "Rs.5L-10L" },
    { label: "₹10 - ₹20 Lakhs", value: "Rs.10L-20L" },
    { label: "₹20 - ₹30 Lakhs", value: "Rs.20L-30L" },
    { label: "₹30 - ₹50 Lakhs", value: "Rs.30L-50L" },
    { label: "₹50 Lakhs - ₹1 Crore", value: "Rs.50L-1Cr" },
    { label: "₹1 - ₹2 Crores", value: "Rs.1Cr-2Cr" },
    { label: "₹2 - ₹5 Crores", value: "Rs.2Cr-5Cr" },
    { label: "Above ₹5 Crores", value: "Rs.5Cr-above" },
  ];

  const propertyTypes = ["Owned Property", "Rented Property"];
  const internationalExpansion = ["Yes", "No"];
  const aidFinancing = ["Yes", "No"];
  const statergicPlan = ["Yes", "No"];
  const operatingProcedure = ["Yes", "No"];
  const finacialOperating = ["Yes", "No"];
  const marketingSales = ["Yes", "No"];
  const agreementFranchise = ["Yes", "No"];

  const agreementPeriods = [
    "1 Year",
    "3 Years",
    "5 Years",
    "7 Years",
    "10 Years",
  ];

  const [selectedCategory, setSelectedCategory] = useState({
    groupId: "",
    main: "",
    sub: "",
    child: "",
  });

  const handleMainCategoryChange = (e) => {
    const mainCat = e.target.value;
    setSelectedCategory({
      main: mainCat,
      sub: "",
      child: "",
      groupId: ""
    });
  };
  
  const handleSubCategoryChange = (e) => {
    const subCat = e.target.value;
    const mainCatObj = categories.find(cat => cat.name === selectedCategory.main);
    const subCatObj = mainCatObj?.children?.find(sub => sub.name === subCat);
    
    setSelectedCategory(prev => ({
      ...prev,
      sub: subCat,
      groupId: subCatObj?.groupId || "",
      child: ""
    }));
  };
  
  const handleChildCategoryChange = (e) => {
    setSelectedCategory(prev => ({
      ...prev,
      child: e.target.value
    }));
  };
  
  const handleAddCategory = () => {
    if (selectedCategory.child) {
      const isDuplicate =
        Array.isArray(data.brandCategories) &&
        data.brandCategories.some(
          (cat) =>
            cat.main === selectedCategory.main &&
            cat.sub === selectedCategory.sub &&
            cat.child === selectedCategory.child
        );
  
      if (!isDuplicate) {
        const updatedCategories = [
          ...(Array.isArray(data.brandCategories) ? data.brandCategories : []),
          {
            main: selectedCategory.main,
            sub: selectedCategory.sub,
            child: selectedCategory.child,
            groupId: selectedCategory.groupId
          },
        ];
        onChange({ brandCategories: updatedCategories });
        setSelectedCategory(prev => ({ ...prev, child: "" }));
      }
    }
  };

  return (
    <Box sx={{ ml: 2 , pr: 1 }}>
      {/* Brand Categories Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Brand Categories
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Grid>
          <FormControl fullWidth size="small">
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedCategory.main || ""}
              label="Main Category"
              onChange={handleMainCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.name} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid>
          <FormControl fullWidth size="small" disabled={!selectedCategory.main}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={selectedCategory.sub || ""}
              label="Sub Category"
              onChange={handleSubCategoryChange}
            >
              {selectedCategory.main && 
                categories.find(cat => cat.name === selectedCategory.main)?.children?.map((subCategory) => (
                  <MenuItem key={subCategory.name} value={subCategory.name}>
                    {subCategory.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid>
          <FormControl fullWidth size="small" disabled={!selectedCategory.sub}>
            <InputLabel>Child Category</InputLabel>
            <Select
              value={selectedCategory.child || ""}
              label="Child Category"
              onChange={handleChildCategoryChange}
            >
              {selectedCategory.sub && 
                categories
                  .find(cat => cat.name === selectedCategory.main)
                  ?.children?.find(sub => sub.name === selectedCategory.sub)
                  ?.children?.map((child, index) => (
                    <MenuItem key={index} value={child}>
                      {child}
                    </MenuItem>
                  ))
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Franchise Details Section */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0, color: "#ff9800" }}>
        Franchise Details
      </Typography>

      {/* Show general FICO error if exists */}
      {errors.fico && typeof errors.fico === "string" && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.fico}
        </Typography>
      )}

      {/* Current FICO Model Form */}
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
          flexWrap: "nowrap",
          overflowX: "auto",
          pb: 2,
          pt: 2,
        }}
      >
        {/* Column 1 - Investment Range */}
        <Grid item sx={{ minWidth: 200 }}>
          <FormControl
            fullWidth
            error={!!errors.investmentRange}
            required
            size="small"
          >
            <InputLabel>Investment Range</InputLabel>
            <Select
              value={currentFicoModel.investmentRange}
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
            {errors.investmentRange && (
              <FormHelperText error>
                {errors.investmentRange}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 2 - Area Required */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Area Required"
            name="areaRequired"
            value={currentFicoModel.areaRequired}
            onChange={handleFicoChange}
            error={!!errors.areaRequired}
            helperText={errors.areaRequired}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">sq.ft</InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* Column 3 - Franchise Model */}
        <Grid item sx={{ minWidth: 200 }}>
          <FormControl
            fullWidth
            error={!!errors.franchiseModel}
            required
            size="small"
          >
            <InputLabel>Franchise Model</InputLabel>
            <Select
              value={currentFicoModel.franchiseModel}
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
            {errors.franchiseModel && (
              <FormHelperText error>
                {errors.franchiseModel}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 4 - Franchise Type */}
        <Grid item sx={{ minWidth: 200 }}>
          <FormControl
            fullWidth
            error={!!errors.franchiseType}
            required
            size="small"
          >
            <InputLabel>Franchise Type</InputLabel>
            <Select
              value={currentFicoModel.franchiseType}
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
            {errors.franchiseType && (
              <FormHelperText error>
                {errors.franchiseType}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 5 - Franchise Fee */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Franchise Fee (₹)"
            name="franchiseFee"
            value={currentFicoModel.franchiseFee}
            onChange={handleFicoChange}
            error={!!errors.franchiseFee}
            helperText={errors.franchiseFee}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* Column 6 - Royalty Fee */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Royalty Fee"
            name="royaltyFee"
            value={currentFicoModel.royaltyFee}
            onChange={handleFicoChange}
            error={!!errors.royaltyFee}
            helperText={errors.royaltyFee}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Select
                    value={currentFicoModel.royaltyFeeUnit}
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

        {/* Column 7 - Interior Cost */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Interior Cost (₹)"
            name="interiorCost"
            value={currentFicoModel.interiorCost}
            onChange={handleFicoChange}
            error={!!errors.interiorCost}
            helperText={errors.interiorCost}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* Column 8 - Stock Investment */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Stock Investment (₹)"
            name="stockCost"
            value={currentFicoModel.stockCost}
            onChange={handleFicoChange}
            error={!!errors.stockCost}
            helperText={errors.stockCost}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* Column 9 - Other Cost */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Additional Cost (₹)"
            name="otherCost"
            value={currentFicoModel.otherCost}
            onChange={handleFicoChange}
            error={!!errors.otherCost}
            helperText={errors.otherCost}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* Column 10 - ROI */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="ROI (%)"
            name="roi"
            value={currentFicoModel.roi}
            onChange={handleFicoChange}
            error={!!errors.roi}
            helperText={errors.roi}
            required
          />
        </Grid>

        {/* Column 11 - PayBack Period */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="PayBack Period"
            name="payBackPeriod"
            value={currentFicoModel.payBackPeriod}
            onChange={handleFicoChange}
            error={!!errors.payBackPeriod}
            helperText={errors.payBackPeriod}
            InputProps={{
              readOnly: true,
            }}
            required
          />
        </Grid>

        {/* Column 12 - Break Even */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Break Even (months)*"
            name="breakEven"
            value={currentFicoModel.breakEven}
            onChange={handleFicoChange}
            error={!!errors.breakEven}
            helperText={errors.breakEven}
            required
          />
        </Grid>

        {/* Column 13 - Required Investment Capital */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Required Working Capital"
            name="requireWorkingCapital"
            value={currentFicoModel.requireWorkingCapital}
            onChange={handleFicoChange}
            error={!!errors.requireWorkingCapital}
            helperText={errors.requireWorkingCapital}
            required
          />
        </Grid>

        {/* Column 14 - Margin On Sales */}
        <Grid item sx={{ minWidth: 200 }}>
          <TextField
            fullWidth
            size="small"
            label="Margin On Sales"
            name="marginOnSales"
            value={currentFicoModel.marginOnSales}
            onChange={handleFicoChange}
            error={!!errors.marginOnSales}
            helperText={errors.marginOnSales}
            required
          />
        </Grid>

      <Grid item sx={{ minWidth: 200 }}>
          <FormControl
            fullWidth
            error={!!errors.agreementPeriod}
            required
            size="small"
          >
            <InputLabel>Agreement Period</InputLabel>
            <Select
              value={currentFicoModel.agreementPeriod}
              onChange={handleFicoChange}
              name="agreementPeriod"
              label="Agreement Period"
            >
              {agreementPeriods.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
            {errors.agreementPeriod && (
              <FormHelperText error>
                {errors.agreementPeriod}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* Add Button */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleAddFicoModel}
          size="large"
          sx={{
            backgroundColor: "#4caf50",
            color: "#fff",
            "&:hover": { backgroundColor: "#388e3c" },
          }}
        >
          Add Model
        </Button>
      </Grid>
   

{data.fico.length > 0 && (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Saved Franchise Models
    </Typography>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="saved franchise models" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Model</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Investment Range</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Area</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Model Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Franchise Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Franchise Fee</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Royalty Fee</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Interior Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Stock Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Additional Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ROI (%)</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Payback</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Break Even</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Working Capital</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Margin On Sales</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Agreement Period</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.fico?.map((model, index) => (
              <TableRow 
                key={index} 
                hover 
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{model.investmentRange}</TableCell>
                <TableCell>{model.areaRequired} sq.ft</TableCell>
                <TableCell>{model.franchiseModel}</TableCell>
                <TableCell>{model.franchiseType}</TableCell>
                <TableCell>₹{model.franchiseFee}</TableCell>
                <TableCell>{model.royaltyFee}</TableCell>
                <TableCell>₹{model.interiorCost}</TableCell>
                <TableCell>₹{model.stockCost}</TableCell>
                <TableCell>₹{model.otherCost}</TableCell>
                <TableCell>{model.roi}%</TableCell>
                <TableCell>{model.payBackPeriod}</TableCell>
                <TableCell>{model.breakEven} months</TableCell>
                <TableCell>₹{model.requireWorkingCapital}</TableCell>
                <TableCell>{model.marginOnSales}%</TableCell>
                <TableCell>{model.agreementPeriod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Box>
)}


      <Divider
        sx={{
          my: 2,
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          height: "1px",
        }}
      />
      
      {/* Rest of the component remains the same */}
      <Typography
        variant="h6"
        fontWeight={700}
        color="#ff9800"
        sx={{ mb: 0, fontWeight: "bold" }}
      >
        Franchise Network
      </Typography>
      {/* Franchise Network Section */}

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(3, 0.7fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
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
            inputProps={{ min: 0 }}
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
      </Grid>

      <Grid
        mt={5}
        mb={5}
        display={"Grid"}
        gridTemplateColumns={"repeat(2, 1fr)"}
      >
        <Grid item>
          <FormControl
            component="fieldset"
            fullWidth
            error={!!errors.aidFinancing}
            required
          >
            <FormLabel component="legend">
              Do You Provide Aid In Financing
            </FormLabel>
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
                      target: { name: "aidFinancing", value: type },
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

      <Typography
        variant="h6"
        color="#ff9800"
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        Support and Training
      </Typography>
      {/* Support and Training Section */}
      <Grid
        display={"Grid"}
        gridTemplateColumns={"repeat(4, 1fr)"}
        gap={1}
        item
        xs={12}
      >
        <Grid item>
          <TextField
            select
            label="Requirement Support"
            name="requirementSupport"
            value={data.requirementSupport || ""}
            onChange={handleChange}
            error={!!errors.requirementSupport}
            helperText={errors.requirementSupport}
            required
            sx={{ minWidth: "31vh" }}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>

        <Grid item>
          <TextField
            select
            label="Staff Training"
            name="staffTraining"
            value={data.staffTraining || ""}
            onChange={handleChange}
            error={!!errors.staffTraining}
            helperText={errors.staffTraining}
            required
            sx={{ minWidth: "31vh" }}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Staff Recruitment"
            name="staffRecruitment"
            value={data.staffRecruitment || ""}
            onChange={handleChange}
            error={!!errors.staffRecruitment}
            helperText={errors.staffRecruitment}
            required
            sx={{ minWidth: "31vh" }}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>

      
      </Grid>

      <Divider
        sx={{
          my: 2,
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          height: "1px",
        }}
      />
      <Grid item xs={12}>
        <Typography
          variant="h6"
          color="#ff9800"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Business Model
        </Typography>

     
        <Grid
  container
  spacing={2}
  sx={{
    display: "grid",
    gridTemplateColumns: { md: "repeat(1, 1fr)", xs: "1fr" },
    gap: 2,
  }}
>
  {/* Strategic Business Plan */}
  <Grid item>
    <FormControl
      component="fieldset"
      fullWidth
      error={!!errors.statergicPlan}
      required
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
        gap: 4,
        p: 1
      }}
    >
      <FormLabel component="legend" sx={{ 
        minWidth: '300px',
        fontWeight: 'bold',
        color: errors.statergicPlan ? 'error.main' : 'text.primary'
      }}>
        Do you have a Strategic Business plan? *
      </FormLabel>
      <RadioGroup
        row
        sx={{ display: "flex", gap: 2 }}
      >
        {statergicPlan.map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio color={errors.statergicPlan ? "error" : "primary"} />}
            label={type}
            checked={data.statergicPlan === type}
            onChange={() => handleChange({
              target: { name: "statergicPlan", value: type },
            })}
          />
        ))}
      </RadioGroup>
      {errors.statergicPlan && (
        <FormHelperText error sx={{ ml: 2 }}>
          {errors.statergicPlan}
        </FormHelperText>
      )}
    </FormControl>
  </Grid>

  {/* Standard Operating Procedure */}
  <Grid item>
    <FormControl
      component="fieldset"
      fullWidth
      error={!!errors.operatingProcedure}
      required
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
        gap: 4,
        p: 1
      }}
    >
      <FormLabel component="legend" sx={{ 
        minWidth: '300px',
        fontWeight: 'bold',
        color: errors.operatingProcedure ? 'error.main' : 'text.primary'
      }}>
        Do you have a Standard Operating procedure? *
      </FormLabel>
      <RadioGroup
        row
        sx={{ display: "flex", gap: 2 }}
      >
        {operatingProcedure.map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio color={errors.operatingProcedure ? "error" : "primary"} />}
            label={type}
            checked={data.operatingProcedure === type}
            onChange={() => handleChange({
              target: { name: "operatingProcedure", value: type },
            })}
          />
        ))}
      </RadioGroup>
      {errors.operatingProcedure && (
        <FormHelperText error sx={{ ml: 2 }}>
          {errors.operatingProcedure}
        </FormHelperText>
      )}
    </FormControl>
  </Grid>

  {/* Financial Operating Procedure */}
  <Grid item>
    <FormControl
      component="fieldset"
      fullWidth
      error={!!errors.finacialOperating}
      required
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
        gap: 4,
        p: 1
      }}
    >
      <Box>
      <FormLabel component="legend" sx={{ 
        minWidth: '300px',
        fontWeight: 'bold',
        color: errors.finacialOperating ? 'error.main' : 'text.primary'
      }}>
        Do you have a Financial Operating procedure? *
      </FormLabel>
      </Box>
      <RadioGroup
        row
        sx={{ display: "flex", gap: 2 }}
      >
        {finacialOperating.map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio color={errors.finacialOperating ? "error" : "primary"} />}
            label={type}
            checked={data.finacialOperating === type}
            onChange={() => handleChange({
              target: { name: "finacialOperating", value: type },
            })}
          />
        ))}
      </RadioGroup>
      {errors.finacialOperating && (
        <FormHelperText error sx={{ ml: 2 }}>
          {errors.finacialOperating}
        </FormHelperText>
      )}
    </FormControl>
  </Grid>

  {/* Marketing and Sales Plan */}
  <Grid item>
    <FormControl
      component="fieldset"
      fullWidth
      error={!!errors.marketingSales}
      required
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
        gap: 4,
        p: 1
      }}
    >
      <FormLabel component="legend" sx={{ 
        minWidth: '300px',
        fontWeight: 'bold',
        color: errors.marketingSales ? 'error.main' : 'text.primary'
      }}>
        Do you have a Marketing and Sales plan? *
      </FormLabel>
      <RadioGroup
        row
        sx={{ display: "flex", gap: 2 }}
      >
        {marketingSales.map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio color={errors.marketingSales ? "error" : "primary"} />}
            label={type}
            checked={data.marketingSales === type}
            onChange={() => handleChange({
              target: { name: "marketingSales", value: type },
            })}
          />
        ))}
      </RadioGroup>
      {errors.marketingSales && (
        <FormHelperText error sx={{ ml: 2 }}>
          {errors.marketingSales}
        </FormHelperText>
      )}
    </FormControl>
  </Grid>

  {/* Customized Franchise Agreement */}
  <Grid item>
    <FormControl
      component="fieldset"
      fullWidth
      error={!!errors.agreementFranchise}
      required
      sx={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center",
        gap: 4,
        p: 1
      }}
    >
      <FormLabel component="legend" sx={{ 
        minWidth: '300px',
        fontWeight: 'bold',
        color: errors.agreementFranchise ? 'error.main' : 'text.primary'
      }}>
        Do you have a customized franchise agreement? *
      </FormLabel>
      <RadioGroup
        row
        sx={{ display: "flex", gap: 2 }}
      >
        {agreementFranchise.map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio color={errors.agreementFranchise ? "error" : "primary"} />}
            label={type}
            checked={data.agreementFranchise === type}
            onChange={() => handleChange({
              target: { name: "agreementFranchise", value: type },
            })}
          />
        ))}
      </RadioGroup>
      {errors.agreementFranchise && (
        <FormHelperText error sx={{ ml: 2 }}>
          {errors.agreementFranchise}
        </FormHelperText>
      )}
    </FormControl>
  </Grid>
</Grid>
      </Grid>
    </Box>
  );
};

export default FranchiseDetails;