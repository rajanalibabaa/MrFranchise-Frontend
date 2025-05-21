import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
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
  Slider,
  Chip,
  Drawer,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Rating,
  Fade,
  Grow,
  Zoom,
  Collapse,
  Modal,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
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
  Payment,
  Star,
  StarBorder,
  CorporateFare,
  Apartment,
  Storefront,
  LocalOffer,
  Share,
  PictureAsPdf,
  Person,
  Business as BusinessIcon,
  HomeWork,
  Description as DescriptionIcon,
  ArrowUpward,
  ArrowDownward,
  ZoomIn,
  Facebook,
  Instagram,
  LinkedIn,
  CalendarToday,
  LocationCity,
  AccountBalance,
  Category,
  SquareFoot,
  Assessment,
  DesignServices,
  StoreMallDirectory,
  Receipt,
  TrendingUp,
  Timeline,
  School,
  EventNote,
  AccountTree,
  Support,
} from "@mui/icons-material";
import axios from "axios";

function BrandList() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [investmentRange, setInvestmentRange] = useState([0, 10000000]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Application form states

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "http://localhost:5000/api/v1/brandlisting/getAllBrandListing",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const brandsData = response.data.data;
      console.log("Brands data:", brandsData);

      setBrands(brandsData);
      setFilteredBrands(brandsData);

      // Extract unique categories and locations
      const categories = [
        ...new Set(
          brandsData.flatMap((brand) => brand.personalDetails?.categories || [])
        ),
      ];
      const locations = [
        ...new Set(
          brandsData
            .map((brand) => {
              const addressParts = brand.personalDetails?.address?.split(",");
              return addressParts
                ? addressParts[addressParts.length - 1].trim()
                : null;
            })
            .filter(Boolean)
        ),
      ];

      setAvailableCategories(categories);
      setAvailableLocations(locations);
    } catch (err) {
      setError(err.message || "Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const applyFilters = useCallback(() => {
    let result = [...brands];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((brand) => {
        const brandName = brand.personalDetails?.brandName || "";
        const description = brand.personalDetails?.description || "";
        const companyName = brand.personalDetails?.companyName || "";
        return (
          brandName.toLowerCase().includes(term) ||
          description.toLowerCase().includes(term) ||
          companyName.toLowerCase().includes(term)
        );
      });
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((brand) =>
        brand.personalDetails?.categories?.includes(selectedCategory)
      );
    }

    // Apply location filter
    if (selectedLocation) {
      result = result.filter((brand) => {
        const addressParts = brand.personalDetails?.address?.split(",");
        const brandLocation = addressParts
          ? addressParts[addressParts.length - 1].trim()
          : "";
        return brandLocation === selectedLocation;
      });
    }

    // Apply investment range filter
    result = result.filter((brand) => {
      const franchiseFee =
        parseFloat(brand.franchiseDetails?.franchiseFee) || 0;
      return (
        franchiseFee >= investmentRange[0] && franchiseFee <= investmentRange[1]
      );
    });

    setFilteredBrands(result);
  }, [brands, searchTerm, selectedCategory, selectedLocation, investmentRange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleOpenBrand = (brand) => {
    setSelectedBrand(brand);
    setOpenDialog(true);
    setTabValue(0);
    setFormSubmitted(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLocation("");
    setInvestmentRange([0, 10000000]);
  };

  const activeFilterCount = [
    searchTerm,
    selectedCategory,
    selectedLocation,
    investmentRange[0] !== 0 || investmentRange[1] !== 10000000,
  ].filter(Boolean).length;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const FilterPanel = () => (
    <Box sx={{ width: 280, p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Filters</Typography>
        <Button
          size="small"
          onClick={clearFilters}
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
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "#ff9800" }} />,
        }}
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
        <InputLabel>Location</InputLabel>
        <Select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          label="Location"
          sx={{
            "& .MuiSelect-icon": {
              color: "#ff9800",
            },
          }}
        >
          <MenuItem value="">
            <em>All Locations</em>
          </MenuItem>
          {availableLocations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography gutterBottom sx={{ color: "#4caf50" }}>
        Investment Range
      </Typography>
      <Slider
        value={investmentRange}
        onChange={(e, newValue) => setInvestmentRange(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={10000000}
        step={100000}
        valueLabelFormat={formatCurrency}
        sx={{
          mb: 3,
          color: "#ff9800",
        }}
      />

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
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ color: "black" }}
        >
          {brand.personalDetails?.brandName}
        </Typography>

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
          {brand.personalDetails?.categories
            ?.slice(0, 2)
            .map((category, index) => (
              <Chip
                key={index}
                label={category}
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
          {brand.personalDetails?.city?.split(",").pop() ||
            "Multiple locations"}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 1, display: "flex", alignItems: "center", color: "black" }}
        >
          <AttachMoney sx={{ mr: 1, fontSize: "1rem", color: "black" }} />
          Investment:{" "}
          {formatCurrency(brand.franchiseDetails?.franchiseFee || 0)}
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


   const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </div>
  );
const OverviewTab = React.memo(({ brand }) => {
  const [tabValue, setTabValue] = useState(0);
  const [zoomImage, setZoomImage] = useState(null);

  // Helper functions
  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatList = (items) => 
    items?.join(", ") || "Not specified";

  const formatOutlets = () => {
    const { companyOwnedOutlets, franchiseOutlets, totalOutlets } = brand.personalDetails || {};
    if (!companyOwnedOutlets && !franchiseOutlets) return "Not specified";
    return `${companyOwnedOutlets || 0} company-owned, ${franchiseOutlets || 0} franchised (${totalOutlets || 0} total)`;
  };

  // Media handling
  const toArray = (val) => (Array.isArray(val) ? val : val ? [val] : []);
  const { companyImage, exteriorOutlet = [], interiorOutlet = [] } = brand.brandDetails || {};
  const allImages = [...toArray(companyImage), ...toArray(exteriorOutlet), ...toArray(interiorOutlet)];

  // Enhanced data sections with proper array handling
  const sections = [
    {
      title: "Brand Overview",
      icon: <DescriptionIcon sx={{ color: "#ff9800" }} />,
      items: [
        { label: "Brand Name", value: brand.personalDetails?.brandName },
        { label: "Description", value: brand.personalDetails?.brandDescription },
        { label: "Categories", value: formatList(brand.personalDetails?.brandCategories) },
        { label: "Website", value: brand.personalDetails?.website ? (
          <Link href={brand.personalDetails.website} target="_blank" rel="noopener">
            {brand.personalDetails.website}
          </Link>
        ) : "Not specified" }
      ]
    },
    {
      title: "Company Details",
      icon: <Business sx={{ color: "#ff9800" }} />,
      items: [
        { label: "Company Name", value: brand.personalDetails?.companyName },
        { label: "Established Year", value: brand.personalDetails?.establishedYear },
        { label: "Franchising Since", value: brand.personalDetails?.franchiseSinceYear },
        { label: "Head Office", value: `${brand.personalDetails?.headOfficeAddress}, ${brand.personalDetails?.city}, ${brand.personalDetails?.state}, ${brand.personalDetails?.country}` },
        { label: "Contact", value: `${brand.personalDetails?.fullName} | ${brand.personalDetails?.mobileNumber} | ${brand.personalDetails?.email}` },
        { label: "Social Media", value: (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {brand.personalDetails?.facebook && (
              <IconButton href={brand.personalDetails.facebook} target="_blank">
                <Facebook sx={{ color: '#1877F2' }} />
              </IconButton>
            )}
            {brand.personalDetails?.instagram && (
              <IconButton href={brand.personalDetails.instagram} target="_blank">
                <Instagram sx={{ color: '#E4405F' }} />
              </IconButton>
            )}
            {brand.personalDetails?.linkedin && (
              <IconButton href={brand.personalDetails.linkedin} target="_blank">
                <LinkedIn sx={{ color: '#0A66C2' }} />
              </IconButton>
            )}
          </Box>
        )}
      ]
    },
    {
      title: "Franchise Models",
      icon: <AccountTree sx={{ color: "#ff9800" }} />,
      content: (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Model</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Investment Range</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Area Required</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Franchise Fee</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Royalty Fee</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Interior Cost</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Exterior Cost</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Other Cost</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Roi</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Break Even</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Required Capital</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Property Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brand.franchiseDetails?.modelsOfFranchise?.map((model, index) => (
                <TableRow key={index}>
                  <TableCell>{model.franchiseModel || "Not specified"}</TableCell>
                  <TableCell>{model.franchiseType || "Not specified"}</TableCell>
                  <TableCell>{model.investmentRange || "Not specified"}</TableCell>
                  <TableCell>{model.areaRequired || "Not specified"}</TableCell>
                  <TableCell>{model.franchiseFee || "Not specified"}</TableCell>
                  <TableCell>{model.royaltyFee || "Not specified"}</TableCell>
                  <TableCell>{model.interiorCost || "Not specified"}</TableCell>
                  <TableCell>{model.exteriorCost || "Not specified"}</TableCell>
                  <TableCell>{model.otherCost || "Not specified"}</TableCell>
                  <TableCell>{model.roi || "Not specified"}</TableCell>
                  <TableCell>{model.breakEven || "Not specified"}</TableCell>
                  <TableCell>{model.requiredCapital || "Not specified"}</TableCell>
                  <TableCell>{model.propertyType || "Not specified"}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
    },
    {
      title: "Franchise Details",
      icon: <AttachMoney sx={{ color: "#ff9800" }} />,
      content: (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {brand.franchiseDetails?.modelsOfFranchise?.map((model, index) => (
                <React.Fragment key={index}>
                  {/* <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
                      Model {index + 1}: {model.franchiseModel || "Not specified"}
                    </TableCell>
                  </TableRow> */}
                  <TableRow>
                    <TableCell>Agreement Period</TableCell>
                    <TableCell>{model.agreementPeriod || "Not specified"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>companyOwned Outlets</TableCell>
                    <TableCell>{model.companyOwnedOutlets || "Not specified"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Other Costs</TableCell>
                    <TableCell>{model.otherCost || "Not specified"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Investment</TableCell>
                    <TableCell>{model.requiredInvestmentCapital || "Not specified"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ROI Period</TableCell>
                    <TableCell>{model.roi || "Not specified"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Break-even Period</TableCell>
                    <TableCell>{model.breakEven || "Not specified"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Royalty Fee</TableCell>
                    <TableCell>{model.royaltyFee || "Not specified"}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
    },
    {
      title: "Support & Training",
      icon: <Support sx={{ color: "#ff9800" }} />,
      items: [
        { label: "Training Provided By", value: brand.franchiseDetails?.trainingProvidedBy },
        { label: "Requirement Support", value: brand.franchiseDetails?.requirementSupport },
        { label: "Expansion Locations", value: formatList(brand.personalDetails?.expansionLocation) }
      ]
    }
  ];

  // ... (keep your existing TabPanel, Modal, and other JSX)

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Tabs and other components remain the same */}
      
      {/* Main Content Area */}
      <Box display="flex" flexDirection={{ xs: "column", lg: "row" }} gap={4} sx={{ mt: 2 }}>
        <Box flex={1}>
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1, mb: 2, color: "text.primary", pb: 1, borderBottom: '2px solid #ff9800' }}>
                {section.icon}
                {section.title}
              </Typography>

              {section.content || (
                <TableContainer component={Paper}>
                  <Table size="medium">
                    <TableBody>
                      {section.items.map((item, itemIndex) => (
                        <TableRow key={itemIndex}>
                          <TableCell sx={{ fontWeight: 500, color: "black", width: '30%' }}>
                            {item.label}
                          </TableCell>
                          <TableCell sx={{ color: "black", wordBreak: 'break-word' }}>
                            {item.value || "Not specified"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

 


  const BrandDetailsDialog = React.memo(() => {
   
    const renderTabContent = useCallback(() => {
      switch (tabValue) {
        case 0:
          return <OverviewTab brand={selectedBrand} />;
        default:
          return null;
      }
    }, [tabValue, selectedBrand]);

    return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        sx={{
          "& .MuiDialog-paper": {
            overflow: "hidden",
            transition: "none",
          },
        }}
      >
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            position: "sticky",
            padding:1.5,
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            boxShadow: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // borderBottom: "2px solidrgb(19, 19, 18)",
            // p: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Fade in={true} timeout={500}>
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
                          objectFit: "contain",
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
                  </Fade>
                  <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        background:
                          "linear-gradient(45deg,rgb(6, 6, 6) 30%,rgb(6, 6, 6) 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {selectedBrand?.personalDetails?.brandName}<br/>
                      <Typography variant="subtitle1"
                      sx={{
                        color: "#4caf50",
                      }}>{selectedBrand?.personalDetails?.companyName}</Typography>
                      <Typography>{selectedBrand?.personalDetails?.state},{selectedBrand?.personalDetails?.city}</Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                      <Rating
                        value={3.5}
                        precision={0.5}
                        readOnly
                        size="medium"
                        icon={
                          <Star fontSize="inherit" sx={{ color: "#ff9800" }} />
                        }
                        emptyIcon={
                          <StarBorder
                            fontSize="inherit"
                            sx={{ color: "#e0e0e0" }}
                          />
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
          <Box><IconButton
            onClick={handleCloseDialog}
            sx={{
              color: "black",
              "&:hover": {
                bgcolor: "rgba(11, 11, 11, 0.1)",
              },
            }}
          >
            <Close />
          </IconButton></Box>                  
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent
          dividers
          sx={{
            display: "flex",
            p:1,
            position: "relative",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Main Content Area */}
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
                {/* Brand Header */}

                <Grid   display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                  <Grid display={"flex"} flexDirection={"column"}> 
                    <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // mb: 1,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                </Box>
                </Grid>
                  {/* <Grid>
                     <Paper elevation={3} sx={{ p: 1.5, borderRadius: 2 }}>
            <Box
              sx={{
                width: '100%',
                height: 200,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
              }}
            >
              <video
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              >
                <source src={selectedBrand?.brandDetails?.franchisePromotionVideo} />
                Your browser does not support the video tag.
              </video>
            </Box>
            <Typography variant="subtitle2" textAlign="center" mt={1}>
              Franchise Promotion Video
            </Typography>
          </Paper>

                  </Grid> */}
                </Grid>
                <Box sx={{ minHeight: "300px" }}>{renderTabContent()}</Box>

              </>
            )}
          </Box>
 </DialogContent>

        {/* Dialog Actions */}
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
          {/* <Button
            variant="contained"
            startIcon={<BusinessIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              bgcolor: "#4caf50",
              "&:hover": {
                bgcolor: "#388e3c",
              },
              transition: "all 0.3s ease",
            }}
          >
          </Button> */}
        </DialogActions>
      </Dialog>
    );
  });

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
                sx={{ color: "#4caf50", gutterBottom }}
              >
                No brands match your filters
              </Typography>
              <Typography variant="body1" sx={{ color: "#ff9800", mb: 3 }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={clearFilters}
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
