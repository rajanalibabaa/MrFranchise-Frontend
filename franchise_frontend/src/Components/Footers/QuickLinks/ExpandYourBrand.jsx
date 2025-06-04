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
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Button, Card, CardContent } from '@mui/material';

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
const Section = ({ title, icon, items }) => (
  <Box mb={4}>
    <Typography
      variant="h6"
      fontWeight="bold"
      gutterBottom
      sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
    >
      {icon}
      <Box ml={1}>{title}</Box>
    </Typography>
    <Stack spacing={1} pl={4}>
      <Chip label={items[0]} variant="outlined" color="primary" />
      <Chip label={items[1]} variant="outlined" color="primary" />
      <Chip label={items[2]} variant="outlined" color="primary" />
      <Chip label={items[3]} variant="outlined" color="primary" />
    </Stack>
  </Box>
);


const ExpandYourBrand = () => {
  return (
    <Box>
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
        <Navbar />
      </Box>
     <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Expand Your Brand
        </Typography>
        <Typography variant="h5" gutterBottom>
          Transform Your Business into a Scalable Franchise with MrFranchise.in
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={2}>
          Are you running a successful business and ready to take it to the next level?
          At MrFranchise.in, we help you expand strategically, professionally, and profitably.
        </Typography>
      </Box>

      {/* Why Franchise */}
      <Section
        title="🔹 Why Franchise Your Business?"
        icon={<BusinessIcon color="primary" />}
        items={[
          'Multiply your presence across locations',
          'Build brand equity and recognition',
          'Generate recurring franchise income',
          'Attract investor capital without dilution',
        ]}
      />

      {/* Who Is This For */}
      <Section
        title="🔹 Who Is This For?"
        icon={<GroupsIcon color="primary" />}
        items={[
          'Business owners ready to grow beyond one location',
          'Regional brands aiming to enter new cities or states',
          'Startups with a proven concept and scalable model',
          'Professionals looking to replicate a niche service business',
        ]}
      />

      {/* What We Do */}
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <BuildCircleIcon color="primary" sx={{ mr: 1 }} />
        ⚙️ What We Do
      </Typography>
      <Section
        title="1. Strategic Franchise Planning"
        icon={<CheckCircleIcon />}
        items={[
          'Business model evaluation',
          'Franchise structure, revenue models & roles',
          'Territory, training, and support setup',
        ]}
      />
      <Section
        title="2. Legal & Financial Documentation"
        icon={<CheckCircleIcon />}
        items={[
          'Franchise Agreement',
          'Franchise Disclosure Document (FDD)',
          'SOPs and brand guidelines',
        ]}
      />
      <Section
        title="3. Franchise Kit & Investor Pitch Deck"
        icon={<CheckCircleIcon />}
        items={[
          'Visual brand pitch',
          'Unit economics & ROI projections',
          'Franchisee onboarding workflow',
        ]}
      />
      <Section
        title="4. Brand Promotion & Investor Outreach"
        icon={<CheckCircleIcon />}
        items={[
          'Franchise listing on MrFranchise.in',
          'Targeted investor lead generation',
          'WhatsApp & CRM-integrated communications',
        ]}
      />
      <Section
        title="5. Franchisee Screening & Growth Support"
        icon={<CheckCircleIcon />}
        items={[
          'Shortlisting qualified leads',
          'Initial interviews & support',
          'Regional expansion planning',
        ]}
      />

      {/* Team Section */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧑‍💼 Led by Experts, Built for Scale
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Under the leadership of <strong>Suresh Muthuvel</strong>, senior franchise consultant and CEO of MrFranchise,
            we’ve helped businesses across Tamil Nadu grow into successful multi-location franchises.
          </Typography>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Box textAlign="center" mt={6}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📞 Ready to Expand?
        </Typography>
        <Typography variant="body1" mb={3}>
          Let our experts build your franchise model and connect you with serious investors.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary" size="large" startIcon={<PhoneIcon />}>
              Call Now: +91 98413 23388
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" size="large" startIcon={<EmailIcon />}>
              Email: ceo@MrFranchise.in
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" size="large">
              Add Your Brand Listing
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
      <Box sx={{ mt: 6, backgroundColor: 'background.default', py: 4 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default ExpandYourBrand;