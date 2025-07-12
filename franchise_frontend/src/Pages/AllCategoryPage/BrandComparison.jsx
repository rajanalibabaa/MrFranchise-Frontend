import React, { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Close, ArrowBack, ArrowForward } from "@mui/icons-material";

// Memoize the field configurations to prevent unnecessary re-renders
const basicInfoFields = [
  { label: "Brand Name", field: "brandDetails.brandName" },
  { label: "Company Name", field: "brandDetails.companyName" },
  { label: "Established Year", field: "franchiseDetails.establishedYear" },
  { label: "Total Outlets", field: "franchiseDetails.totalOutlets" },
  { label: "Company Owned Outlets", field: "franchiseDetails.companyOwnedOutlets" },
  { label: "Franchise Outlets", field: "franchiseDetails.franchiseOutlets" },
  { label: "Agreement Period", field: "fico.agreementPeriod" },
  { label: "Requirement Support", field: "franchiseDetails.trainingSupport" },
];

const franchiseModelFields = [
  { label: "Franchise Model", field: "franchiseModel" },
  { label: "Franchise Type", field: "franchiseType" },
  { label: "Area Required (sq.ft)", field: "areaRequired" },
  { label: "Investment Range", field: "investmentRange" },
  { label: "Franchise Fee", field: "franchiseFee" },
  { label: "Royalty Fee", field: "royaltyFee" },
  { label: "Break Even Period", field: "breakEven" },
  { label: "ROI", field: "roi" },
  { label: "Exterior Cost", field: "exteriorCost" },
  { label: "Interior Cost", field: "interiorCost" },
  { label: "Other Costs", field: "otherCost" },
  { label: "Property Type", field: "propertyType" },
];

const BrandComparison = React.memo(({
  open,
  onClose,
  selectedBrands,
  removeFromComparison,
}) => {
  const [currentModelIndexes, setCurrentModelIndexes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the getNestedValue function
  const getNestedValue = useCallback((obj, path) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  }, []);

  // Initialize or update current model indexes when brands change
  React.useEffect(() => {
    const indexes = {};
    let needsUpdate = false;
    
    selectedBrands.forEach(brand => {
      if (brand.uuid && !(brand.uuid in currentModelIndexes)) {
        indexes[brand.uuid] = 0;
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      setCurrentModelIndexes(prev => ({ ...prev, ...indexes }));
    }
  }, [selectedBrands, currentModelIndexes]);

  // Memoized handler for model navigation
  const handleNextModel = useCallback((brandId) => {
    setCurrentModelIndexes(prev => {
      const brand = selectedBrands.find(b => b.uuid === brandId);
      const brandModels = brand?.franchiseDetails?.modelsOfFranchise || [];
      const currentIndex = prev[brandId] || 0;
      return {
        ...prev,
        [brandId]: (currentIndex + 1) % brandModels.length
      };
    });
  }, [selectedBrands]);

  const handlePrevModel = useCallback((brandId) => {
    setCurrentModelIndexes(prev => {
      const brand = selectedBrands.find(b => b.uuid === brandId);
      const brandModels = brand?.franchiseDetails?.modelsOfFranchise || [];
      const currentIndex = prev[brandId] || 0;
      return {
        ...prev,
        [brandId]: (currentIndex - 1 + brandModels.length) % brandModels.length
      };
    });
  }, [selectedBrands]);

  // Memoize the table rows to prevent unnecessary re-renders
  const renderBasicInfoRows = useMemo(() => (
    basicInfoFields.map((field) => (
      <TableRow key={field.label} hover>
        <TableCell component="th" scope="row" sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}>
          <Typography variant="subtitle2">{field.label}</Typography>
        </TableCell>
        {selectedBrands.map((brand) => (
          <TableCell 
            key={`${brand.uuid}-${field.field}`} 
            align="center"
            sx={{ 
              borderLeft: "1px solid #e0e0e0",
              bgcolor: field.label === "Brand Name" ? "#f5f5f5" : "white"
            }}
          >
            {getNestedValue(brand, field.field) || "-"}
          </TableCell>
        ))}
      </TableRow>
    ))
  ), [selectedBrands, getNestedValue]);

  const renderFranchiseModelDetails = useMemo(() => (
    franchiseModelFields.slice(1).map((field) => (
      <TableRow key={field.label} hover>
        <TableCell component="th" scope="row" sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}>
          <Typography variant="subtitle2">{field.label}</Typography>
        </TableCell>
        {selectedBrands.map((brand) => {
          const models = brand.franchiseDetails?.modelsOfFranchise || [];
          const currentIndex = currentModelIndexes[brand.uuid] || 0;
          const currentModel = models[currentIndex];
          
          return (
            <TableCell 
              key={`${brand.uuid}-${field.field}`} 
              align="center"
              sx={{ 
                borderLeft: "1px solid #e0e0e0",
                bgcolor: "white"
              }}
            >
              {currentModel ? (
                <Typography 
                  sx={{ 
                    color: field.label.includes("Fee") || field.label.includes("Cost") ? "#ff9800" : "inherit",
                    fontWeight: field.label.includes("Investment") ? "bold" : "normal"
                  }}
                >
                  {currentModel[field.field] || "-"}
                </Typography>
              ) : "-"}
            </TableCell>
          );
        })}
      </TableRow>
    ))
  ), [selectedBrands, currentModelIndexes]);

  // Virtualization would be better for very large tables, but for moderate sizes this is sufficient
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth 
      scroll="paper"
      TransitionProps={{
        onEnter: () => setIsLoading(true),
        onEntered: () => setIsLoading(false),
        onExit: () => setIsLoading(false),
      }}
    >
      <DialogTitle sx={{ bgcolor: "", color: "Black", position: 'relative' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Brand Comparison</Typography>
          <IconButton onClick={onClose} sx={{ color: "black" }}>
            <Close />
          </IconButton>
        </Box>
        {isLoading && (
          <CircularProgress 
            size={24} 
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </DialogTitle>
      <DialogContent dividers>
        {selectedBrands.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              No brands selected for comparison
            </Typography>
          </Box>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxHeight: 'calc(100vh - 200px)',
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ff9800',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f5f5f5',
              }
            }}
          >
            <Table 
              size="small" 
              sx={{ minWidth: 650 }}
              stickyHeader
            >
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", width: "200px" }}>Feature</TableCell>
                  {selectedBrands.map((brand) => (
                    <TableCell 
                      key={brand.uuid} 
                      align="center" 
                      sx={{ 
                        width: `${80/selectedBrands.length}%`,
                        position: 'sticky',
                        top: 0,
                        bgcolor: '#f5f5f5',
                        zIndex: 1,
                      }}
                    >
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                          src={brand.uploads?.brandLogo}
                          alt={brand.brandDetails?.brandName}
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius:"50%",
                            mb: 1,
                            border: "2px solid #ff9800",
                            bgcolor: "white",
                            p: 0.5
                          }}
                          variant="rounded"
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#4caf50" }}>
                          {brand.brandDetails?.brandName}
                        </Typography>
                        <Chip
                          label="Remove"
                          size="small"
                          onClick={() => removeFromComparison(brand.uuid)}
                          sx={{ 
                            mt: 1, 
                            bgcolor: "#F2211D", 
                            color: "white",
                            "&:hover": {
                              bgcolor: "#fb8c00"
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {renderBasicInfoRows}

                {/* Franchise Model Navigation */}
                <TableRow hover>
                  <TableCell component="th" scope="row" sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}>
                    <Typography variant="subtitle2">Franchise Model</Typography>
                  </TableCell>
                  {selectedBrands.map((brand) => {
                    const models = brand.franchiseDetails?.modelsOfFranchise || [];
                    const currentIndex = currentModelIndexes[brand.uuid] || 0;
                    const currentModel = models[currentIndex];
                    
                    return (
                      <TableCell 
                        key={`${brand.uuid}-model-nav`} 
                        align="center"
                        sx={{ bgcolor: "#f5f5f5" }}
                      >
                        {models.length > 0 ? (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "#fff8e1"
                          }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handlePrevModel(brand.uuid)}
                              disabled={models.length <= 1}
                              sx={{ color: "#ff9800" }}
                            >
                              <ArrowBack fontSize="small" />
                            </IconButton>
                            
                            <Box sx={{ mx: 1, minWidth: 120 }}>
                              <Typography variant="body2" fontWeight="bold" color="#4caf50">
                                {currentModel?.franchiseModel || "-"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {currentModel?.franchiseType || ""}
                              </Typography>
                              {models.length > 1 && (
                                <Typography variant="caption" display="block" color="#ff9800">
                                  ({currentIndex + 1} of {models.length})
                                </Typography>
                              )}
                            </Box>
                            
                            <IconButton 
                              size="small" 
                              onClick={() => handleNextModel(brand.uuid)}
                              disabled={models.length <= 1}
                              sx={{ color: "#ff9800" }}
                            >
                              <ArrowForward fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography variant="body2">-</Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>

                {renderFranchiseModelDetails}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions sx={{ bgcolor: "#f5f5f5" }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: "white",
            bgcolor: "#ff9800",
            "&:hover": {
              bgcolor: "#388e3c"
            }
          }}
        >
          Close Comparison
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default BrandComparison;