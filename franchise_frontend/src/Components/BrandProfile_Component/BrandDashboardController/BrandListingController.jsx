
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BrandDetailsControl from './BrandDetailsControl';
import FranchiseDetailsControl from './FranchiseDetailsControl';
import ExpansionLocationControl from './ExpansionLocationControl';
import UploadsControl from './UploadsControl';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
   Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
   Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const flattenBrandData = (brandDoc) => {
  if (!brandDoc) return {};
  return {
    fullName: brandDoc.brandDetails?.fullName || "",
    email: brandDoc.brandDetails?.email || "",
    mobileNumber: brandDoc.brandDetails?.mobileNumber || "",
    whatsappNumber: brandDoc.brandDetails?.whatsappNumber || "",
    companyName: brandDoc.brandDetails?.companyName || "",
    brandName: brandDoc.brandDetails?.brandName || "",
    tagLine: brandDoc.brandDetails?.tagLine || "",
    ceoName: brandDoc.brandDetails?.ceoName || "",
    ceoEmail: brandDoc.brandDetails?.ceoEmail || "",
    ceoMobile: brandDoc.brandDetails?.ceoMobile || "",
    officeEmail: brandDoc.brandDetails?.officeEmail || "",
    officeMobile: brandDoc.brandDetails?.officeMobile || "",
    headOfficeAddress: brandDoc.brandDetails?.headOfficeAddress || "",
    country: brandDoc.brandDetails?.country || "",
    state: brandDoc.brandDetails?.state || "",
    district: brandDoc.brandDetails?.district || "",
    city: brandDoc.brandDetails?.city || "",
    pincode: brandDoc.brandDetails?.pincode || "",
    website: brandDoc.brandDetails?.website || "",
    facebook: brandDoc.brandDetails?.facebook || "",
    instagram: brandDoc.brandDetails?.instagram || "",
    linkedin: brandDoc.brandDetails?.linkedin || "",
   
    brandCategories: brandDoc.franchiseDetails?.brandCategories || [],
    aidFinancing: brandDoc.franchiseDetails?.aidFinancing || "",
    brandDescription: brandDoc.franchiseDetails?.brandDescription || "",
    companyOwnedOutlets: brandDoc.franchiseDetails?.companyOwnedOutlets || "",
    consultationOrAssistance: brandDoc.franchiseDetails?.consultationOrAssistance || "",
    establishedYear: brandDoc.franchiseDetails?.establishedYear || "",
    franchiseDevelopment: brandDoc.franchiseDetails?.franchiseDevelopment || "",
    franchiseOutlets: brandDoc.franchiseDetails?.franchiseOutlets || "",
    franchiseSinceYear: brandDoc.franchiseDetails?.franchiseSinceYear || "",
    totalOutlets: brandDoc.franchiseDetails?.totalOutlets || "",
    fico: brandDoc.franchiseDetails?.fico || [],
    trainingSupport: brandDoc.franchiseDetails?.trainingSupport || [],
    uniqueSellingPoints: brandDoc.franchiseDetails?.uniqueSellingPoints || [],
    currentOutletLocations: brandDoc.expansionLocationData?.currentOutletLocations || {},
    expansionLocations: brandDoc.expansionLocationData?.expansionLocations || {},
    isInternationalExpansion: brandDoc.expansionLocationData?.isInternationalExpansion || "No",
    brandLogo: brandDoc.uploads?.brandLogo || [],
    exteriorOutlet: brandDoc.uploads?.exteriorOutlet || [],
    franchisePromotionVideo: brandDoc.uploads?.franchisePromotionVideo || [],
    gstCertificate: brandDoc.uploads?.gstCertificate || [],
    interiorOutlet: brandDoc.uploads?.interiorOutlet || [],
    pancard: brandDoc.uploads?.pancard || [],
    businessPlan: brandDoc.uploads?.businessPlan || [],
awards: brandDoc.uploads?.awards || [],
gstNumber: brandDoc.brandDetails?.gstNumber || "",
pancardNumber: brandDoc.brandDetails?.pancardNumber || "",
  };
};

const unflattenFormData = (formData) => ({
  brandDetails: {
    fullName: formData.fullName,
    email: formData.email,
    mobileNumber: formData.mobileNumber,
    whatsappNumber: formData.whatsappNumber,
    companyName: formData.companyName,
    brandName: formData.brandName,
    tagLine: formData.tagLine,
    ceoName: formData.ceoName,
    ceoEmail: formData.ceoEmail,
    ceoMobile: formData.ceoMobile,
    officeEmail: formData.officeEmail,
    officeMobile: formData.officeMobile,
    headOfficeAddress: formData.headOfficeAddress,
    country: formData.country,
    state: formData.state,
    district: formData.district,
    city: formData.city,
    pincode: formData.pincode,
    website: formData.website,
    facebook: formData.facebook,
    instagram: formData.instagram,
    linkedin: formData.linkedin,
    gstNumber: formData.gstNumber,
    pancardNumber: formData.pancardNumber
  },
  franchiseDetails: {
    brandCategories: formData.brandCategories,
    aidFinancing: formData.aidFinancing,
    brandDescription: formData.brandDescription,
    companyOwnedOutlets: formData.companyOwnedOutlets,
    consultationOrAssistance: formData.consultationOrAssistance,
    establishedYear: formData.establishedYear,
    franchiseDevelopment: formData.franchiseDevelopment,
    franchiseOutlets: formData.franchiseOutlets,
    franchiseSinceYear: formData.franchiseSinceYear,
    totalOutlets: formData.totalOutlets,
    fico: formData.fico,
    trainingSupport: formData.trainingSupport,
    uniqueSellingPoints: formData.uniqueSellingPoints
  },
  expansionLocationData: {
    currentOutletLocations: formData.currentOutletLocations,
    expansionLocations: formData.expansionLocations,
    isInternationalExpansion: formData.isInternationalExpansion
  },
  uploads: {
    brandLogo: formData.brandLogo,
    exteriorOutlet: formData.exteriorOutlet,
    franchisePromotionVideo: formData.franchisePromotionVideo,
    gstCertificate: formData.gstCertificate,
    interiorOutlet: formData.interiorOutlet,
    pancard: formData.pancard,
    businessPlan: formData.businessPlan,
    awards: formData.awards

  }
});

const BrandListingController = () => {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState({ loading: false, success: false, error: '' });
const [isEditing, setIsEditing] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [expanded, setExpanded] = useState("panel1");
  const [otp, setOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSendError, setOtpSendError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const fetchBrandData = async () => {
      const uuid = localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID");
      if (!uuid) {
        setError("No UUID found.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${uuid}`
        );
        const brand = response.data.brandListing || response.data.data;
        if (response.data.success && brand) {
          // console.log("data id:",response.data.data);
          const flatData = flattenBrandData(brand);
          setFormData(flatData);
          setOriginalData(brand);
        } else {
          setError("No brand data found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);
const handleFormChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
 const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError('');
  };

  const handleCloseOtpDialog = () => {
    setShowOtpDialog(false);
    setOtp('');
    setOtpError('');
  };

  
 const handleEditClick = async () => {
    if (!formData.email) {
      setOtpSendError('No email found in profile');
      return;
    }

    setShowOtpDialog(true);
    setOtpSending(true);
    setOtpSendError('');
    setOtpSent(false); 
    
    try {
      await sendOtp();
      setOtpSent(true); 
    } catch (err) {
      setOtpSendError(err.message || 'Error sending OTP');
    } finally {
      setOtpSending(false);
    }
  };

const [otpToken, setOtpToken] = useState(null); // store token

const sendOtp = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/otpverify/send-otp-email', 
        {
          email: formData.email,
        
        },{
          headers:{
            'Content-Type':'application/json'
          }
        }
      );

      if(response.data.token){
        setOtpToken(response.data.token); // ✅ Store token
      // Show OTP dialog/modal here
      }

      if (response.data.success) {
        throw new Error(response.data.message || 'Failed to send OTP');
      }
    } catch (err) { 
      throw new Error(err.response?.data?.message || 'Error sending OTP');
    }
  };


 const verifyOtp = async () => {

  if (!otp || otp.length !== 6) {
    setOtpError('Please enter a valid 6-digit OTP');
    return;
  }

  setOtpVerifying(true);
  setOtpError('');

  try {

    const response = await axios.post(
      'http://localhost:5000/api/v1/otpverify/verify-otp',
      {
        identifier: formData.email,
        otp: otp,
        type: "email"
      },
      {
        headers: {
          Authorization: `Bearer ${otpToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success === true || response.data.message?.includes("verified successfully")) {
      setIsEditing(true);
      setShowOtpDialog(false);
    } else {
      setOtpError(response.data.error || 'Invalid OTP');
    }
  } catch (err) {
    setOtpError(err.response?.data?.error || 'Verification failed');
  } finally {
    setOtpVerifying(false);
  }
};


  const handleSave = async () => {
    const uuid = localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID");
    if (!uuid) return;

    setSaveStatus({ loading: true, success: false, error: '' });

    try {
      const apiData = unflattenFormData(formData);
      const response = await axios.patch(
        `http://localhost:5000/api/v1/brandlisting/updateBrandListingByUUID/${uuid}`,
        apiData
      );
      if (response.data.success) {
        setOriginalData(response.data.brandListing || response.data.data);
        setSaveStatus({ loading: false, success: true, error: '' });
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || "Failed to save.");
      }
    } catch (err) {
      setSaveStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || "Save failed."
      });
    }
  };

  const handleDirectUpdate = async () => {
  const uuid = localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID");
  if (!uuid) {
    setSaveStatus({ loading: false, success: false, error: "UUID not found" });
    return;
  }

  setSaveStatus({ loading: true, success: false, error: '' });
  console.log("apiData",apiData)

  try {
    const apiData = unflattenFormData(formData); 
    const response = await axios.put(
      `http://localhost:5000/api/v1/brandlisting/updateBrandListingByUUID/${uuid}`,
      apiData
    );

    if (response.data.success) {
      setOriginalData(response.data.brandListing || response.data.data); 
      setSaveStatus({ loading: false, success: true, error: '' });
    } else {
      throw new Error(response.data.message || 'Update failed');
    }
  } catch (err) {
    setSaveStatus({
      loading: false,
      success: false,
      error: err.response?.data?.message || "Update failed",
    });
  }
};

const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

 if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

// // {otpSendError && (
// //   <Alert severity="error" sx={{ mb: 2 }} onClose={() => setOtpSendError('')}>
// //     {otpSendError}
// //   </Alert>
// )}
  return (
    
   <Box>
      {/* OTP Verification Dialog */}
      {otpSendError && (
  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setOtpSendError('')}>
    {otpSendError}
  </Alert>
)}

  <Dialog open={showOtpDialog} onClose={handleCloseOtpDialog}>
  <DialogTitle>Verify OTP</DialogTitle>
 <DialogContent>
  {otpSending && (
    <Box textAlign="center" mb={2}>
      <CircularProgress size={24} />
      <DialogContentText sx={{ mt: 1 }}>
        Sending OTP to {formData.email}...
      </DialogContentText>
    </Box>
  )}

  {otpSent && (
    <Alert severity="success" sx={{ mb: 2 }}>
      OTP has been sent to {formData.email}
    </Alert>
  )}

  <TextField
    autoFocus
    margin="dense"
    label="OTP *"
    type="text"
    fullWidth
    variant="outlined"
    value={otp}
    onChange={handleOtpChange}
    error={!!otpError}
    helperText={otpError || "Enter 6-digit verification code"}
    placeholder="Enter 6-digit code"
    disabled={otpSending || otpVerifying}
    inputProps={{ maxLength: 6 }}
  />
</DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button 
      onClick={handleCloseOtpDialog} 
      disabled={otpVerifying}
      variant="outlined"
    >
      Cancel
    </Button>
    <Button 
      onClick={async () => {
        setOtpSending(true);
        setOtpSendError('');
        setOtpSent(false); 
        try {
          await sendOtp();
          setOtpSent(true);
        } catch (err) {
          setOtpSendError(err.message);
        } finally {
          setOtpSending(false);
        }
      }}
      disabled={otpSending || otpVerifying}
      variant="outlined"
      sx={{ ml: 'auto' }}
    >
      {otpSending ? <CircularProgress size={20} /> : 'Resend OTP'}
    </Button>
    <Button
      onClick={verifyOtp}
      color="primary"
      variant="contained"
      disabled={!otp || otp.length !== 6 || otpSending || otpVerifying}
    >
      {otpVerifying ? <CircularProgress size={20} /> : 'Verify'}
    </Button>
  </DialogActions>
</Dialog>

 {/* Edit / Save Buttons */}
 
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {!isEditing ? (
         <Button variant="outlined" onClick={handleEditClick}>
  Edit
</Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saveStatus.loading}
              startIcon={saveStatus.loading ? <CircularProgress size={20} /> : null}
              sx={{ mr: 2 }}
            >
              {saveStatus.loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setFormData(flattenBrandData(originalData));
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>
    {/* Brand Details */}
      <Accordion expanded={expanded === "panel1"} onChange={handleAccordionChange("panel1")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Brand Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CardContent>
            <BrandDetailsControl
              data={formData}
              onChange={handleFormChange}
              errors={{}}
             isEditing={isEditing}
      setIsEditing={setIsEditing}
            />
          </CardContent>
        </AccordionDetails>
      </Accordion>

      {/* Franchise Details */}
      <Accordion expanded={expanded === "panel2"} onChange={handleAccordionChange("panel2")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Franchise Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CardContent>
            <FranchiseDetailsControl
              data={formData}
              onChange={handleFormChange}
              errors={{}}
          isEditing={isEditing}
      setIsEditing={setIsEditing}
            />
          </CardContent>
        </AccordionDetails>
      </Accordion>

      {/* Expansion Location */}
      <Accordion expanded={expanded === "panel3"} onChange={handleAccordionChange("panel3")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Expansion Location</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CardContent>
            <ExpansionLocationControl
              data={formData}
              onChange={handleFormChange}
              errors={{}}
            isEditing={isEditing}
      setIsEditing={setIsEditing}
            />
          </CardContent>
        </AccordionDetails>
      </Accordion>

      {/* Uploads */}
      <Accordion expanded={expanded === "panel4"} onChange={handleAccordionChange("panel4")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Uploads</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CardContent>
            <UploadsControl
              data={formData}
              onChange={handleFormChange}
              errors={{}}
         isEditing={isEditing}
      setIsEditing={setIsEditing}
            />
          </CardContent>
        </AccordionDetails>
      </Accordion>
     
<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
  <Button
    variant="contained"
    color="secondary"
    onClick={handleDirectUpdate}
    disabled={saveStatus.loading}
  >
    {saveStatus.loading ? <CircularProgress size={20} /> : "Update"}
  </Button>
</Box>

<Snackbar
  open={saveStatus.success || !!saveStatus.error}
  autoHideDuration={6000}
  onClose={() => setSaveStatus({ ...saveStatus, success: false, error: '' })}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert severity={saveStatus.success ? 'success' : 'error'} sx={{ width: '100%' }}>
    {saveStatus.success ? 'Changes saved successfully!' : saveStatus.error}
  </Alert>
</Snackbar>
      {/* Snackbar Notification */}
      <Snackbar
        open={saveStatus.success || !!saveStatus.error}
        autoHideDuration={6000}
        onClose={() => setSaveStatus({ ...saveStatus, success: false, error: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={saveStatus.success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {saveStatus.success ? 'Changes saved successfully!' : saveStatus.error}
        </Alert>
      </Snackbar>
    </Box>
    
  );
};
export default BrandListingController;

