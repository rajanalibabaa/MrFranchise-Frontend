import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import pop1 from '../../assets/Images/logoforReg.jpg';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { keyframes } from '@mui/system';

const zoomInOut = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: '60%' },
  maxWidth: 700,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  p: { xs: 2, sm: 3 },
  textAlign: 'center',
  animation: `${fadeIn} 0.6s ease-out`,
  backgroundColor: '#fff',
  
  
  
};

const imageStyle = {
  width: '100%',
  height: '50vh',
  borderRadius: '12px',
  objectFit: 'cover',
  marginTop: '1.5rem',
};

const PopupModal = ({ open, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false); // ✅ Fixed: moved inside the component
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
  };

  const openLoginPopup = () => {
    setLoginOpen(true); // ✅ This now works correctly
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="popup-title" aria-describedby="popup-description">
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#999',
            '&:hover': {
              color: '#000',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="popup-title"
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#FFBA00',
            fontSize: { 
                xs: '1.2rem',
                sm: '1.5rem',
                md: '1.8rem',
                lg: '2rem',
             },
          }}
        >
          Discover Franchise Opportunities with Us
        </Typography>

        <img src={pop1} alt="popup visual" style={imageStyle} loading="lazy" />

        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleNavigation("/investor-register")}
            sx={{
              bgcolor: "#7ad03a",
              "&:hover": {
                bgcolor: "#5cbf24",
              },
              width: "100%",
              maxWidth: 250,
              animation: `${zoomInOut} 1.5s ease-in-out infinite`,
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            Investor Register
          </Button>

          <Button
            variant="contained"
            onClick={() => handleNavigation("/brandlistingform")}
            sx={{
              bgcolor: "#e99830",
              "&:hover": {
                bgcolor: "#cc7a18",
              },
              width: "100%",
              maxWidth: 250,
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            Brand Register
          </Button>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Box
              component="span"
              onClick={openLoginPopup}
              sx={{
                textDecoration: 'underline',
                cursor: 'pointer',
                color: '#007bff',
                "&:hover": {
                  color: "#0056b3",
                },
              }}
            >
              Sign In
            </Box>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default PopupModal;
