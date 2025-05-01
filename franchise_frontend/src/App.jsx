

import './App.css'
import BrandListingForm from './Pages/BrandListingForm/BrandListingForm.jsx'


import {Route,Routes} from "react-router-dom"
import './App.css'
import HomeBannerSec from './Components/HomePage_BannerSection/HomeBannerSec'
import TopBrandVdoSec from "./Components/HomePage_VideoSection/TopBrandVdoSec";
import BrandViewPage from "./Pages/BrandViewPage/BrandViewPage";

function App() {

  return (

    
<>
<Routes>
<Route path='/' element={<HomeBannerSec/>}/>
<Route path='/brandViewPage' element={<BrandViewPage/>}/>
</Routes>
</>
    

  )
}

export default App;
