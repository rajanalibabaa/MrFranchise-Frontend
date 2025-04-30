import react  from 'react';
import {Route,Routes} from "react-router-dom"

import InvestorRegister from './Pages/Registration/InvestorsRegister';

function App() {

  return (
   <>
   
      <Routes>
        <Route path="/investor-register" element={<InvestorRegister/>} />
      </Routes>
      </>
  )
}

export default App
