 import React from "react";
import {
  Popover,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Email,
  Instagram
} from "@mui/icons-material";

const ShareDialogActions = ({ anchorEl, setAnchorEl }) => {
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const shareUrl = "https://your-url.com"; 

  return (
    <Popover
  open={open}
  anchorEl={anchorEl}
  onClose={handleClose}

  PaperProps={{
    sx: {
        marginLeft:"60px",
        marginBottom:"30px",
      boxShadow: "none",
      backgroundColor: "transparent", 
zIndex: 1200,
    },
  }}
>
  <Box
    sx={{ backgroundColor: "transparent",marginBottom:"50px" ,marginRight:"20px" }} 
  >


    <Box display="flex" flexDirection="column"  >
      <IconButton
        color="primary"
        onClick={() =>
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank")
        }
      >
        <Facebook />
      </IconButton>
      <IconButton
        color="primary"
        onClick={() =>
          window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`, "_blank")
        }
      >
        <Twitter />
      </IconButton>
      <IconButton
        color="primary"
        onClick={() =>
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, "_blank")
        }
      >
        <LinkedIn />
      </IconButton>
      <IconButton
        color="success"
        onClick={() =>
          window.open(`https://wa.me/?text=${shareUrl}`, "_blank")
        }
      >
        <WhatsApp />
      </IconButton>
      <IconButton
        color="default"
        onClick={() =>
          window.open(`mailto:?subject=Check this out&body=${shareUrl}`, "_blank")
        }
      >
        <Email />
      </IconButton>
    </Box>
  </Box>
</Popover>

  );
};

export default ShareDialogActions;
