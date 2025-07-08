import React from "react";
import Navbar from "../../Components/Navbar/NavBar";
import Footer from "../../Components/Footers/Footer";
// import BrandList from './AllCategoryBrandDetail.jsx'
import BrandListNew from "./BrandList.jsx";
import { Box } from "@mui/material";

function BrandCategroyViewPage() {
  return (
    <>
      {/* Fixed Navbar */}
      {/* <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1100 }}>
        
      </Box> */}
<Navbar />
      {/* Scrollable Content below the fixed Navbar */}
      <Box
        sx={{
          mt: "64px", // Adjust this value to match your Navbar height
          overflowY: "auto",
        }}
      >
        <BrandListNew />
      </Box>
      <Box>
        {/* Footer or other content can go here */}
      </Box>
    </>
  );
}

export default BrandCategroyViewPage;
