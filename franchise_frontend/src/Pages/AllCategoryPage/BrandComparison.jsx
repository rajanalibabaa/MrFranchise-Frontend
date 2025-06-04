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
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Brand Comparison</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {selectedBrands.length === 0 ? (
          <Typography>No brands selected for comparison</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Feature</TableCell>
                  {selectedBrands.map((brand) => (
                    <TableCell key={brand.uuid} align="center">
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="subtitle2">
                          {brand.personalDetails?.brandName}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => removeFromComparison(brand.uuid)}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Basic Information Rows */}
                {basicInfoFields.map((field) => (
                  <TableRow key={field.label}>
                    <TableCell component="th" scope="row">
                      <Typography variant="subtitle2">{field.label}</Typography>
                    </TableCell>
                    {selectedBrands.map((brand) => (
                      <TableCell key={`${brand.uuid}-${field.field}`} align="center">
                        {getNestedValue(brand, field.field) || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* Franchise Model Navigation */}
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2">Franchise Model</Typography>
                  </TableCell>
                  {selectedBrands.map((brand) => {
                    const models = brand.franchiseDetails?.modelsOfFranchise || [];
                    const currentIndex = currentModelIndexes[brand.uuid] || 0;
                    const currentModel = models[currentIndex];
                    
                    return (
                      <TableCell key={`${brand.uuid}-model-nav`} align="center">
                        {models.length > 0 ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handlePrevModel(brand.uuid)}
                              disabled={models.length <= 1}
                            >
                              <ArrowBack fontSize="small" />
                            </IconButton>
                            
                            <Box sx={{ mx: 1, minWidth: 120 }}>
                              <Typography variant="body2">
                                {currentModel?.franchiseModel || "-"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {currentModel?.franchiseType || ""}
                              </Typography>
                              {models.length > 1 && (
                                <Typography variant="caption" display="block">
                                  ({currentIndex + 1} of {models.length})
                                </Typography>
                              )}
                            </Box>
                            
                            <IconButton 
                              size="small" 
                              onClick={() => handleNextModel(brand.uuid)}
                              disabled={models.length <= 1}
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
                  <TableRow key={field.label}>
                    <TableCell component="th" scope="row">
                      <Typography variant="subtitle2">{field.label}</Typography>
                    </TableCell>
                    {selectedBrands.map((brand) => {
                      const models = brand.franchiseDetails?.modelsOfFranchise || [];
                      const currentIndex = currentModelIndexes[brand.uuid] || 0;
                      const currentModel = models[currentIndex];
                      
                      return (
                        <TableCell key={`${brand.uuid}-${field.field}`} align="center">
                          {currentModel ? (currentModel[field.field] || "-") : "-"}
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
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandComparison;