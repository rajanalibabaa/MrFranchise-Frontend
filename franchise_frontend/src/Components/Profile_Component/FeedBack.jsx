import React from 'react'
import { Box, Button, TextField, Typography } from "@mui/material";


const FeedBack = () => {
  return (
    <div>
       {/* <Box>
      <ProfilePage />
      </Box> */}
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto", backgroundColor: "#f5f5f5", borderRadius: 3, boxShadow: 2, padding: 5,height: "40vh", width: "300%",marginTop: 10,marginLeft: 30 }}>
      {/* <Box sx={{ p: 4, maxWidth: 600, mx: "auto", backgroundColor: "#f5f5f5", borderRadius: 3, boxShadow: 2 }}> */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center",width: "100%" }}>
        Feedback
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        onSubmit={(e) => {
          e.preventDefault();
          // handle form submission here
        }}
      >
        <TextField
          required
          label="Topic"
          placeholder="Enter topic"
          variant="outlined"
          fullWidth
          size="small"
        />
        <TextField
          required
          label="Feedback"
          placeholder="Enter your feedback"
          variant="outlined"
          multiline
          rows={5}
          fullWidth
          size="small"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ alignSelf: "flex-end" }}>
          Submit Feedback
        </Button>
      </Box>
    </Box>
    </div>
  )
}

export default FeedBack
