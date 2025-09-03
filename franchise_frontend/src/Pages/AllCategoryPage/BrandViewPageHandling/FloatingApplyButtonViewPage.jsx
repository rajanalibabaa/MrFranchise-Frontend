import React from "react";
import { Button, Box, Typography, keyframes } from "@mui/material";
import { motion } from "framer-motion";

// Bounce animation keyframes
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const FloatingApplyButton = ({ isMobile, brand, toggleDrawer }) => {
  const brandName = brand[0]?.brandDetails?.brandName || "Brand";
  const brandCategory =
    brand[0]?.brandfranchisedetails?.franchiseDetails?.brandCategories?.child ||
    "";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? 35 : 300,
        right: isMobile ? 0 : 20,
        left: isMobile ? 0 : "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      {/* Animated Apply Now Button */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{
          scale: 1,
          y: [0, -10, 0], // bounce
        }}
        transition={{
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            ease: "easeOut",
          },
          scale: {
            type: "spring",
            stiffness: 100,
            damping: 10,
          },
        }}
        whileHover={{
          scale: 1.05,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }}
        whileTap={{ scale: 0.95 }}
        style={{ textAlign: "center" }}
      >
        <Button
          variant="contained"
          size="large" // 🔹 fixed standard button size
          onClick={toggleDrawer(true)}
          sx={{
            backgroundColor: "#ff9800",
            color: "white",
            borderRadius: 50,
            px: 4,
            py: 1.2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            "&:hover": {
              backgroundColor: "#e65100",
            },
            fontSize: "1rem",
            animation: `${bounce} 2s infinite ease-in-out`,
          }}
        >
          Apply Now
        </Button>

        {/* Brand Name */}
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            fontWeight: 600,
            color: "#ff9800",
            borderBottom: "2px solid #ff9800",
          }}
        >
          {brandName}
        </Typography>

        {/* Brand Category */}
       
      </motion.div>
    </Box>
  );
};

export default FloatingApplyButton;
