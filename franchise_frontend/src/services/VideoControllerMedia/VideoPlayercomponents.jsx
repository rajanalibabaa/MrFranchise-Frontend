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
  autoPlay = false,
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
  const [hasError, setHasError] = useState(false);
  
  const {
    currentPlayingId,
    playVideo,
    pauseVideo,
    registerVideo,
    unregisterVideo
  } = useVideoController();

  const isPlaying = currentPlayingId === id;

  // Register/unregister video with proper cleanup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const cleanup = registerVideo(id, video);

    // Initial autoplay if requested
    if (autoPlay) {
      const timer = setTimeout(() => {
        playVideo(id).catch(err => {
          console.error('Autoplay failed:', err);
          setHasError(true);
        });
      }, 500);

      return () => {
        clearTimeout(timer);
        cleanup?.();
      };
    }

    return cleanup;
  }, [id, registerVideo, autoPlay, playVideo]);

  // Event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoaded(true);
      setIsBuffering(false);
      setHasError(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && duration > 0) {
      setProgress((videoRef.current.currentTime / duration) * 100);
    }
  }, [duration]);

  const handleError = useCallback(() => {
    console.error('Video error');
    setHasError(true);
    setIsBuffering(false);
    setIsLoaded(true);
    pauseVideo(id);
  }, [id, pauseVideo]);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handlePlaying = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handleEnded = useCallback(() => {
    pauseVideo(id);
  }, [id, pauseVideo]);

  // Play/pause handler with better error handling
  const togglePlayPause = useCallback(() => {
  const video = videoRef.current;
  if (!video) return;

  if (isPlaying) {
    // 1) Pause immediately
    video.pause();
    // 2) Tell your controller (pauses any other playing videos, etc.)
    pauseVideo(id);
  } else {
    // 1) Show buffering/progress state if you like
    setIsBuffering(true);
    // 2) Attempt to play immediately
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise
        .catch(err => {
          console.error('Direct play() failed:', err);
          setHasError(true);
        })
        .finally(() => {
          setIsBuffering(false);
        });
    } else {
      // older browsers might not return a promise
      setIsBuffering(false);
    }
    // 3) Also notify your global controller so it can pause others
    playVideo(id).catch(err => {
      console.error('Controller.playVideo failed:', err);
      setHasError(true);
    });
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
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  }, [isFullscreen]);

  // PIP handler with proper error handling
  const togglePipMode = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      if (!pipMode && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setPipMode(true);
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPipMode(false);
      }
    } catch (err) {
      console.error("PIP error:", err);
      setPipMode(false);
    }
  }, [pipMode]);

  // Event listeners setup with proper cleanup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const events = [
      { type: 'loadedmetadata', handler: handleLoadedMetadata },
      { type: 'timeupdate', handler: handleTimeUpdate },
      { type: 'waiting', handler: handleWaiting },
      { type: 'playing', handler: handlePlaying },
      { type: 'canplay', handler: handleCanPlay },
      { type: 'ended', handler: handleEnded },
      { type: 'error', handler: handleError }
    ];

    events.forEach(({ type, handler }) => {
      video.addEventListener(type, handler);
    });

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      events.forEach(({ type, handler }) => {
        video.removeEventListener(type, handler);
      });
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handleError, handleWaiting, handlePlaying, handleCanPlay, handleEnded]);

  // Helper function to format time (mm:ss)
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

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
        {/* Loading/error indicator */}
        {(!isLoaded || isBuffering || hasError) && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
            <LinearProgress 
              variant={isBuffering ? 'indeterminate' : 'determinate'}
              value={progress}
              sx={{
                height: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: hasError ? '#f44336' : '#ff9800'
                }
              }}
            />
          </Box>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          poster={poster}
          src={videoUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            cursor: 'pointer',
            display: isLoaded && !hasError ? 'block' : 'none',
            backgroundColor: '#f5f5f5'
          }}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          onClick={togglePlayPause}
        />

        {/* Centered play/pause button */}
        {showControls && (
          <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
            <IconButton 
              onClick={togglePlayPause} 
              size="large"
              disabled={hasError}
              sx={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  transform: 'translate(-50%, -50%) scale(1.1)'
                },
                '&:disabled': {
                  opacity: 0.5
                },
                width: 54,
                height: 54,
                zIndex: 2
              }}
            >
              {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
            </IconButton>
          </Tooltip>
        )}

        {/* Fallback poster or error message */}
        {(!isLoaded || hasError) && poster && (
          <Box
            component="img"
            src={poster}
            alt="Video preview"
            sx={{
              position: 'absolute',
              top:0 ,
              left:0 ,
              width: 48,
              height: 48,
              objectFit: 'contain',
              cursor: 'pointer',
              zIndex: 3,
              filter: hasError ? 'grayscale(80%)' : 'none',
              // opacity: 0.8
            }}
            onClick={togglePlayPause}
          />
        )}

        {hasError && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: 1,
              borderRadius: 1,
              zIndex: 2,
              textAlign: 'center'
            }}
          >
            Video Loading ...
          </Box>
        )}

        {/* Controls */}
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
              zIndex: 2
            }}
          >
            {/* Progress bar */}
            <Box sx={{ position: 'relative', width: '100%', height: 4, mb: 1 }}>
              <Slider
                value={progress}
                onChange={(e, newValue) => {
                  if (videoRef.current && duration > 0) {
                    videoRef.current.currentTime = (newValue / 100) * duration;
                  }
                }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  color: 'primary.main',
                  height: 4,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    transition: '0.2s cubic-bezier(.47,1.64,.41,.8)',
                    '&:hover': { width: 16, height: 16 },
                  },
                  '& .MuiSlider-rail': {
                    display: 'none'
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#ff9800'
                  }
                }}
              />
            </Box>

            {/* Control buttons */}
            <Box display="flex" alignItems="center" gap={1} px={1}>
              <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                <IconButton 
                  onClick={toggleMute} 
                  size="small" 
                  disabled={hasError}
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)'
                    },
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  {isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                </IconButton>
              </Tooltip>

              <Box 
                sx={{ 
                  color: 'white', 
                  fontSize: '0.75rem',
                  ml: 1,
                  minWidth: '60px',
                  textAlign: 'center'
                }}
              >
                {duration > 0 && !hasError && (
                  <>
                    {formatTime((progress / 100) * duration)} / {formatTime(duration)}
                  </>
                )}
              </Box>

              <Box flexGrow={1} />

              {document.pictureInPictureEnabled && (
                <Tooltip title="Picture-in-Picture">
                  <IconButton 
                    onClick={togglePipMode} 
                    size="small" 
                    disabled={hasError}
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                      },
                      '&:disabled': {
                        opacity: 0.5
                      }
                    }}
                  >
                    <PictureInPicture fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                <IconButton 
                  onClick={toggleFullscreen} 
                  size="small" 
                  disabled={hasError}
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    },
                    '&:disabled': {
                      opacity: 0.5
                    }
                  }}
                >
                  {isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}
      </Box>

      {/* PIP fallback dialog */}
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
