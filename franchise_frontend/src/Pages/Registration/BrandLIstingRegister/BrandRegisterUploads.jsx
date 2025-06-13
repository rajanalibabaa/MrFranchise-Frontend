import {
  Grid,
  Typography,
  Button,
  Box,
  Divider,
  Paper,
  styled,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
  Alert,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
 

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

const SectionHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  color: theme.palette.error.main,
  textAlign: "center",
}));

const FileUploadCard = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  textAlign: "center",
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const PreviewImage = styled("img")({
  width: "100px",
  height: "100px",
  objectFit: "cover",
  borderRadius: "4px",
  border: "1px solid #e0e0e0",
});

const FilePreviewContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "16px",
});

const Uploads = ({
  data = {},
  errors = {},
  onChange,
  gstNumber,
  pancardNumber,
  onGstNumberChange,
  onPancardNumberChange,
}) => {
  const safeData = data || {};
  const safeOnChange = onChange || (() => {});

  const handleFileChange =
    (field, options = {}) =>
    (e) => {
      const { maxFiles = Infinity, allowedTypes = [], maxSize = 5 } = options;
      const files = Array.from(e.target.files);

      // Validate file types
      const validFiles = files.filter((file) => {
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
    const updatedFiles = [...safeData[field]];
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
        <ErrorContainer>
          <ErrorOutlineIcon fontSize="large" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Failed to load brand details
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {data.error.message || "Unknown error occurred"}
          </Typography>
        </ErrorContainer>
      </StyledPaper>
    );
  }

  return (
    
      <ScrollableContent>
  {/* Header Section */}
  <Box sx={{
    backgroundColor: '#fff8e1',
    p: 1,
    borderRadius: 2,
    mb: 1,
    borderLeft: '4px solid #ff9800'
  }}>
    <SectionHeader variant="h6" sx={{ 
      color: '#ff9800', 
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <DescriptionIcon fontSize="medium" />
      Brand Documentation
    </SectionHeader>
    <Alert severity="info" sx={{ 
      mt: 1,
      backgroundColor: 'rgba(255, 152, 0, 0.08)',
      '& .MuiAlert-icon': { color: '#ff9800' }
    }}>
      Please upload all required documents to complete your brand registration.
    </Alert>
  </Box>

  {/* Main Grid Container */}
  <Grid container spacing={4} display={'flex'} flexDirection={'column'}>   
    {/* Brand Logo Section */}
    <Grid item xs={12} md={6}>
      
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          gap: 1
        }}>
          <Avatar sx={{ 
            bgcolor: '#ff9800', 
            width: 32, 
            height: 32,
            fontSize: '1rem'
          }}>
            1
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Brand Logo
          </Typography>
          <Chip label="Required" size="small" sx={{ 
            ml: 1, 
            backgroundColor: '#ffebee', 
            color: '#d32f2f' 
          }} />
        </Box>
        
        <FileUploadCard sx={{ 
          backgroundColor: '#fafafa',
          border: '2px dashed #e0e0e0',
          p: 3,
          textAlign: 'center'
        }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <CloudUploadIcon sx={{ 
              fontSize: 48, 
              color: '#9e9e9e',
              mb: 1 
            }} />
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Drag & drop your logo here or click to browse
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Accepted formats: JPG, PNG (Max 10MB)
            </Typography>
          </Box>
          
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{ 
              mt: 3,
              backgroundColor: '#ff9800',
              '&:hover': {
                backgroundColor: '#fb8c00'
              }
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
          
          {safeData.brandLogo?.length > 0 && (
            <Box sx={{ 
              mt: 3,
              p: 2,
              backgroundColor: '#e8f5e9',
              borderRadius: 1
            }}>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                {safeData.brandLogo.map(
                  (file, index) =>
                    file && (
                      <Box key={index} position="relative">
                        <Avatar
                          src={createObjectURL(file)}
                          sx={{ 
                            width: 80, 
                            height: 80,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
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
                            "&:hover": {
                              backgroundColor: "error.dark",
                            },
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
                    )
                )}
              </Stack>
            </Box>
          )}
        </FileUploadCard>
        {errors.brandLogo && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.brandLogo}
          </Alert>
        )}
    </Grid>

    {/* Videos Section */}
    <Grid item xs={12} md={6}>
     
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          gap: 1
        }}>
          <Avatar sx={{ 
            bgcolor: '#ff9800', 
            width: 32, 
            height: 32,
            fontSize: '1rem'
          }}>
            2
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Promotion Videos
          </Typography>
        </Box>
        
        <Grid container spacing={2} display={'flex'} flexDirection={'column'}>
          {/* Brand Promotion Videos */}
          {/* <Grid item xs={12} sm={6}>
            <FileUploadCard sx={{ 
              backgroundColor: '#fafafa',
              border: '2px dashed #e0e0e0',
              p: 2,
              textAlign: 'center',
              height: '100%'
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Brand Videos
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<VideoCameraBackIcon />}
                size="small"
                sx={{ mb: 1 }}
              >
                Upload
                <VisuallyHiddenInput
                  type="file"
                  accept="video/mp4,video/quicktime"
                  multiple
                  onChange={handleFileChange("brandPromotionVideo", {
                    maxFiles: 1,
                    allowedTypes: ["video/mp4", "video/quicktime"],
                    maxSize: 100 * 1024 * 1024,
                  })}
                />
              </Button>
              <Typography variant="caption" color="textSecondary" display="block">
                MP4, MOV (Max 100MB)
              </Typography>
              
              {safeData.brandPromotionVideo?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <List dense>
                    {safeData.brandPromotionVideo.map((file, index) => (
                      <ListItem 
                        key={index}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveFile("brandPromotionVideo", index)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{
                          backgroundColor: '#f5f5f5',
                          borderRadius: 1,
                          mt: 0.5
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#e3f2fd' }}>
                            <MovieIcon color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={file.name}
                          primaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography
                    variant="caption"
                    color={
                      safeData.brandPromotionVideo.length < 1
                        ? "error"
                        : "textSecondary"
                    }
                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  >
                    {safeData.brandPromotionVideo.length < 1 ? (
                      <>
                        <ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Minimum 1 video required
                      </>
                    ) : (
                      <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                    )}
                    {safeData.brandPromotionVideo.length} uploaded
                  </Typography>
                </Box>
              )}
            </FileUploadCard>
          </Grid> */}
          
          {/* Franchise Promotion Videos */}
          <Grid item xs={12} sm={6}>
            <FileUploadCard sx={{ 
              backgroundColor: '#fafafa',
              border: '2px dashed #e0e0e0',
              p: 2,
              textAlign: 'center',
              height: '100%'
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Franchise Videos
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<VideoCameraBackIcon />}
                size="small"
                sx={{ mb: 1 }}
              >
                Upload
                <VisuallyHiddenInput
                  type="file"
                  accept="video/mp4,video/quicktime"
                  multiple
                  onChange={handleFileChange("franchisePromotionVideo", {
                    maxFiles: 1,
                    allowedTypes: ["video/mp4", "video/quicktime"],
                    // maxSize: 100 * 1024 * 1024,
                    maxSize: 40 * 1024 * 1024,
                  })}
                />
              </Button>
              <Typography variant="caption" color="textSecondary" display="block">
                MP4, MOV (Max 40MB)
              </Typography>
              
              {safeData.franchisePromotionVideo?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <List dense>
                    {safeData.franchisePromotionVideo.map((file, index) => (
                      <ListItem 
                        key={index}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveFile("franchisePromotionVideo", index)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{
                          backgroundColor: '#f5f5f5',
                          borderRadius: 1,
                          mt: 0.5
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#e3f2fd' }}>
                            <MovieIcon color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={file.name}
                          primaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography
                    variant="caption"
                    color={
                      safeData.franchisePromotionVideo.length < 1
                        ? "error"
                        : "textSecondary"
                    }
                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  >
                    {safeData.franchisePromotionVideo.length < 1 ? (
                      <>
                        <ErrorOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Minimum 1 video required
                      </>
                    ) : (
                      <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                    )}
                    {safeData.franchisePromotionVideo.length} uploaded
                  </Typography>
                </Box>
              )}
            </FileUploadCard>
          </Grid>
        </Grid>
    </Grid>

    {/* Tax Documents Section */}
    <Grid item xs={12} >
      
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          gap: 1
        }}>
          <Avatar sx={{ 
            bgcolor: '#ff9800', 
            width: 32, 
            height: 32,
            fontSize: '1rem'
          }}>
            3
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tax Documents
          </Typography>
        </Box>
        
        <Grid container spacing={3} display={'flex'} flexDirection={'column'}>
          {/* PAN Card */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
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
                size="small"
              />
            </Box>
            
            <FileUploadCard sx={{ 
              backgroundColor: '#fafafa',
              border: '2px dashed #e0e0e0',
              p: 2,
              textAlign: 'center'
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                PAN Card Document
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<DescriptionIcon />}
                size="small"
                sx={{ mb: 1 }}
              >
                Upload PAN
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={handleFileChange("pancard", {
                    maxFiles: 1,
                    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
                    maxSize: 1 * 1024 * 1024,
                  })}
                />
              </Button>
              <Typography variant="caption" color="textSecondary" display="block">
                PDF, JPG, PNG (Max 1MB)
              </Typography>
              
              {safeData.pancard?.length > 0 && (
                <Box sx={{ 
                  mt: 2,
                  p: 1,
                  backgroundColor: '#e8f5e9',
                  borderRadius: 1
                }}>
                  {safeData.pancard.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => handleRemoveFile("pancard", index)}
                      deleteIcon={<DeleteIcon />}
                      sx={{ m: 0.5 }}
                      color="success"
                      variant="outlined"
                      icon={<PictureAsPdfIcon color="error" />}
                    />
                  ))}
                </Box>
              )}
            </FileUploadCard>
            {errors.pancard && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.pancard}
              </Alert>
            )}
          </Grid>
          
          {/* GST Certificate */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
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
                size="small"
              />
            </Box>
            
            <FileUploadCard sx={{ 
              backgroundColor: '#fafafa',
              border: '2px dashed #e0e0e0',
              p: 2,
              textAlign: 'center'
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                GST Certificate
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<DescriptionIcon />}
                size="small"
                sx={{ mb: 1 }}
              >
                Upload GST
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={handleFileChange("gstCertificate", {
                    maxFiles: 1,
                    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
                    maxSize: 1 * 1024 * 1024,
                  })}
                />
              </Button>
              <Typography variant="caption" color="textSecondary" display="block">
                PDF, JPG, PNG (Max 1MB)
              </Typography>
              
              {safeData.gstCertificate?.length > 0 && (
                <Box sx={{ 
                  mt: 2,
                  p: 1,
                  backgroundColor: '#e8f5e9',
                  borderRadius: 1
                }}>
                  {safeData.gstCertificate.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => handleRemoveFile("gstCertificate", index)}
                      deleteIcon={<DeleteIcon />}
                      sx={{ m: 0.5 }}
                      color="success"
                      variant="outlined"
                      icon={<PictureAsPdfIcon color="error" />}
                    />
                  ))}
                </Box>
              )}
            </FileUploadCard>
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
     
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          gap: 1
        }}>
          <Avatar sx={{ 
            bgcolor: '#ff9800', 
            width: 32, 
            height: 32,
            fontSize: '1rem'
          }}>
            4
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Outlet Images
          </Typography>
        </Box>
        
        <Grid container spacing={3} display={'flex'} flexDirection={'column'}>
          {/* Exterior Images */}
          <Grid item xs={12} md={6}>
            <FileUploadCard sx={{ 
              backgroundColor: '#fafafa',
              border: '2px dashed #e0e0e0',
              p: 2,
              textAlign: 'center'
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Exterior Outlet Images (3 required)
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                size="small"
                sx={{ mb: 1 }}
              >
                Upload Exterior
                <VisuallyHiddenInput
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileChange("exteriorOutlet", {
                    maxFiles: 5,
                    allowedTypes: ["image/jpeg", "image/png"],
                    maxSize: 3 * 1024 * 1024,
                  })}
                />
              </Button>
              <Typography variant="caption" color="textSecondary" display="block">
                JPG, PNG (Max 3MB )
              </Typography>
              
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
                              "&:hover": {
                                backgroundColor: "error.dark",
                              },
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
                    color={
                      safeData.exteriorOutlet.length < 3
                        ? "error"
                        : "textSecondary"
                    }
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
            </FileUploadCard>
          </Grid>
          
          {/* Interior Images */}
          <Grid item xs={12} md={6}>
            <FileUploadCard sx={{ 
              backgroundColor: '#fafafa',
              border: '2px dashed #e0e0e0',
              p: 2,
              textAlign: 'center'
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Interior Outlet Images (3 required)
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                size="small"
                sx={{ mb: 1 }}
              >
                Upload Interior
                <VisuallyHiddenInput
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileChange("interiorOutlet", {
                    maxFiles: 5,
                    allowedTypes: ["image/jpeg", "image/png"],
                    maxSize: 3 * 1024 * 1024,
                  })}
                />
              </Button>
              <Typography variant="caption" color="textSecondary" display="block">
                JPG, PNG (Max 3MB )
              </Typography>
              
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
                              "&:hover": {
                                backgroundColor: "error.dark",
                              },
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
                    color={
                      safeData.interiorOutlet.length < 3
                        ? "error"
                        : "textSecondary"
                    }
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
            </FileUploadCard>
          </Grid>
        </Grid>
    </Grid>
  </Grid>
</ScrollableContent>
   
  );
};

export default Uploads;

