import { useState } from 'react';
import { 
  Stepper,
  Step,
  StepLabel,
  Box,
  Container,
  Paper,
  Typography,
  Button,
  useTheme,
  Stack,
  IconButton
} from '@mui/material';
import { ArrowBack, ArrowForward, Close ,Home} from '@mui/icons-material';
import MembershipSelection from './PaymentPAge/MembershipPayment';
import BannerAdsSelection from './PaymentPAge/HomePageAdsLeads';
import PaymentPage from './PaymentPAge/PaymentPage';
import Navbar from '../../Navbar/NavBar';
import Footer from '../../Footers/Footer';
import { useNavigate } from 'react-router-dom';
const steps = ['Select Membership', 'Banner Ads', 'Payment'];

const AdvertisingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [membership, setMembership] = useState(null);
  const [banners, setBanners] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();
  const handleMembershipSelect = (selectedMembership) => {
    setMembership(selectedMembership);
    handleNext();
  };
  
  const handleBannerSelect = (selectedBanners) => {
    setBanners(selectedBanners);
    handleNext();
  };
  
  const handlePaymentSubmit = (paymentData) => {
    // console.log('Payment submitted:', paymentData);
    alert('Payment successful! Thank you for your purchase.');
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
 const handleGoToHome = () => {
    navigate('/');
  };
  const handleSkip = () => {
    if (activeStep === 1) {
      setBanners([]); 
    }
    handleNext();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <MembershipSelection onNext={handleMembershipSelect} />;
      case 1:
        return (
          <BannerAdsSelection 
            membership={membership} 
            onBack={handleBack}
            onNext={handleBannerSelect}
          />
        );
      case 2:
        return (
          <PaymentPage 
            membership={membership}
            banners={banners}
            onBack={handleBack}
            onSubmit={handlePaymentSubmit}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (<Box>
    <Box><Navbar/></Box>
    <Container  sx={{ py: 4 }}>
      <Box>
        

        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 800,
            textAlign: 'center',
            mb: 4,
            background: 'linear-gradient(90deg, #ffad33, #6fff00fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}
        >
          Advertising Membership
        </Typography>
        
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          sx={{ 
            // mb: 4,
            '& .MuiStepConnector-line': {
              borderColor: theme.palette.divider
            }
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                StepIconProps={{
                  sx: {
                    '&.Mui-completed': {
                      color: theme.palette.success.main,
                    },
                    '&.Mui-active': {
                      color: theme.palette.primary.main,
                    },
                  }
                }}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '0.875rem',
                    '&.Mui-active, &.Mui-completed': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 2 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation buttons */}
       {activeStep !== 0 && (
  <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
    {/* Back Button (always shown except on first step) */}
    <Button
      startIcon={<ArrowBack />}
      onClick={handleBack}
      variant="outlined"
      aria-label="back"
      sx={{
        borderRadius: 2,
        px: 3,
        textTransform: 'none'
      }}
    >
      Back
    </Button>
            
            {activeStep === steps.length - 1 ? (
      // Final step - Show Complete Payment button
      <Button
        endIcon={<ArrowForward />}
        onClick={handlePaymentSubmit}
        variant="contained"
        aria-label="complete payment"
        sx={{
          borderRadius: 2,
          px: 3,
          textTransform: 'none',
          background: 'linear-gradient(90deg, #10b981, #3b82f6)',
          '&:hover': {
            background: 'linear-gradient(90deg, #0d9e6e, #2563eb)'
          }
        }}
      >
        Complete Payment
      </Button>
    ) : activeStep === 1 && (membership?.tier === "Free" || membership?.price === 0) ? (
      // Step 1 with Free Membership - Show Go Back to Home
      <Button
        startIcon={<Home />}
        onClick={handleGoToHome}
        variant="contained"
        aria-label="go back to home"
        sx={{
          borderRadius: 2,
          px: 4,
          py: 1.5,
          textTransform: 'none',
          background: 'linear-gradient(90deg, #10b981, #3b82f6)',
          boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
          '&:hover': {
            background: 'linear-gradient(90deg, #059669, #2563eb)',
            boxShadow: '0 6px 8px rgba(16, 185, 129, 0.3)'
          }
        }}
      >
        Go Back to Home
      </Button>
    ) : (
      // Default case - Show Skip + Continue buttons
      <Stack direction="row" spacing={2}>
        <Button
          variant="text"
          aria-label="skip"
          onClick={handleSkip}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            color: theme.palette.text.secondary
          }}
        >
          Skip this step
        </Button>
        <Button
          endIcon={<ArrowForward />}
          onClick={handleNext}
          variant="contained"
          aria-label="continue"
          disabled={activeStep === 0 && !membership}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            background: 'linear-gradient(90deg, #4f46e5, #ec4899)',
            '&:hover': {
              background: 'linear-gradient(90deg, #4338ca, #db2777)'
            }
          }}
        >
          Continue
        </Button>
      </Stack>
    )}
  </Stack>
)}
      </Box>
    </Container><Box><Footer/></Box></Box>
  );
};

export default AdvertisingPage;