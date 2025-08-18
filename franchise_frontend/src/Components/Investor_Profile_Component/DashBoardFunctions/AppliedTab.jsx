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
  useEffect(() => {
    console.log('AppliedTab - Received items:', {
      count: items.length,
      data: items,
      currentPage,
      totalPages
    });
    
    if (items.length > 0) {
      console.log('Sample item structure:', items[0]);
    }
  }, [items, currentPage, totalPages]);

  // Transform the items to match the expected structure
  const transformedItems = items.map(item => {
    const application = item.application || {};
    return {
      ...item,
      application: {
        ...application,
        // Map the API fields to the expected fields
        investment: application.investmentRange || 'Not specified',
        area: `${application.district || ''}${application.district && application.state ? ', ' : ''}${application.state || ''}` || 'Not specified',
        type: application.businessType || 'Not specified'
        
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
      {transformedItems.length > 0 ? (
        <>
          <Grid container spacing={3} justifyContent="center">
  {transformedItems.map((item) => {
    // Extract both application and brandDetails from the item
    const { application, brandDetails } = item;
    
    return (
      <Grid item xs={12} sm={6} md={4} lg={2.5} key={application?.apply?.applyId || Math.random()}>
        <BrandCard 
          item={{
            ...application,       // Spread application properties
            ...brandDetails,      // Spread brandDetails properties
            originalItem: item    // Include the full item as reference
          }}
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