import React, { useState,useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import bgimg from "../.././assets/Images/bgimg.jpg";
import logo from "../.././assets/Images/logo.png";
import {
  Box,
  Button,
  Typography,
  Modal,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import TopBrandVdoSec from "../../Components/HomePage_VideoSection/TopBrandVdoSec";
import TopIndusVdoSec from "../../Components/HomePage_VideoSection/TopIndusVdoSec";
import TopInvestVdoSec from "../../Components/HomePage_VideoSection/TopInvestVdoSec";
import Navbar from "../../Components/Navbar/NavBar";
import Footer from "../../Components/Footers/Footer";
import LoginRegisterPopUp from "../../Components/PopUpModal/LoginRegisterPopUp";
import PopupModal from "../../Components/PopUpModal/PopUpModal";
import TopBrandVdoCards from "../../Components/HomePage_VideoSection/TopBrandVdoCards";
import TopInvestVdo2 from "../../Components/HomePage_VideoSection/TopInvestVdo2";
import TopInvestVdo3 from "../../Components/HomePage_VideoSection/TopInvestVdo3";
import FranchiseReels from "../../Components/HomePageVideoSecton2/FranchiseVideosecnew2";
import {motion} from "framer-motion";
import FilterDropdowns from "../../Components/Navbar/FilterDropdownsData";


const HomeBannerSec = () => {
    const [industry, setIndustry] = useState("");
    const [sector, setSector] = useState("");
    const [service, setService] = useState("");
    const [open, setOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
      const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // const navigate = useNavigate();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handlePopupClose = () => setIsPopupOpen(false);
   

    useEffect(() => {
      const navEntries = performance.getEntriesByType("navigation");
      const isReload = navEntries[0]?.type === "reload";
      const popupShown = sessionStorage.getItem("popup-shown");
  
      if (!popupShown || isReload) {
        setIsPopupOpen(true);
        sessionStorage.setItem("popup-shown", "true");
      }
    }, []);

 <PopupModal open={isPopupOpen} onClose={handlePopupClose} /> 

  return (
    <>
    {/* <LoginRegisterPopUp/> */}
    <Navbar />
     {/* Welcome Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(223, 138, 10, 0.42) 0%, rgba(255,152,0,0.05) 100%)',
            py: 1,
            px: 1,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // backgroundImage: `url(${backgroundPattern})`,
              // backgroundSize: '300px',
              // opacity: 0.05,
              // zIndex: 0
            }
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography 
                variant={isMobile ? "h4" : "h2"} 
                component="div" 
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  color: 'text.primary',
                  position: 'relative',
                  zIndex: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 1
                }}
              >
                Welcome to <Box component="span" sx={{ 
                  color: "#ff9800", 
                  fontWeight: "bold",
                  background: 'linear-gradient(45deg, #FF9800, #FF5722)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Our Franchise</Box> Network
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Typography 
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  position: 'relative',
                  zIndex: 1,
                  fontWeight: 500,
                  mb: 4
                }}
                component={motion.div}
                // variants={pulse}
                animate="pulse"
              >
                World's most visited franchise platform
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <FilterDropdowns />
            </motion.div>
          </Container>
        </Box>

    {/* top single vido section */}
      <TopBrandVdoSec/> 
      <TopBrandVdoCards/> 
     {/* top double video section */}
{/* <FranchiseReels/> */}

     <TopIndusVdoSec/>

     {/* top triple video section */}
      <TopInvestVdoSec/> 
      <TopInvestVdo2/> 
      <TopInvestVdo3/> 

{/* footer sections */}
      <Footer/> 
     </>
    
  )
}

export default HomeBannerSec