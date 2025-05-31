import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Stack,
  Chip,
  Divider
} from "@mui/material";
import Navbar from '../../Navbar/NavBar';
import Footer from '../Footer';

const planBoxStyle = {
  borderRadius: 5,
  background: "linear-gradient(120deg, #fffbe7 80%, #e3f2fd 100%)",
  border: "2px solid #ffe082",
  p: { xs: 3, md: 4 },
  minHeight: 340,
  boxShadow: "0 8px 32px rgba(255,186,0,0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  mb: 3,
  transition: "box-shadow 0.3s, transform 0.3s",
  "&:hover": {
    boxShadow: "0 16px 40px rgba(255,186,0,0.18)",
    transform: "translateY(-6px) scale(1.03)",
    borderColor: "#ffba00"
  },
};

const priceStyle = color => ({
  fontWeight: 700,
  fontSize: 22,
  color,
  mb: 1,
  letterSpacing: 1
});

const FranchisePromotion = () => {
  return (
    <Box>
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
            <Box sx={planBoxStyle}>
              <Chip label="Starter" color="primary" sx={{ mb: 2, fontWeight: 600, fontSize: 16 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2", mb: 1 }}>
                🔰 Starter Visibility Plan
              </Typography>
              <Typography sx={priceStyle("#ff9800")}>
                ₹15,000 / Month
              </Typography>
              <Divider sx={{ my: 1, width: "100%" }} />
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Typography sx={{ color: "#444" }}>
                  <b>Best for:</b> Entry-level brands testing market demand
                </Typography>
                <Typography sx={{ color: "#444" }}>
                  <b>Lead Type:</b> Shared Leads (non-exclusive)
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
              </Stack>
            </Box>
          </Grid>

          {/* Growth Lead Plan */}
          <Grid item xs={12} md={6}>
            <Box sx={planBoxStyle}>
              <Chip label="Growth" sx={{ mb: 2, background: "#ff9800", color: "#fff", fontWeight: 600, fontSize: 16 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#ff9800", mb: 1 }}>
                🟠 Growth Lead Plan
              </Typography>
              <Typography sx={priceStyle("#ff9800")}>
                ₹35,000 / Month
              </Typography>
              <Divider sx={{ my: 1, width: "100%" }} />
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Typography sx={{ color: "#444" }}>
                  <b>Best for:</b> Active growth-stage brands with a proven model
                </Typography>
                <Typography sx={{ color: "#444" }}>
                  <b>Lead Type:</b> Priority Shared Leads (rotated among 2–4 advertisers)
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
              </Stack>
            </Box>
          </Grid>

          {/* Premium Visibility + Lead Share */}
          <Grid item xs={12} md={6}>
            <Box sx={planBoxStyle}>
              <Chip label="Premium" sx={{ mb: 2, background: "#f57c00", color: "#fff", fontWeight: 600, fontSize: 16 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#f57c00", mb: 1 }}>
                🔶 Premium Visibility + Lead Share
              </Typography>
              <Typography sx={priceStyle("#f57c00")}>
                ₹60,000 / Month
              </Typography>
              <Divider sx={{ my: 1, width: "100%" }} />
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Typography sx={{ color: "#444" }}>
                  <b>Best for:</b> Established brands looking for scale + smart visibility
                </Typography>
                <Typography sx={{ color: "#444" }}>
                  <b>Lead Type:</b> All Leads in Category (Shared)
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
              </Stack>
            </Box>
          </Grid>

          {/* Exclusive Lead Partner */}
          <Grid item xs={12} md={6}>
            <Box sx={planBoxStyle}>
              <Chip label="Exclusive" sx={{ mb: 2, background: "#388e3c", color: "#fff", fontWeight: 600, fontSize: 16 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#388e3c", mb: 1 }}>
                🟢 Exclusive Lead Partner
              </Typography>
              <Typography sx={priceStyle("#388e3c")}>
                ₹1,20,000 / Month
              </Typography>
              <Divider sx={{ my: 1, width: "100%" }} />
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Typography sx={{ color: "#444" }}>
                  <b>Best for:</b> High-ticket F&B brands seeking exclusive investor targeting
                </Typography>
                <Typography sx={{ color: "#444" }}>
                  <b>Lead Type:</b> Exclusive Leads Only
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
              </Stack>
            </Box>
          </Grid>

          {/* Custom Performance-Based Plan */}
          <Grid item xs={12}>
            <Box sx={planBoxStyle}>
              <Chip label="Performance" sx={{ mb: 2, background: "#7b1fa2", color: "#fff", fontWeight: 600, fontSize: 16 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#7b1fa2", mb: 1 }}>
                🏆 Custom Performance-Based Plan
              </Typography>
              <Typography sx={priceStyle("#7b1fa2")}>
                ₹2L to ₹5L+ (One-Time or Quarterly)
              </Typography>
              <Divider sx={{ my: 1, width: "100%" }} />
              <Stack spacing={1} sx={{ width: "100%" }}>
                <Typography sx={{ color: "#444" }}>
                  <b>Best for:</b> Brands seeking full-service franchise expansion
                </Typography>
                <Typography sx={{ color: "#444" }}>
                  <b>Lead Type:</b> Performance-based, full-service
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
              </Stack>
            </Box>
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