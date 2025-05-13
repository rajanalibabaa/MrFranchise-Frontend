import React, { useEffect, useState } from "react";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const TopBrandVdoSec = () => {
  const [brandData, setBrandData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/admin/videoAdvertise/getAdminVideoAdvertise"
      );
      setBrandData(res.data || []);
    } catch (err) {
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + brandData.length) % brandData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % brandData.length);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (brandData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>No brand data found.</Typography>
      </Box>
    );
  }

  const current = brandData[currentIndex];

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          fontWeight: 700,
          background: "linear-gradient(90deg, #3498db, #2ecc71, #e74c3c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundSize: "200% auto",
          animation: "gradient 3s linear infinite",
          "@keyframes gradient": {
            "0%": { backgroundPosition: "0% center" },
            "100%": { backgroundPosition: "200% center" },
          },
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
        {/* Video/Thumbnail Section */}
        <Box
          sx={{
            position: "relative",
            height: { xs: 250, sm: 300, md: 450 },
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          <motion.div
            key={current._id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={(e) => {
              const vid = e.currentTarget.querySelector("video");
              const img = e.currentTarget.querySelector("img");
              if (vid && img) {
                vid.style.display = "block";
                img.style.display = "none";
                vid.play().catch(() => {});
              }
            }}
            onMouseLeave={(e) => {
              const vid = e.currentTarget.querySelector("video");
              const img = e.currentTarget.querySelector("img");
              if (vid && img) {
                vid.pause();
                vid.currentTime = 0;
                vid.style.display = "none";
                img.style.display = "block";
              }
            }}
            style={{ height: "100%" }}
          >
            <img
              src={current.thumbnailUrl || "/placeholder.jpg"}
              alt="poster"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            <video
              muted
              controls
              style={{
                display: "none",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src={current.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>

          {/* Navigation buttons */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.4)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ArrowBackIos />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.4)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>

        {/* Info Panel */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 3,
            overflowY: "auto",
            maxHeight: { xs: 250, sm: 300, md: 450 },
          }}
        >
          <Typography variant="h6" gutterBottom>
            {current.brandName}
          </Typography>
          <Typography>
            <strong>Investment:</strong> {current.investmentRange}
          </Typography>
          <Typography>
            <strong>Area Required:</strong> {current.areaRequired}
          </Typography>
          <Typography>
            <strong>Outlets:</strong> {current.outletCount}
          </Typography>
          <Typography sx={{ mt: 1 }}>{current.description}</Typography>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate("/brandViewPage")}
          >
            Visit Site
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TopBrandVdoSec;
