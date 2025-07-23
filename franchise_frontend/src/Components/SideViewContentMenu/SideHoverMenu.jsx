import React, { useState, useEffect, useMemo, useCallback } from "react";
import Drawer from "@mui/material/Drawer";
import {
  Box,
  Typography,
  Avatar,
 
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
  Chip,
  Tabs,
  Tab,
  AppBar,
  Paper,
  Fade,
  Grow,
  Slide
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { categories } from "../../Pages/Registration/BrandLIstingRegister/BrandCategories";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBrands,openBrandDialog } from "../../Hooks/Fetchbrands";




// Memoized brand card component to prevent unnecessary re-renders

const BrandCard = React.memo(({ brand, handleBrandClick, isMobile }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
    <Paper
      onClick={() => handleBrandClick(brand)}
      elevation={2}
      sx={{
        width: isMobile ? 100 : 100,
        height: isMobile ? 130 : 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid #eee',
        backgroundColor: '#fff',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          borderColor: '#ff9800',
        },
      }}
    >
      <Box
        sx={{
          width: isMobile ? 48 : 60,
          height: isMobile ? 48 : 60,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}
      >
        <Avatar
          src={brand.uploads?.brandLogo || ""}
          alt={brand.brandDetails?.brandName || "B"}
          sx={{
            width: '100%',
            height: '100%',
            fontSize: isMobile ? 22 : 26,
            bgcolor: '#ffe0b2',
            color: '#ff6d00'
          }}
        >
          {brand.brandDetails?.brandName?.[0] || "B"}
        </Avatar>
      </Box>
      <Typography
        fontWeight={600}
        textAlign="center"
        noWrap
        sx={{
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          maxWidth: '100%',
          px: 1,
          color: 'text.primary',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: 1.3,
        }}
      >
        {brand.brandDetails?.brandName || 'Unknown'}
      </Typography>
    </Paper>
  </motion.div>
));


const SideViewContent = ({ hoverCategory, onHoverLeave }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [mobileTabValue, setMobileTabValue] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));



const { data, isLoading, error, refetch } = useBrands();
const brandsData = data || [];

  
 // Build child-to-brands map when data loads
  const childToBrandsMap = useMemo(() => {
    const map = {};
    if (!brandsData || brandsData.length === 0) return map;

    brandsData.forEach((brand) => {
      const brandCats = brand.franchiseDetails?.brandCategories;
      if (!brandCats) return;

      // Handle both array and single category cases
      const catArray = Array.isArray(brandCats) ? brandCats : [brandCats];
      
      catArray.forEach((cat) => {
        if (cat.child) {
          if (!map[cat.child]) map[cat.child] = [];
          map[cat.child].push(brand);
        }
      });
    });

    return map;
  }, [brandsData]);

  // Optimized brand filtering  
 const handleSubChildHover = useCallback((children) => {
    try {
      const childName = typeof children === "string" ? children : children.name;
      if (childToBrandsMap[childName]) {
        setFilteredBrands(childToBrandsMap[childName]);
      } else {
        setFilteredBrands([]);
      }
    } catch (err) {
      console.error("Error filtering brands:", err);
      setFilteredBrands([]);
    }
  }, [childToBrandsMap]);

  const handleBrandClick = useCallback((brand) => {
    // dispatch(openBrandDialog(brand));
    openBrandDialog(brand);
  }, []);

  const handleMobileTabChange = useCallback((event, newValue) => {
    setMobileTabValue(newValue);
  }, []);

  // Memoized mobile tab content
  const getMobileTabContent = useMemo(() => {
    const tabContents = [
      // Categories Tab
      (
        <Box sx={{ p: 2 }}>
          {categories.map((category, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                <Typography variant="subtitle1">{category.name}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      ),
      // Subcategories Tab
      (
        <Box sx={{ p: 2 }}>
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.98 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "action.hover" },
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
                  <Typography fontWeight={activeSubCategory?.name === subCategory.name ? "bold" : "medium"}>
                    {subCategory.name}
                  </Typography>
                </Box>
              </motion.div>
            </Grow>
          ))}
        </Box>
      ),
      // Child Categories Tab
      (
        <Box sx={{ p: 2 }}>
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.98 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "action.hover" },
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
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                    )}
                    <Typography fontWeight="medium">{name}</Typography>
                  </Box>
                </motion.div>
              </Slide>
            );
          })}
        </Box>
      )
    ];
    
    return () => tabContents[mobileTabValue] || null;
  }, [mobileTabValue, activeCategory, activeSubCategory, handleSubChildHover]);

  // Optimized brands grid rendering
  const renderBrandsGrid = useMemo(() => {
    if (isLoading) {
      return (
           <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          width: "100%",
        }}
      >
        <CircularProgress color="primary" size={48} thickness={4} />
      </Box>
      );
    }

    if (error) {
      return (
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
  {error?.message || String(error) || 'Failed to load brands. Please try again later.'}
</Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Chip
              label="Retry"
              onClick={refetch}
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
      );
    }

    if (filteredBrands.length > 0) {
      return (
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
                background: " #ff9800",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Popular Brands
            </Typography>
            <Chip
              label={`${filteredBrands.length} -  brands`}
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <Grid container spacing={isMobile ? 1 : 2}>
            {filteredBrands.slice(0, isMobile ? 8 : 12).map((brand, index) => (
              <Grid item xs={12} sm={6} md={3} key={brand._id || index}>
                <BrandCard 
                  brand={brand} 
                  handleBrandClick={handleBrandClick} 
                  isMobile={isMobile} 
                />
              </Grid>
            ))}
          </Grid>
        </>
      );
    }

    return (
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
          {/* <img 
            src="/images/no-brands.svg" 
            alt="No brands found" 
            style={{ 
              width: isMobile ? 150 : 200,
              opacity: 0.7,
              marginBottom: 16
            }}
          /> */}
          <Typography variant="h6" gutterBottom>
            Find Your Dream Franchise Brands
          </Typography>
          <Typography variant="body2">
            {isMobile ? "Select a category to see brands" : "Select a subcategory to see related brands"}
          </Typography>
        </Box>
      </Fade>
    );
  },  [isLoading, error, filteredBrands, isMobile, handleBrandClick, refetch]);

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
      SlideProps={{ timeout: 300 }}
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
            sx={{ background: "#ff9800", color: "white" }}
          >
            <Tabs
              value={mobileTabValue}
              onChange={handleMobileTabChange}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="inherit"
              sx={{
                "& .MuiTabs-indicator": { height: 4, backgroundColor: "white" },
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
                      bgcolor: activeCategory === index ? "orange" : "background.paper",
                      fontWeight: "medium",
                      transition: "all 0.3s ease",
                      boxShadow: theme.shadows[1],
                      "&:hover": {
                        bgcolor: activeCategory === index ? "orange" : "action.hover",
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
                <Typography variant="h6" fontWeight="bold" mb={2} color="text.secondary">
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
                          bgcolor: activeSubCategory?.name === subCategory.name ? "orange" : "background.paper",
                          color: activeSubCategory?.name === subCategory.name ? "primary.contrastText" : "text.primary",
                          boxShadow: theme.shadows[1],
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: activeSubCategory?.name === subCategory.name ? "orange" : "action.hover",
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
                <Typography variant="h6" fontWeight="bold" mb={2} color="text.secondary">
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
                              bgcolor: "orange",
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        >
                          {Icon && (
                            <Box
                              component={Icon}
                              sx={{ fontSize: 20, color: "primary.main" }}
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
          {renderBrandsGrid}
        </Box>
      </Box>
    </Drawer>
  );
};

export default React.memo(SideViewContent);