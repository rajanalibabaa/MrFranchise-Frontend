import React from "react";
import { Box, Typography } from "@mui/material";

const DisclaimerSection = ({ isMobile }) => {
  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        borderRadius: "12px",
        bgcolor: "rgba(244, 67, 54, 0.05)",
      }}
    >
      <Typography variant="body1" fontWeight={700} color="#f44336">
        Disclaimer:
      </Typography>
      {!isMobile ? (
        <Typography variant="caption" color="#212121">
          Mr Franchise and the site sponsors accept no liability for the
          accuracy of any information contained on this site or on other
          linked sites. We recommend you take advice from a lawyer,
          accountant and franchise consultant experienced in franchising
          before you commit yourself. It is user's responsibility to satisfy
          yourself as to the accuracy and reliability of the information
          supplied. Please read the terms & conditions on MrFranchise.in
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', py: 1 }}>
          <Typography variant="caption" color="#212121">
            Mr Franchise and the site sponsors accept no liability for the
            accuracy of any information contained on this site or on other
            linked sites. We recommend you take advice from a lawyer,
            accountant and franchise consultant experienced in franchising
            before you commit yourself. It is user's responsibility to satisfy
            yourself as to the accuracy and reliability of the information
            supplied. Please read the terms & conditions on MrFranchise.in
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DisclaimerSection;