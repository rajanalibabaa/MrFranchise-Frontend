import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
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

const UploadsEdit = ({
  data = {},
  files = {},
  onChange = () => {},
  onFileChange = () => {},
  onRemoveFile = () => {},
  onArrayChange = () => {},
  errors = {},
  isEditing = false,
}) => {
  const theme = useTheme();
  const [imageDeleteData, setImageDeleteData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  // Initialize form data
  const [formData, setFormData] = useState({
    brandLogo: data.brandLogo || [],
    exteriorOutlet: data.exteriorOutlet || [],
    franchisePromotionVideo: data.franchisePromotionVideo || [],
    gstCertificate: data.gstCertificate || [],
    interiorOutlet: data.interiorOutlet || [],
    pancard: data.pancard || [],
    businessPlan: data.businessPlan || [],
    awards: data.awards || [],
  });

  // Track files to be uploaded
  const [filesToUpload, setFilesToUpload] = useState({
    brandLogo: files.brandLogo || [],
    exteriorOutlet: files.exteriorOutlet || [],
    franchisePromotionVideo: files.franchisePromotionVideo || [],
    gstCertificate: files.gstCertificate || [],
    interiorOutlet: files.interiorOutlet || [],
    pancard: files.pancard || [],
    businessPlan: files.businessPlan || [],
    awardDoc: files.awardDoc || [],
  });

  useEffect(() => {
    setFormData({
      brandLogo: data.brandLogo || [],
      exteriorOutlet: data.exteriorOutlet || [],
      franchisePromotionVideo: data.franchisePromotionVideo || [],
      gstCertificate: data.gstCertificate || [],
      interiorOutlet: data.interiorOutlet || [],
      pancard: data.pancard || [],
      businessPlan: data.businessPlan || [],
      awards: data.awards || [],
    });
  }, [data]);

  const handleFileUpload = (field, options = {}) => (e) => {
    const { maxFiles = Infinity, allowedTypes = [], maxSize = 5 } = options;
    const newFiles = Array.from(e.target.files || []);

    // Validate file types
    const validFiles = newFiles.filter((file) => {
      if (!file || !file.type) return false;
      if (allowedTypes.length === 0) return true;
      return allowedTypes.some((type) => file.type.includes(type));
    });

    // Validate file size (in MB)
    const sizeValidFiles = validFiles.filter(
      (file) => file.size <= maxSize * 1024 * 1024
    );

    if (sizeValidFiles.length < validFiles.length) {
      setError(`Some files exceed the maximum size of ${maxSize}MB`);
      setTimeout(() => setError(null), 5000);
    }

    // Validate number of files
    const currentFiles = filesToUpload[field] || [];
    const totalFiles = currentFiles.length + sizeValidFiles.length;

    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} file(s) allowed for this field`);
      setTimeout(() => setError(null), 5000);
      return;
    }

    const updatedFiles = [...currentFiles, ...sizeValidFiles];
    setFilesToUpload(prev => ({
      ...prev,
      [field]: updatedFiles
    }));
    onFileChange(field, sizeValidFiles);
  };

  const handleRemoveUploadedFile = (field, index) => {
    const updatedFiles = [...filesToUpload[field]];
    updatedFiles.splice(index, 1);
    setFilesToUpload(prev => ({
      ...prev,
      [field]: updatedFiles
    }));
    onRemoveFile(field, index);
  };

  const handleDeleteExistingFile = (field, fileUrl) => {
    setFileToDelete({ field, fileUrl });
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;

    const { field, fileUrl } = fileToDelete;
    setLoading(true);
    setConfirmDeleteOpen(false);

    try {
      // Track deleted files for API call
      setImageDeleteData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), fileUrl]
      }));

      // Update local state
      const updatedFiles = formData[field].filter(file => file !== fileUrl);
      setFormData(prev => ({
        ...prev,
        [field]: updatedFiles
      }));
      onChange(field, updatedFiles);

      setSuccess(`File deleted successfully`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(`Error deleting file: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
      setFileToDelete(null);
    }
  };

  const handleAwardTextChange = (index, value) => {
    const updatedAwards = [...formData.awards];
    updatedAwards[index] = { ...updatedAwards[index], awardDescription: value };
    setFormData(prev => ({ ...prev, awards: updatedAwards }));
    onArrayChange('awards', updatedAwards);
  };

  const handleAddAward = () => {
    const newAward = { awardDescription: '', document: null };
    const updatedAwards = [...formData.awards, newAward];
    setFormData(prev => ({ ...prev, awards: updatedAwards }));
    onArrayChange('awards', updatedAwards);
  };

  const handleRemoveAward = (index) => {
    const updatedAwards = [...formData.awards];
    const removedAward = updatedAwards.splice(index, 1)[0];
    
    // If the award has a document, add it to delete data
    if (removedAward.documentUrl) {
      setImageDeleteData(prev => ({
        ...prev,
        awards: [...(prev.awards || []), removedAward.documentUrl]
      }));
    }
    
    setFormData(prev => ({ ...prev, awards: updatedAwards }));
    onArrayChange('awards', updatedAwards);
  };

  const handleAwardFileChange = (index, file) => {
    const updatedAwards = [...formData.awards];
    updatedAwards[index] = { ...updatedAwards[index], document: file };
    setFormData(prev => ({ ...prev, awards: updatedAwards }));
    onArrayChange('awards', updatedAwards);
  };

  const renderFilePreview = (file, field, index, isUploadedFile = false) => {
    if (typeof file === 'string') {
      // Existing file (URL)
      return (
        <Box
          sx={{
            position: "relative",
            width: "100px",
            height: "100px",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <FilePreviewImage
            src={file}
            alt={`${field} ${index + 1}`}
            loading="lazy"
          />
          {isEditing && (
            <IconButton
              onClick={() => handleDeleteExistingFile(field, file)}
              color="error"
              size="small"
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
      );
    } else {
      // New file to be uploaded
      return (
        <Box
          sx={{
            position: "relative",
            width: "100px",
            height: "100px",
            borderRadius: 1,
            overflow: "hidden",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.grey[200],
          }}
        >
          <Typography variant="caption" sx={{ textAlign: 'center', p: 1 }}>
            {file.name}
          </Typography>
          {isEditing && (
            <IconButton
              onClick={() => handleRemoveUploadedFile(field, index)}
              color="error"
              size="small"
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
      );
    }
  };

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Error/Success Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this file? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteFile} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Section 1: Brand Identity */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Brand Identity
          <Tooltip
            title="Upload your brand logo and promotional video"
            placement="right-start"
            arrow
          >
            <IconButton size="small" sx={{ color: "warning.main" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        <Grid container spacing={3} sx={{ display: { md: "flex" } }}>
          {/* Brand Logo */}
          <Grid item xs={12} md={6}>
            <Typography textAlign={"center"} mb={1} variant="body2">
              Brand Logo
            </Typography>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "568px" } }}>
                {isEditing && (
                  <>
                    <UploadButton
                      component="label"
                      color="success"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      disabled={loading}
                    >
                      Upload Logo
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleFileUpload("brandLogo", {
                          maxFiles: 1,
                          allowedTypes: ["image/jpeg", "image/png"],
                          maxSize: 2,
                        })}
                      />
                    </UploadButton>
                    <Typography variant="caption" color="textSecondary">
                      (Accepted formats: JPEG, PNG up to 2MB)
                    </Typography>
                  </>
                )}

                {/* Existing logo */}
                {formData.brandLogo?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {renderFilePreview(formData.brandLogo[0], 'brandLogo', 0)}
                  </Box>
                )}

                {/* New logo to upload */}
                {filesToUpload.brandLogo?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {renderFilePreview(filesToUpload.brandLogo[0], 'brandLogo', 0, true)}
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
              <Box sx={{ width: { md: "568px" } }}>
                {isEditing && (
                  <>
                    <UploadButton
                      component="label"
                      variant="outlined"
                      color="success"
                      startIcon={<VideoCameraBack />}
                      disabled={loading}
                    >
                      Upload Video
                      <VisuallyHiddenInput
                        type="file"
                        accept="video/mp4,video/quicktime"
                        onChange={handleFileUpload("franchisePromotionVideo", {
                          maxFiles: 1,
                          allowedTypes: ["video/mp4", "video/quicktime"],
                          maxSize: 25,
                        })}
                      />
                    </UploadButton>
                    <Typography variant="caption" color="textSecondary">
                      Accepted formats: MP4, Quicktime Video (up to 25MB)
                    </Typography>
                  </>
                )}

                {/* Existing video */}
                {formData.franchisePromotionVideo?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <video
                      controls
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        borderRadius: '4px',
                        backgroundColor: '#000',
                      }}
                    >
                      <source
                        src={formData.franchisePromotionVideo[0]}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                    {isEditing && (
                      <Button
                        startIcon={<Delete />}
                        color="error"
                        size="small"
                        onClick={() =>
                          handleDeleteExistingFile(
                            'franchisePromotionVideo',
                            formData.franchisePromotionVideo[0]
                          )
                        }
                        sx={{ mt: 1 }}
                      >
                        Remove Video
                      </Button>
                    )}
                  </Box>
                )}

                {/* New video to upload */}
                {filesToUpload.franchisePromotionVideo?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      {filesToUpload.franchisePromotionVideo[0].name}
                    </Typography>
                    <Button
                      startIcon={<Delete />}
                      color="error"
                      size="small"
                      onClick={() => handleRemoveUploadedFile('franchisePromotionVideo', 0)}
                      sx={{ mt: 1 }}
                    >
                      Remove Video
                    </Button>
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
          <Tooltip
            title="Upload your company documents"
            placement="right-start"
            arrow
          >
            <IconButton size="small" sx={{ color: "warning.main" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        <Grid container spacing={3} sx={{ display: { md: "flex" } }}>
          {/* PAN Details */}
          <Grid item xs={12} md={6} sx={{ mr: { md: 2 } }}>
            <TextField
              label="PAN Number"
              fullWidth
              value={data.pancardNumber || ""}
              onChange={(e) => onChange('pancardNumber', e.target.value.toUpperCase())}
              error={!!errors.pancardNumber}
              helperText={errors.pancardNumber}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 10,
                pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
                title: "PAN must be in format: AAAAA9999A",
              }}
              disabled={!isEditing}
            />

            <InputLabel shrink sx={{ mb: 1 }}>
              PAN Card Upload
            </InputLabel>
            {isEditing && (
              <>
                <UploadButton
                  component="label"
                  variant="outlined"
                  startIcon={<Description />}
                  fullWidth
                  color="success"
                  disabled={loading}
                >
                  Upload PAN Card
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileUpload("pancard", {
                      maxFiles: 1,
                      allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
                      maxSize: 1,
                    })}
                  />
                </UploadButton>
                <Typography variant="caption" color="textSecondary">
                  Accepted formats: PDF, JPEG, PNG (up to 1MB)
                </Typography>
              </>
            )}

            {/* Existing PAN card */}
            {formData.pancard?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <a
                  href={formData.pancard[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    startIcon={<Description />}
                    color="primary"
                    size="small"
                  >
                    View PAN Card
                  </Button>
                </a>
                {isEditing && (
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    size="small"
                    onClick={() =>
                      handleDeleteExistingFile('pancard', formData.pancard[0])
                    }
                    sx={{ ml: 2 }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            )}

            {/* New PAN card to upload */}
            {filesToUpload.pancard?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  {filesToUpload.pancard[0].name}
                </Typography>
                {isEditing && (
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    size="small"
                    onClick={() => handleRemoveUploadedFile('pancard', 0)}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
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
              onChange={(e) => onChange('gstNumber', e.target.value)}
              error={!!errors.gstNumber}
              helperText={errors.gstNumber}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 15,
                pattern:
                  "[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}",
                title: "GST must be in format: 22AAAAA0000A1Z5",
              }}
              disabled={!isEditing}
            />

            <InputLabel shrink sx={{ mb: 1 }}>
              GST Certificate Upload
            </InputLabel>
            {isEditing && (
              <>
                <UploadButton
                  component="label"
                  variant="outlined"
                  startIcon={<Description />}
                  fullWidth
                  color="success"
                  disabled={loading}
                >
                  Upload GST Certificate
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,image/jpeg,image/png"
                    onChange={handleFileUpload("gstCertificate", {
                      maxFiles: 1,
                      allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
                      maxSize: 1,
                    })}
                  />
                </UploadButton>
                <Typography variant="caption" color="textSecondary">
                  Accepted formats: PDF, JPEG, PNG (up to 1MB)
                </Typography>
              </>
            )}

            {/* Existing GST certificate */}
            {formData.gstCertificate?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <a
                  href={formData.gstCertificate[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    startIcon={<Description />}
                    color="primary"
                    size="small"
                  >
                    View GST Certificate
                  </Button>
                </a>
                {isEditing && (
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    size="small"
                    onClick={() =>
                      handleDeleteExistingFile('gstCertificate', formData.gstCertificate[0])
                    }
                    sx={{ ml: 2 }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            )}

            {/* New GST certificate to upload */}
            {filesToUpload.gstCertificate?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  {filesToUpload.gstCertificate[0].name}
                </Typography>
                {isEditing && (
                  <Button
                    startIcon={<Delete />}
                    color="error"
                    size="small"
                    onClick={() => handleRemoveUploadedFile('gstCertificate', 0)}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 3: Brand Images */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Store / Branch Images
          <Tooltip
            title="Upload images of your outlets"
            placement="right-start"
            arrow
          >
            <IconButton size="small" sx={{ color: "warning.main" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        <Grid container spacing={3} sx={{ display: { md: "flex" } }}>
          {/* Exterior Images */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "568px" } }}>
                {isEditing && (
                  <>
                    <UploadButton
                      component="label"
                      variant="outlined"
                      color="success"
                      fullWidth
                      startIcon={<PhotoCamera />}
                      disabled={loading}
                    >
                      Upload Exterior Images
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        onChange={handleFileUpload("exteriorOutlet", {
                          maxFiles: 5,
                          allowedTypes: ["image/jpeg", "image/png"],
                          maxSize: 5,
                        })}
                      />
                    </UploadButton>
                    <Typography variant="caption" color="textSecondary">
                      Accepted formats: JPEG, PNG (up to total 5MB)
                    </Typography>
                  </>
                )}

                {/* Existing exterior images */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {formData.exteriorOutlet?.map((file, index) => (
                    <Box key={`existing-${index}`}>
                      {renderFilePreview(file, 'exteriorOutlet', index)}
                    </Box>
                  ))}
                </Box>

                {/* New exterior images to upload */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {filesToUpload.exteriorOutlet?.map((file, index) => (
                    <Box key={`new-${index}`}>
                      {renderFilePreview(file, 'exteriorOutlet', index, true)}
                    </Box>
                  ))}
                </Box>
              </Box>
            </FormControl>
          </Grid>

          {/* Interior Images */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "568px" } }}>
                {isEditing && (
                  <>
                    <UploadButton
                      component="label"
                      variant="outlined"
                      fullWidth
                      color="success"
                      startIcon={<PhotoCamera />}
                      sx={{ height: "56px" }}
                      disabled={loading}
                    >
                      Upload Interior Images
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        onChange={handleFileUpload("interiorOutlet", {
                          maxFiles: 5,
                          allowedTypes: ["image/jpeg", "image/png"],
                          maxSize: 5,
                        })}
                      />
                    </UploadButton>
                    <Typography variant="caption" color="textSecondary">
                      Accepted formats: JPEG, PNG (up to total 5MB)
                    </Typography>
                  </>
                )}

                {/* Existing interior images */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {formData.interiorOutlet?.map((file, index) => (
                    <Box key={`existing-${index}`}>
                      {renderFilePreview(file, 'interiorOutlet', index)}
                    </Box>
                  ))}
                </Box>

                {/* New interior images to upload */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                  {filesToUpload.interiorOutlet?.map((file, index) => (
                    <Box key={`new-${index}`}>
                      {renderFilePreview(file, 'interiorOutlet', index, true)}
                    </Box>
                  ))}
                </Box>
              </Box>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 4: Awards & Recognitions */}
      <StyledPaper sx={{ p: 3 }}>
        <SectionTitle variant="h6">
          Award Description & Documents
          <Tooltip
            title="Add your awards and recognition documents"
            placement="right-start"
            arrow
          >
            <IconButton size="small" sx={{ color: "warning.main" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        {formData.awards?.map((award, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Award Description"
                value={award.awardDescription || ""}
                onChange={(e) => handleAwardTextChange(index, e.target.value)}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {isEditing && (
                <UploadButton
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUpload />}
                  disabled={loading}
                >
                  {award.documentUrl ? "Replace Document" : "Upload Document"}
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleAwardFileChange(index, file);
                    }}
                  />
                </UploadButton>
              )}
              {award.documentUrl && (
                <Box sx={{ mt: 1 }}>
                  <a
                    href={award.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      startIcon={<Description />}
                      color="primary"
                      size="small"
                    >
                      View Document
                    </Button>
                  </a>
                </Box>
              )}
              {filesToUpload.awardDoc[index] && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {filesToUpload.awardDoc[index].name}
                </Typography>
              )}
            </Grid>
            {isEditing && (
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => handleRemoveAward(index)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </Grid>
            )}
          </Grid>
        ))}

        {isEditing && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAward}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Add Award
          </Button>
        )}
      </StyledPaper>

      {/* Section 5: Business Plan */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Business Plan (Optional)
          <Tooltip
            title="Upload your business plan document"
            placement="right-start"
            arrow
          >
            <IconButton size="small" sx={{ color: "warning.main" }}>
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        <Grid sx={{ ml: { md: 5, xs: 0 }, mr: { md: 5, xs: 0 } }}>
          {isEditing && (
            <>
              <UploadButton
                fullWidth
                component="label"
                variant="outlined"
                size="small"
                color="success"
                startIcon={<Description />}
                disabled={loading}
              >
                Upload (PDF, DOC, DOCX)
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,.doc,.docx,"
                  onChange={handleFileUpload("businessPlan", {
                    maxFiles: 1,
                    allowedTypes: [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ],
                    maxSize: 10,
                  })}
                />
              </UploadButton>
              <Typography variant="caption" color="textSecondary">
                Accepted formats: PDF, DOC, DOCX (up to 10MB)
              </Typography>
            </>
          )}

          {/* Existing business plan */}
          {formData.businessPlan?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <a
                href={formData.businessPlan[0]}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button
                  startIcon={<Description />}
                  color="primary"
                  size="small"
                >
                  View Business Plan
                </Button>
              </a>
              {isEditing && (
                <Button
                  startIcon={<Delete />}
                  color="error"
                  size="small"
                  onClick={() =>
                    handleDeleteExistingFile('businessPlan', formData.businessPlan[0])
                  }
                  sx={{ ml: 2 }}
                >
                  Remove
                </Button>
              )}
            </Box>
          )}

          {/* New business plan to upload */}
          {filesToUpload.businessPlan?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                {filesToUpload.businessPlan[0].name}
              </Typography>
              {isEditing && (
                <Button
                  startIcon={<Delete />}
                  color="error"
                  size="small"
                  onClick={() => handleRemoveUploadedFile('businessPlan', 0)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              )}
            </Box>
          )}
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default UploadsEdit;