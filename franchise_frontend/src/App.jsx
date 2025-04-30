
import { Routes, Route } from 'react-router-dom'
import './App.css'
// import Footer from './Components/Footers/Footer'
// import Navbar from './Components/Navbar/NavBar'
import ProfilePage from './Pages/profilePage'
import DashBoard from './Components/Profile_Component/DashBoard'
import Complaint from './Components/Profile_Component/Complaint'
import FeedBack from './Components/Profile_Component/FeedBack'
import ManageProfile from './Components/Profile_Component/ManageProfile'
import PostRequirement from './Components/Profile_Component/PostRequirement'
import ResponseManager from './Components/Profile_Component/ResponseManager'
import { Box } from '@mui/material'

function App() {

  return (
   < Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      <ProfilePage  />
      <Routes>
        <Route path="/dashboard" index element={<DashBoard />} />
        <Route path="/complaint" element={<Complaint />} />

        <Route path="/feedback" element={<FeedBack />} />
        <Route path="/manageprofie" element={<ManageProfile />} />
        <Route path="/postrequirement" element={<PostRequirement />} />
        <Route path="/postrequirement" element={<PostRequirement />} />
        <Route path="/responsemanager" element={<ResponseManager />} />
      </Routes>

    </Box>
  )
}

export default App
