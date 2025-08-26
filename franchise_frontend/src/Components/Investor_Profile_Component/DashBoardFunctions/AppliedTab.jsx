import React from "react";
import { Grid, Box, Typography, LinearProgress, CircularProgress, Pagination } from "@mui/material";
import { AssignmentTurnedIn } from "@mui/icons-material";
import { useEffect } from "react";
import BrandCard from "../DashBoardFunctions/BrandCard";

const AppliedTab = ({ 
  items, 
  isLoading, 
  errorMessage, 
  currentPage, 
  totalPages, 
  handlePageChange,
  likedStates,
  shortlistedStates,
  handleViewDetails,
  toggleLike,
  toggleShortlist,
  isPaginating
}) => {
  // useEffect(() => {
  //   console.log('AppliedTab - Received items:', {
  //     count: items.length,
  //     data: items,
  //     currentPage,
  //     totalPages
  //   });
    
  //   if (items.length > 0) {
  //     console.log('Sample item structure cards:', items[0]);
  //   }
  // }, [items, currentPage, totalPages]);

  // Transform the items to match the expected structure
  const transformedItems = items.map(item => {
    const application = item.application || {};
    const brand = item?.brandDetails || {};

    // console.log('Sample brand structure:', brand);
    return {
      ...item,
      brand: {
        ...brand,
        // Map the API fields to the expected fields
        investment: brand?.brandfranchisedetails?.franchiseDetails?.fico?.[0].investmentRange,
        area: brand?.brandfranchisedetails?.franchiseDetails?.fico?.[0].areaRequired,
        type: brand?.brandfranchisedetails?.franchiseDetails?.fico?.[0].franchiseModel,

        
      }
    };
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    );
  }

  return (
     <>
    {isPaginating && <LinearProgress sx={{ width: '100%', mb: 2 }} />}
    {items.length > 0 ? (
      <>
        <Grid container spacing={3} justifyContent="center">
          {items.map((item) => {
            // Get brand details from the first element of brandDetails array
            const brand = item.brandDetails?.[0]?.brandDetails || {};
            const franchiseDetails = item.brandDetails?.[0]?.brandfranchisedetails?.franchiseDetails || {};
            const fico = franchiseDetails.fico?.[0] || {};
            const brandCategories = franchiseDetails.brandCategories || {};
            const brandName = brand.brandName || "Unknown Brand";
            const brandLogo = item.brandDetails?.[0]?.uploads?.logo || img;

            return (
              <Grid item xs={12} sm={6} md={4} lg={2.5} key={item?.application?.apply?._id || item?.application?.apply?.applyId || Math.random()}>
                <BrandCard 
                  item={item.brandDetails?.[0] || {}}
                  investmentRange={fico.investmentRange || ""}
                  brandNameData={brandName}
                  brandLogoData={brandLogo}
                  areaRequired={fico.areaRequired || ""}
                  franchiseModel={fico.franchiseModel || ""}
                  brandCategoryChild={brandCategories.child || ""}
                  type="applied"
                  likedStates={likedStates}
                  shortlistedStates={shortlistedStates}
                  onViewDetails={handleViewDetails}
                  onToggleLike={toggleLike}
                  onToggleShortlist={toggleShortlist}
                />
              </Grid>
            );
          })}
        </Grid>
        
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '1rem',
                  '&.Mui-selected': {
                    fontWeight: 'bold',
                  },
                },
              }}
            />
          </Box>
        )}
      </>
    ) : (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <AssignmentTurnedIn color="disabled" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6">No applications yet</Typography>
        <Typography>Your applications will appear here</Typography>
      </Box>
    )}
  </>
  );
};

export default AppliedTab;