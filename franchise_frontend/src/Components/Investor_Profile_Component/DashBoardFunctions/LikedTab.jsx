import React from "react";
import { Grid, Box, Typography, LinearProgress, CircularProgress, Pagination } from "@mui/material";
import { Favorite } from "@mui/icons-material";
import BrandCard from "../DashBoardFunctions/BrandCard";

const LikedTab = ({ 
  items = [], 
  isLoading, 
  errorMessage, 
  currentPage = 1, 
  itemsPerPage = 20,  // Added itemsPerPage with default value
  handlePageChange,
  likedStates = {},
  shortlistedStates = {},
  handleViewDetails,
  toggleLike,
  toggleShortlist,
  isPaginating
}) => {
  // Calculate paginated items
  const safeItems = Array.isArray(items) ? items : [];
  const paginatedItems = safeItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(safeItems.length / itemsPerPage);

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
      {safeItems.length > 0 ? (
        <>
          <Grid container spacing={3} justifyContent="center">
            {paginatedItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={2.5} key={item?.uuid || Math.random()}>
                <BrandCard 
                  item={item} 
                  type="liked"
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
                page={Math.min(currentPage, totalPages)}  // Ensure page doesn't exceed total
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
          <Favorite color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No liked brands yet</Typography>
          <Typography>Like brands to save them for later</Typography>
        </Box>
      )}
    </>
  );
};

export default LikedTab;