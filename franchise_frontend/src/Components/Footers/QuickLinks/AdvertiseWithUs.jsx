import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Paper,
  Box,
  Link,
  Fade,
  Divider,
 
} from '@mui/material';
import {
  CheckCircleOutline,
  Image,
  VideoCameraBack,
  Search,
  Email,
  Campaign,
  Groups,
  Business,
  Download,
  Phone,
  Language,
 
} from '@mui/icons-material';
import { Link as RouterLink } from "react-router-dom";
import { motion } from 'framer-motion'; 
import Navbar from "../../Navbar/NavBar";
import Footer from "../Footer";

const SectionDivider = ({ icon, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 6 }}>
    <Divider sx={{ flexGrow: 1, borderColor: '#7ad03a' }} />
    <Box
      sx={{
        mx: 2,
        display: 'flex',
        alignItems: 'center',
        color: 'inherit',
      }}
    >
      {/* Icon with green color */}
      <Box sx={{ color: '#7ad03a', display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      {/* Label text with dark color */}
      <Typography variant="h5" sx={{ ml: 1, fontWeight: 600, color: '#ffba00' }}>
        {label}
      </Typography>
    </Box>
    <Divider sx={{ flexGrow: 1, borderColor: '#7ad03a' }} />
  </Box>
);
const fadeInVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const AdvertiseWithUs = () => {
  return (
    <Box>
      <Box><Navbar /></Box>
      <Container>
        {/* Hero Section */}
        <Box
          component={motion.div}
          variants={fadeInVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Typography variant="h3" mt={5} align="center" fontWeight="bold" color='#ffba00'>
            Advertise with MrFranchise.in
          </Typography>
          <Typography variant="h6" align="center" color='#8e8e8e' mb={3} fontWeight={300}>
            Reach Business Owners · Engage Serious Investors · Grow Your Brand
          </Typography>
        </Box>

      {/* Introduction */}
       <Box
          component={motion.div}
          variants={fadeInVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Typography
            variant="body1"
            paragraph
            sx={{ mb: 4, fontSize: '1.15rem', lineHeight: 1.9, textAlign: 'center', color: "black" }}
          >
            <Link component={RouterLink} to="/" underline="hover" color="black" fontWeight="bold">
              MrFranchise.in
            </Link> is South India's fastest-growing franchise consulting and investment platform – a trusted destination where entrepreneurs, brand owners, and investors discover scalable business opportunities. By advertising
            with us, you position your brand directly in front of decision-makers —
            from aspiring franchisees to seasoned investors, working professionals, and
            NRIs looking to invest in profitable brands.
          </Typography>
        </Box>

      {/* Why Advertise */}
      <Box
          component={motion.div}
          variants={fadeInVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <SectionDivider icon={<CheckCircleOutline />} label="Why Advertise on MrFranchise.in?" />
          <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} mx="auto">
          <List>
            <ListItem disableGutters>
              <ListItemIcon sx={{ color: '#7ad03a' }}>
                <CheckCircleOutline />
              </ListItemIcon>
              <ListItemText   primary ="High-Intent Audience - Our visitors are actively seeking to invest, expand, or launch a
franchise business." />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ color: '#7ad03a' }}>
                <CheckCircleOutline />
              </ListItemIcon>
              <ListItemText primary="Regional & Targeted Reach - Focused visibility across Tamil Nadu, Chennai, and
South Indian markets." />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ color: '#7ad03a' }}>
                <CheckCircleOutline />
              </ListItemIcon>
              <ListItemText primary="Multi-Channel Promotion - Website exposure + WhatsApp reach + Meta ads + CRM follow-ups." />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ color: '#7ad03a' }}>
                <CheckCircleOutline />
              </ListItemIcon>
              <ListItemText primary="Brand Positioning Among Verified Investors– Build trust and get quality leads,
not just clicks." />
            </ListItem>
          </List>
        </Grid>
      </Grid>
</Box>
      {/* Advertising Opportunities */}
      <Box
          component={motion.div}
          variants={fadeInVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
      <SectionDivider icon={<Campaign />} label="Advertising Opportunities" />
       <Typography sx={{ mb: 4, fontSize: '1.15rem', lineHeight: 1.9, textAlign: 'center', fontWeight:'bold'}}>We offer a wide
range of ad placements and packages to suit your goals:</Typography>
      <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center',alignItems: 'stretch', mb: 6, mt: 5 }}>
       
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%',display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(145deg, #f0f0f0, #ffffff)', transition: 'all 0.3s ease', '&:hover': { boxShadow: 6, transform: 'translateY(-6px)' } }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ color: 'primary.main', fontSize: 50, mb: 2 }}><Image sx={{color:' #ffba00'}}/></Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Homepage Banner Ads</Typography>
              <Typography variant="body2" color="text.secondary">Gain prime visibility on our homepage<br /> with your brand's banner and CTA.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%',display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(145deg, #f0f0f0, #ffffff)', transition: 'all 0.3s ease', '&:hover': { boxShadow: 6, transform: 'translateY(-6px)' } }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ color: 'primary.main', fontSize: 50, mb: 2 }}><VideoCameraBack sx={{color:' #ffba00'}}/></Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Featured Video Spotlights</Typography>
              <Typography variant="body2" color="text.secondary">Showcase your
promotional videos in top <br/>sections — including Top Brands,<br/>Best
Brands, or City-Specific categories.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%',display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(145deg, #f0f0f0, #ffffff)', transition: 'all 0.3s ease', '&:hover': { boxShadow: 6, transform: 'translateY(-6px)' } }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ color: 'primary.main', fontSize: 50, mb: 2 }}><Search sx={{color:' #ffba00'}}/></Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Search Promotions</Typography>
              <Typography variant="body2" color="text.secondary">Get listed at
the top of investor search results — <br/>boost your exposure to filtered franchise
seekers.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%',display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(145deg, #f0f0f0, #ffffff)', transition: 'all 0.3s ease', '&:hover': { boxShadow: 6, transform: 'translateY(-6px)' } }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ color: 'primary.main', fontSize: 50, mb: 2 }}><Email sx={{color:' #ffba00'}}/></Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>CRM + WhatsApp Inclusion</Typography>
              <Typography variant="body2" color="text.secondary">Your brand
included in our investor<br/> emailers and WhatsApp campaigns.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%',display: 'flex', flexDirection: 'column', borderRadius: 3, background: 'linear-gradient(145deg, #f0f0f0, #ffffff)', transition: 'all 0.3s ease', '&:hover': { boxShadow: 6, transform: 'translateY(-6px)' } }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ color: 'primary.main', fontSize: 50, mb: 2 }}><Campaign sx={{color:' #ffba00'}}/></Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Event Sponsorships</Typography>
              <Typography variant="body2" color="text.secondary">Sponsor
franchise expos, investor<br/> meets, and lead-gen campaigns <br/>with premium
positioning.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
</Box>
      {/* Audience & Advertisers */}
      <Box
          component={motion.div}
          variants={fadeInVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
      <SectionDivider icon={<Groups />} label="Advertisers & Audience" />
      <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Who Can Advertise?
            </Typography>
            <List>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: '#7ad03a' }}><Business /></ListItemIcon>
                <ListItemText primary="Franchise brands seeking visibility" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: '#7ad03a' }}><Business /></ListItemIcon>
                <ListItemText primary="Business service providers" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: '#7ad03a' }}><Business /></ListItemIcon>
                <ListItemText primary="Real estate & legal partners" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: '#7ad03a' }}><Business /></ListItemIcon>
                <ListItemText primary="Investor-focused events" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Our Audience
            </Typography>
            <List>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: '#ffba00' }}><Groups /></ListItemIcon>
                <ListItemText primary="Active investors from Tier 1-3 cities" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: '#ffba00' }}><Groups /></ListItemIcon>
                <ListItemText primary="NRIs seeking Indian opportunities" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: '#ffba00' }}><Groups /></ListItemIcon>
                <ListItemText primary="Professionals & entrepreneurs (25-55)" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ color: '#ffba00' }}><Groups /></ListItemIcon>
                <ListItemText primary="Regional buyers across South India" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
</Box>
      {/* Contact Section */}
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
        <Typography variant="h4" color="#ffba00" fontWeight={700} gutterBottom>
          Partner With Us
        </Typography>
        <Typography sx={{ mb: 3, fontSize: '1.1rem' }}>
Take your brand
visibility to the next level. Whether you're launching a new franchise, expanding
your presence, or offering services to the franchise ecosystem — advertising on{" "}
           <Link component={RouterLink} to="/" underline="hover" color="#0009">
MrFranchise.in</Link> positions you directly in front of the right audience.        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Download />}
            component={Link}
            href="/media-kit.pdf"
            sx={{ borderRadius: 2, color:"white" ,bgcolor: '#ffba00', '&:hover': { bgcolor: '#ffba00' } }}
          >
            Download Media Kit
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, fontSize: '1.1rem' }}>
          <Typography><Phone sx={{ verticalAlign: 'middle', mr: 1 }} /><Link href="tel:+919841323388" color="black" underline="hover">
                    Phone: +91 98413 23388
                  </Link></Typography>
          <Typography><Email sx={{ verticalAlign: 'middle', mr: 1 }} /><Link href="mailto:ceo@MrFranchise.in" color="inherit" underline="hover">
          Email: ceo@MrFranchise.in
        </Link></Typography>
          <Typography><Language sx={{ verticalAlign: 'middle', mr: 1 }} />www.MrFranchise.in/advertise</Typography>
        </Box>
      
      </Box>
      </motion.div>
    </Container>
      <Box sx={{ mt: 6, backgroundColor: "background.default", py: 4 }}><Footer /></Box>
    </Box>
    
  );
};

export default AdvertiseWithUs;
