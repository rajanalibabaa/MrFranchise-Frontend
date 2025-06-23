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
import { Editor } from "@tinymce/tinymce-react";

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
    averageMonthlySales: "",
    profitMargin: "",
    averageFootfall: "",
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
      !currentFicoModel.agreementPeriod ||
      !currentFicoModel.averageMonthlySales ||
      !currentFicoModel.profitMargin
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
      averageMonthlySales: "",
      profitMargin: "",
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

  const franchiseModels = ["FOFO ", "FOCO ", "FICO ", "COCO ","KIOSK"];

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
  groupId: data.brandCategories?.groupId || "",
  main: data.brandCategories?.main || "",
  sub: data.brandCategories?.sub || "",
  child: data.brandCategories?.child || ""
});

// Handler for main category change
const handleMainCategoryChange = (e) => {
  const mainCategory = e.target.value;
  const newCategory = {
    groupId: "", // Reset groupId when main category changes
    main: mainCategory,
    sub: "",
    child: ""
  };
  
  setSelectedCategory(newCategory);
  onChange({ brandCategories: newCategory });
};

// Handler for sub category change
const handleSubCategoryChange = (e) => {
  const subCategory = e.target.value;
  // Find the groupId for the selected sub-category
  const group = categories.find(cat => cat.name === selectedCategory.main)
    ?.children?.find(sub => sub.name === subCategory);
  
  const newCategory = {
    groupId: group?.groupId || "",
    main: selectedCategory.main,
    sub: subCategory,
    child: ""
  };
  
  setSelectedCategory(newCategory);
  onChange({ brandCategories: newCategory });
};

// Handler for child category change
const handleChildCategoryChange = (e) => {
  const childCategory = e.target.value;
  const newCategory = {
    ...selectedCategory,
    child: childCategory
  };
  
  setSelectedCategory(newCategory);
  onChange({ brandCategories: newCategory });
};


  // Add this handler function
  const handleDescriptionChange = (content) => {
    onChange({ brandDescription: content }); // Update the parent form data directly
  };

  return (
    <Box sx={{ ml: 2, pr: 1 }}>
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
          gridTemplateColumns: { md: "repeat(3, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
        }}
      >
       <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="medium">
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedCategory.main || ""}
              label="Main Category"
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
          <FormControl fullWidth size="medium" disabled={!selectedCategory.main}>
            <InputLabel>Sub Category</InputLabel>
            <Select
              value={selectedCategory.sub || ""}
              label="Sub Category"
              onChange={handleSubCategoryChange}
              error={!!errors.subCategory}
            >
              {selectedCategory.main &&
                categories
                  .find(cat => cat.name === selectedCategory.main)
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
            <InputLabel>Child Category</InputLabel>
            <Select
              value={selectedCategory.child || ""}
              label="Child Category"
              onChange={handleChildCategoryChange}
              error={!!errors.childCategory}
            >
              {selectedCategory.sub &&
                categories
                  .find(cat => cat.name === selectedCategory.main)
                  ?.children?.find(sub => sub.name === selectedCategory.sub)
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

        <Grid
            container
            spacing={2}
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "repeat(2, 1fr)", xs: "1fr" },
           
            }}
          >
        <Grid item xs={12} sm={6} md={2.4}>
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
              gridTemplateColumns: { md: "repeat(2, 1fr)", xs: "1fr" },
              gap: 2,
              mb: 2,
            }}
          >
            {/* Established Year  */}
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
                <InputLabel size="medium">
                  Year Commenced Franchising
                </InputLabel>
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

           </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2, color: "#ff9800" }}
            >
              Franchise Network
            </Typography>

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
          </Grid>
       
      </Grid>

      {/* Rest of the component remains the same */}

      {/* Franchise Network Section */}

      {/* 
      </Grid> */}

      {/* Franchise Details Section */}
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 0, color: "#ff9800" }}
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
          gridTemplateColumns: { md: "repeat(6, 1fr)", xs: "1fr" },
          gap: 2,
          mb: 2,
          mt: 2,
        }}
      >
        {/* Column 1 - Investment Range */}
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

        {/* Column 2 - Area Required */}
        <Grid item>
          <TextField
            fullWidth
            size="medium"
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

        {/* Column 4 - Franchise Type */}
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

        {/* Column 5 - Franchise Fee */}
        
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
              endAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
          />
        </Grid>

        {/* Column 6 - Royalty Fee */}
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
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
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
        <Grid item>
          <TextField
            fullWidth
            size="medium"
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
        <Grid item>
          <TextField
            fullWidth
            size="medium"
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

        {/* Column 12 - Break Even */}
        <Grid item>
          <TextField
            fullWidth
            size="medium"
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
        <Grid item>
          <TextField
            fullWidth
            size="medium"
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
        <Grid item>
          <TextField
            fullWidth
            size="medium"
            label="Margin On Sales"
            name="marginOnSales"
            value={currentFicoModel.marginOnSales}
            onChange={handleFicoChange}
            error={!!errors.marginOnSales}
            helperText={errors.marginOnSales}
            required
          />
        </Grid>

        <Grid item>
          <FormControl
            fullWidth
            error={!!errors.agreementPeriod}
            required
            size="medium"
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
              <FormHelperText error>{errors.agreementPeriod}</FormHelperText>
            )}
          </FormControl>
        </Grid>
         <Grid item>
          <TextField
            fullWidth
            size="medium"
            label="Average Monthly Sales (₹) per Outlet"
            name="averageMonthlySales"
            value={currentFicoModel.averageMonthlySales}
            onChange={handleFicoChange}
            error={!!errors.averageMonthlySales}
            helperText={errors.averageMonthlySales}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
          />
        </Grid>
         <Grid item>
          <TextField
            fullWidth
            size="medium"
            label="Profit Margin (%)"
            name="profitMargin"
            value={currentFicoModel.profitMargin}
            onChange={handleFicoChange}
            error={!!errors.profitMargin}
            helperText={errors.profitMargin}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
          />
        </Grid>
         <Grid item>
          <TextField
            fullWidth
            size="medium"
            label="Average Footfall"
            name="averageFootfall"
            value={currentFicoModel.averageFootfall}
            onChange={handleFicoChange}
            error={!!errors.averageFootfall}
            helperText={errors.averageFootfall  }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
          />
        </Grid>

      
      </Grid>


        {/* Add Button */}
        <Grid item xs={12} mt={1} sx={{ display: "flex", justifyContent: "space-evenly" }}>
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
            Add 
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
                      Model
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Investment Range
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Area
                    </TableCell>
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
                      Franchise Fee
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Royalty Fee
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
                      Break Even
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Working Capital
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Margin On Sales
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Agreement Period
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

      <Divider />

      {/* Support and Training Section */}

      <Typography
        variant="h6"
        color="#ff9800"
        sx={{ mb: 2, mt: 2, fontWeight: "bold" }}
      >
        Support and Training
      </Typography>

      <Grid gap={1} item xs={12}>
        {/* Financial Operating Procedure */}
        <Grid item>
          <FormControl
            component="fieldset"
            fullWidth
            error={!!errors.aidFinancing}
            required
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              p: 1,
            }}
          >
            <Box>
              <FormLabel
                component="legend"
                sx={{
                  minWidth: "300px",
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
                    <Radio color={errors.aidFinancing ? "error" : "primary"} />
                  }
                  label={type}
                  checked={data.aidFinancing === type}
                  onChange={() =>
                    handleChange({
                      target: { name: "finacialOperating", value: type },
                    })
                  }
                />
              ))}
            </RadioGroup>
            {errors.aidFinancing && (
              <FormHelperText error sx={{ ml: 2 }}>
                {errors.aidFinancing}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl
            component="fieldset"
            fullWidth
            error={!!errors.recruitmentSupport}
            required
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              p: 1,
            }}
          >
            <Box>
              <FormLabel
                component="legend"
                sx={{
                  minWidth: "300px",
                  fontWeight: "bold",
                  color: errors.recruitmentSupport
                    ? "error.main"
                    : "text.primary",
                }}
              >
                Recruitment Support
              </FormLabel>
            </Box>
            <RadioGroup row sx={{ display: "flex", gap: 2 }}>
              {aidFinancing.map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={
                    <Radio
                      color={errors.recruitmentSupport ? "error" : "primary"}
                    />
                  }
                  label={type}
                  checked={data.recruitmentSupport === type}
                  onChange={() =>
                    handleChange({
                      target: { name: "recruitmentSupport", value: type },
                    })
                  }
                />
              ))}
            </RadioGroup>
            {errors.recruitmentSupport && (
              <FormHelperText error sx={{ ml: 2 }}>
                {errors.recruitmentSupport}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl
            component="fieldset"
            fullWidth
            error={!!errors.staffRecruitment}
            required
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              p: 1,
            }}
          >
            <Box>
              <FormLabel
                component="legend"
                sx={{
                  minWidth: "300px",
                  fontWeight: "bold",
                  color: errors.staffRecruitment
                    ? "error.main"
                    : "text.primary",
                }}
              >
                Staff Recruitment
              </FormLabel>
            </Box>
            <RadioGroup row sx={{ display: "flex", gap: 2 }}>
              {aidFinancing.map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={
                    <Radio
                      color={errors.staffRecruitment ? "error" : "primary"}
                    />
                  }
                  label={type}
                  checked={data.staffRecruitment === type}
                  onChange={() =>
                    handleChange({
                      target: { name: "staffRecruitment", value: type },
                    })
                  }
                />
              ))}
            </RadioGroup>
            {errors.staffRecruitment && (
              <FormHelperText error sx={{ ml: 2 }}>
                {errors.staffRecruitment}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl
            component="fieldset"
            fullWidth
            error={!!errors.staffTraining}
            required
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              p: 1,
            }}
          >
            <Box>
              <FormLabel
                component="legend"
                sx={{
                  minWidth: "300px",
                  fontWeight: "bold",
                  color: errors.staffTraining ? "error.main" : "text.primary",
                }}
              >
                Staff Training
              </FormLabel>
            </Box>
            <RadioGroup row sx={{ display: "flex", gap: 2 }}>
              {aidFinancing.map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={
                    <Radio color={errors.staffTraining ? "error" : "primary"} />
                  }
                  label={type}
                  checked={data.staffTraining === type}
                  onChange={() =>
                    handleChange({
                      target: { name: "staffTraining", value: type },
                    })
                  }
                />
              ))}
            </RadioGroup>
            {errors.staffTraining && (
              <FormHelperText error sx={{ ml: 2 }}>
                {errors.staffTraining}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl
            component="fieldset"
            fullWidth
            error={!!errors.operationalTraining}
            required
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              p: 1,
            }}
          >
            <Box>
              <FormLabel
                component="legend"
                sx={{
                  minWidth: "300px",
                  fontWeight: "bold",
                  color: errors.operationalTraining
                    ? "error.main"
                    : "text.primary",
                }}
              >
                Operational Training
              </FormLabel>
            </Box>
            <RadioGroup row sx={{ display: "flex", gap: 2 }}>
              {aidFinancing.map((type) => (
                <FormControlLabel
                  key={type}
                  value={type}
                  control={
                    <Radio
                      color={errors.operationalTraining ? "error" : "primary"}
                    />
                  }
                  label={type}
                  checked={data.operationalTraining === type}
                  onChange={() =>
                    handleChange({
                      target: { name: "operationalTraining", value: type },
                    })
                  }
                />
              ))}
            </RadioGroup>
            {errors.operationalTraining && (
              <FormHelperText error sx={{ ml: 2 }}>
                {errors.operationalTraining}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl
            component="fieldset"
            fullWidth
            error={!!errors.advertisementAndMarketing}
            required
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              p: 1,
            }}
          >
            <Box>
              <FormLabel
                component="legend"
                sx={{
                  minWidth: "300px",
                  fontWeight: "bold",
                  color: errors.advertisementAndMarketing
                    ? "error.main"
                    : "text.primary",
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
                      color={
                        errors.advertisementAndMarketing ? "error" : "primary"
                      }
                    />
                  }
                  label={type}
                  checked={data.advertisementAndMarketing === type}
                  onChange={() =>
                    handleChange({
                      target: {
                        name: "advertisementAndMarketing",
                        value: type,
                      },
                    })
                  }
                />
              ))}
            </RadioGroup>
            {errors.advertisementAndMarketing && (
              <FormHelperText error sx={{ ml: 2 }}>
                {errors.advertisementAndMarketing}
              </FormHelperText>
            )}
          </FormControl>
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
                gap: 15,
                p: 1,
              }}
            >
              <Box>
                <FormLabel
                  component="legend"
                  sx={{
                    minWidth: "300px",
                    fontWeight: "bold",
                    color: errors.statergicPlan ? "error.main" : "text.primary",
                  }}
                >
                  Do you have a Strategic Business plan?
                </FormLabel>
              </Box>

              <RadioGroup row sx={{ display: "flex", gap: 2 }}>
                {statergicPlan.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.statergicPlan ? "error" : "primary"}
                      />
                    }
                    label={type}
                    checked={data.statergicPlan === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "statergicPlan", value: type },
                      })
                    }
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
                gap: 8,
                p: 1,
              }}
            >
              <Box>
                <FormLabel
                  component="legend"
                  sx={{
                    minWidth: "300px",
                    fontWeight: "bold",
                    color: errors.operatingProcedure
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Do you have a Standard Operating procedure?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", gap: 2 }}>
                {operatingProcedure.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.operatingProcedure ? "error" : "primary"}
                      />
                    }
                    label={type}
                    checked={data.operatingProcedure === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "operatingProcedure", value: type },
                      })
                    }
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
                gap: 8,
                p: 1,
              }}
            >
              <Box>
                <FormLabel
                  component="legend"
                  sx={{
                    minWidth: "300px",
                    fontWeight: "bold",
                    color: errors.finacialOperating
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Do you have a Financial Operating procedure?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", gap: 2 }}>
                {finacialOperating.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.finacialOperating ? "error" : "primary"}
                      />
                    }
                    label={type}
                    checked={data.finacialOperating === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "finacialOperating", value: type },
                      })
                    }
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
                gap: 13,
                p: 1,
              }}
            >
              <Box>
                <FormLabel
                  component="legend"
                  sx={{
                    minWidth: "300px",
                    fontWeight: "bold",
                    color: errors.marketingSales
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Do you have a Marketing and Sales plan?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", gap: 2 }}>
                {marketingSales.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.marketingSales ? "error" : "primary"}
                      />
                    }
                    label={type}
                    checked={data.marketingSales === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "marketingSales", value: type },
                      })
                    }
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
                gap: 6,
                p: 1,
              }}
            >
              <Box>
                <FormLabel
                  component="legend"
                  sx={{
                    minWidth: "300px",
                    fontWeight: "bold",
                    color: errors.agreementFranchise
                      ? "error.main"
                      : "text.primary",
                  }}
                >
                  Do you have a customized franchise agreement?
                </FormLabel>
              </Box>
              <RadioGroup row sx={{ display: "flex", gap: 2 }}>
                {agreementFranchise.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={
                      <Radio
                        color={errors.agreementFranchise ? "error" : "primary"}
                      />
                    }
                    label={type}
                    checked={data.agreementFranchise === type}
                    onChange={() =>
                      handleChange({
                        target: { name: "agreementFranchise", value: type },
                      })
                    }
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

      <Grid item xs={12}>
        <Typography
          variant="h6"
          color="#ff9800"
          sx={{ mb: 2, mt: 4, fontWeight: "bold" }}
        >
          Brand Description
        </Typography>

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
