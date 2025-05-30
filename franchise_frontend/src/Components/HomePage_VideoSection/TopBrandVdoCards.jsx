import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Slide,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";



function TopBrandVdoCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const timeoutRef = useRef(null);
  const [brandData, setBrandData] = useState([]);
  const mainVideoRef = useRef(null);
  const sideVideoRefs = useRef([]);

  const handleNext = useCallback(() => {
    if (!isHovered && !isVideoPlaying) {
      setCurrentIndex((prev) => (prev + 1) % brandData.length);
    }
  }, [isHovered, isVideoPlaying, brandData]);

  const startAutoSlide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isHovered && !isVideoPlaying && brandData.length > 0) {
      timeoutRef.current = setTimeout(() => handleNext(), 5000);
    }
  }, [isHovered, isVideoPlaying, handleNext, brandData]);

   useEffect(() =>{
    const fetchBrandData = async () => {
      try{
        const response = await axios.get(" https://franchise-backend-wgp6.onrender.com/api/v1/admin/videoAdvertise/getAdminVideoAdvertiseTopTwo");
        const fetchedData = response.data?.data;
        
        // Ensure it's always an array for consistent behavior
        if (fetchedData) {
          setBrandData(Array.isArray(fetchedData) ? fetchedData : [fetchedData]);
        }
        // console.log("Fetched brand data:", brandData);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrandData();
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, startAutoSlide]);

  if (!brandData || brandData.length === 0) {
    return (<div>No brand data available</div>);
  }

  const handleVideoPlay = (videoRef) => {
    setIsVideoPlaying(true);
    clearTimeout(timeoutRef.current);
    // Pause other videos when one plays
    if (videoRef !== mainVideoRef.current) {
      mainVideoRef.current?.pause();
    }
    sideVideoRefs.current.forEach(ref => {
      if (ref && ref !== videoRef) ref.pause();
    });
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    startAutoSlide();
  };

 

  const mainBrand = brandData[currentIndex];
  const next1 = brandData[(currentIndex + 1) % brandData.length];
  const next2 = brandData[(currentIndex + 2) % brandData.length];

  return (
    <Box 
      sx={{ px: 4, py: 6, maxWidth: 1800, mx: "auto" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Top Brand
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* Main Video */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mainBrand.videoUrl}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 6,
                width: 900,
              }}
            >
              <Box sx={{ height: 370, overflow: "hidden" }}>
                <video
                  ref={mainVideoRef}
                  src={mainBrand.videoUrl}
                  controls
                  onPlay={() => handleVideoPlay(mainVideoRef.current)}
                  onPause={handleVideoPause}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "all 5.5s ease",
                  }}
                />
              </Box>
              <CardContent
                sx={{
                  bgcolor: "#ffff",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 2,
                  height: 120,
                }}
              >
                <Box sx={{ flex: 7 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {mainBrand.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mainBrand.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {mainBrand.title || "A brief description of brand."}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    💰 {mainBrand.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "1px",
                    height: "100%",
                    backgroundColor: "#ccc",
                    mx: 2,
                  }}
                />
                <Box sx={{ flex: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 8,
                      ml: 20,
                      background: "#f29724",
                      textTransform: "none",
                      "&:hover": { background: "#e2faa7", color: "#000" },
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Right Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2,width: 870 }}>
          {[next1, next2].map((brand, i) => (
            <Slide
              direction="up"
              in
              timeout={600 + i * 200}
              key={brand.title}
            >
              <Card
                sx={{
                  display: "flex",
                  height: 260,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 4,
                  transform: "scale(1)",
                  transition: "transform 0.3s ease-in-out",
                  '&:hover': { transform: "scale(1.03)" },
                }}
              >
                <Box sx={{ width: 520, height: 260 }}>
                  <video
                    ref={el => sideVideoRefs.current[i] = el}
                    controls
                    src={brand.videoUrl}
                    onPlay={() => handleVideoPlay(sideVideoRefs.current[i])}
                    onPause={handleVideoPause}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    bgcolor: "#ffff",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: 350,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {brand.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {brand.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    💰 {brand.title}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 10,
                      ml: 30,
                      width: "content",
                      background: "#f29724",
                      textTransform: "none",
                      fontSize: "0.8rem",
                      px: 2,
                      "&:hover": { background: "#e2faa7", color: "#000" },
                    }}
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
            </Slide>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default TopBrandVdoCards;