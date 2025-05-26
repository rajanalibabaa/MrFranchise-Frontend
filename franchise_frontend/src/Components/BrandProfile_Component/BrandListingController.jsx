import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Paper,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProfileSection = () => {
  const brandUUID = useSelector((state) => state.auth?.brandUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);
  const [selectedSection, setSelectedSection] = useState('');
  const [branddata, setBranddata] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!brandUUID || !AccessToken) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID${brandUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );
        if (response.data && response.data.data) {
          const data = response.data.data;
          if (data.mobileNumber?.startsWith('+91')) {
            data.mobileNumber = data.mobileNumber.replace('+91', '');
          }
          if (data.whatsappNumber?.startsWith('+91')) {
            data.whatsappNumber = data.whatsappNumber.replace('+91', '');
          }
          setBranddata(data);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandUUID, AccessToken]);

  const handleChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'personalDetails':
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Personal Details</Typography>
            <Typography>FullName: {branddata.fullName}</Typography>
            <Typography>Email: {branddata.email}</Typography>
            <Typography>Mobile Number: {branddata.mobileNumber}</Typography>
            <Typography>WhatsApp Number: {branddata.whatsappNumber}</Typography>
            <Typography>Brand Name: {branddata.brandName}</Typography>
            <Typography>Company Name: {branddata.companyName}</Typography>
            <Typography>Country: {branddata.country}</Typography>
            <Typography>Pincode: {branddata.pincode}</Typography>
            <Typography>Head Office Address: {branddata.headOfficeAddress}</Typography>
            <Typography>State: {branddata.state}</Typography>
            <Typography>City: {branddata.city}</Typography>
            <Typography>Established Year: {branddata.establishedYear}</Typography>
            <Typography>Expansion Location: {branddata.expansionLocation}</Typography>
            <Typography>Website: {branddata.website}</Typography>
            <Typography>Facebook: {branddata.facebook}</Typography>
            <Typography>Instagram: {branddata.instagram}</Typography>
            <Typography>LinkedIn: {branddata.linkedin}</Typography>
          </Paper>
        );
      case 'franchiseDetails':
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Franchise Details</Typography>
            <Typography>Investment Range: {branddata.investmentRange}</Typography>
            <Typography>Area Required: {branddata.areaRequired}</Typography>
            <Typography>Franchise Model: {branddata.franchiseModel}</Typography>
            <Typography>Franchise Type: {branddata.franchiseType}</Typography>
            <Typography>Franchise Fee: {branddata.franchiseFee}</Typography>
            <Typography>Royalty Fee: {branddata.royaltyFee}</Typography>
            <Typography>Interior Cost: {branddata.interiorCost}</Typography>
            <Typography>Exterior Cost: {branddata.exteriorCost}</Typography>
            <Typography>Other Cost: {branddata.otherCost}</Typography>
            <Typography>ROI: {branddata.roi}</Typography>
            <Typography>Break Even: {branddata.breakEven}</Typography>
            <Typography>Required Investment Capital: {branddata.requireInvestmentCapital}</Typography>
            <Typography>Company Owned Outlets: {branddata.companyOwnedOutlets}</Typography>
            <Typography>Franchise Outlets: {branddata.franchiseOutlets}</Typography>
            <Typography>Total Outlets: {branddata.totalOutlets}</Typography>
            <Typography>Requirement Support: {branddata.requirementSupport}</Typography>
            <Typography>Training Provided By: {branddata.trainingProvidedBy}</Typography>
            <Typography>Agreement Periods: {branddata.agreementPeriods}</Typography>
            <Typography>Property Type: {branddata.propertyType}</Typography>
          </Paper>
        );
      case 'brandDetails':
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Brand Details</Typography>
            <Typography>PAN Card: {branddata.pancard}</Typography>
            <Typography>GST Certificate: {branddata.gstCertificate}</Typography>
            <Typography>Brand Logo: {branddata.brandLogo}</Typography>
            <Typography>Company Image: {branddata.companyImage}</Typography>
            <Typography>Exterior Outlet: {branddata.exteriorOutlet}</Typography>
            <Typography>Interior Outlet: {branddata.interiorOutlet}</Typography>
            <Typography>Franchise Promotion Video: {branddata.franchisePromotionVideo}</Typography>
            <Typography>Brand Promotion Video: {branddata.brandPromotionVideo}</Typography>
          </Paper>
        );
      default:
        return (
          <Typography color="textSecondary">
            Please select a section from the dropdown
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 250, p: 3, borderRight: '1px solid #ccc' }}>
        <Typography variant="h6" gutterBottom>Choose Section</Typography>
        <FormControl fullWidth>
          <InputLabel id="section-label">Section</InputLabel>
          <Select
            labelId="section-label"
            value={selectedSection}
            onChange={handleChange}
            label="Section"
          >
            <MenuItem value="personalDetails">Personal Details</MenuItem>
            <MenuItem value="franchiseDetails">Franchise Details</MenuItem>
            <MenuItem value="brandDetails">Brand Details</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        {loading ? <Typography>Loading...</Typography> : renderContent()}
      </Box>
    </Box>
  );
};

export default ProfileSection;
