import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Avatar,
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  useMediaQuery,
  useTheme,
  Menu,
  Badge,
  Container,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { User, MessageSquare, Globe, LogOut, LogIn, UserPlus, Home, Plus, Search } from "lucide-react";
import SideViewContent from "../SideViewContentMenu/SideHoverMenu";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { useSelector, useDispatch } from "react-redux";
import {
  loginSuccess,
  toggleSidebar,
  toggleMenu,
} from "../../Redux/Slices/navbarSlice";
import { logout } from "../../Redux/Slices/AuthSlice/authSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/Images/logo.png";
// import backgroundPattern from "../../assets/Images/network-pattern.png";
import FilterDropdowns from "./FilterDropdownsData";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { sidebarView, menuOpen } = useSelector((state) => state.navbar);
  const { isLogin } = useSelector((state) => state.auth);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [popupLogout, setPopupLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [logoutLoading, setlogoutLoading] = useState(false);

  // Fallback for ID if Redux state is empty (e.g., after refresh)
  const ID =
    localStorage.getItem("brandUUID") ||
    localStorage.getItem("investorUUID");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        dispatch(toggleMenu(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, dispatch]);

  const handleNavigate = (path) => {
    navigate(path);
    dispatch(toggleMenu(false));
    setAnchorEl(null);
  };

  const handleLoginSuccess = (userData) => {
    dispatch(loginSuccess(userData));
    setLoginModalOpen(false);
  };

  const handleSignOut = () => {
    dispatch(toggleMenu(false));
    setPopupLogout(true);
  };

  const handleVerifySignOut = async () => {
    setlogoutLoading(true)
    try {
      const response = await axios.post(
        // `https://franchise-backend-wgp6.onrender.com/api/v1/logout/${ID}`,
        // `http://localhost:5000/api/v1/logout/${ID}`,
        `https://franchise-backend-wgp6.onrender.com/api/v1/logout/${ID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("===logout===")

      if (response.status === 200) {
        setTimeout(() => {
          dispatch(logout());
          setPopupLogout(false);
          navigate("/");
          setlogoutLoading(false)
        }, 2000);
      }
    } catch (error) {
      console.error("Logout error:", error.message || error);
    }
  };

  const handleMyProfileNavigate = () => {
    if(localStorage.getItem("investorUUID")){
      navigate("/investordashboard")
    }else if(localStorage.getItem("brandUUID")){
      navigate("/brandDashboard")
    }else{
      navigate("/")
    }
    dispatch(toggleMenu(false));
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(toggleMenu(true));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    dispatch(toggleMenu(false));
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const pulse = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <>
      {/* Top Bar - Secondary Navigation */}
      {/* <Box
        sx={{
          background: "linear-gradient(135deg, rgba(242, 168, 50, 0.9) 0%, rgba(185, 230, 21, 0.9) 100%)",
          backdropFilter: "blur(8px)",
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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
            // opacity: 0.1,
            // zIndex: 0
          }
        }}
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        
        

      {/* Main Navigation Bar */}
      <AppBar 
        position="sticky" 
        color="transparent" 
        elevation={0}
        sx={{
          backdropFilter: scrolled ? "blur(12px)" : "blur(8px)",
          background: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.9)",
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ff9800, #ff5722, #ff9800)',
            backgroundSize: '200% 100%',
            animation: 'gradient 3s ease infinite',
          },
          '@keyframes gradient': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          }
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: isMobile ? "space-evenly" : "space-between",
            alignItems: "center",
            px: { xs: 1, sm: 2 },
            minHeight: "64px !important",
            gap: isMobile ? 1 : 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <IconButton 
                edge="start" 
                onClick={() => dispatch(toggleSidebar(true))}
                sx={{ color: '#ff9800' }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Box 
                component={Link} 
                to="/" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                }}
              >
                <img 
                  src={logo} 
                  alt="brand logo" 
                  style={{ 
                    width: isMobile ? 120 : 170, 
                    height: isMobile ? 50 : 70,
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                  }} 
                />
              </Box>
            </motion.div>
            
          </Box>
<Box sx={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: isMobile ? 0.5 : 1,
          position: 'relative',
          zIndex: 1
        }}>
          {['Expand Your Franchise', 'Investor', 'Advertise','Franchise promotion & Lead Distribution Packages', 'Other than Food Industries'].map((text, index) => (
            <motion.div
              key={text}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                component={Link}
                to={
                  text === 'Expand Your Franchise' ? '/expandyourbrand' :
                  text === 'Investor' ? '/investfranchise' :
                  text === 'Advertise' ? '/advertisewithus' :
                  text === 'Franchise promotion & Lead Distribution Packages' ? '/franchisepromotion' :
                  text === 'Other than Food Industries' ? '/otherindustries' : ''
                }
                size="small"
                sx={{ 
                  textTransform: 'none',
                  color: '#ff9800',
                  '&:hover': {
                    color: 'black',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {text}
              </Button>
            </motion.div>
          ))}
        </Box>

            
          <Box sx={{ flexGrow: isMobile ? 1 : 1 }} />

<Box  sx={{ 
              display: 'flex', 
              gap: 5,
              flex: isTablet ? 1 : 'none',
              justifyContent: isTablet ? 'center' : 'flex-end'
            }}>
              <motion.div whileHover={{ y: -2 }}>
                <Button 
                onClick={() => navigate('/brandlistingform')}
                  startIcon={<Plus size={20} />}
                  
                  sx={{
                    color: 'black',  
                    backgroundColor: '#7ad03a',
                    borderRadius: '8px',
                    px: 5,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(111, 255, 0, 0.98)'
                    }
                  }}
                >
                  Add Your Brand
                </Button>
              </motion.div>
              
              {/* <motion.div whileHover={{ y: -2 }}>
                <Button 
                  startIcon={<Search size={18} />}
                  onClick={() => navigate('/brandviewpage')}
                  sx={{ 
                    color: '#ff9800',  
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    borderRadius: '8px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 152, 0, 0.2)'
                    }
                  }}
                >
                  Find Your Brand To Franchise
                </Button>
              </motion.div> */}
            </Box>

          <Box ref={avatarRef} sx={{ position: "relative" }}>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ 
                  p: 0,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 152, 0, 0.8)",
                    width: 36,
                    height: 36,
                    '&:hover': { 
                      bgcolor: "rgba(255, 152, 0, 1)",
                      boxShadow: '0 0 10px rgba(255, 152, 0, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <User size={20} color="white" />
                </Avatar>
              </IconButton>
            </motion.div>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    transition: 'all 0.2s ease',
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {!isLogin ? (
                [
                  <MenuItem 
                    key="signin" 
                    onClick={() => {
                      setLoginModalOpen(true);
                      handleMenuClose();
                    }}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LogIn size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">Sign In</Typography>
                    </Box>
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem 
                    key="register" 
                    onClick={() => handleNavigate("/registerhandleuser")}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UserPlus size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">Register</Typography>
                    </Box>
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem 
                    key="profile" 
                    onClick={handleMyProfileNavigate}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <User size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">My Profile</Typography>
                    </Box>
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem 
                    key="home" 
                    onClick={() => handleNavigate("/")}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Home size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">Home</Typography>
                    </Box>
                  </MenuItem>,
                  <Divider key="divider2" />,
                  <MenuItem 
                    key="logout" 
                    onClick={handleSignOut}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)',
                        color: 'error.main'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LogOut size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">Sign Out</Typography>
                    </Box>
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>

          <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: isMobile ? 2 : 1,
          position: 'relative',
          zIndex: 1
        }}>
          <motion.div whileHover={{ scale: 1.1 }}>
            <IconButton size="small" sx={{ color: 'rgba(253, 182, 16, 0.9)' }}>
              <Badge badgeContent={3} color="error">
                <MessageSquare size={18} />
              </Badge>
            </IconButton>
          </motion.div>
          
          <FormControl variant="standard" size="small" sx={{ minWidth: isMobile ? 80 : 10 }}>
            <Select
              value="en"
              disableUnderline
              sx={{
                color: '#ff9800',
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  right: 8,
                  top: 'calc(50% - 8px)'
                },
                '&:before': {
                  borderBottom: 'none'
                },
                '&:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none'
                }
              }}
            >
              <MenuItem value="en" sx={{ color: '#ff9800' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Globe size={18} color="rgba(5, 5, 5, 0.9)" /> 
                  <span>EN</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        </Toolbar>

       
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarView}
        onClose={() => dispatch(toggleSidebar(false))}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(25, 25, 25, 0.97)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            width: isMobile ? '85%' : '300px',
            borderRight: '1px solid rgba(255, 152, 0, 0.2)'
          }
        }}
      >
        <SideViewContent
          hoverCategory="open"
          onHoverLeave={() => dispatch(toggleSidebar(false))}
        />
      </Drawer>

      {/* Login Modal */}
      <LoginPage
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {popupLogout && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: 'blur(5px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Box
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 3,
                  p: 3,
                  borderRadius: 2,
                  width: 300,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Confirm Logout
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Are you sure you want to sign out?
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setPopupLogout(false)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 50,
                        px: 3
                      }}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleVerifySignOut}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 50,
                        px: 3,
                        background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                        boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)'
                      }}
                    >
                      {logoutLoading ? "Signing out..." : "Sign Out"}
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;