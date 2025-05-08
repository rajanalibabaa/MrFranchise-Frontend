import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import illustration from "../../assets/Images/PopUpLogin.jpg"; 
import franchiselogo from "../../assets/Images/MrFranchise.jpg"; 
const LoginRegisterPopUp = () => {
  const [open, setOpen] = useState(false);
  const [interactionDetected, setInteractionDetected] = useState(false);
  const [manuallyClosed, setManuallyClosed] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!interactionDetected && !manuallyClosed) {
        setOpen(true);
      }
    }, 420000); 

    return () => clearTimeout(timer);
  }, [interactionDetected, manuallyClosed]);

  
  const handleClose = () => {
    setOpen(false); 
    setManuallyClosed(true); 
  };


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box display="flex" width="100%" position="relative">
        <Box flex={1} sx={{ backgroundColor: "#f5f5f5", p: 2 }}>
          <img
            src={illustration}
            alt="Illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
          />
        </Box>

        <Box flex={1} p={3}>
          <DialogTitle>
           <img src={franchiselogo} alt="MRFranchise Logo" style={{ width: "80%", height: "80%", objectFit: "cover", borderRadius: "8px",marginLeft:"35px"}}/>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", color:"#ffba00" }}>
              Welcome to Our Franchise Website!
            </Typography>
           
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center", color:"#7ad03a",marginTop:"10px"}}>
              World's highest visited franchise website network.
            </Typography>
            <Typography variant="body2" mt={2} sx={{ textAlign: "center"}}>
              Would you like to login or register?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3,justifyContent: "center", gap: "25px" }} >
            <Button href="/loginpage" variant="outlined" color="primary">
              Login
            </Button>
            <Button href="/registerhandleuser" variant="outlined" color="primary">
              Register
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LoginRegisterPopUp;
