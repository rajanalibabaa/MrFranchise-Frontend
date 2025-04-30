import React from 'react'
import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";
import logo from "../../assets/images/brandLogo.jpg";
function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#1e1e1e', color: '#fff', mt: 8, py: 6 }}>
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Link href="/" underline="none">
              <Box component="img" src={logo} alt="Company Logo" sx={{ height: 60, mb: 2 }} />
            </Link>
            <Typography variant="body2" sx={{ maxWidth: 250 }}>
              Your trusted franchise business expert, helping you grow and expand efficiently.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" component="a" href="https://twitter.com" target="_blank">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" component="a" href="https://facebook.com" target="_blank">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" component="a" href="https://linkedin.com" target="_blank">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" component="a" href="https://instagram.com" target="_blank">
                <Instagram />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <Typography variant="h6" gutterBottom>Beauty & Health</Typography>
          <Box>
            <Link href="/beauty%20asthetics%20&%20supplies" color="inherit" display="block" underline="hover">Beauty Asthetics & Supplies</Link>
            <Link href="/healthcare" color="inherit" display="block" underline="hover">Health Care</Link>
            <Link href="/wellnes" color="inherit" display="block" underline="hover">Wellness</Link>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" gutterBottom>Business Services</Typography>
          <Box>
            <Link href="/advertisement%20&%20media%20services" color="inherit" display="block" underline="hover">Advertisement & Media Services</Link>
            <Link href="/consultancy" color="inherit" display="block" underline="hover">Consultancy</Link>
            <Link href="/it%20services" color="inherit" display="block" underline="hover">IT Services</Link>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" gutterBottom>Contact</Typography>
          <Typography variant="body2">Email: contact@mywebsite.com</Typography>
          <Typography variant="body2">Phone: +123 456 7890</Typography>
        </Grid>
      </Grid>

      <Box textAlign="center" pt={5}>
        <Typography variant="body2">© 2025 MyWebsite. All rights reserved by Mr.Franchise</Typography>
      </Box>
    </Container>
  </Box>
  )
}

export default Footer
