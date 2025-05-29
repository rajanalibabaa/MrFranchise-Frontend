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
  Container
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { User, MessageSquare, Globe, LogOut, LogIn, UserPlus, Home } from "lucide-react";
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
import { motion } from "framer-motion";
import logo from "../../assets/Images/logo.png"
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

  const [logoutLoading, setlogoutLoading] = useState(false);

  // Fallback for ID if Redux state is empty (e.g., after refresh)
  const ID =
    localStorage.getItem("brandUUID") ||
    localStorage.getItem("investorUUID");

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

  return (
    <>
      {/* Top Bar - Secondary Navigation */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)",
          backdropFilter: "blur(8px)",
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 0.5 : 1 }}>
          <Button
            component={Link}
            to="/expandyourbrand"
            size="small"
            sx={{ 
              textTransform: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                color: '#ff9800',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Expand Your Franchise
          </Button>
          <Button
            component={Link}
            to="/expand-franchise"
            size="small"
            sx={{ 
              textTransform: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                color: '#ff9800',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Investor
          </Button>
          <Button
            component={Link}
            to="/advertisewithus"
            size="small"
            sx={{ 
              textTransform: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                color: '#ff9800',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Advertise
          </Button>
          <Button
            component={Link}
            to="/expand-franchise"
            size="small"
            sx={{ 
              textTransform: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                color: '#ff9800',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Sell Your Business
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <IconButton size="small"  sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <Badge badgeContent={3} color="error">
              <MessageSquare size={18} />
            </Badge>
          </IconButton>
          <FormControl variant="standard" size="small" sx={{ minWidth: 100 }}>
            <Select
              value="en"
              disableUnderline
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                '& .MuiSelect-icon': {
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
              <MenuItem value="en" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Globe size={14} color="rgba(255, 255, 255, 0.9)" /> 
                  <span>EN - English</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Main Navigation Bar */}
      <AppBar 
        position="sticky" 
        color="transparent" 
        elevation={0}
        sx={{
          backdropFilter: "blur(8px)",
          background: "linear-gradient(to right, #ffffff, #f5f5f5)",
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          position: 'relative',
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
            px: { xs: 1, sm: 2 },
            minHeight: "64px !important",
          }}
        >
          <IconButton 
            edge="start" 
            onClick={() => dispatch(toggleSidebar(true))}
            sx={{ color: '#ff9800' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              mr: 2
            }}
          >
            <img 
              src={logo} 
              alt="brand logo" 
              style={{ 
                width: 170, 
                height: 50,
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }} 
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box ref={avatarRef} sx={{ position: "relative" }}>
            <IconButton 
              onClick={handleMenuOpen}
              sx={{ 
                p: 0,
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.3s ease'
                }
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
                        backgroundColor: 'rgba(255, 152, 0, 0.1)'
                      }
                    }}
                  >
                    <LogIn size={18} style={{ marginRight: 12 }} />
                    Sign In
                  </MenuItem>,
                  <MenuItem 
                    key="register" 
                    onClick={() => handleNavigate("/registerhandleuser")}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)'
                      }
                    }}
                  >
                    <UserPlus size={18} style={{ marginRight: 12 }} />
                    Register
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem 
                    key="profile" 
                    onClick={handleMyProfileNavigate}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)'
                      }
                    }}
                  >
                    <User size={18} style={{ marginRight: 12 }} />
                    My Profile
                  </MenuItem>,
                  <MenuItem 
                    key="home" 
                    onClick={() => handleNavigate("/")}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)'
                      }
                    }}
                  >
                    <Home size={18} style={{ marginRight: 12 }} />
                    Home
                  </MenuItem>,
                  <MenuItem 
                    key="logout" 
                    onClick={handleSignOut}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)'
                      }
                    }}
                  >
                    <LogOut size={18} style={{ marginRight: 12 }} />
                    Sign Out
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>

        {/* Welcome Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,152,0,0.05) 100%)',
            py: 3,
            px: 2,
            borderTop: '1px solid rgba(255,152,0,0.1)',
            borderBottom: '1px solid rgba(255,152,0,0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,152,0,0.05) 0%, transparent 20%)',
              zIndex: 0
            }
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h5" 
              component="div" 
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                color: 'text.primary',
                position: 'relative',
                zIndex: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Welcome to <Box component="span" sx={{ color: "#ff9800", fontWeight: "bold" }}>Our Franchise</Box> Website
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mt: 1,
                position: 'relative',
                zIndex: 1,
                fontWeight: 500
              }}
            >
              World's highest visited franchise website network
            </Typography>
          </Container>
        </Box>

        {/* Filter Dropdowns */}
        <Box sx={{ background: 'rgba(255, 255, 255, 0.8)' }}>
          <Container maxWidth="lg">
            <FilterDropdowns />
          </Container>
        </Box>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarView}
        onClose={() => dispatch(toggleSidebar(false))}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(25, 25, 25, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            width: isMobile ? '80%' : '300px'
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
              </Box>
            </Box>
          </motion.div>
        </Box>
      )}
    </>
  );
}

export default Navbar;