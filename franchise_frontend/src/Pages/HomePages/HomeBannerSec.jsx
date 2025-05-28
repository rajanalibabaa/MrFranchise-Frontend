import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Modal,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Navbar from '../../Components/Navbar/NavBar';
import Footer from '../../Components/Footers/Footer';
import TopBrandVdoSec from '../../Components/HomePage_VideoSection/TopBrandVdoSec';
import FranchiseReels from '../../Components/HomePageVideoSecton2/FranchiseVideosecnew2';
import TopIndusVdoSec from '../../Components/HomePage_VideoSection/TopIndusVdoSec';
import TopInvestVdoSec from '../../Components/HomePage_VideoSection/TopInvestVdoSec';
import TopInvestVdo2 from '../../Components/HomePage_VideoSection/TopInvestVdo2';
import logo from '../../assets/Images/brandLogo.jpg';
import TopInvestVdo3 from '../../Components/HomePage_VideoSection/TopInvestVdo3';
import { SearchIcon } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const HomePage = () => {
  const [industry, setIndustry] = useState('');
  const [sector, setSector] = useState('');
  const [service, setService] = useState('');
  const [open, setOpen] = useState(false);

  const [celebrate, setCelebrate] = useState(false);
  const { width, height } = useWindowSize();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Replace these with your actual image paths
  const expertImage = 'https://cdn-icons-png.flaticon.com/512/1865/1865273.png';

//  const celebrationIcons = Array.from({ length: 20 }, (_, i) => ({
//   id: i,
//   emoji: ["🎈🏹", "🎉", "✨", "🌟", "🎊", "💥", "🎆🧨"][i % 7],
//   top: `${Math.floor(Math.random() * 80)}%`,
//   left: `${Math.floor(Math.random() * 90)}%`,
//   delay: Math.random() * 3,
//   size: `${1.5 + Math.random() * 1.5}rem`, // 1.5rem to 3rem
//   rotate: Math.random() > 0.5,
//   zIndex: Math.floor(Math.random() * 10), // For depth effect
// }));


   // Trigger celebration on component mount
  useEffect(() => {
    setCelebrate(true);
    const timer = setTimeout(() => setCelebrate(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  


  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      backgroundColor: '#f5f5f5',
      overflow: "hidden"
    }}>

      <Navbar />
      {celebrate && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          // alignItems: "center",
          color: "white",
          overflow: "hidden",
          // px: 4,
          // py: 10,
          // textAlign: "center"
        }}
      >
        <Container maxWidth="lg"
        sx={{ 
          px: isMobile ? 2 : 4, 
          py: isMobile ? 4 : 8,
          position: 'relative',
          zIndex: 1
        }}
        >
          <Box
            sx={{
              // backgroundColor: "rgba(62, 52, 52, 0.92)",
              padding: isMobile ? 3 : 1,
              borderRadius: 2,
              // boxShadow: 6,
              // backdropFilter: "blur(8px)",
              transition: 'all 0.3s ease',
            }}
          >       
            
          </Box>
        </Container>
      </Box>

       {/* Floating Expert Button */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 40,
            right: 40,
            zIndex: 1000,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' }
            }
          }}
        >
          <Tooltip title="Ask Our Franchise Experts" arrow placement="left">
            <Button 
              onClick={handleOpen} 
              sx={{ 
                borderRadius: "50%", 
                p: 0,
                boxShadow: 3,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              <img
                src={expertImage}
                loading="lazy"
                alt="expert help"
                style={{ width: 70, height: 70 }}
              />
            </Button>
          </Tooltip>
        </Box>
      )}

      {/* Expert Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="expert-modal-title"
        aria-describedby="expert-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: '90%', sm: 500 },
            maxWidth: '95vw',
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: isMobile ? 2 : 4,
            outline: 'none'
          }}
        >
          <Typography id="expert-modal-title" variant={isMobile ? "h6" : "h5"} component="h2" sx={{ mb: 2, fontWeight: 600 }}>
            Connect With Our Franchise Experts
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our team of franchise consultants is here to help you navigate the world of franchising. 
            Whether you're looking to buy a franchise or expand your existing business, we can provide:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 3 }}>
            <li><Typography variant="body1">Personalized franchise recommendations</Typography></li>
            <li><Typography variant="body1">Financial planning assistance</Typography></li>
            <li><Typography variant="body1">Market analysis and location selection</Typography></li>
            <li><Typography variant="body1">Legal and regulatory guidance</Typography></li>
          </Box>
          <Button 
            variant="contained" 
            fullWidth 
            size={isMobile ? "medium" : "large"}
            sx={{ mt: 2 }}
            onClick={() => {
              handleClose();
              // Add contact functionality here
            }}
          >
            Schedule a Free Consultation
          </Button>
        </Box>
      </Modal>

{/* Main Content Sections */}
      <Box component="main" sx={{ flex: 1, overflow: "auto" ,background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)'  }}>
        <Container maxWidth="xl" sx={{ 
          py: isMobile ? 4 : 6,
          px: isMobile ? 2 : 4
        }}>
          {/* Top Brands Section */}
          <Box sx={{ mb: isMobile ? 6 : 8,}}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontWeight: 700, 
                mb: isMobile ? 3 : 4,
                textAlign: 'center',
                color: '#ff9800',
                position: 'relative',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#ff9800',
                  margin: `${isMobile ? '8px' : '12px'} auto 0`,
                  borderRadius: '2px'
                }
              }}
            >
              Featured Franchise Brands
            </Typography>
            <TopBrandVdoSec />
          </Box>

          {/* Franchise Reels Section */}
          <Box sx={{ mb: isMobile ? 6 : 8}}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontWeight: 700, 
                mb: isMobile ? 3 : 4,
                textAlign: 'center',
                color: '#ff9800',
                position: 'relative',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#ff9800',
                  margin: `${isMobile ? '8px' : '12px'} auto 0`,
                  borderRadius: '2px'
                }
              }}
            >
              Franchise Success Stories
            </Typography>
            <FranchiseReels />
          </Box>
           {/* Industry Videos Section */}
          <Box sx={{ mb: isMobile ? 6 : 8 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontWeight: 700, 
                mb: isMobile ? 3 : 4,
                textAlign: 'center',
                color: '#ff9800',
                position: 'relative',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#ff9800',
                  margin: `${isMobile ? '8px' : '12px'} auto 0`,
                  borderRadius: '2px'
                }
              }}
            >
              Industry Spotlight
            </Typography>
            <TopIndusVdoSec />
          </Box>

          {/* Investment Videos Sections */}
          <Box sx={{ mb: isMobile ? 6 : 8 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              sx={{ 
                fontWeight: 700, 
                mb: isMobile ? 3 : 4,
                textAlign: 'center',
                color: '#ff9800',
                position: 'relative',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '80px',
                  height: '4px',
                  backgroundColor: '#ff9800',
                  margin: `${isMobile ? '8px' : '12px'} auto 0`,
                  borderRadius: '2px'
                }
              }}
            >
              Investment Opportunities
            </Typography>
            <TopInvestVdoSec />
            <TopInvestVdo2 />
            <TopInvestVdo3/>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>


    //   {/* Video Sections */}
    //   <Container maxWidth="xl" sx={{ py: 6 }}>
    //     <TopBrandVdoSec />
        
    //     <Typography 
    //       variant="h4" 
    //       sx={{ 
    //         fontWeight: 600, 
    //         my: 6,
    //         textAlign: 'center',
    //         color: 'primary.main'
    //       }}
    //     >
    //       Leading Franchise Reels & Promotion Videos
    //     </Typography>
        
    //     <FranchiseReels />
    //     <TopIndusVdoSec />
    //     <TopInvestVdoSec />
    //     <TopInvestVdo2 />
    //   </Container>

    //   <Footer />
    // </Box>
  );
};

export default HomePage;