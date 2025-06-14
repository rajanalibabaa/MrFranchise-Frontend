import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Button,
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
  LocationOn,
} from "@mui/icons-material";
import axios from "axios";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [email, setEmail] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [response, setresponse] = React.useState("");

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/subcribe/getsubscribe",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response from server:", res.data);
      setresponse(res.data.success);

      if (res.data.success) {
        setSuccessMsg(res.data.message);
      } else {
        setSuccessMsg(res.data.message);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setEmail("");
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    }
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
          background: "linear-gradient(90deg, #ffba00 0%, #ff6d00 100%)",
        },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5} justifyContent="space-between">
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box
                component="img"
                src={brandlogo}
                alt="MR FRANCHISE Logo"
                sx={{
                  width: "auto",
                  height: { xs: 50, sm: 60, md: 70 },
                  mb: 2,
                  cursor: "pointer",
                  alignSelf: { xs: "center", md: "flex-start" },
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
                  alignSelf: { xs: "center", md: "flex-start" },
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
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Empowering franchise growth across India by connecting brands
                with serious investors through innovative digital solutions.
              </Typography>

              {/* Contact Info */}
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
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Quick Links
            </Typography>
            <Box
              component="nav"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              {[
                { text: "Expand Your Brand", href: "/expandyourbrand" },
                { text: "Invest in a Franchise", href: "/investfranchise" },
                { text: "Advertise With Us", href: "/advertisewithus" },
                { text: "Lead Distribution", href: "/franchisepromotion" },
                { text: "Other Industries", href: "/otherindustries" },
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
                      transform: "translateX(5px)",
                    },
                    fontSize: "0.95rem",
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
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Support
            </Typography>
            <Box
              component="nav"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              {[
                { text: "About Us", href: "/aboutus" },
                { text: "Contact Support", href: "/contactus" },
                { text: "FAQs", href: "/faq" },
                { text: "Help Center", href: "/help" },
                { text: "Terms & Conditions", href: "/termsandconditions" },
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
                      transform: "translateX(5px)",
                    },
                    fontSize: "0.95rem",
                  }}
                >
                  {item.text}
                </Link>
              ))}
            </Box>
          </Grid>

          <Box>
            {/* Contact Details Section */}

            <Box sx={{ mt: 1, mr: 6, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Phone sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
                <Link
                  href="tel:+917449213799"
                  color="#b0bec5"
                  underline="hover"
                >
                  +91 7449213799
                </Link>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn
                  sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }}
                />
                <Typography variant="body2" color="#b0bec5">
                  Chennai, India
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ color: "#ffba00", mb: 2, fontSize: "1rem" }}
              >
                Want to "ADVERTISE YOUR BRAND" on www.MrFranchise.in?
              </Typography>
              <Typography variant="body1" color="#b0bec5">
                Mail to{" "}
                <Link
                  href="mailto:sales@mrfranchise.in"
                  color="primary.main"
                  underline="hover"
                >
                  sales@mrfranchise.in
                </Link>
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ color: "#ffba00", mb: 2, fontSize: "1rem" }}
              >
                Want to "START A FOOD AND BEVERAGE BUSINESS" and need support?
              </Typography>
              <Typography variant="body1" color="#b0bec5">
                Mail to{" "}
                <Link
                  href="mailto:investor@mrfranchise.in"
                  color="primary.main"
                  underline="hover"
                >
                  investor@mrfranchise.in
                </Link>
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ color: "#ffba00", mb: 2, fontSize: "1rem" }}
              >
                Want to "CHANGE YOUR LISTING INFORMATION" on www.MrFranchise.in?
              </Typography>
              <Typography variant="body1" color="#b0bec5">
                Mail to{" "}
                <Link
                  href="mailto:support@mrfranchise.in"
                  color="primary.main"
                  underline="hover"
                >
                  support@mrfranchise.in
                </Link>
              </Typography>
            </Box>
          </Box>

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
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Newsletter
            </Typography>
            <Typography variant="body2" color="#b0bec5" mb={2}>
              Subscribe to our newsletter for the latest franchise opportunities
              and industry insights.
            </Typography>

            {successMsg && (
              <Box
                sx={{
                  position: "fixed",
                  top: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: response ? "green" : "red",
                  color: "white",
                  border: "1px solid #c3e6cb",
                  borderRadius: "8px",
                  padding: "8px 40px",
                  fontSize: "0.95rem",
                  zIndex: 1300,
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                {successMsg}
              </Box>
            )}

            <Box component="form" sx={{ display: "flex", mb: 3 }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                style={{
                  flex: 1,
                  padding: "12px 15px",
                  border: "none",
                  borderRadius: "4px 0 0 4px",
                  fontSize: "0.95rem",
                  backgroundColor: "#1e3a5c",
                  color: "#fff",
                  outline: "none",
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  borderRadius: "0 4px 4px 0",
                  backgroundColor: "#ff6d00",
                  "&:hover": {
                    backgroundColor: "#ff8500",
                  },
                  px: 3,
                  textTransform: "none",
                }}
                onClick={handleSubscribe}
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
                  { icon: <Instagram />, color: "#E1306C" },
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      backgroundColor: `${social.color}20`,
                      color: social.color,
                      "&:hover": {
                        backgroundColor: `${social.color}30`,
                      },
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
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: "1px solid #1e3a5c",
          }}
        >
          <Typography
            variant="body2"
            color="#b0bec5"
            sx={{ fontSize: "0.85rem", mb: { xs: 2, sm: 0 } }}
          >
            © 2025 MrFranchise.in. All Rights Reserved.
          </Typography>

          <IconButton
            onClick={scrollToTop}
            sx={{
              backgroundColor: "#ff6d00",
              color: "white",
              "&:hover": {
                backgroundColor: "#ff8500",
              },
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
