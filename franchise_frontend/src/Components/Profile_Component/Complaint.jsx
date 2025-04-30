import React from 'react'
import { Box, Button, TextField, Typography } from "@mui/material";
import ProfilePage from "../../Pages/profilePage";



function Complaint() {
  return (
    <div>
    {/* <Box>
    <ProfilePage />
    </Box> */}
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto", backgroundColor: "#f5f5f5", borderRadius: 3, boxShadow: 2 }}>
    <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
      Complaint
    </Typography>
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      onSubmit={(e) => {
        e.preventDefault();
        
      }}
    >
      <TextField
        required
        label="Complaint"
        placeholder="Enter your complaint"
        variant="outlined"
        multiline
        rows={5}
        fullWidth
        size="small"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: "flex-end" }}>
        Submit Complaint
      </Button>
    </Box>
  </Box>
  </div>
  )
}

export default Complaint
