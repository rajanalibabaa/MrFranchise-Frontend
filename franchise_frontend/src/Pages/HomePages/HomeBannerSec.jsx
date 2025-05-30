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

    <Box
      sx={{
      
        minHeight: 150,
        maxWidth:1800,
        justifyContent:"center",
        backgroundImage: `url(${"bgimg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        textAlign: "center",
        color: "white",
        px: 4,
        py: 5,
        mx:"auto",
        position: "relative",
      }}
    
    >
      {/* <Box
      sx={{display:"flex",
        
        justifyContent: "space-between",
        alignItems: "left",
        backgroundColor: "#ffff",
        padding: 2,
        borderRadius: 1,
        boxShadow: 1,
      }}>
        
        <img style={{width:300,}} src={logo} alt="logo" />
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography variant="h4" sx={{ mb: 1, color: "black" }}>
         Welcome to <Box component="span" sx={{ color: "yellow", fontWeight: "bold" }}>Our Franchise</Box> Website
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "black" }}>
          World's highest visited franchise website network
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel sx={{ color: "black" }}>Industry</InputLabel>
            <Select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              label="Industry"
              sx={{ color: "white", borderColor: "white" }}
            >
              <MenuItem value="">Select Industry</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220, }}>
            <InputLabel sx={{ color: "black" }}>Sector</InputLabel>
            <Select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              label="Sector"
              sx={{ color: "white" }}
            >
              <MenuItem value="">Select Sector</MenuItem>
              <MenuItem value="Health">Health</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel sx={{ color: "black" }}>Service/Product</InputLabel>
            <Select
              value={service}
              onChange={(e) => setService(e.target.value)}
              label="Service/Product"
              sx={{ color: "white" }}
            >
              <MenuItem value="">Select Service/Product</MenuItem>
              <MenuItem value="Consulting">Consulting</MenuItem>
              <MenuItem value="Software">Software</MenuItem>
            </Select>
          </FormControl>
          {/* Search Button *
  <Button
    variant="contained"
    sx={{
      bgcolor: "#f29724",
      color: "#000",
      px: 4,
      height: "45px",
      mt: 1,
      textTransform: "none",
    }}
    onClick={() => {
      // Add your search logic here
      console.log({ industry, sector, service });
    }}
  >
    Search
  </Button>
        </Box>
      </Box>
      </Box>

       */}

      <Box
        className="ask-experts"
        sx={{
          position: "fixed",
          top: "60%",
          left: "94%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
      >
        <Tooltip title="Ask Our Experts" arrow placement="left">
          <Button onClick={handleOpen} sx={{ borderRadius: "50%", p: 0 }}>
            <img
              src={"bgimg"}
              loading="lazy"
              alt="bot"
              style={{ width: 70, height: 80, borderRadius: "50%" }}
            />
          </Button>
        </Tooltip>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Why Should We Ask?
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic,
            quibusdam. Inventore quam, commodi quo perspiciatis ut voluptatem
            corporis, laudantium ullam eaque voluptates aliquid totam temporibus
            iste molestiae deserunt quod ipsam.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
     
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