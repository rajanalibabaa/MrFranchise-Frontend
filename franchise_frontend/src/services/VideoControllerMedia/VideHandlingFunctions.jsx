import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const VideoControllerContext = createContext();

export const VideoControllerProvider = ({ children }) => {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const videoRefs = useRef(new Map());
  const cleanupRefs = useRef(new Map());
  const playAttempts = useRef(new Map());
  const eventListeners = useRef(new Map());

  // Helper to safely add/remove event listeners
  const addEventListeners = (id, video, handlePlay, handlePause) => {
    // Clean old listeners if present
    if (eventListeners.current.has(id)) {
      const { play: oldPlay, pause: oldPause } = eventListeners.current.get(id);
      video.removeEventListener('play', oldPlay);
      video.removeEventListener('pause', oldPause);
    }
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    eventListeners.current.set(id, { play: handlePlay, pause: handlePause });
  };

  const removeEventListeners = (id, video) => {
    if (eventListeners.current.has(id) && video) {
      const { play, pause } = eventListeners.current.get(id);
      video.removeEventListener('play', play);
      video.removeEventListener('pause', pause);
      eventListeners.current.delete(id);
    }
  };

  const registerVideo = (id, ref) => {
    if (ref) {
      videoRefs.current.set(id, ref);
      // Setup cleanup
      cleanupRefs.current.set(id, () => {
        removeEventListeners(id, ref);
        if (videoRefs.current.get(id) === ref) {
          videoRefs.current.delete(id);
          playAttempts.current.delete(id);
        }
      });
    }
    return () => cleanupRefs.current.get(id)?.();
  };

  const unregisterVideo = (id) => {
    // Remove listeners and clean-up
    const video = videoRefs.current.get(id);
    removeEventListeners(id, video);
    cleanupRefs.current.get(id)?.();
    cleanupRefs.current.delete(id);
    playAttempts.current.delete(id);
  };

  const playVideo = async (id) => {
    try {
      // Pause any other currently playing video
      if (currentPlayingId && currentPlayingId !== id) {
        const prevVideo = videoRefs.current.get(currentPlayingId);
        if (prevVideo && !prevVideo.paused) {
          prevVideo.pause();
        }
      }

      const video = videoRefs.current.get(id);
      if (!video) return;

      // Reset video if needed
      if (video.readyState === 0) {
        video.load();
      }

      // Prevent runaway attempts
      const attemptCount = (playAttempts.current.get(id) || 0) + 1;
      playAttempts.current.set(id, attemptCount);
      if (attemptCount > 3) {
        console.warn("Max play attempts reached for video", id);
        playAttempts.current.delete(id);
        return;
      }

      // Create handlers
      const handlePause = () => {
        if (currentPlayingId === id) setCurrentPlayingId(null);
      };
      const handlePlay = () => {
        playAttempts.current.delete(id);
        setCurrentPlayingId(id);
      };

      // Set *ONE* event listener set per id/video
      addEventListeners(id, video, handlePlay, handlePause);

      await video.play().catch(async (err) => {
        if (err.name === 'AbortError') {
          console.warn("Playback aborted (e.g. power saving):", err);
          removeEventListeners(id, video);
          // Wait and try again
          await new Promise(resolve => setTimeout(resolve, 300));
          return playVideo(id);
        }
        removeEventListeners(id, video);
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
    removeEventListeners(id, video);
    playAttempts.current.delete(id);
  };

  // Cleanup everything on unmount
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video, id) => {
        if (video && !video.paused) video.pause();
        removeEventListeners(id, video);
      });
      videoRefs.current.clear();
      cleanupRefs.current.clear();
      playAttempts.current.clear();
      eventListeners.current.clear();
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
