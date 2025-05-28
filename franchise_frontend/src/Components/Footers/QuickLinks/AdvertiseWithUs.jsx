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


const AdvertiseWithUs = () => {
  return (
    <Box>
      <Box><Navbar /></Box>
      <Container  >
      {/* Hero Section */}
      {/* <Fade in timeout={800}>
        <Paper
          elevation={4}
          sx={{
            p: 5,
            mb: 6,
            borderRadius: 4,
            // background: 'linear-gradient(135deg, #ffba00, #7ad03a)',
            color: 'black',
            textAlign: 'center',
          }}
        > */}
          <Typography variant="h3" mt={5} align="center" fontWeight="bold" >
            Advertise with MrFranchise.in
          </Typography>
          <Typography variant="h6"align="center"  mb={3} fontWeight={300}>
            Reach Business Owners · Engage Serious Investors · Grow Your Brand
          </Typography>
        {/* </Paper>
      </Fade> */}

      {/* Introduction */}
      <Typography
        variant="body1"
        paragraph
        sx={{ mb: 4, fontSize: '1.15rem', lineHeight: 1.9, textAlign: 'center',color:"#0009" }}
      >
           <Link component={RouterLink} to="/" underline="hover" color="black">
  MrFranchise.in</Link> is South India's fastest-growing franchise consulting and investment platform – a trusted destination where entrepreneurs, brand owners, and investors discover scalable business opportunities.By advertising
with us, you position your brand directly in front of decision-makers —
from aspiring franchisees to seasoned investors, working professionals, and
NRIs looking to invest in profitable brands.
      </Typography>

      {/* Why Advertise */}
      <SectionDivider  icon={<CheckCircleOutline />} label="Why Advertise on MrFranchise.in?"  />
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

      {/* Advertising Opportunities */}
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

      {/* Audience & Advertisers */}
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

      {/* Contact Section */}
      <SectionDivider icon={<Phone />} label="Get In Touch" />
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #fafafa, #f5f5f5)',
          borderRadius: 4,
          mt: 6,
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
            sx={{ borderRadius: 2 }}
          >
            Download Media Kit
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Email />}
            component={Link}
            href="mailto:ceo@MrFranchise.in"
            sx={{ borderRadius: 2 }}
          >
            Contact Ad Team
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
      </Paper>
    </Container>
      <Box><Footer /></Box>
    </Box>
    
  );
};

export default AdvertiseWithUs;
