import React from 'react'
import Navbar from '../../Components/Navbar/NavBar'
import Footer from '../../Components/Footers/Footer'
import BrandList from './AllCategoryBrandDetail'
import BrandProfile from '../../Components/AllCategroyPageHandling/BrandProfile'

function BrandCategroyViewPage() {
  return (
    <>
    <Navbar />

    <BrandList />
    <Footer />
    
    </>
  )
}

export default BrandCategroyViewPage
