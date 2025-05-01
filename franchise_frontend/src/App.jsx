import {Route,Routes} from "react-router-dom"
import './App.css'
import HomeBannerSec from './Pages/HomePages/HomeBannerSec'
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
