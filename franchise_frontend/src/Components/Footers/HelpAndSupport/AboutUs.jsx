import React from 'react';
import Navbar from '../../Navbar/NavBar';
import Footer from '../Footer';
import { Box, Container, Typography, List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent,Link } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import { Link as RouterLink } from "react-router-dom";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};


const AboutUs = () => {
  const renderList = (items) => (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <CheckCircleIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box>
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
        <Navbar />
      </Box>

      <Box sx={{ pt: 20, pb: 8, background: '#fdfaf4' }}>
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.div variants={fadeInUp}>
              <Typography
                variant="h4"
                fontWeight={700}
                textAlign="center"
                gutterBottom
                sx={{ color: '#ffba00' }}
              >
                 About MrFranchise.in
              </Typography>
              <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
                Strategic Franchise Growth. Expert-Led Execution.
              </Typography>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Typography variant="body1" paragraph>
MrFranchise.in is a leading franchise consulting and brand
expansion platform based in Chennai, specializing in transforming
high-potential businesses into scalable franchise models. Established under the
leadership of Suresh Muthuvel, an experienced business
strategist and franchise consultant, MrFranchise.in serves as a trusted growth
partner for entrepreneurs, SMEs, and emerging regional brands.              </Typography>
            </motion.div>

          <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {/* Our Vision */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)',
                borderRadius: 4,
                boxShadow: 4,
                p: 3,
                height: '100%',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <EmojiObjectsIcon sx={{ color: '#FFB300', fontSize: 32, mr: 1 }} />
                  <Typography variant="h5" fontWeight={600} color="warning.main">
                    Our Vision
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  To be South India’s most trusted and result-oriented franchise consulting firm, enabling structured and scalable business expansion for credible brands.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Our Mission */}
        <Grid item xs={12} md={6}>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)',
                borderRadius: 4,
                boxShadow: 4,
                p: 3,
                height: '100%',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <RocketLaunchIcon sx={{ color: '#FFB300', fontSize: 32, mr: 1 }} />
                  <Typography variant="h5" fontWeight={600} color="warning.main">
                    Our Mission
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  To empower entrepreneurs with strategic planning, operational support, investor access, and franchise marketing systems that convert businesses into sustainable franchise networks.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>

            <motion.div variants={fadeInUp}>
              <Typography variant="h5" fontWeight={600} color="warning.main" gutterBottom>
                ⚙️ Our Core Services
              </Typography>
              {renderList([
                'Strategic Franchise Consulting – Business audits, brand modeling, and expansion frameworks.',
                'Legal & Financial Franchise Documentation – Franchise agreements, FDDs, SOPs, and blueprints.',
                'Investor Marketing & Outreach – Multi-channel campaigns to generate qualified franchise investor leads.',
                'Franchisee Recruitment & CRM Tools – Candidate screening, onboarding, and end-to-end management systems.',
                'Master Franchise & Area Development Consulting – Territory-based growth planning across Tamil Nadu and beyond.',
              ])}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Typography variant="h5" fontWeight={600} color="warning.main" mb={2} gutterBottom>
                🧑‍💼 About Our Founder
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Suresh Muthuvel – Founder & CEO , MrFranchise.in</strong><br />
With over a decade of experience in business strategy, marketing, and
franchise development, Suresh Muthuvel has worked with dozens
of regional brands and entrepreneurs to design scalable, investor-ready
franchise models. His approach combines strategic insight with practical
implementation, enabling real growth for real businesses.              </Typography>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Typography variant="h5" fontWeight={600} color="warning.main" gutterBottom>
                🤝 Who We Serve
              </Typography>
              {renderList([
                'Emerging brands looking to franchise',
                'Business owners aiming to expand across multiple locations',
                'Regional enterprises planning national or master franchise rollouts',
                'Domestic and NRI investors seeking structured franchise opportunities',
              ])}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Typography variant="h5" fontWeight={600} color="warning.main" gutterBottom>
                🔑 Why Choose MrFranchise.in
              </Typography>
              {renderList([
                ' Chennai-based expertise with regional market intelligence',
                ' End-to-end execution: from planning to investor onboarding',
                ' Transparent, goal-oriented engagement model',
                ' Franchise kits, CRM, and growth marketing integrated',
                ' Proven results with multiple success stories across Tamil Nadu',
              ])}
            </motion.div>

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
      📞 Let’s Build Your Franchise Growth Strategy
    </Typography>

    <Typography
      variant="body1"
      textAlign="center"
      sx={{ color: 'text.secondary', mb: 2 }}
    >
      Ready to take your business to the next level? Partner with MrFranchise.in
      and benefit from structured, sustainable franchise expansion led by a trusted
      consulting team.
    </Typography>

    <Typography variant="body1" textAlign="center" sx={{ color: 'black' }}>
      🔗 Visit:
             <Link component={RouterLink} to="/" underline="hover" color="#FF6F00">

        www.MrFranchise.in</Link>
      
      <br />
      📞{' '}
        <Link href="tel:+919841323388" color="black" underline="hover">
          Phone: +91 98413 23388
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
</motion.div>

          </motion.div>
        </Container>
      </Box>

      <Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default AboutUs;
