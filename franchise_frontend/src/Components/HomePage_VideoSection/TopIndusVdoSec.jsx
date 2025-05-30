import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, PlayArrow, Pause, VolumeOff, VolumeUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';


const BestBrandSlider = () => {
  const videoRefs = useRef([]);
  const scrollRef = useRef(null);
  const [brandList, setBrandList] = useState([]);
  const [muteState, setMuteState] = useState(Array(brandList.length).fill(true));
  const [playState, setPlayState] = useState(Array(brandList.length).fill(true));
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef(null);

  // Calculate how many slides we have (3 cards per slide)
  const totalSlides = Math.ceil(brandList.length / 3);

  const toggleMute = (index) => {
    const newMuteState = [...muteState];
    newMuteState[index] = !newMuteState[index];
    setMuteState(newMuteState);
    if (videoRefs.current[index]) videoRefs.current[index].muted = newMuteState[index];
  };

  const togglePlay = (index) => {
    const newPlayState = [...playState];
    newPlayState[index] = !newPlayState[index];
    setPlayState(newPlayState);
    if (videoRefs.current[index]) {
      if (newPlayState[index]) {
        videoRefs.current[index].play();
      } else {
        videoRefs.current[index].pause();
      }
    }
  };

  const scrollToSlide = useCallback((slideIndex) => {
    if (scrollRef.current) {
      const cardWidth = 350; // Width of each card
      const gap = 20; // Gap between cards
      const scrollPosition = slideIndex * 3 * (cardWidth + gap);
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentSlide(slideIndex);
    }
  }, []);

  const handleClick = () => {
    alert("Apply button clicked!");
  };

  const handleNext = useCallback(() => {
    const nextSlide = (currentSlide + 1) % totalSlides;
    scrollToSlide(nextSlide);
  }, [currentSlide, totalSlides, scrollToSlide]);

  const handlePrev = useCallback(() => {
    const prevSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    scrollToSlide(prevSlide);
  }, [currentSlide, totalSlides, scrollToSlide]);

  const startAutoSlide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (!isHovered) {
      timeoutRef.current = setTimeout(() => {
        handleNext();
      }, 5000); // 5 seconds
    }
  }, [isHovered, handleNext]);

  useEffect (() => {
    const fetchBrandData = async () => {
      try {
        const response = await axios.get("https://franchise-backend-wgp6.onrender.com/api/v1/admin/videoAdvertise/getAdminVideoAdvertiseTopThree");
        const fetchedData = response.data?.data;
        // Ensure it's always an array for consistent behavior
        if (fetchedData) {
          const dataArray = Array.isArray(fetchedData) ? fetchedData : [fetchedData];
          setBrandList(dataArray);
           setMuteState(Array(dataArray.length).fill(true));
           setPlayState(Array(dataArray.length).fill(false));
      }
      console.log("Fetched brand data:", fetchedData);

      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrandData();
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => clearTimeout(timeoutRef.current);
  }, [currentSlide, startAutoSlide]);

  
console.log("brandList:", brandList);

  return (
    <Box 
      sx={{ px: 4, py: 6, maxWidth: '1800px', mx: 'auto', }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffba00' }}>
          Today Marketing Leading Brands
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={handlePrev} sx={{ bgcolor: '#f0f0f0' }}>
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton onClick={handleNext} sx={{ bgcolor: '#f0f0f0' }}>
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          pb: 2,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {brandList.map((brand, i) => (
          <Card
            key={i}
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            sx={{
              minWidth: 380,
              height: 370,
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: brand.color,
              boxShadow: 3,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 9,
              },
              flexShrink: 0,
            }}
          >
            <Box sx={{ position: 'relative', height: 200 }}>
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={brand.videoUrl}
                controls
                muted
                autoPlay
                loop
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => toggleMute(i)}
                  sx={{ bgcolor: '#fff', p: 0.5 }}
                  size="small"
                >
                  {muteState[i] ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                </IconButton>
                <IconButton
                  onClick={() => togglePlay(i)}
                  sx={{ bgcolor: '#fff', p: 0.5 }}
                  size="small"
                >
                  {playState[i] ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                </IconButton>
              </Box>
            </Box>

            <CardContent sx={{ bgcolor: '#ffff', px: 2, pb: 2 }} >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                Brand Name :  {brand.title}
              </Typography>
              <Typography variant="body2" fontWeight={"bold"} >
                Investment : {brand.title}
              </Typography>
              <Typography  variant="body2"  sx={{ my: 1 }} display={'flex'} justifyContent={'space-around'}>
                <Typography fontWeight={'bold'}> Area Required :{brand.title}</Typography>
                <Typography fontWeight={'bold'}>Roi : {brand.title}</Typography>
              </Typography>
              <Button
                fullWidth
                variant="contained" onClick={handleClick}
                sx={{
                  backgroundColor: '#f29724',
                  borderRadius: 1,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#e2faa7',
                    color: '#000',
                  },
                }}
              >
                Apply
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default BestBrandSlider;


































