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
        <Navbar />
  
      {/* Scrollable Content below the fixed Navbar */}
      <Box
        sx={{
          mt: "64px", // Adjust this value based on your Navbar height (e.g. 64px) // Full viewport height minus Navbar
          overflowY: "auto",
        }}
      >
        <BrandListNew />
      </Box>
      <Box></Box>

      {/* {/* <BrandList /> */}
    </>
  );
}

export default BrandCategroyViewPage;
