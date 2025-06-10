import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Box,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
  Skeleton,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  AppBar,
  Paper,
  Fade,
  Grow,
  Slide
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { categories } from "../../Pages/Registration/BrandLIstingRegister/BrandCategories";
import { useDispatch, useSelector } from "react-redux";
import {
  openBrandDialog,
  closeBrandDialog,
} from "../../Redux/Slices/brandSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SideViewContent = ({ hoverCategory, onHoverLeave }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileTabValue, setMobileTabValue] = useState(0);
  const navigate = useNavigate();

  const fetchBrandDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://51.20.81.150:5000/api/v1/brandlisting/getAllBrandListing",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setBrandsData(response.data.data);
    } catch (error) {
      setError("Failed to load brands. Please try again later.");
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const dispatch = useDispatch();
  const { openDialog, selectedBrand } = useSelector((state) => state.brands);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    if (hoverCategory !== null && brandsData.length === 0) {
      fetchBrandDetails();
    }
  }, [hoverCategory]);

  const handleSubChildHover = (children) => {
    const childName = typeof children === "string" ? children : children.name;
    const filtered = brandsData.filter((brand) => {
      const categories = brand.personalDetails?.brandCategories || [];
      return categories.some((cat) => cat.child === childName);
    });
    setFilteredBrands(filtered);
  };

  const handleBrandClick = (brand) => {
    dispatch(openBrandDialog(brand));
  };

  const handleMobileTabChange = (event, newValue) => {
    setMobileTabValue(newValue);
  };

  const getMobileTabContent = () => {
    switch (mobileTabValue) {
      case 0: // Categories
        return (
          <Box sx={{ p: 2 }}>
            {categories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box
                  onClick={() => {
                    setActiveCategory(index);
                    setActiveSubCategory(null);
                    setMobileTabValue(1);
                  }}
                  sx={{
                    cursor: "pointer",
                    py: 1.5,
                    px: 1.5,
                    borderRadius: 2,
                    mb: 1,
                    color: activeCategory === index ? "white" : "text.primary",
                    bgcolor: activeCategory === index ? "primary.main" : "background.paper",
                    fontWeight: "medium",
                    transition: "all 0.3s ease",
                    boxShadow: theme.shadows[1],
                    "&:hover": {
                      bgcolor: activeCategory === index ? "primary.dark" : "action.hover",
                    },
                  }}
                >
                  <Typography variant="subtitle1">
                    {category.name}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        );
      case 1: // Subcategories
        return (
          <Box sx={{ p: 2 }}>
            <motion.div
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => setMobileTabValue(0)}
              >
                <IconButton size="small" sx={{ mr: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  Back to Categories
                </Typography>
              </Box>
            </motion.div>
            {activeCategory !== null && categories[activeCategory].children?.map((subCategory, idx) => (
              <Grow in={true} timeout={(idx + 1) * 150} key={idx}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Box
                    onClick={() => {
                      setActiveSubCategory(subCategory);
                      setMobileTabValue(2);
                    }}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      py: 1.5,
                      px: 1.5,
                      borderRadius: 2,
                      gap: 1.5,
                      mb: 1,
                      bgcolor: activeSubCategory?.name === subCategory.name ? "primary.light" : "background.paper",
                      color: activeSubCategory?.name === subCategory.name ? "primary.contrastText" : "text.primary",
                      boxShadow: theme.shadows[1],
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: activeSubCategory?.name === subCategory.name ? "primary.main" : "action.hover",
                      },
                    }}
                  >
                    {subCategory.icon && (
                      <Box
                        component={subCategory.icon}
                        sx={{
                          fontSize: 22,
                          color: activeSubCategory?.name === subCategory.name ? "primary.contrastText" : "primary.main",
                        }}
                      />
                    )}
                    <Typography
                      fontWeight={activeSubCategory?.name === subCategory.name ? "bold" : "medium"}
                    >
                      {subCategory.name}
                    </Typography>
                  </Box>
                </motion.div>
              </Grow>
            ))}
          </Box>
        );
      case 2: // Child Categories
        return (
          <Box sx={{ p: 2 }}>
            <motion.div
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => setMobileTabValue(1)}
              >
                <IconButton size="small" sx={{ mr: 1 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  Back to Subcategories
                </Typography>
              </Box>
            </motion.div>
            {activeSubCategory?.children?.map((children, idx) => {
              const name = typeof children === "string" ? children : children.name;
              const Icon = typeof children === "object" ? children.icon : null;
              return (
                <Slide in={true} direction="up" timeout={(idx + 1) * 100} key={idx}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Box
                      onClick={() => handleSubChildHover(children)}
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        py: 1.5,
                        px: 1.5,
                        borderRadius: 2,
                        gap: 1.5,
                        mb: 1,
                        bgcolor: "background.paper",
                        boxShadow: theme.shadows[1],
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "action.hover",
                          boxShadow: theme.shadows[2],
                        },
                      }}
                    >
                      {Icon && (
                        <Box
                          component={Icon}
                          sx={{
                            fontSize: 20,
                            color: "primary.main",
                          }}
                        />
                      )}
                      <Typography fontWeight="medium">{name}</Typography>
                    </Box>
                  </motion.div>
                </Slide>
              );
            })}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="top"
      open={hoverCategory !== null}
      onClose={onHoverLeave}
      PaperProps={{
        sx: {
           height: isMobile ? "85vh" : isTablet ? "65vh" : 500,
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px 0 rgba(60,72,88,0.18)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    border: "1.5px solid rgba(255,255,255,0.25)",
        },
      }}
      SlideProps={{
        timeout: 300,
      }}
    >
      <Box
        onMouseLeave={onHoverLeave}
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Mobile Tabs Navigation */}
        {isMobile && (
          <AppBar 
            position="static" 
            color="inherit"
            elevation={0}
            sx={{
              background: "#ff9800",
              color: "white",
            }}
          >
            <Tabs
              value={mobileTabValue}
              onChange={handleMobileTabChange}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="inherit"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 4,
                  backgroundColor: "white",
                },
              }}
            >
              <Tab 
                label="Categories" 
                sx={{ 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  minHeight: 48 
                }} 
              />
              <Tab 
                label="Subcategories" 
                disabled={activeCategory === null}
                sx={{ 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  minHeight: 48 
                }} 
              />
              <Tab 
                label="Child Categories" 
                disabled={activeSubCategory === null}
                sx={{ 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  minHeight: 48 
                }} 
              />
            </Tabs>
          </AppBar>
        )}

        {/* Desktop View */}
        {!isMobile && (
          <>
            {/* Categories Column */}
            <Box
              sx={{
                width: 240,
                borderRight: `1px solid ${theme.palette.divider}`,
                overflowY: "auto",
                px: 2,
                py: 2,
                background: "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
              }}
            >
              {/* <Typography 
                variant="h6" 
                fontWeight="bold" 
                mb={2} 
                color="primary"
                sx={{
                  background: "#FF9800",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Top Categories
              </Typography> */}
              {/* <Divider sx={{ mb: 2 }} /> */}
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    onMouseEnter={() => {
                      setActiveCategory(index);
                      setActiveSubCategory(null);
                    }}
                    sx={{
                      cursor: "pointer",
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      mb: 1.5,
                      color: activeCategory === index ? "white" : "text.primary",
                      bgcolor: activeCategory === index ? "primary.main" : "background.paper",
                      fontWeight: "medium",
                      transition: "all 0.3s ease",
                      boxShadow: theme.shadows[1],
                      "&:hover": {
                        bgcolor: activeCategory === index ? "primary.dark" : "action.hover",
                      },
                    }}
                  >
                    <Typography variant="subtitle1">
                      {category.name}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Subcategories Column */}
            {activeCategory !== null && (
              <Box
                sx={{
                  width: 260,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  overflowY: "auto",
                  px: 2,
                  py: 2,
                  background: "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  mb={2} 
                  color="text.secondary"
                >
                  {categories[activeCategory].name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {categories[activeCategory].children?.map((subCategory, idx) => (
                  <Grow in={true} timeout={(idx + 1) * 150} key={idx}>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Box
                        onMouseEnter={() => setActiveSubCategory(subCategory)}
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          py: 1.5,
                          px: 2,
                          borderRadius: 2,
                          gap: 1.5,
                          mb: 1.5,
                          bgcolor: activeSubCategory?.name === subCategory.name ? "primary.light" : "background.paper",
                          color: activeSubCategory?.name === subCategory.name ? "primary.contrastText" : "text.primary",
                          boxShadow: theme.shadows[1],
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: activeSubCategory?.name === subCategory.name ? "primary.main" : "action.hover",
                          },
                        }}
                      >
                        {subCategory.icon && (
                          <Box
                            component={subCategory.icon}
                            sx={{
                              fontSize: 22,
                              color: activeSubCategory?.name === subCategory.name ? "primary.contrastText" : "primary.main",
                            }}
                          />
                        )}
                        <Typography
                          fontWeight={activeSubCategory?.name === subCategory.name ? "bold" : "medium"}
                        >
                          {subCategory.name}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grow>
                ))}
              </Box>
            )}

            {/* Child Categories Column */}
            {activeSubCategory && (
              <Box
                sx={{
                  width: 280,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  overflowY: "auto",
                  px: 2,
                  py: 2,
                  background: "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
                }}
              >
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  mb={2} 
                  color="text.secondary"
                >
                  {activeSubCategory.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {activeSubCategory.children?.map((children, idx) => {
                  const name = typeof children === "string" ? children : children.name;
                  const Icon = typeof children === "object" ? children.icon : null;
                  return (
                    <Slide in={true} direction="up" timeout={(idx + 1) * 100} key={idx}>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Box
                          onMouseEnter={() => handleSubChildHover(children)}
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            py: 1.5,
                            px: 2,
                            borderRadius: 2,
                            gap: 1.5,
                            mb: 1.5,
                            bgcolor: "background.paper",
                            boxShadow: theme.shadows[1],
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "action.hover",
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        >
                          {Icon && (
                            <Box
                              component={Icon}
                              sx={{
                                fontSize: 20,
                                color: "primary.main",
                              }}
                            />
                          )}
                          <Typography fontWeight="medium">{name}</Typography>
                        </Box>
                      </motion.div>
                    </Slide>
                  );
                })}
              </Box>
            )}
          </>
        )}

        {/* Mobile Tab Content */}
        {isMobile && (
          <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "background.default" }}>
            {getMobileTabContent()}
          </Box>
        )}

        {/* Brands Grid - Common for both mobile and desktop */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: isMobile ? 1 : 3,
            py: 2,
            bgcolor: "background.paper",
            borderTop: isMobile ? `1px solid ${theme.palette.divider}` : "none",
          }}
        >
          {loading ? (
            <Grid container spacing={isMobile ? 1 : 2}>
              {[...Array(8)].map((_, idx) => (
                <Grid item xs={6} sm={4} md={3} key={idx}>
                  <Skeleton 
                    variant="rectangular" 
                    height={isMobile ? 140 : 180} 
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: 'grey.100'
                    }} 
                  />
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "error.main",
                textAlign: "center",
                p: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Chip
                  label="Retry"
                  onClick={fetchBrandDetails}
                  color="primary"
                  sx={{ 
                    px: 3,
                    py: 1,
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                />
              </motion.div>
            </Box>
          ) : filteredBrands.length > 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                  pt: isMobile ? 1 : 0,
                }}
              >
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  sx={{
                    background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Popular Brands
                </Typography>
                <Chip
                  label={`${filteredBrands.length} brands`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
              <Grid container spacing={isMobile ? 1 : 2}>
                {filteredBrands.slice(0, isMobile ? 8 : 12).map((brand, index) => (
                  <Grid item xs={12} sm={6} md={3} key={brand._id || index}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Paper
                        onClick={() => handleBrandClick(brand)}
                        elevation={1}
                        sx={{
                          width:100,
                          height: 150,
                          display: 'flex',
                          justifyContent:'flex-start',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: isMobile ? 1 : 2,
                          borderRadius: 3,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid transparent',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: theme.shadows[4],
                            borderColor: theme.palette.primary.light,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: isMobile ? 50 : 90,
                            height: isMobile ? 50 : 90,
                            // mb: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // bgcolor: 'primary.light',
                            borderRadius: '50%',
                            // p: 1,
                          }}
                        >
                          <Avatar
                            src={brand.brandDetails?.brandLogo || ""}
                            alt={brand.personalDetails?.brandName || "B"}
                            sx={{
                              width: '100%',
                              height: '100%',
                              fontSize: isMobile ? 32 : 36,
                              // bgcolor: 'primary.main',
                            }}
                          >
                            {brand.personalDetails?.brandName
                              ? brand.personalDetails.brandName[0]
                              : "B"}
                          </Avatar>
                        </Box>
                        <Typography
                          fontWeight="bold"
                          textAlign="center"
                          noWrap
                          sx={{ 
                            width: '100%', 
                            fontSize: isMobile ? '0.85rem' : '1rem',
                            color: 'text.primary',
                            whiteSpace:'normal',
                            wordBreak: 'break-word',
                            lineHeight: 1.2,
                            mb: 0.5,
                          }}
                        >
                          {brand.personalDetails?.brandName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          textAlign="center"
                          noWrap
                          sx={{ 
                            width: '100%', 
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            // mt: 0.5
                            whiteSpace:'normal',
                            wordBreak: 'break-word',
                          }}
                        >
                          {brand.personalDetails?.companyName}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Fade in={true}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "text.secondary",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <img 
                  src="/images/no-brands.svg" 
                  alt="No brands found" 
                  style={{ 
                    width: isMobile ? 150 : 200,
                    opacity: 0.7,
                    marginBottom: 16
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  No brands found
                </Typography>
                <Typography variant="body2">
                  {isMobile ? "Select a category to see brands" : "Select a subcategory to see related brands"}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Brand Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => dispatch(closeBrandDialog())}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
              background: "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
            },
          }}
          TransitionComponent={Slide}
          transitionDuration={300}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {selectedBrand?.personalDetails?.brandName || "Brand Details"}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => dispatch(closeBrandDialog())}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            {selectedBrand && (
              <Box>
                {/* Add your brand details content here */}
                <Typography>Brand details will be shown here</Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Drawer>
  );
};

export default SideViewContent;