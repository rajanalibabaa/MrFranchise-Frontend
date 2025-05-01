
import React  from 'react';
import {Route,Routes} from "react-router-dom"
import InvestorRegister from './Pages/Registration/InvestorsRegister';
import BrandRegister from './Pages/Registration/BrandRegister';
import LoginPage from './Pages/LoginPage/LoginPage';
import HomeBannerSec from './Components/HomePage_BannerSection/HomeBannerSec'
import TopBrandVdoSec from "./Components/HomePage_VideoSection/TopBrandVdoSec";
import BrandViewPage from "./Pages/BrandViewPage/BrandViewPage";
import './App.css'

function App() {

  return (
    
<>
<Routes>
<Route path='/' element={<HomeBannerSec/>}/>
<Route path='/brandViewPage' element={<BrandViewPage/>}/>
   <Route path="/investor-register" element={<InvestorRegister/>} />
        <Route path='/brand-register' element={<BrandRegister/>} />
        <Route path='/loginpage' element={<LoginPage/>}/>
</Routes>
</>
    
  )
}

export default App;
