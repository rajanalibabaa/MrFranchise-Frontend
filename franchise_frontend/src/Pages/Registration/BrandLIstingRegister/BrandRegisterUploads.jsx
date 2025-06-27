import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  styled,
  CircularProgress,
  Avatar,
  IconButton,
  Stack,
  Alert,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import MovieIcon from "@mui/icons-material/Movie";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

const ScrollableContent = styled("div")(({ theme }) => ({
  overflowY: "auto",
  flexGrow: 1,
  paddingRight: theme.spacing(1),
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "3px",
  },
}));

const FileUploadCard = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: "center",
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
}));

const Uploads = ({
  data = {},
  errors = {},
  onChange,
  gstNumber,
  pancardNumber,
  onGstNumberChange,
  onPancardNumberChange,
}) => {
  const [awardsData, setAwardsData] = useState([]);
  const safeData = data || {};
  const safeOnChange = onChange || (() => {});

  const handleFileChange =
    (field, options = {}) =>
    (e) => {
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
      const currentFiles = safeData[field] || [];
      const totalFiles = currentFiles.length + sizeValidFiles.length;

      if (totalFiles > maxFiles) {
        alert(`Maximum ${maxFiles} file(s) allowed for this field`);
        return;
      }

      const updatedFiles = [...currentFiles, ...sizeValidFiles];
      safeOnChange({ [field]: updatedFiles });
    };

  const handleRemoveFile = (field, index) => {
    const updatedFiles = [...(safeData[field] || [])];
    updatedFiles.splice(index, 1);
    safeOnChange({ [field]: updatedFiles });
  };

  const createObjectURL = (file) => {
    if (!file) return "";
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error creating object URL:", error);
      return "";
    }
  };

  const handleAddAward = () => {
    const awardData = {
      awardsText: safeData.awardsText || '',
      awardsDocuments: safeData.awardsDocuments || []
    };
    
    setAwardsData(prev => [...prev, awardData]);
    
    // Clear the form after submission
    safeOnChange({ 
      awardsText: '',
      awardsDocuments: [] 
    });
  };

  const handleAwardRemove = (index) => {
    setAwardsData(prevAwards => prevAwards.filter((_, i) => i !== index));
  };

  if (!data) {
    return (
      <StyledPaper elevation={2}>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </StyledPaper>
    );
  }

  if (data.error) {
    return (
      <StyledPaper elevation={2}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          color: 'error.main',
          textAlign: 'center'
        }}>
          <ErrorOutlineIcon fontSize="large" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Failed to load brand details
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {data.error.message || "Unknown error occurred"}
          </Typography>
        </Box>
      </StyledPaper>
    );
  }

  return (
    <ScrollableContent>

        {/* Brand Logo Section */}
      <Grid item xs={12} md={6}>
  <Box display="flex" flexDirection="column" gap={2}>
    {/* Header Row */}
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}>1</Avatar>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Brand Logo</Typography>
    </Box>

    {/* Description Row */}
    <Box>
      <Typography variant="caption" color="textSecondary">
        Drag & drop your logo here or click to browse
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Accepted formats: JPG, PNG (Max 10MB)
      </Typography>
    </Box>

    {/* Upload & Preview Section */}
    <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
      {/* Upload Button */}
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{
          backgroundColor: '#ff9800',
          '&:hover': { backgroundColor: '#fb8c00' }
        }}
      >
        Upload Logo
        <VisuallyHiddenInput
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange("brandLogo", {
            maxFiles: 1,
            allowedTypes: ["image/jpeg", "image/png"],
            maxSize: 10,
          })}
        />
      </Button>

      {/* Preview Thumbnails */}
      {safeData.brandLogo?.length > 0 && (
        <Stack direction="row" spacing={2}>
          {safeData.brandLogo.map((file, index) => (
            <Box key={index} position="relative">
              <Avatar
                src={createObjectURL(file)}
                sx={{ width: 80, height: 80, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '50%' }}
                variant="rounded"
              />
              <IconButton
                onClick={() => handleRemoveFile("brandLogo", index)}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "error.main",
                  color: "white",
                  '&:hover': { backgroundColor: "error.dark" },
                  width: 24,
                  height: 24
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  backgroundColor: "success.main",
                  borderRadius: "50%",
                  padding: "2px",
                  color: "white",
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Box>

    {/* Error Message */}
    {errors.brandLogo && (
      <Alert severity="error">
        {errors.brandLogo}
      </Alert>
    )}
  </Box>
</Grid>


        {/* Videos Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}>2</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Promotion Videos</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Drag & drop your videos here or click to browse
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Accepted formats: MP4, MOV (Max 40MB)
              </Typography>
          </Box>
          
         
            
            <Box >
              <Button
                component="label"
                variant="contained"
                startIcon={<VideoCameraBackIcon />}
                sx={{ 
                  mt: 3,
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#fb8c00' }
                }}
              >
                Upload Videos
                <VisuallyHiddenInput
                  type="file"
                  accept="video/mp4,video/quicktime"
                  multiple
                  onChange={handleFileChange("franchisePromotionVideo", {
                    maxFiles: 1,
                    allowedTypes: ["video/mp4", "video/quicktime"],
                    maxSize: 40,
                  })}
                />
              </Button>
              
              {safeData.franchisePromotionVideo?.length > 0 && (
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                    {safeData.franchisePromotionVideo.map((file, index) => (
                      <Box key={index} position="relative">
                        <Avatar
                          variant="rounded"
                          sx={{ 
                            width: 80, 
                            height: 80,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            bgcolor: '#e3f2fd'
                          }}
                        >
                          <MovieIcon color="primary" />
                        </Avatar>
                        <IconButton
                          onClick={() => handleRemoveFile("franchisePromotionVideo", index)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: "error.main",
                            color: "white",
                            "&:hover": { backgroundColor: "error.dark" },
                            width: 24,
                            height: 24
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            backgroundColor: "success.main",
                            borderRadius: "50%",
                            padding: "2px",
                            color: "white",
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
              )}
            </Box>
          {errors.franchisePromotionVideo && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.franchisePromotionVideo}
            </Alert>
          )}
        </Grid>

        {/* Tax Documents Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}>3</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Tax Documents</Typography>
          </Box>
          
          <Grid container spacing={3}>
            {/* PAN Card */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                    Drag & drop your PAN card here or click to browse
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Accepted formats: PDF, JPG, PNG (Max 1MB)
                  </Typography>
              <TextField
                label="PAN Number *"
                fullWidth
                value={pancardNumber || ""}
                onChange={(e) => onPancardNumberChange(e.target.value.toUpperCase())}
                error={!!errors.pancardNumber}
                helperText={errors.pancardNumber}
                inputProps={{
                  maxLength: 10,
                  pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
                  title: "PAN must be in format: AAAAA9999A",
                }}
                sx={{ mb: 2 }}
                variant="outlined"
              />
              
          
                
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<DescriptionIcon />}
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#ff9800',
                      width: '100%',
                      '&:hover': { backgroundColor: '#fb8c00' }
                    }}
                  >
                    Upload PAN Card
                    <VisuallyHiddenInput
                      type="file"
                      accept=".pdf,image/jpeg,image/png"
                      onChange={handleFileChange("pancard", {
                        maxFiles: 1,
                        allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
                        maxSize: 1,
                      })}
                    />
                  </Button>
                  
                  {safeData.pancard?.length > 0 && (
                    <Box sx={{ mt: 2, p: 1.5,  borderRadius: 1 }}>
                      <Box position="relative" sx={{ display: 'inline-block' }}>
                        <Avatar
                          variant="rounded"
                          sx={{ 
                            width: 80, 
                            height: 80,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            bgcolor: '#e3f2fd'
                          }}
                        >
                          <PictureAsPdfIcon color="error" fontSize={safeData.pancard[0]?.type === 'application/pdf' ? 'large' : 'small'} />
                        </Avatar>
                        <IconButton
                          onClick={() => handleRemoveFile("pancard", 0)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: "error.main",
                            color: "white",
                            "&:hover": { backgroundColor: "error.dark" },
                            width: 24,
                            height: 24
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            backgroundColor: "success.main",
                            borderRadius: "50%",
                            padding: "2px",
                            color: "white",
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </Box>
                      </Box>
                      <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                        {safeData.pancard[0]?.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              {errors.pancard && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.pancard}
                </Alert>
              )}
            </Grid>
            
            {/* GST Certificate */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                    Drag & drop your GST certificate here or click to browse
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Accepted formats: PDF, JPG, PNG (Max 1MB)
                  </Typography>

              <TextField
                label="GST Number *"
                fullWidth
                value={gstNumber || ""}
                onChange={(e) => onGstNumberChange(e.target.value)}
                error={!!errors.gstNumber}
                helperText={errors.gstNumber}
                inputProps={{
                  maxLength: 15,
                  pattern: "[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}",
                  title: "GST must be in format: 22AAAAA0000A1Z5",
                }}
                sx={{ mb: 2 }}
                variant="outlined"
              />
              
             
                
                <Box >
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<DescriptionIcon />}
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#ff9800',
                      width: '100%',
                      '&:hover': { backgroundColor: '#fb8c00' }
                    }}
                  >
                    Upload GST Certificate
                    <VisuallyHiddenInput
                      type="file"
                      accept=".pdf,image/jpeg,image/png"
                      onChange={handleFileChange("gstCertificate", {
                        maxFiles: 1,
                        allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
                        maxSize: 1,
                      })}
                    />
                  </Button>
                  
                  {safeData.gstCertificate?.length > 0 && (
                    <Box sx={{ mt: 2, p: 1.5,  borderRadius: 1 }}>
                      <Box position="relative" sx={{ display: 'inline-block' }}>
                        <Avatar
                          variant="rounded"
                          sx={{ 
                            width: 80, 
                            height: 80,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            bgcolor: '#e3f2fd'
                          }}
                        >
                          <PictureAsPdfIcon color="error" fontSize={safeData.gstCertificate[0]?.type === 'application/pdf' ? 'large' : 'small'} />
                        </Avatar>
                        <IconButton
                          onClick={() => handleRemoveFile("gstCertificate", 0)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: "error.main",
                            color: "white",
                            "&:hover": { backgroundColor: "error.dark" },
                            width: 24,
                            height: 24
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            backgroundColor: "success.main",
                            borderRadius: "50%",
                            padding: "2px",
                            color: "white",
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </Box>
                      </Box>
                      <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                        {safeData.gstCertificate[0]?.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              {errors.gstCertificate && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.gstCertificate}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Outlet Images Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}>4</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Outlet Images</Typography>
          </Box>
          
          <Grid container spacing={3}>
            {/* Exterior Images */}
            <Grid item xs={12} md={6}>
               <Typography variant="body2" color="textSecondary" gutterBottom>
                    Exterior Outlet Images (3 required)
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    JPG, PNG (Max 3MB)
                  </Typography>
                
                
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<PhotoCameraIcon />}
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#ff9800',
                      width: '100%',
                      '&:hover': { backgroundColor: '#fb8c00' }
                    }}
                  >
                    Upload Exterior
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleFileChange("exteriorOutlet", {
                        maxFiles: 5,
                        allowedTypes: ["image/jpeg", "image/png"],
                        maxSize: 3,
                      })}
                    />
                  </Button>
                  
                  {safeData.exteriorOutlet?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={1}>
                        {safeData.exteriorOutlet.map((file, index) => (
                          <Grid item xs={4} key={index}>
                            <Box position="relative" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                              <img
                                src={createObjectURL(file)}
                                alt={`Exterior ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: 4
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveFile("exteriorOutlet", index)}
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  backgroundColor: "rgba(244, 67, 54, 0.8)",
                                  color: "white",
                                  "&:hover": { backgroundColor: "error.dark" },
                                  width: 24,
                                  height: 24
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 4,
                                  left: 4,
                                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                                  color: "white",
                                  borderRadius: 1,
                                  px: 0.5,
                                  fontSize: '0.6rem'
                                }}
                              >
                                {index + 1}
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography
                        variant="caption"
                        color={safeData.exteriorOutlet.length < 3 ? "error" : "textSecondary"}
                        sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                      >
                        {safeData.exteriorOutlet.length < 3 ? (
                          <>
                            <ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {3 - safeData.exteriorOutlet.length} more required
                          </>
                        ) : (
                          <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                        )}
                        {safeData.exteriorOutlet.length} uploaded
                      </Typography>
                    </Box>
                  )}
                </Box>
              {errors.exteriorOutlet && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.exteriorOutlet}
                </Alert>
              )}
            </Grid>
            
            {/* Interior Images */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                    Interior Outlet Images (3 required)
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    JPG, PNG (Max 3MB)
                  </Typography>
               
                
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<PhotoCameraIcon />}
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#ff9800',
                      width: '100%',
                      '&:hover': { backgroundColor: '#fb8c00' }
                    }}
                  >
                    Upload Interior
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleFileChange("interiorOutlet", {
                        maxFiles: 5,
                        allowedTypes: ["image/jpeg", "image/png"],
                        maxSize: 3,
                      })}
                    />
                  </Button>
                  
                  {safeData.interiorOutlet?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={1}>
                        {safeData.interiorOutlet.map((file, index) => (
                          <Grid item xs={4} key={index}>
                            <Box position="relative" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                              <img
                                src={createObjectURL(file)}
                                alt={`Interior ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: 4
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveFile("interiorOutlet", index)}
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  backgroundColor: "rgba(244, 67, 54, 0.8)",
                                  color: "white",
                                  "&:hover": { backgroundColor: "error.dark" },
                                  width: 24,
                                  height: 24
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                              <Box
                                sx={{
                                  position: "absolute",
                                  bottom: 4,
                                  left: 4,
                                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                                  color: "white",
                                  borderRadius: 1,
                                  px: 0.5,
                                  fontSize: '0.6rem'
                                }}
                              >
                                {index + 1}
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography
                        variant="caption"
                        color={safeData.interiorOutlet.length < 3 ? "error" : "textSecondary"}
                        sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                      >
                        {safeData.interiorOutlet.length < 3 ? (
                          <>
                            <ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {3 - safeData.interiorOutlet.length} more required
                          </>
                        ) : (
                          <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                        )}
                        {safeData.interiorOutlet.length} uploaded
                      </Typography>
                    </Box>
                  )}
                </Box>
              {errors.interiorOutlet && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.interiorOutlet}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Awards & Recognitions Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}>5</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Awards & Recognitions</Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <TextField
                label="Awards text *"
                fullWidth
                value={safeData.awardsText || ""}
                onChange={(e) => safeOnChange({ awardsText: e.target.value })}
                placeholder="List any awards or recognitions your brand has received"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={5}>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      backgroundColor: '#ff9800',
                      width: '100%',
                      '&:hover': { backgroundColor: '#fb8c00' }
                    }}
                  >
                    Upload Documents
                    <VisuallyHiddenInput
                      type="file"
                      accept=".pdf,.doc,.docx,image/jpeg,image/png"
                      multiple
                      onChange={handleFileChange("awardsDocuments", {
                        maxFiles: 1,
                        allowedTypes: [
                          "application/pdf",
                          "application/msword",
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          "image/jpeg",
                          "image/png"
                        ],
                        maxSize: 1,
                      })}
                    />
                  </Button>
                </Box>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                onClick={handleAddAward}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: '100%' }}
                disabled={
                  !safeData.awardsText ||
                  !safeData.awardsDocuments ||
                  safeData.awardsDocuments.length === 0
                }
              >
                Add Awards
              </Button>
            </Grid>
          </Grid>
          
          {awardsData.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Saved Awards:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Documents Count</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {awardsData.map((award, index) => (
                      <TableRow key={index}>
                        <TableCell>{award.awardsText || "No description"}</TableCell>
                        <TableCell>{award.awardsDocuments?.length || 0}</TableCell>
                        <TableCell>
                          <Button 
                            onClick={() => handleAwardRemove(index)}
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>

        {/* Business Plan Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Avatar sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}>6</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Business Plan (Optional)</Typography>
          </Box>
          
          <Grid container spacing={3}>
             <Typography variant="body2" color="textSecondary" gutterBottom>
                    Upload Business Plan Document (Optional)
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    PDF, DOC, DOCX (Max 1MB)
                  </Typography>
            <Grid item xs={12} md={6}>
               
                
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<DescriptionIcon />}
                    sx={{ 
                      mt: 2,
                      backgroundColor: '#ff9800',
                      width: '100%',
                      '&:hover': { backgroundColor: '#fb8c00' }
                    }}
                  >
                    Upload Business Plan
                    <VisuallyHiddenInput
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange("businessPlan", {
                        maxFiles: 1,
                        allowedTypes: [
                          "application/pdf",
                          "application/msword",
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        ],
                        maxSize: 1,
                      })}
                    />
                  </Button>
                  
                  {safeData.businessPlan?.length > 0 && (
                    <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
                      <Box position="relative" sx={{ display: 'inline-block' }}>
                        <Avatar
                          variant="rounded"
                          sx={{ 
                            width: 80, 
                            height: 80,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            bgcolor: '#e3f2fd'
                          }}
                        >
                          <PictureAsPdfIcon color="error" fontSize={safeData.businessPlan[0]?.type === 'application/pdf' ? 'large' : 'small'} />
                        </Avatar>
                        <IconButton
                          onClick={() => handleRemoveFile("businessPlan", 0)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: "error.main",
                            color: "white",
                            "&:hover": { backgroundColor: "error.dark" },
                            width: 24,
                            height: 24
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -5,
                            right: -5,
                            backgroundColor: "success.main",
                            borderRadius: "50%",
                            padding: "2px",
                            color: "white",
                          }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </Box>
                      </Box>
                      <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                        {safeData.businessPlan[0]?.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              {errors.businessPlan && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {errors.businessPlan}
                </Alert>
              )}
            </Grid>
          </Grid>
        </Grid>
    </ScrollableContent>
  );
};

export default Uploads;