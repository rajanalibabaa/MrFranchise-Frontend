
import { Routes, Route } from 'react-router-dom'
import './App.css'
// import Footer from './Components/Footers/Footer'
// import Navbar from './Components/Navbar/NavBar'
import ProfilePage from './Pages/Profile_Pages/profilePage.jsx'
import DashBoard from './Components/Profile_Component/DashBoard'
import Complaint from './Components/Profile_Component/Complaint'
import FeedBack from './Components/Profile_Component/FeedBack'
import ManageProfile from './Components/Profile_Component/ManageProfile'
import PostRequirement from './Components/Profile_Component/PostRequirement'
import ResponseManager from './Components/Profile_Component/ResponseManager'
import { Box } from '@mui/material'
import IconBreadcrumbs from './Pages/Profile_Pages/IconBreadcrumbs.jsx'

function App() {

  return (
    <>

      <Box >  <IconBreadcrumbs /> </Box>


      < Box sx={{ display: "flex", bgcolor: "#f4f6f8", overflow:"hidden", position:'fixed' }} >
         
         <Box >
        <ProfilePage />
        </Box>

        <Box  sx={{ overflowY: "auto", height: "100vh", padding: 2,width: "80vw" }}>
          <Box>
        <Routes>
          <Route path="/dashboard" index element={<DashBoard />} />
          <Route path="/complaint" element={<Complaint  />} />
          <Route path="/feedback" element={<FeedBack />} />
          <Route path="/manageprofie" element={<ManageProfile />} />
          <Route path="/postrequirement" element={<PostRequirement />} />
          <Route path="/postrequirement" element={<PostRequirement />} />
          <Route path="/responsemanager" element={<ResponseManager />} />
        </Routes>
        </Box>
        </Box>

      </Box>

    </>
  )
}

export default App
