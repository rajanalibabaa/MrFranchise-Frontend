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

  const variant = {
    hidden: { opacity: 0, x: reverse && !isMobile ? 100 : -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  };
  return (
    <Box
      component={motion.div}
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      sx={{
        py: { xs: 4, md: 6 },
        px: { xs: 1, md: 4 },
        background: reverse
          ? 'linear-gradient(120deg, #fff 80%, #e3f2fd 100%)'
          : 'linear-gradient(120deg, #f8faff 80%, #e3f2fd 100%)',
        borderRadius: 3,
        mb: 4,
        boxShadow: 2,
        transition: 'box-shadow 0.3s, transform 0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px) scale(1.01)',
        },
      }}
    >
      <Grid container spacing={4} direction={reverse && !isMobile ? 'row-reverse' : 'row'} alignItems="center">
        <Grid item xs={12} md={5}>
          <Box textAlign="center">
            {icon}
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#ffba00', fontWeight:"bold" }}
            // sx={{
            //   // background: 'linear-gradient(45deg, #1976d2 0%, #4dabf5 100%)',
            //   WebkitBackgroundClip: 'text',
            //   WebkitTextFillColor: 'transparent'
            // }}
          >
            {title}
          </Typography>
          <List>
            {items.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
<CheckCircleIcon sx={{ color: '#7ad03a' }} />                </ListItemIcon>
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
          py: { xs: 6, md: 10 },
          px: 2,
          textAlign: 'center',
          color: 'white',
          // background: 'linear-gradient(90deg, #1976d2 0%, #4dabf5 100%)',
          borderRadius: 4,
          // boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
          // mb: 6,
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: -80,
            left: -80,
            width: 200,
            height: 200,
            // background: 'radial-gradient(circle, #ffba00 0%, transparent 70%)',
            opacity: 0.25,
            zIndex: 0,
          },
          '& .MuiContainer-root': { position: 'relative', zIndex: 1 }
        }}
      >
        <Container>
          <Typography variant="h3" fontWeight="bold" gutterBottom color="#ffba00">
            Expand Your Brand
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: 'black', opacity: 0.95 }}>
            Transform your business into a powerful franchise with MrFranchise.in
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, color: 'black', maxWidth: 600, mx: 'auto' }}>
            Ready to scale? We bring expertise, structure, and investor connections to help your brand grow regionally and nationally.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container sx={{
        // py: 5,
        maxWidth: 900,
        mx: 'auto',
        position: 'relative'
      }}>

        {/* Why Franchise & Who Is This For */}
        <Section
          title="Why Franchise Your Business?"
          icon={<BusinessIcon sx={{
            fontSize: 80,
            color: '#ffba00',
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
        />

     
       {/* What We Do Heading */}
<Box
  component={motion.div}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.7 }}
  sx={{
    mb: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    // background: 'linear-gradient(90deg, #e3f2fd 0%, #fff 100%)',
    borderRadius: 3,
    py: 2,
    // boxShadow: 1,
  }}
>
  <BuildCircleIcon color="primary" sx={{
    fontSize: 44,
    color: '#ffba00',
    // filter: 'drop-shadow(0 4px 6px rgba(25, 118, 210, 0.3))'
  }} />
  <Typography variant="h4" fontWeight="bold" sx={{
    background: 'linear-gradient(45deg, #ffba00 0%, #7ad03a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 4px 6px rgba(25, 118, 210, 0.1)'
  }}>
    What We Do
  </Typography>
</Box>

{/* What We Do Boxes */}
{/* What We Do Boxes */}
<Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
  {/* First Row: 3 boxes */}
  <Grid item xs={12} md={4}>
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      sx={{
  p: 3,
  borderRadius: 3,
  background: 'white',
  boxShadow: 2,
  height: '100%',
  minHeight: 180,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  transition: 'box-shadow 0.3s, transform 0.3s, background 0.3s',
 '&:hover': {
  boxShadow: 8,
  transform: 'translateY(-8px) scale(1.03)',
  background: 'linear-gradient(120deg, #fffbe7 60%, #ffba00 100%)',
},
}}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        1. Strategic Franchise Planning
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Business model evaluation" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Franchise structure, roles" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Territory & training setup" />
        </ListItem>
      </List>
    </Box>
  </Grid>
  <Grid item xs={12} md={4}>
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      sx={{
  p: 3,
  borderRadius: 3,
  background: 'white',
  boxShadow: 2,
  height: '100%',
  minHeight: 180,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  transition: 'box-shadow 0.3s, transform 0.3s, background 0.3s',
  '&:hover': {
  boxShadow: 8,
  transform: 'translateY(-8px) scale(1.03)',
  background: 'linear-gradient(120deg, #fffbe7 60%, #ffba00 100%)',
},
}}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        2. Legal & Financial Documentation
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Franchise Agreement" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Franchise Disclosure Document (FDD)" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="SOPs and brand guidelines" />
        </ListItem>
      </List>
    </Box>
  </Grid>
  <Grid item xs={12} md={4}>
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      sx={{
  p: 3,
  borderRadius: 3,
  background: 'white',
  boxShadow: 2,
  height: '100%',
  minHeight: 180,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  transition: 'box-shadow 0.3s, transform 0.3s, background 0.3s',
  '&:hover': {
  boxShadow: 8,
  transform: 'translateY(-8px) scale(1.03)',
  background: 'linear-gradient(120deg, #fffbe7 60%, #ffba00 100%)',
},
}}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        3. Franchise Kit & Investor Pitch Deck
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Visual brand pitch" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Unit economics & ROI projections" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Franchisee onboarding workflow" />
        </ListItem>
      </List>
    </Box>
  </Grid>

  {/* Second Row: 2 boxes, centered */}
  <Grid item xs={false} md={2} />
  <Grid item xs={12} md={4}>
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      sx={{
  p: 3,
  borderRadius: 3,
  background: 'white',
  boxShadow: 2,
  height: '100%',
  minHeight: 180,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  transition: 'box-shadow 0.3s, transform 0.3s, background 0.3s',
  '&:hover': {
  boxShadow: 8,
  transform: 'translateY(-8px) scale(1.03)',
  background: 'linear-gradient(120deg, #fffbe7 60%, #ffba00 100%)',
},
}}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        4. Brand Promotion & Investor Outreach
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Franchise listing on MrFranchise.in" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Targeted investor lead generation" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="WhatsApp & CRM- integrated communications" />
        </ListItem>
      </List>
    </Box>
  </Grid>
  <Grid item xs={12} md={4}>
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.4 }}
     sx={{
  p: 3,
  borderRadius: 3,
  background: 'white',
  boxShadow: 2,
  height: '100%',
  minHeight: 180,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  transition: 'box-shadow 0.3s, transform 0.3s, background 0.3s',
 '&:hover': {
  boxShadow: 8,
  transform: 'translateY(-8px) scale(1.03)',
  background: 'linear-gradient(120deg, #fffbe7 60%, #ffba00 100%)',
},
}}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        5. Franchisee Screening & Growth Support
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Shortlisting qualified leads" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Initial interviews & support" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleIcon sx={{ color: '#7ad03a' }} />
          </ListItemIcon>
          <ListItemText primary="Regional expansion planning" />
        </ListItem>
      </List>
    </Box>
  </Grid>
  <Grid item xs={false} md={2} />
</Grid>

        {/* Team Intro */}
        <Card variant="outlined" sx={{
          borderRadius: 3,
          marginTop: 10,
          mb: 5,
          p: { xs: 2, md: 4 },
          transition: 'all 0.3s',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
          position: 'relative',
          overflow: 'visible',
          border: '1px solid #e3eafc',
          boxShadow: 2,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 24px rgba(25, 118, 210, 0.15)'
          },
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#7ad03a'
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
              Under the leadership of <strong >Suresh Muthuvel</strong>, senior franchise consultant and CEO of MrFranchise,
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