
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Breadcrumbs,
  Link,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Badge,
  Drawer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Tabs,
  Tab,
  Rating,
  Alert,
  Chip,
} from "@mui/material";
import {
  Business,
  LocationOn,
  Close,
  Description,
  FilterAlt,
  Search as SearchIcon,
  Clear as ClearIcon,
  Home,
  Store,
  AttachMoney,
  Star,
  StarBorder,
  Share,
  Business as BusinessIcon,
  Facebook,
  Instagram,
  LinkedIn,
  Email,
  AreaChart,
} from "@mui/icons-material";
import { fetchBrands, setFilters, clearFilters } from "../../Redux/Slices/brandSlice.jsx"
import OverviewTab from "./OverviewTab.jsx";

const investmentRangeOptions = [
  { label: "All Ranges", value: "" },
  { label: "Rs.10,000-50,000", value: "Below - Rs.50 " },
  { label: "Rs.2L-5L", value: "Rs.2L-5L" },
  { label: "Rs.5L-10L", value: "Rs.5 L - 10 L" },
  { label: "Rs.10L-20L", value: "Rs.10 L - 20 L" },
  { label: "Rs.20L-30L", value: "Rs.20 L - 30 L" },
  { label: "Rs.30L-50L", value: "Rs.30 L - 50 L" },
  { label: "Rs.50L-1Cr", value: "Rs.50 L - 1 Cr" },
  { label: "Rs.1Cr-2Cr", value: "Rs.1 Cr - 2 Cr" },
  { label: "Rs.2Cr-5Cr", value: "Rs.2 Cr - 5 Cr" },
  { label: "Rs.5Cr-above", value: "Rs.5 Cr - Above" },
];

function BrandList() {
  const dispatch = useDispatch();
  const {
    data: brands,
    filteredData: filteredBrands,
    loading,
    error,
    categories: availableCategories,
    modelTypes: availableModelTypes,
    states: availableStates,
    cities: availableCities,
    filters,
  } = useSelector((state) => state.brands);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleOpenBrand = (brand) => {
    setSelectedBrand(brand);
    setOpenDialog(true);
    setTabValue(0);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand(null);
  };

  const handleFilterChange = (name, value) => {
    dispatch(setFilters({ [name]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const FilterPanel = () => (
    <Box sx={{ width: 280, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        <Button
          size="small"
          onClick={handleClearFilters}
          disabled={activeFilterCount === 0}
          startIcon={<ClearIcon />}
          sx={{ color: "#ff9800" }}
        >
          Clear
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search brands..."
        value={filters.searchTerm}
        onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "#ff9800" }} />,
        }}
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.selectedCategory}
          onChange={(e) => handleFilterChange("selectedCategory", e.target.value)}
          label="Category"
          sx={{
            "& .MuiSelect-icon": {
              color: "#ff9800",
            },
          }}
        >
          <MenuItem value="">
            <em>All Categories</em>
          </MenuItem>
          {availableCategories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Model Type</InputLabel>
        <Select
          value={filters.selectedModelType}
          onChange={(e) => handleFilterChange("selectedModelType", e.target.value)}
          label="Model Type"
          sx={{
            "& .MuiSelect-icon": {
              color: "#ff9800",
            },
          }}
        >
          <MenuItem value="">
            <em>All Model Types</em>
          </MenuItem>
          {availableModelTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>State</InputLabel>
        <Select
          value={filters.selectedState}
          onChange={(e) => handleFilterChange("selectedState", e.target.value)}
          label="State"
          sx={{
            "& .MuiSelect-icon": {
              color: "#ff9800",
            },
          }}
        >
          <MenuItem value="">
            <em>All States</em>
          </MenuItem>
          {availableStates.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>City</InputLabel>
        <Select
          value={filters.selectedCity}
          onChange={(e) => handleFilterChange("selectedCity", e.target.value)}
          label="City"
          sx={{
            "& .MuiSelect-icon": {
              color: "#ff9800",
            },
          }}
        >
          <MenuItem value="">
            <em>All Cities</em>
          </MenuItem>
          {availableCities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography gutterBottom sx={{ color: "#4caf50" }}>
        Investment Range
      </Typography>
      <Select
        value={filters.selectedInvestmentRange}
        onChange={(e) => handleFilterChange("selectedInvestmentRange", e.target.value)}
        label="Investment Range"
        sx={{
          "& .MuiSelect-icon": {
            color: "#ff9800",
          },
          width: "100%",
        }}
      >
        {investmentRangeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="body2" sx={{ color: "#4caf50" }}>
        Showing {filteredBrands.length} of {brands.length} brands
      </Typography>
    </Box>
  );

  const BrandCard = ({ brand }) => (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <img
        src={brand.brandDetails?.brandLogo}
        alt="logo"
        style={{
          objectFit: "contain",
          backgroundColor: "#f5f5f5",
          p: 2,
          height: 270,
          width: "100%",
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ color: "black" }}
          >
            {brand.personalDetails?.brandName}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <Rating
            value={4.5}
            precision={0.5}
            readOnly
            size="small"
            icon={<Star fontSize="inherit" sx={{ color: "#ff9800" }} />}
            emptyIcon={<StarBorder fontSize="inherit" />}
          />
          <Typography variant="body2" sx={{ ml: 1, color: "black" }}>
            (24)
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          {brand.personalDetails?.brandCategories
            ?.slice(0, 2)
            .map((category, index) => (
              <Chip
                key={index}
                label={category.main}
                size="small"
                sx={{
                  mr: 0.5,
                  mb: 0.5,
                  bgcolor: "#ff9800",
                  color: "white",
                }}
              />
            ))}
        </Box>

        <Typography
          variant="body2"
          sx={{ mb: 1, display: "flex", alignItems: "center", color: "black" }}
        >
          <LocationOn sx={{ mr: 1, fontSize: "1rem", color: "black" }} />
          Location: {brand.personalDetails?.city?.split(",").pop() ||
            "Multiple locations"}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 1, display: "flex", alignItems: "center", color: "black" }}
        >
          <AttachMoney sx={{ mr: 1, fontSize: "1rem", color: "black" }} />
          Investment:{brand.franchiseDetails?.modelsOfFranchise.map(
            (model) => model.investmentRange
          )}
        </Typography>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          <AreaChart sx={{ mr: 1 }} />
          Area Required:
          {brand.franchiseDetails?.modelsOfFranchise.map(
            (model) => model.areaRequired
          )}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2 }}>
        <Button
          size="medium"
          onClick={() => handleOpenBrand(brand)}
          startIcon={<Description />}
          fullWidth
          variant="contained"
          sx={{
            py: 1,
            bgcolor: "#4caf50",
            "&:hover": {
              bgcolor: "#388e3c",
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );

  const BrandDetailsDialog = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [openGallery, setOpenGallery] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const allVideos = [
      ...(selectedBrand?.brandDetails?.brandPromotionVideo || []),
      ...(selectedBrand?.brandDetails?.franchisePromotionVideo || []),
    ];

    const allImages = [
      ...(selectedBrand?.brandDetails?.brandLogo || []),
      ...(selectedBrand?.brandDetails?.companyImage || []),
      ...(selectedBrand?.brandDetails?.exterioroutlet || []),
      ...(selectedBrand?.brandDetails?.interiorOutlet || []),
    ];

    const handleMediaClick = (media) => {
      setSelectedMedia(media);
      setOpenGallery(true);
    };

    return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            overflow: "hidden",
            background: "linear-gradient(145deg, #f5f7fa 0%, #ffffff 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            position: "sticky",
            padding: 1,
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            boxShadow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }} gap={2}>
            <Box
              sx={{
                position: "relative",
                mr: { sm: 3 },
                mb: { xs: 2, sm: 0 },
              }}
            >
              <img
                src={selectedBrand?.brandDetails?.brandLogo}
                alt={selectedBrand?.personalDetails?.brandName}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  ml: 2,
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 5,
                  right: -10,
                  bgcolor: "#ff9800",
                  color: "white",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: 2,
                }}
              >
                <BusinessIcon fontSize="small" />
              </Box>
            </Box>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                background:
                  "linear-gradient(45deg,rgb(6, 6, 6) 30%,rgb(6, 6, 6) 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {selectedBrand?.personalDetails?.brandName}

              <Box display="flex" alignItems="center" mb={1}>
                <Rating
                  value={3.5}
                  precision={0.5}
                  readOnly
                  size="medium"
                  icon={<Star fontSize="inherit" sx={{ color: "#ff9800" }} />}
                  emptyIcon={
                    <StarBorder fontSize="inherit" sx={{ color: "#e0e0e0" }} />
                  }
                />
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    color: "black",
                  }}
                >
                  (24 reviews)
                </Typography>
              </Box>
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                color: "black",
                "&:hover": {
                  bgcolor: "rgba(11, 11, 11, 0.1)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <Typography variant="subtitle1" m={2}>
          {selectedBrand?.personalDetails?.brandCategories &&
            selectedBrand.personalDetails.brandCategories.length > 0 && (
              <Box>
                {selectedBrand.personalDetails.brandCategories.map(
                  (category, index) => (
                    <Box
                      key={index}
                      sx={{ mb: 1 }}
                      display={"flex"}
                      justifyContent={"flex-start"} gap={20} 
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        Category:{" "}
                        <label style={{ color: "#ff9800" }}>
                          {category.child}
                        </label>
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Investment Range :
                        <label style={{ color: "#ff9800" }}>
                          {selectedBrand?.franchiseDetails?.modelsOfFranchise?.map(
                            (model) => model.investmentRange
                          )}
                        </label>
                      </Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Arearequired :
                        <label style={{ color: "#ff9800" }}>
                          {selectedBrand?.franchiseDetails?.modelsOfFranchise?.map(
                            (model) => model.areaRequired
                          )}
                        </label>
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            )}
          {selectedBrand?.personalDetails?.expansionLocation?.length > 0 && (
            <Typography sx={{ fontWeight: "bold" }}>
              Expansion Locations :
              <label style={{ color: "#ff9800" }}>
                {selectedBrand?.personalDetails?.expansionLocation?.map(
                  (location) => `${location.city}, ${location.state}`
                )}
              </label>
            </Typography>
          )}
        </Typography>
      
        <DialogContent
          dividers
          sx={{
            display: "flex",
            p: 1,
            position: "relative",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              p: 3,
              overflowY: "auto",
              maxHeight: "70vh",
            }}
          >
            {selectedBrand && (
              <>
                <Grid display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                  <Grid display={"flex"} flexDirection={"column"}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    ></Box>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                      <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
                        <Tabs
                          value={tabIndex}
                          onChange={(e, newValue) => setTabIndex(newValue)}
                          centered
                          sx={{ mb: 2 }}
                        >
                          <Tab label="Video" />
                          <Tab label="Images" />
                        </Tabs>

                        {tabIndex === 0 ? (
                          <Box display="flex" flexWrap="wrap" gap={2}>
                            {allVideos.map((videoUrl, index) => (
                              <Box
                                key={index}
                                sx={{
                                  width: { xs: "100%", sm: "48%", md: "48%" },
                                  height: 300,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  backgroundColor: "#f5f5f5",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleMediaClick(videoUrl)}
                              >
                                <video
                                  controls
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                >
                                  <source src={videoUrl} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box display="flex" flexWrap="wrap" gap={2}>
                            {allImages.map((imageUrl, index) => (
                              <Box
                                key={index}
                                sx={{
                                  width: { xs: "100%", sm: "30%", md: "23%" },
                                  height: 200,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  backgroundColor: "#f5f5f5",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleMediaClick(imageUrl)}
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Gallery ${index}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
                <Box sx={{ minHeight: "300px" }}>
                  <OverviewTab brand={selectedBrand} />
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            bgcolor: "#f5f5f5",
            borderTop: "2px solid #4caf50",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Share sx={{ color: "#ff9800" }} />}
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: "#ff9800",
              color: "#ff9800",
              "&:hover": {
                borderColor: "#fb8c00",
                bgcolor: "rgba(255,152,0,0.08)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Share
          </Button>
        </DialogActions>

        <Dialog
          open={openGallery}
          onClose={() => setOpenGallery(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <IconButton onClick={() => setOpenGallery(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedMedia &&
              (selectedMedia.endsWith(".mp4") ||
              selectedMedia.endsWith(".webm") ? (
                <video
                  controls
                  autoPlay
                  style={{
                    width: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                >
                  <source src={selectedMedia} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedMedia}
                  alt="Full view"
                  style={{
                    width: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                />
              ))}
          </DialogContent>
        </Dialog>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/"
          sx={{ display: "flex", alignItems: "center", color: "#4caf50" }}
        >
          <Home sx={{ mr: 0.5, color: "#ff9800" }} /> Home
        </Link>
        <Typography
          sx={{ display: "flex", alignItems: "center", color: "#4caf50" }}
        >
          <Store sx={{ mr: 0.5, color: "#ff9800" }} /> Franchise Brands
        </Typography>
      </Breadcrumbs>

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        {/* Desktop Filters */}
        <Box
          sx={{
            width: { md: 280 },
            flexShrink: 0,
            display: { xs: "none", md: "block" },
          }}
        >
          <FilterPanel />
        </Box>

        {/* Mobile Filters Button */}
        <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterAlt sx={{ color: "#ff9800" }} />}
            endIcon={
              <Badge
                badgeContent={activeFilterCount}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#4caf50",
                    color: "white",
                  },
                }}
              />
            }
            onClick={() => setMobileFiltersOpen(true)}
            fullWidth
            sx={{
              py: 1.5,
              borderColor: "#ff9800",
              color: "#ff9800",
              "&:hover": {
                borderColor: "#fb8c00",
              },
            }}
          >
            Filters
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, ml: { md: 3 } }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{ color: "#ff9800" }}
              />
            </Box>
          ) : error ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="60vh"
            >
              <Typography color="error" variant="h6">
                {error}
              </Typography>
            </Box>
          ) : filteredBrands.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography
                variant="h5"
                component={"span"}
                sx={{ color: "#4caf50" }}
              >
                No brands match your filters
              </Typography>
              <Typography variant="body1" sx={{ color: "#ff9800", mb: 3 }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                size="large"
                sx={{
                  borderColor: "#ff9800",
                  color: "#ff9800",
                  "&:hover": {
                    borderColor: "#fb8c00",
                  },
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ color: "#4caf50" }}
              >
                Available Franchise Brands
              </Typography>
              <Typography variant="body1" sx={{ color: "black", mb: 3 }}>
                Showing {filteredBrands.length} of {brands.length} brands
              </Typography>

              <Grid container spacing={3}>
                {filteredBrands.map((brand) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={brand._id}>
                    <BrandCard brand={brand} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      </Box>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 280 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <Close sx={{ color: "#ff9800" }} />
            </IconButton>
          </Box>
          <Divider />
          <FilterPanel />
          <Box p={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setMobileFiltersOpen(false)}
              size="large"
              sx={{
                bgcolor: "#4caf50",
                "&:hover": {
                  bgcolor: "#388e3c",
                },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>

      <BrandDetailsDialog />
    </Container>
  );
}

export default BrandList;