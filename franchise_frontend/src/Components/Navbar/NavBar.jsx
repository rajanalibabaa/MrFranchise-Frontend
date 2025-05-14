import React from "react";
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
  Stack,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { User } from "lucide-react";
import SideViewContent from "../SideViewContentMenu/SideHoverMenu";
import { useDispatch, useSelector } from "react-redux";
import { toggleLogin, toggleSidebar, toggleMenu } from "../../Redux/Slices/navbarSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.navbar.isLoggedIn);
  const sidebarView = useSelector((state) => state.navbar.sidebarView);
  const menuOpen = useSelector((state) => state.navbar.menuOpen);

  const handleNavigate = (path) => {
    navigate(path);
    dispatch(toggleMenu(false));
  };

  const handleLogout = () => {
    dispatch(toggleLogin(false));
    dispatch(toggleMenu(false));
  };

  return (
    <>
      <Box sx={{ background: "#eee", p: 1, display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Button size="small">Expand Your Franchise</Button>
          <Button size="small">Investor</Button>
          <Button size="small">Advertise</Button>
          <Button size="small">Sell Your Business</Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>💬</Typography>
          <FormControl variant="standard">
            <Select defaultValue="en">
              <MenuItem value="en">EN - English</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <AppBar position="static" color="default">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge="start" onClick={() => dispatch(toggleSidebar(true))}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">MR FRANCHISE</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link to="/allcategories">CATEGORY</Link>
            <Button variant="outlined" onClick={() => handleNavigate("/brandlistingform")}>
              ADD LISTING
            </Button>

            <Box sx={{ position: "relative" }} onClick={() => dispatch(toggleMenu())}>
              {isLoggedIn ? <User /> : <Avatar src="/broken-image.jpg" />}
              {menuOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    background: "#fff",
                    boxShadow: 3,
                    p: 2,
                    right: 0,
                    zIndex: 10,
                  }}
                >
                  {!isLoggedIn ? (
                    <>
                      <Button fullWidth onClick={() => handleNavigate("/loginpage")}>SIGN-IN</Button>
                      <Button fullWidth onClick={() => handleNavigate("/registerhandleuser")}>REGISTER</Button>
                    </>
                  ) : (
                    <>
                      <Button fullWidth onClick={() => handleNavigate("/profile")}>MY PROFILE</Button>
                      <Button fullWidth onClick={handleLogout}>LOGOUT</Button>
                    </>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

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
    </>
  );
}

export default Navbar;
