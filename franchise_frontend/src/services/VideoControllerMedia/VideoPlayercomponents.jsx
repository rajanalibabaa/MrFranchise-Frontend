// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import HLS from "hls.js"
// import { 
//   Box, 
//   IconButton, 
//   Tooltip, 
//   LinearProgress,
//   Slider,
//   Dialog,
//   DialogContent,
//   CircularProgress
// } from '@mui/material';
// import {
//   PlayArrow,
//   Pause,
//   VolumeUp,
//   VolumeOff,
//   Fullscreen,
//   FullscreenExit,
//   PictureInPicture
// } from '@mui/icons-material';
// import { useVideoController } from './VideHandlingFunctions';

// export const VideoPlayer = ({
//   id,
//   videoUrl,
//   poster,
//   width = '100%',
//   height = '100%',
//   objectFit = 'contain',
//   showControls = true,
//   autoPlay = false,
// }) => {
//   const videoRef = useRef(null);
//   const containerRef = useRef(null);
//   const [isMuted, setIsMuted] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [pipMode, setPipMode] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [hasError, setHasError] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isPosterLoaded, setIsPosterLoaded] = useState(false);

//   const {
//     currentPlayingId,
//     playVideo,
//     pauseVideo,
//     registerVideo,
//     unregisterVideo
//   } = useVideoController();

//   // Register/unregister video with proper cleanup
//  // HLS setup
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     let hls;

//     if (videoUrl.endsWith('.m3u8')) {
//       if (Hls.isSupported()) {
//         hls = new Hls();
//         hls.loadSource(videoUrl);
//         hls.attachMedia(video);
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           setDuration(video.duration);
//           if (autoPlay) video.play();
//         });
//         hls.on(Hls.Events.ERROR, (event, data) => {
//           console.error('HLS error:', data);
//           setHasError(true);
//         });
//       } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
//         // Safari native support
//         video.src = videoUrl;
//       } else {
//         console.error('HLS not supported in this browser');
//         setHasError(true);
//       }
//     } else {
//       video.src = videoUrl; // fallback for mp4 or other formats
//     }

//     return () => {
//       if (hls) {
//         hls.destroy();
//       }
//     };
//   }, [videoUrl, autoPlay]);

//   // Register/unregister with controller
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;
//     const cleanup = registerVideo(id, video);
//     return cleanup;
//   }, [id, registerVideo]);


//   // Event handlers
//   const handleLoadedMetadata = useCallback(() => {
//     if (videoRef.current) {
//       setDuration(videoRef.current.duration);
//       setIsLoaded(true);
//       setIsBuffering(false);
//       setHasError(false);
//     }
//   }, []);

//   const handleTimeUpdate = useCallback(() => {
//     if (videoRef.current && duration > 0) {
//       setProgress((videoRef.current.currentTime / duration) * 100);
//     }
//   }, [duration]);

//   const handleError = useCallback(() => {
//     console.error('Video error');
//     setHasError(true);
//     setIsBuffering(false);
//     setIsLoaded(true);
//     pauseVideo(id);
//   }, [id, pauseVideo]);

//   const handleWaiting = useCallback(() => {
//     setIsBuffering(true);
//   }, []);

//   const handlePlaying = useCallback(() => {
//     setIsBuffering(false);
//   }, []);

//   const handleCanPlay = useCallback(() => {
//     setIsBuffering(false);
//   }, []);

//   const handleEnded = useCallback(() => {
//     pauseVideo(id);
//   }, [id, pauseVideo]);

//   // Play/pause handler with better error handling
//   const togglePlayPause = useCallback(() => {
//     if (!videoRef.current) return;

//     if (isPlaying) {
//       pauseVideo(id); // let controller handle pause
//     } else {
//       playVideo(id).catch(err => {
//         console.error('Controller playVideo failed:', err);
//         setHasError(true);
//       });
//     }
//   }, [isPlaying, id, pauseVideo, playVideo]);

//   // Mute/unmute handler
//   const toggleMute = useCallback(() => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   }, [isMuted]);

//   // Fullscreen handler
//   const toggleFullscreen = useCallback(() => {
//     if (!containerRef.current) return;
    
//     if (!isFullscreen) {
//       containerRef.current.requestFullscreen?.().catch(console.error);
//     } else {
//       document.exitFullscreen?.().catch(console.error);
//     }
//   }, [isFullscreen]);

//   // PIP handler with proper error handling
//   const togglePipMode = useCallback(async () => {
//     if (!videoRef.current) return;
    
//     try {
//       if (!pipMode && document.pictureInPictureEnabled) {
//         await videoRef.current.requestPictureInPicture();
//         setPipMode(true);
//       } else if (document.pictureInPictureElement) {
//         await document.exitPictureInPicture();
//         setPipMode(false);
//       }
//     } catch (err) {
//       console.error("PIP error:", err);
//       setPipMode(false);
//     }
//   }, [pipMode]);

// // Event listeners
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleLoadedMetadata = () => {
//       setDuration(video.duration);
//       setIsLoaded(true);
//     };
//     const handlePlaying = () => setIsBuffering(false);
//     const handleWaiting = () => setIsBuffering(true);
//     const handleError = () => setHasError(true);
//     const handleEnded = () => pauseVideo(id);

//     video.addEventListener('loadedmetadata', handleLoadedMetadata);
//     video.addEventListener('timeupdate', handleTimeUpdate);
//     video.addEventListener('waiting', handleWaiting);
//     video.addEventListener('playing', handlePlaying);
//     video.addEventListener('ended', handleEnded);
//     video.addEventListener('error', handleError);

//     return () => {
//       video.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       video.removeEventListener('timeupdate', handleTimeUpdate);
//       video.removeEventListener('waiting', handleWaiting);
//       video.removeEventListener('playing', handlePlaying);
//       video.removeEventListener('ended', handleEnded);
//       video.removeEventListener('error', handleError);
//     };
//   }, [handleTimeUpdate, pauseVideo, id]);

//   // Event listeners setup with proper cleanup
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     // Add existing events + play/pause sync
//     const handlePlay = () => setIsPlaying(true);
//     const handlePause = () => setIsPlaying(false);

//     const events = [
//       { type: 'loadedmetadata', handler: handleLoadedMetadata },
//       { type: 'timeupdate', handler: handleTimeUpdate },
//       { type: 'waiting', handler: handleWaiting },
//       { type: 'playing', handler: handlePlaying },
//       { type: 'canplay', handler: handleCanPlay },
//       { type: 'ended', handler: handleEnded },
//       { type: 'error', handler: handleError },
//       { type: 'play', handler: handlePlay },
//       { type: 'pause', handler: handlePause },
//     ];

//     events.forEach(({ type, handler }) => {
//       video.addEventListener(type, handler);
//     });

//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };
//     document.addEventListener('fullscreenchange', handleFullscreenChange);

//     return () => {
//       events.forEach(({ type, handler }) => {
//         video.removeEventListener(type, handler);
//       });
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, [handleLoadedMetadata, handleTimeUpdate, handleError, handleWaiting, handlePlaying, handleCanPlay, handleEnded]);

//   // Helper function to format time (mm:ss)
//   const formatTime = useCallback((seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   }, []);

//   return (
//     <>
//       <Box
//         ref={containerRef}
//         sx={{
//           position: 'relative',
//           width,
//           height,
//           backgroundColor: '#eee',
//           overflow: 'hidden',
//           '&:hover .video-controls': { opacity: 1 },
//         }}
//       >
//         {/* Loading/error indicator */}
//         {(!isLoaded || isBuffering) && (
//           <Box sx={{ 
//             position: 'absolute', 
//             top: 0, 
//             left: 0, 
//             right: 0, 
//             zIndex: 3,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.05)'
//           }}>
//             <CircularProgress 
//               size={30}
//               thickness={4}
//               sx={{ mb: 1, color: 'primary.main' }}
//             />
//             <Box sx={{ 
//               color: 'text.secondary', 
//               fontSize: '0.8rem',
//               textAlign: 'center'
//             }}>
//               {isBuffering ? 'Buffering...' : 'Loading video...'}
//             </Box>
//           </Box>
//         )}

//         {/* Video element */}
//         <video
//           ref={videoRef}
//           poster={poster}
//           src={videoUrl}
//           style={{
//             width: '100%',
//             height: '100%',
//             objectFit,
//             cursor: 'pointer',
//             display: isLoaded && !hasError ? 'block' : 'none',
//             backgroundColor: '#f5f5f5'
//           }}
//           muted={isMuted}
//           loop
//           playsInline
//           preload={autoPlay ? "auto" : "metadata"}
//           autoPlay={autoPlay}
//           onClick={togglePlayPause}
//           onCanPlay={() => setIsLoaded(true)}
//           onWaiting={() => setIsBuffering(true)}
//         />

//         {/* Centered play/pause button */}
//         {showControls && (
//           <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
//             <IconButton 
//               onClick={togglePlayPause} 
//               size="large"
//               disabled={hasError}
//               sx={{ 
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 color: 'white',
//                 backgroundColor: 'rgba(0, 0, 0, 0.7)',
//                 '&:hover': {
//                   backgroundColor: 'rgba(0, 0, 0, 0.9)',
//                   transform: 'translate(-50%, -50%) scale(1.1)'
//                 },
//                 '&:disabled': {
//                   opacity: 0.5
//                 },
//                 width: 54,
//                 height: 54,
//                 zIndex: 2,
//                 visibility: isBuffering ? 'hidden' : 'visible'
//               }}
//             >
//               {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
//             </IconButton>
//           </Tooltip>
//         )}

//         {/* Fallback poster or error message */}
//         {(!isLoaded || hasError) && poster && (
//           <Box
//             component="img"
//             src={poster}
//             alt="Video preview"
//             loading="eager"
//             decoding="async"
//             onLoad={() => setIsPosterLoaded(true)}
//             sx={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100%',
//               objectFit: 'contain',
//               cursor: 'pointer',
//               zIndex: 1,
//               filter: hasError ? 'grayscale(80%)' : 'none',
//               opacity: isPosterLoaded ? 1 : 0,
//               transition: 'opacity 0.3s ease-in-out',
//             }}
//             onClick={togglePlayPause}
//           />
//         )}

//         {hasError && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               color: 'white',
//               backgroundColor: 'rgba(0,0,0,0.7)',
//               padding: 2,
//               borderRadius: 1,
//               zIndex: 2,
//               textAlign: 'center',
//               maxWidth: '80%'
//             }}
//           >
//             Failed to load video. Click to retry.
//           </Box>
//         )}

//         {/* Controls */}
//         {showControls && (
//           <Box
//             className="video-controls"
//             sx={{
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               right: 0,
//               p: 1,
//               background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
//               opacity: isPlaying ? 0.7 : 1,
//               transition: 'opacity 0.3s',
//               '&:hover': { opacity: 1 },
//               zIndex: 2
//             }}
//           >
//             {/* Progress bar */}
//             <Box sx={{ position: 'relative', width: '100%', height: 4, mb: 1 }}>
//               <Slider
//                 value={progress}
//                 onChange={(e, newValue) => {
//                   if (videoRef.current && duration > 0) {
//                     videoRef.current.currentTime = (newValue / 100) * duration;
//                   }
//                 }}
//                 sx={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   color: 'primary.main',
//                   height: 4,
//                   '& .MuiSlider-thumb': {
//                     width: 12,
//                     height: 12,
//                     transition: '0.2s cubic-bezier(.47,1.64,.41,.8)',
//                     '&:hover': { width: 16, height: 16 },
//                   },
//                   '& .MuiSlider-rail': {
//                     display: 'none'
//                   },
//                   '& .MuiSlider-track': {
//                     backgroundColor: '#ff9800'
//                   }
//                 }}
//               />
//             </Box>

//             {/* Control buttons */}
//             <Box display="flex" alignItems="center" gap={1} px={1}>
//               <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
//                 <IconButton 
//                   onClick={toggleMute} 
//                   size="small" 
//                   disabled={hasError}
//                   sx={{ 
//                     color: 'white',
//                     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//                     '&:hover': {
//                       backgroundColor: 'rgba(0, 0, 0, 0.9)'
//                     },
//                     '&:disabled': {
//                       opacity: 0.5
//                     }
//                   }}
//                 >
//                   {isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
//                 </IconButton>
//               </Tooltip>

//               <Box 
//                 sx={{ 
//                   color: 'white', 
//                   fontSize: '0.75rem',
//                   ml: 1,
//                   minWidth: '60px',
//                   textAlign: 'center'
//                 }}
//               >
//                 {duration > 0 && !hasError && (
//                   <>
//                     {formatTime((progress / 100) * duration)} / {formatTime(duration)}
//                   </>
//                 )}
//               </Box>

//               <Box flexGrow={1} />

//               {document.pictureInPictureEnabled && (
//                 <Tooltip title="Picture-in-Picture">
//                   <IconButton 
//                     onClick={togglePipMode} 
//                     size="small" 
//                     disabled={hasError}
//                     sx={{ 
//                       color: 'white',
//                       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                       '&:hover': {
//                         backgroundColor: 'rgba(0, 0, 0, 0.7)'
//                       },
//                       '&:disabled': {
//                         opacity: 0.5
//                       }
//                     }}
//                   >
//                     <PictureInPicture fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//               )}

//               <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
//                 <IconButton 
//                   onClick={toggleFullscreen} 
//                   size="small" 
//                   disabled={hasError}
//                   sx={{ 
//                     color: 'white',
//                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                     '&:hover': {
//                       backgroundColor: 'rgba(0, 0, 0, 0.7)'
//                     },
//                     '&:disabled': {
//                       opacity: 0.5
//                     }
//                   }}
//                 >
//                   {isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
//                 </IconButton>
//               </Tooltip>
//             </Box>
//           </Box>
//         )}
//       </Box>

//       {/* PIP fallback dialog */}
//       {pipMode && !document.pictureInPictureEnabled && (
//         <Dialog
//           open={pipMode}
//           onClose={() => setPipMode(false)}
//           PaperProps={{
//             sx: {
//               position: 'fixed',
//               bottom: 16,
//               right: 16,
//               width: 300,
//               height: 200,
//               m: 0,
//               overflow: 'hidden',
//               borderRadius: 2,
//               boxShadow: 6
//             }
//           }}
//         >
//           <DialogContent sx={{ p: 0 }}>
//             <video
//               src={videoUrl}
//               autoPlay
//               muted={isMuted}
//               loop
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'cover'
//               }}
//             />
//             <Box
//               sx={{
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 p: 1,
//                 background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
//                 display: 'flex',
//                 justifyContent: 'center'
//               }}
//             >
//               <IconButton 
//                 onClick={() => setPipMode(false)} 
//                 size="small" 
//                 sx={{ color: 'white' }}
//               >
//                 <FullscreenExit fontSize="small" />
//               </IconButton>
//             </Box>
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   );
// };


import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { 
  Box, IconButton, Tooltip, Slider, CircularProgress 
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
    if (!video) return;

    let hls;

    if (videoUrl.endsWith('.m3u8')) {
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
              width: 64,
              height: 64
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