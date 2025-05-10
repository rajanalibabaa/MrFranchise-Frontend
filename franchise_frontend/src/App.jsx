

import './App.css'
import BrandListingForm from './Pages/BrandListingForm/BrandListingForm.jsx'


import {Route,Routes} from "react-router-dom"
import './App.css'
import HomeBannerSec from './Components/HomePage_BannerSection/HomeBannerSec'
import TopBrandVdoSec from "./Components/HomePage_VideoSection/TopBrandVdoSec";
import BrandViewPage from "./Pages/BrandViewPage/BrandViewPage";
import TermsCondition from './Components/QuickLinks/TermsCondition.jsx'
import Faq from './Components/QuickLinks/Faq.jsx'
import Help from './Components/QuickLinks/Help.jsx'
import ContactUs from './Components/QuickLinks/ContactUs.jsx'
import AboutUs from './Components/QuickLinks/AboutUs.jsx'

function App() {

  return (

    
<>
<Routes>
<Route path='/' element={<HomeBannerSec/>}/>
<Route path='/brandViewPage' element={<BrandViewPage/>}/>
<Route path ='/aboutuspage' element={<AboutUs/>}/>
       <Route path='/contactuspage' element={<ContactUs/>}/>
         <Route path='/help' element={<Help/>}/>
         <Route path='/faq' element={<Faq/>}/>
        <Route path='/termscondition' element={<TermsCondition/>}/>
</Routes>
</>
    

  )
}

export default App;
