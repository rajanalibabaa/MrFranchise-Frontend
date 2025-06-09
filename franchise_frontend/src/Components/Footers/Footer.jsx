import React from "react";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  IconButton,
  Button
} from "@mui/material";
import brandlogo from "../../assets/Images/brandLogo.jpg";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  ArrowUpward,
  Email,
  Phone,
  LocationOn
} from "@mui/icons-material";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0a1929",
        color: "#fff",
        pt: 6,
        pb: 3,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #ffba00 0%, #ff6d00 100%)"
        }
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5} justifyContent="space-between">
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Box
                component="img"
                src={brandlogo}
                alt="MR FRANCHISE Logo"
                sx={{
                  width: "auto",
                  height: { xs: 50, sm: 60, md: 70 },
                  mb: 2,
                  cursor: "pointer",
                  alignSelf: { xs: "center", md: "flex-start" }
                }}
                onClick={scrollToTop}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#ffba00",
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: "1.1rem",
                  alignSelf: { xs: "center", md: "flex-start" }
                }}
              >
                BUSINESS INVESTORS: BEST CHOICE
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: "#b0bec5",
                  lineHeight: 1.6,
                  fontSize: "0.95rem",
                  textAlign: { xs: "center", md: "left" }
                }}
              >
                Empowering franchise growth across India by connecting brands
                with serious investors through innovative digital solutions.
              </Typography>
              
              {/* Contact Info */}
              <Box sx={{ mt: "auto" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Email sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
                  <Link href="mailto:info@mrfranchise.in" color="#b0bec5" underline="hover">
                    mrfranchise22@gmail.com
                  </Link>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Phone sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
                  <Link href="tel:+911234567890" color="#b0bec5" underline="hover">
                    +91 123 456 7890
                  </Link>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOn sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
                  <Typography variant="body2" color="#b0bec5">
                    Chennai, India
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00"
                }
              }}
            >
              Quick Links
            </Typography>
            <Box
              component="nav"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2
              }}
            >
              {[
                { text: "Expand Your Brand", href: "/expandyourbrand" },
                { text: "Invest in a Franchise", href: "/investfranchise" },
                { text: "Advertise With Us", href: "/advertisewithus" },
                { text: "Lead Distribution", href: "/franchisepromotion" },
                { text: "Other Industries", href: "/otherindustries" }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  color="#b0bec5"
                  underline="none"
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#ffba00",
                      transform: "translateX(5px)"
                    },
                    fontSize: "0.95rem"
                  }}
                >
                  {item.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Support Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00"
                }
              }}
            >
              Support
            </Typography>
            <Box
              component="nav"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2
              }}
            >
              {[
                { text: "About Us", href: "/aboutus" },
                { text: "Contact Support", href: "/contactus" },
                { text: "FAQs", href: "/faq" },
                { text: "Help Center", href: "/help" },
                { text: "Terms & Conditions", href: "/termsandconditions" }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  color="#b0bec5"
                  underline="none"
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      color: "#ffba00",
                      transform: "translateX(5px)"
                    },
                    fontSize: "0.95rem"
                  }}
                >
                  {item.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Newsletter Column */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00"
                }
              }}
            >
              Newsletter
            </Typography>
            <Typography variant="body2" color="#b0bec5" mb={2}>
              Subscribe to our newsletter for the latest franchise opportunities and industry insights.
            </Typography>
            <Box component="form" sx={{ display: "flex", mb: 3 }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  flex: 1,
                  padding: "12px 15px",
                  border: "none",
                  borderRadius: "4px 0 0 4px",
                  fontSize: "0.95rem",
                  backgroundColor: "#1e3a5c",
                  color: "#fff",
                  outline: "none"
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: "0 4px 4px 0",
                  backgroundColor: "#ff6d00",
                  "&:hover": {
                    backgroundColor: "#ff8500"
                  },
                  px: 3,
                  textTransform: "none"
                }}
              >
                Subscribe
              </Button>
            </Box>
            
            {/* Social Media */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="#b0bec5" mb={1.5}>
                Connect with us:
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                {[
                  { icon: <Facebook />, color: "#4267B2" },
                  { icon: <Twitter />, color: "#1DA1F2" },
                  { icon: <LinkedIn />, color: "#0077B5" },
                  { icon: <Instagram />, color: "#E1306C" }
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      backgroundColor: `${social.color}20`,
                      color: social.color,
                      "&:hover": {
                        backgroundColor: `${social.color}30`
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>


        {/* Bottom Bar */}
       
          <Typography
            variant="body2"
            color="#b0bec5"
            textAlign="center"
            sx={{ fontSize: "0.85rem", mb: { xs: 2, sm: 0 } }}
          >
            © 2025 MrFranchise.in. All Rights Reserved.
          </Typography>
          
          
          
        <Box sx={{
          mt: 3,
          position: "sticky",  bottom: 16, right: 16, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconButton
             
            onClick={scrollToTop}
            sx={{
              backgroundColor: "#ff6d00",
              color: "white",
              "&:hover": {
                backgroundColor: "#ff8500"
              },
              mt: { xs: 2, sm: 0 },
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>
       
      </Container>
    </Box>
  );
}

export default Footer;