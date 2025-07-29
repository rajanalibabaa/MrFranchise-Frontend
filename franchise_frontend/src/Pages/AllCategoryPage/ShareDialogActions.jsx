import React from "react";
import {
  Popover,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Facebook from "@mui/icons-material/Facebook";
import Twitter from "@mui/icons-material/Twitter";
import LinkedIn from "@mui/icons-material/LinkedIn";
import WhatsApp from "@mui/icons-material/WhatsApp";
import Email from "@mui/icons-material/Email";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const ShareDialogActions = ({ anchorEl, setAnchorEl }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const open = Boolean(anchorEl);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [urlDialogOpen, setUrlDialogOpen] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState("");

  React.useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUrlDialogClose = () => {
    setUrlDialogOpen(false);
  };

  const copyToClipboard = () => {
    const shareMessage = `🌟 Check this out! 🌟\n\n${currentUrl}\n\n#ShareWithFriends`;
    navigator.clipboard.writeText(shareMessage);
    setSnackbarOpen(true);
    setUrlDialogOpen(false);
  };

  const shareText = `🌟 Check this out! 🌟\n\n${currentUrl}\n\n#ShareWithFriends`;

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <Facebook />,
      color: "primary",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}&quote=${encodeURIComponent(shareText)}`,
      action: "share",
    },
    {
      name: "Twitter",
      icon: <Twitter />,
      color: "primary",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(shareText)}&hashtags=ShareWithFriends`,
      action: "share",
    },
    {
      name: "LinkedIn",
      icon: <LinkedIn />,
      color: "primary",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}&summary=${encodeURIComponent(shareText)}`,
      action: "share",
    },
    {
      name: "WhatsApp",
      icon: <WhatsApp />,
      color: "success",
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      action: "share",
    },
    {
      name: "Email",
      icon: <Email />,
      color: "default",
      url: `mailto:?subject=${encodeURIComponent(
        "Check this out!"
      )}&body=${encodeURIComponent(shareText)}`,
      action: "share",
    },
    {
      name: "Copy Link",
      icon: <ContentCopyIcon />,
      color: "default",
      action: "show-url",
    },
  ];

  const handleAction = (platform) => {
    if (platform.action === "share") {
      window.open(platform.url, "_blank");
    } else if (platform.action === "show-url") {
      setUrlDialogOpen(true);
    }
  };

  return (
    <>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: isSmallScreen ? "top" : "center",
          horizontal: isSmallScreen ? "right" : "left",
        }}
        transformOrigin={{
          vertical: isSmallScreen ? "bottom" : "center",
          horizontal: isSmallScreen ? "right" : "left",
        }}
        PaperProps={{
          sx: {
            marginLeft: isSmallScreen ? 0 : "60px",
            marginBottom: isSmallScreen ? 0 : "30px",
            mt: isSmallScreen ? 0 : "79px",

            boxShadow: "none",
            backgroundColor: "transparent",
            zIndex: 1200,
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "transparent",
            marginBottom: isSmallScreen ? 0 : "50px",
            marginRight: isSmallScreen ? 0 : "20px",
            p: isSmallScreen ? 1 : 0,
            borderRadius: 1,
            bgcolor: isSmallScreen ? "background.paper" : "transparent",
            boxShadow: isSmallScreen ? 1 : "none",
          }}
        >
          {isSmallScreen && (
            <Box display="flex" alignItems="center" p={1}>
              <ShareIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Share this content</Typography>
            </Box>
          )}

          <Box
            display="flex"
            flexDirection={isSmallScreen ? "row" : "column"}
            gap={1}
          >
            {socialPlatforms.map((platform) => (
              <Tooltip
                key={platform.name}
                title={`Share on ${platform.name}`}
                arrow
              >
                <IconButton
                  color={platform.color}
                  onClick={() => handleAction(platform)}
                  aria-label={`Share on ${platform.name}`}
                  sx={{
                    "&:hover": {
                      transform: "scale(1.1)",
                      transition: "transform 0.2s",
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  {platform.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Popover>

      {/* URL Display Dialog */}
      <Dialog open={urlDialogOpen} onClose={handleUrlDialogClose}>
        <DialogTitle>Share this content</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Copy the link below to share with others:
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              backgroundColor: theme.palette.grey[100],
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{ flexGrow: 1, wordBreak: "break-all" }}
            >
              {currentUrl}
            </Typography>
            <Tooltip title="Open in new tab">
              <IconButton
                onClick={() => window.open(currentUrl, "_blank")}
                size="small"
                sx={{ ml: 1 }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            The link will include a preview with our brand logo when shared on
            social media.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUrlDialogClose}>Cancel</Button>
          <Button
            onClick={copyToClipboard}
            variant="contained"
            startIcon={<ContentCopyIcon />}
            color="primary"
          >
            Copy Share Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Share message copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareDialogActions;
