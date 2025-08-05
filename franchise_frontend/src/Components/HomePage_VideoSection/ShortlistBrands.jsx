import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { ArrowBack, ArrowForward, ArrowRight, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import HomePageBrandCard from './HomePageBrandCard'; // adjust import as needed

const ShortlistBrands = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);       // ✅ start as true
  const [error, setError] = useState(null);
  const [removeMsg, setRemoveMsg] = useState('');
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showStartShadow, setShowStartShadow] = useState(false);
  const [showEndShadow, setShowEndShadow] = useState(true);

  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollRequestRef = useRef(null);
  const id = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID") 
  if(!id) {
    return null
  }

  const dimensions = {
    mobile: { width: 280, height: 520 },
    tablet: { width: 320, height: 560 },
    desktop: { width: 327, height: 500 },
  }[isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'];

  const easeInOutQuad = (t) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  // ✏️ Added: smoothScrollTo
  const smoothScrollTo = useCallback((target, immediate = false) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (scrollRequestRef.current) cancelAnimationFrame(scrollRequestRef.current);

    const start = container.scrollLeft;
    const change = target - start;
    const duration = immediate ? 0 : 500;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);
      container.scrollLeft = start + change * ease;

      if (progress < 1) {
        scrollRequestRef.current = requestAnimationFrame(animateScroll);
      } else {
        handleScroll(); // update shadows after scroll
      }
    };

    scrollRequestRef.current = requestAnimationFrame(animateScroll);
  }, []);

  // ✏️ Added: calculate scroll distance based on card width + gap
  const getScrollDistance = useCallback(() => {
    return dimensions.width + (isMobile ? 16 : 24);
  }, [dimensions.width, isMobile]);

  // ✏️ Changed: handlePrevClick
  const handlePrevClick = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = getScrollDistance();
    const newScroll = Math.max(container.scrollLeft - distance, 0);
    smoothScrollTo(newScroll);
  }, [getScrollDistance, smoothScrollTo]);

  // ✏️ Changed: handleNextClick
  const handleNextClick = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = getScrollDistance();
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newScroll = Math.min(container.scrollLeft + distance, maxScroll);
    smoothScrollTo(newScroll);
  }, [getScrollDistance, smoothScrollTo]);

  // ✏️ Changed: scroll shadow logic
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowStartShadow(container.scrollLeft > 10);
    setShowEndShadow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  }, []);

   useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    handleScroll(); // initial shadows
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollRequestRef.current) cancelAnimationFrame(scrollRequestRef.current);
    };
  }, [handleScroll]);

  // ✅ Fetch brands once
  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/v1/brandlisting/getAllBrandListing');
      console.log('Fetched raw data:', res.data);

      const fetched = res.data?.brands || res.data?.data || res.data;
      console.log('Extracted brands:', fetched);

      setBrands(Array.isArray(fetched) ? fetched : fetched?.brands || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load brands:', err);
      setError(err.message || 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleLikeClick = useCallback((id) => {
    console.log('Like clicked:', id);
  }, []);

  const handleApply = useCallback((brand) => {
    console.log('Apply clicked:', brand);
  }, []);

  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          py: isMobile ? 1 : 2,
          px: isMobile ? 0 : 2,
          maxWidth: isMobile ? '100%' : 1400,
          mx: 'auto',
          position: 'relative',
        }}
      >
        {removeMsg && (
          <Box sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#4caf50',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography>{removeMsg}</Typography>
            <IconButton size="small" onClick={() => setRemoveMsg('')}>
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            variant={isMobile ? 'body1' : 'h5'}
            fontWeight="bold"
            sx={{
              color: 'black',
              mb: 1,
              textAlign: 'left',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                background: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
                mt: 1,
                borderRadius: 2,
              },
            }}
          >
            Your Sortlist Brands
          </Typography>

          <Button
            variant="text"
            size="small"
            endIcon={<ArrowRight />}
            sx={{
              textTransform: 'none',
              fontSize: isMobile ? 14 : 16,
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
                backgroundColor: 'transparent',
              },
            }}
            onClick={() => window.open('/brandviewpage', '_blank')}
          >
            View More
          </Button>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Button
            onClick={handlePrevClick}
            disabled={!showStartShadow}
            sx={{
              position: 'absolute',
              left: isMobile ? 2 : 8,
              top: '55%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              minWidth: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'action.hover' },
              '&:disabled': { opacity: 0, pointerEvents: 'none' },
            }}
          >
            <ArrowBack fontSize="small" />
          </Button>

          <Button
            onClick={handleNextClick}
            disabled={!showEndShadow}
            sx={{
              position: 'absolute',
              right: isMobile ? 4 : 8,
              top: '55%',
              transform: 'translateY(-50%)',
              zIndex: 1,
              minWidth: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'action.hover' },
              '&:disabled': { opacity: 0, pointerEvents: 'none' },
            }}
          >
            <ArrowForward fontSize="small" />
          </Button>

          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: isMobile ? 2 : 3,
              p: 2,
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : brands.length ? (
              brands.map((brand) => (
                <motion.div key={brand.uuid || brand.id}>
                  <HomePageBrandCard
                    brand={brand}
                    handleApply={handleApply}
                    handleLikeClick={handleLikeClick}
                    likeProcessing={likeProcessing}
                    dimensions={dimensions}
                    theme={theme}
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </motion.div>
              ))
            ) : (
              <Typography>No brands found</Typography>
            )}
          </Box>
        </Box>

        {/* Optional: Login modal */}
        {showLogin && (
          <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
        )}
      </Box>
    </>
  );
};

export default ShortlistBrands;
