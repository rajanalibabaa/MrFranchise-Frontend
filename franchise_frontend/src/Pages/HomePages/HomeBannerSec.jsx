import React, { useState, useEffect, Suspense } from "react";
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
  ViewerBrands: withSuspense(React.lazy(() =>
    import("../../Components/HomePage_VideoSection/ViewerBrands.jsx")
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
      component: "ViewerBrands",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
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
const bannerTexts = [
  {
    title: {
      text: "1000+ Food Brands One Platform Endless Possibilities",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
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
      text: "Turn Your Investment Into A Tasteful Venture",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "Explore Curated Restaurant And Cafe Franchises With Proven Models Designed For ROI Stability And Low Opertational Hassle",
      highlight: {
        text: "proven models",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "India's #1 F&B Franchise Marketplace Your Food Business Starts Here",
     gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
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
      text: "Serve Success Hot - Choose the Right F&B Franchise Today",
       gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "Invest in hot-selling food concepts with hight demand, fast scalability, and support from trusted brands.",
      highlight: {
        text: "F&B Franchise",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "From Local Taste to Global Plates - Start Your Food Business Now",
       gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "Franchise options available in street food, bakeries, ice cream parlors, multicusine restaurants, and more.",
      highlight: {
        text: "Food Business",
        color: "#ff9800",
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
      text: "Franchise a Restaurant. Own a Cafe Lead a Cloud Kitchen",
       gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "Find franchise businesses across every food format to suit your budget, location, and business dream.",
      highlight: {
        text: "franchise businesses",
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
  {
    title: {
      text: "No Experience? No Problem! Proven Food Franchise Models Await You",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "Get full training, support, marketing tools, and setup assistance with our zero-hassle franchise options.",
      highlight: {
        text: "zero-hassle",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "Your Food Franchise Future Starts At foodandbeverage MrFranchise.in",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" }
    },
    subtitle: {
      text: "The one-stop portal for serious F&B investors looking to explore, compare, and close franchise deals.",
      highlight: {
        text: "franchise deals",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
];

const HomeBannerSec = () => {
  const theme = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    return () => clearInterval(interval);
  }, []);

  const handlePopupClose = () => setIsPopupOpen(false);

  const renderSection = (sectionConfig, index) => {
    const DynamicComponent = dynamicComponents[sectionConfig.component];

    return (
      <Box
        key={index}
        sx={{
          py: 1,
          px: 2,
          position: "relative",
          overflow: "hidden",
          backgroundColor: sectionConfig.background || '#fffaf7',
          ...(sectionConfig.backgroundImage && {
            backgroundImage: `linear-gradient(${sectionConfig.background}), url(${sectionConfig.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
        }}
      >
        {sectionConfig.backgroundImage && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: sectionConfig.backgroundOpacity || 0.1,
              zIndex: 0,
            }}
          />
        )}

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
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
        </Container>
      </Box>
    );
  };

  const currentText = bannerTexts[bannerIndex];

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
                lineHeight: 1.5,
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

export default HomeBannerSec;