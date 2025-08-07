import React from "react";
import { Button, Box, keyframes } from "@mui/material";
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
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? 35 : 300,
        right: isMobile ? 0 : 20,
        left: isMobile ? 0 : "auto",
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ 
          scale: 1,
          y: [0, -10, 0], // Bounce effect
        }}
        transition={{
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 2,
            ease: "easeOut"
          },
          scale: {
            type: "spring",
            stiffness: 100,
            damping: 10
          }
        }}
        whileHover={{
          scale: 1.05,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          size={isMobile ? "medium" : "large"}
          onClick={toggleDrawer(true)}
          sx={{
            backgroundColor: "#ff9800",
            color: "white",
            borderRadius: 50,
            px: 4,
            py: 1.5,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            "&:hover": {
              backgroundColor: "#e65100",
            },
            fontSize: isMobile ? "0.875rem" : "1rem",
            animation: `${bounce} 2s infinite ease-in-out`,
          }}
        >
          Apply Now&nbsp; for&nbsp; <strong>{brand[0]?.brandDetails?.brandName}</strong>
        </Button>
      </motion.div>
    </Box>
  );
};

export default FloatingApplyButton;