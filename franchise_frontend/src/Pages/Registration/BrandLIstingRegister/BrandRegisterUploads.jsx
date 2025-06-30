import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  styled,
  CircularProgress,
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
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  useTheme
} from "@mui/material";
import {
  InfoOutlined,
  CloudUpload,
  VideoCameraBack,
  Description,
  PhotoCamera,
  ErrorOutline,
  CheckCircle,
  Delete
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
  display: 'flex',
  alignItems: 'center'
}));

const FilePreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 4
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
  const [awardsData, setAwardsData] = useState([]);
  const theme = useTheme();
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
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.error) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        color: 'error.main',
        textAlign: 'center'
      }}>
        <ErrorOutline fontSize="large" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Failed to load brand details
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {data.error.message || "Unknown error occurred"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: { xs: 2, md: 3 } }}>
      {/* Section 1: Brand Identity */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Brand Identity
          <Tooltip title={
                          <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                           Drag and drop your logo here or click to upload

                            
                          </span>
                        }
                        placement="right-start"
                        arrow
                        enterTouchDelay={0} // makes it responsive on mobile too
                      >
                        <IconButton
                          size="small"
                          sx={{
                            // p: 0.8,
                            color: "warning.main",
                            // backgroundColor: 'info.light',
                            "&:hover": {
                              backgroundColor: "info.main",
                              color: "white",
                            },
                            marginLeft: "5px",
                            // borderRadius: '50%',
                          }}
                        >
                          <InfoOutlined fontSize="medium" />
                        </IconButton>
                      </Tooltip>{" "}
        </SectionTitle>
        
        <Grid  spacing={3} display={"flex"} justifyContent={"space-evenly"}>
          {/* Brand Logo */}
          <Grid item xs={12} md={6}>
            <Typography textAlign={"center"} mb={1} variant="body2">Brand Logo</Typography>
            <FormControl fullWidth>
              <UploadButton
                component="label"
                color="success"
                variant="outlined"
                // fullWidth
                startIcon={<CloudUpload />}
              >
                Upload Logo
                <VisuallyHiddenInput 
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange("brandLogo", {
                    maxFiles: 1,
                    allowedTypes: ["image/jpeg", "image/png"],
                    maxSize: 2,
                  })}
                />
              </UploadButton>
              <Typography variant="caption">(Accepted formats: JPEG, PNG  up to 2MB )</Typography>
              
              {safeData.brandLogo?.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={safeData.brandLogo[0].name}
                    onDelete={() => handleRemoveFile("brandLogo", 0)}
                    deleteIcon={<CheckCircle fontSize="small" />}
                    variant="outlined"
                    color="success"
                  />
                  <IconButton 
                    onClick={() => handleRemoveFile("brandLogo", 0)}
                    color="error"
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </FormControl>
          </Grid>
          
          {/* Promotion Videos */}
          <Grid item xs={12} md={6}>
            <Typography textAlign={"center"}  mb={1} variant="body2">Franchise Promotion Video</Typography>
            <FormControl fullWidth>
              <UploadButton
                component="label"
                variant="outlined"
                                color="success"

                // fullWidth
                startIcon={<VideoCameraBack />}
              >
                Upload Video
                <VisuallyHiddenInput
                  type="file"
                  accept="video/mp4,video/quicktime"
                  onChange={handleFileChange("franchisePromotionVideo", {
                    maxFiles: 1,
                    allowedTypes: ["video/mp4", "video/quicktime"],
                    maxSize: 25,
                  })}
                />
              </UploadButton>
              <Typography variant="caption">  Accepted formats: MP4, Quicktime Video ( up to 25MB )</Typography>
              {safeData.franchisePromotionVideo?.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={safeData.franchisePromotionVideo[0].name}
                    onDelete={() => handleRemoveFile("franchisePromotionVideo", 0)}
                    deleteIcon={<CheckCircle fontSize="small" />}
                    variant="outlined"
                    color="success"
                  />
                  <IconButton 
                    onClick={() => handleRemoveFile("franchisePromotionVideo", 0)}
                    color="error"
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 2: Company Credentials */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Company Credentials
         <Tooltip title={
                          <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                           Drag and drop your logo here or click to upload
                          </span>
                        }
                        placement="right-start"
                        arrow
                        enterTouchDelay={0} // makes it responsive on mobile too
                      >
                        <IconButton
                          size="small"
                          sx={{
                            // p: 0.8,
                            color: "warning.main",
                            // backgroundColor: 'info.light',
                            "&:hover": {
                              backgroundColor: "info.main",
                              color: "white",
                            },
                            marginLeft: "5px",
                            // borderRadius: '50%',
                          }}
                        >
                          <InfoOutlined fontSize="medium" />
                        </IconButton>
                      </Tooltip>{" "}
        </SectionTitle>
        
        <Grid display={"flex"} justifyContent={"space-evenly"} spacing={3}>
          {/* PAN Details */}
          <Grid item xs={12} md={6}>
            <TextField
              label="PAN Number"
              fullWidth
              value={pancardNumber || ""}
              onChange={(e) => onPancardNumberChange(e.target.value.toUpperCase())}
              error={!!errors.pancardNumber}
              helperText={errors.pancardNumber}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 10,
                pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
                title: "PAN must be in format: AAAAA9999A",
              }}
            />
            
            <InputLabel shrink sx={{ mb: 1 }}>PAN Card Upload</InputLabel>
            <UploadButton
              component="label"
              variant="outlined"
              startIcon={<Description />}
              fullWidth
                              color="success"

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
            </UploadButton>
            <Typography variant="caption">  Accepted formats: PDF, JPEG, PNG ( up to 1MB )</Typography>
            {safeData.pancard?.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={safeData.pancard[0].name}
                  onDelete={() => handleRemoveFile("pancard", 0)}
                  deleteIcon={<CheckCircle fontSize="small" />}
                  variant="outlined"
                  color="success"
                />
                <IconButton 
                  onClick={() => handleRemoveFile("pancard", 0)}
                  color="error"
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            )}
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
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 15,
                pattern: "[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}",
                title: "GST must be in format: 22AAAAA0000A1Z5",
              }}
            />
            
            <InputLabel shrink sx={{ mb: 1 }}>GST Certificate Upload</InputLabel>
            <UploadButton
              component="label"
              variant="outlined"
              startIcon={<Description />}
              fullWidth
                              color="success"

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
            </UploadButton>
            <Typography variant="caption">  Accepted formats: PDF, JPEG, PNG ( up to 1MB )</Typography>
            
            {safeData.gstCertificate?.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={safeData.gstCertificate[0].name}
                  onDelete={() => handleRemoveFile("gstCertificate", 0)}
                  deleteIcon={<CheckCircle fontSize="small" />}
                  variant="outlined"
                  color="success"
                />
                <IconButton 
                  onClick={() => handleRemoveFile("gstCertificate", 0)}
                  color="error"
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 3: Brand Images */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Store / Branch / Images
         <Tooltip title={
                          <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                            <strong>Brand Images</strong> <br />
                            Accepted formats: JPEG, PNG ( up to 1MB )
                          </span>
                        }
                        placement="right-start"
                        arrow
                        enterTouchDelay={0} // makes it responsive on mobile too
                      >
                        <IconButton
                          size="small"
                          sx={{
                            // p: 0.8,
                            color: "warning.main",
                            // backgroundColor: 'info.light',
                            "&:hover": {
                              backgroundColor: "info.main",
                              color: "white",
                            },
                            marginLeft: "5px",
                            // borderRadius: '50%',
                          }}
                        >
                          <InfoOutlined fontSize="medium" />
                        </IconButton>
                      </Tooltip>{" "}
        </SectionTitle>
        
        <Grid  container spacing={3}>
          {/* Exterior Images */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <UploadButton
                component="label"
                variant="outlined"
                                color="success"

                fullWidth
                startIcon={<PhotoCamera />}
              >
                Upload Exterior Images
                <VisuallyHiddenInput
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileChange("exteriorOutlet", {
                    maxFiles: 5,
                    allowedTypes: ["image/jpeg", "image/png"],
                    maxSize: 5,
                  })}
                />
              </UploadButton>
                          <Typography variant="caption">  Accepted formats: JPEG, PNG ( up to total 5MB   )</Typography>

              {safeData.exteriorOutlet?.length > 0 && (
                <Box>
                  <ImageList cols={3} gap={8} sx={{ maxHeight: 200 }}>
                    {safeData.exteriorOutlet.map((file, index) => (
                      <ImageListItem key={index}>
                        {createObjectURL(file) && (
                          <FilePreviewImage
                            src={createObjectURL(file)}
                            alt={`Exterior ${index + 1}`}
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
                              sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          }
                          sx={{ background: 'none' }}
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
              <UploadButton
                component="label"
                variant="outlined"
                fullWidth
                                color="success"

                startIcon={<PhotoCamera />}
              >
                Upload Interior Images
                <VisuallyHiddenInput
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileChange("interiorOutlet", {
                    maxFiles: 5,
                    allowedTypes: ["image/jpeg", "image/png"],
                    maxSize: 5,
                  })}
                />
              </UploadButton>
                                        <Typography variant="caption">  Accepted formats: JPEG, PNG ( up to total 5MB   )</Typography>

              {safeData.interiorOutlet?.length > 0 && (
                <Box>
                  <ImageList cols={3} gap={8} sx={{ maxHeight: 200 }}>
                    {safeData.interiorOutlet.map((file, index) => (
                      <ImageListItem key={index}>
                        {createObjectURL(file) && (
                          <FilePreviewImage
                            src={createObjectURL(file)}
                            alt={`Interior ${index + 1}`}
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
                              sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          }
                          sx={{ background: 'none' }}
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
      </StyledPaper>

      {/* Section 4: Awards & Recognitions */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Awards & Recognitions
          <Tooltip title={
                          <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                            <span style={{ fontWeight: "bold" }}>Awards: </span>
                            You can list up to 5 awards or recognitions.
                          </span>
                        }
                        placement="right-start"
                        arrow
                        enterTouchDelay={0} // makes it responsive on mobile too
                      >
                        <IconButton
                          size="small"
                          sx={{
                            // p: 0.8,
                            color: "warning.main",
                            // backgroundColor: 'info.light',
                            "&:hover": {
                              backgroundColor: "info.main",
                              color: "white",
                            },
                            marginLeft: "5px",
                            // borderRadius: '50%',
                          }}
                        >
                          <InfoOutlined fontSize="medium" />
                        </IconButton>
                      </Tooltip>{" "}
        </SectionTitle>
        
        <Grid   display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Award Description"
            size="large"
                         
              value={safeData.awardsText || ""}
              onChange={(e) => safeOnChange({ awardsText: e.target.value })}
              // multiline
              rows={2}
              sx={{ mb: { xs: 2, md: 0 },width:'95vh' }}
            />
          </Grid>
          
          <Grid item xs={12} md={4} mt={0}>
            
            <UploadButton
              component="label"
              variant="outlined"
              fullWidth
                              color="success"

              startIcon={<CloudUpload />}
            >
              Upload (PDF JPEG, PNG)
              
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,.doc,.docx,image/jpeg,image/png"
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
            </UploadButton>
            
          </Grid>
          
          <Grid item xs={12} md={2} mt={0}>
            <Button
              variant="contained"
                              color="success"

              // fullWidth
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
                    <TableCell align="right">Remove</TableCell>
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
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
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
         <Tooltip title={
                          <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                            <span style={{ fontWeight: "bold" }}>Business Plan: </span>
                            You can upload your business plan in PDF, JPEG format.
                          </span>
                        }
                        placement="right-start"
                        arrow
                        enterTouchDelay={0} // makes it responsive on mobile too
                      >
                        <IconButton
                          size="small"
                          sx={{
                            // p: 0.8,
                            color: "warning.main",
                            // backgroundColor: 'info.light',
                            "&:hover": {
                              backgroundColor: "info.main",
                              color: "white",
                            },
                            marginLeft: "5px",
                            // borderRadius: '50%',
                          }}
                        >
                          <InfoOutlined fontSize="medium" />
                        </IconButton>
                      </Tooltip>{" "}
                      
        </SectionTitle>
        
        <UploadButton
        sx={{width:'75vh'}}
          component="label"
          variant="outlined"
          size="small"
          color="success"
          startIcon={<Description />}
        >
          Upload (PDF JPEG, PNG)
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
          
        </UploadButton>

        
        {safeData.businessPlan?.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
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
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        )}
      </StyledPaper>
    </Box>
  );
};

export default Uploads;