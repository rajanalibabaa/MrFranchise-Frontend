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
import AboutUs from './Components/QuickLinks/AboutUs';
import ContactUs from './Components/QuickLinks/ContactUs';
import Help from './Components/QuickLinks/Help';
import Faq from './Components/QuickLinks/Faq';
import TermsPolicies from './Components/QuickLinks/TermsPolicies';
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
        <Route path ='/aboutuspage' element={<AboutUs/>}/>
        <Route path='/contactuspage' element={<ContactUs/>}/>
        <Route path='/help' element={<Help/>}/>
        <Route path='/faq' element={<Faq/>}/>
        <Route path='/terms-policies' element={<TermsPolicies/>}/>
</Routes>
</>
    
  )
}

export default App;
