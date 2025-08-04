import React, { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  IconButton,
  Slider,
  Stack 
} from "@mui/material";
import { motion } from "framer-motion";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
   
} from "@mui/icons-material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
const MediaSection = ({
  allVideos = [],
  allImages = [],
  isMobile,
  isTablet,
  getImageBoxSize,
  handleImageOpen,
}) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);

  const videoSrc = Array.isArray(allVideos) ? allVideos[0] : allVideos;

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error("Play failed:", error);
        setVideoError(true);
      });
    }
    setIsPlaying(!isPlaying);
    resetControlsTimeout();
  };

  // Handle volume change
  const handleVolumeChange = (e, newValue) => {
    const newVolume = newValue / 100;
    videoRef.current.volume = newVolume;
    setVolume(newValue);
    setIsMuted(newValue === 0);
    resetControlsTimeout();
  };

  // Toggle mute
  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    resetControlsTimeout();
  };

  // Handle progress change
  const handleProgressChange = (e, newValue) => {
    const newTime = (newValue / 100) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(newValue);
    resetControlsTimeout();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    resetControlsTimeout();
  };

  // Reset controls hide timeout
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    setControlsTimeout(setTimeout(() => setShowControls(false), 3000));
  };

  // Event handlers
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    setVideoLoading(false);
    // Start with muted autoplay to comply with browser policies
    videoRef.current.muted = true;
    videoRef.current.play().catch(error => {
      console.log("Autoplay prevented:", error);
    });
  };

  const handleTimeUpdate = () => {
    const newProgress = (videoRef.current.currentTime / duration) * 100;
    setProgress(newProgress);
  };

  const handleVideoError = (e) => {
    console.error("Video error:", e.target.error);
    setVideoError(true);
    setVideoLoading(false);
  };

  // Effects
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('click', togglePlay);
    video.addEventListener('error', handleVideoError);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('click', togglePlay);
      video.removeEventListener('error', handleVideoError);
      document.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [duration]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Format time
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={4}>
        {/* Main video section */}
        <Box flex={isMobile ? "none" : 2} ref={videoContainerRef}>
          <Box
            sx={{
              width: "100%",
              height: isMobile ? 200 : isTablet ? 300 : 416,
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              position: 'relative',
              '&:hover .video-controls': {
                opacity: 1
              }
            }}
            component={motion.div}
            whileHover={{ scale: 1.01 }}
          >
            {videoSrc ? (
              <>
                {videoLoading && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                  }}>
                    <CircularProgress />
                  </Box>
                )}
                
                <video
                  ref={videoRef}
                  preload="auto"
                  poster={allImages?.[0] || ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "pointer",
                    opacity: videoLoading ? 0.5 : 1,
                  }}
                  playsInline
                  muted={isMuted}
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
                
                {/* Custom Video Controls */}
                <Box 
                  className="video-controls"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: 1,
                    transition: 'opacity 0.3s',
                    opacity: showControls ? 1 : 0,
                    zIndex: 2
                  }}
                  onMouseEnter={() => {
                    setShowControls(true);
                    if (controlsTimeout) clearTimeout(controlsTimeout);
                  }}
                  onMouseLeave={() => {
                    setControlsTimeout(setTimeout(() => setShowControls(false), 2000));
                  }}
                >
                  {/* Progress bar */}
                  <Slider
                    value={progress}
                    onChange={handleProgressChange}
                    sx={{
                      color: 'white',
                      height: 4,
                      '& .MuiSlider-thumb': {
                        width: 12,
                        height: 12,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                        },
                        '&.Mui-active': {
                          width: 16,
                          height: 16,
                        },
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0.5,
                      },
                    }}
                  />
                  
                  {/* Control buttons */}
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
                    <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    
                    <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                      {isMuted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                    
                    <Slider
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      sx={{
                        width: 80,
                        color: 'white',
                        '& .MuiSlider-thumb': {
                          width: 10,
                          height: 10,
                        },
                      }}
                    />
                    
                    <Typography variant="caption" sx={{ color: 'white', ml: 1 }}>
                      {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                    </Typography>
                    
                    <Box sx={{ flexGrow: 1 }} />
                    
                    <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                      {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                  </Stack>
                </Box>
                
                {!isPlaying && !videoLoading && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1
                  }} onClick={togglePlay}>
                    <IconButton sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                    }}>
                      <PlayArrowIcon sx={{ fontSize: 50, color: 'white' }} />
                    </IconButton>
                  </Box>
                )}
                
                {videoError && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    flexDirection: 'column',
                    gap: 1,
                    zIndex: 3
                  }}>
                    <Typography>Video playback failed</Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                      {videoRef.current?.error?.message || 'The video may be corrupted or unsupported'}
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => window.location.reload()}
                      sx={{ mt: 2 }}
                    >
                      Reload Page
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ 
                width: "100%", 
                height: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <Typography>No promotional video available</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box flex={1}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
            }}
          >
            {allImages.slice(0, 3).map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: getImageBoxSize(),
                    overflow: "hidden",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5",
                    position: "relative",
                  }}
                  onClick={() => handleImageOpen(index)}
                >
                  <img
                    src={imageUrl}
                    loading="lazy"
                    alt={`Gallery ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                </Box>
              </motion.div>
            ))}

            {/* View More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: getImageBoxSize(),
                  overflow: "hidden",
                  borderRadius: 2,
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
                }}
                onClick={() => handleImageOpen(3)}
              >
                <Typography
                  variant={isMobile ? "body2" : "h6"}
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    zIndex: 1,
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    color: "text.primary",
                  }}
                >
                  View More ({Math.max(allImages.length - 3, 0)}+)
                </Typography>
                {allImages[3] && (
                  <>
                    <img
                      src={allImages[3]}
                      loading="lazy"
                      alt=""
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "blur(10px)",
                        opacity: 0.3,
                        zIndex: 0,
                      }}
                    />
                  </>
                )}
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default MediaSection;