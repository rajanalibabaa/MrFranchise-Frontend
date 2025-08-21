import React, { useState, useMemo } from "react";
import { Grid, Box, Typography, LinearProgress, CircularProgress, Pagination } from "@mui/material";
import { Bookmark } from "@mui/icons-material";
import BrandCard from "../DashBoardFunctions/BrandCard";

const ShortlistedTab = ({ 
  items = [], 
  isLoading, 
  errorMessage,
  likedStates = {},
  shortlistedStates = {},
  handleViewDetails,
  toggleLike,
  toggleShortlist,
  isPaginating
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Calculate paginated data
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [page, items]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

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
            {paginatedItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={2.5} key={item?.uuid || Math.random()}>
                <BrandCard 
                  item={item} 
                  type="shortlisted"
                  likedStates={likedStates}
                  shortlistedStates={shortlistedStates}
                  onViewDetails={handleViewDetails}
                  onToggleLike={toggleLike}
                  onToggleShortlist={toggleShortlist}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(e, value) => setPage(value)} 
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Bookmark color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No shortlisted brands</Typography>
          <Typography>Brands you shortlist will appear here</Typography>
        </Box>
      )}
    </>
  );
};

export default ShortlistedTab;
