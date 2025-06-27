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
  TableRow,
  Tooltip,
  FormControl,
  InputLabel,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  MenuItem,
  Select

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
import { InfoOutlined,CloudUpload, VideoCameraBack, Description,PhotoCamera, ErrorOutline} from "@mui/icons-material";
import { CheckCircle, Delete } from "lucide-react";

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
    if (file instanceof Blob) {
      return URL.createObjectURL(file);
    }
    return "";
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
    <ScrollableContent sx={{ pr: 1, maxWidth: 1200, margin: '0 auto' }}>
  {/* Form Container */}
  <Box component="form" sx={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1
  }}>
    
    {/* Section 1: Brand Logo */}
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
        Brand Identity
      </Typography>
      
      <Grid container spacing={3}>
        {/* Brand Logo */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel shrink>Brand Logo</InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                JPG, PNG (Max 10MB)
              </Typography>
              <Tooltip title="Drag & drop your logo here or click to browse">
                <InfoOutlined color="action" fontSize="small" />
              </Tooltip>
            </Box>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<CloudUpload />}
              sx={{ height: 56, mb: 1 }}
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
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={safeData.brandLogo[0].name}
                  onDelete={() => handleRemoveFile("brandLogo", 0)}
                  deleteIcon={<CheckCircle />}
                  variant="outlined"
                  color="success"
                  sx={{ mr: 1 }}
                />
                <IconButton 
                  onClick={() => handleRemoveFile("brandLogo", 0)}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            )}
          </FormControl>
        </Grid>
        
        {/* Promotion Videos */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel shrink>Promotion Videos</InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                MP4, MOV (Max 40MB)
              </Typography>
              <Tooltip title="Drag & drop your videos here or click to browse">
                <InfoOutlined color="action" fontSize="small" />
              </Tooltip>
            </Box>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<VideoCameraBack />}
              sx={{ height: 56, mb: 1 }}
            >
              Upload Video
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
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={safeData.franchisePromotionVideo[0].name}
                  onDelete={() => handleRemoveFile("franchisePromotionVideo", 0)}
                  deleteIcon={<CheckCircle />}
                  variant="outlined"
                  color="success"
                  sx={{ mr: 1 }}
                />
                <IconButton 
                  onClick={() => handleRemoveFile("franchisePromotionVideo", 0)}
                  color="error"
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Box>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Paper>

    {/* Section 2: Company Credentials */}
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
        Company Credentials
      </Typography>
      
      <Grid container spacing={3}>
        {/* PAN Details */}
        <Grid item xs={12} md={6}>
          <TextField
            label="PAN Number"
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
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>PAN Card Upload</Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Description />}
              fullWidth
              sx={{ height: 56, mb: 1 }}
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
              <Chip
                label={safeData.pancard[0].name}
                onDelete={() => handleRemoveFile("pancard", 0)}
                deleteIcon={<CheckCircle />}
                variant="outlined"
                color="success"
                sx={{ mr: 1 }}
              />
            )}
          </Box>
        </Grid>
        
        {/* GST Details */}
        <Grid item xs={12} md={6}>
          <TextField
            label="GST Number"
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
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>GST Certificate Upload</Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Description />}
              fullWidth
              sx={{ height: 56, mb: 1 }}
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
              <Chip
                label={safeData.gstCertificate[0].name}
                onDelete={() => handleRemoveFile("gstCertificate", 0)}
                deleteIcon={<CheckCircle />}
                variant="outlined"
                color="success"
                sx={{ mr: 1 }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>

    {/* Section 3: Brand Images */}
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
        Brand Images
      </Typography>
      
      <Grid container spacing={3}>
        {/* Exterior Images */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel shrink>Exterior Outlet Images (Min 3)</InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                JPG, PNG (Max 3MB)
              </Typography>
              <Tooltip title="Exterior images of your outlets">
                <InfoOutlined color="action" fontSize="small" />
              </Tooltip>
            </Box>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<PhotoCamera />}
              sx={{ height: 56, mb: 2 }}
            >
              Upload Exterior Images
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
              <Box>
                <ImageList cols={3} gap={8} sx={{ maxHeight: 200 }}>
                  {safeData.exteriorOutlet.map((file, index) => (
                    <ImageListItem key={index}>
                     {createObjectURL(file) && (
  <img
    src={createObjectURL(file)}
    alt={`Interior ${index + 1}`}
    loading="lazy"
  />
)}
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            onClick={() => handleRemoveFile("exteriorOutlet", index)}
                            color="error"
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
                <Typography 
                  variant="caption" 
                  color={safeData.exteriorOutlet.length < 3 ? "error" : "success"}
                  sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                >
                  {safeData.exteriorOutlet.length < 3 ? (
                    <>
                      <ErrorOutline fontSize="small" sx={{ mr: 0.5 }} />
                      {3 - safeData.exteriorOutlet.length} more required
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
          </FormControl>
        </Grid>
        
        {/* Interior Images */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel shrink>Interior Outlet Images (Min 3)</InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                JPG, PNG (Max 3MB)
              </Typography>
              <Tooltip title="Interior images of your outlets">
                <InfoOutlined color="action" fontSize="small" />
              </Tooltip>
            </Box>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<PhotoCamera />}
              sx={{ height: 56, mb: 2 }}
            >
              Upload Interior Images
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
              <Box>
                <ImageList cols={3} gap={8} sx={{ maxHeight: 200 }}>
                  {safeData.interiorOutlet.map((file, index) => (
                    <ImageListItem key={index}>
                      {createObjectURL(file) && (
  <img
    src={createObjectURL(file)}
    alt={`Exterior ${index + 1}`}
    loading="lazy"
  />
)}
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            onClick={() => handleRemoveFile("interiorOutlet", index)}
                            color="error"
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
                <Typography 
                  variant="caption" 
                  color={safeData.interiorOutlet.length < 3 ? "error" : "success"}
                  sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                >
                  {safeData.interiorOutlet.length < 3 ? (
                    <>
                      <ErrorOutline fontSize="small" sx={{ mr: 0.5 }} />
                      {3 - safeData.interiorOutlet.length} more required
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
          </FormControl>
        </Grid>
      </Grid>
    </Paper>

    {/* Section 4: Awards & Recognitions */}
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
        Awards & Recognitions
      </Typography>
      
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} md={6}>
          <TextField
            label="Award Description"
            fullWidth
            value={safeData.awardsText || ""}
            onChange={(e) => safeOnChange({ awardsText: e.target.value })}
            multiline
            rows={2}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Button
            component="label"
            variant="outlined"
            fullWidth
            startIcon={<CloudUpload />}
            sx={{ height: 56 }}
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
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            fullWidth
            sx={{ height: 56 }}
            disabled={
              !safeData.awardsText ||
              !safeData.awardsDocuments ||
              safeData.awardsDocuments.length === 0
            }
            onClick={handleAddAward}
          >
            Add Award
          </Button>
        </Grid>
      </Grid>
      
      {awardsData.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Document</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {awardsData.map((award, index) => (
                  <TableRow key={index}>
                    <TableCell>{award.awardsText}</TableCell>
                    <TableCell>
                      {award.awardsDocuments?.[0]?.name || 'No document'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={() => handleAwardRemove(index)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Paper>

    {/* Section 5: Business Plan */}
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
        Business Plan (Optional)
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload your business plan document (PDF, DOC, DOCX - Max 1MB)
      </Typography>
      
      <Button
        component="label"
        variant="outlined"
        startIcon={<Description />}
        sx={{ height: 56 }}
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
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description color="primary" />
          <Typography variant="body2">
            {safeData.businessPlan[0].name}
          </Typography>
          <IconButton 
            onClick={() => handleRemoveFile("businessPlan", 0)}
            size="small"
            color="error"
            sx={{ ml: 'auto' }}
          >
            <Delete />
          </IconButton>
        </Box>
      )}
    </Paper>
  </Box>
</ScrollableContent>
  );
};

export default Uploads;