import React, { useState, useEffect } from "react";
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
import { AnimatePresence } from "framer-motion";
// Dynamic Components - Import all your video sections
const dynamicComponents = {
  TopBrandThreevdocards: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopBrandThreeVdoCards")
  ), //first video section
  TopCafeBrandsFranchise: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopCafeBrands.jsx")
  ), //3rd video section
  TopFoodFranchise: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopFoodFranchise.jsx")
  ), //top food franchise section
  TopBeverageFranchise: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopBeverageFranchise.jsx")
  ), //top beverage franchise section
  TopDesertBakeryFranchise: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopDesertBakerys.jsx")
  ),
  TopLeadingFranchise: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopLeadingFranchise.jsx")
  ), //second video section top leading industries
  TopRestaurantsFranchise: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/TopRestaurantsFranchise.jsx")
  ), //Top restaurant investment section
  FindFranchiseLocations: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/FindFranchiseLocations.jsx")
  ), //location cards
  ToTrendingBrands: React.lazy(() =>
    import("../../Components/HomePage_VideoSection/ToTrendingBrands.jsx")
  ), //last video section
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
const bannerTexts = [
  {
    title: {
      text: "1000+ Food Brands. One Platform. Endless Possibilities",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
    },
    subtitle: {
      text: "Discover a universe of F&B franchise opportunities - from quick service restaurants to gourmet cafes - all under on powerful portal.",
      highlight: {
        text: "F&B franchise opportunities",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "Turn Your Investment into a Tasteful Venture",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
    },
    subtitle: {
      text: "Explore curated restaurant and cafe franchises with proven models designed for ROI, stability, and low opertational hassle.",
      highlight: {
        text: "proven models",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "India's #1 F&B Franchise Marketplace – Your Food Business Starts Here",
     gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
    },
    subtitle: {
      text: "From startup food kiosks to international food chains, we have everything you need to start your food franchise journey.",
      highlight: {
        text: "food franchise journey",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },
  {
    title: {
      text: "Serve Success Hot - Choose the Right F&B Franchise Today",
       gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
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
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
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
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
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
      text: "Franchise a Restaurant. Own a Café. Lead a Cloud Kitchen",
       gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
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
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
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
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
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
      text: "Your Food Franchise Future Starts at foodandbeverage.mrfranchise.in",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const controls = useAnimation();
  const dispatch = useDispatch();

  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries[0]?.type === "reload";
    const popupShown = sessionStorage.getItem("popup-shown");

    dispatch(showLoading  ())
   setTimeout(() => {
      if (!popupShown || isReload) {
      setIsPopupOpen(true);
      sessionStorage.setItem("popup-shown", "true");
    }
    controls.start("visible");
    dispatch(hideLoading())
   }, 1000);
  }, [controls, dispatch]);
  // Rotate text every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);


  const handlePopupClose = () => setIsPopupOpen(false);


  // Render a dynamic section component
  const renderSection = (sectionConfig, index) => {
    const DynamicComponent = dynamicComponents[sectionConfig.component];

    return (
      <Box
        key={index}
        sx={{
          py: 1,
          px: 2,
          backgroundColor: sectionConfig.background,
          position: "relative",
          overflow: "hidden",
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
          <React.Suspense fallback={<CircularProgress />}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: sectionConfig.animationDelay,
              }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <DynamicComponent />
            </motion.div>
          </React.Suspense>
        </Container>
      </Box>
    );
  };
  const currentText = bannerTexts[bannerIndex];
  const { text, highlight } = currentText.subtitle;
  return (
    <>
 
      {
        !localStorage.getItem("accessToken") && (
          <PopupModal open={isPopupOpen} onClose={handlePopupClose} />
        )
      }

      {/* Hero Banner */}
      <Box
        mt={10}
        maxWidth={"xl"}
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
          minHeight: isMobile ? "80vh" : "10vh",
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
            // background: 'radial-gradient(circle at 20% 50%, transparent 0%, rgba(0,0,0,0.7) 100%)',
            zIndex: 0,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: isMobile ? "center" : "left",
            
          }}
        >
          <AnimatePresence mode="wait">
          <motion.div
           key={bannerIndex}
    initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
    transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
  >
            {/* <motion.div variants={pageConfig.animations.item}> */}
              <Typography
                component="div"
                sx={{
                  fontWeight: 200,
                  textAlign: "center",
                  color: "white",
                  mb: 1,
                  lineHeight: 1.2,
                  fontSize: isMobile
                    ? currentText.title.fontSize.mobile
                    : isTablet
                    ? currentText.fontSize.tablet
                    : currentText.title.fontSize.desktop,
                }}
              >
                <Box
                  sx={{
                    background: "white",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "none",
                    display: "inline",
                    fontWeight: 900,
                    px: 1,
                  }}
                >
                  {currentText.title.text}
                </Box>
                <Box
                  component="span"
                  sx={{
                    background: currentText.title.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline",
                    fontWeight: 800,
                    px: 1,
                  }}
                >
                  <br />
                  Food & Beverage
                </Box>
              </Typography>
            </motion.div>

            <motion.div variants={pageConfig.animations.item}>
              <Typography
                variant={isMobile ? "h6" : "subtitle2"}
                sx={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 300,
                  mb: 1,
                  maxWidth: "800px",
                  mx: "auto",
                  lineHeight: 1,
                  fontSize: isMobile ? "1.1rem" : "1.1rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
                component={motion.div}
                // animate={pageConfig.animations.pulse}
              >
                {
                  currentText.subtitle.text.split(
                    currentText.subtitle.highlight.text
                  )[0]
                }
                <Typography
                  variant="outlined"
                  sx={{
                    fontWeight:
                      currentText.subtitle.highlight.fontWeight,
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
             </AnimatePresence> 
             {/* </motion.div> */}

            <motion.div
              variants={pageConfig.animations.item}
              style={{
                marginTop: "2rem",
                width: isMobile ? "100%" : "85%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <FilterDropdowns />
            </motion.div>
         
         
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
