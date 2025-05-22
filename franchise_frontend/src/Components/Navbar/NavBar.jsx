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
        display: { xs: "none", sm: "flex" },
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1, md: 2 } }}>
          {["Expand Your Franchise", "Investor", "Advertise", "Sell Your Business"].map((text) => (
            <Button 
              key={text} 
              size="small" 
              sx={{ 
                textTransform: 'none',
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                display: {
                  xs: text === "Advertise" ? 'none' : 'inline-flex',
                  md: 'inline-flex'
                }
              }}
            >
              {text.startsWith("Expand") ? "Expand Franchise" : text}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ display: { xs: "none", md: "block" }, mr: 1 }}>💬</Typography>
          <FormControl variant="standard" size="small">
            <Select 
              value="en" 
              disableUnderline
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              <MenuItem value="en" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                EN{false ? " - English" : ""}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Main Navigation Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          px: { xs: 1, sm: 2, md: 4 },
          minHeight: { xs: '56px !important', sm: '64px !important' }
        }}>
          <IconButton edge="start" onClick={() => dispatch(toggleSidebar(true))}>
            <MenuIcon fontSize="small" />
          </IconButton>
          
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            cursor: 'pointer',
            fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
            '&:hover': { color: 'primary.main' }
          }} onClick={() => navigate("/")}>
            MR FRANCHISE
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link to="/brandsearchview" sx={{ 
              display: { xs: "none", sm: "block" },
              textDecoration: 'none', 
              color: 'inherit',
              fontSize: { sm: "0.9rem", md: "1rem" },
              '&:hover': { color: 'primary.main' }
            }}>
              Find your Franchise
            </Link>
            
            <Button 
              variant="outlined" 
              sx={{ 
                textTransform: 'none',
                display: { xs: "none", sm: "inline-flex" },
                fontSize: { sm: "0.8rem", md: "0.875rem" },
                px: { sm: 1, md: 2 }
              }}
              onClick={() => navigate("/brandlistingform")}
            >
              ADD LISTING
            </Button>

            <Box ref={avatarRef} sx={{ position: 'relative' }}>
              <IconButton onClick={() => dispatch(toggleMenu())} sx={{ p: 0 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  width: { xs: 28, sm: 32 }, 
                  height: { xs: 28, sm: 32 },
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
                    minWidth: { xs: 140, sm: 160 },
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
                          px: { xs: 2, sm: 3 },
                          py: 1,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => setLoginModalOpen(true)}
                      >
                        Sign In
                      </Button>
                      <Button
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          px: { xs: 2, sm: 3 },
                          py: 1,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => navigate("/registerhandleuser")}
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
                          px: { xs: 2, sm: 3 },
                          py: 1,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => navigate("/profile")}
                      >
                        My Profile
                      </Button>
                      <Button
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          px: { xs: 2, sm: 3 },
                          py: 1,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => dispatch(logout())}
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

      {/* Responsive Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarView}
        onClose={() => dispatch(toggleSidebar(false))}
        PaperProps={{
          sx: {
            width: { xs: "80%", sm: "320px", md: "360px" }
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
    </>
  );
}

export default Navbar;