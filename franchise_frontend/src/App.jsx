
import React  from 'react';
import {Route,Routes} from "react-router-dom"
import InvestorRegister from './Pages/Registration/InvestorsRegister';
import BrandRegister from './Pages/Registration/BrandRegister';
import LoginPage from './Pages/LoginPage/LoginPage';
import BrandViewPage from "./Pages/BrandViewPage/BrandViewPage";
import './App.css'
import HomeBannerSec from './Pages/HomePages/HomeBannerSec';
import RegisterHandleUser from './Pages/Registration/RegisterHandlePage';
import BrandListingFormPage from './Pages/BrandListingForm/BrandListingFormPage';
import SideViewContent from './Components/SideViewContentMenu/SideHoverMenu';

function App() {

  return (
    
<>
<Routes>
<Route path='/' element={<HomeBannerSec/>}/>
<Route path='/brandViewPage' element={<BrandViewPage/>}/>
   <Route path="/investor-register" element={<InvestorRegister/>} />
        <Route path='/brand-register' element={<BrandRegister/>} />
        <Route path='/loginpage' element={<LoginPage/>}/>
        <Route path='/registerhandleuser' element={<RegisterHandleUser/>}/>
        <Route path='/brandlistingform' element={<BrandListingFormPage/>}/>
        <Route path='/sideviewcontentmenu' element={<SideViewContent/>}/>
</Routes>
</>
    
  )
}

export default App;
