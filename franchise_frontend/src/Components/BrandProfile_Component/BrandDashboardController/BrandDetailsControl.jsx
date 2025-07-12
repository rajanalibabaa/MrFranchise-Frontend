import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  CircularProgress,
  Box,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';

const BrandDetailsControl = () => {
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const brandUUID = localStorage.getItem('brandUUID');

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brandUUID}`
        );
        setBrandData(response.data?.data || {});
      } catch (error) {
        console.error('Error fetching brand details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (brandUUID) fetchBrandDetails();
  }, [brandUUID]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!brandData || !brandData.brandDetails) {
    return <Typography>No brand data available.</Typography>;
  }

  const bd = brandData.brandDetails; // shortcut

  return (
    <Box sx={{ px: { xs: 2, md: 10 }, py: 4 }}>
      <Typography
        sx={{
          fontSize: '30px',
          textAlign: 'center',
          color: '#7ad03a',
          fontWeight: 'bold',
          mb: 4
        }}
      >
        BRAND DETAILS
      </Typography>

      {/* Login Details */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#ff9800' }}>
        Login Credentials
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Full Name" value={bd.fullName || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Email" value={bd.email || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Phone Number" value={bd.mobileNumber || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="WhatsApp Number" value={bd.whatsappNumber || ''} InputProps={{ readOnly: true }} />
        </Grid>
      </Grid>

      {/* Brand Details */}
      <Typography variant="h6" fontWeight={700} sx={{ my: 3, color: '#ff9800' }}>
        Brand Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Company Name" value={bd.companyName || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Brand Name" value={bd.brandName || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Tagline" value={bd.tagLine || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="CEO/MD/Owner Name" value={bd.ceoName || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="CEO Email" value={bd.ceoEmail || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="CEO Mobile" value={bd.ceoMobile || ''} InputProps={{ readOnly: true }} />
        </Grid>
      </Grid>

      {/* Head Office Location */}
      <Typography variant="h6" fontWeight={700} sx={{ my: 3, color: '#ff9800' }}>
        Head Office Location
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Office Email" value={bd.officeEmail || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Office Mobile" value={bd.officeMobile || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Head Office Address" value={bd.headOfficeAddress || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Country" value={bd.country || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Pincode" value={bd.pincode || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="State" value={bd.state || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="District" value={bd.district || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="City" value={bd.city || ''} InputProps={{ readOnly: true }} />
        </Grid>
      </Grid>

      {/* Social & Website */}
      <Typography variant="h6" fontWeight={700} sx={{ my: 3, color: '#ff9800' }}>
        Website & Social Media
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Website"
            value={bd.website || ''}
            InputProps={{
              readOnly: true,
              startAdornment: <InputAdornment position="start">https://</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Facebook" value={bd.facebook || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Instagram" value={bd.instagram || ''} InputProps={{ readOnly: true }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="LinkedIn" value={bd.linkedin || ''} InputProps={{ readOnly: true }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BrandDetailsControl;
