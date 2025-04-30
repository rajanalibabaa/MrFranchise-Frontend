import React  from 'react';
import {Route,Routes} from "react-router-dom"

import InvestorRegister from './Pages/Registration/InvestorsRegister';
import BrandRegister from './Pages/Registration/BrandRegister';
import LoginPage from './Pages/LoginPage/LoginPage';

function App() {

  return (

   <>
      <Routes>
        <Route path="/investor-register" element={<InvestorRegister/>} />
        <Route path='/brand-register' element={<BrandRegister/>} />
        <Route path='/loginpage' element={<LoginPage/>}/>
      </Routes>
      </>
  )
}

export default App
