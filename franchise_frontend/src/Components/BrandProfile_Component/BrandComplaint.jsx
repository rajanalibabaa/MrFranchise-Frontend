import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion } from 'framer-motion';

const brandData = [
  {
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    name: 'HealthPharmacy',
    logo: 'https://via.placeholder.com/32x32?text=H',
    category: 'Healthcare',
    investment: '18–20 Lakhs',
    area: '100–200 SqFt',
    desc: 'Top pharmacy chain offering trusted medicines.',
  },
  {
    video: 'https://www.w3schools.com/html/movie.mp4',
    name: 'Fitlouse',
    logo: 'https://via.placeholder.com/32x32?text=F',
    category: 'Fitness',
    investment: '20–25 Lakhs',
    area: '200–400 SqFt',
    desc: 'Leading fitness brand with global presence.',
  },
];

function TopBrandVdoSec() {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % brandData.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + brandData.length) % brandData.length);

  const brand = brandData[index];

  return (
    <Box sx={{ p: 4, maxWidth: '1000px', mx: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Top Brand
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Video Section */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            height: 300,
          }}
        >
          <video
            key={brand.video}
            src={brand.video}
            controls
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />

          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              left: 8,
              transform: 'translateY(-50%)',
              bgcolor: 'white',
            }}
            onClick={handlePrev}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              bgcolor: 'white',
            }}
            onClick={handleNext}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Content Section */}
        <Card
          component={motion.div}
          key={brand.name}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          sx={{
            flex: 1,
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-4px)',
            },
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar src={brand.logo} variant="rounded" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {brand.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {brand.category}
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ px: 0, pt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              💰 <strong>{brand.investment}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              📐 <strong>{brand.area}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {brand.desc}
            </Typography>
          </CardContent>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: '#ffa000',
              textTransform: 'none',
              alignSelf: 'flex-start',
              px: 3,
              '&:hover': {
                backgroundColor: '#ff8f00',
              },
            }}
          >
            Apply
          </Button>
        </Card>
      </Box>
    </Box>
  );
}

export default TopBrandVdoSec;
