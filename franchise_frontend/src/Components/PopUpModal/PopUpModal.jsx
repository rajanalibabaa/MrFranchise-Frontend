import React from 'react';
import { Box, Modal, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import pop1 from '../../assets/Images/ModelBg.jpeg';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  textAlign: 'center',
};

const imageStyle = {
  width: '100%',
  borderRadius: '8px',
  marginTop: '1rem',
};

const PopupModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="popup-title" aria-describedby="popup-description">
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="popup-title" variant="h6" component="h2" gutterBottom>
          Welcome to Our Franchise Website
        </Typography>
        <Typography id="popup-description" variant="body2">
          World's highest visited franchise website network.
        </Typography>
        <img src={pop1} alt="popup visual" style={imageStyle} />
      </Box>
    </Modal>
  );
};

export default PopupModal;
