import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Avatar,
  Modal,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
};

function TopBrandVdoSec() {
  const [[index, direction], setIndex] = useState([0, 0]);
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [open, setOpen] = useState(false);
  
  const timeoutRef = useRef(null);
  const videoRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  


  const handleNext = useCallback(() => {
    if (!isHovered && !isVideoPlaying && brandData.length > 0) {
      setIndex(([i]) => [(i + 1) % brandData.length, 1]);
      setLiked(false);
    }
  }, [isHovered, isVideoPlaying, brandData]);

  const handlePrev = () => {
    if (brandData.length > 0) {
      setIndex(([i]) => [(i - 1 + brandData.length) % brandData.length, -1]);
      setLiked(false);
    }
  };

  const startAutoSlide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isHovered && !isVideoPlaying && brandData.length > 0) {
      timeoutRef.current = setTimeout(() => handleNext(), 5000);
    }
  }, [isHovered, isVideoPlaying, handleNext, brandData]);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    clearTimeout(timeoutRef.current);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    startAutoSlide();
  };

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/admin/videoAdvertise/getAdminVideoAdvertiseTopOne"
        );
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
  }, [index, startAutoSlide]);

  if (!brandData || brandData.length === 0) {
    return <div>Loading...</div>;
  }

  const brand = brandData[index];

  const handleLike = () => {
    setLiked((prev) => !prev);
    if(liked) {
      //api
    } else {
      //api
    }
  }

  return (
    <Box
      sx={{ p: 4, maxWidth: "1800px", mx: "auto" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Top Brand
      </Typography>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {/* Left Video Section */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
            height: 450,
          }}
        >
          <motion.video
            ref={videoRef}
            key={brand.videoUrl}
            src={brand.videoUrl}
            controls
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              bgcolor: "white",
              zIndex: 10,
              boxShadow: 1,
            }}
            onClick={handlePrev}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              bgcolor: "white",
              zIndex: 10,
              boxShadow: 1,
            }}
            onClick={handleNext}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Right Card Section */}
        <AnimatePresence mode="wait" custom={direction}>
          <Card
            key={brand.title}
            component={motion.div}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            sx={{
              flex: 1,
              minWidth: 360,
              height: 450,
              display: "flex",
              borderRadius: 3,
              boxShadow: 4,
              overflow: "hidden",
              ":hover": {
                boxShadow: 9,
              },
            }}
          >
            <Box
              component="img"
              src={brand.thumbnailUrl}
              alt={brand.title}
              sx={{
                width: "45%",
                height: "100%",
                objectFit: "fill",
              }}
            />

            <Box
              sx={{
                p: 2,
                width: "55%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar src={brand.logo} sx={{ width: 28, height: 28 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {brand.title}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={handleLike}
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    {liked ? (
                      <Favorite sx={{ color: "red", fontSize: 25 }} />
                    ) : (
                      <FavoriteBorder sx={{ color: "gray", fontSize: 25 }} />
                    )}
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  {brand.description}
                </Typography>

                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  💰 {brand.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  📐 {brand.description}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {brand.description}
                </Typography>
              </Box>

              <Button
                variant="contained" onClick={handleOpen}
                sx={{
                  backgroundColor: "#f29724",
                  textTransform: "none",
                  width: "fit-content",
                  px: 3,
                  borderRadius: 1,
                  mt: 1,
                  ml: 42,
                  "&:hover": {
                    backgroundColor: "#e2faa7",
                    color: "#000",
                  },
                }}
              >
                Apply
              </Button>
              <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 400,
                          bgcolor: "background.paper",
                          border: "2px solid #000",
                          boxShadow: 24,
                          p: 4,
                        }}
                      >
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Why Should We Ask?
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic,
                          quibusdam. Inventore quam, commodi quo perspiciatis ut voluptatem
                          corporis, laudantium ullam eaque voluptates aliquid totam temporibus
                          iste molestiae deserunt quod ipsam.
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                      </Box>
                    </Modal>
            </Box>
          </Card>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default TopBrandVdoSec;
