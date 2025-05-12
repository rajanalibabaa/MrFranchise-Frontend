import React, { useState, useEffect } from "react";
import { 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { InsertDriveFile, Image } from "@mui/icons-material";

const Documentation = ({ data, onChange, errors }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [documentPreviews, setDocumentPreviews] = useState({
    brandLogo: null,
    businessRegistration: null,
    gstCertificate: null,
    franchiseAgreement: null,
    menuCatalog: null,
    interiorPhotos: null,
    fssaiLicense: null,
    panCard: null,
    aadhaarCard: null,
  });

  const formatLabel = (str) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  };

  const handleDocumentUpload = (type) => (event) => {
    const file = event.target.files[0];
    if (file) {
      onChange(type, file);
      const reader= new FileReader();
      reader.onload =() =>{
        localStorage.setItem(type,reader.result);
      };
      

      const previewUrl = URL.createObjectURL(file);
      setDocumentPreviews((prev) => ({
        ...prev,
        [type]: previewUrl,
      }));
    }
  };

  useEffect(() => {
    return () => {
      Object.values(documentPreviews).forEach((previewUrl) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      });
    };
  }, [documentPreviews]);

  // Calculate responsive grid columns
  const getGridColumns = () => {
    if (isMobile) return 12;
    if (isTablet) return 6;
    return 4;
  };

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            fontSize: isMobile ? '1.2rem' : '1.5rem'
          }}
        >
          Upload Required Documents
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          Please upload all required documents to complete your application.
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {Object.keys(data).map((docType) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3}
              key={docType}
              sx={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 2,
                  borderColor: errors?.[docType] ? 'error.main' : 
                              documentPreviews[docType] ? "primary.main" : "divider",
                  borderColor: errors?.[docType] ? 'error.main' : 
                              documentPreviews[docType] ? "primary.main" : "divider",
                  transition: "border-color 0.3s ease",
                }}
              >
                <Stack
                  direction="column"
                  alignItems="center"
                  spacing={1}
                  sx={{ 
                    width: "100%",
                    flexGrow: 1
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      textAlign: 'center'
                    }}
                  >
                    {formatLabel(docType)}
                  </Typography>
                  
                  {errors?.[docType] && (
                    <Typography 
                      variant="caption" 
                      color="error"
                      sx={{
                        fontSize: isMobile ? '0.7rem' : '0.8rem'
                      }}
                    >
                      {errors[docType]}
                    </Typography>
                  )}
                  
                  <input
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    id={`${docType}-upload`}
                    type="file"
                    onChange={handleDocumentUpload(docType)}
                  />
                  
                  <label htmlFor={`${docType}-upload`} style={{ width: '100%' }}>
                    <Button
                      variant="contained"
                      component="span"
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        textTransform: "none",
                        width: '100%',
                        fontSize: isMobile ? '0.8rem' : '0.9rem'
                      }}
                    >
                      {data[docType] ? "Replace File" : "Upload File"}
                    </Button>
                  </label>
                  
                  {documentPreviews[docType] ? (
                    <Box sx={{ 
                      width: "100%", 
                      mt: 1,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {data[docType]?.type?.includes("image") ? (
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "75%",
                            borderRadius: 1,
                            overflow: "hidden",
                            bgcolor: "grey.100",
                            flexGrow: 1
                          }}
                        >
                          <Image
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              color: "grey.400",
                            }}
                          />
                          <img
                            src={documentPreviews[docType]}
                            alt={docType}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            p: isMobile ? 1 : 2,
                            bgcolor: "grey.100",
                            borderRadius: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            flexGrow: 1,
                            width: '100%',
                            justifyContent: 'center'
                          }}
                        >
                          <InsertDriveFile
                            sx={{ 
                              fontSize: isMobile ? 30 : 40, 
                              color: "grey.500" 
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              wordBreak: "break-word",
                              fontSize: isMobile ? '0.8rem' : '0.9rem'
                            }}
                          >
                            {data[docType]?.name}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: 120,
                        bgcolor: "grey.50",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexGrow: 1
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          textAlign: "center", 
                          px: 2,
                          fontSize: isMobile ? '0.8rem' : '0.9rem'
                        }}
                      >
                        No file uploaded yet
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Documentation;