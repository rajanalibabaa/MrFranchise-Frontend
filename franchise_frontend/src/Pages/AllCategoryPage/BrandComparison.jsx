import React from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Close, ExpandMore } from "@mui/icons-material";

const BrandComparison = ({
  open,
  onClose,
  selectedBrands,
  removeFromComparison,
}) => {
  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
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
          <Box>
            {/* Basic Information */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">Basic Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
                         <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle2">Requirement Support</Typography>
                        </TableCell>
                        {selectedBrands.map((brand) => (
                          <TableCell key={`${brand.uuid}-support`} align="center">
                            {brand.franchiseDetails?.requirementSupport || "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                       {/* <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle2">Brand Description</Typography>
                        </TableCell>
                        {selectedBrands.map((brand) => (
                          <TableCell key={`${brand.uuid}-desc`} align="center">
                            <Typography variant="body2" noWrap>
                              {brand.personalDetails?.brandDescription || "-"}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                       */}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            {/* Franchise Models */}
            {selectedBrands.map((brand, index) => (
              brand.franchiseDetails?.modelsOfFranchise?.map((model, modelIndex) => (
                <Accordion key={`${brand.uuid}-model-${modelIndex}`}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1">
                      {brand.personalDetails?.brandName} - {model.franchiseModel} ({model.franchiseType})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableBody>
                          {franchiseModelFields.map((field) => (
                            <TableRow key={field.label}>
                              <TableCell component="th" scope="row">
                                <Typography variant="subtitle2">{field.label}</Typography>
                              </TableCell>
                              <TableCell align="left">
                                {model[field.field] || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                          

                          
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))
            ))}

          
          </Box>
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