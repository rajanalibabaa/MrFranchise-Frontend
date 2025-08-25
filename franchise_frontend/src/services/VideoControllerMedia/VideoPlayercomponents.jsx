
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { 
  Box, IconButton, CircularProgress 
} from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff, Fullscreen, FullscreenExit, PictureInPicture } from '@mui/icons-material';
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
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [pipMode, setPipMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { currentPlayingId, playVideo, pauseVideo, registerVideo, unregisterVideo } = useVideoController();

  // HLS setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    let hls;

    if ( typeof videoUrl === 'string' && videoUrl.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setDuration(video.duration);
          if (autoPlay) video.play();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          setHasError(true);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native support
        video.src = videoUrl;
      } else {
        console.error('HLS not supported in this browser');
        setHasError(true);
      }
    } else {
      video.src = videoUrl; // fallback for mp4 or other formats
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl, autoPlay]);

  // Register/unregister with controller
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const cleanup = registerVideo(id, video);
    return cleanup;
  }, [id, registerVideo, unregisterVideo]);

  // Sync with global playing state
  useEffect(() => {
    setIsPlaying(currentPlayingId === id);
  }, [currentPlayingId, id]);

  // Video events
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && duration > 0) {
      setProgress((videoRef.current.currentTime / duration) * 100);
    }
  }, [duration]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseVideo(id);
    } else {
      playVideo(id).catch(() => setHasError(true));
    }
  }, [isPlaying, id, pauseVideo, playVideo]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

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

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle PIP events
  useEffect(() => {
    const handleEnterPip = () => setPipMode(true);
    const handleLeavePip = () => setPipMode(false);

    const video = videoRef.current;
    if (video) {
      video.addEventListener('enterpictureinpicture', handleEnterPip);
      video.addEventListener('leavepictureinpicture', handleLeavePip);
    }

    return () => {
      if (video) {
        video.removeEventListener('enterpictureinpicture', handleEnterPip);
        video.removeEventListener('leavepictureinpicture', handleLeavePip);
      }
    };
  }, []);

  // Event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoaded(true);
    };
    const handlePlaying = () => setIsBuffering(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleError = () => setHasError(true);
    const handleEnded = () => pauseVideo(id);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [handleTimeUpdate, pauseVideo, id]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width, height, backgroundColor: '#000', overflow: 'hidden' }}>
      {(!isLoaded || isBuffering) && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      )}

      {/* Centered Play/Pause Button */}
      {showControls && (
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 3 
        }}>
          <IconButton 
            onClick={togglePlayPause} 
            sx={{ 
              color: 'white', 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              width: 44,
              height: 44
            }}
          >
            {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
          </IconButton>
        </Box>
      )}

      <video
        ref={videoRef}
        poster={poster}
        style={{ width: '100%', height: '100%', objectFit }}
        muted={isMuted}
        autoPlay={autoPlay}
        playsInline
        onClick={togglePlayPause}
      />

      {/* Bottom controls */}
      {showControls && (
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 1, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* <IconButton onClick={togglePlayPause} sx={{ color: 'white' }}>{isPlaying ? <Pause /> : <PlayArrow />}</IconButton> */}
          <IconButton onClick={toggleMute} sx={{ color: 'white' }}>{isMuted ? <VolumeOff /> : <VolumeUp />}</IconButton>
          <Box sx={{ color: 'white', fontSize: '0.75rem' }}>
            {formatTime((progress / 100) * duration)} / {formatTime(duration)}
          </Box>
          <Box flexGrow={1} />
          <IconButton onClick={togglePipMode} sx={{ color: 'white' }}><PictureInPicture /></IconButton>
          <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>{isFullscreen ? <FullscreenExit /> : <Fullscreen />}</IconButton>
        </Box>
      )}
    </Box>
  );
};