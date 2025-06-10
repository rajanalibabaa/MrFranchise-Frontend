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
import { Link } from '@mui/material';



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
          // `http://51.20.81.150:5000/api/v1/brandlisting/getAllBrandListing/${brandUUID}`,
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brandUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );

        // console.log("Response from API:", response.data.data);
        if (response.data && response.data.data) {
          const data = response.data.data;
          // console.log("Fetched Brand Data:", data);
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
  console.log("Brand Data:", branddata.franchiseDetails);

  // console.log("Brand Data:", branddata.franchiseDetails.map((item) => item.investmentRange));
  const renderContent = () => {
    switch (selectedSection) {
      case 'personalDetails':
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Personal Details</Typography>
            <Typography>FullName: {branddata.personalDetails.fullName}</Typography>
            <Typography>Email: {branddata.personalDetails.email}</Typography>
            <Typography>Mobile Number: {branddata.personalDetails.mobileNumber}</Typography>
            {/* <Typography>WhatsApp Number: {branddata.personalDetails.whatsappNumber}</Typography> */}
            <Typography>Brand Name: {branddata.personalDetails.brandName}</Typography>
            <Typography>Company Name: {branddata.personalDetails.companyName}</Typography>
            <Typography>Country: {branddata.personalDetails.country}</Typography>
            <Typography>Pincode: {branddata.personalDetails.pincode}</Typography>
            <Typography>Head Office Address: {branddata.personalDetails.headOfficeAddress}</Typography>
            <Typography>State: {branddata.personalDetails.state}</Typography>
            <Typography>City: {branddata.personalDetails.city}</Typography>
            <Typography>Established Year: {branddata.personalDetails.establishedYear}</Typography>
            {/* <Typography>Expansion Location: {branddata.expansionLocation}</Typography> */}
            <Typography>
              Website:
              <Link
                href={branddata.personalDetails.website || "https://example.com"}
                target="_blank"
                rel="noopener"
                sx={{ ml: 1 }}
              >
                {branddata.personalDetails.website || "https://example.com"}
              </Link>
            </Typography>

            <Typography>
              Facebook:
              <Link
                href={branddata.personalDetails.facebook || "https://facebook.com/example"}
                target="_blank"
                rel="noopener"
                sx={{ ml: 1 }}
              >
                {branddata.personalDetails.facebook || "https://facebook.com/example"}
              </Link>
            </Typography>

            <Typography>
              Instagram:
              <Link
                href={branddata.personalDetails.instagram || "https://instagram.com/example"}
                target="_blank"
                rel="noopener"
                sx={{ ml: 1 }}
              >
                {branddata.personalDetails.instagram || "https://instagram.com/example"}
              </Link>
            </Typography>

            <Typography>
              LinkedIn:
              <Link
                href={branddata.personalDetails.linkedin || "https://linkedin.com/company/example"}
                target="_blank"
                rel="noopener"
                sx={{ ml: 1 }}
              >
                {branddata.personalDetails.linkedin || "https://linkedin.com/company/example"}
              </Link>
            </Typography>

          </Paper>
        );
      case 'franchiseDetails':
        return (
          // <Paper sx={{ p: 4 }}>
          //   <Typography variant="h5" gutterBottom>Franchise Details</Typography>
          //   <Typography>Investment Range: {branddata.investmentRange}</Typography>
          //   <Typography>Area Required: {branddata.areaRequired}</Typography>
          //   <Typography>Franchise Model: {branddata.franchiseModel}</Typography>
          //   <Typography>Franchise Type: {branddata.franchiseType}</Typography>
          //   <Typography>Franchise Fee: {branddata.franchiseFee}</Typography>
          //   <Typography>Royalty Fee: {branddata.royaltyFee}</Typography>
          //   <Typography>Interior Cost: {branddata.interiorCost}</Typography>
          //   <Typography>Exterior Cost: {branddata.exteriorCost}</Typography>
          //   <Typography>Other Cost: {branddata.otherCost}</Typography>
          //   <Typography>ROI: {branddata.roi}</Typography>
          //   <Typography>Break Even: {branddata.breakEven}</Typography>
          //   <Typography>Required Investment Capital: {branddata.requireInvestmentCapital}</Typography>
          //   <Typography>Company Owned Outlets: {branddata.companyOwnedOutlets}</Typography>
          //   <Typography>Franchise Outlets: {branddata.franchiseOutlets}</Typography>
          //   <Typography>Total Outlets: {branddata.totalOutlets}</Typography>
          //   <Typography>Requirement Support: {branddata.requirementSupport}</Typography>
          //   <Typography>Training Provided By: {branddata.trainingProvidedBy}</Typography>
          //   <Typography>Agreement Periods: {branddata.agreementPeriods}</Typography>
          //   <Typography>Property Type: {branddata.propertyType}</Typography>
          // </Paper>
          <div>
            <Typography variant="h5" gutterBottom>Franchise Details</Typography>

            {branddata.franchiseDetails && branddata.franchiseDetails.modelsOfFranchise.length > 0 ? (
              <div>
                {
                  branddata.franchiseDetails.modelsOfFranchise.map((item, index) => (
                    <div key={index}>


                      <Typography>investmentRange: {item.investmentRange}</Typography>
                      <Typography>areaRequired: {item.areaRequired}</Typography>
                      <Typography>franchiseModel: {item.franchiseModel}</Typography>
                      <Typography>franchiseType: {item.franchiseType}</Typography>
                      <Typography>franchiseFee: {item.franchiseFee}</Typography>
                      <Typography>royaltyFee: {item.royaltyFee}</Typography>
                      <Typography>interiorCost: {item.interiorCost}</Typography>
                      <Typography>exteriorCost: {item.exteriorCost}</Typography>
                      <Typography>otherCost: {item.otherCost}</Typography>
                      <Typography>roi: {item.roi}</Typography>
                      <Typography>breakEven: {item.breakEven}</Typography>
                      <Typography>required Investment Capital: {!item.requiredInvestmentCapital ? ("N/A") : (
                        <div>{item.requiredInvestmentCapital}</div>
                      )}</Typography>
                      <Typography>propertyType: {item.propertyType}</Typography>
                    </div>
                  ))
                }
              </div>
            )
              : (
                <Typography color="textSecondary">No franchise details available.</Typography>
              )}
          </div>
        );
      case 'brandDetails':
        return (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Brand Details</Typography>

            <Typography>PAN Card:</Typography>
            {branddata.brandDetails.pancard?.[0] ? (
              <img
                src={branddata.brandDetails.pancard[0]}
                alt="PAN Card"
                style={{ width: '200px', marginBottom: '10px' }}
              />
            ) : (
              <Typography color="textSecondary">No PAN card uploaded</Typography>
            )}

           
            <Typography>GST Certificate:</Typography>
            {branddata.brandDetails.gstCertificate ? (
              <img
                src={branddata.brandDetails.gstCertificate}
                alt="GST Certificate"
                style={{ width: '200px', marginBottom: '10px' }}
              />
            ) : (
              <Typography color="textSecondary">No GST Certificate uploaded</Typography>
            )}

        
            <Typography>Brand Logo:</Typography>
            {branddata.brandDetails.brandLogo ? (
              <img
                src={branddata.brandDetails.brandLogo}
                alt="Brand Logo"
                style={{ width: '150px', marginBottom: '10px' }}
              />
            ) : (
              <Typography color="textSecondary">No Brand Logo uploaded</Typography>
            )}

            {/* Company Image */}
            {/* <Typography>Company Image:</Typography>
            {branddata.brandDetails.companyImage ? (
              <img
                src={branddata.brandDetails.companyImage}
                alt="Company"
                style={{ width: '250px', marginBottom: '10px' }}
              />
            ) : (
              <Typography color="textSecondary">No Company Image uploaded</Typography>
            )} */}

            {/* Exterior Outlet */}
            {/* <Typography>Exterior Outlet:</Typography>
            {branddata.brandDetails.exteriorOutlet ? (
              <img
                src={branddata.brandDetails.exteriorOutlet}
                alt="Exterior"
                style={{ width: '250px', marginBottom: '10px' }}
              />
            ) : (
              <Typography color="textSecondary">No Exterior Outlet image</Typography>
            )} */}

           
            <Typography>Interior Outlet:</Typography>

            {Array.isArray(branddata.brandDetails.interiorOutlet) && branddata.brandDetails.interiorOutlet.length > 0 ? (
              branddata.brandDetails.interiorOutlet.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Interior ${index + 1}`}
                  style={{ width: '250px', marginBottom: '10px', marginRight: '10px' }}
                />
              ))
            ) : (
              <Typography color="textSecondary">No Interior Outlet image</Typography>
            )}
           
            <Typography>Franchise Promotion Video:</Typography>
            {branddata.brandDetails.franchisePromotionVideo ? (
              <video width="320" height="240" controls style={{ marginBottom: '10px' }}>
                <source src={branddata.brandDetails.franchisePromotionVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Typography color="textSecondary">No Franchise Promotion Video uploaded</Typography>
            )}

            
            <Typography>Brand Promotion Video:</Typography>
            {branddata.brandDetails.brandPromotionVideo ? (
              <video width="320" height="240" controls>
                <source src={branddata.brandPromotionVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Typography color="textSecondary">No Brand Promotion Video uploaded</Typography>
            )}
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
