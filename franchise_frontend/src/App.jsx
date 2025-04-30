import {Route,Routes} from "react-router-dom"
import './App.css'
import HomeBannerSec from './Components/HomePage_BannerSection/HomeBannerSec'

function App() {

  return (
    
<>
<Routes>
<Route path='/' element={<HomeBannerSec/>}/>
</Routes>
</>
    
  )
}

export default App;
