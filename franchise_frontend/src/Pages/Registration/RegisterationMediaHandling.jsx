import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, CircularProgress, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBrands } from "../../Redux/Slices/GetAllBrandsDataUpdationFile";
import PlayCircle from '@mui/icons-material/PlayCircle';
import PauseCircle from '@mui/icons-material/PauseCircle';
import VolumeUp from '@mui/icons-material/VolumeUp';
import VolumeOff from '@mui/icons-material/VolumeOff';
 
function RegisterationMediaHandling() {
  const dispatch = useDispatch();
  const { brands, isLoading } = useSelector((state) => state.brands);
  const videoRefs = useRef([]);
  const [displayBrands, setDisplayBrands] = useState([]);
 
  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = new Array(3).fill().map((_, i) => videoRefs.current[i] || React.createRef());
  }, []);
 
  // Fetch brands when component mounts
  useEffect(() => {
    dispatch(fetchBrands({ page: 1 }));
  }, [dispatch]);
 
  // When brands load, take first 3 for display
  useEffect(() => {
    if (brands && brands.length > 0) {
      setDisplayBrands(brands.slice(0, 3));
    }
  }, [brands]);
 
  const handleVideoClick = (index) => {
    const video = videoRefs.current[index].current;
    if (!video) return;
   
    // Pause all other videos
    videoRefs.current.forEach((ref, i) => {
      if (i !== index && ref.current) {
        ref.current.pause();
      }
    });
 
    if (video.paused) {
      video.play().catch(error => {
        console.error("Video play failed:", error);
        video.controls = true;
      });
    } else {
      video.pause();
    }
  };
 
  if (isLoading && brands.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }
 
  if (!displayBrands || displayBrands.length === 0) {
    return (
      <Box py={6} textAlign="center">
        <Typography variant="h6">No brands available</Typography>
      </Box>
    );
  }
 
  return (
    <Box py={6} px={2} bgcolor="#f9f9f9">
      <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
        Showcase Your Advertisements
      </Typography>
 
      <Grid container spacing={4} justifyContent="center">
        {displayBrands.map((brand, index) => (
          console.log("brand name:", brand[0]?.brandName),
          <Grid item key={brand.uuid} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '300px', // Adjust this to control card width
                aspectRatio: '9 / 16',
                maxHeight: 500,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 4,
                backgroundColor: '#000',
                transition: 'transform 0.3s',
                position: 'relative',
                '&:hover': { transform: 'scale(1.03)' },
                cursor: 'pointer'
              }}
              onClick={() => handleVideoClick(index)}
            >
              {/* <Typography
                variant="subtitle2"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 1,
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px 8px',
                  borderRadius: 1,
                  fontWeight: 500,
                }}
              >
{brand.brandDetails?.brandName || 'Brand'}
              </Typography> */}
             
              {brand.franchiseVideos ? (
                <video
                  ref={videoRefs.current[index]}
                  src={brand.franchiseVideos}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  playsInline
                  preload="metadata"
                  controls={false}
                />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  color="white"
                >
                  No video available
                </Box>
              )}
 
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  zIndex: 1
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoClick(index);
                  }}
                  size="small"
                  sx={{ color: 'white' }}
                >
                  {videoRefs.current[index]?.current?.paused ? (
                    <PlayCircle fontSize="small" />
                  ) : (
                    <PauseCircle fontSize="small" />
                  )}
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (videoRefs.current[index]?.current) {
                      videoRefs.current[index].current.muted =
                        !videoRefs.current[index].current.muted;
                    }
                  }}
                  size="small"
                  sx={{ color: 'white', ml: 1 }}
                >
                  {videoRefs.current[index]?.current?.muted ? (
                    <VolumeOff fontSize="small" />
                  ) : (
                    <VolumeUp fontSize="small" />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
 
export default RegisterationMediaHandling;
 