import React from "react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  useTheme,
  styled,
  Paper,
  useMediaQuery
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  Email as ReachUsIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footers/Footer";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../Redux/Slices/loadingSlice";

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Color palette
  const colors = {
    pistaGreen: '#93C572',
    darkGreen: '#4A7729',
    creamWhite: '#FFF9F0',
    darkText: '#2D3436'
  };

  // Fixed width sidebar
  const GlassSidebar = styled(Paper)(({ theme }) => ({
    width: isMobile ? '64px' : '240px', // Fixed widths
    flexShrink: 0, // Prevent growing
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)`,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    borderRight: '1px solid rgba(255, 255, 255, 0.3)',
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    position: "sticky",
    top: 0,
    borderRadius: 0,
    borderTopRightRadius: '24px',
    borderBottomRightRadius: '24px',
    overflow: 'hidden',
    marginTop: '1rem',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }));

  // Nav items with fixed dimensions
  const NavItem = styled(ListItem)(({ theme }) => ({
    minHeight: '48px',
    borderRadius: '12px',
    margin: '4px 8px',
    padding: isMobile ? '12px 0' : '12px 16px',
    justifyContent: isMobile ? 'center' : 'flex-start',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: colors.pistaGreen + '20',
      '& .MuiListItemIcon-root': {
        color: colors.darkGreen,
      },
      '& .MuiListItemText-primary': {
        color: colors.darkGreen,
        fontWeight: 600
      }
    },
    '&.active': {
      backgroundColor: colors.pistaGreen + '30',
      // borderLeft: `4px solid ${colors.pistaGreen}`,
      '& .MuiListItemIcon-root': {
        color: colors.darkGreen,
      },
      '& .MuiListItemText-primary': {
        color: colors.darkGreen,
        fontWeight: 600
      }
    }
  }));

  return (
    <>
      <Box sx={{ 
        mt: 8,
        display: "flex", 
        minHeight: "calc(100vh - 64px)",
        backgroundColor: colors.creamWhite
      }}>
        {/* Sidebar with fixed width */}
        <GlassSidebar elevation={3}>
          <Box sx={{ p: isMobile ? 1 : 2, flexGrow: 1 }}>
            <List sx={{ padding: 0 }}>
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard"
                className={location.pathname === '/investordashboard' ? 'active' : ''}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0,
                  color: colors.darkText,
                  justifyContent: 'center',
                  mr: isMobile ? 0 : 2
                }}>
                  <DashboardIcon />
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText 
                    primary="Dashboard" 
                    primaryTypographyProps={{ 
                      color: colors.darkText,
                      noWrap: true // Prevent text wrapping
                    }}
                  />
                )}
              </NavItem>
              
              <NavItem 
                button 
                onClick={() => {
                  dispatch(showLoading());
                  navigate("/investordashboard/manageProfile");
                  setTimeout(() => {
                    dispatch(hideLoading());
                  }, 5000);
                }}
                className={location.pathname === '/investordashboard/manageProfile' ? 'active' : ''}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0,
                  color: colors.darkText,
                  justifyContent: 'center',
                  mr: isMobile ? 0 : 2
                }}>
                  <ProfileIcon />
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText 
                    primary="Profile" 
                    primaryTypographyProps={{ 
                      color: colors.darkText,
                      noWrap: true
                    }}
                  />
                )}
              </NavItem>
              
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/respondemanager"
                className={location.pathname === '/investordashboard/respondemanager' ? 'active' : ''}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0,
                  color: colors.darkText,
                  justifyContent: 'center',
                  mr: isMobile ? 0 : 2
                }}>
                  <ReachUsIcon />
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText 
                    primary="Reach Us" 
                    primaryTypographyProps={{ 
                      color: colors.darkText,
                      noWrap: true
                    }}
                  />
                )}
              </NavItem>
              
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/settings"
                className={location.pathname === '/investordashboard/settings' ? 'active' : ''}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0,
                  color: colors.darkText,
                  justifyContent: 'center',
                  mr: isMobile ? 0 : 2
                }}>
                  <SettingsIcon />
                </ListItemIcon>
                {!isMobile && (
                  <ListItemText 
                    primary="Settings" 
                    primaryTypographyProps={{ 
                      color: colors.darkText,
                      noWrap: true
                    }}
                  />
                )}
              </NavItem>
            </List>
          </Box>
        </GlassSidebar>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: "auto",
          p: isMobile ? 2 : 4,
          background: `linear-gradient(to bottom right, ${colors.creamWhite}, #ffffff)`
        }}>
          <Box sx={{ 
            maxWidth: 1400,
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            p: isMobile ? 2 : 4,
            minHeight: 'calc(100vh - 128px)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default InvestorDashboard;