import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BrandDetailsControl from './BrandDetailsControl';
import { Box, Button, Snackbar, Alert, CircularProgress } from '@mui/material';

// Define initial data structure matching form expectations
const initialFormData = {
  fullName: "",
  email: "",
  mobileNumber: "",
  whatsappNumber: "",
  companyName: "",
  brandName: "",
  tagLine: "",
  ceoName: "",
  ceoEmail: "",
  ceoMobile: "",
  officeEmail: "",
  officeMobile: "",
  headOfficeAddress: "",
  country: "",
  state: "",
  district: "",
  city: "",
  pincode: "",
  website: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  brandCategories: [],
  expansionLocation: []
};

const BrandListingController = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState({ 
    loading: false, 
    success: false, 
    error: '' 
  });

  // Fetch brand data on component mount
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const uuid = localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID");
        console.log("Fetching brand with UUID:", uuid);
        
        const response = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${uuid}`
        );
        
        console.log("API response:", response.data);
        
        if (response.data.success && response.data.brandListing) {
          // Merge API data with initial form structure
          const apiData = response.data.brandListing;
          const mergedData = {
            ...initialFormData,
            ...apiData,
            // Ensure nested objects are properly handled
            mobileNumber: apiData.mobileNumber || "",
            whatsappNumber: apiData.whatsappNumber || "",
            ceoMobile: apiData.ceoMobile || "",
            officeMobile: apiData.officeMobile || "",
            brandCategories: apiData.brandCategories || [],
            expansionLocation: apiData.expansionLocation || []
          };
          
          setFormData(mergedData);
        } else {
          setError('No brand data found in response');
        }
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError(err.response?.data?.message || 'Failed to load brand data');
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);

  // Handle form field updates
  const handleFormChange = (update) => {
    setFormData(prev => ({
      ...prev,
      ...update
    }));
  };

  // Save updated data to API
  const handleSave = async () => {
    setSaveStatus({ loading: true, success: false, error: '' });
    
    try {
      const uuid = localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID");
      const response = await axios.put(
        `http://localhost:5000/api/v1/brandlisting/updateBrandListingByUUID/${uuid}`,
        formData
      );
      
      if (response.data.success) {
        setSaveStatus({ loading: false, success: true, error: '' });
      } else {
        throw new Error(response.data.message || 'Failed to save changes');
      }
    } catch (err) {
      setSaveStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to save changes'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <BrandDetailsControl 
        data={formData} 
        onChange={handleFormChange} 
        errors={{}}
      />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saveStatus.loading}
          startIcon={saveStatus.loading ? <CircularProgress size={20} /> : null}
        >
          {saveStatus.loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
      
      <Snackbar
        open={saveStatus.success || !!saveStatus.error}
        autoHideDuration={6000}
        onClose={() => setSaveStatus(prev => ({ ...prev, success: false, error: '' }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={saveStatus.success ? 'success' : 'error'} 
          sx={{ width: '100%' }}
        >
          {saveStatus.success ? 'Changes saved successfully!' : saveStatus.error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BrandListingController;