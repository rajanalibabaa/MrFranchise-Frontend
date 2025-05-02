
import React from 'react';
import { Route, Routes } from "react-router-dom"
import InvestorRegister from './Pages/Registration/InvestorsRegister';
import BrandRegister from './Pages/Registration/BrandRegister';
import LoginPage from './Pages/LoginPage/LoginPage';
import BrandViewPage from "./Pages/BrandViewPage/BrandViewPage";
import './App.css'
import HomeBannerSec from './Pages/HomePages/HomeBannerSec';
import RegisterHandleUser from './Pages/Registration/RegisterHandlePage';
import BrandListingFormPage from './Pages/BrandListingForm/BrandListingFormPage';
import SideViewContent from './Components/SideViewContentMenu/SideHoverMenu';
import ProfilePage from './Pages/Profile_Pages/profilePage';
import IconBreadcrumbs from './Pages/Profile_Pages/IconBreadcrumbs';
import ManageProfile from './Components/Profile_Component/ManageProfile';
import PostRequirement from './Components/Profile_Component/PostRequirement';
import ResponseManager from './Components/Profile_Component/ResponseManager';
import DashBoard from './Components/Profile_Component/DashBoard';

function App() {

  return (

    <>
      <Routes>
        <Route path='/' element={<HomeBannerSec />} />
        <Route path='/brandViewPage' element={<BrandViewPage />} />
        <Route path="/investor-register" element={<InvestorRegister />} />
        <Route path='/brand-register' element={<BrandRegister />} />
        <Route path='/loginpage' element={<LoginPage />} />
        <Route path='/registerhandleuser' element={<RegisterHandleUser />} />
        <Route path='/brandlistingform' element={<BrandListingFormPage />} />
        <Route path='/sideviewcontentmenu' element={<SideViewContent />} />
       
        
       
        {/* <Route path='/profilepage' element={<ProfilePage />} /> */}
        {/* <Route path='/iIconbreadcrumbs' element={<IconBreadcrumbs />} /> */}
        <Route path='/dashboard' element={<DashBoard/>} />
        {/* <Route path='/complaint' element={<Complaint />} /> */}
        {/* <Route path='/feedback' element={<FeedBack />} /> */}
        {/* <Route path='/manageProfile' element={<ManageProfile />} /> */}
        {/* <Route path='/PostRequirement' element={<PostRequirement />} /> */}
        {/* <Route path='/respondemanager' element={<ResponseManager />} /> */}
        
        
        </Routes>
    </>

  )
}

export default App;
