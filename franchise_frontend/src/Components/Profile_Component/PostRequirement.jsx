import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import axios from "axios";

const PostRequirement = () => {
  const [postRequirementData, setPostRequirementData] = useState({
    name: "",
    address: "",
    country: "",
    pincode: "",
    city: "",
    state: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    industryType: "",
    investmentRange: "",
    floorAreaRequirement: "",
    timelineToStart: "",
    needLoan: ""
  });

  const [previewData, setPreviewData] = useState(null);

  const handlePostRequirementChange = (event) => {
    const { name, value } = event.target;
    setPostRequirementData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreview = () => {
    setPreviewData(postRequirementData);
  };

  const handleBackToEdit = () => {
    setPreviewData(null);
  };

  const handleSubmitRequirement = async () => {
    try {
      console.log("postRequirementData : ",postRequirementData)
      const response = await axios.post(
        "http://localhost:5000/api/post/createPostRequirement",
        postRequirementData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Requirement submitted:", response.data);
      alert("Requirement submitted successfully!");
      setPostRequirementData({
        name: "",
        address: "",
        country: "",
        pincode: "",
        city: "",
        state: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
        industryType: "",
        investmentRange: "",
        floorAreaRequirement: "",
        timelineToStart: "",
        needLoan: ""
      });
      setPreviewData(null);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed.");
    }
  };

  const getPreviewValue = (key) => previewData?.[key] || "N/A";

  return (
    <Box sx={{ display: "flex", minHeight: "75vh", backgroundColor: "#fafafa", padding: 2, width: "99%" }}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Post Requirement
        </Typography>

        {!previewData ? (
          <Paper sx={{ p: 3, borderRadius: 2, width: "95%" }}>
            <Box
              component="form"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 2
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

            <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: "#fff" }}>
              <Typography><strong>Name:</strong> {getPreviewValue("name")}</Typography>
              <Typography><strong>Email:</strong> {getPreviewValue("email")}</Typography>
              <Typography><strong>Phone:</strong> {getPreviewValue("mobileNumber")}</Typography>
              <Typography><strong>WhatsApp:</strong> {getPreviewValue("whatsappNumber")}</Typography>
              <Typography><strong>Address:</strong> {getPreviewValue("address")}</Typography>
              <Typography><strong>Industry Type:</strong> {getPreviewValue("industryType")}</Typography>
              <Typography><strong>City:</strong> {getPreviewValue("city")}</Typography>
              <Typography><strong>State:</strong> {getPreviewValue("state")}</Typography>
              <Typography><strong>Pincode:</strong> {getPreviewValue("pincode")}</Typography>
              <Typography><strong>Country:</strong> {getPreviewValue("country")}</Typography>
              <Typography><strong>Investment Range:</strong> {getPreviewValue("investmentRange")}</Typography>
              <Typography><strong>Floor Area Requirement:</strong> {getPreviewValue("floorAreaRequirement")}</Typography>
              <Typography><strong>Timeline To Start:</strong> {getPreviewValue("timelineToStart")}</Typography>
              <Typography><strong>Need Loan:</strong> {getPreviewValue("needLoan")}</Typography>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={handleBackToEdit}>
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
  );
};

export default PostRequirement;
