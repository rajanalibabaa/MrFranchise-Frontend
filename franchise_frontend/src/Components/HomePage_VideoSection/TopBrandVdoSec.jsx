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
  const videoRefs = useRef([]);

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

  const handleVideoPlay = (index) => {
    setIsVideoPlaying(true);
    // Pause other videos
    videoRefs.current.forEach((ref, i) => {
      if (i !== index && ref) ref.pause();
    });
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
          "https://franchise-backend-wgp6.onrender.com/api/v1/admin/videoAdvertise/getAdminVideoAdvertiseTopOne"
        );
        const fetchedData = response.data?.data;

        // Ensure it's always an array for consistent behavior
        if (fetchedData) {
          setBrandData(Array.isArray(fetchedData) ? fetchedData : [fetchedData]);
        }
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

  // Get current and next two brands for display
  const currentBrand = brandData[index];
  const nextBrand1 = brandData[(index + 1) % brandData.length];
  const nextBrand2 = brandData[(index + 2) % brandData.length];

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
      {/* <Typography
        variant="h5"
        fontWeight="bold"
        mb={2}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Top Brand
      </Typography> */}

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center"}}>
        {/* Navigation buttons */}
        <IconButton
          sx={{
            position: "absolute",
            left: 40,
            top: "50%",
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
            right: 40,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "white",
            zIndex: 10,
            boxShadow: 1,
          }}
          onClick={handleNext}
        >
          <ChevronRight />
        </IconButton>

        {/* First Card */}
        <AnimatePresence mode="wait">
          <Card
            key={currentBrand.title}
            component={motion.div}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            sx={{
              width: 500,
              height: 450,
              display: "flex",
              flexDirection: "ro",
              borderRadius: 3,
              boxShadow: 4,
              overflow: "hidden",
              ":hover": {
                boxShadow: 9,
              },
            }}
          >
            <Box sx={{ height: "100%", position: "relative",width:500 }}>
              <motion.video
                ref={el => videoRefs.current[0] = el}
                src={currentBrand.videoUrl}
                controls
                onPlay={() => handleVideoPlay(0)}
                onPause={handleVideoPause}
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            
            <Box
              sx={{
                p: 2,
                height: "60%",
                width:600,
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
                    <Avatar src={currentBrand.logo} sx={{ width: 28, height: 28 }} />
                    <Typography variant="h6" fontWeight="bold">
                      {currentBrand.title}
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
                  {currentBrand.description}
                </Typography>
              </Box>

              <Button
                variant="contained" onClick={handleOpen}
                sx={{
                  backgroundColor: "#f29724",
                  textTransform: "none",
                  width: "100%",
                  borderRadius: 1,
                  mt: 1,
                  "&:hover": {
                    backgroundColor: "#e2faa7",
                    color: "#000",
                  },
                }}
              >
                Apply
              </Button>
            </Box>
          </Card>
        </AnimatePresence>

        {/* Second Card */}
        <Card
          sx={{
            width: 500,
            height: 450,
            display: "flex",
            flexDirection: "row",
            borderRadius: 3,
            boxShadow: 4,
            overflow: "hidden",
            ":hover": {
              boxShadow: 9,
            },
          }}
        >
          <Box sx={{ height: "100%", position: "relative" }}>
            <motion.video
              ref={el => videoRefs.current[1] = el}
              src={nextBrand1.videoUrl}
              controls
              onPlay={() => handleVideoPlay(1)}
              onPause={handleVideoPause}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          
          <Box
            sx={{
              p: 2,
              height: "60%",
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
                  <Avatar src={nextBrand1.logo} sx={{ width: 28, height: 28 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {nextBrand1.title}
                  </Typography>
                </Box>
                <IconButton
                  onClick={handleLike}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <FavoriteBorder sx={{ color: "gray", fontSize: 25 }} />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={1}>
                {nextBrand1.description}
              </Typography>
            </Box>

            <Button
              variant="contained" onClick={handleOpen}
              sx={{
                backgroundColor: "#f29724",
                textTransform: "none",
                width: "100%",
                borderRadius: 1,
                mt: 1,
                "&:hover": {
                  backgroundColor: "#e2faa7",
                  color: "#000",
                },
              }}
            >
              Apply
            </Button>
          </Box>
        </Card>
      
     
      </Box>

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
  );
}

export default TopBrandVdoSec;