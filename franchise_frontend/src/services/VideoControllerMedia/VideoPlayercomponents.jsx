import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  LinearProgress,
  Slider,
  Dialog,
  DialogContent
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  PictureInPicture
} from '@mui/icons-material';
import { useVideoController } from './VideHandlingFunctions';

export const VideoPlayer = ({
  id,
  videoUrl,
  poster,
  width = '100%',
  height = '100%',
  objectFit = 'contain',
  showControls = true,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [pipMode, setPipMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const {
    currentPlayingId,
    playVideo,
    pauseVideo,
    registerVideo,
    unregisterVideo
  } = useVideoController();

  const isPlaying = currentPlayingId === id;

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Memoized event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoaded(true);
      
      // Start loading the video immediately after metadata is loaded
      if (isVisible) {
        videoRef.current.load();
      }
    }
  }, [isVisible]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setProgress((videoRef.current.currentTime / duration) * 100);
    }
  }, [duration]);

  // Register/unregister video with cleanup
  useEffect(() => {
    if (!isVisible) return;

    const video = videoRef.current;
    if (!video) return;

    registerVideo(id, video);
    
    // More aggressive preloading strategy
    video.preload = 'auto';
    video.load();
    
    return () => {
      unregisterVideo(id);
      // Clean up video element
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [id, isVisible, registerVideo, unregisterVideo]);

  // Play/pause handler with immediate feedback
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseVideo(id);
    } else {
      // Optimistic UI update
      setIsBuffering(true);
      playVideo(id).finally(() => setIsBuffering(false));
    }
  }, [isPlaying, id, pauseVideo, playVideo]);

  // Mute/unmute handler
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Fullscreen handler
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  // PIP handler
  const togglePipMode = useCallback(async () => {
    if (!pipMode && document.pictureInPictureEnabled) {
      try {
        await videoRef.current?.requestPictureInPicture?.();
        setPipMode(true);
      } catch (err) {
        console.error("PIP failed:", err);
      }
    } else {
      await document.exitPictureInPicture?.();
      setPipMode(false);
    }
  }, [pipMode]);

  // Event listeners with optimized setup
  useEffect(() => {
    if (!isVisible) return;

    const video = videoRef.current;
    if (!video) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    const handlePipChange = () => {
      setPipMode(document.pictureInPictureElement === video);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleEnded = () => pauseVideo(id);
    const handleCanPlay = () => setIsBuffering(false);

    // Video events
    const videoEvents = [
      { type: 'loadedmetadata', handler: handleLoadedMetadata },
      { type: 'timeupdate', handler: handleTimeUpdate },
      { type: 'waiting', handler: handleWaiting },
      { type: 'playing', handler: handlePlaying },
      { type: 'ended', handler: handleEnded },
      { type: 'canplay', handler: handleCanPlay },
      { type: 'enterpictureinpicture', handler: handlePipChange },
      { type: 'leavepictureinpicture', handler: handlePipChange }
    ];

    // Add all video event listeners
    videoEvents.forEach(({ type, handler }) => {
      video.addEventListener(type, handler);
    });

    // Document events
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      // Remove all video event listeners
      videoEvents.forEach(({ type, handler }) => {
        video.removeEventListener(type, handler);
      });
      
      // Remove document events
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [id, isVisible, handleLoadedMetadata, handleTimeUpdate, pauseVideo]);

  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width,
          height,
          backgroundColor: '#eee',
          overflow: 'hidden',
          '&:hover .video-controls': { opacity: 1 },
        }}
      >
        {/* Optimized loading indicator with custom color */}
        {(!isLoaded || isBuffering) && (
          <LinearProgress 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              backgroundColor: 'rgba(255, 152, 0, 0.2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ff9800'
              }
            }}
          />
        )}

        {/* Video element with optimized attributes */}
        {isVisible && (
          <video
            ref={videoRef}
            poster={poster}
            src={videoUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit,
              cursor: 'pointer',
              display: isLoaded ? 'block' : 'none',
              visibility: isLoaded ? 'visible' : 'hidden'
            }}
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            onClick={togglePlayPause}
            onError={() => {
              console.error('Video loading failed');
              setIsLoaded(true); // Show controls even if error
            }}
          />
        )}

        {/* Fallback for browsers that don't support video */}
        {(!isLoaded || !isVisible) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5'
            }}
          >
            <Box
              component="img"
              src={poster}
              alt="Video thumbnail"
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}

        {showControls && (
          <Box
            className="video-controls"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 1,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              opacity: isPlaying ? 0.7 : 1,
              transition: 'opacity 0.3s',
              '&:hover': { opacity: 1 },
            }}
          >
            {/* Progress bar with better UX */}
            <Slider
              value={progress}
              onChange={(e, newValue) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = (newValue / 100) * duration;
                }
              }}
              sx={{
                position: 'absolute',
                top: -10,
                left: 0,
                right: 0,
                color: 'primary.main',
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 8,
                  height: 8,
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&:hover': { width: 12, height: 12 },
                },
              }}
            />

            {/* Control buttons with better spacing */}
            <Box display="flex" alignItems="center" gap={1} px={1}>
              <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
                <IconButton onClick={togglePlayPause} size="small" sx={{ color: 'white' }}>
                  {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                <IconButton onClick={toggleMute} size="small" sx={{ color: 'white' }}>
                  {isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Box flexGrow={1} minWidth={8} />

              <Tooltip title="Picture-in-Picture">
                <IconButton 
                  onClick={togglePipMode} 
                  size="small" 
                  sx={{ color: 'white' }}
                  disabled={!document.pictureInPictureEnabled}
                >
                  <PictureInPicture fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                <IconButton onClick={toggleFullscreen} size="small" sx={{ color: 'white' }}>
                  {isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}
      </Box>

      {/* Enhanced PIP Fallback Dialog */}
      {pipMode && !document.pictureInPictureEnabled && (
        <Dialog
          open={pipMode}
          onClose={() => setPipMode(false)}
          PaperProps={{
            sx: {
              position: 'fixed',
              bottom: 16,
              right: 16,
              width: 300,
              height: 200,
              m: 0,
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: 6
            }
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <video
              src={videoUrl}
              autoPlay
              muted={isMuted}
              loop
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 1,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <IconButton 
                onClick={() => setPipMode(false)} 
                size="small" 
                sx={{ color: 'white' }}
              >
                <FullscreenExit fontSize="small" />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};