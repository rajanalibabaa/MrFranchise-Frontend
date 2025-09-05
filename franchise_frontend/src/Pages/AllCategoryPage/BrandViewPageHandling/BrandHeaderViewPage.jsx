import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Phone,
  Favorite,
  ShareOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ShareDialogActions from "../ShareDialogActions";
import { RiBookmark3Fill } from "react-icons/ri";
import { useRef } from "react";
import confetti from "canvas-confetti";

const BrandHeader = ({
  brand,
  isMobile,
  localIsLiked,
  isProcessingLike,
  shortListed,
  handleLikeClick,
  handleToggleShortList,
  handleOpenShareClick,
  anchorEl,
  setAnchorEl,
  toggleDrawer,
  getOutletRange,
}) => {
  const likeButtonRef = useRef(null);
  const shortlistButtonRef = useRef(null);

  // 🎉 Confetti effect to use element position
  const triggerCelebration = (color, buttonRef) => {
    if (buttonRef && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x, y },
          colors: [color, "#ffffff", "#fdc81cff", "#76ec1cff", "#ff1dd6ffff", "#00eaffff", "#0400ffff", "#000000", "#f10808ffff", "#f5f50aff"],
      });
    } else {
      // Fallback to center if element not found
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: [color, "#ffffff"],
      });
    }
  };

  const handleMoreClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('expansion-location');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modified handleLikeClick to include confetti
  const handleLikeClickWithConfetti = () => {
    handleLikeClick();
    if (!localIsLiked) {
      triggerCelebration("#f44336", likeButtonRef);
    }
  };

  // Modified handleToggleShortList to include confetti
  const handleToggleShortListWithConfetti = () => {
    handleToggleShortList(brand[0]?.uuid);
    if (!shortListed) {
      triggerCelebration("#7ef400ff", shortlistButtonRef);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="space-between"
        mb={3}
        gap={2}
      >
        {/* Brand logo and basic info */}
        <Box
          display="flex"
          alignItems="center"
          gap={isMobile ? 1 : 3}
          flexDirection={isMobile ? "column" : "row"}
          width="100%"
        >
          <Box
            position="relative"
            sx={{ 
              border: "2px solid orange", 
              borderRadius: "10px", 
              width: "clamp(120px, 20vw, 200px)", 
              height: "clamp(120px, 20vw, 200px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={brand[0].uploads?.logo}
              alt={brand[0].brandDetails?.brandName}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </Box>

          <Box width="100%">
            {/* Brand name and actions */}
            <Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexDirection={isMobile ? "column" : "row"}
                gap={2}
              >
                <Box>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      background: "linear-gradient(45deg, #000 30%, #000 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textAlign: isMobile ? "center" : "left",
                    }}
                  >
                    {brand[0]?.brandDetails?.brandName}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign={isMobile ? "center" : "left"}
                    fontSize={isMobile ? "0.875rem" : "1rem"}
                  >
                    {brand[0]?.brandDetails?.tagLine}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: isMobile ? 1 : 10,
                      mt: 1,
                      justifyContent: isMobile ? "center" : "flex-start",
                    }}
                  >
                    <Typography fontSize={isMobile ? "0.8rem" : "0.9rem"}>
                      Established Year:{" "}
                      <label variant="body1" color="text.secondary">
                        {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.establishedYear || "N/A"}
                      </label>
                    </Typography>
                    <Typography fontSize={isMobile ? "0.8rem" : "0.9rem"}>
                      Franchise Since:{" "}
                      <label variant="body1" color="text.secondary">
                        {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.franchiseSinceYear || "N/A"}
                      </label>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: isMobile ? 1 : 0, ml: isMobile ? 0 : 2 }}>
                  <Button
                    variant="contained"
                    size={isMobile ? "small" : "medium"}
                    startIcon={<Phone />}
                    onClick={toggleDrawer(true)}
                    sx={{
                      px: isMobile ? 0 : 1.5,
                      py: isMobile ? 1 : 2,
                      bgcolor: "#ff9800",
                      "&:hover": { bgcolor: "#e65100" },
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                    }}
                  >
                    VIEW CONTACT
                  </Button>
                  <IconButton
                    ref={likeButtonRef}
                    sx={{ marginLeft: "90px" }}
                    onClick={handleLikeClickWithConfetti}
                    disabled={isProcessingLike}
                  >
                    {isProcessingLike ? (
                      <CircularProgress size={isMobile ? 20 : 24} />
                    ) : (
                      <Favorite
                        sx={{
                          color: localIsLiked
                            ? "#f44336"
                            : "rgba(0, 0, 0, 0.23)",
                        }}
                      />
                    )}
                  </IconButton>
                  <IconButton
                    ref={shortlistButtonRef}
                    onClick={handleToggleShortListWithConfetti}
                    sx={{
                      color: shortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
                    }}
                  >
                    <RiBookmark3Fill />
                  </IconButton>
                  <IconButton
                    onClick={handleOpenShareClick}
                    size={isMobile ? "small" : "medium"}
                  >
                    <ShareOutlined
                      sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                    />
                  </IconButton>

                  <ShareDialogActions
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    brand={{
                      name: brand[0]?.brandDetails?.brandName,
                      logo: brand[0]?.uploads?.logo,
                      // video: brand[0]?.uploads?.franchisePromotionVideo
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Brand details table */}
            <Box sx={{ width: "100%", overflow: "hidden", mt: 2 }}>
              <TableContainer
                component={Paper}
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    height: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#555",
                  },
                }}
              >
                <Table
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    minWidth: isMobile ? 650 : "100%",
                    tableLayout: "fixed",
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#7ad03a",
                        "& th": {
                          padding: isMobile ? "6px 8px" : "10px 12px",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    >
                      <TableCell sx={{ width: "25%", textAlign: "center" }}>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell sx={{ width: "18%", textAlign: "center" }}>
                        <strong>Area</strong>
                      </TableCell>
                      <TableCell sx={{ width: "15%", textAlign: "center" }}>
                        <strong>Investment</strong>
                      </TableCell>
                      <TableCell sx={{ width: "15%", textAlign: "center" }}>
                        <strong>Total Outlets</strong>
                      </TableCell>
                      <TableCell sx={{ width: "30%", textAlign: "center" }}>
                        <strong>Expansion Location</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: "25%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                        }}
                      >
                        {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories?.child || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "18%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                        }}
                      >
                        {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.fico?.[0]?.areaRequired || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "15%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                        }}
                      >
                        {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.fico?.[0]?.investmentRange || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "15%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                        }}
                      >
                        {getOutletRange(brand?.[0]?.brandfranchisedetails?.franchiseDetails?.totalOutlets || "N/A")}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "30%",
                          textAlign: "center",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
                          wordBreak: "break-word",
                          py: isMobile ? "8px" : "12px",
                        }}
                      >
                        {(() => {
                          const locations = brand?.[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations || [];

                          const states = locations
                            .map((loc) => loc.state)
                            .filter(Boolean);
                          const hasMore = states.length > 2;

                          if (states.length === 0) {
                            return "Multiple Locations";
                          }

                          const visibleStates = states.slice(0, 2).join(", ");

                          return (
                            <>
                              {visibleStates}
                              {hasMore && (
                                <a
                                  href="#expansion-location"
                                  onClick={handleMoreClick}
                                  style={{
                                    marginLeft: 8,
                                    fontSize: "0.7rem",
                                    textDecoration: "none",
                                    color: "#1976d2",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                  }}
                                >
                                  More
                                </a>
                              )}
                            </>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default BrandHeader;