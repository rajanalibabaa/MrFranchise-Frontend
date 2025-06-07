import React from "react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Avatar,
  Typography,
  useTheme,
  styled,
  Paper
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  Email as ReachUsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footers/Footer";
import Navbar from "../../Components/Navbar/NavBar";


const InvestorDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();

  // Color palette
  const colors = {
    pistaGreen: '#93C572',
    lightOrange: '#FFB347',
    darkGreen: '#4A7729',
    creamWhite: '#FFF9F0',
    darkText: '#2D3436'
  };

  // Styled sidebar with improved glass morphism
  const GlassSidebar = styled(Paper)(({ theme }) => ({
    width: 280,
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)`,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    borderRight: '1px solid rgba(255, 255, 255, 0.3)',
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
    transition: "all 0.3s ease",
    borderRadius: 0,
    borderTopRightRadius: '24px',
    borderBottomRightRadius: '24px',
    overflow: 'hidden',
    "&:hover": {
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
    },
    [theme.breakpoints.down('md')]: {
      width: 240,
    }
  }));

  // Styled nav items with hover effects
  const NavItem = styled(ListItem)(({ theme }) => ({
    borderRadius: '12px',
    margin: '4px 16px',
    padding: '12px 16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: colors.pistaGreen + '20',
      transform: 'translateX(5px)',
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
      borderLeft: `4px solid ${colors.pistaGreen}`,
      '& .MuiListItemIcon-root': {
        color: colors.darkGreen,
      },
      '& .MuiListItemText-primary': {
        color: colors.darkGreen,
        fontWeight: 600
      }
    }
  }));

  // User profile section
  // const UserProfileSection = () => (
  //   <Box sx={{ 
  //     p: 1, 
  //     textAlign: 'center',
  //     borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  //     background: `linear-gradient(135deg, ${colors.pistaGreen}20 0%, ${colors.lightOrange}10 100%)`
  //   }}>
  //     <Avatar 
  //       sx={{ 
  //         width: 80, 
  //         height: 80, 
  //         margin: '0 auto 16px',
  //         border: `3px solid ${colors.pistaGreen}`,
  //         boxShadow: `0 4px 12px ${colors.pistaGreen}40`
  //       }}
  //       src="/path-to-user-avatar.jpg"
  //     />
  //     <Typography variant="h6" sx={{ fontWeight: 600, color: colors.darkText }}>
  //       Investor Name
  //     </Typography>
  //     <Typography variant="body2" sx={{ color: colors.pistaGreen, fontWeight: 500 }}>
  //       Premium Member
  //     </Typography>
  //   </Box>
  // );

  return (
    <>
      <Navbar />
      <Box sx={{ 
        mt: 2,
        display: "flex", 
        minHeight: "calc(100vh - 64px)",
        backgroundColor: colors.creamWhite
      }}>
        {/* Sidebar */}
        <GlassSidebar elevation={3}>
          {/* <UserProfileSection /> */}

          {/* Navigation */}
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <List>
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard"
                className={location.pathname === '/investordashboard' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40, color: colors.darkText }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  primaryTypographyProps={{ color: colors.darkText }}
                />
              </NavItem>
              
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/manageProfile"
                className={location.pathname === '/investordashboard/manageProfile' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40, color: colors.darkText }}>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Manage Profile" 
                  primaryTypographyProps={{ color: colors.darkText }}
                />
              </NavItem>
              
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/respondemanager"
                className={location.pathname === '/investordashboard/reachus' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40, color: colors.darkText }}>
                  <ReachUsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Reach Us" 
                  primaryTypographyProps={{ color: colors.darkText }}
                />
              </NavItem>

              {/* <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/notifications"
                className={location.pathname === '/investordashboard/notifications' ? 'active' : ' update soon'}
              >
                <ListItemIcon sx={{ minWidth: 40, color: colors.darkText }}>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Notifications" 
                  primaryTypographyProps={{ color: colors.darkText }}
                />
              </NavItem>

              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/reports"
                className={location.pathname === '/investordashboard/reports' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40, color: colors.darkText }}>
                  <ReportsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Reports" 
                  primaryTypographyProps={{ color: colors.darkText }}
                />
              </NavItem> */}
            </List>
          </Box>

          {/* Bottom Section */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <List>
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/settings"
                className={location.pathname === '/investordashboard/settings' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40, color: colors.darkText }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Settings" 
                  primaryTypographyProps={{ color: colors.darkText }}
                />
              </NavItem>
              
              <NavItem 
                button 
                onClick={() => { /* handle logout */ }}
                sx={{
                  '&:hover': {
                    backgroundColor: colors.lightOrange + '20',
                    '& .MuiListItemIcon-root': {
                      color: colors.lightOrange,
                    },
                    '& .MuiListItemText-primary': {
                      color: colors.lightOrange,
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: colors.darkText }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ color: colors.darkText }}
                />
              </NavItem>
            </List>
          </Box>
        </GlassSidebar>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: "auto",
          p: 4,
          background: `linear-gradient(to bottom right, ${colors.creamWhite}, #ffffff)`
        }}>
          <Box sx={{ 
            maxWidth: 1400,
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            p: 4,
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