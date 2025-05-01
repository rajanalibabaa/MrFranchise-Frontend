import React, { useEffect } from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const topInvestmentData = [
    {
        src: "speaking",
        poster: "zudio",
        name: "Zudio",
        investment: "₹1 Cr. - 4 Cr",
        area: "4000 - 6000",
        outlets: "200-500",
        description:
          "Zudio offers budget-friendly fashion...",
        logo: "zudio",
      },
      {
        src: "speaking",
        poster: "zudio",
        name: "Starbucks",
        investment: "₹1 Cr. - 3 Cr",
        area: "1500 - 2500",
        outlets: "300-600",
        description:
          "Starbucks India delivers premium coffee experiences...",
        logo: "zudio",
      },
      {
        src: "speaking",
        poster: "zudio",
        name: "Domino",
        investment: "₹1.5 Cr. - 3.5 Cr",
        area: "1200 - 1800",
        outlets: "1000+",
        description:
          "Domino's brings delicious pizza and fast delivery...",
        logo: "zudio",
      },
  ];

function TopInvestVdoSec() {
    const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = "translateY(0)";
            entry.target.style.opacity = 1;
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll(".observe-card");
    cards.forEach((card) => observer.observe(card));

    return () => cards.forEach((card) => observer.unobserve(card));
  }, []);
  return (
    <Box sx={{ px: 4, py: 2, maxWidth: "1700px", mx: "auto", fontFamily: 'Segoe UI' }}>
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
        Investment Range in Franchise
      </Typography>
      <Grid container spacing={15}>
        {topInvestmentData.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            className="observe-card"
            sx={{
              transform: "translateY(30px)",
              opacity: 0,
              transition: `all 0.6s ease ${index * 0.1}s`,
            }}
          >
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                overflow: "hidden",
                transition: "transform 0.3s",
                '&:hover': { transform: "translateY(-5px)", boxShadow: 6 }
              }}
            >
              <Box
                sx={{ position: "relative", height: 230, width:400, cursor: "pointer" }}
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
                <CardMedia
                  component="img"
                  image={item.poster}
                  alt="thumbnail"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 60,
                    height: 60,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    color: "#e74c3c",
                    zIndex: 2,
                    transition: "0.3s",
                    '&:hover': { opacity: 0 }
                  }}
                >
                  ▶
                </Box>
                <video
                  width="100%"
                  height="100%"
                  muted
                  controls
                  style={{ display: "none", objectFit: "cover" }}
                >
                  <source src={item.src} type="video/mp4" />
                </video>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={item.logo} alt={item.name} sx={{ width: 50, height: 50 }} />
                    <Typography variant="h6" sx={{ color: "#2c3e50" }}>{item.name}</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{ color: "#007bff", borderColor: "#007bff", '&:hover': { backgroundColor: "#007bff", color: "white" } }}
                    onClick={() => navigate("/brandview")}
                  >
                    VISIT SITE
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default TopInvestVdoSec