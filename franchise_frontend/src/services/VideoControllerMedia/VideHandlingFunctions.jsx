// VideoControllerContext.js
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const VideoControllerContext = createContext();

export const VideoControllerProvider = ({ children }) => {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const videoRefs = useRef(new Map());
  const cleanupRefs = useRef(new Map());
  const playAttempts = useRef(new Map());

  const registerVideo = (id, ref) => {
    if (ref) {
      videoRefs.current.set(id, ref);
      // Store cleanup callback
      cleanupRefs.current.set(id, () => {
        if (videoRefs.current.get(id) === ref) {
          videoRefs.current.delete(id);
          playAttempts.current.delete(id);
        }
      });
    }
    return () => cleanupRefs.current.get(id)?.();
  };

  const unregisterVideo = (id) => {
    cleanupRefs.current.get(id)?.();
    cleanupRefs.current.delete(id);
    playAttempts.current.delete(id);
  };

  const playVideo = async (id) => {
    try {
      // Pause currently playing video if different
      if (currentPlayingId && currentPlayingId !== id) {
        const prevVideo = videoRefs.current.get(currentPlayingId);
        if (prevVideo && !prevVideo.paused) {
          prevVideo.pause();
        }
      }

      const video = videoRefs.current.get(id);
      if (!video) return;

      // Reset video if needed to ensure clean playback
      if (video.readyState === 0) {
        video.load();
      }

      // Track play attempts to prevent infinite loops
      const attemptCount = (playAttempts.current.get(id) || 0) + 1;
      playAttempts.current.set(id, attemptCount);
      
      if (attemptCount > 3) {
        console.warn("Max play attempts reached for video", id);
        playAttempts.current.delete(id);
        return;
      }

      // Add event listeners for power-saving related pauses
      const handlePause = () => {
        if (currentPlayingId === id) {
          setCurrentPlayingId(null);
        }
      };

      const handlePlay = () => {
        playAttempts.current.delete(id);
        setCurrentPlayingId(id);
      };

      video.addEventListener('pause', handlePause);
      video.addEventListener('play', handlePlay);

      await video.play().catch(async (err) => {
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('play', handlePlay);
        
        if (err.name === 'AbortError') {
          console.warn("Playback aborted due to power saving or other interruption");
          // Try again after a small delay
          await new Promise(resolve => setTimeout(resolve, 300));
          return playVideo(id);
        }
        throw err;
      });

      setCurrentPlayingId(id);
    } catch (err) {
      console.error("Playback failed:", err);
      playAttempts.current.delete(id);
    }
  };

  const pauseVideo = (id) => {
    const video = videoRefs.current.get(id);
    if (video && !video.paused) {
      video.pause();
      if (currentPlayingId === id) {
        setCurrentPlayingId(null);
      }
    }
    playAttempts.current.delete(id);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Pause all videos on context unmount
      videoRefs.current.forEach(video => {
        if (video && !video.paused) video.pause();
      });
      videoRefs.current.clear();
      cleanupRefs.current.clear();
      playAttempts.current.clear();
    };
  }, []);

  return (
    <VideoControllerContext.Provider
      value={{
        currentPlayingId,
        playVideo,
        pauseVideo,
        registerVideo,
        unregisterVideo
      }}
    >
      {children}
    </VideoControllerContext.Provider>
  );
};

export const useVideoController = () => {
  const context = useContext(VideoControllerContext);
  if (!context) {
    throw new Error('useVideoController must be used within a VideoControllerProvider');
  }
  return context;
};