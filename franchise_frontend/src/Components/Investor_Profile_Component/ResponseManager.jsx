import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, FormControl, InputLabel,
  Select, MenuItem, TextField, Rating, Avatar, Divider,
  IconButton, Chip, Badge, useMediaQuery, useTheme
} from "@mui/material";
import {
  Star, StarBorder, Email, Feedback, 
  Report, ContactSupport, CheckCircle,
  Close, Menu, ArrowBack
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';

// Color Palette
const colors = {
  pistachio: '#93C572',
  lightOrange: '#FFB347',
  white: '#FFFFFF',
  black: '#2C2C2C',
  lightGray: '#F5F5F5',
  darkGray: '#555555'
};

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: colors.lightGray,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4)
  }
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  backgroundColor: colors.white,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.pistachio,
  color: colors.white,
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#7DA95D',
    boxShadow: '0 4px 12px rgba(147, 197, 114, 0.3)'
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.lightOrange,
  color: colors.white,
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#E69F42',
    boxShadow: '0 4px 12px rgba(255, 179, 71, 0.3)'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: colors.pistachio,
  color: colors.white
}));

// Rating Component
const CustomRating = ({ value, onChange }) => (
  <Rating
    value={value}
    precision={0.5}
    onChange={onChange}
    icon={<Star fontSize="inherit" style={{ color: colors.lightOrange }} />}
    emptyIcon={<StarBorder fontSize="inherit" style={{ color: colors.darkGray }} />}
    size="large"
  />
);

// Feedback Form Component
const FeedbackForm = () => {
  const [rating, setRating] = useState(3);
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { investorUUID, AccessToken } = useSelector(( state ) => state.auth || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!investorUUID || !AccessToken) {
      setSnackbar({ open: true, message: "Please login to submit feedback" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://franchise-backend-wgp6.onrender.com/api/v1/feedback/createFeedback/${investorUUID}`,
        { topic: category, rating, feedback },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${AccessToken}` } }
      );
      setSnackbar({ open: true, message: response.data.message || "Feedback submitted!" });
      setCategory('');
      setFeedback('');
      setRating(3);
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Submission failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardCard>
      <SectionHeader>
        <Avatar sx={{ bgcolor: colors.white, color: colors.pistachio, mr: 2 }}>
          <Feedback />
        </Avatar>
        <Typography variant="h6" fontWeight="600">Share Your Feedback</Typography>
      </SectionHeader>
      
      <Box p={3}>
        <Box textAlign="center" mb={4}>
          <Typography variant="body1" color={colors.darkGray} mb={2}>
            How would you rate your experience?
          </Typography>
          <CustomRating value={rating} onChange={(e, newValue) => setRating(newValue)} />
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              sx={{ borderRadius: '12px' }}
              required
            >
              {["Service", "Platform", "Support", "Other"].map(item => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Your Feedback"
            multiline
            rows={5}
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mb: 3, borderRadius: '12px' }}
            required
          />

          <Box display="flex" justifyContent="flex-end">
            <PrimaryButton 
              type="submit" 
              disabled={isSubmitting}
              startIcon={<CheckCircle />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </PrimaryButton>
          </Box>
        </form>
      </Box>
    </DashboardCard>
  );
};

// Complaint Form Component
const ComplaintForm = () => {
  const [category, setCategory] = useState('');
  const [complaint, setComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { investorUUID, AccessToken } = useSelector(( state ) => state.auth || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!investorUUID || !AccessToken) {
      setSnackbar({ open: true, message: "Please login to submit a complaint" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://franchise-backend-wgp6.onrender.com/api/v1/complaint/createComplaint/${investorUUID}`,
        { topic: category, complaint },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${AccessToken}` } }
      );
      setSnackbar({ open: true, message: response.data.message || "Complaint submitted!" });
      setCategory('');
      setComplaint('');
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || "Submission failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardCard>
      <SectionHeader sx={{ backgroundColor: colors.lightOrange }}>
        <Avatar sx={{ bgcolor: colors.white, color: colors.lightOrange, mr: 2 }}>
          <Report />
        </Avatar>
        <Typography variant="h6" fontWeight="600">File a Complaint</Typography>
      </SectionHeader>
      
      <Box p={3}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Issue Type</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Issue Type"
              sx={{ borderRadius: '12px' }}
              required
            >
              {["Technical", "Billing", "Service", "Other"].map(item => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Detailed Complaint"
            multiline
            rows={5}
            fullWidth
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            sx={{ mb: 3, borderRadius: '12px' }}
            required
          />

          <Box display="flex" justifyContent="flex-end">
            <SecondaryButton 
              type="submit" 
              disabled={isSubmitting}
              startIcon={<Report />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </SecondaryButton>
          </Box>
        </form>
      </Box>
    </DashboardCard>
  );
};

// Contact Us Component
const ContactUs = () => (
  <DashboardCard>
    <SectionHeader>
      <Avatar sx={{ bgcolor: colors.white, color: colors.pistachio, mr: 2 }}>
        <Email />
      </Avatar>
      <Typography variant="h6" fontWeight="600">Contact Our Team</Typography>
    </SectionHeader>
    
    <Box p={3} textAlign="center">
      <Typography variant="body1" color={colors.darkGray} mb={3}>
        Have questions? Reach out to our support team directly.
      </Typography>
      
  <Chip
  icon={<Email />}
  label="support@mrfranchise.com"
  component="a"
  href="https://mail.google.com/mail/?view=cm&fs=1&to=support@mrfranchise.com&su=Support%20Request&body=Hi%20Team%2C%20I%20have%20a%20question..."
  target="_blank" // Opens in a new tab
  rel="noopener noreferrer" // Security best practice
  clickable
  sx={{
    p: 2,
    fontSize: '1rem',
    backgroundColor: colors.pistachio,
    color: colors.white,
    '&:hover': {
      backgroundColor: '#7DA95D'
    }
  }}
/>


      
      <Typography variant="body2" color={colors.darkGray} mt={3}>
        We typically respond within 24 hours.
      </Typography>
    </Box>
  </DashboardCard>
);

// Main Dashboard Component
const ResponseManagerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState('feedback');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'feedback', label: 'Feedback', icon: <Feedback />, component: <FeedbackForm /> },
    { id: 'complaint', label: 'Complaint', icon: <Report />, component: <ComplaintForm /> },
    { id: 'contact', label: 'Contact Us', icon: <Email />, component: <ContactUs /> }
  ];

  return (
    <DashboardContainer>
      {isMobile ? (
        // Mobile View
        <Box>
          {mobileMenuOpen ? (
            <Box>
              <SectionHeader>
                <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: colors.white }}>
                  <ArrowBack />
                </IconButton>
                <Typography variant="h6" ml={2}>Menu</Typography>
              </SectionHeader>
              
              <Box p={2}>
                {tabs.map(tab => (
                  <Box 
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      borderRadius: '8px',
                      backgroundColor: activeTab === tab.id ? alpha(colors.pistachio, 0.1) : 'transparent',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(colors.pistachio, 0.05)
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: activeTab === tab.id ? colors.pistachio : colors.lightGray,
                      color: activeTab === tab.id ? colors.white : colors.darkGray,
                      mr: 2,
                      width: 36,
                      height: 36
                    }}>
                      {tab.icon}
                    </Avatar>
                    <Typography fontWeight={activeTab === tab.id ? 600 : 400}>
                      {tab.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Box>
              <SectionHeader>
                <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: colors.white }}>
                  <Menu />
                </IconButton>
                <Typography variant="h6" ml={2}>
                  {tabs.find(t => t.id === activeTab)?.label}
                </Typography>
              </SectionHeader>
              
              <Box p={2}>
                {tabs.find(t => t.id === activeTab)?.component}
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        // Desktop View
        <Box display="flex" maxWidth={1200} mx="auto">
          {/* Sidebar */}
          <Box width={240} mr={3}>
            <DashboardCard>
              <SectionHeader>
                <Typography variant="h6" fontWeight="600">Support Center</Typography>
              </SectionHeader>
              
              <Box p={2}>
                {tabs.map(tab => (
                  <Box 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      borderRadius: '8px',
                      backgroundColor: activeTab === tab.id ? alpha(colors.pistachio, 0.1) : 'transparent',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(colors.pistachio, 0.05)
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: activeTab === tab.id ? colors.pistachio : colors.lightGray,
                      color: activeTab === tab.id ? colors.white : colors.darkGray,
                      mr: 2,
                      width: 36,
                      height: 36
                    }}>
                      {tab.icon}
                    </Avatar>
                    <Typography fontWeight={activeTab === tab.id ? 600 : 400}>
                      {tab.label}
                    </Typography>
                    {tab.id === 'complaint' && (
                      <Badge  color="error" sx={{ ml: 'auto' }} />
                    )}
                  </Box>
                ))}
              </Box>
            </DashboardCard>
          </Box>
          
          {/* Main Content */}
          <Box flex={1}>
            {tabs.find(t => t.id === activeTab)?.component}
          </Box>
        </Box>
      )}
    </DashboardContainer>
  );
};

export default ResponseManagerDashboard;