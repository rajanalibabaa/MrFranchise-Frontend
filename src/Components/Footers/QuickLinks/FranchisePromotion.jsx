import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Chip,
  Divider
} from "@mui/material";
import Navbar from '../../Navbar/NavBar';
import Footer from '../Footer';

const cardStyle = {
  borderRadius: 4,
  boxShadow: 4,
  background: "linear-gradient(120deg, #fffbe7 90%, #f9fafb 100%)",
  p: 3,
  minHeight: 340,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  transition: "box-shadow 0.3s, transform 0.3s",
  "&:hover": {
    boxShadow: 10,
    transform: "translateY(-8px) scale(1.03)",
    background: "linear-gradient(120deg, #fffbe7 60%, #ffecb3 100%)",
  },
};

const FranchisePromotion = () => {
  return (
    <Box>
      {/* Fixed Navbar */}
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
        <Navbar />
      </Box>
      <Container
        sx={{
          py: 4,
          borderRadius: 4,
          mt: 15,
          mb: 6,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: "#ff9800",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Franchise Promotion & Lead Distribution Packages
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "black", textAlign: "center", mb: 2 }}
        >
          Built for Food & Beverage Brands. Powered by MrFranchise.in
        </Typography>
        <Typography sx={{ mb: 4, textAlign: "center", color: "#444" }}>
          Our packages are designed to give brands maximum control over lead
          quality, volume, and visibility — whether you want exclusive investor
          enquiries, shared leads, or unlimited growth campaigns.
        </Typography>

        <Grid container spacing={4}>
          {/* Starter Plan */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardStyle}>
              <Chip label="Starter" color="primary" sx={{ mb: 2, fontWeight: 600 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2" }}>
                🔰 Starter Visibility Plan
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#ff9800", mb: 1 }}>
                ₹15,000 / Month
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ mb: 1 }}>
                <strong>Best for:</strong> Entry-level brands testing market demand
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Lead Type:</strong> Shared Leads (non-exclusive)
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                <li>Branded listing on fnb.MrFranchise.in</li>
                <li>Appear in "All F&B Brands" section</li>
                <li>Visible to all investor filters</li>
                <li>Shared investor leads (up to 15/month)</li>
                <li>Email/WhatsApp inclusion in 1 investor campaign</li>
                <li>CRM access for lead tracking</li>
                <li>Standard brand analytics report</li>
              </ul>
            </Paper>
          </Grid>

          {/* Growth Lead Plan */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardStyle}>
              <Chip label="Growth" sx={{ mb: 2, background: "#ff9800", color: "#fff", fontWeight: 600 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#ff9800" }}>
                🟠 Growth Lead Plan
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#ff9800", mb: 1 }}>
                ₹35,000 / Month
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ mb: 1 }}>
                <strong>Best for:</strong> Active growth-stage brands with a proven model
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Lead Type:</strong> Priority Shared Leads (rotated among 2–4 advertisers)
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                <li>Priority visibility in category-based searches (e.g., Café, QSR)</li>
                <li>Dedicated brand page with video, gallery, and pitch deck</li>
                <li>Up to 30+ leads/month from shared investor pool</li>
                <li>WhatsApp Broadcast Inclusion – 2 campaigns</li>
                <li>Brand featured in email newsletters</li>
                <li>Investor follow-up support (semi-automated)</li>
                <li>CRM & lead tracking dashboard</li>
              </ul>
            </Paper>
          </Grid>

          {/* Premium Visibility + Lead Share */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardStyle}>
              <Chip label="Premium" sx={{ mb: 2, background: "#f57c00", color: "#fff", fontWeight: 600 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#f57c00" }}>
                🔶 Premium Visibility + Lead Share
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#f57c00", mb: 1 }}>
                ₹60,000 / Month
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ mb: 1 }}>
                <strong>Best for:</strong> Established brands looking for scale + smart visibility
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Lead Type:</strong> All Leads in Category (Shared)
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                <li>Featured Brand Spotlight on homepage + “Top Brands” carousel</li>
                <li>Listed in 2+ investor segments (e.g., ₹10–20L & ₹20–50L)</li>
                <li>Brand priority in shared lead distribution</li>
                <li>Unlimited shared leads (all investor applications in category)</li>
                <li>2 WhatsApp + 2 Meta Ad Campaigns</li>
                <li>Brand Boost email blast to 10,000+ subscribers</li>
                <li>Dedicated success manager</li>
              </ul>
            </Paper>
          </Grid>

          {/* Exclusive Lead Partner */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardStyle}>
              <Chip label="Exclusive" sx={{ mb: 2, background: "#388e3c", color: "#fff", fontWeight: 600 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#388e3c" }}>
                🟢 Exclusive Lead Partner
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#388e3c", mb: 1 }}>
                ₹1,20,000 / Month
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ mb: 1 }}>
                <strong>Best for:</strong> High-ticket F&B brands seeking exclusive investor targeting
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Lead Type:</strong> Exclusive Leads Only
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                <li>Exclusive visibility in targeted campaigns (location + budget based)</li>
                <li>All investor leads from those campaigns routed only to your brand</li>
                <li>Landing page + standalone lead funnel with ad optimization</li>
                <li>4 WhatsApp Campaigns + Dedicated Meta & Google Ad Campaign</li>
                <li>Investor qualification support (via phone/WhatsApp team)</li>
                <li>Custom reports + weekly lead summary</li>
                <li>Monthly strategy session with senior consultant</li>
              </ul>
            </Paper>
          </Grid>

          {/* Custom Performance-Based Plan */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={cardStyle}>
              <Chip label="Performance" sx={{ mb: 2, background: "#7b1fa2", color: "#fff", fontWeight: 600 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#7b1fa2" }}>
                🏆 Custom Performance-Based Plan
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#7b1fa2", mb: 1 }}>
                ₹2L to ₹5L+ (One-Time or Quarterly)
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ mb: 1 }}>
                <strong>Best for:</strong> Brands seeking full-service franchise expansion
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Lead Type:</strong> Performance-based, full-service
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#444" }}>
                <li>Franchise Blueprint (Docs, Kit, Strategy)</li>
                <li>Website Microsite + CRM</li>
                <li>Performance-focused ad campaigns</li>
                <li>100+ verified investor leads (guaranteed within campaign cycle)</li>
                <li>Full end-to-end lead follow-up support</li>
                <li>Master franchise pitching support</li>
                <li>NRI and VC investor outreach (upon request)</li>
              </ul>
            </Paper>
          </Grid>
        </Grid>

        <Box
          textAlign="center"
          sx={{
            mt: 6,
            background: "linear-gradient(90deg, #fffbe7 60%, #fff 100%)",
            borderRadius: 3,
            boxShadow: 1,
            py: 3,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#ff9800" }}>
            📞 Ready to Expand with Results?
          </Typography>
          <Typography sx={{ color: "#1976d2" }}>
            👉 Book a demo with our Franchise Marketing Team
          </Typography>
          <Typography sx={{ mt: 1, color: "#444" }}>
            📧 <strong>Email:</strong> ceo@MrFranchise.in
          </Typography>
          <Typography sx={{ color: "#444" }}>
            📞 <strong>Phone:</strong> +91 98413 23388
          </Typography>
          <Typography sx={{ color: "#444" }}>
            🌐 <strong>Visit:</strong>{" "}
            <a
              href="https://fnb.mrfranchise.in/advertise"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", fontWeight: "bold" }}
            >
              fnb.MrFranchise.in/advertise
            </a>
          </Typography>
        </Box>
      </Container>
      <Box sx={{ mt: 6, backgroundColor: 'background.default', py: 4 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default FranchisePromotion;