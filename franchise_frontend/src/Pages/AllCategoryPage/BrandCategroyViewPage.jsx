import React from 'react'
import Navbar from '../../Components/Navbar/NavBar'
import Footer from '../../Components/Footers/Footer'
// import BrandList from './AllCategoryBrandDetail.jsx'
import BrandListNew from './BrandList.jsx'


function BrandCategroyViewPage() {
  return (
    <>
    <Navbar />
    <BrandListNew />
    {/* <BrandList /> */}
    <Footer />
    
    </>
  )
}

export default BrandCategroyViewPage
