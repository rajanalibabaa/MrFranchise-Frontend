import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import axios from "axios";

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FoodAndBeverageSection = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPaused = useRef(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleClick = () => {
    alert("Apply button clicked!");
  };

   const handleMouseEnter = () => {
            isPaused.current = true;
          };
        
          const handleMouseLeave = () => {
            isPaused.current = false;
          };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://franchise-backend-wgp6.onrender.com/api/v1/homepage/getAllnewRegisterBrands",
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data?.data?.length) {
          setBrands(response.data.data);
          // console.log("data :",brands)
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

  useEffect(() => {
    if (brands.length <= 2) return;

    const interval = setInterval(() => {
      if (!isPaused.current) {
        setBrands((prev) => [...prev.slice(1), prev[0]]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [brands]);

  const handleOpenDialog = (brand) => {
    setSelectedBrand(brand);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBrand(null);
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 4, background: "#fff", maxWidth: 1800, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Invest Your Franchise
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Near You!
        </Typography>
      </Box>

      <Box
        component={motion.div}
        initial="initial"
        animate="animate"
        sx={{
          display: "flex",
          gap: 3,
          // backgroundColor: "#e8f5e9",
          borderRadius: 3,
          p: 2,
          overflowX: "scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" }
        }}
        onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
      >
        {/* Static Left Card */}
        {/* <Box
          sx={{
            minWidth: 200,
            background: "#e0f2f1",
            p: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={1}>
            Invest Near You
          </Typography>
          <Button variant="contained" sx={{ background: "#4caf50" }}>
            Popular in Franchise
          </Button>
        </Box> */}

        {/* Dynamic Brand Cards */}
        {brands.map((brand) => {
          const brandId = brand.uuid;
          const isOpen = dialogOpen && selectedBrand?.uuid === brandId;
          const franchiseModels = brand.franchiseDetails?.modelsOfFranchise || [];

          return (
            <motion.div
              key={brandId}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              style={{ minWidth: 370 }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  height: "100%",
                  border: "0.1px solid #ddd",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
               <CardMedia
                  component="video"
                  src={brand.brandDetails?.brandPromotionVideo}
                  alt={brand.personalDetails?.brandName || "Brand"}
                  sx={{ height: 450, objectFit: "contain" }}
                  controls
                />

                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} fontSize={25}>
                    {brand.personalDetails?.brandName}
                  </Typography>

                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={1}
                  >
                    <Typography variant="body2" fontWeight={600} fontSize={15}>
                      Franchise Model: {franchiseModels.length}
                    </Typography>

                    <Button
                      variant="text"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => (isOpen ? handleCloseDialog() : handleOpenDialog(brand))}
                    >
                      {isOpen ? "Hide" : "View"}
                    </Button>
                  </Box>
                </CardContent>
                <Box sx={{ px: 2, pb: 2, mt: "auto" }}>
                  <Button
                    variant="contained" onClick ={handleClick}
                    fullWidth
                    sx={{
                      backgroundColor: "#f29724",
                      "&:hover": { backgroundColor: "#e2faa7", color: "#000" },
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </Box>

      {/* Franchise Models Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {selectedBrand?.personalDetails?.brandName} - Franchise Models
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedBrand?.franchiseDetails?.modelsOfFranchise?.map((model, idx) => (
            <Box
              key={idx}
              mb={2}
              p={2}
              bgcolor="#f5f5f5"
              borderRadius={2}
              border="1px solid #ddd"
            >
              <Typography variant="body2" gutterBottom>
                <strong>Model:</strong> {model.franchiseModel}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Investment Range:</strong> {model.investmentRange}
              </Typography>
              <Typography variant="body2">
                <strong>Franchise Fee:</strong> ₹{model.franchiseFee}
              </Typography>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FoodAndBeverageSection;