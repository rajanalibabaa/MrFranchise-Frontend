// VideoControllerContext.js
import React, { createContext, useContext, useState, useRef } from 'react';

const VideoControllerContext = createContext();

export const VideoControllerProvider = ({ children }) => {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const videoRefs = useRef({});

  const registerVideo = (id, ref) => {
    videoRefs.current[id] = ref;
  };

  const unregisterVideo = (id) => {
    delete videoRefs.current[id];
  };

  const playVideo = (id) => {
    // Pause currently playing video
    if (currentPlayingId && currentPlayingId !== id && videoRefs.current[currentPlayingId]) {
      videoRefs.current[currentPlayingId].pause();
    }
    
    // Play new video
    if (videoRefs.current[id]) {
      videoRefs.current[id].play()
        .then(() => setCurrentPlayingId(id))
        .catch(err => console.error("Playback failed:", err));
    }
  };

  const pauseVideo = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause();
      if (currentPlayingId === id) {
        setCurrentPlayingId(null);
      }
    }
  };

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

export const useVideoController = () => useContext(VideoControllerContext);