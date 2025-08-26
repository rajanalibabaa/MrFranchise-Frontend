import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const ApplyDrawer = ({
  open,
  onClose,
  isMobile,
  isTablet,
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  locationData,
  investmentRanges,
  investmentTimings,
  readyToInvestOptions,
  selectedBrand,
  userData,
}) => {

  // console.log('userdata ', userData)
  return (
    <Drawer
      anchor={isMobile || isTablet ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: isMobile ? "80vh" : isTablet ? "70vh" : "94vh",
          width: isMobile ? "100%" : isTablet ? "80%" : 430,
          overflow: "auto",
          mx: "auto",
        },
      }}
    >
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#ff9800">
            Apply for Franchise
            <Typography display="flex" flexDirection="column">
              <Typography fontSize="0.7rem" color="black">
                Brand Name: {selectedBrand[0]?.brandDetails?.brandName}
              </Typography>
              <Typography fontSize="0.7rem" color="black">
                Brand Category:{" "}
                {
                  selectedBrand[0]?.brandfranchisedetails?.franchiseDetails
                    ?.brandCategories?.child
                }
              </Typography>
            </Typography>
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid
            spacing={2}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: 2,
            }}
          >
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={ userData?.firstName || ""}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="investorEmail"
                value={ userData?.email || ""}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={ userData?.mobileNumber || ""}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            Select your Store Location
            {/* State Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {locationData.states.map((state, i) => (
                  <MenuItem key={i} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* District Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Cities"
                name="district"
                value={formData.district}
                onChange={handleChange}
                // required
                variant="outlined"
                size="small"
                disabled={!formData.state}
              >
                {locationData.districts.map((district, i) => (
                  <MenuItem key={i} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* City Dropdown */}
            {/*<Grid item xs={12}>
               <TextField
                select
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                // required
                variant="outlined"
                size="small"
                disabled={!formData.district}
              >
                {locationData.cities.map((city, i) => (
                  <MenuItem key={i} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField> 

             
            </Grid>*/}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Investment Range"
                name="investmentRange"
                value={formData.investmentRange}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {investmentRanges.map((range, i) => (
                  <MenuItem key={i} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Plan to Invest"
                name="planToInvest"
                value={formData.planToInvest}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {investmentTimings.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Ready to Invest"
                name="readyToInvest"
                value={formData.readyToInvest}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {readyToInvestOptions.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 2,
                  backgroundColor: "#ff9800",
                  py: 1.5,
                  fontSize: "1rem",
                  "&:disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 2 }}
                    />
                    Submitting...
                  </>
                ) : (
                  "Apply Now"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default ApplyDrawer;
