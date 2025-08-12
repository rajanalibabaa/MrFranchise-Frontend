import React from "react";
import { Box, Grid, Pagination, Typography, CircularProgress } from "@mui/material";
import BrandCard from "./BrandCard";
import { Visibility } from "@mui/icons-material";

const ViewedBrands = ({ 
  brands, 
  currentPage, 
  totalPages, 
  handlePageChange, 
  handleViewDetails, 
  likedStates, 
  shortlistedStates,
  toggleLike,
  toggleShortlist,
  isLoading,
  errorMessage
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
      {brands.length > 0 ? (
        <>
          <Grid container spacing={3} justifyContent="center">
            {brands.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={2.5} key={item?.uuid || Math.random()}>
                <BrandCard 
                  item={item} 
                  type="viewed"
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
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Visibility color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No viewed brands</Typography>
          <Typography>Brands you view will appear here</Typography>
        </Box>
      )}
    </>
  );
};

export default ViewedBrands;