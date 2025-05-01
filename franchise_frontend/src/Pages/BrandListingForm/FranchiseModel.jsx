import React ,{useState}from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Typography,
  Button
} from "@mui/material";

const FranchiseModel = ({ data, onChange }) => {
  const [activeStep, setActiveStep] = useState(0);

  const investmentRanges = [
    "Less than ₹5 Lakhs",
    "₹5 - ₹10 Lakhs",
    "₹10 - ₹20 Lakhs",
    "₹20 - ₹50 Lakhs",
    "₹50 Lakhs - ₹1 Cr",
    "Above ₹1 Cr",
  ];

  const modalSteps = [
    "Investment Details",
    "Outlet Distribution",
    "Expansion Plans"
  ];

  const handleFinancialChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Investment Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                size="small"
                label="Investment Range"
                value={data.totalInvestment}
                onChange={handleFinancialChange("totalInvestment")}
                required
              >
                {investmentRanges.map((range, index) => (
                  <MenuItem key={index} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {[
              "franchiseFee",
              "royaltyFee",
              "equipmentCost",
              "expectedRevenue",
              "expectedProfit",
              "spaceRequired",
              "paybackPeriod",
              "minimumCashRequired",
            ].map((field) => {
              const labelMap = {
                franchiseFee: "Franchise Fee (₹)",
                royaltyFee: "Royalty Fee (%)",
                equipmentCost: "Equipment Cost (₹)",
                expectedRevenue: "Expected Monthly Revenue (₹)",
                expectedProfit: "Expected Monthly Profit (₹)",
                spaceRequired: "Space Required (sq ft)",
                paybackPeriod: "Payback Period (months)",
                minimumCashRequired: "Minimum Cash Required (₹)",
              };
              return (
                <Grid item xs={12} md={4} key={field}>
                  <TextField
                    fullWidth
                    label={labelMap[field]}
                    type="number"
                    size="small"
                    value={data[field]}
                    onChange={handleFinancialChange(field)}
                    InputProps={{
                      startAdornment:
                        field.includes("Fee") ||
                        field.includes("Cost") ||
                        field.includes("Revenue") ||
                        field.includes("Profit") ||
                        field.includes("Cash") ? (
                          <InputAdornment position="start">₹</InputAdornment>
                        ) : null,
                      endAdornment: field.includes("royalty") ? (
                        <InputAdornment position="end">%</InputAdornment>
                      ) : field.includes("space") ? (
                        <InputAdornment position="end">sq ft</InputAdornment>
                      ) : field.includes("payback") ? (
                        <InputAdornment position="end">months</InputAdornment>
                      ) : null,
                    }}
                    required
                  />
                </Grid>
              );
            })}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Outlet Distribution
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Company Owned Outlets"
                size="small"
                type="number"
                value={data.companyOwnedOutlets}
                onChange={handleFinancialChange("companyOwnedOutlets")}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Franchise Outlets"
                size="small"
                type="number"
                value={data.franchiseOutlets}
                onChange={handleFinancialChange("franchiseOutlets")}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Outlets"
                size="small"
                type="number"
                value={data.totalOutlets}
                onChange={handleFinancialChange("totalOutlets")}
                required
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Expansion Plans & Payments
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target Cities for Expansion"
                size="small"
                multiline
                rows={2}
                value={data.targetCities}
                onChange={handleFinancialChange("targetCities")}
                placeholder="Enter comma-separated cities"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target States for Expansion"
                size="small"
                multiline
                rows={2}
                value={data.targetStates}
                onChange={handleFinancialChange("targetStates")}
                placeholder="Enter comma-separated states"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Franchise Fee (₹)"
                type="number"
                size="small"
                value={data.expansionFranchiseFee}
                onChange={handleFinancialChange("expansionFranchiseFee")}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Royalty/Commission (%)"
                type="number"
                size="small"
                value={data.expansionRoyalty}
                onChange={handleFinancialChange("expansionRoyalty")}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Terms"
                multiline
                size="small"
                rows={3}
                value={data.paymentTerms}
                onChange={handleFinancialChange("paymentTerms")}
                placeholder="Describe payment terms, installments, and other financial requirements"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "90%", padding: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {modalSteps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ my: 3 }}>{renderStepContent(activeStep)}</Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === modalSteps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default FranchiseModel;