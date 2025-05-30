import React from "react";
import { Box, Typography, Paper, Button, Divider, Grid } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../../Navbar/NavBar";
import Footer from "../Footer";

// Set your preferred font family here
const FONT_FAMILY = "'Poppins', 'Roboto', 'Arial', sans-serif";

const Section = ({ title, children, sx = {}, titleColor = "#ffba00" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7 }}
  >
    <Box my={4} sx={sx}>
      <Typography variant="h6" fontWeight={700} gutterBottom color={titleColor} sx={{ fontFamily: FONT_FAMILY }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ fontFamily: FONT_FAMILY }}>{children}</Box>
    </Box>
  </motion.div>
);


const InvestFranchise = () => {
  return (
    <Box sx={{ fontFamily: FONT_FAMILY, background: "#f9fafb", minHeight: "100vh" }}>
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 10 }}>
        <Navbar />
      </Box>
      <Box p={4} maxWidth="lg" mx="auto" marginTop={12}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typography
            align="center"
            color="#ffba00"
            variant="h4"
            fontWeight={700}
            sx={{ fontFamily: FONT_FAMILY, mb: 1 }}
          >
            Invest in a Franchise
          </Typography>
          <Typography
            align="center"
            variant="h6"
            color="text.secondary"
            marginBottom={4}
            sx={{ fontFamily: FONT_FAMILY }}
          >
            Own a Business. Back a Brand. Grow with Confidence.
          </Typography>
        </motion.div>

        {/* Intro */}
        <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
  >
        <Typography sx={{ fontFamily: FONT_FAMILY, mb: 3, fontSize: "1.1rem", color: "#333" }}>
          Franchise investment is one of the smartest, lowest-risk ways to enter
          entrepreneurship — and MrFranchise.in is your trusted gateway to
          verified, high-potential franchise opportunities across Tamil Nadu and
          beyond. Whether you're a first-time investor, an NRI looking for
          income-based opportunities, or a professional planning to exit the 9–5
          grind — franchising offers you the platform to own a business with
          proven systems and predictable returns.
        </Typography>
        </motion.div>

        {/* Why Invest Section */}
        <Section title="🔹 Why Invest in a Franchise?">
          <Grid sx={{ color: "black", fontSize: 16 }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Proven Business Models – Established brand recognition, tested products/services</li><br/>
              <li>Training & Support – Get trained by the franchisor with ongoing guidance</li><br/>
              <li>Faster ROI – Scalable models with predictable cost structures</li><br/>
              <li>Brand Power – Leverage the strength of a brand with marketing and customer loyalty</li><br/>
              <li>You Own It – Be your own boss while minimizing startup risk</li><br/>
            </ul>
          </Grid>
        </Section>

        {/* What We Offer */}
        <Section title="🔹 What We Offer for Investors">
          <Grid container spacing={3} display="flex" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3, fontFamily: FONT_FAMILY, mb: 2 }}>
                <Typography color="#7ad03a" fontWeight={700} sx={{ fontFamily: FONT_FAMILY }}>
                  🔎 Verified Franchise Opportunities
                </Typography>
                <Typography variant="body2" mt={1} sx={{ fontFamily: FONT_FAMILY }}>
                  <ul>
                    <li>Businesses screened for viability and expansion-readiness.</li><br/>
                    <li>Options in Food & Beverage, Retail, Fashion, Education, Wellness, and more.</li><br/>
                    <li>Listings by investment range and location.</li><br/>
                  </ul>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3, fontFamily: FONT_FAMILY, mb: 2 }}>
                <Typography color="#7ad03a" fontWeight={700} sx={{ fontFamily: FONT_FAMILY }}>
                  🧰 Support Tools & CRM
                </Typography>
                <Typography variant="body2" mt={1} sx={{ fontFamily: FONT_FAMILY }}>
                  <ul>
                    <li>Follow-up and evaluation assistance.</li><br/>
                    <li>Investment pitch kits.</li><br/>
                    <li>WhatsApp and email updates on new listings.</li><br/>
                  </ul>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3, fontFamily: FONT_FAMILY, mb: 2 }}>
                <Typography color="#7ad03a" fontWeight={700} sx={{ fontFamily: FONT_FAMILY }}>
                  📢 Investor Presentations & Franchise Expos
                </Typography>
                <Typography variant="body2" mt={1} sx={{ fontFamily: FONT_FAMILY }}>
                  <ul>
                    <li>Invitation-only pitch sessions with top brands.</li><br/>
                    <li>Franchise events across Chennai and South India.</li><br/>
                    <li>Exclusive NRI investor programs.</li><br/>
                  </ul>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3, fontFamily: FONT_FAMILY, mb: 2 }}>
                <Typography color="#7ad03a" fontWeight={700} sx={{ fontFamily: FONT_FAMILY }}>
                  📝 Investor Advisory & Matching Services
                </Typography>
                <Typography variant="body2" mt={1} sx={{ fontFamily: FONT_FAMILY }}>
                  <ul>
                    <li>1-on-1 investor consultation to understand your goals.</li><br/>
                    <li>Brand recommendations based on risk appetite, geography, and budget.</li><br/>
                    <li>Master franchise & multi-unit opportunities.</li><br/>
                  </ul>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Section>

        {/* Investment Categories */}
        <Section title="📍 Investment Categories You Can Explore">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>₹5–10 Lakhs: Entry-level and kiosk models</li><br/>
            <li>₹10–25 Lakhs: F&B outlets, retail stores, education centers</li><br/>
            <li>₹25 Lakhs+: Master franchises, multi-location rollouts</li><br/>
          </ul>
        </Section>

        {/* Who Can Invest */}
        <Section title="🤝 Who Can Invest?" titleColor="#ffba00">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Working professionals & first-time entrepreneurs</li><br/>
            <li>NRIs looking for India-based business ownership</li><br/>
            <li>Retired executives & family business successors</li><br/>
            <li>Private investors seeking asset-light business models</li><br/>
          </ul>
        </Section>

        {/* Call to Action */}
         <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: 'easeOut',
                      },
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Box
                    sx={{
                      mt: 6,
                      p: { xs: 2, md: 4 },
                      borderRadius: 4,
                      background: 'linear-gradient(120deg, #fffbe7 60%, #fff 100%)',
                      border: '2px solid #FF6F00',
                      boxShadow: '0 12px 32px rgba(255, 186, 0, 0.10)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 16px 40px rgba(255, 186, 0, 0.18)',
                      },
                      textAlign: 'center',
                    }}
                  >
          <Typography variant="h6" fontWeight={700} mb={2} color="#ffba00" sx={{ fontFamily: FONT_FAMILY }}>
            📞 Start Your Franchise Investment Journey
          </Typography>
          <Typography sx={{ fontFamily: FONT_FAMILY }}>
            Partner with MrFranchise.in to invest smart, scale with strategy,
            and grow with confidence.
            <br />
            Let our experts help you find the right opportunity that aligns with
            your budget and business goals.
          </Typography>

          <Box
            mt={3}
            display="flex"
            justifyContent="center"
            gap={2}
            flexWrap="wrap"
          >
            <Button variant="contained" sx={{ background: "#ffba00", color: "#fff", fontWeight: 700, fontFamily: FONT_FAMILY }}>
              Explore Listings Now
            </Button>
            {/* <Button variant="outlined" sx={{ borderColor: "#ffba00", color: "#ffba00", fontWeight: 700, fontFamily: FONT_FAMILY }}>
              Book an Investor Consultation
            </Button> */}
          </Box>

          <Box mt={3}>
            <Typography sx={{ fontFamily: FONT_FAMILY }}>📞 Call: +91 98413 23388</Typography>
            <Typography sx={{ fontFamily: FONT_FAMILY }}>📧 Email: ceo@MrFranchise.in</Typography>
          </Box>
        </Box>
        </motion.div>
      </Box>
      <Box sx={{ mt: 3, backgroundColor: "background.default", py: 4 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default InvestFranchise;