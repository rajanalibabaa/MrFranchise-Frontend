import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import pop1 from '../../assets/Images/Delicious Food.png';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { keyframes } from '@mui/system';
import LoginPage from '../../Pages/LoginPage/LoginPage';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    transform: translate(-50%, -40%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '85%', md: '65%', lg: '50%' },
  maxWidth: 650,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
  p: 0,
  overflow: 'hidden',
  animation: `${slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
  '&:focus-visible': {
    outline: 'none',
  },
};

const headerStyle = {
  p: 3,
  pb: 2,
  textAlign: 'center',
  background: 'linear-gradient(135deg, #7ad03a 0%, #5cbf24 100%)',
  color: 'white',
};

const imageStyle = {
  width: '100%',
  height: { xs: '30vh', sm: '35vh' },
  objectFit: 'cover',
  objectPosition: 'center',
};

const contentStyle = {
  p: { xs: 2, sm: 3 },
  textAlign: 'center',
};

const buttonGroupStyle = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: 'center',
  gap: 2,
  mt: 3,
  mb: 2,
};

const PopupModal = ({ open, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasShownPopup = sessionStorage.getItem('hasShownPopup');
    if (!hasShownPopup) {
      setIsModalOpen(true);
      sessionStorage.setItem('hasShownPopup', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const openLoginPopup = () => {
    setLoginOpen(true);
    handleClose();
  };

  return (
    <>
      <Modal 
        open={open} 
        onClose={onClose} 
        aria-labelledby="popup-title"
        aria-describedby="popup-description"
        sx={{
          backdropFilter: 'blur(3px)',
          animation: `${fadeIn} 0.3s ease-out`,
        }}
      >
        <Box sx={style}>
          <Box sx={headerStyle}>
            <Typography
              id="popup-title"
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.4rem', sm: '1.7rem' },
                mb: 1,
              }}
            >
              Franchise Opportunities Await
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Connect with the best food & beverage brands
            </Typography>
          </Box>

          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.2)',
              },
            }}
          >
            <CloseIcon fontSize="small" sx={{ color: 'red' }} />
          </IconButton>

          <img 
            src={pop1} 
            alt="Franchise opportunities" 
            style={imageStyle} 
            loading="lazy" 
          />

          <Box sx={contentStyle}>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
              Join our network of investors and brands to discover profitable franchise opportunities in the food & beverage industry.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={buttonGroupStyle}>
              <Button
                variant="contained"
                onClick={() => handleNavigation("/investor-register")}
                sx={{
                  bgcolor: "#7ad03a",
                  "&:hover": { bgcolor: "#5cbf24" },
                  minWidth: 200,
                  py: 1.5,
                  fontWeight: 600,
                  animation: `${pulse} 2s infinite`,
                  boxShadow: '0 4px 15px rgba(122, 208, 58, 0.3)',
                }}
              >
                Investor Register
              </Button>

              <Button
                variant="contained"
                onClick={() => handleNavigation("/brandlistingform")}
                sx={{
                  bgcolor: "#e99830",
                  "&:hover": { bgcolor: "#d18722" },
                  minWidth: 200,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(233, 152, 48, 0.3)',
                }}
              >
                Brand Register
              </Button>
            </Box>

            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Already have an account?{' '}
              <Box
                component="span"
                onClick={openLoginPopup}
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  cursor: 'pointer',
                  "&:hover": { textDecoration: 'underline' },
                }}
              >
                Sign In
              </Box>
            </Typography>
          </Box>
        </Box>
      </Modal>

      <LoginPage
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={() => setLoginOpen(false)}
      />
    </>
  );
};

export default PopupModal;