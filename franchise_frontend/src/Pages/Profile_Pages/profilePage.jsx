import React from "react";
import { Link as RouterLink, Outlet } from "react-router-dom";
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
  styled
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  Email as ReachUsIcon,
  Upgrade as UpgradeIcon,
  Logout as LogoutIcon,
  Business as BrandIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Footer from "../../Components/Footers/Footer";
import Navbar from "../../Components/Navbar/NavBar";

const ProfilePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Styled sidebar with glass morphism effect
  const GlassSidebar = styled(Box)(({ theme }) => ({
    width: 280,
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    borderRight: '1px solid rgba(255, 255, 255, 0.18)',
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)'
    },
    [theme.breakpoints.down('md')]: {
      width: 240,
    }
  }));

  // Styled nav items with hover effects
  const NavItem = styled(ListItem)(({ theme }) => ({
    borderRadius: 12,
    marginBottom: 8,
    padding: '12px 16px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      transform: 'translateX(5px)',
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
      '& .MuiListItemText-primary': {
        color: theme.palette.primary.main,
        fontWeight: 600
      }
    },
    '&.active': {
      backgroundColor: theme.palette.primary.light,
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
      '& .MuiListItemText-primary': {
        color: theme.palette.primary.main,
        fontWeight: 600
      }
    }
  }));

  return (
    <>
      <Navbar />
      <Box sx={{ 
        display: "flex", 
        minHeight: "calc(100vh - 64px)",
        backgroundColor: '#f9fafc'
      }}>
        {/* Sidebar */}
        <GlassSidebar>
          {/* User Profile Section */}
          <Box sx={{ 
            textAlign: "center", 
            p: 3,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            <Avatar 
              src="/path-to-user-avatar.jpg" 
              sx={{ 
                width: 80, 
                height: 80, 
                margin: '0 auto 16px',
                border: `3px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[3]
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Investor Name
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Premium Member
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <List>
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard"
                className={location.pathname === '/investordashboard' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </NavItem>
              
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/manageProfile"
                className={location.pathname === '/investordashboard/manageProfile' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Profile" />
              </NavItem>
              
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/respondemanager"
                className={location.pathname === '/investordashboard/respondemanager' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ReachUsIcon />
                </ListItemIcon>
                <ListItemText primary="Reach Us" />
              </NavItem>
              
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/brands"
                className={location.pathname === '/investordashboard/brands' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <BrandIcon />
                </ListItemIcon>
                <ListItemText primary="My Brands" />
              </NavItem>
            </List>
          </Box>

          {/* Bottom Section */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <List>
              <NavItem 
                button 
                component={RouterLink} 
                to="/investordashboard/upgradeaccount"
                className={location.pathname === '/investordashboard/upgradeaccount' ? 'active' : ''}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <UpgradeIcon />
                </ListItemIcon>
                <ListItemText primary="Upgrade Account" />
              </NavItem>
              
              <NavItem button onClick={() => { /* handle logout */ }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </NavItem>
            </List>
          </Box>
        </GlassSidebar>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: "auto",
          p: 4,
          background: 'linear-gradient(to bottom, #f9fafc, #ffffff)'
        }}>
          <Box sx={{ 
            maxWidth: 1200,
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            p: 4,
            minHeight: 'calc(100vh - 128px)'
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default ProfilePage;