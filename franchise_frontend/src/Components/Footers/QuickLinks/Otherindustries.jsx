import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Otherindustries = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "",
    category: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    userType: false,
    category: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email || !/^\S+@\S+\.\S+$/.test(formData.email),
      phone: !formData.phone || !/^\d{10}$/.test(formData.phone),
      userType: !formData.userType,
      category: !formData.category,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Registration form submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        userType: "",
        category: "",
        message: "",
      });
    }
  };

  return (
    <Box
      style={{
        maxWidth: "full",
        margin: "0 auto",
        fontFamily: "sans-serif",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Overlay */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 0,
        }}
      ></Box>

      {/* Main Content - Compact Layout */}
      <Box
        style={{
          display: "flex",
          position: "relative",
          zIndex: 1,
          height: "calc(100vh - 80px)",
          overflow: "hidden",
        }}
      >
        {/* Left Side - Text Content */}
        <Box
          style={{
            flex: 1,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          <Typography
          variant="h2"
            style={{
              fontSize: "32px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            Mr Franchise Business Opportunities
          </Typography>

          <Typography
          variant="body"
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "30px",
              maxWidth: "500px",
            }}
          >
            Join established business systems with comprehensive support. Our partners offer 
  turnkey operations with training, marketing tools, and ongoing guidance to help 
  you succeed in your entrepreneurial journey.
          </Typography>

          <Button
            variant="contained"
            style={{
              backgroundColor: "#ffa500",
              color: "#fff",
              padding: "10px 25px",
              fontSize: "14px",
              fontWeight: "bold",
              alignSelf: "flex-start",
              ":hover": {
                backgroundColor: "#e69500",
              },
            }}
          >
            Learn More
          </Button>
        </Box>

        {/* Right Side - Form */}
        <Box
          style={{
            flex: 1,
            padding: "40px",
            display: "flex",
            alignItems: "center",
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          <Box
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: "30px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <Typography
            variant="h2"
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#333",
                fontSize: "24px",
              }}
            >
              Contact With Us
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box
                style={{
                  display: "grid",
                  gap: "15px",
                }}
              >
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  helperText={errors.name && "Name is required"}
                  required
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={errors.email && "Valid email is required"}
                  required
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Mobile Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  helperText={
                    errors.phone && "10-digit phone number is required"
                  }
                  required
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <FormControl
                  required
                  error={errors.userType}
                  variant="outlined"
                  fullWidth
                  size="small"
                >
                  <InputLabel>Register As</InputLabel>
                  <Select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    label="Register As"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="investor">Investor</MenuItem>
                    <MenuItem value="brand">Brand</MenuItem>
                  </Select>
                  {errors.userType && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      Please select a type
                    </span>
                  )}
                </FormControl>

                <FormControl
                  required
                  error={errors.category}
                  variant="outlined"
                  fullWidth
                  size="small"
                >
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Food & Beverage">Food & Beverage</MenuItem>
                    <MenuItem value="Retail">Retail</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Health & Wellness">
                      Health & Wellness
                    </MenuItem>
                  </Select>
                  {errors.category && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      Please select a category
                    </span>
                  )}
                </FormControl>

                <TextField
                  label="Message (Optional)"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </Box>

              <Box style={{ textAlign: "center", marginTop: "25px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  style={{
                    backgroundColor: "#ffa500",
                    color: "#fff",
                    padding: "10px 30px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    ":hover": {
                      backgroundColor: "#e69500",
                    },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>

      {/* FAQ Section */}
      <Box
        style={{
          position: "relative",
          zIndex: 1,
          padding: "60px",
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{
            fontWeight: 600,
            color: "#fff",
            marginBottom: "40px",
          }}
        >
          Why Register With Us?
        </Typography>

        <Box style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Accordion
            style={{
              borderRadius: "8px",
              marginBottom: "16px",
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
            >
              <Typography variant="h6" style={{ fontWeight: 500 }}>
                Why Register as an Investor?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul
                style={{
                  paddingLeft: "18px",
                  margin: 0,
                  lineHeight: "1.8",
                  color: "#eee",
                }}
              >
                <li>
                  <strong>Premium Franchise Access:</strong> First look at top
                  brands.
                </li>
                <li>
                  <strong>Financial Insights:</strong> In-depth data for
                  informed choices.
                </li>
                <li>
                  <strong>Expert Support:</strong> End-to-end investment help.
                </li>
                <li>
                  <strong>Exclusive Networking:</strong> Events with other
                  investors.
                </li>
                <li>
                  <strong>Lower Risk:</strong> Vetted and supported ventures.
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>

          <Accordion
            style={{
              borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "#fff" }} />}
            >
              <Typography variant="h6" style={{ fontWeight: 500 }}>
                Why Register as a Brand?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ul
                style={{
                  paddingLeft: "18px",
                  margin: 0,
                  lineHeight: "1.8",
                  color: "#eee",
                }}
              >
                <li>
                  <strong>Vetted Leads:</strong> Get investor interest easily.
                </li>
                <li>
                  <strong>Brand Visibility:</strong> Gain traction on our
                  platform.
                </li>
                <li>
                  <strong>Growth Strategy:</strong> Expert franchise development
                  help.
                </li>
                <li>
                  <strong>Quality Leads:</strong> Save time with filtered
                  investors.
                </li>
                <li>
                  <strong>Regional Expansion:</strong> Targeted market growth
                  support.
                </li>
              </ul>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};

export default Otherindustries;
