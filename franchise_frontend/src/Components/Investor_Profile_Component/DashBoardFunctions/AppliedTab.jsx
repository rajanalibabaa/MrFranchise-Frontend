import React from "react";
import { Grid, Box, Typography, LinearProgress, CircularProgress, Pagination } from "@mui/material";
import { AssignmentTurnedIn } from "@mui/icons-material";
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
           {items.map((brand) => (
              <Grid item xs={12} sm={6} md={4} lg={2.5} key={brand?.uuid || Math.random()}>
                <BrandCard 
                  item={brand} 
                  type="applied"
                  likedStates={likedStates}
                  shortlistedStates={shortlistedStates}
                  onViewDetails={handleViewDetails}
                  onToggleLike={toggleLike}
                  onToggleShortlist={toggleShortlist}
                />
              </Grid>
            ))}
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