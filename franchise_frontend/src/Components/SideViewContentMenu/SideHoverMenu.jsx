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
  Slide,
  Button,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { categories } from "../../Pages/Registration/BrandLIstingRegister/BrandCategories";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBrandsByChildCategory,
  clearBrands,
  prefetchBrands,
} from "../../Redux/Slices/SideMenuHoverBrandSlices.jsx";
import debounce  from "lodash/debounce";
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice.jsx";

// Memoized brand card component with optimized props
const BrandCard = React.memo(
  ({ brand, onClick, isMobile }) => {
    const brandName = brand.brandname || "Unknown";
    const brandLogo = brand.logo || "";
    const initial = brandName[0] || "B";

    return (
      <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
        <Paper
          onClick={onClick}
          elevation={2}
          sx={{
            width: isMobile ? 100 : 100,
            height: isMobile ? 130 : 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: "1px solid #eee",
            backgroundColor: "#fff",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              borderColor: "#ff9800",
            },
          }}
        >
          <Box
            sx={{
              width: isMobile ? 48 : 60,
              height: isMobile ? 48 : 60,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <Avatar
              src={brandLogo}
              alt={brandName}
              sx={{
                width: "100%",
                height: "100%",
                fontSize: isMobile ? 22 : 26,
                bgcolor: "#ffe0b2",
                color: "#ff6d00",
              }}
            >
              {initial}
            </Avatar>
          </Box>
          <Typography
            fontWeight={500}
            textAlign="center"
            noWrap
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.65rem",
              maxWidth: "100%",
              px: 1,
              color: "text.primary",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.3,
            }}
          >
            {brandName}
          </Typography>
        </Paper>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if brand ID changes or mobile status changes
    return (
      prevProps.brand._id === nextProps.brand._id &&
      prevProps.isMobile === nextProps.isMobile
    );
  }
);

// Skeleton loader for brands
const BrandCardSkeleton = ({ isMobile }) => (
  <Skeleton
    variant="square"
    width={isMobile ? 100 : 100}
    height={isMobile ? 130 : 120}
    sx={{ borderRadius: 2 }}
  />
);

const SideViewContent = ({ hoverCategory, onHoverLeave }) => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [mobileTabValue, setMobileTabValue] = useState(0);
  const [hoveredChild, setHoveredChild] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Memoized selector for Redux state
  const { brands, loading, error, pagination, currentCategory } = useSelector(
    (state) => ({
      brands: state.brandCategory.brands,
      loading: state.brandCategory.loading,
      error: state.brandCategory.error,
      pagination: state.brandCategory.pagination,
      currentCategory: state.brandCategory.currentCategory,
    }),
    (prev, next) =>
      prev.brands.length === next.brands.length &&
      prev.loading === next.loading &&
      prev.error === next.error &&
      prev.pagination.currentPage === next.pagination.currentPage &&
      prev.currentCategory === next.currentCategory
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Faster debounced hover handler with 100ms delay
  const debouncedHandleSubChildHover = useMemo(
    () =>
      debounce((children, subCategory) => {
        const childName =
          typeof children === "string" ? children : children.name;
        if (subCategory && childName) {
          setHoveredChild(childName);
          setIsTransitioning(true);
          dispatch(
            fetchBrandsByChildCategory({
              subCategory,
              childCategory: childName,
              page: 1,
              limit: 30,
            })
          ).finally(() => {
            setIsTransitioning(false);
          });
        }
      }, 100), // Reduced from 150ms to 100ms
    [dispatch]
  );

  // Immediate category change handler
  const handleCategoryHover = useCallback(
    (index) => {
      if (activeCategory !== index) {
        setIsTransitioning(true);
        dispatch(clearBrands());
        setActiveCategory(index);
        setActiveSubCategory(null);
        setHoveredChild(null);
        // Don't wait for state updates to complete
        setIsTransitioning(false);
      }
    },
    [activeCategory, dispatch]
  );

  // Immediate subcategory change handler
  const handleSubCategoryHover = useCallback(
    (subCategory) => {
      if (activeSubCategory?.name !== subCategory.name) {
        setIsTransitioning(true);
        dispatch(clearBrands());
        setActiveSubCategory(subCategory);
        setHoveredChild(null);
        // Don't wait for state updates to complete
        setIsTransitioning(false);
      }
    },
    [activeSubCategory, dispatch]
  );

  // Prefetch adjacent categories when a subcategory is selected
  useEffect(() => {
    if (activeSubCategory?.children) {
      const subCategoryName = activeSubCategory.name;
      // Prefetch first 3 child categories
      activeSubCategory.children.slice(0, 3).forEach((child) => {
        const childName = typeof child === "string" ? child : child.name;
        dispatch(
          prefetchBrands({
            subCategory: subCategoryName,
            childCategory: childName,
          })
        );
      });
    }
  }, [activeSubCategory, dispatch]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedHandleSubChildHover.cancel();
    };
  }, [debouncedHandleSubChildHover]);

  const handleBrandClick = useCallback((brand) => {
    dispatch(openBrandDialog(brand));
  }, []);

  const handleMobileTabChange = useCallback((event, newValue) => {
    setMobileTabValue(newValue);
  }, []);

  // Immediate child category hover handler
  const handleSubChildHover = useCallback(
    (children) => {
      const subCategory = activeSubCategory?.name;
      const childName = typeof children === "string" ? children : children.name;

      // Immediate visual feedback
      setHoveredChild(childName);
      setIsTransitioning(true);
      dispatch(clearBrands());

      // Debounced API call
      debouncedHandleSubChildHover(children, subCategory);
    },
    [activeSubCategory, debouncedHandleSubChildHover, dispatch]
  );

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNext) {
      const subCategory = activeSubCategory?.name;
      const childCategory = currentCategory;

      if (subCategory && childCategory) {
        dispatch(
          fetchBrandsByChildCategory({
            subCategory,
            childCategory,
            page: pagination.currentPage + 1,
            limit: pagination.limit,
          })
        );
      }
    }
  }, [activeSubCategory, currentCategory, pagination, dispatch]);

  // Clear brands when drawer closes
  useEffect(() => {
    if (!hoverCategory) {
      dispatch(clearBrands());
      setActiveCategory(null);
      setActiveSubCategory(null);
      setMobileTabValue(0);
      setHoveredChild(null);
    }
  }, [hoverCategory, dispatch]);

  // Memoized mobile tab content
  const getMobileTabContent = useMemo(() => {
    const tabContents = [
      // Categories Tab
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
                bgcolor:
                  activeCategory === index
                    ? "primary.main"
                    : "background.paper",
                fontWeight: "medium",
                transition: "all 0.3s ease",
                boxShadow: theme.shadows[1],
                "&:hover": {
                  bgcolor:
                    activeCategory === index ? "primary.dark" : "action.hover",
                },
              }}
            >
              <Typography variant="subtitle1">{category.name}</Typography>
            </Box>
          </motion.div>
        ))}
      </Box>,
      // Subcategories Tab
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
        {activeCategory !== null &&
          categories[activeCategory].children?.map((subCategory, idx) => (
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
                    bgcolor:
                      activeSubCategory?.name === subCategory.name
                        ? "primary.light"
                        : "background.paper",
                    color:
                      activeSubCategory?.name === subCategory.name
                        ? "primary.contrastText"
                        : "text.primary",
                    boxShadow: theme.shadows[1],
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor:
                        activeSubCategory?.name === subCategory.name
                          ? "primary.main"
                          : "action.hover",
                    },
                  }}
                >
                  {subCategory.icon && (
                    <Box
                      component={subCategory.icon}
                      sx={{
                        fontSize: 22,
                        color:
                          activeSubCategory?.name === subCategory.name
                            ? "primary.contrastText"
                            : "primary.main",
                      }}
                    />
                  )}
                  <Typography
                    fontWeight={
                      activeSubCategory?.name === subCategory.name
                        ? "bold"
                        : "medium"
                    }
                  >
                    {subCategory.name}
                  </Typography>
                </Box>
              </motion.div>
            </Grow>
          ))}
      </Box>,
      // Child Categories Tab
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
          const isHovered = hoveredChild === name;

          return (
            <Slide in={true} direction="up" timeout={(idx + 1) * 100} key={idx}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Box
                  onClick={() => handleSubChildHover(children)}
                  onMouseEnter={() => handleSubChildHover(children)}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    py: 1.5,
                    px: 1.5,
                    borderRadius: 2,
                    gap: 1.5,
                    mb: 1,
                    bgcolor: isHovered ? "orange" : "background.paper",
                    color: isHovered ? "primary.contrastText" : "text.primary",
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
                      sx={{
                        fontSize: 20,
                        color: isHovered
                          ? "primary.contrastText"
                          : "primary.main",
                      }}
                    />
                  )}
                  <Typography fontWeight="medium">{name}</Typography>
                </Box>
              </motion.div>
            </Slide>
          );
        })}
      </Box>,
    ];

    return () => tabContents[mobileTabValue] || null;
  }, [
    mobileTabValue,
    activeCategory,
    activeSubCategory,
    handleSubChildHover,
    hoveredChild,
  ]);

  // Optimized brands grid rendering with skeleton loading
  const renderBrandsGrid = useMemo(() => {
    // Show loading state during transitions or initial load
    if (isTransitioning || (loading && brands.length === 0)) {
      return (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
          <Grid container spacing={isMobile ? 1 : 2}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={`initial-skeleton-${index}`}
              >
                <BrandCardSkeleton isMobile={isMobile} />
              </Grid>
            ))}
          </Grid>
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
            Oops! Brands Under Updating Process
          </Typography>
          {/* <Typography variant="body2" sx={{ mb: 2 }}>
            {error || "Failed to load brands. Please try again later."}
          </Typography> */}
          {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Chip
              label="Retry"
              onClick={() => {
                const subCategory = activeSubCategory?.name;
                const childCategory = currentCategory;
                if (subCategory && childCategory) {
                  dispatch(
                    fetchBrandsByChildCategory({
                      subCategory,
                      childCategory,
                      page: 1,
                      limit: 30,
                    })
                  );
                }
              }}
              color="primary"
              sx={{
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            />
          </motion.div> */}
        </Box>
      );
    }

    if (brands.length > 0) {
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
              {currentCategory || "Popular Brands"}
            </Typography>
            <Chip
              label={`${brands.length} brands`}
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <Grid container spacing={isMobile ? 1 : 2}>
            {brands.map((brand, index) => {
              // Create a unique key that handles missing/duplicate IDs
              const uniqueKey = brand?._id
                ? `brand-${brand._id}-${index}`
                : `brand-fallback-${index}`;

              return (
                <Grid item xs={12} sm={6} md={3} key={uniqueKey}>
                  <BrandCard
                    brand={brand}
                    onClick={() => handleBrandClick(brand)}
                    isMobile={isMobile}
                  />
                </Grid>
              );
            })}

            {loading && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={`loadmore-skeleton-${index}`}
                  >
                    <BrandCardSkeleton isMobile={isMobile} />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
          {pagination.hasNext && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                aria-label="load more brands"
                onClick={handleLoadMore}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </Box>
          )}
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
          <Typography variant="h6" gutterBottom>
            Find Your Dream Franchise Brands
          </Typography>
          <Typography variant="body2">
            {isMobile
              ? "Select a category to see brands"
              : "Select a subcategory to see related brands"}
          </Typography>
        </Box>
      </Fade>
    );
  }, [
    brands,
    loading,
    error,
    isMobile,
    pagination,
    currentCategory,
    handleLoadMore,
    handleBrandClick,
    isTransitioning,
  ]);
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
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  minHeight: 48,
                }}
              />
              <Tab
                label="Subcategories"
                disabled={activeCategory === null}
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  minHeight: 48,
                }}
              />
              <Tab
                label="Child Categories"
                disabled={activeSubCategory === null}
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  minHeight: 48,
                }}
              />
            </Tabs>
          </AppBar>
        )}

        {/* Desktop View */}
        {!isMobile && (
          <>
            {/* Categories Column - Fixed */}
            <Box
              sx={{
                width: 240,
                borderRight: `1px solid ${theme.palette.divider}`,
                overflowY: "auto",
                px: 2,
                py: 2,
                background:
                  "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
              }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    onMouseEnter={() => handleCategoryHover(index)}
                    sx={{
                      cursor: "pointer",
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      mb: 1.5,
                      color:
                        activeCategory === index ? "white" : "text.primary",
                      bgcolor:
                        activeCategory === index
                          ? "orange"
                          : "background.paper",
                      fontWeight: "medium",
                      transition: "all 0.3s ease",
                      boxShadow: theme.shadows[1],
                      "&:hover": {
                        bgcolor:
                          activeCategory === index ? "orange" : "action.hover",
                      },
                    }}
                  >
                    <Typography variant="subtitle1">{category.name}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>

            {/* Subcategories Column - Fixed */}
            {activeCategory !== null && (
              <Box
                sx={{
                  width: 260,
                  borderRight: `1px solid ${theme.palette.divider}`,
                  overflowY: "auto",
                  px: 2,
                  py: 2,
                  background:
                    "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
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
                {categories[activeCategory].children?.map(
                  (subCategory, idx) => (
                    <Grow in={true} timeout={(idx + 1) * 150} key={idx}>
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Box
                          onMouseEnter={() =>
                            handleSubCategoryHover(subCategory)
                          }
                          sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            py: 1.5,
                            px: 2,
                            borderRadius: 2,
                            gap: 1.5,
                            mb: 1.5,
                            bgcolor:
                              activeSubCategory?.name === subCategory.name
                                ? "orange"
                                : "background.paper",
                            color:
                              activeSubCategory?.name === subCategory.name
                                ? "primary.contrastText"
                                : "text.primary",
                            boxShadow: theme.shadows[1],
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor:
                                activeSubCategory?.name === subCategory.name
                                  ? "orange"
                                  : "action.hover",
                            },
                          }}
                        >
                          {subCategory.icon && (
                            <Box
                              component={subCategory.icon}
                              sx={{
                                fontSize: 22,
                                color:
                                  activeSubCategory?.name === subCategory.name
                                    ? "primary.contrastText"
                                    : "primary.main",
                              }}
                            />
                          )}
                          <Typography
                            fontWeight={
                              activeSubCategory?.name === subCategory.name
                                ? "bold"
                                : "medium"
                            }
                          >
                            {subCategory.name}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grow>
                  )
                )}
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
                  background:
                    "linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)",
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
                {activeSubCategory?.children?.map((children, idx) => {
                  const name =
                    typeof children === "string" ? children : children.name;
                  const Icon =
                    typeof children === "object" ? children.icon : null;
                  const isHovered = hoveredChild === name;

                  return (
                    <Slide
                      in={true}
                      direction="up"
                      timeout={(idx + 1) * 100}
                      key={idx}
                    >
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Box
                          onClick={() => handleSubChildHover(children)}
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
                            bgcolor: isHovered ? "orange" : "background.paper",
                            color: isHovered
                              ? "primary.contrastText"
                              : "text.primary",
                            boxShadow: theme.shadows[1],
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: "orange",
                              boxShadow: theme.shadows[2],
                            },
                          }}
                        >
                          {Icon && (
                            <Box
                              component={Icon}
                              sx={{
                                fontSize: 20,
                                color: isHovered
                                  ? "primary.contrastText"
                                  : "primary.main",
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
          <Box
            sx={{ flex: 1, overflowY: "auto", bgcolor: "background.default" }}
          >
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
