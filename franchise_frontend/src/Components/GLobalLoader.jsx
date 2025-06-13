import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/videos/Animation - 1749816697493.json';

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  // Optimized Lottie configuration
  const lottieConfig = {
    animationData: loadingAnimation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true // Better for large animations
    }
  };

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
        backdropFilter: 'blur(2px)',
        pointerEvents: 'none', // Allows clicks to pass through when loading
      }}
    >
      <Box sx={{
        width: { xs: 500, sm: 300, md: 400 },
        height: { xs: 500, sm: 300, md: 400 },
      }}>
        <Lottie 
          {...lottieConfig}
          style={{
            willChange: 'transform', // Optimizes for animations
            filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.1))'
          }}
        />
      </Box>
    </Box>
  );
};

export default React.memo(GlobalLoader); // Memoize to prevent unnecessary re-renders