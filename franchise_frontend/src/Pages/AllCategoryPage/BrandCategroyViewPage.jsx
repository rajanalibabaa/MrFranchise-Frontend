import React from 'react'
import Navbar from '../../Components/Navbar/NavBar'
import Footer from '../../Components/Footers/Footer'
// import BrandList from './AllCategoryBrandDetail.jsx'
import BrandListNew from './BrandList.jsx'
import { Box } from '@mui/material'


function BrandCategroyViewPage() {
  return (
    <>
    <Navbar />
    <Box sx={{overflow:"hidden"}}>
    <BrandListNew />
    </Box>
    {/* <BrandList /> */}
    <Footer />
    
    </>
  )
}

export default BrandCategroyViewPage
