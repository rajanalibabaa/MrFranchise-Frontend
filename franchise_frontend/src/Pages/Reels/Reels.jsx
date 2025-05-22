import React, { useEffect, useRef } from 'react';
import { Box, Card, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../../Components/Navbar/NavBar';

const sampleVideos = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
  'https://media.w3.org/2010/05/bunny/movie.mp4',
];

const Reels = () => {
  const videoRefs = useRef([]);

  useEffect(() => {
    const observers = videoRefs.current.map((ref) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            ref.play().catch((error) => {
              if (error.name === 'NotAllowedError') {
                // Handle play restrictions
              }
            });
          } else {
            ref.pause();
          }
        },
        { threshold: 0.9 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Navbar at top */}
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
        <Navbar />
      </Box>

      {/* Scrollable reels below navbar */}
      <Box
        sx={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          backgroundColor: '#000',
          pt: '56px', // Add top padding to avoid overlapping with navbar
          '-webkit-overflow-scrolling': 'touch',
        }}
      >
        {sampleVideos.map((src, index) => (
          <motion.div
            key={index}
            style={{
              scrollSnapAlign: 'start',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Card
              sx={{
                width: '100%',
                maxWidth: 'calc(100vh * 9/16)', // 9:16 aspect ratio
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 6,
              }}
            >
              <CardMedia
                component="video"
                ref={(el) => (videoRefs.current[index] = el)}
                src={src}
                muted
                loop
                playsInline
                preload="auto"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default Reels;
