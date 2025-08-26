import React, { useEffect, useState } from "react";
import axios from "axios";
import BrandDetailsEdit from "./BrandDetailsEdit";
import FranchiseDetailsControl from "./FranchiseDetailsEdit";
import ExpansionLocationControl from "./ExpansionLocationEdit";
import UploadsEdit from "./UploadsEdit";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getApi } from "../../../Api/DefaultApi";

const flattenBrandData = (brandDoc) => {
  if (!brandDoc) return {};
  return {
    // Brand Details
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
    gstNumber: brandDoc.brandDetails?.gstNumber || "",
    pancardNumber: brandDoc.brandDetails?.pancardNumber || "",

    // Franchise Details
    brandCategories: brandDoc.franchiseDetails?.brandCategories || {},
    aidFinancing: brandDoc.franchiseDetails?.aidFinancing || "",
    brandDescription: brandDoc.franchiseDetails?.brandDescription || "",
    companyOwnedOutlets: brandDoc.franchiseDetails?.companyOwnedOutlets || "",
    consultationOrAssistance:
      brandDoc.franchiseDetails?.consultationOrAssistance || "",
    establishedYear: brandDoc.franchiseDetails?.establishedYear || "",
    franchiseDevelopment: brandDoc.franchiseDetails?.franchiseDevelopment || "",
    franchiseOutlets: brandDoc.franchiseDetails?.franchiseOutlets || "",
    franchiseSinceYear: brandDoc.franchiseDetails?.franchiseSinceYear || "",
    totalOutlets: brandDoc.franchiseDetails?.totalOutlets || "",
    fico: brandDoc.franchiseDetails?.fico || [],
    trainingSupport: brandDoc.franchiseDetails?.trainingSupport || [],
    uniqueSellingPoints: brandDoc.franchiseDetails?.uniqueSellingPoints || [],

    // Expansion Data
    currentOutletLocations: brandDoc.expansionlocationdata
      ?.currentOutletLocations || {
      domestic: { locations: [] },
      international: { country: [] },
    },
    expansionLocations: brandDoc.expansionlocationdata?.expansionLocations || {
      domestic: { locations: [] },
      international: { country: [] },
    },
    isInternationalExpansion:
      brandDoc.expansionlocationdata?.isInternationalExpansion || false,
    // Uploads
    brandLogo: brandDoc.uploads?.logo || [],
    exteriorOutlet: brandDoc.uploads?.exteriorOutlet || [],
    franchisePromotionVideo: brandDoc.uploads?.franchiseVideos || [],
    gstCertificate: brandDoc.uploads?.gstCertificate || [],
    interiorOutlet: brandDoc.uploads?.interiorOutlet || [],
    pancard: brandDoc.uploads?.pancard || [],
    businessPlan: brandDoc.uploads?.businessPlan || [],
    awards: brandDoc.uploads?.awards || [],
  };
};
const BrandListingEdit = () => {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [expanded, setExpanded] = useState("panel1");
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSendError, setOtpSendError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [files, setFiles] = useState({
    brandLogo: [],
    exteriorOutlet: [],
    franchisePromotionVideo: [],
    gstCertificate: [],
    interiorOutlet: [],
    pancard: [],
    businessPlan: [],
    awardDoc: [],
  });
  const [filesToDelete, setFilesToDelete] = useState({
    // brandLogo: [],
    exteriorOutlet: [],
    // franchisePromotionVideo: [],
    // gstCertificate: [],
    interiorOutlet: [],
    // pancard: [],
    // businessPlan: [],
    awardDoc: [],
  });

  const [awardsToDelete, setAwardsToDelete] = useState([]);

  const [addExpansionData, setAddExpansionData] = useState({
    currentOutletLocations: {
      domestic: { state: [], districts: {}, city: {} },
      international: { country: [], states: {}, city: {} },
    },
    expansionLocations: {
      domestic: { state: [], districts: {}, city: {} },
      international: { country: [], states: {}, city: {} },
    },
  });
  const [removeExpansionData, setRemoveExpansionData] = useState({
    currentOutletLocations: {
      domestic: { state: [], districts: {}, city: {} },
      international: { country: [], states: {}, city: {} },
    },
    expansionLocations: {
      domestic: { state: [], districts: {}, city: {} },
      international: { country: [], states: {}, city: {} },
    },
  });

  useEffect(() => {
    const fetchBrandData = async () => {
      const uuid =
        localStorage.getItem("brandUUID") ||
        localStorage.getItem("investorUUID");

      if (!uuid) {
        setError("No UUID found.");
        setLoading(false);
        return;
      }

      try {
        const url = `http://localhost:5000/api/v1/brandlisting/getBrandById/${uuid}`;
        const response = await getApi(url);
        const brand = response?.data?.data;

        // console.log("Fetched brand data:", brand);

        if (response.data.success) {
          const flatData = flattenBrandData(brand);
          // console.log("Flattened brand data:", flatData);
          setFormData(flatData);
          setOriginalData(brand);
        } else {
          setError("No brand data found.");
        }
      } catch (err) {
        setError(err.response?.message || "Error loading data.");
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

  const handleNestedFormChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field, value) => {
    if (field === "awards") {
      // For awards, we need to preserve both description and image data
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  const handleObjectChange = (field, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value,
      },
    }));
  };

  const handleFileChange = (field, newFiles) => {
    setFiles((prev) => ({
      ...prev,
      [field]: [...prev[field], ...newFiles],
    }));
  };

  const handleRemoveFile = (field, removeIndex = null, fileUrl = null) => {
    if (fileUrl) {
      setFilesToDelete((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), fileUrl],
      }));
    } else if (removeIndex !== null) {
      setFiles((prev) => {
        const updatedFiles = [...prev[field]];
        updatedFiles.splice(removeIndex, 1);
        return {
          ...prev,
          [field]: updatedFiles,
        };
      });
    }
  };

  const handleAwardDelete = (index) => {
    setAwardsToDelete((prev) => [...prev, index]);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
  };

  const handleCloseOtpDialog = () => {
    setShowOtpDialog(false);
    setOtp("");
    setOtpError("");
    setOtpSent(false);
  };

  const handleEditClick = async () => {
    if (!formData.email) {
      setOtpSendError("No email found in profile");
      return;
    }

    setShowOtpDialog(true);
    setOtpSending(true);
    setOtpSendError("");
    setOtpSent(false);

    try {
      await sendOtp();
      setOtpSent(true);
    } catch (err) {
      setOtpSendError(err.message || "Error sending OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/otpverify/send-otp-email`,
        {
          email: formData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        setOtpToken(response.data.token);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpVerifying(true);
    setOtpError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/otpverify/verify-otp`,
        {
          identifier: formData.email,
          otp: otp,
          type: "email",
        },
        {
          headers: {
            Authorization: `Bearer ${otpToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data.success === true ||
        response.data.message?.includes("verified successfully")
      ) {
        setIsEditing(true);
        setShowOtpDialog(false);
      } else {
        setOtpError(response.data.error || "Invalid OTP");
      }
    } catch (err) {
      setOtpError(err.response?.data?.error || "Verification failed");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSave = async () => {
    const uuid =
      localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID");
    if (!uuid) return;

    setSaveStatus({ loading: true, success: false, error: "" });

    try {
      // Step 1: Update brand details and franchise details
      const formDataToSend = new FormData();

      // Prepare the data structure that matches the backend expectation
      const updateData = {
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
          pancardNumber: formData.pancardNumber,
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
          uniqueSellingPoints: formData.uniqueSellingPoints,
        },
      };

      // Append JSON data as strings
      formDataToSend.append(
        "brandDetails",
        JSON.stringify(updateData.brandDetails)
      );
      formDataToSend.append(
        "franchiseDetails",
        JSON.stringify(updateData.franchiseDetails)
      );
      formDataToSend.append(
        "addExpansionLocationData",
        JSON.stringify(addExpansionData)
      );
      formDataToSend.append(
        "removeExpansionLocationData",
        JSON.stringify(removeExpansionData)
      );
      formDataToSend.append(
        "isInternationalExpansion",
        formData.isInternationalExpansion
      );

      // First update the brand details
      const detailsResponse = await axios.patch(
        `http://localhost:5000/api/v1/brandlisting/updateBrandListingByUUID/${uuid}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!detailsResponse.data.success) {
        throw new Error(
          detailsResponse.data.message || "Failed to save brand details."
        );
      }

      // Step 2: Handle file uploads and deletions
      const uploadFormData = new FormData();
      let hasFilesToUpload = false;

      // Append files to upload
      const fileFields = [
        "brandLogo",
        "exteriorOutlet",
        "franchisePromotionVideo",
        "gstCertificate",
        "interiorOutlet",
        "pancard",
        "businessPlan",
        "awardDoc",
      ];

      fileFields.forEach((field) => {
        if (files[field] && files[field].length > 0) {
          files[field].forEach((file) => {
            if (file instanceof File) {
              uploadFormData.append(field, file);
              hasFilesToUpload = true;
            }
          });
        }
      });

      // In handleSave function, update the awards handling:
      if (formData.awards && formData.awards.length > 0) {
        // Send both descriptions and existing image URLs
        const awardsData = formData.awards.map((award) => ({
          awardDescription: award.awardDescription,
          // awardImage is handled separately via file upload
        }));
        uploadFormData.append("awardDescriptions", JSON.stringify(awardsData));
        hasFilesToUpload = true;
      }

      // Append files to delete
      if (Object.keys(filesToDelete).length > 0) {
        // console.log("Files to delete ========== :", filesToDelete);
        uploadFormData.append("imageDeleteData", JSON.stringify(filesToDelete));
        hasFilesToUpload = true;
      }

      // Append awards to delete
      if (awardsToDelete.length > 0) {
        console.log("Awards to delete ========== :", awardsToDelete);
        uploadFormData.append("awardsToDelete", JSON.stringify(awardsToDelete));
        hasFilesToUpload = true;
      }

      console.log("Uploading files:", uploadFormData);

      // Only make the upload request if there are files to upload or delete
      if (hasFilesToUpload) {
        const uploadResponse = await axios.patch(
          `http://localhost:5000/api/v1/brandlisting/updateBrandImageById/${uuid}`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!uploadResponse.data.success) {
          throw new Error(
            uploadResponse.data.message || "Failed to upload files."
          );
        }
      }

      // Refresh the data after successful update
      const refreshResponse = await getApi(
        `http://localhost:5000/api/v1/brandlisting/getBrandById/${uuid}`
      );
      const updatedBrand = refreshResponse?.data?.data;

      if (refreshResponse.data.success) {
        const flatData = flattenBrandData(updatedBrand);
        setFormData(flatData);
        setOriginalData(updatedBrand);
        setSaveStatus({ loading: false, success: true, error: "" });
        setIsEditing(false);

        // Clear files and deletions after successful upload
        setFiles({
          brandLogo: [],
          exteriorOutlet: [],
          franchisePromotionVideo: [],
          gstCertificate: [],
          interiorOutlet: [],
          pancard: [],
          businessPlan: [],
          awardDoc: [],
        });
        setFilesToDelete({
          brandLogo: [],
          exteriorOutlet: [],
          franchisePromotionVideo: [],
          gstCertificate: [],
          interiorOutlet: [],
          pancard: [],
          businessPlan: [],
          awardDoc: [],
        });
        setAwardsToDelete([]);
      } else {
        throw new Error("Failed to refresh data after update.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || err.message || "Save failed.",
      });
    }
  };

  const handleCancel = () => {
    setFormData(flattenBrandData(originalData));
    setIsEditing(false);

    // Clear any unsaved files and deletions
    setFiles({
      brandLogo: [],
      exteriorOutlet: [],
      franchisePromotionVideo: [],
      gstCertificate: [],
      interiorOutlet: [],
      pancard: [],
      businessPlan: [],
      awardDoc: [],
    });
    setFilesToDelete({
      brandLogo: [],
      exteriorOutlet: [],
      franchisePromotionVideo: [],
      gstCertificate: [],
      interiorOutlet: [],
      pancard: [],
      businessPlan: [],
      awardDoc: [],
    });
    setAwardsToDelete([]);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );

  return (
    <Box>
      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onClose={handleCloseOtpDialog}>
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          {otpSending && !otpSent && (
            <Box textAlign="center" mb={2}>
              <CircularProgress size={24} />
              <DialogContentText sx={{ mt: 1 }}>
                Sending OTP to {formData.email}...
              </DialogContentText>
            </Box>
          )}

          {otpSendError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {otpSendError}
            </Alert>
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
              setOtpSendError("");
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
            sx={{ ml: "auto" }}
          >
            {otpSending ? <CircularProgress size={20} /> : "Resend OTP"}
          </Button>
          <Button
            onClick={verifyOtp}
            color="primary"
            variant="contained"
            disabled={!otp || otp.length !== 6 || otpSending || otpVerifying}
          >
            {otpVerifying ? <CircularProgress size={20} /> : "Verify"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit / Save Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
              startIcon={
                saveStatus.loading ? <CircularProgress size={20} /> : null
              }
              sx={{ mr: 2 }}
            >
              {saveStatus.loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              disabled={saveStatus.loading}
            >
              Cancel
            </Button>
          </>
        )}
      </Box>

      {/* Brand Details */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Brand Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BrandDetailsEdit
            data={formData}
            onChange={handleFormChange}
            errors={{}}
            isEditing={isEditing}
          />
        </AccordionDetails>
      </Accordion>

      {/* Franchise Details */}
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Franchise Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FranchiseDetailsControl
            data={formData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
            onArrayChange={handleArrayChange}
            onObjectChange={handleObjectChange}
            errors={{}}
            isEditing={isEditing}
          />
        </AccordionDetails>
      </Accordion>

      {/* Expansion Location */}
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleAccordionChange("panel3")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Expansion Location</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ExpansionLocationControl
            data={formData}
            onChange={handleFormChange}
            onNestedChange={handleNestedFormChange}
            onObjectChange={handleObjectChange}
            onAddRemoveChange={(data) => {
              setAddExpansionData(data.addExpansionLocationData);
              setRemoveExpansionData(data.removeExpansionLocationData);
            }}
            errors={{}}
            isEditing={isEditing}
          />
        </AccordionDetails>
      </Accordion>

      {/* Uploads */}
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleAccordionChange("panel4")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Uploads</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <UploadsEdit
            data={formData}
            files={files}
            onChange={handleFormChange}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            onArrayChange={handleArrayChange}
            onAwardDelete={handleAwardDelete}
            errors={{}}
            isEditing={isEditing}
          />
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={saveStatus.success || !!saveStatus.error}
        autoHideDuration={6000}
        onClose={() =>
          setSaveStatus((prev) => ({ ...prev, success: false, error: "" }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={saveStatus.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {saveStatus.success
            ? "Changes saved successfully!"
            : saveStatus.error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BrandListingEdit;
