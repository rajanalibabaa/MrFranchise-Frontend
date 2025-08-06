import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  styled,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  FormControl,
  InputLabel,
  Chip,
  TextField,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  InfoOutlined,
  CloudUpload,
  VideoCameraBack,
  Description,
  PhotoCamera,
  ErrorOutline,
  CheckCircle,
  Delete,
  Edit,
} from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[1],
}));

const UploadButton = styled(Button)(({ theme }) => ({
  height: 56,
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.warning.main,
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
}));

const FilePreviewImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 4,
});

const UploadsControl = ({
  data = {},
  errors = {},
  onChange,
  onArrayChange,
  isEditing = false,
}) => {
  const theme = useTheme();
  const [editAwardIndex, setEditAwardIndex] = useState(null);
  const [currentAward, setCurrentAward] = useState({
    text: "",
    document: null,
  });
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editFileIndex, setEditFileIndex] = useState(null);

  // Reset edit states when editing is toggled
  useEffect(() => {
    if (!isEditing) {
      setEditingField(null);
      setEditFileIndex(null);
      setEditAwardIndex(null);
      setCurrentAward({ text: "", document: null });
    }
  }, [isEditing]);

  const handleFileChange =
    (field, options = {}) =>
    (e) => {
      if (!isEditing) return;

      const { maxFiles = Infinity, allowedTypes = [], maxSize = 5 } = options;
      const files = Array.from(e.target.files || []);

      // Validate file types
      const validFiles = files.filter((file) => {
        if (!file || !file.type) return false;
        if (allowedTypes.length === 0) return true;
        return allowedTypes.some((type) => file.type.includes(type));
      });

      // Validate file size (in MB)
      const sizeValidFiles = validFiles.filter(
        (file) => file.size <= maxSize * 1024 * 1024
      );

      if (sizeValidFiles.length < validFiles.length) {
        alert(`Some files exceed the maximum size of ${maxSize}MB`);
      }

      // Validate number of files
      const currentFiles = data[field] || [];
      const totalFiles = currentFiles.length + sizeValidFiles.length;

      if (totalFiles > maxFiles) {
        alert(`Maximum ${maxFiles} file(s) allowed for this field`);
        return;
      }

      // If we're editing a specific file, replace it
      if (editingField === field && editFileIndex !== null) {
        const updatedFiles = [...currentFiles];
        updatedFiles[editFileIndex] = sizeValidFiles[0];
        onArrayChange(field, updatedFiles);
        setEditingField(null);
        setEditFileIndex(null);
      } else {
        // Otherwise add new files
        const updatedFiles = [...currentFiles, ...sizeValidFiles];
        onArrayChange(field, updatedFiles);
      }
    };

  const handleRemoveFile = (field, index) => {
    if (!isEditing) return;
    
    const updatedFiles = [...(data[field] || [])];
    updatedFiles.splice(index, 1);
    onArrayChange(field, updatedFiles);
    
    if (editingField === field && editFileIndex === index) {
      setEditingField(null);
      setEditFileIndex(null);
    }
  };

  const startEditFile = (field, index) => {
    setEditingField(field);
    setEditFileIndex(index);
  };

  const cancelEditFile = () => {
    setEditingField(null);
    setEditFileIndex(null);
  };

  const createObjectURL = (file) => {
    if (!file) return "";
    try {
      if (file instanceof Blob) {
        return URL.createObjectURL(file);
      }
      return file;
    } catch (error) {
      console.error("Error creating object URL:", error);
      return "";
    }
  };

  const handleAwardTextChange = (e) => {
    setCurrentAward((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  const handleAwardFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentAward((prev) => ({
        ...prev,
        document: file,
      }));
    }
  };

  const handleAddAward = () => {
    if (!currentAward.text || !currentAward.document) return;

    const updatedAwards = [...(data.awards || [])];
    
    if (editAwardIndex !== null) {
      updatedAwards[editAwardIndex] = {
        text: currentAward.text,
        document: currentAward.document,
      };
    } else {
      updatedAwards.push({
        text: currentAward.text,
        document: currentAward.document,
      });
    }

    onArrayChange("awards", updatedAwards);
    setCurrentAward({ text: "", document: null });
    setEditAwardIndex(null);
    setFormSubmitted(false);
  };

  const handleEditAward = (index) => {
    const award = data.awards[index];
    setCurrentAward({
      text: award.text,
      document: award.document,
    });
    setEditAwardIndex(index);
  };

  const handleDeleteAward = (index) => {
    const updatedAwards = [...(data.awards || [])];
    updatedAwards.splice(index, 1);
    onArrayChange("awards", updatedAwards);
    setConfirmDeleteIndex(null);
  };

  const handleCancelEdit = () => {
    setCurrentAward({ text: "", document: null });
    setEditAwardIndex(null);
    setFormSubmitted(false);
  };

  const isFileBeingEdited = (field, index) => {
    return editingField === field && editFileIndex === index;
  };

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Section 1: Brand Identity */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Brand Identity
          <Tooltip title="Drag and drop your logo here or click to upload" placement="right-start" arrow enterTouchDelay={0}>
            <IconButton size="small" sx={{ color: "warning.main", "&:hover": { backgroundColor: "info.main", color: "white" }, marginLeft: "5px" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        <Grid container spacing={3} sx={{ display: { md: "flex" } }} justifyContent={"space-evenly"}>
          {/* Brand Logo */}
          <Grid item xs={12} md={6}>
            <Typography textAlign={"center"} mb={1} variant="body2">
              Brand Logo
            </Typography>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "400px" } }}>
                {editingField === "brandLogo" && editFileIndex === 0 ? (
                  <>
                    <UploadButton component="label" color="success" variant="outlined" startIcon={<CloudUpload />}>
                      Replace Logo
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange("brandLogo", { maxFiles: 1, allowedTypes: ["image/jpeg", "image/png"], maxSize: 2 })}
                      />
                    </UploadButton>
                    <Button variant="outlined" aria-label="cancel" color="error" onClick={cancelEditFile} sx={{ mt: 1 }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <UploadButton component="label" color="success" variant="outlined" startIcon={<CloudUpload />} disabled={!isEditing}>
                    Upload Logo
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange("brandLogo", { maxFiles: 1, allowedTypes: ["image/jpeg", "image/png"], maxSize: 2 })}
                    />
                  </UploadButton>
                )}
                <Typography variant="caption" color={errors.brandLogo ? "error" : "textSecondary"}>
                  {errors.brandLogo || "(Accepted formats: JPEG, PNG up to 2MB)"}
                </Typography>

                {data.brandLogo?.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    {typeof data.brandLogo[0] === "string" ? (
                      <>
                        <img
                          src={data.brandLogo[0]}
                          alt="Brand Logo"
                          loading="lazy"
                          style={{ height: 60, borderRadius: 4, border: "1px solid #ccc", padding: 4 }}
                        />
                        {isEditing && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton onClick={() => startEditFile("brandLogo", 0)} color="primary" size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleRemoveFile("brandLogo", 0)} color="error" size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </>
                    ) : (
                      <>
                        <Chip
                          label={data.brandLogo[0].name}
                          onDelete={isEditing ? () => handleRemoveFile("brandLogo", 0) : undefined}
                          deleteIcon={<CheckCircle fontSize="small" />}
                          variant="outlined"
                          color="success"
                        />
                        {isEditing && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton onClick={() => startEditFile("brandLogo", 0)} color="primary" size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleRemoveFile("brandLogo", 0)} color="error" size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>

          {/* Promotion Videos */}
          <Grid item xs={12} md={6} sx={{ mt: { md: 0, xs: 3 } }}>
            <Typography textAlign={"center"} mb={1} variant="body2">
              Franchise Promotion Video
            </Typography>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "400px" } }}>
                {editingField === "franchisePromotionVideo" && editFileIndex === 0 ? (
                  <>
                    <UploadButton component="label" variant="outlined" color="success" startIcon={<VideoCameraBack />}>
                      Replace Video
                      <VisuallyHiddenInput
                        type="file"
                        accept="video/mp4,video/quicktime"
                        onChange={handleFileChange("franchisePromotionVideo", { maxFiles: 1, allowedTypes: ["video/mp4", "video/quicktime"], maxSize: 25 })}
                      />
                    </UploadButton>
                    <Button variant="outlined" aria-label="cancel" color="error" onClick={cancelEditFile} sx={{ mt: 1 }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <UploadButton component="label" variant="outlined" color="success" startIcon={<VideoCameraBack />} disabled={!isEditing}>
                    Upload Video
                    <VisuallyHiddenInput
                      type="file"
                      accept="video/mp4,video/quicktime"
                      onChange={handleFileChange("franchisePromotionVideo", { maxFiles: 1, allowedTypes: ["video/mp4", "video/quicktime"], maxSize: 25 })}
                    />
                  </UploadButton>
                )}
                <Typography variant="caption" color={errors.franchisePromotionVideo ? "error" : "textSecondary"}>
                  {errors.franchisePromotionVideo || "Accepted formats: MP4, Quicktime Video (up to 25MB)"}
                </Typography>
                {data.franchisePromotionVideo?.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    {typeof data.franchisePromotionVideo[0] === "string" ? (
                      <>
                        <video src={data.franchisePromotionVideo[0]} controls style={{ width: 200, borderRadius: 4 }} />
                        {isEditing && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton onClick={() => startEditFile("franchisePromotionVideo", 0)} color="primary" size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleRemoveFile("franchisePromotionVideo", 0)} color="error" size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </>
                    ) : (
                      <>
                        <Chip
                          label={data.franchisePromotionVideo[0].name}
                          onDelete={isEditing ? () => handleRemoveFile("franchisePromotionVideo", 0) : undefined}
                          deleteIcon={<CheckCircle fontSize="small" />}
                          variant="outlined"
                          color="success"
                        />
                        {isEditing && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton onClick={() => startEditFile("franchisePromotionVideo", 0)} color="primary" size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleRemoveFile("franchisePromotionVideo", 0)} color="error" size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 2: Company Credentials */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Company Credentials
          <Tooltip title="Upload your company credentials documents" placement="right-start" arrow enterTouchDelay={0}>
            <IconButton size="small" sx={{ color: "warning.main", "&:hover": { backgroundColor: "info.main", color: "white" }, marginLeft: "5px" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        <Grid container spacing={3} sx={{ display: { md: "flex" } }} justifyContent={"space-evenly"}>
          {/* PAN Details */}
          <Grid item xs={12} md={6} sx={{ mr: { md: 2 } }}>
            <TextField
              label="PAN Number"
              fullWidth
              value={data.pancardNumber || ""}
              onChange={(e) => onChange("pancardNumber", e.target.value.toUpperCase())}
              error={!!errors.pancardNumber}
              helperText={errors.pancardNumber}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 10, pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}", title: "PAN must be in format: AAAAA9999A" }}
              disabled={!isEditing}
            />

            <InputLabel shrink sx={{ mb: 1 }}>
              PAN Card Upload
            </InputLabel>
            {editingField === "pancard" && editFileIndex === 0 ? (
              <>
                <UploadButton component="label" variant="outlined" startIcon={<Description />} fullWidth color="success">
                  Replace PAN Card
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileChange("pancard", { maxFiles: 1, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 1 })}
                  />
                </UploadButton>
                <Button variant="outlined" aria-label="cancel" color="error" onClick={cancelEditFile} sx={{ mt: 1 }}>
                  Cancel
                </Button>
              </>
            ) : (
              <UploadButton component="label" variant="outlined" startIcon={<Description />} fullWidth color="success" disabled={!isEditing}>
                Upload PAN Card
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={handleFileChange("pancard", { maxFiles: 1, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 1 })}
                />
              </UploadButton>
            )}
            <Typography variant="caption" color={errors.pancard ? "error" : "textSecondary"}>
              {errors.pancard || "Accepted formats: PDF, JPEG, PNG (up to 1MB)"}
            </Typography>
            {data.pancard?.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                {typeof data.pancard[0] === "string" ? (
                  <>
                    {data.pancard[0].endsWith(".pdf") ? (
                      <Chip
                        label="PAN Card (PDF)"
                        onDelete={isEditing ? () => handleRemoveFile("pancard", 0) : undefined}
                        deleteIcon={<CheckCircle fontSize="small" />}
                        variant="outlined"
                        color="success"
                      />
                    ) : (
                      <Box component="img" src={data.pancard[0]} alt="PAN Preview" loading="lazy" sx={{ width: 100, borderRadius: 1, border: "1px solid #ccc" }} />
                    )}
                    {isEditing && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => startEditFile("pancard", 0)} color="primary" size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleRemoveFile("pancard", 0)} color="error" size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Chip
                      label={data.pancard[0].name}
                      onDelete={isEditing ? () => handleRemoveFile("pancard", 0) : undefined}
                      deleteIcon={<CheckCircle fontSize="small" />}
                      variant="outlined"
                      color="success"
                    />
                    {isEditing && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => startEditFile("pancard", 0)} color="primary" size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleRemoveFile("pancard", 0)} color="error" size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            )}
          </Grid>

          {/* GST Details */}
          <Grid item xs={12} md={6} sx={{ mt: { xs: 3, md: 0 }, ml: { md: 2 } }}>
            <TextField
              label="GST Number"
              fullWidth
              value={data.gstNumber || ""}
              onChange={(e) => onChange("gstNumber", e.target.value.toUpperCase())}
              error={!!errors.gstNumber}
              helperText={errors.gstNumber}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 15, pattern: "[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}", title: "GST must be in format: 22AAAAA0000A1Z5" }}
              disabled={!isEditing}
            />

            <InputLabel shrink sx={{ mb: 1 }}>
              GST Certificate Upload
            </InputLabel>
            {editingField === "gstCertificate" && editFileIndex === 0 ? (
              <>
                <UploadButton component="label" variant="outlined" startIcon={<Description />} fullWidth color="success">
                  Replace GST Certificate
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileChange("gstCertificate", { maxFiles: 1, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 1 })}
                  />
                </UploadButton>
                <Button variant="outlined" aria-label="cancel" color="error" onClick={cancelEditFile} sx={{ mt: 1 }}>
                  Cancel
                </Button>
              </>
            ) : (
              <UploadButton component="label" variant="outlined" startIcon={<Description />} fullWidth color="success" disabled={!isEditing}>
                Upload GST Certificate
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={handleFileChange("gstCertificate", { maxFiles: 1, allowedTypes: ["application/pdf", "image/jpeg", "image/png"], maxSize: 1 })}
                />
              </UploadButton>
            )}
            <Typography variant="caption" color={errors.gstCertificate ? "error" : "textSecondary"}>
              {errors.gstCertificate || "Accepted formats: PDF, JPEG, PNG (up to 1MB)"}
            </Typography>

            {data.gstCertificate?.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                {typeof data.gstCertificate[0] === "string" ? (
                  <>
                    {data.gstCertificate[0].endsWith(".pdf") ? (
                      <Chip
                        label="GST Certificate (PDF)"
                        onDelete={isEditing ? () => handleRemoveFile("gstCertificate", 0) : undefined}
                        deleteIcon={<CheckCircle fontSize="small" />}
                        variant="outlined"
                        color="success"
                      />
                    ) : (
                      <Box component="img" src={data.gstCertificate[0]} alt="GST Certificate" loading="lazy" sx={{ width: 100, borderRadius: 1, border: "1px solid #ccc" }} />
                    )}
                    {isEditing && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => startEditFile("gstCertificate", 0)} color="primary" size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleRemoveFile("gstCertificate", 0)} color="error" size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Chip
                      label={data.gstCertificate[0].name}
                      onDelete={isEditing ? () => handleRemoveFile("gstCertificate", 0) : undefined}
                      deleteIcon={<CheckCircle fontSize="small" />}
                      variant="outlined"
                      color="success"
                    />
                    {isEditing && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => startEditFile("gstCertificate", 0)} color="primary" size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleRemoveFile("gstCertificate", 0)} color="error" size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 3: Brand Images */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Store / Branch / Images
          <Tooltip title={<span><strong>Brand Images</strong> <br /> Accepted formats: JPEG, PNG (up to 1MB)</span>} placement="right-start" arrow enterTouchDelay={0}>
            <IconButton size="small" sx={{ color: "warning.main", "&:hover": { backgroundColor: "info.main", color: "white" }, marginLeft: "5px" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        <Grid container spacing={3} sx={{ display: { md: "flex" } }} justifyContent={"space-evenly"}>
          {/* Exterior Images */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "568px" } }}>
                <UploadButton component="label" variant="outlined" color="success" fullWidth startIcon={<PhotoCamera />} disabled={!isEditing || editingField === "exteriorOutlet"}>
                  Upload Exterior Images
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handleFileChange("exteriorOutlet", { maxFiles: 5, allowedTypes: ["image/jpeg", "image/png"], maxSize: 5 })}
                  />
                </UploadButton>

                <Typography variant="caption" color={errors.exteriorOutlet || errors.exteriorOutletCount ? "error" : "textSecondary"} sx={{ mt: -1 }}>
                  {errors.exteriorOutlet || errors.exteriorOutletCount || "Accepted formats: JPEG, PNG (up to total 5MB)"}
                </Typography>

                {data.exteriorOutlet?.length > 0 && (
                  <Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", overflowX: "auto", py: 1, "&::-webkit-scrollbar": { height: "6px" }, "&::-webkit-scrollbar-thumb": { backgroundColor: "divider", borderRadius: "3px" } }}>
                      {data.exteriorOutlet.map((file, index) => (
                        <Box key={index} sx={{ position: "relative", flexShrink: 0, width: "100px", height: "100px" }}>
                          {isFileBeingEdited("exteriorOutlet", index) ? (
                            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 1 }}>
                              <UploadButton component="label" variant="contained" size="small" sx={{ mb: 1 }}>
                                Replace
                                <VisuallyHiddenInput
                                  type="file"
                                  accept="image/jpeg,image/png"
                                  onChange={handleFileChange("exteriorOutlet", { maxFiles: 1, allowedTypes: ["image/jpeg", "image/png"], maxSize: 5 })}
                                />
                              </UploadButton>
                              <Button variant="outlined" aria-label="cancel" color="secondary" size="small" onClick={cancelEditFile}>
                                Cancel
                              </Button>
                            </Box>
                          ) : null}
                          <FilePreviewImage src={createObjectURL(file)} alt={`Exterior ${index + 1}`} loading="lazy" />
                          {isEditing && !isFileBeingEdited("exteriorOutlet", index) && (
                            <Box sx={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 0.5 }}>
                              <IconButton
                                onClick={() => startEditFile("exteriorOutlet", index)}
                                color="primary"
                                size="small"
                                sx={{ backgroundColor: "rgba(255,255,255,0.8)", "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" } }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleRemoveFile("exteriorOutlet", index)}
                                color="error"
                                size="small"
                                sx={{ backgroundColor: "rgba(255,255,255,0.8)", "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" } }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="caption" color={data.exteriorOutlet.length < 3 ? "error" : "success"} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      {data.exteriorOutlet.length < 3 ? (
                        <>
                          <ErrorOutline fontSize="small" sx={{ mr: 0.5 }} />
                          {3 - data.exteriorOutlet.length} more required
                        </>
                      ) : (
                        <>
                          <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                          Minimum requirement met
                        </>
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>

          {/* Interior Images */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "568px" } }}>
                <UploadButton component="label" variant="outlined" fullWidth color="success" startIcon={<PhotoCamera />} sx={{ height: "56px" }} disabled={!isEditing || editingField === "interiorOutlet"}>
                  Upload Interior Images
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handleFileChange("interiorOutlet", { maxFiles: 5, allowedTypes: ["image/jpeg", "image/png"], maxSize: 5 })}
                  />
                </UploadButton>

                <Typography variant="caption" color={errors.interiorOutlet || errors.interiorOutletCount ? "error" : "textSecondary"} sx={{ mt: -1 }}>
                  {errors.interiorOutlet || errors.interiorOutletCount || "Accepted formats: JPEG, PNG (up to total 5MB)"}
                </Typography>

                {data.interiorOutlet?.length > 0 && (
                  <Box>
                    <Box sx={{ display: "flex", gap: 2, overflowX: "auto", py: 1, "&::-webkit-scrollbar": { height: "6px" }, "&::-webkit-scrollbar-thumb": { backgroundColor: "divider", borderRadius: "3px" } }}>
                      {data.interiorOutlet.map((file, index) => (
                        <Box key={index} sx={{ position: "relative", flexShrink: 0, width: "100px", height: "100px" }}>
                          {isFileBeingEdited("interiorOutlet", index) ? (
                            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 1 }}>
                              <UploadButton component="label" variant="contained" size="small" sx={{ mb: 1 }}>
                                Replace
                                <VisuallyHiddenInput
                                  type="file"
                                  accept="image/jpeg,image/png"
                                  onChange={handleFileChange("interiorOutlet", { maxFiles: 1, allowedTypes: ["image/jpeg", "image/png"], maxSize: 5 })}
                                />
                              </UploadButton>
                              <Button variant="outlined" aria-label="cancel" color="secondary" size="small" onClick={cancelEditFile}>
                                Cancel
                              </Button>
                            </Box>
                          ) : null}
                          <FilePreviewImage src={createObjectURL(file)} alt={`Interior ${index + 1}`} loading="lazy" />
                          {isEditing && !isFileBeingEdited("interiorOutlet", index) && (
                            <Box sx={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 0.5 }}>
                              <IconButton
                                onClick={() => startEditFile("interiorOutlet", index)}
                                color="primary"
                                size="small"
                                sx={{ backgroundColor: "rgba(255,255,255,0.8)", "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" } }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={() => handleRemoveFile("interiorOutlet", index)}
                                color="error"
                                size="small"
                                sx={{ backgroundColor: "rgba(255,255,255,0.8)", "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" } }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="caption" color={data.interiorOutlet.length < 3 ? "error" : "success"} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      {data.interiorOutlet.length < 3 ? (
                        <>
                          <ErrorOutline fontSize="small" sx={{ mr: 0.5 }} />
                          {3 - data.interiorOutlet.length} more required
                        </>
                      ) : (
                        <>
                          <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                          Minimum requirement met
                        </>
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 4: Awards & Recognitions */}
      <StyledPaper sx={{ p: 3 }}>
        <SectionTitle variant="h6">
          Award Description & Documents
          <Tooltip title="Add awards and recognition documents" placement="right-start" arrow enterTouchDelay={0}>
            <IconButton size="small" sx={{ color: "warning.main", "&:hover": { backgroundColor: "info.main", color: "white" }, marginLeft: "5px" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        {isEditing && (
          <Grid container spacing={2} sx={{ display: { md: "flex", xs: "grid" } }}>
            <Grid item>
              <TextField
                label="Award Description"
                value={currentAward.text}
                onChange={handleAwardTextChange}
                sx={{ width: { xs: "100%", md: 900 } }}
                error={!currentAward.text && formSubmitted}
                helperText={!currentAward.text && formSubmitted ? "Award description is required" : ""}
              />
            </Grid>

            <Grid item>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <UploadButton
                  component="label"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "green",
                    color: "#5a8f29",
                    "&:hover": { backgroundColor: "rgba(122, 208, 58, 0.08)", borderColor: "#5db024" },
                    ...(!currentAward.document && formSubmitted ? { borderColor: "error.main", color: "error.main" } : {}),
                  }}
                  startIcon={<CloudUpload />}
                >
                  Upload Document
                  <VisuallyHiddenInput type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleAwardFileChange} />
                </UploadButton>

                <Box sx={{ mt: 0.5, minHeight: 24 }}>
                  {currentAward.document ? (
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {currentAward.document.name}
                    </Typography>
                  ) : (
                    formSubmitted && (
                      <Typography variant="caption" sx={{ color: "error.main" }}>
                        Please upload a document
                      </Typography>
                    )
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                aria-label="add"
                fullWidth
                sx={{ py: 2, backgroundColor: "#7ad03a", "&:hover": { backgroundColor: "#5db024" }, "&:disabled": { backgroundColor: "#e0e0e0" } }}
                onClick={() => {
                  setFormSubmitted(true);
                  handleAddAward();
                }}
                disabled={!currentAward.text || !currentAward.document}
              >
                {editAwardIndex !== null ? "Update Award" : "Add Award"}
              </Button>
              {editAwardIndex !== null && (
                <Button variant="outlined" aria-label="cancel" fullWidth sx={{ mt: 1 }} onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        )}

        {data.awards?.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Document</TableCell>
                    {isEditing && <TableCell>Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.awards.map((award, index) => (
                    <TableRow key={index}>
                      <TableCell>{award.text}</TableCell>
                      <TableCell>
                        {award.document ? (
                          typeof award.document === "string" ? (
                            <a href={award.document} target="_blank" rel="noopener noreferrer">
                              View Document
                            </a>
                          ) : (
                            award.document.name
                          )
                        ) : (
                          "No document"
                        )}
                      </TableCell>
                      {isEditing && (
                        <TableCell>
                          <IconButton onClick={() => handleEditAward(index)}>
                            <Edit color="primary" />
                          </IconButton>
                          <IconButton onClick={() => setConfirmDeleteIndex(index)}>
                            <Delete color="error" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </StyledPaper>

      {/* Section 5: Business Plan */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Business Plan (Optional)
          <Tooltip title="You can upload your business plan in PDF, DOC, or DOCX format" placement="right-start" arrow enterTouchDelay={0}>
            <IconButton size="small" sx={{ color: "warning.main", "&:hover": { backgroundColor: "info.main", color: "white" }, marginLeft: "5px" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        <Grid sx={{ ml: { md: 5, xs: 0 }, mr: { md: 5, xs: 0 } }}>
          {editingField === "businessPlan" && editFileIndex === 0 ? (
            <>
              <UploadButton fullWidth component="label" variant="outlined" size="small" color="success" startIcon={<Description />}>
                Replace Business Plan
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,.doc,.docx,"
                  onChange={handleFileChange("businessPlan", {
                    maxFiles: 1,
                    allowedTypes: [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ],
                    maxSize: 1,
                  })}
                />
              </UploadButton>
              <Button variant="outlined" aria-label="cancel" color="error" onClick={cancelEditFile} sx={{ mt: 1 }}>
                Cancel
              </Button>
            </>
          ) : (
            <UploadButton fullWidth component="label" variant="outlined" size="small" color="success" startIcon={<Description />} disabled={!isEditing}>
              Upload (PDF, DOC, DOCX)
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,.doc,.docx,"
                onChange={handleFileChange("businessPlan", {
                  maxFiles: 1,
                  allowedTypes: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  ],
                  maxSize: 1,
                })}
              />
            </UploadButton>
          )}
          <Typography variant="caption" color={errors.businessPlan ? "error" : "textSecondary"}>
            {errors.businessPlan || "Accepted formats: PDF, DOC, DOCX (up to 10MB)"}
          </Typography>

          {data.businessPlan?.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <Description color="primary" />
              <Typography variant="body2">
                {typeof data.businessPlan[0] === "string" ? "Business Plan Document" : data.businessPlan[0].name}
              </Typography>
              {isEditing && (
                <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                  <IconButton onClick={() => startEditFile("businessPlan", 0)} color="primary" size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveFile("businessPlan", 0)} size="small" color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </StyledPaper>

      <Dialog open={confirmDeleteIndex !== null} onClose={() => setConfirmDeleteIndex(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this award? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteIndex(null)} aria-label="cancel">Cancel</Button>
          <Button onClick={() => handleDeleteAward(confirmDeleteIndex)} color="error" aria-label="delete" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadsControl;