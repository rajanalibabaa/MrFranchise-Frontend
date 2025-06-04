// import React, { useState, useEffect } from "react";
// import logo from "../.././assets/Images/logo.png";
// import {
//   Box,
//   Button,
//   Typography,
//   Container,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import TopBrandVdoSec from "../../Components/HomePage_VideoSection/TopBrandTwoVdoSec";
// import TopIndusVdoSec from "../../Components/HomePage_VideoSection/TopIndusVdoSecRandomAll";
// import TopInvestVdoSec from "../../Components/HomePage_VideoSection/TopInvestVdoSec";
// import Navbar from "../../Components/Navbar/NavBar";
// import Footer from "../../Components/Footers/Footer";
// import PopupModal from "../../Components/PopUpModal/PopUpModal";
// import TopBrandVdoCards from "../../Components/HomePage_VideoSection/TopBrandThreeVdoCards";
// import TopInvestVdo2 from "../../Components/HomePage_VideoSection/TopInvestVdo2";
// import TopInvestVdocardround from "../../Components/HomePage_VideoSection/ToTrendingBrands";
// import { motion, useAnimation } from "framer-motion";
// import FilterDropdowns from "../../Components/Navbar/FilterDropdownsData";

// // Particle background component
// const ParticleBackground = () => {
//   const particles = Array.from({ length: 30 });
  
//   return (
//     <Box sx={{
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       overflow: 'hidden',
//       zIndex: 0
//     }}>
//       {particles.map((_, i) => (
//         <motion.div
//           key={i}
//           style={{
//             position: 'absolute',
//             borderRadius: '50%',
//             background: 'rgba(255, 152, 0, 0.2)',
//           }}
//           initial={{
//             x: Math.random() * 100,
//             y: Math.random() * 100,
//             width: Math.random() * 10 + 5,
//             height: Math.random() * 10 + 5,
//             opacity: Math.random() * 0.5 + 0.1,
//           }}
//           animate={{
//             y: [null, (Math.random() - 0.5) * 100 + 100],
//             x: [null, (Math.random() - 0.5) * 100],
//             transition: {
//               duration: Math.random() * 10 + 10,
//               repeat: Infinity,
//               repeatType: 'reverse',
//               ease: 'linear'
//             }
//           }}
//         />
//       ))}
//     </Box>
//   );
// };

// const HomeBannerSec = () => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const controls = useAnimation();

//   useEffect(() => {
//     const navEntries = performance.getEntriesByType("navigation");
//     const isReload = navEntries[0]?.type === "reload";
//     const popupShown = sessionStorage.getItem("popup-shown");

//     if (!popupShown || isReload) {
//       setIsPopupOpen(true);
//       sessionStorage.setItem("popup-shown", "true");
//     }

//     // Start animations
//     controls.start("visible");
//   }, [controls]);

//   const handlePopupClose = () => setIsPopupOpen(false);

//   const bannerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.3
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         damping: 10,
//         stiffness: 100
//       }
//     }
//   };

//   const pulse = {
//     scale: [1, 1.02, 1],
//     transition: {
//       duration: 2,
//       repeat: Infinity,
//       ease: "easeInOut"
//     }
//   };

//   return (
//     <>
//       <PopupModal open={isPopupOpen} onClose={handlePopupClose} />
//       <Navbar />
      
//       {/* Welcome Banner */}
//       <Box
//         sx={{
//           background: 'linear-gradient(135deg, rgba(223, 138, 10, 0.15) 0%, rgba(255,152,0,0.03) 100%)',
//           py: 6,
//           px: 2,
//           position: 'relative',
//           overflow: 'hidden',
//           borderBottom: '1px solid rgba(255, 152, 0, 0.1)'
//         }}
//       >
//         <ParticleBackground />
        
//         {/* Animated gradient border effect */}
//         <Box sx={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: '4px',
//           background: 'linear-gradient(90deg, #FF9800, #FF5722, #FF9800)',
//           backgroundSize: '200% 200%',
//           animation: 'gradient 3s ease infinite'
//         }} />
        
//         <Container maxWidth="lg">
//           <motion.div
//             initial="hidden"
//             animate={controls}
//             variants={bannerVariants}
//           >
//             <motion.div variants={itemVariants}>
//               <Typography 
//                 variant={isMobile ? "h3" : "h2"} 
//                 component="div" 
//                 sx={{
//                   fontWeight: 800,
//                   textAlign: 'center',
//                   color: 'text.primary',
//                   position: 'relative',
//                   zIndex: 1,
//                   mb: 2,
//                   textShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                   background: 'linear-gradient(45deg, #FF9800, #FF5722)',
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                   display: 'inline-block',
//                   width: '100%'
//                 }}
//               >
//                 Welcome to Our Franchise Network
//               </Typography>
//             </motion.div>
            
//             <motion.div variants={itemVariants}>
//               <Typography 
//                 variant={isMobile ? "h6" : "h5"}
//                 sx={{
//                   textAlign: 'center',
//                   color: 'text.secondary',
//                   position: 'relative',
//                   zIndex: 1,
//                   fontWeight: 500,
//                   mb: 4,
//                   maxWidth: '800px',
//                   mx: 'auto',
//                   lineHeight: 1.6
//                 }}
//                 component={motion.div}
//                 animate={pulse}
//               >
//                 Discover the world's most comprehensive franchise platform with thousands of opportunities waiting for you
//               </Typography>
//             </motion.div>

//             {/* <motion.div 
//               variants={itemVariants}
//               style={{ display: 'flex', justifyContent: 'center' }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{
//                   px: 4,
//                   py: 1.5,
//                   borderRadius: '50px',
//                   fontWeight: 600,
//                   fontSize: isMobile ? '1rem' : '1.1rem',
//                   boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
//                   '&:hover': {
//                     transform: 'translateY(-2px)',
//                     boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)'
//                   },
//                   transition: 'all 0.3s ease'
//                 }}
//                 component={motion.div}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Explore Franchises
//               </Button>
//             </motion.div> */}

//             <motion.div 
//               variants={itemVariants}
//               style={{ marginTop: '2rem' }}
//             >
//               <FilterDropdowns />
//             </motion.div>
//           </motion.div>
//         </Container>
//       </Box>

//       {/* Floating animated shapes */}
//       <Box sx={{
//         position: 'absolute',
//         width: '100%',
//         height: '100%',
//         top: 0,
//         left: 0,
//         overflow: 'hidden',
//         pointerEvents: 'none',
//         zIndex: 0
//       }}>
//         {[1, 2, 3].map((i) => (
//           <motion.div
//             key={i}
//             style={{
//               position: 'absolute',
//               borderRadius: i % 2 ? '50%' : '30%',
//               background: `rgba(255, ${152 + i * 20}, ${i * 50}, 0.1)`,
//               filter: 'blur(20px)'
//             }}
//             initial={{
//               x: Math.random() * 100,
//               y: Math.random() * 100,
//               width: Math.random() * 300 + 100,
//               height: Math.random() * 300 + 100,
//               opacity: 0.3
//             }}
//             animate={{
//               x: [null, (Math.random() - 0.5) * 200],
//               y: [null, (Math.random() - 0.5) * 200],
//               rotate: [0, 360],
//               transition: {
//                 duration: Math.random() * 20 + 20,
//                 repeat: Infinity,
//                 repeatType: 'reverse',
//                 ease: 'linear'
//               }
//             }}
//           />
//         ))}
//       </Box>

//       {/* Video sections with animated entrance */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true, margin: "-100px" }}
//       >
//         <TopBrandVdoSec />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//         viewport={{ once: true, margin: "-100px" }}
//       >
//         <TopBrandVdoCards />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 0.4 }}
//         viewport={{ once: true, margin: "-100px" }}
//       >
//         <TopIndusVdoSec />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 0.6 }}
//         viewport={{ once: true, margin: "-100px" }}
//       >
//         <TopInvestVdoSec />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 0.8 }}
//         viewport={{ once: true, margin: "-100px" }}
//       >
//         <TopInvestVdo2 />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, delay: 1.0 }}
//         viewport={{ once: true, margin: "-100px" }}
//       >
//         <TopInvestVdocardround />
//       </motion.div>

//       <Footer />
//     </>
//   );
// };

// export default HomeBannerSec;
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import Navbar from "../../Components/Navbar/NavBar";
import Footer from "../../Components/Footers/Footer";
import PopupModal from "../../Components/PopUpModal/PopUpModal";
import FilterDropdowns from "../../Components/Navbar/FilterDropdownsData";

// Dynamic Components - Import all your video sections
const dynamicComponents = {
  TopBrandVdoSec: React.lazy(() => import("../../Components/HomePage_VideoSection/TopBrandTwoVdoSec")),
  TopBrandVdoCards: React.lazy(() => import("../../Components/HomePage_VideoSection/TopBrandThreeVdoCards")),
  TopIndusVdoSec: React.lazy(() => import("../../Components/HomePage_VideoSection/TopIndusVdoSecRandomAll")),
  TopInvestVdoSec: React.lazy(() => import("../../Components/HomePage_VideoSection/TopInvestVdoSec")),
  TopInvestVdo2: React.lazy(() => import("../../Components/HomePage_VideoSection/TopInvestVdo2")),
  TopInvestVdocardround: React.lazy(() => import("../../Components/HomePage_VideoSection/ToTrendingBrands"))
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
      component: "TopBrandVdoSec",
      title: "Trending Food Franchises",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0
    },
    {
      component: "TopBrandVdoCards",
      title: "Popular Cuisine Categories",
      background: "white",
      // backgroundImage: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      backgroundOpacity: 0.1,
      dividerColor: "linear-gradient(45deg, #FF9800, #FF5722)",
      animationDelay: 0.2
    },
    {
      component: "TopIndusVdoSec",
      title: "Franchise Booming Industries",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0.4
    },
    {
      component: "TopInvestVdoSec",
      title: "Investment Opportunities",
      background: "white",
      dividerColor: "linear-gradient(45deg, #FF9800, #FF5722)",
      animationDelay: 0.6
    },
    {
      component: "TopInvestVdo2",
      title: "Emerging Concepts",
      background: "#fffaf7",
      dividerColor: "linear-gradient(45deg, #FF5722, #FF9800)",
      animationDelay: 0.8
    },
    {
      component: "TopInvestVdocardround",
      title: "Trending Brands",
      background: "linear-gradient(rgba(255, 250, 247, 0.85), rgba(255, 250, 247, 0.7))",
      // backgroundImage: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
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

  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries[0]?.type === "reload";
    const popupShown = sessionStorage.getItem("popup-shown");

    if (!popupShown || isReload) {
      setIsPopupOpen(true);
      sessionStorage.setItem("popup-shown", "true");
    }

    controls.start("visible");
  }, [controls]);

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
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              // mb: 6,
              color: '#333',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '280px',
                height: '4px',
                background: sectionConfig.dividerColor,
                margin: '20px auto 0',
                borderRadius: '2px'
              }
            }}
          >
            {sectionConfig.title}
          </Typography>
          
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
      <Navbar />
      
      {/* Hero Banner */}
      <Box
      maxWidth={'xl'}
        sx={{
          background: `linear-gradient(${pageConfig.heroBanner.overlayColor}), url(${pageConfig.heroBanner.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          py: 3,
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
        <Container maxWidth="xl" sx={{ 
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
                  mb: 2,
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
                  mb: 4,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.3,
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
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
                marginTop: '3rem',
                width: isMobile ? '100%' : '80%',
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
      <Box sx={{ backgroundColor: '#fffaf7' }}>
        {pageConfig.sections.map((section, index) => renderSection(section, index))}
      </Box>

      <Footer />
    </>
  );
};

export default HomeBannerSec;