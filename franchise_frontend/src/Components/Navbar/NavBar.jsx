import React, { useEffect, useRef } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { User } from "lucide-react";
import SideViewContent from "../SideViewContentMenu/SideHoverMenu";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { useSelector, useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  toggleSidebar,
  toggleMenu,
} from "../../Redux/Slices/navbarSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, sidebarView, menuOpen } = useSelector((state) => state.navbar);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);

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
  };

  const handleLoginSuccess = (userData) => {
    dispatch(loginSuccess(userData));
    setLoginModalOpen(false);
  };

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(toggleMenu(false));
    navigate("/");
  };

  return (
    <>
      {/* Top Bar */}
      <Box sx={{ 
        background: "#eee", 
        p: 1, 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Box>
          {["Expand Your Franchise", "Investor", "Advertise", "Sell Your Business"].map((text) => (
            <Button key={text} size="small" sx={{ textTransform: 'none' }}>{text}</Button>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ mr: 1 }}>💬</Typography>
          <FormControl variant="standard" size="small">
            <Select value="en" disableUnderline>
              <MenuItem value="en">EN - English</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Main Navigation Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          px: { xs: 1, sm: 2 },
          minHeight: '64px !important'
        }}>
          <IconButton edge="start" onClick={() => dispatch(toggleSidebar(true))}>
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' }
          }} onClick={() => navigate("/")}>
            MR FRANCHISE
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link to="/brandsearchview" style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              '&:hover': { color: 'primary.main' }
            }}>
              Find your Franchise
            </Link>
            
            <Button 
              variant="outlined" 
              sx={{ textTransform: 'none' }}
              onClick={() => handleNavigate("/brandlistingform")}
            >
              ADD LISTING
            </Button>

            <Box ref={avatarRef} sx={{ position: 'relative' }}>
              <IconButton onClick={() => dispatch(toggleMenu())} sx={{ p: 0 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  width: 32, 
                  height: 32,
                  '&:hover': { bgcolor: 'primary.dark' }
                }}>
                  <User size={18} />
                </Avatar>
              </IconButton>

              {menuOpen && (
                <Box
                  ref={menuRef}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: 1,
                    minWidth: 160,
                    py: 1,
                    zIndex: 9999
                  }}
                >
                  {!isLoggedIn ? (
                    <>
                      <Button 
                        fullWidth
                        sx={{ 
                          justifyContent: 'flex-start',
                          px: 3,
                          py: 1,
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => {
                          setLoginModalOpen(true);
                          dispatch(toggleMenu(false));
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          px: 3,
                          py: 1,
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => handleNavigate("/registerhandleuser")}
                      >
                        Register
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          px: 3,
                          py: 1,
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => handleNavigate("/profile")}
                      >
                        My Profile
                      </Button>
                      <Button
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          px: 3,
                          py: 1,
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={sidebarView}
        onClose={() => dispatch(toggleSidebar(false))}
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
    </>
  );
}

export default Navbar;