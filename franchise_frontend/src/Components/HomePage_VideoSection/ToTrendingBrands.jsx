import { Typography, Box, Button, Card, CardContent, Avatar, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TopInvestVdocardround = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [expandedBrand, setExpandedBrand] = useState(null);
  const [visibleBrands, setVisibleBrands] = useState(21);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/homepage/getAllnewRegisterBrands",
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data?.data?.length) {
          setBrands(response.data.data);
          setError(null);
        } else {
          setBrands([]);
          setError("No brands found.");
        }
      } catch (err) {
        setError("Failed to fetch brands.");
        setBrands([]);
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setExpandedBrand(brand.uuid === expandedBrand ? null : brand.uuid);
  };

  const handleShowMore = () => {
    setVisibleBrands(prev => prev + 15);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress size={60} thickness={4} sx={{ color: '#f29724' }} />
    </Box>
  );

  if (error) return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box component="section"  sx={{ p: 2, maxWidth: 1400, mx: "auto" }}>
      <Typography variant="h5" sx={{ 
        mb: 6, 
        fontWeight: 800,
        textAlign: 'center',
        background: 'linear-gradient(45deg, #f29724 30%, #ffcc80 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Explore Franchise Opportunities
      </Typography>

      {/* Circular Brand Logos Grid */}
      <Box sx={{
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 4,
        mb: 1
      }}>
        {brands.slice(0, visibleBrands).map((brand) => (
          <motion.div
            key={brand.uuid}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card 
              sx={{
                p: 1,
                borderRadius: '10%',
                cursor: 'pointer',
                background: 'transparent',
                boxShadow: 'none',
                position: 'relative',
                height: expandedBrand === brand.uuid ? 'auto' : 170,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => handleBrandClick(brand)}
            >
              <motion.div
                animate={{
                  scale: expandedBrand === brand.uuid ? 1.2 : 1,
                  y: expandedBrand === brand.uuid ? -20 : 0
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Avatar
                  src={brand.brandDetails?.brandLogo}
                  alt={brand.personalDetails?.brandName}
                  sx={{
                    width: expandedBrand === brand.uuid ? 120 : 100,
                    height: expandedBrand === brand.uuid ? 120 : 100,
                    border: '3px solid #f29724',
                    transition: 'all 0.3s ease'
                  }}
                />
              </motion.div>

              <Typography variant="subtitle1" sx={{ 
                mt: 2, 
                fontWeight: 300,
                textAlign: 'center',
                color: expandedBrand === brand.uuid ? '#f29724' : 'inherit'
              }}>
                {brand.personalDetails?.brandName}
              </Typography>

              <AnimatePresence>
                {expandedBrand === brand.uuid && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {brand.brandDetails?.category}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        Investment: {brand.franchiseDetails?.investmentRange}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 2,
                          borderRadius: 50,
                          borderColor: '#f29724',
                          color: '#f29724',
                          '&:hover': {
                            backgroundColor: '#f29724',
                            color: 'white'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBrand(brand);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </Box>

      {brands.length > visibleBrands && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              sx={{
                borderRadius: 50,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #f29724 30%, #ffcc80 90%)',
                fontWeight: 600,
                fontSize: '1rem'
              }}
              endIcon={
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ExpandMoreIcon />
                </motion.div>
              }
              onClick={handleShowMore}
            >
              Load More Brands
            </Button>
          </motion.div>
        </Box>
      )}

      {/* Brand Details Dialog */}
      <Dialog 
        open={!!selectedBrand} 
        onClose={() => setSelectedBrand(null)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'radial-gradient(circle at top, #fff9e6, #ffffff)'
          }
        }}
      >
        {selectedBrand && (
          <>
            <DialogTitle sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to right, #f29724, #ffcc80)',
              color: 'white',
              py: 2
            }}>
              <Typography variant="h5" fontWeight={700}>
                {selectedBrand.personalDetails?.brandName}
              </Typography>
              <IconButton onClick={() => setSelectedBrand(null)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Avatar
                      src={selectedBrand.brandDetails?.brandLogo}
                      alt={selectedBrand.personalDetails?.brandName}
                      sx={{
                        width: 200,
                        height: 200,
                        border: '4px solid #f29724',
                        mx: 'auto',
                        mb: 3
                      }}
                    />
                  </motion.div>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#f29724' }}>
                    About the Brand
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedBrand.brandDetails?.brandDescription || 'No description available.'}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#f29724' }}>
                    Franchise Models
                  </Typography>

                  {selectedBrand.franchiseDetails?.modelsOfFranchise?.map((model, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <Card sx={{ mb: 2, p: 2, borderRadius: 3, borderLeft: '4px solid #f29724' }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {model.franchiseModel}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2">
                            <strong>Investment:</strong> {model.investmentRange}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Franchise Fee:</strong> ₹{model.franchiseFee}
                          </Typography>
                        </Box>
                        {model.expectedROI && (
                          <Typography variant="body2" mt={1}>
                            <strong>Expected ROI:</strong> {model.expectedROI}
                          </Typography>
                        )}
                      </Card>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{ marginTop: 24 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 50,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #f29724 30%, #ffcc80 90%)',
                        fontWeight: 600,
                        fontSize: '1rem'
                      }}
                    >
                      Contact for Franchise Details
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TopInvestVdocardround;