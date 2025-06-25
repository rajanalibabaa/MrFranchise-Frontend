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
  FormGroup,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import { useState } from "react";
import categories from "./BrandCategories";
import { Editor } from "@tinymce/tinymce-react";

import DeleteIcon from "@mui/icons-material/Delete";

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
  const [currentUSP, setCurrentUSP] = useState("");

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

    setCurrentFicoModel((prev) => {
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
    setCurrentFicoModel((prev) => ({
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
    "Single Unit",
    "Multi unit ",
    "Master Franchise",
    "City Franchise",
    "Area Franchise",
    "District Franchise",
    "State Franchise",
  ];

  const franchiseModels = ["FOFO ", "FOCO ", "FICO ", "COCO ", "KIOSK"];

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

  const aidFinancing = ["Yes", "No"];

  const agreementPeriods = [
    "1 Year",
    "3 Years",
    "5 Years",
    "7 Years",
    "10 Years",
  ];

  const [selectedCategory, setSelectedCategory] = useState({
    groupId: data.brandCategories?.groupId || "",
    main: data.brandCategories?.main || "",
    sub: data.brandCategories?.sub || "",
    child: data.brandCategories?.child || "",
  });

  // Handler for main category change
  const handleMainCategoryChange = (e) => {
    const mainCategory = e.target.value;
    const newCategory = {
      groupId: "", // Reset groupId when main category changes
      main: mainCategory,
      sub: "",
      child: "",
    };

    setSelectedCategory(newCategory);
    onChange({ brandCategories: newCategory });
  };

  // Handler for sub category change
  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value;
    // Find the groupId for the selected sub-category
    const group = categories
      .find((cat) => cat.name === selectedCategory.main)
      ?.children?.find((sub) => sub.name === subCategory);

    const newCategory = {
      groupId: group?.groupId || "",
      main: selectedCategory.main,
      sub: subCategory,
      child: "",
    };

    setSelectedCategory(newCategory);
    onChange({ brandCategories: newCategory });
  };

  // Handler for child category change
  const handleChildCategoryChange = (e) => {
    const childCategory = e.target.value;
    const newCategory = {
      ...selectedCategory,
      child: childCategory,
    };

    setSelectedCategory(newCategory);
    onChange({ brandCategories: newCategory });
  };

  // Add this handler function
  const handleDescriptionChange = (content) => {
    onChange({ brandDescription: content }); // Update the parent form data directly
  };

// Add a new USP
const handleAddUSP = () => {
  const trimmedUSP = currentUSP.trim();
  if (!trimmedUSP) return;

  // Prevent duplicates (case-insensitive)
  const existingUSPs = (data.uniqueSellingPoints || []).map(usp => 
    usp.toLowerCase().trim()
  );
  
  if (existingUSPs.includes(trimmedUSP.toLowerCase())) {
    // You might want to show an error message here
    return;
  }

  const updatedUSPs = [...(data.uniqueSellingPoints || []), trimmedUSP];
  onChange({ uniqueSellingPoints: updatedUSPs });
  setCurrentUSP("");
};

// Remove a USP
const handleRemoveUSP = (index) => {
  const updatedUSPs = [...(data.uniqueSellingPoints || [])];
  updatedUSPs.splice(index, 1);
  onChange({ uniqueSellingPoints: updatedUSPs });
};

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 25 }, ml: { sm: 0, md: 25 } }}>
      {/* Brand Categories Section */}
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 3, color: "#4caf50" }}
      >
        Franchise Details
      </Typography>

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Brand Categories
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium">
            <InputLabel>Industries</InputLabel>
            <Select
              value={selectedCategory.main || ""}
              label="Industries"
              onChange={handleMainCategoryChange}
              error={!!errors.mainCategory}
            >
              {categories.map((category) => (
                <MenuItem key={category.name} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.mainCategory && (
              <FormHelperText error>{errors.mainCategory}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl
            fullWidth
            size="medium"
            disabled={!selectedCategory.main}
          >
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedCategory.sub || ""}
              label="Main Category"
              onChange={handleSubCategoryChange}
              error={!!errors.subCategory}
            >
              {selectedCategory.main &&
                categories
                  .find((cat) => cat.name === selectedCategory.main)
                  ?.children?.map((subCategory) => (
                    <MenuItem key={subCategory.name} value={subCategory.name}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
            </Select>
            {errors.subCategory && (
              <FormHelperText error>{errors.subCategory}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium" disabled={!selectedCategory.sub}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={selectedCategory.child || ""}
              label="Sub Category"
              onChange={handleChildCategoryChange}
              error={!!errors.childCategory}
            >
              {selectedCategory.sub &&
                categories
                  .find((cat) => cat.name === selectedCategory.main)
                  ?.children?.find((sub) => sub.name === selectedCategory.sub)
                  ?.children?.map((child, index) => (
                    <MenuItem key={index} value={child}>
                      {child}
                    </MenuItem>
                  ))}
            </Select>
            {errors.childCategory && (
              <FormHelperText error>{errors.childCategory}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      {/* 
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(1,1fr)", xs: "1fr" },
          gap: 2,
        }}
      > */}
      {/* Establishment & Franchise year Details */}

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Establishment & Franchise year Details
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
        }}
      >
        {/* Established Year */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth error={!!errors.establishedYear}>
            <InputLabel size="medium">Year Commenced Operations</InputLabel>
            <Select
              name="establishedYear"
              value={data.establishedYear || ""}
              label="Year Commenced Operations"
              onChange={handleChange}
              variant="outlined"
              size="medium"
              required
            >
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {errors.establishedYear && (
              <Typography variant="caption" color="error">
                {errors.establishedYear}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Franchise Since Year */}
        <Grid item xs={12} sm={6} md={2.4}>
          <FormControl fullWidth error={!!errors.franchiseSinceYear}>
            <InputLabel size="medium">Year Commenced Franchising</InputLabel>
            <Select
              name="franchiseSinceYear"
              value={data.franchiseSinceYear || ""}
              label="Year Commenced Franchising"
              onChange={handleChange}
              variant="outlined"
              size="medium"
              required
            >
              {Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {errors.franchiseSinceYear && (
              <Typography variant="caption" color="error">
                {errors.franchiseSinceYear}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* Franchise Network */}

      <Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
        Franchise Network
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
        }}
      >
        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Company Owned Outlets"
            name="companyOwnedOutlets"
            value={data.companyOwnedOutlets || ""}
            onChange={handleChange}
            placeholder="0"
            type="number"
            inputProps={{ min: 0 }}
            error={!!errors.companyOwnedOutlets}
            helperText={errors.companyOwnedOutlets}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <TextField
            fullWidth
            label="Franchise Outlets"
            name="franchiseOutlets"
            value={data.franchiseOutlets || ""}
            onChange={handleChange}
            placeholder="0"
            type="number"
            inputProps={{ min: 0 }}
            error={!!errors.franchiseOutlets}
            helperText={errors.franchiseOutlets}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
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

      {/* Franchise Details Section */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mt: 2, color: "#ff9800" }}
      >
        Franchise Business Models
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
          display: "grid",
          gridTemplateColumns: { md: "repeat(4, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
          mt: 2,
        }}
      >
        {/* Column 1 - Franchise Model */}
        <Grid item>
          <FormControl
            fullWidth
            error={!!errors.franchiseModel}
            required
            size="medium"
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
              <FormHelperText error>{errors.franchiseModel}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 2 - Franchise Type */}
        <Grid item>
          <FormControl
            fullWidth
            error={!!errors.franchiseType}
            required
            size="medium"
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
              <FormHelperText error>{errors.franchiseType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 3 - Investment Range */}
        <Grid item>
          <FormControl
            fullWidth
            error={!!errors.investmentRange}
            required
            size="medium"
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
              <FormHelperText error>{errors.investmentRange}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 4 - Area Required */}
        <Grid item>
          <FormControl
            fullWidth
            size="medium"
            required
            error={!!errors.areaRequired}
          >
            <InputLabel>Area Required</InputLabel>
            <Select
              label="Area Required"
              name="areaRequired"
              value={currentFicoModel.areaRequired || ""}
              onChange={handleFicoChange}
              endAdornment={
                <InputAdornment position="end" sx={{ mr: 2 }}>
                  sq.ft
                </InputAdornment>
              }
            >
              <MenuItem value="No Space Required">No Space Required</MenuItem>
              <MenuItem value="100-200 Sq. Ft.">100-200 Sq. Ft.</MenuItem>
              <MenuItem value="200-500 Sq. Ft.">200-500 Sq. Ft.</MenuItem>
              <MenuItem value="500-1,000 Sq. Ft.">500-1,000 Sq. Ft.</MenuItem>
              <MenuItem value="1,000-2,000 Sq. Ft.">
                1,000-2,000 Sq. Ft.
              </MenuItem>
              <MenuItem value="2,000-3,000 Sq. Ft.">
                2,000-3,000 Sq. Ft.
              </MenuItem>
              <MenuItem value="3,000-5,000 Sq. Ft.">
                3,000-5,000 Sq. Ft.
              </MenuItem>
              <MenuItem value="5,000-7,000 Sq. Ft.">
                5,000-7,000 Sq. Ft.
              </MenuItem>
              <MenuItem value="7,000-10,000 Sq. Ft.">
                7,000-10,000 Sq. Ft.
              </MenuItem>
              <MenuItem value="10,000-15,000 Sq. Ft.">
                10,000-15,000 Sq. Ft.
              </MenuItem>
            </Select>
            {errors.areaRequired && (
              <FormHelperText error>{errors.areaRequired}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 5 agreementPeriod */}
        <Grid item>
          <FormControl
            fullWidth
            error={!!errors.agreementPeriod}
            required
            size="medium"
          >
            <TextField
              label="Agreement Period"
              type="number"
              name="agreementPeriod"
              value={currentFicoModel.agreementPeriod}
              onChange={handleFicoChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 2 }}>
                    years
                  </InputAdornment>
                ),
                inputProps: { max: 100 },
              }}
            />
            {errors.agreementPeriod && (
              <FormHelperText error>{errors.agreementPeriod}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 6 - Franchise Fee */}

        <Grid item>
          <TextField
            fullWidth
            size="medium"
            label="Franchise Fee (₹)"
            name="franchiseFee"
            value={currentFicoModel.franchiseFee}
            onChange={handleFicoChange}
            error={!!errors.franchiseFee}
            helperText={errors.franchiseFee}
            InputProps={{
              endAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>

        {/* Column 7 - Interior Cost */}
        <Grid item>
          <TextField
            fullWidth
            size="medium"
            label="Interior Cost (₹)"
            name="interiorCost"
            value={currentFicoModel.interiorCost}
            onChange={handleFicoChange}
            error={!!errors.interiorCost}
            helperText={errors.interiorCost}
            InputProps={{
              endAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>

        {/* Column 8 - Stock Investment */}
        <Grid item>
          <TextField
            fullWidth
            size="medium"
            label="Stock Investment (₹)"
            name="stockInvestment"
            value={currentFicoModel.stockInvestment}
            onChange={handleFicoChange}
            error={!!errors.stockInvestment}
            helperText={errors.stockInvestment}
            InputProps={{
              endAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>

        {/* Column 9 - Other Cost */}
        <Grid item>
          <TextField
            fullWidth
            size="medium"
            label=" Required Additional Cost (₹)"
            name="otherCost"
            value={currentFicoModel.otherCost}
            onChange={handleFicoChange}
            error={!!errors.otherCost}
            helperText={errors.otherCost}
            InputProps={{
              endAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>

        {/* Column 10 - Required Investment Capital */}
        <Grid item>
          <TextField
            fullWidth
            size="medium"
            label="Annual Working Capital (₹)"
            name="requireWorkingCapital"
            value={currentFicoModel.requireWorkingCapital}
            onChange={handleFicoChange}
            error={!!errors.requireWorkingCapital}
            helperText={errors.requireWorkingCapital}
            InputProps={{
              endAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
            required
          />
        </Grid>

        {/* Column 11 - Royalty Fee */}
        <Grid item>
          <TextField
            fullWidth
            size="medium"
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

        {/* Column 12 - Break Even */}
        <Grid item>
          <FormControl
            fullWidth
            size="medium"
            required
            error={!!errors.breakEven}
          >
            <InputLabel>Break Even (months)</InputLabel>
            <Select
              label="Break Even (months)*"
              name="breakEven"
              value={currentFicoModel.breakEven || ""}
              onChange={handleFicoChange}
            >
              <MenuItem value="0 to 6 Months">0 to 6 Months</MenuItem>
              <MenuItem value="6 to 12 Months">6 to 12 Months</MenuItem>
              <MenuItem value="12 to 18 Months">12 to 18 Months</MenuItem>
              <MenuItem value="18 to 24 Months">18 to 24 Months</MenuItem>
              <MenuItem value="24 to 36 Months">24 to 36 Months</MenuItem>
              <MenuItem value="36 to 48 Months">36 to 48 Months</MenuItem>
              <MenuItem value="48 to 60 Months">48 to 60 Months</MenuItem>
            </Select>
            {errors.breakEven && (
              <FormHelperText error>{errors.breakEven}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Column 13 - ROI */}

        <Grid item>
          <FormControl fullWidth size="medium" required error={!!errors.roi}>
            <InputLabel>ROI (%)</InputLabel>
            <Select
              label="ROI (%)"
              name="roi"
              value={currentFicoModel.roi || ""}
              onChange={handleFicoChange}
            >
              {Array.from({ length: 99 }, (_, i) => (
                <MenuItem
                  key={i + 1}
                  value={`${i + 1}%`}
                  sx={{
                    minWidth: 0,
                    padding: "6px 4px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
            {errors.roi && <FormHelperText error>{errors.roi}</FormHelperText>}
          </FormControl>
        </Grid>

        {/* Column 14 - PayBack Period */}
        <Grid item>
          <TextField
            fullWidth
            size="medium"
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

        <Grid item>
          <FormControl
            fullWidth
            size="medium"
            required
            error={!!errors.marginOnSales}
          >
            <InputLabel>marginOnSales (%)</InputLabel>
            <Select
              label="Margin ON Sales (%)"
              name="marginOnSales"
              value={currentFicoModel.marginOnSales || ""}
              onChange={handleFicoChange}
            >
              {Array.from({ length: 99 }, (_, i) => (
                <MenuItem
                  key={i + 1}
                  value={`${i + 1}%`}
                  sx={{
                    minWidth: 0,
                    padding: "6px 4px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
            {errors.marginOnSales && (
              <FormHelperText error>{errors.marginOnSales}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* Add Button */}
      <Grid
        item
        xs={12}
        mt={1}
        sx={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <Button
          variant="contained"
          onClick={handleAddFicoModel}
          size="large"
          sx={{
            backgroundColor: "#4caf50",
            color: "#fff",
            "&:hover": { backgroundColor: "#388e3c" },
            padding: "8px 70px",
          }}
        >
          Add Models
        </Button>
      </Grid>

      {data.fico.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Saved Franchise Models
          </Typography>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table
                stickyHeader
                aria-label="saved franchise models"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Model Type
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Franchise Type
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Investment Range
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Area Required
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Agreement Period
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Franchise Fee
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Interior Cost
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Stock Cost
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Additional Cost
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Annual Working Capital
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Royalty Fee
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Break Even
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      ROI (%)
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Payback
                    </TableCell>

                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Margin On Sales
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.fico?.map((model, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{model.franchiseModel}</TableCell>
                      <TableCell>{model.franchiseType}</TableCell>
                      <TableCell>{model.investmentRange}</TableCell>
                      <TableCell>{model.areaRequired} sq.ft</TableCell>
                      <TableCell>{model.agreementPeriod}</TableCell>
                      <TableCell>₹{model.franchiseFee}</TableCell>
                      <TableCell>₹{model.interiorCost}</TableCell>
                      <TableCell>₹{model.stockCost}</TableCell>
                      <TableCell>₹{model.otherCost}</TableCell>
                      <TableCell>₹{model.requireWorkingCapital}</TableCell>
                      <TableCell>{model.royaltyFee}</TableCell>
                      <TableCell>{model.breakEven} months</TableCell>
                      <TableCell>{model.roi}%</TableCell>
                      <TableCell>{model.payBackPeriod}</TableCell>
                      <TableCell>{model.marginOnSales}%</TableCell>
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
          mt: 4,
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          height: "1px",
        }}
      />

      {/* Support and Training Section */}
      <Grid item xs={12}>
        <Typography variant="h6" color="#ff9800" sx={{ fontWeight: "bold" }}>
          Support and Training
        </Typography>

        <Grid
          container
          gap={1}
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: { md: "1fr", xs: "1fr" },
          }}
        >
          {/* Financial Operating Procedure */}
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.aidFinancing}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
            >
              <Box sx={{ mr: { md: "247px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.aidFinancing ? "error.main" : "text.primary",
                  }}
                >
                  Do you provide aid in financing?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", gap: 2 }}>
                {aidFinancing.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.aidFinancing ? "error" : "primary"}
                      />
                    }
                    label={type}
                    checked={data.aidFinancing === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "aidFinancing", value: type },
                      })
                    }
                  />
                ))}
              </RadioGroup>
              {errors.aidFinancing && (
                <FormHelperText
                  error
                  sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
                >
                  {errors.aidFinancing}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.franchiseDevelopment}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
            >
              <Box sx={{ mr: { md: "106px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.franchiseDevelopment
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Would you like consultation for franchise development?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", gap: 2 }}>
                {aidFinancing.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={
                          errors.franchiseDevelopment ? "error" : "primary"
                        }
                      />
                    }
                    label={type}
                    checked={data.franchiseDevelopment === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "franchiseDevelopment", value: type },
                      })
                    }
                  />
                ))}
              </RadioGroup>
              {errors.franchiseDevelopment && (
                <FormHelperText
                  error
                  sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
                >
                  {errors.franchiseDevelopment}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              error={!!errors.consultationOrAssistance}
              required
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
            >
              <Box sx={{ mr: { md: "35px" }, minWidth: { md: "300px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                    color: errors.consultationOrAssistance
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Would you like consultation for marketing recruitment
                  franchise?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", gap: 2 }}>
                {aidFinancing.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={
                          errors.consultationOrAssistance ? "error" : "primary"
                        }
                      />
                    }
                    label={type}
                    checked={data.consultationOrAssistance === type}
                    onChange={() =>
                      handleChange({
                        target: {
                          name: "consultationOrAssistance",
                          value: type,
                        },
                      })
                    }
                  />
                ))}
              </RadioGroup>
              {errors.consultationOrAssistance && (
                <FormHelperText
                  error
                  sx={{ ml: { md: 2 }, mt: { xs: 0, md: 0 } }}
                >
                  {errors.consultationOrAssistance}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Training Support - Checkbox Group */}
          <Grid item xs={12}>
            <FormControl
              component="fieldset"
              fullWidth
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: { xs: 1, md: 7 },
                p: 1,
              }}
            >
              <Box sx={{ minWidth: { md: "250px" } }}>
                <FormLabel
                  component="legend"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Training And Support Provider:
                </FormLabel>
              </Box>
              <FormGroup
                row
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                {[
                  "Outlet Setup",
                  "Staff training",
                  "Staff Recruitment",
                  "Operations support",
                  "Marketing support",
                ].map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={
                          data.trainingSupport?.includes(option) || false
                        }
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(data.trainingSupport || []), option]
                            : (data.trainingSupport || []).filter(
                                (v) => v !== option
                              );
                          handleChange({
                            target: {
                              name: "trainingSupport",
                              value: newValue,
                            },
                          });
                        }}
                        name="trainingSupport"
                        color="primary"
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>

          {/* Marketing Support - Text Input */}
          {/* <Grid item xs={12}>
            <FormControl
              fullWidth
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
            >
              <FormLabel
                sx={{
                  minWidth: { md: "300px" },
                  fontWeight: "bold",
                }}
              >
                Marketing Support:
              </FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={data.marketingSupport || ""}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "marketingSupport",
                      value: e.target.value,
                    },
                  })
                }
                sx={{
                  width: "63%",
                }}
              />
            </FormControl>
          </Grid> */}

          {/* Other Support Provided - Multi-line Text */}
          {/* <Grid item xs={12}>
            <FormControl
              fullWidth
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { md: "center" },
                gap: 1,
                p: 1,
              }}
            >
              <FormLabel
                sx={{
                  minWidth: { md: "300px" },
                  fontWeight: "bold",
                }}
              >
                Other Support Provided:
              </FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={data.otherSupport || ""}
                onChange={(e) =>
                  handleChange({
                    target: { name: "otherSupport", value: e.target.value },
                  })
                }
                multiline
                rows={1}
                sx={{
                  width: "63%",
                }}
              />
            </FormControl>
          </Grid> */}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="h6"
          color="#ff9800"
          sx={{ mb: 2, mt: 4, fontWeight: "bold" }}
        >
          Brand Description
        </Typography>

      <Grid item xs={12}>
  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
    Unique Selling Points (USP):
  </Typography>
  
  {/* USP Input and Add Button */}
  <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
    <TextField
      fullWidth
      variant="outlined"
      value={currentUSP}
      onChange={(e) => setCurrentUSP(e.target.value)}
      placeholder="Add a unique selling point"
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddUSP();
        }
      }}
    />
    <Button
      variant="contained"
      onClick={handleAddUSP}
      disabled={!currentUSP.trim()}
      sx={{
        backgroundColor: "#4caf50",
        color: "white",
        "&:hover": { backgroundColor: "#388e3c" },
        height: "56px",
        minWidth: "100px"
      }}
    >
      Add
    </Button>
  </Box>

  {/* Display added USPs */}
  {(data.uniqueSellingPoints?.length > 0) && (
    <Paper sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        Added USPs:
      </Typography>
      <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
        {data.uniqueSellingPoints.map((usp, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveUSP(index)}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              py: 0.5,
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              "&:last-child": { borderBottom: "none" }
            }}
          >
            <ListItemText 
              primary={`${index + 1}. ${usp}`} 
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )}
</Grid>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Editor
            apiKey="ax88nfnpet4akyi1bpe4gmsnhxabsp2ia0qoitvfd4qjki8v"
            value={data.brandDescription || ""}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
               alignleft aligncenter alignright alignjustify | \
               bullist numlist outdent indent | removeformat | help | image",
              images_upload_url: "/api/upload-image",
              automatic_uploads: true,
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={handleDescriptionChange}
          />
          {errors.description && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {errors.description}
            </Typography>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default FranchiseDetails;
