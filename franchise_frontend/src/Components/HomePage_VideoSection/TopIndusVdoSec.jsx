import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const topIndustryData = [
    {
      src: 'speaking', // Replace with actual import if available
      poster: 'zudio',
      name: "Zudio",
      investment: "₹1 Cr. - 4 Cr",
      area: "4000 - 6000",
      outlets: "200-500",
      description:
        "Zudio offers budget-friendly fashion for men, women, and children across India. Shop in store or online for the latest trends. Stylish. Affordable. Everywhere.",
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
        "Starbucks India delivers premium coffee experiences with exceptional service. Our cafés are a hub of connection and quality in every sip.",
      logo: 'zudio',
    },
  ];

function TopIndusVdoSec() {
    const navigate = useNavigate();
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", p: 3 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 2,
          background: "linear-gradient(90deg, #3498db, #2ecc71, #e74c3c)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradient 3s linear infinite",
          "@keyframes gradient": {
            "0%": { backgroundPosition: "0% center" },
            "100%": { backgroundPosition: "200% center" },
          },
        }}
      >
        Top Industry in Franchise
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {topIndustryData.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              background: "#fff",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 0 12px rgba(0,0,0,0.1)",
              height: { xs: "auto", md: 300 },
            }}
          >
            {/* Video/Image */}
            <Box
              sx={{
                position: "relative",
                flex: 2,
                backgroundColor: "#000",
                maxWidth: "100%",
              }}
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
                src={item.poster}
                alt="thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <Box
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
                  transition: "0.3s ease",
                  zIndex: 2,
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
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              >
                <source src={item.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>

            {/* Text Content */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                p: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "5%",
                  }}
                />
                <Typography variant="h5" sx={{ ml: 2 }}>
                  {item.name}
                </Typography>
              </Box>
              <Typography sx={{ mb: 1, fontSize: 18 }}>
                <strong>Investment:</strong> {item.investment}
              </Typography>
              <Typography sx={{ mb: 1, fontSize: 18 }}>
                <strong>Area Required:</strong> {item.area}
              </Typography>
              <Typography sx={{ mb: 1, fontSize: 18 }}>
                <strong>Franchise Outlets:</strong> {item.outlets}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 1, borderRadius: 2 }}
                onClick={() => navigate("/brandview")}
              >
                VISIT SITE
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default TopIndusVdoSec