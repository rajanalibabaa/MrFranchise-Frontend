// ExpandYourBrand.jsx

import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Link,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Email,
  Phone,
 
} from '@mui/icons-material';
import Navbar from '../../Navbar/NavBar';
import Footer from '../Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import BuildCircleIcon from '@mui/icons-material/Build';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, icon, items, reverse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        backgroundColor: reverse ? 'background.paper' : 'grey.100',
        borderRadius: 3,
        mb: 4,
      }}
    >
      <Grid container spacing={4} direction={reverse && !isMobile ? 'row-reverse' : 'row'} alignItems="center">
        <Grid item xs={12} md={5}>
          <Box textAlign="center">
            {icon}
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <List>
            {items.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};

const ExpandYourBrand = () => {
  const navigate = useNavigate();
  return (
    <Box>
      {/* Fixed Navbar */}
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
        <Navbar />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          mt: 8,
          py: 8,
          px: 2,
          textAlign: 'center',
          // background: 'linear-gradient(to right, #1976d2, #004ba0)',
          color: 'black',
        }}
      >
        <Container >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Expand Your Brand
          </Typography>
          <Typography variant="h5" gutterBottom>
            Transform your business into a powerful franchise with MrFranchise.in
          </Typography>
          <Typography variant="body1" sx={{  opacity: 0.9 }}>
            Ready to scale? We bring expertise, structure, and investor connections to help your brand grow regionally and nationally.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
    <Container sx={{ 
  py: 10, 
  maxWidth: 900, 
  mx: 'auto',
  background: 'linear-gradient(to bottom, #f8faff 0%, #ffffff 30%)',
  position: 'relative'
}}>

  {/* Why Franchise & Who Is This For */}
  <Section
    title="Why Franchise Your Business?"
    icon={<BusinessIcon sx={{ 
      fontSize: 80, 
      color: 'primary.main',
      mr: 2,
      transition: 'transform 0.3s',
      ':hover': { transform: 'scale(1.1)' }
    }} />}
    items={[
      'Multiply your presence across locations',
      'Build brand equity and recognition',
      'Generate recurring franchise income',
      'Attract investor capital without dilution',
    ]}
    sx={{ 
      mb: 8,
      p: 4,
      borderRadius: 4,
      transition: 'all 0.3s',
      ':hover': {
        boxShadow: 3,
        transform: 'translateY(-5px)'
      }
    }}
  />

  <Section
    title="Who Is This For?"
    icon={<GroupsIcon sx={{ 
      fontSize: 80, 
      color: 'primary.main', 
      mr: 2,
      transition: 'transform 0.3s',
      ':hover': { transform: 'rotate(-15deg)' }
    }} />}
    items={[
      'Business owners ready to grow beyond one location',
      'Regional brands aiming to enter new cities or states',
      'Startups with a proven concept and scalable model',
      'Professionals looking to replicate a niche service business',
    ]}
    reverse
    sx={{ 
      mb: 8,
      p: 4,
      borderRadius: 4,
      transition: 'all 0.3s',
      ':hover': {
        boxShadow: 3,
        transform: 'translateY(-5px)'
      }
    }}
  />

  {/* What We Do Heading */}
  <Box sx={{ 
    mb: 5, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 2,
    animation: 'bounce 2s infinite'
  }}>
    <BuildCircleIcon color="primary" sx={{ 
      fontSize: 44,
      filter: 'drop-shadow(0 4px 6px rgba(25, 118, 210, 0.3))'
    }} />
    <Typography variant="h4" fontWeight="bold" sx={{
      background: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 4px 6px rgba(25, 118, 210, 0.1)'
    }}>
      What We Do
    </Typography>
  </Box>

  {/* Individual Sections */}
  <Section
  title="1. Strategic
Franchise Planning"
  // icon={<CheckCircleIcon sx={{ 
  //   fontSize: 52,
  //   color: 'primary.main',
  //   mr: 2,
  //   transition: 'transform 0.3s',
  //   ':hover': { transform: 'rotate(360deg)' }
  // }} />}
  items={['Business model evaluation', 'Franchise structure, roles', 'Territory & training setup']}
  reverse={false}
  sx={{ 
    mb: 6,
    p: 3,
    borderRadius: 3,
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.03)',
      transform: 'scale(1.02)'
    },
    '& .MuiTypography-h6': {
      background: 'linear-gradient(45deg, #1976d2 0%, #4dabf5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }}
/>

<Section
  title="2. Legal &
Financial Documentation"
  // icon={<CheckCircleIcon sx={{ 
  //   fontSize: 52,
  //   color: 'primary.main',
  //   mr: 2,
  //   transition: 'transform 0.3s',
  //   ':hover': { transform: 'rotate(360deg)' }
  // }} />}
  items={['Franchise Agreement', 'Franchise Disclosure Document (FDD)', 'SOPs and brand guidelines']}
  reverse={true}
  sx={{ 
    mb: 6,
    p: 3,
    borderRadius: 3,
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.03)',
      transform: 'scale(1.02)'
    },
    '& .MuiTypography-h6': {
      background: 'linear-gradient(45deg, #1976d2 0%, #4dabf5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }}
/>

<Section
  title=" 3. Franchise
Kit & Investor Pitch Deck"
  // icon={<CheckCircleIcon sx={{ 
  //   fontSize: 52,
  //   color: 'primary.main',
  //   mr: 2,
  //   transition: 'transform 0.3s',
  //   ':hover': { transform: 'rotate(360deg)' }
  // }} />}
  items={['Visual brand pitch', 'Unit economics & ROI projections', 'Franchisee onboarding workflow']}
  reverse={false}
  sx={{ 
    mb: 6,
    p: 3,
    borderRadius: 3,
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.03)',
      transform: 'scale(1.02)'
    },
    '& .MuiTypography-h6': {
      background: 'linear-gradient(45deg, #1976d2 0%, #4dabf5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }}
/>

<Section
  title=" 4. Brand
Promotion & Investor Outreach"
  // icon={<CheckCircleIcon sx={{ 
  //   fontSize: 52,
  //   color: 'primary.main',
  //   mr: 2,
  //   transition: 'transform 0.3s',
  //   ':hover': { transform: 'rotate(360deg)' }
  // }} />}
  items={['Franchise listing on MrFranchise.in', 'Targeted investor lead generation', 'WhatsApp & CRM- integrated communications']}
  reverse={true}
  sx={{ 
    mb: 6,
    p: 3,
    borderRadius: 3,
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.03)',
      transform: 'scale(1.02)'
    },
    '& .MuiTypography-h6': {
      background: 'linear-gradient(45deg, #1976d2 0%, #4dabf5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }}
/>

<Section
  title=" 5. Franchisee
Screening & Growth Support"
  // icon={<CheckCircleIcon sx={{ 
  //   fontSize: 52,
  //   color: 'primary.main',
  //   mr: 2,
  //   transition: 'transform 0.3s',
  //   ':hover': { transform: 'rotate(360deg)' }
  // }} />}
  items={['Shortlisting qualified leads', 'Initial interviews & support', 'Regional expansion planning']}
  reverse={false}
  sx={{ 
    mb: 6,
    p: 3,
    borderRadius: 3,
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.03)',
      transform: 'scale(1.02)'
    },
    '& .MuiTypography-h6': {
      background: 'linear-gradient(45deg, #1976d2 0%, #4dabf5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }
  }}
/>


  {/* Team Intro */}
  <Card variant="outlined" sx={{
    borderRadius: 3,
    mb: 8,
    p: 4,
    transition: 'all 0.3s',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
    position: 'relative',
    overflow: 'visible',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 24px rgba(25, 118, 210, 0.15)'
    },
    '::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 3,
      padding: 2,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude'
    }
  }}>
    <CardContent>
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: 'primary.main'
      }}>
        <Box component="span" sx={{ 
          fontSize: 28,
          filter: 'drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3))'
        }}>
          🧑💼
        </Box>
        Led by Experts, Built for Scale
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        Under the leadership of <strong sx={{
          // background: 'linear-gradient(45deg, #1976d2 0%, #4dabf5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Suresh Muthuvel</strong>, senior franchise consultant and CEO of MrFranchise,
        we've helped businesses across Tamil Nadu grow into successful multi-location franchises.
      </Typography>
    </CardContent>
  </Card>

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
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '2px solid #FF6F00',
            boxShadow: '0 12px 32px rgba(255, 111, 0, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 16px 40px rgba(255, 111, 0, 0.5)',
            },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ color: '#FF6F00', mb: 2 }}
          >
            📞 Ready to Expand?
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Take the first step toward structured growth. Let our experts build your franchise model and connect you with serious investors.
          </Typography>

          <Typography variant="body1" sx={{ color: 'black', mb: 1 }}>
            <Phone sx={{ verticalAlign: 'middle', mr: 1 }} />
            <Link href="tel:+919841323388" color="#FF6F00" underline="hover">
              Phone: +91 98413 23388
            </Link>
          </Typography>

          <Typography variant="body1" sx={{ color: 'black', mb: 3 }}>
            <Email sx={{ verticalAlign: 'middle', mr: 1 }} />
            <Link href="mailto:ceo@MrFranchise.in" color="#FF6F00" underline="hover">
              Email: ceo@MrFranchise.in
            </Link>
          </Typography>

          <Button
            variant="contained"
            sx={{ backgroundColor: '#FF6F00', px: 4, py: 1.5, fontWeight: 'bold' }}
            onClick={() => navigate('/brandlistingform')}
          >
            ADD BRAND LISTING
          </Button>
        </Box>
      </motion.div>
    </Container>

      {/* Footer */}
      <Box sx={{ mt: 6, backgroundColor: 'background.default', py: 4 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default ExpandYourBrand;
