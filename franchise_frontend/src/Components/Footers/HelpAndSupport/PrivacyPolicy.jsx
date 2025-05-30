import React from 'react'
import Navbar from '../../Navbar/NavBar';
import Footer from '../Footer';
import {Box} from '@mui/material';
const PrivacyPolicy = () => {
  return (
     <Box>
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
        <Navbar />
      </Box>
      <Box><Footer /></Box>
</Box>
  )
}

export default PrivacyPolicy