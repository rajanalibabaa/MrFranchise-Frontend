

import './App.css'


import {Route,Routes} from "react-router-dom"
import './App.css'
import HomeBannerSec from './Pages/HomePages/HomeBannerSec'
import TopBrandVdoSec from "./Components/HomePage_VideoSection/TopBrandVdoSec";
import BrandViewPage from "./Pages/BrandViewPage/BrandViewPage";
import BrandListingFormPage from './Pages/BrandListingForm/BrandListingFormPage.jsx'

function App() {

  return (

    
<>
<Routes>
<Route path='/' element={<HomeBannerSec/>}/>
<Route path='/brandViewPage' element={<BrandViewPage/>}/>
<Route path='/brandListingForm' element={<BrandListingFormPage/>}/>
</Routes>
</>
    

  )
}

export default App;
