import React from 'react'
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";


const PostRequirement = () => {
    const [postRequirementData, setPostRequirementData] = useState({
      Name: "",
      Address: "",
      Country: "",
      Pincode: "",
      City: "",
      State: "",
      Mobile_Number: "",
      Whatsapp_Number: "",
      Email: "",
      Industry_Type: "",
      Investment_Range: "",
      Floor_Area_Requirement: "",
      Timeline_To_start: "",
      Need_Loan: ""
    });
  
    const [previewData, setPreviewData] = useState(null);
  
    const handlePostRequirementChange = (event) => {
      const { name, value } = event.target;
      setPostRequirementData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handlePreview = () => {
      setPreviewData(postRequirementData);
    };
  
    const handleBackToEdit = () => {
      setPreviewData(null);
    };
  
    const handleSubmitRequirement = () => {
      alert("Requirement Submitted!");
      // Add backend logic here
    };
  
    const getInvestorDataValue = (key) => previewData?.[key] || "N/A";
  return (
    <Box sx={{ display: "flex", minHeight: "75vh", backgroundColor: "#fafafa", padding: 2,width: "99%" }}>
      {/* <Box sx={{ width: 250, borderRight: "1px solid #ddd",  }}>
        <ProfilePage />
      </Box> */}

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Post Requirement
        </Typography>

        {!previewData ? (
          <Paper sx={{ p: 3, borderRadius: 2,width: "95%" }}>
            <Box
              component="form"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 2,
              }}
            >
              {Object.entries(postRequirementData).map(([key, value]) => (
                <TextField
                  key={key}
                  name={key}
                  label={key.replace(/_/g, " ")}
                  value={value}
                  onChange={handlePostRequirementChange}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              ))}

              <Box sx={{ gridColumn: "1 / -1", textAlign: "center", mt: 2 }}>
                <Button variant="contained" color="success" onClick={handlePreview}>
                  Preview
                </Button>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Preview Details
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: "#fff", }}>
              <Typography><strong>Name:</strong> {getInvestorDataValue("Name")}</Typography>
              <Typography><strong>Email:</strong> {getInvestorDataValue("Email")}</Typography>
              <Typography><strong>Phone:</strong> {getInvestorDataValue("Mobile_Number")}</Typography>
              <Typography><strong>WhatsApp:</strong> {getInvestorDataValue("Whatsapp_Number")}</Typography>
              <Typography><strong>Address:</strong> {`${getInvestorDataValue("Address")}, ${getInvestorDataValue("City")}, ${getInvestorDataValue("State")}, ${getInvestorDataValue("Country")} - ${getInvestorDataValue("Pincode")}`}</Typography>
              <Typography><strong>Industry Type:</strong> {getInvestorDataValue("Industry_Type")}</Typography>
              <Typography><strong>Investment Range:</strong> {getInvestorDataValue("Investment_Range")}</Typography>
              <Typography><strong>Floor Area Requirement:</strong> {getInvestorDataValue("Floor_Area_Requirement")}</Typography>
              <Typography><strong>Timeline To Start:</strong> {getInvestorDataValue("Timeline_To_start")}</Typography>
              <Typography><strong>Need Loan:</strong> {getInvestorDataValue("Need_Loan")}</Typography>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
              <Button variant="outlined"  onClick={handleBackToEdit} sx={{ backgroundColor: "#fff", }}>
                Back to Edit
              </Button>
              <Button variant="contained" color="success" onClick={handleSubmitRequirement}>
                Submit
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default PostRequirement
