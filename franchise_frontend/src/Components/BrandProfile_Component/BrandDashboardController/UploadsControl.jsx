import React from 'react'
import Uploads from '../../../Pages/Registration/BrandLIstingRegister/BrandRegisterUploads'
import { Typography } from '@mui/material'
const UploadsControl = () => {
  return (
<>
<Typography sx={{fontSize:"30px", textAlign:"center", color:"#7ad03a", fontWeight:"bold"}}>
    UPLOADS
  </Typography>
<Uploads/>
</>
  )
}

export default UploadsControl