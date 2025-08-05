import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import media1 from '../../assets/videos/mediaVideo1.mp4';
// import media2 from '../../assets/videos/mediaVideo2.mp4';
// import { } from "../../../Redux/Slices/GetAllBrandsDataUpdationFile"
const mediaList = [
  { src: media1, title: 'Brand One' },
  { src: media1, title: 'Brand Two' },
  { src: media1, title: 'Brand Two' },
  
];

function RegisterationMediaHandling() {
  return (
    <Box py={6} px={2} bgcolor="#f9f9f9">
      <Typography
        variant="h5"
        textAlign="center"
        fontWeight="bold"
        gutterBottom
      >
        Showcase Your Advertisements
      </Typography>

     

      <Grid container spacing={3} justifyContent="center">
        {mediaList.map((media, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Box
              sx={{
                width: '100%',
                aspectRatio: '9 / 16',
                maxHeight: 500,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 4,
                backgroundColor: '#000',
                transition: 'transform 0.3s',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 1,
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px 8px',
                  borderRadius: 1,
                  fontWeight: 500,
                }}
              >
                {media.title}
              </Typography>
              <video
                src={media.src}
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RegisterationMediaHandling;
