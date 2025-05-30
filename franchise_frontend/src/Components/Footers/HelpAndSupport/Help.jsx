import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Link,
  Stack,
} from "@mui/material";
import {
  Email,
  Phone,
 
} from '@mui/icons-material';
import Navbar from "../../Navbar/NavBar";
import { Link as RouterLink } from "react-router-dom";

import Footer from "../Footer";

const paperStyle = {
  p: 3,
  mb: 4,
  borderRadius: 3,
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "default",
  ":hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    backgroundColor: "rgba(25, 118, 210, 0.04)",
  },
};

const titleStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  marginTop: 3,
  fontWeight: "bold",
  color: "#ffba00",
  userSelect: "none",
  "& span": {
    fontSize: "1.3rem",
    transition: "transform 0.5s ease",
  },
  ":hover span": {
    transform: "rotate(20deg)",
  },
};

const subtitleStyle = {
  fontWeight: "bold",
  mb: 0.8,
  color: "text.primary",
};

const contentStyle = {
  pl: 2,
  color: "text.secondary",
  lineHeight: 1.5,
  fontSize: "0.95rem",
};

const listStyle = {
  pl: 4,
  mt: 1,
  color: "text.secondary",
  fontSize: "0.95rem",
  "& > *": {
    mb: 0.3,
  },
};

const Help = () => {
  return (
    <Box>
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 10 }}>
        <Navbar />
      </Box>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, mt: 15 }}>
        {/* Header */}
        <Typography align="center" variant="h4" fontWeight="bold" color="orange">
          Help Center
        </Typography>

        <Typography align="center" variant="h6" fontWeight="medium" mb={3}>
          How can we assist you today?
        </Typography>

        <Typography mb={4}>
          Welcome to the MrFranchise Help Center — your one-stop destination for
          support, guidance, and answers to frequently asked questions.
        </Typography>

       {/* Popular Help Topics */}
{/* Popular Help Topics */}
{/* <Paper variant="outlined" sx={paperStyle}> */}
  <Typography variant="h6" sx={titleStyle}>
    <span>🔹</span> Popular Help Topics
  </Typography>

  {/* Flex container for cards */}
  <Box
    sx={{
      display: "flex",
      flexWrap: "nowrap",  // NO wrapping
      // gap: 1,
      mt: 2,
      overflowX: "hidden",   // optional horizontal scroll on small screens
    }}
  >
    {/* Card 1 */}
    <Paper
      elevation={4}
      sx={{
        flex: "0 0 30%",  // fixed width: 1/3rd of container
        height: 205,
       margin:1,
        p: 1.5,
        borderRadius: 5,
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          // boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          // backgroundColor: "rgba(25, 118, 210, 0.05)",
        },
      }}
    >
      <Typography variant="subtitle1" sx={subtitleStyle}>
        <span style={{ marginRight: 8 }}>🧩</span> 1. How does MrFranchise.in work?
      </Typography>
      <Typography sx={contentStyle}>
        MrFranchise.in is a franchise consulting and marketing platform that connects brands with potential investors.
  
        We help businesses franchise their model, promote their brand, and attract qualified leads through strategic campaigns and investor outreach.
      </Typography>
    </Paper>

    {/* Card 2 */}
    <Paper
      elevation={4}
      sx={{
        flex: "0 0 30%",
        height: 205,
        margin:1,
        p: 1.5,
        borderRadius: 3,
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          // boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          // backgroundColor: "rgba(25, 118, 210, 0.05)",
        },
      }}
    >
      <Typography variant="subtitle1" sx={subtitleStyle}>
        <span style={{ marginRight: 8 }}>🏷️</span> 2. I’m a business owner. How do I list my brand?
      </Typography>
      <Typography sx={contentStyle}>
        You can click the “Add Listing” button on the top menu to submit your brand for evaluation. Once reviewed by our team, we’ll guide you through the onboarding and promotion process.
      </Typography>
    </Paper>

    {/* Card 3 */}
    <Paper
      elevation={4}
      sx={{
        flex: "0 0 30%",
        height: 200,
        margin:1,
        p: 1.5,
        borderRadius: 3,
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          // boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          // backgroundColor: "rgba(25, 118, 210, 0.05)",
        },
      }}
    >
      <Typography variant="subtitle1" sx={subtitleStyle}>
        <span style={{ marginRight: 8 }}>💼</span> 3. I’m an investor. How do I explore franchise opportunities?
      </Typography>
      <Typography sx={contentStyle}>
        Browse through Franchise Categories based on your preferred industry, investment range, or location. You can apply directly or request a call-back for consultation.
      </Typography>
    </Paper>
  </Box>

        {/* Account & Listings */}
       
          <Typography variant="h6" gutterBottom sx={titleStyle}>
            <span>🔹</span> Account & Listings
          </Typography>

          <Box mb={2} ml={10}>
            <Typography variant="subtitle1" sx={subtitleStyle}>
              👤 How do I create an account?
            </Typography>
            <Typography sx={contentStyle}>
              Click on the Login / Sign Up link at the top right. You can
              register using your email and mobile number.
            </Typography>
          </Box>

          <Box ml={10}>
            <Typography variant="subtitle1" sx={subtitleStyle}>
              ✏️ Can I edit or update my brand listing?
            </Typography>
            <Typography sx={contentStyle}>
              Yes. After logging in, visit your dashboard and select the brand
              you want to edit. You can update brand details, investment
              requirements, or upload new media.
            </Typography>
          </Box>
      
        {/* Consulting & Paid Services */}
       
          <Typography variant="h6" gutterBottom sx={titleStyle}>
            <span>🔹</span> Consulting & Paid Services
          </Typography>

          <Box mb={2}>
            <Typography variant="subtitle1" sx={subtitleStyle}>
              📋 What is included in your franchise consulting service?
            </Typography>
            <Typography sx={contentStyle}>Our standard package includes:</Typography>
            <Box sx={listStyle}>
              <Typography>• Franchise business model planning</Typography>
              <Typography>• Legal documentation</Typography>
              <Typography>• Franchise kit creation</Typography>
              <Typography>• Pitch deck</Typography>
              <Typography>• Investor generation campaigns</Typography>
              <Typography>• Strategy sessions with our senior consultant</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={subtitleStyle}>
              💳 How do I make a payment?
            </Typography>
            <Typography sx={contentStyle}>
              Once you choose a service package, you’ll receive a payment link or
              invoice. We support secure UPI, bank transfer, and card payments.
            </Typography>
          </Box>
       

        {/* Technical Help */}
        
          <Typography variant="h6" gutterBottom sx={titleStyle}>
            <span>🔹</span> Technical Help
          </Typography>

          <Box mb={2}>
            <Typography variant="subtitle1" sx={subtitleStyle}>
              ❗ I'm facing issues with the website.
            </Typography>
            <Typography sx={contentStyle}>
              Try refreshing the page or clearing your browser cache. If the
              issue persists, contact our support team.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={subtitleStyle}>
              📥 I submitted a form but didn’t get a response.
            </Typography>
            <Typography sx={contentStyle}>
              Please allow 24–48 business hours for our team to review and respond.
              You can also call or WhatsApp us for faster support.
            </Typography>
          </Box>
       

       
       

        {/* Additional Resources */}
      <Box
    sx={{
      mt: 6,
      p: 4,
      borderRadius: 4,
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 186, 0, 0.4)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.15)',
      },
    }}
  >
    <Typography
      variant="h5"
      fontWeight={700}
      color="text.primary"
      gutterBottom
      sx={{ textAlign: 'center', color: '#FF6F00' }}
    >
      📞 Need Immediate Assistance?
    </Typography>

    

    <Typography variant="body1" textAlign="center" sx={{ color: 'black' }}>
       <Email sx={{ verticalAlign: 'middle', mr: 1 }} />
                  <Link href="mailto:ceo@MrFranchise.in" color="#FF6F00" underline="hover">
                    Email: ceo@MrFranchise.in
                  </Link>
      <br />
     <Phone sx={{ verticalAlign: 'middle', mr: 1 }} />
        <Link href="tel:+919841323388" color="black" underline="hover">
           Call
Us: +91 98413 23388
        </Link><br />
        💬{' '}
                <Link href="https://wa.me/919841323388" target="_blank" rel="noopener" color="black" underline="hover"fontWeight="bold">
                  WhatsApp Chat
                </Link>
      <br />
      📍 Head Office:{' '}
<Link
  href="https://www.google.com/maps/place/Chennai,+Tamil+Nadu"
  target="_blank"
  rel="noopener noreferrer"
  color="#FF6F00"
  underline="hover"
>
  Chennai, Tamil Nadu
</Link>
    </Typography>
  </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Help;
