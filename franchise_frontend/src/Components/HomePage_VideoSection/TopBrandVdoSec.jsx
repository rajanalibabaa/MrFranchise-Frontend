import React, { useState } from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
// import img from "../../assets/Images/bgimg.jpg"


const topbrandData = [
    {
      src: 'speaking',
      poster: 'zudio',
      name: "Zudio",
      investment: "₹2 Cr. - 5 Cr",
      area: "6000 - 8000",
      outlets: "200-500",
      description:
        "Shop for the Best Men & Women Clothing at Zudio Store near you. Explore our wide range of Beauty, Ethnic Wear, Kids wear, Footwear and more at Zudio.",
      logo: 'zudio',
    },
    {
      src: 'speaking',
      poster: 'zudio',
      name: "Starbucks",
      investment: "₹1 Cr. - 3 Cr",
      area: "1500 - 2500",
      outlets: "300-600",
      description:
        "Premium coffee and café experience available nationwide Shop for the Best Men & Women Clothing at Zudio Store near you. Explore our wide range of Beauty, Ethnic Wear, Kids wear, Footwear and more at Zudio.",
      logo: 'zudio',
    },
    {
      src: 'speaking',
      poster: 'zudio',
      name: "Tea Boy",
      investment: "₹1.5 Cr. - 4 Cr",
      area: "1000 - 2000",
      outlets: "600-1000",
      description:
        "Global fast food chain known for fried chicken Shop for the Best Men & Women Clothing at Zudio Store near you. Explore our wide range of Beauty, Ethnic Wear, Kids wear, Footwear and more at Zudio.",
      logo: 'zudio',
    },
  ];

const TopBrandVdoSec = () => {
    const [currentVideo, setCurrentVideo] = useState(0);
    const navigate = useNavigate();
  
    const nextVideo = () => setCurrentVideo((prev) => (prev + 1) % topbrandData.length);
    const prevVideo = () => setCurrentVideo((prev) => (prev - 1 + topbrandData.length) % topbrandData.length);
  
    const currentItem = topbrandData[currentVideo];
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h3"
        sx={{
          mb: 2,
          fontWeight: 700,
          background: "linear-gradient(90deg, #3498db, #2ecc71, #e74c3c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradient 3s linear infinite",
          "@keyframes gradient": {
            "0%": { backgroundPosition: "0% center" },
            "100%": { backgroundPosition: "200% center" },
          },
          backgroundSize: "200% auto",
        }}
      >
        Top Brands in Franchise
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1.1fr" },
          gap: 2,
        }}
      >
        {/* Video Section */}
        <Box
          sx={{
            position: "relative",
            backgroundColor: "#333",
            borderRadius: 2,
            overflow: "hidden",
            height: { xs: 200, sm: 250, md: 440 },
          }}
        >
          <motion.div
            key={currentItem.src}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", height: "100%" }}
            onMouseEnter={(e) => {
              const video = e.currentTarget.querySelector("video");
              const img = e.currentTarget.querySelector("img");
              if (video && img) {
                video.style.display = "block";
                img.style.display = "none";
                video.play();
              }
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget.querySelector("video");
              const img = e.currentTarget.querySelector("img");
              if (video && img) {
                video.pause();
                video.currentTime = 0;
                video.style.display = "none";
                img.style.display = "block";
              }
            }}
          >
            <img
              src={currentItem.poster}
              alt="thumbnail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 8,
                display: "block",
              }}
            />

            <Box
              className="top1-play-button"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 60,
                height: 60,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                color: "#e74c3c",
                cursor: "pointer",
                zIndex: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 0,
                },
              }}
            >
              ▶
            </Box>

            <video
              width="100%"
              height="100%"
              controls
              muted
              style={{
                display: "none",
                borderRadius: 8,
                objectFit: "cover",
                height: "100%",
              }}
            >
              <source src={currentItem.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <IconButton
              onClick={prevVideo}
              sx={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
            >
              <ArrowBackIos />
            </IconButton>

            <IconButton
              onClick={nextVideo}
              sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.5)",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </motion.div>
        </Box>

        {/* Info Panel */}
        <Box
          sx={{
            borderRadius: 2,
            p: 2,
            backgroundColor: "#fff",
            maxHeight: { xs: 250, sm: 300, md: 440 },
            overflowY: "auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <img
              src={currentItem.logo}
              alt={currentItem.name}
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <Typography variant="h6" sx={{ mt: 1 }}>
              {currentItem.name}
            </Typography>
          </Box>

          <Typography>
            <strong>Investment range:</strong> {currentItem.investment}
          </Typography>
          <Typography>
            <strong>Area Required:</strong> {currentItem.area}
          </Typography>
          <Typography>
            <strong>Franchise Outlets:</strong> {currentItem.outlets}
          </Typography>

          <Button
            onClick={() => navigate("/brandViewPage")}
            variant="outlined"
            fullWidth
            sx={{ mt: 2, borderRadius: 2 }}
          >
            VISIT SITE
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TopBrandVdoSec