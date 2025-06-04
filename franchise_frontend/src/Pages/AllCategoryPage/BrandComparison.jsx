import React, { useState } from "react";
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
} from "@mui/material";
import { Close, ArrowBack, ArrowForward } from "@mui/icons-material";

const BrandComparison = ({
  open,
  onClose,
  selectedBrands,
  removeFromComparison,
}) => {
  const [currentModelIndexes, setCurrentModelIndexes] = useState({});
  
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
  };

  // Initialize or update current model indexes when brands change
  React.useEffect(() => {
    const indexes = {};
    selectedBrands.forEach(brand => {
      if (brand.uuid && !(brand.uuid in currentModelIndexes)) {
        indexes[brand.uuid] = 0;
      }
    });
    if (Object.keys(indexes).length > 0) {
      setCurrentModelIndexes(prev => ({ ...prev, ...indexes }));
    }
  }, [selectedBrands]);

  const handleNextModel = (brandId) => {
    setCurrentModelIndexes(prev => {
      const brandModels = selectedBrands.find(b => b.uuid === brandId)?.franchiseDetails?.modelsOfFranchise || [];
      const currentIndex = prev[brandId] || 0;
      return {
        ...prev,
        [brandId]: (currentIndex + 1) % brandModels.length
      };
    });
  };

  const handlePrevModel = (brandId) => {
    setCurrentModelIndexes(prev => {
      const brandModels = selectedBrands.find(b => b.uuid === brandId)?.franchiseDetails?.modelsOfFranchise || [];
      const currentIndex = prev[brandId] || 0;
      return {
        ...prev,
        [brandId]: (currentIndex - 1 + brandModels.length) % brandModels.length
      };
    });
  };

  // Main comparison fields
  const basicInfoFields = [
    { label: "Brand Name", field: "personalDetails.brandName" },
    { label: "Company Name", field: "personalDetails.companyName" },
    { label: "Established Year", field: "personalDetails.establishedYear" },
    { label: "Total Outlets", field: "franchiseDetails.totalOutlets" },
    { label: "Company Owned Outlets", field: "franchiseDetails.companyOwnedOutlets" },
    { label: "Franchise Outlets", field: "franchiseDetails.franchiseOutlets" },
    { label: "Agreement Period", field: "franchiseDetails.agreementPeriod" },
    { label: "Requirement Support", field: "franchiseDetails.requirementSupport" },
  ];

  // Franchise model fields
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="paper">
      <DialogTitle sx={{ bgcolor: "", color: "Black" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Brand Comparison</Typography>
          <IconButton onClick={onClose} sx={{ color: "black" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {selectedBrands.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              No brands selected for comparison
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", width: "200px" }}>Feature</TableCell>
                  {selectedBrands.map((brand) => (
                    <TableCell key={brand.uuid} align="center" sx={{ width: `${80/selectedBrands.length}%` }}>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                          src={brand.brandDetails?.brandLogo}
                          alt={brand.personalDetails?.brandName}
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
                          {brand.personalDetails?.brandName}
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
                {/* Basic Information Rows */}
                {basicInfoFields.map((field) => (
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
                ))}



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

                {/* Franchise Model Details */}
                {franchiseModelFields.slice(1).map((field) => (
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
                ))}
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
};

export default BrandComparison;