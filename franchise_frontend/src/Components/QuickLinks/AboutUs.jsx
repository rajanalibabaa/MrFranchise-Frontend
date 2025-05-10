import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Missionimg from "../../assets/Images/Mission.jpg"; // Correctly import the image

const AboutUs = () => {
  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f9f9f9" }}>
      {/* Main Heading */}
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{ marginBottom: "1rem" }}
      >
        About Us
      </Typography>

      {/* Description Section */}
      <Typography
        variant="body1"
        sx={{ maxWidth: "800px", margin: "0 auto", lineHeight: 1.8 }}
        gutterBottom
      >
        Since its establishment in 1999, Franchise India Holdings Limited (FIHL)
        stands as the preeminent franchise solutions provider in Asia, offering
        an unparalleled breadth of expertise in franchising and licensing. With
        a distinguished legacy, FIHL takes pride in its role as an influential
        guide, facilitating successful partnerships between countless investors
        and a variety of entities seeking expansion, both domestically and
        internationally. The foundation of FIHL's esteemed reputation is built
        upon four pillars: in-depth <strong>Knowledge</strong>, expansive{" "}
        <strong>Opportunity</strong>, an extensive <strong>Network</strong>, and
        proven <strong>Success</strong>. These core elements continue to
        underpin the company's outstanding achievements in the realm of
        franchise development.
      </Typography>

      {/* Mission and Vision Section */}
      <Grid container spacing={4} alignItems="center">
        {/* Left Side: Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={Missionimg}
            alt="Team Collaboration"
            sx={{
              width: "50%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Grid>

        {/* Right Side: Mission and Value */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#5a2c1f" }}
          >
            Our Mission
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: "2rem", lineHeight: 1.8, color: "#5a2c1f" }}
          >
            At Pixeflow, we provide tailored AI wellness and productivity
            solutions to boost efficiency, drive innovation, and support growth.
            We help individuals and businesses optimize their routines for
            lasting success.
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#5a2c1f" }}
          >
            Our Value
          </Typography>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.8, color: "#5a2c1f" }}
          >
            Pixeflow sets the global standard in AI-driven wellness and
            productivity solutions, empowering organizations worldwide through
            innovative technology and strategies. Join us to approach wellness
            and productivity.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;