<<<<<<< HEAD
import React, { useState, useEffect, Suspense } from "react";
=======
import React, { useState, useEffect, useMemo } from "react";
>>>>>>> bd2a0f8a42f3c7b609b3aac6b6f369c3195c21ed
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  CircularProgress
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import PopupModal from "../../Components/PopUpModal/PopUpModal";
import FilterDropdowns from "../../Components/Navbar/FilterDropdownsData";
import { useDispatch } from "react-redux";
import Footer from "../../Components/Footers/Footer.jsx";
import { hideLoading, showLoading } from "../../Redux/Slices/loadingSlice.jsx";
import Navbar from "../../Components/Navbar/NavBar.jsx";

<<<<<<< HEAD
// Higher-order component for Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '300px',
      backgroundColor: '#fffaf7'
    }}>
      <CircularProgress color="secondary" />
    </Box>
  }>
    <Component {...props} />
  </Suspense>
);

// Dynamic Components with Suspense
const dynamicComponents = {
  TopBrandThreevdocards: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopBrandThreeVdoCards")
  )),
  TopCafeBrandsFranchise: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopCafeBrands.jsx")
  )),
  TopFoodFranchise: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopFoodFranchise.jsx")
  )),
  TopBeverageFranchise: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopBeverageFranchise.jsx")
  )),
  TopDesertBakeryFranchise: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopDesertBakerys.jsx")
  )),
  TopLeadingFranchise: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopLeadingFranchise.jsx")
  )),
  TopRestaurantsFranchise: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopRestaurantsFranchise.jsx")
  )),
  FindFranchiseLocations: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/FindFranchiseLocations.jsx")
  )),
  ToTrendingBrands: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/ToTrendingBrands.jsx")
  )),
};

// Configuration object for the entire page
const pageConfig = {
  heroBanner: {
    backgroundImage:
      "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    overlayColor: "rgba(0, 0, 0, 0.3)",
    title: {
      text: "Welcome To Our MrFranchise Network",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" },
    },
    subtitle: {
      text: "World's most comprehensive franchise platform with 1000+ opportunities waiting for you...",
      highlight: {
        text: "1000+ opportunities",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },

  // Section Configuration
  sections: [
    {
      component: "TopBrandThreevdocards",
      background: "white",
      backgroundOpacity: 0.1,
    },
    {
      component: "TopCafeBrandsFranchise",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
    },
    {
      component: "TopFoodFranchise",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
    },
    {
      component: "TopBeverageFranchise",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
    },
    {
      component: "TopDesertBakeryFranchise",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
    },
    {
      component: "TopLeadingFranchise",
      background: "white",
      dividerColor: "linear-gradient(45deg, #FF9800, #FF5722)",
    },
    {
      component: "TopRestaurantsFranchise",
      background: "white",
      dividerColor: "linear-gradient(45deg, #FF9800, #FF5722)",
    },
    {
      component: "FindFranchiseLocations",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
    },
    {
      component: "ToTrendingBrands",
      title: "Trending Brands",
      dividerColor: "linear-gradient(45deg, #FF9800, #FF5722)",
    },
  ],

  // Global Animation Settings
  animations: {
    banner: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          when: "beforeChildren",
          staggerChildren: 0.3,
        },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 100,
        },
      },
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

// Array of banner texts (3 contents)
=======
// Optimized banner texts (reduced from 10 to 4)
>>>>>>> bd2a0f8a42f3c7b609b3aac6b6f369c3195c21ed
const bannerTexts = [
  {
    title: {
      text: "1000+ Food Brands One Platform Endless Possibilities",
      gradient: "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "Discover A Universe Of F&B Franchise Opportunities From Quick Service Restaurants To Gourmet Cafes All Under On Powerful Portal",
      highlight: {
        text: "F&B franchise opportunities",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "India's #1 F&B Franchise Marketplace Your Food Business Starts Here",
      gradient: "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "From Startup Food kiosks To International Food Chains We Have Everything You Need To Start Your Food Franchise Journey",
      highlight: {
        text: "food franchise journey",
        color: "#ff9800",
        lineHeight: "1.5",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "Low Investment . High Appetite for Growth",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "Start from just ₹5 Lakhs with multiple profitable options in cafes, cloud kitchens, and food trucks.",
      highlight: {
        text: "Low Investment",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "F&B Franchise Made Easy with MrFranchise.in",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "Step-by-step guidance, brand comparisons, and expert consultation to help you confidently invest.",
      highlight: {
        text: "consultation",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
];

// Optimized dynamic imports with preloading
const dynamicComponents = {
  TopBrandThreevdocards: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/TopBrandThreeVdoCards")
  ),
  TopCafeBrandsFranchise: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/TopCafeBrands.jsx")
  ),
  TopFoodFranchise: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/TopFoodFranchise.jsx")
  ),
  TopBeverageFranchise: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/TopBeverageFranchise.jsx")
  ),
  TopDesertBakeryFranchise: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/TopDesertBakerys.jsx")
  ),
  TopLeadingFranchise: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/TopLeadingFranchise.jsx")
  ),
  TopRestaurantsFranchise: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/TopRestaurantsFranchise.jsx")
  ),
  FindFranchiseLocations: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/FindFranchiseLocations.jsx")
  ),
  ToTrendingBrands: React.lazy(() => 
    import("../../Components/HomePage_VideoSection/ToTrendingBrands.jsx")
  ),
};

// Optimized page config with simplified animations
const pageConfig = {
  heroBanner: {
    backgroundImage: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    overlayColor: "rgba(0, 0, 0, 0.3)",
  },
  sections: [
    { component: "TopBrandThreevdocards", background: "white" },
    { component: "TopCafeBrandsFranchise", background: "#fffaf7" },
    { component: "TopFoodFranchise", background: "#fffaf7" },
    { component: "TopBeverageFranchise", background: "#fffaf7" },
    { component: "TopDesertBakeryFranchise", background: "#fffaf7" },
    { component: "TopLeadingFranchise", background: "white" },
    { component: "TopRestaurantsFranchise", background: "white" },
    { component: "FindFranchiseLocations", background: "#fffaf7" },
    { component: "ToTrendingBrands", title: "Trending Brands" },
  ],
  animations: {
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      transition: { duration: 0.3 }
    }
  }
};

// Memoized components to prevent unnecessary re-renders
const HeroBanner = React.memo(({ currentText, isMobile }) => {
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        px: 2,
        py: isMobile ? 6 : 10,
        maxHeight: isMobile ? "50vh" : "20vh",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <motion.div
        key={currentText.title.text}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ minHeight: isMobile ? '60px' : '40px' }}
      >
        <Typography component="span" mb={3}>
          <Box
            sx={{
              background: currentText.title.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: isMobile ? "2rem" : "2rem",
              fontWeight: 900,
              px: 2,
              lineHeight: 1.2,
              maxWidth: "100%",
            }}
          >
            {currentText.title.text}
          </Box>
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ minHeight: isMobile ? '50px' : '70px' }}
      >
        <Typography
          variant={isMobile ? "h6" : "subtitle1"}
          mt={3}
          sx={{
            textAlign: "center",
            color: "rgba(255,255,255,0.9)",
            fontWeight: 300,
            mb: 3,
            maxWidth: "800px",
            mx: "auto",
            lineHeight: 1.4,
            fontSize: isMobile ? "1rem" : "1.2rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {currentText.subtitle.text.split(currentText.subtitle.highlight.text)[0]}
          <Typography
            component="span"
            sx={{
              fontWeight: currentText.subtitle.highlight.fontWeight || 600,
              color: currentText.subtitle.highlight.color || '#ff9800',
              display: "inline",
            }}
          >
            {currentText.subtitle.highlight.text}
          </Typography>
          {currentText.subtitle.text.split(currentText.subtitle.highlight.text)[1]}
        </Typography>
      </motion.div>
    </Box>
  );
});

const HomeBannerSec = () => {
  const theme = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
<<<<<<< HEAD
  const controls = useAnimation();
  const dispatch = useDispatch();

  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries[0]?.type === "reload";
    const popupShown = sessionStorage.getItem("popup-shown");

    dispatch(showLoading());
    setTimeout(() => {
      if (!popupShown || isReload) {
        setIsPopupOpen(true);
        sessionStorage.setItem("popup-shown", "true");
      }
      dispatch(hideLoading());
    }, 1000);
  }, [controls, dispatch]);

  // Rotate text every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 120000); // 2 minutes
=======
  const dispatch = useDispatch();

  // Preload critical resources
  useEffect(() => {
    const preloadResources = async () => {
      try {
        dispatch(showLoading());
        
        // Preload hero image
        const img = new Image();
        img.src = pageConfig.heroBanner.backgroundImage;
        
        // Preload critical components
        await Promise.all([
          import("../../Components/HomePage_VideoSection/TopBrandThreeVdoCards"),
          import("../../Components/HomePage_VideoSection/TopCafeBrands.jsx")
        ]);
        
        // Check for popup
        const navEntries = performance.getEntriesByType("navigation");
        const isReload = navEntries[0]?.type === "reload";
        const popupShown = sessionStorage.getItem("popup-shown");
        
        if (!popupShown || isReload) {
          setIsPopupOpen(true);
          sessionStorage.setItem("popup-shown", "true");
        }
        
        dispatch(hideLoading());
      } catch (error) {
        console.error("Preload error:", error);
        dispatch(hideLoading());
      }
    };
    
    preloadResources();
  }, [dispatch]);

  // Rotate text every 10 seconds (reduced from every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 10000);
>>>>>>> bd2a0f8a42f3c7b609b3aac6b6f369c3195c21ed
    return () => clearInterval(interval);
  }, []);

  const handlePopupClose = () => setIsPopupOpen(false);

<<<<<<< HEAD
=======
  // Memoize current text to prevent unnecessary re-renders
  const currentText = useMemo(() => bannerTexts[bannerIndex], [bannerIndex]);

  // Optimized section renderer
>>>>>>> bd2a0f8a42f3c7b609b3aac6b6f369c3195c21ed
  const renderSection = (sectionConfig, index) => {
    const DynamicComponent = dynamicComponents[sectionConfig.component];
    
    return (
      <Box
        key={`${sectionConfig.component}-${index}`}
        sx={{
          py: 1,
          px: 2,
<<<<<<< HEAD
          position: "relative",
          overflow: "hidden",
          backgroundColor: sectionConfig.background || '#fffaf7',
          ...(sectionConfig.backgroundImage && {
            backgroundImage: `linear-gradient(${sectionConfig.background}), url(${sectionConfig.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
=======
          backgroundColor: sectionConfig.background,
          position: "relative",
          overflow: "hidden",
>>>>>>> bd2a0f8a42f3c7b609b3aac6b6f369c3195c21ed
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
<<<<<<< HEAD
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
            }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <DynamicComponent />
          </motion.div>
=======
          <React.Suspense fallback={<Box minHeight="300px" display="flex" justifyContent="center" alignItems="center"><CircularProgress /></Box>}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={pageConfig.animations.item}
            >
              <DynamicComponent />
            </motion.div>
          </React.Suspense>
>>>>>>> bd2a0f8a42f3c7b609b3aac6b6f369c3195c21ed
        </Container>
      </Box>
    );
  };
<<<<<<< HEAD

  const currentText = bannerTexts[bannerIndex];

=======
>>>>>>> bd2a0f8a42f3c7b609b3aac6b6f369c3195c21ed
  return (
    <>
      <Navbar />
      {!localStorage.getItem("accessToken") && (
        <PopupModal open={isPopupOpen} onClose={handlePopupClose} />
      )}

      {/* Hero Banner */}
      <Box
        mt={0}
        sx={{
          background: `linear-gradient(${pageConfig.heroBanner.overlayColor}), url(${pageConfig.heroBanner.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          py: 1,
          px: 2,
          position: "relative",
          overflow: "hidden",
          color: "white",
          minHeight: isMobile ? "95vh" : "40vh",
                    maxHeight: isMobile ? "95vh" : "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "0px",
            background: "linear-gradient(to bottom, transparent 0%, #fff 100%)",
            zIndex: 1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          },
        }}
      >
<<<<<<< HEAD
        <Container
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: isMobile ? "center" : "center",
          }}
        >
          <motion.div
            key={bannerIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          >
            <Typography
              mb={3}
              component='span'
            >
              <Box
                sx={{
                  background: currentText.title.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                  display: "inline",
                  fontSize: isMobile ? "2rem" : "2.2rem",
                  fontWeight: 900,
                  px: 1,
                }}
              >
                {currentText.title.text}
              </Box>
            </Typography>
          </motion.div>

          <motion.div variants={pageConfig.animations.item}>
            <Typography
              variant={isMobile ? "h6" : "subtitle2"}
              mt={3}
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 300,
                mb: 3,
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1,
                fontSize: isMobile ? "1.1rem" : "1.1rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
              component={motion.div}
            >
              {
                currentText.subtitle.text.split(
                  currentText.subtitle.highlight.text
                )[0]
              }
              <Typography
                variant="outlined"
                sx={{
                  fontWeight: currentText.subtitle.highlight.fontWeight,
                  color: currentText.subtitle.highlight.color,
                  display: "inline",
                }}
                component="span"
              >
                {currentText.subtitle.highlight.text}
              </Typography>
              {
                currentText.subtitle.text.split(
                currentText.subtitle.highlight.text
                )[1]
              }
            </Typography>
          </motion.div>
      
          <FilterDropdowns />
        </Container>
=======
        
       <Box
  sx={{
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    px: 2,
    py: isMobile ? 6 : 10,
    maxHeight: isMobile ? "50vh" : "20vh", // Fixed overall height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <motion.div
    key={bannerIndex}
    initial={{ opacity: 0, x: 80 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -80 }}
    transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
    style={{ minHeight: isMobile ? '60px' : '40px' }}  // Fixes jumping during animation
  >
    <Typography component="span" mb={3}>
      <Box
        sx={{
          background: "linear-gradient(45deg, #ff9800, white, rgb(155, 249, 33))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "none",
          fontSize: isMobile ? "2rem" : "2rem",  // Slightly bigger for desktop
          fontWeight: 900,
          px: 2,
          lineHeight: 1.2,
          maxWidth: "100%",
          whiteSpace: 'nowrap',   // Prevents multi-line jump (optional)
        }}
      >
        {currentText.title.text || "Default Title"}
      </Box>
    </Typography>
  </motion.div>

  <motion.div
    variants={pageConfig.animations.item}
    style={{ minHeight: isMobile ? '50px' : '70px' }}  // Prevents subtitle jumping
  >
    <Typography
      variant={isMobile ? "h6" : "subtitle1"}
      mt={3}
      sx={{
        textAlign: "center",
        color: "rgba(255,255,255,0.9)",
        fontWeight: 300,
        mb: 3,
        maxWidth: "800px",
        mx: "auto",
        lineHeight: 1.4,
        fontSize: isMobile ? "1rem" : "1.2rem",
        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
      }}
    >
      {currentText.subtitle.text.split(currentText.subtitle.highlight.text)[0]}
      <Typography
        component="span"
        sx={{
          fontWeight: currentText.subtitle.highlight.fontWeight || 600,
          color: currentText.subtitle.highlight.color || '#ff9800',
          display: "inline",
        }}
      >
        {currentText.subtitle.highlight.text || "Highlight"}
      </Typography>
      {currentText.subtitle.text.split(currentText.subtitle.highlight.text)[1]}
    </Typography>
  </motion.div>

  <Box sx={{ mt: isMobile ? 4 : 6, minHeight: isMobile ? '60px' : '80px', width: '100%', maxWidth: '800px' }}>
    <FilterDropdowns />
  </Box>
</Box>

>>>>>>> bd2a0f8a42f3c7b609b3aac6b6f369c3195c21ed
      </Box>

      {/* Render all sections from config */}
      <Box sx={{ backgroundColor: "#fffaf7" }}>
        {pageConfig.sections.map((section, index) =>
          renderSection(section, index)
        )}
      </Box>
      <Footer />
    </>
  );
};

export default React.memo(HomeBannerSec);