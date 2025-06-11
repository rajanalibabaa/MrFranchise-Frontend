import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import PopupModal from "../../Components/PopUpModal/PopUpModal";
import FilterDropdowns from "../../Components/Navbar/FilterDropdownsData";
import { fetchBrands } from "../../Redux/Slices/brandSlice.jsx";
import { useDispatch } from "react-redux";
import Footer from "../../Components/Footers/Footer.jsx";
// Dynamic Components - Import all your video sections
const dynamicComponents = {
  TopBrandVdoSec: React.lazy(() => import("../../Components/HomePage_VideoSection/TopBrandTwoVdoSec")),
  TopBrandVdoCards: React.lazy(() => import("../../Components/HomePage_VideoSection/TopBrandThreeVdoCards")),//first video section
  TopIndusVdoSec: React.lazy(() => import("../../Components/HomePage_VideoSection/TopIndusVdoSecRandomAll")), //second video section top leading industries
  TopInvestVdoSec: React.lazy(() => import("../../Components/HomePage_VideoSection/TopInvestVdoSec.jsx")), //TOp restaurant investment section
  TopInvestVdo2: React.lazy(() => import("../../Components/HomePage_VideoSection/TopInvestVdo2")),//location cards
  TopInvestVdocardround: React.lazy(() => import("../../Components/HomePage_VideoSection/ToTrendingBrands")),//last video section
  TopCafeBrandsSection:React.lazy(()=>import('../../Components/HomePage_VideoSection/TopCafeBrands.jsx')), //3rd video section
  TopFoodFranchise:React.lazy(()=> import('../../Components/HomePage_VideoSection/TopFoodFranchise.jsx')), //top food franchise section
  TopBeverageFranchise:React.lazy(()=> import ('../../Components/HomePage_VideoSection/TopBeverageFranchise.jsx')), //top beverage franchise section
TopDesertBakeryFranchise:React.lazy(()=>import('../../Components/HomePage_VideoSection/TopDesertBakerys.jsx'))
};




// Configuration object for the entire page
const pageConfig = {
  // Hero Banner Configuration
  heroBanner: {
    backgroundImage: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    overlayColor: "rgba(0, 0, 0, 0.3)",
    title: {
      text: "Welcome To Our MrFranchise Network",
      gradient: "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" }
    },
    subtitle: {
      text: "World's most comprehensive franchise platform with 1000+ opportunities waiting for you...",
      highlight: {
        text: "1000+ opportunities",
        color: "#ff9800",
        fontWeight: "bold"
      }
    }
  },

  // Section Configuration
  sections: [
    {
      component: "TopBrandVdoCards",
      background: "white",
      backgroundOpacity: 0.1,
      animationDelay: 0.2
    },
    {
      component: "TopIndusVdoSec",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0.4
    },
    {
      component: "TopCafeBrandsSection",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0.5
    },
    {
      component: "TopFoodFranchise",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0.5
    },
    {
      component: "TopBeverageFranchise",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0.5
    },
    {
      component: "TopDesertBakeryFranchise",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0.5
    },
    {
      component: "TopInvestVdoSec",
      background: "white",
      dividerColor: "linear-gradient(45deg, #FF9800, #FF5722)",
      animationDelay: 0.6
    },
    {
      component: "TopInvestVdo2",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0.8
    },
    {
      component: "TopInvestVdocardround",
      title: "Trending Brands",
      backgroundImage: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
      dividerColor: "linear-gradient(45deg, #FF9800, #FF5722)",
      animationDelay: 1.0
    }
  ],

  // Global Animation Settings
  animations: {
    banner: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          when: "beforeChildren",
          staggerChildren: 0.3
        }
      }
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 100
        }
      }
    },
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

const HomeBannerSec = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const controls = useAnimation();
  const dispatch = useDispatch()

  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries[0]?.type === "reload";
    const popupShown = sessionStorage.getItem("popup-shown");
     dispatch(fetchBrands())

    if (!popupShown || isReload) {
      setIsPopupOpen(true);
      sessionStorage.setItem("popup-shown", "true");
    }

    controls.start("visible");
  }, [controls]);

  const handlePopupClose = () => setIsPopupOpen(false);

  // Render a dynamic section component
  const renderSection   = (sectionConfig, index) => {
    const DynamicComponent = dynamicComponents[sectionConfig.component];
    
    return (
      <Box
      
        key={index}
        sx={{
          
          py: 1,
          px: 2,
          backgroundColor: sectionConfig.background,
          position: 'relative',
          overflow: 'hidden',
          ...(sectionConfig.backgroundImage && {
            backgroundImage: `linear-gradient(${sectionConfig.background}), url(${sectionConfig.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          })
        }}
      >
        {sectionConfig.backgroundImage && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: sectionConfig.backgroundOpacity || 0.1,
              zIndex: 0
            }}
          />
        )}
        
        <Container  maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          
          <React.Suspense fallback={<div>Loading...</div>}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: sectionConfig.animationDelay }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <DynamicComponent />
            </motion.div>
          </React.Suspense>
        </Container>
      </Box>
    );
  };

  return (
    <>
      <PopupModal open={isPopupOpen} onClose={handlePopupClose} />
      
      {/* Hero Banner */}
      <Box
       mt={10} 
      maxWidth={'xl'}
        sx={{
          background: `linear-gradient(${pageConfig.heroBanner.overlayColor}), url(${pageConfig.heroBanner.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          py: 1,
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          minHeight: isMobile ? '80vh' : '10vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '0px',
            background: 'linear-gradient(to bottom, transparent 0%, #fff 100%)',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // background: 'radial-gradient(circle at 20% 50%, transparent 0%, rgba(0,0,0,0.7) 100%)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg" sx={{ 
          position: 'relative', 
          zIndex: 2,
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <motion.div
            initial="hidden"
            animate={controls}
            variants={pageConfig.animations.banner}
          >
            <motion.div variants={pageConfig.animations.item}>
              <Typography 
                component="div" 
                sx={{
                  fontWeight: 200,
                  textAlign: 'center',
                  color: 'white',
                  mb: 1,
                  lineHeight: 1.2,
                  fontSize: isMobile 
                    ? pageConfig.heroBanner.title.fontSize.mobile
                    : isTablet 
                      ? pageConfig.heroBanner.title.fontSize.tablet
                      : pageConfig.heroBanner.title.fontSize.desktop
                }}
              >
                <Box sx={{ 
                  background: 'white',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  display: 'inline',
                  fontWeight: 900,
                  px: 1
                }}>
                  {pageConfig.heroBanner.title.text}
                </Box>
                <Box component="span" sx={{ 
                  background: pageConfig.heroBanner.title.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline',
                  fontWeight: 800,
                  px: 1
                }}> 
                  <br/>Food & Beverage
                </Box>
              </Typography>
            </motion.div>
            
            <motion.div variants={pageConfig.animations.item}>
              <Typography 
                variant={isMobile ? "h6" : 'subtitle2'}
                sx={{
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 300,
                  mb: 1,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1,
                  fontSize: isMobile ? '1.1rem' : '1.1rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
                component={motion.div}
                animate={pageConfig.animations.pulse}
              >
                {pageConfig.heroBanner.subtitle.text.split(pageConfig.heroBanner.subtitle.highlight.text)[0]}
                <Typography variant="outlined" sx={{ 
                  fontWeight: pageConfig.heroBanner.subtitle.highlight.fontWeight,
                  color: pageConfig.heroBanner.subtitle.highlight.color 
                }}>
                  {pageConfig.heroBanner.subtitle.highlight.text}
                </Typography>
                {pageConfig.heroBanner.subtitle.text.split(pageConfig.heroBanner.subtitle.highlight.text)[1]}
              </Typography>
            </motion.div>

            <motion.div 
              variants={pageConfig.animations.item}
              style={{ 
                marginTop: '2rem',
                width: isMobile ? '100%' : '85%',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <FilterDropdowns />
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Render all sections from config */}
      <Box  sx={{ backgroundColor: '#fffaf7'}}>
        {pageConfig.sections.map((section, index) => renderSection(section, index))}
      </Box>
<Footer/>
    </>
  );
};

export default HomeBannerSec;