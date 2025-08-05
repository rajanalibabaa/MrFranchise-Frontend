import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Tooltip,
  Chip,
  Skeleton,
} from "@mui/material";
import {
  Close,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { RiBookmark3Fill } from "react-icons/ri";
import axios from "axios";

const BrandHeaderCell = React.memo(({ brand, onRemove, onToggleShortList }) => {
  const handleRemove = useCallback((e) => {
    e.stopPropagation();
    onRemove(brand.uuid);
  }, [brand.uuid, onRemove]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={2}
      position="relative"
    >
      <Box position="relative">
        <Avatar
          variant="square"
          src={brand.uploads?.logo || ""}
          alt={brand.brandDetails?.brandName}
          sx={{
            width: 100,
            height: 80,
            borderRadius: "8px",
            mb: 1,
            border: "2px solid #ff9800",
            bgcolor: "white",
            p: 0.5,
          }}
        />
        <Tooltip title={brand?.isShortListed ? "Remove from Shortlist" : "Add to Shortlist"}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortList(brand);
            }}
            sx={{
              position: 'absolute',
              top: '-10px',
              right: '-15px',
              padding: 0.5,
              color: brand?.isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
            size="small"
          >
            <RiBookmark3Fill size={23} />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#4caf50" }}>
        {brand.brandDetails?.brandName || "-"}
      </Typography>
      {/* <Chip
        label="Remove"
        size="small"
        onClick={handleRemove}
        sx={{
          mt: 1,
          bgcolor: "#F2211D",
          color: "white",
          "&:hover": { bgcolor: "#fb8c00" },
        }}
      /> */}
    </Box>
  );
});

const BrandComparison = ({
  open,
  onClose,
  selectedBrands,
  onRemoveFromComparison,
}) => {
  const [currentModelIndexes, setCurrentModelIndexes] = useState({});
  const [brandDetails, setBrandDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const basicInfoFields = useMemo(() => [
    { label: "Brand Name", field: "brandDetails.brandName" },
    { label: "Company Name", field: "brandDetails.companyName" },
    { label: "Established Year", field: "brandfranchisedetails.franchiseDetails.establishedYear" },
    { label: "Total Outlets", field: "brandfranchisedetails.franchiseDetails.totalOutlets" },
    { label: "Company Owned Outlets", field: "brandfranchisedetails.franchiseDetails.companyOwnedOutlets" },
    { label: "Franchise Outlets", field: "brandfranchisedetails.franchiseDetails.franchiseOutlets" },
    { label: "Agreement Period", field: "brandfranchisedetails.franchiseDetails.fico[0].agreementPeriod" },
    { label: "Requirement Support", field: "brandfranchisedetails.franchiseDetails.consultationOrAssistance" },
  ], []);

  const franchiseModelFields = useMemo(() => [
    { label: "Franchise Model", field: "franchiseModel" },
    { label: "Franchise Type", field: "franchiseType" },
    { label: "Area Required (sq.ft)", field: "areaRequired" },
    { label: "Investment Range", field: "investmentRange" },
    { label: "Franchise Fee", field: "franchiseFee" },
    { label: "Royalty Fee", field: "royaltyFee" },
    { label: "Break Even Period", field: "breakEven" },
    { label: "ROI", field: "roi" },
    { label: "Interior Cost", field: "interiorCost" },
    { label: "Other Costs", field: "otherCost" },
    { label: "Stock Investment", field: "stockInvestment" },
    { label: "Pay Back Period", field: "payBackPeriod" },
    { label: "Require Working Captial", field: "requireWorkingCapital" },
    { label: "Margin On Sales", field: "marginOnSales" },
  ], []);

  const fetchBrandDetails = useCallback(async () => {
    if (selectedBrands.length === 0) return;

    setLoading(true);
    setError(null);
    
    try {
      const requests = selectedBrands.map(brand => 
        axios.get(`http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brand.uuid}`)
      );

      const responses = await Promise.all(requests);
      
      const details = responses.map(res => {
        const data = res.data.data;
        return Array.isArray(data) ? data[0] : data;
      });

      const indexes = {};
      details.forEach(brand => {
        if (brand?.uuid) {
          indexes[brand.uuid] = 0;
        }
      });

      setBrandDetails(details);
      setCurrentModelIndexes(indexes);
    } catch (err) {
      console.error("Error fetching brand details:", err);
      setError("Failed to load brand details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedBrands]);

  useEffect(() => {
    if (open) {
      fetchBrandDetails();
    }
  }, [open, fetchBrandDetails]);

  // This effect handles brand removal synchronization
  useEffect(() => {
    if (!open) return;
    
    // Get current UUIDs from selectedBrands
    const selectedUUIDs = new Set(selectedBrands.map(b => b.uuid));
    
    // Filter out brands that are no longer selected
    setBrandDetails(prev => prev.filter(brand => selectedUUIDs.has(brand.uuid)));
    
    // Update model indexes for remaining brands
    setCurrentModelIndexes(prev => {
      const newIndexes = {};
      selectedBrands.forEach(brand => {
        newIndexes[brand.uuid] = prev[brand.uuid] || 0;
      });
      return newIndexes;
    });
  }, [selectedBrands, open]);

  const getNestedValue = useCallback((obj, path) => {
    try {
      return path.split('.').reduce((o, p) => {
        if (p.includes('[') && p.includes(']')) {
          const prop = p.substring(0, p.indexOf('['));
          const index = parseInt(p.substring(p.indexOf('[') + 1, p.indexOf(']')));
          return o && o[prop] ? o[prop][index] : null;
        }
        return o ? o[p] : null;
      }, obj) ?? "-";
    } catch (e) {
      return "-";
    }
  }, []);

  const handleToggleShortList = async (brand) => {
    try {
      setBrandDetails(prev =>
        prev.map(b =>
          b.uuid === brand.uuid ? { ...b, isShortListed: !b.isShortListed } : b
        )
      );
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  };

  const handleNextModel = useCallback((brandId) => {
    setCurrentModelIndexes(prev => {
      const brand = brandDetails.find(b => b.uuid === brandId);
      const models = brand?.brandfranchisedetails?.franchiseDetails?.fico || [];
      const currentIndex = prev[brandId] || 0;
      return {
        ...prev,
        [brandId]: (currentIndex + 1) % models.length
      };
    });
  }, [brandDetails]);

  const handlePrevModel = useCallback((brandId) => {
    setCurrentModelIndexes(prev => {
      const brand = brandDetails.find(b => b.uuid === brandId);
      const models = brand?.brandfranchisedetails?.franchiseDetails?.fico || [];
      const currentIndex = prev[brandId] || 0;
      return {
        ...prev,
        [brandId]: (currentIndex - 1 + models.length) % models.length
      };
    });
  }, [brandDetails]);

  const renderSkeletonRows = (count) => (
    Array.from({ length: count }).map((_, idx) => (
      <TableRow key={`skeleton-${idx}`}>
        <TableCell><Skeleton variant="text" /></TableCell>
        {selectedBrands.map((_, i) => (
          <TableCell key={`skeleton-cell-${i}`}><Skeleton variant="text" /></TableCell>
        ))}
      </TableRow>
    ))
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      sx={{
        "& .MuiDialog-paper": {
          minHeight: "80vh",
          height: "90vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{
        bgcolor: "#f5f5f5",
        color: "Black",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Brand Comparison ({brandDetails.length})
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "black" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error ? (
          <Box textAlign="center" py={4}>
            <Typography color="error">{error}</Typography>
            <Button onClick={fetchBrandDetails} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        ) : loading ? (
          <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                    <Skeleton variant="text" />
                  </TableCell>
                  {selectedBrands.map((_, idx) => (
                    <TableCell key={`loading-header-${idx}`} align="center">
                      <Skeleton variant="rectangular" width={100} height={80} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {renderSkeletonRows(8)}
              </TableBody>
            </Table>
          </TableContainer>
        ) : brandDetails.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              No brands selected for comparison
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                    Feature
                  </TableCell>
                  {brandDetails.map((brand) => (
                    <TableCell
                      key={brand.uuid}
                      align="center"
                      sx={{ width: `${80 / brandDetails.length}%` }}
                    >
                      <BrandHeaderCell
                        brand={brand}
                        onRemove={onRemoveFromComparison}
                        onToggleShortList={handleToggleShortList}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {basicInfoFields.map((field) => (
                  <TableRow key={field.label} hover>
                    <TableCell component="th" scope="row" sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}>
                      <Typography variant="subtitle2">{field.label}</Typography>
                    </TableCell>
                    {brandDetails.map((brand) => {
                      let value = getNestedValue(brand, field.field);
                      if (field.label === "Requirement Support" && Array.isArray(value)) {
                        value = value.join(", ");
                      }
                      return (
                        <TableCell
                          key={`${brand.uuid}-${field.field}`}
                          align="center"
                          sx={{
                            borderLeft: "1px solid #e0e0e0",
                            bgcolor: field.label === "Brand Name" ? "#f5f5f5" : "white",
                          }}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}

                {franchiseModelFields.map((field) => (
                  <TableRow key={field.label} hover>
                    <TableCell component="th" scope="row" sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}>
                      <Typography variant="subtitle2">{field.label}</Typography>
                    </TableCell>
                    {brandDetails.map((brand) => {
                      const models = brand?.brandfranchisedetails?.franchiseDetails?.fico || [];
                      const currentIndex = currentModelIndexes[brand.uuid] || 0;
                      const currentModel = models[currentIndex];

                      return (
                        <TableCell
                          key={`${brand.uuid}-${field.field}-${currentIndex}`}
                          align="center"
                          sx={{ borderLeft: "1px solid #e0e0e0", bgcolor: "white" }}
                        >
                          {currentModel ? (
                            <Typography
                              sx={{
                                color: field?.label?.includes("Fee") || field?.label?.includes("Cost")
                                  ? "#ff9800"
                                  : "inherit",
                                fontWeight: field?.label?.includes("Investment")
                                  ? "bold"
                                  : "normal",
                              }}
                            >
                              {getNestedValue(currentModel, field.field.replace(/^brandfranchisedetails\.franchiseDetails\.fico\[\d+\]\./, ''))}
                            </Typography>
                          ) : (
                            "-"
                          )}
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

      <DialogActions sx={{ bgcolor: "#f5f5f5", position: "sticky", bottom: 0, zIndex: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            bgcolor: "#ff9800",
            "&:hover": { bgcolor: "#388e3c" },
          }}
        >
          Close Comparison
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(BrandComparison);