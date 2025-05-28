import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  Modal,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Divider
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const FilterDropdowns = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState({ states: [] });
  const [investmentOptions, setInvestmentOptions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [selected, setSelected] = useState({
    category: "",
    state: "",
    investment: ""
  });

  const [loading, setLoading] = useState({
    filters: true,
    brands: false
  });

 useEffect(() => {
  async function fetchFilters() {
    try {
      const res = await axios.get(
        "https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getAllBrandListing",
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data?.data || [];
      console.log("data", data);

      // Extract unique brandCategories
      const uniqueCategories = [
        ...new Set(
          data.flatMap(item =>
            item.personalDetails?.brandCategories?.map(cat => cat.name) || []
          )
        )
      ];

      // Extract unique states
      const states = [
        ...new Set(data.map(item => item.personalDetails?.state).filter(Boolean))
      ].map(name => ({ name }));

      // Extract unique investmentRanges
      const investments = [
        ...new Set(data.map(item => item.investmentRange).filter(Boolean))
      ];

      setCategories(uniqueCategories);
      setLocations({ states });
      setInvestmentOptions(investments);
      setBrands(data); // If you’re using this for filtering
    } catch (error) {
      console.error("Failed to fetch filters", error);
    } finally {
      setLoading(prev => ({ ...prev, filters: false }));
    }
  }

  fetchFilters();
}, []);


  const handleSearch = async () => {
    setLoading(prev => ({ ...prev, brands: true }));
    try {
      // Filter brands based on selected criteria
      const filtered = brands.filter(brand => {
        return (
          (selected.category === "" || brand.category === selected.category) &&
          (selected.state === "" || brand.state === selected.state) &&
          (selected.investment === "" || brand.investmentRange === selected.investment)
        );
      });
      
      setFilteredBrands(filtered);
      
      // If only one result, show it directly in modal
      if (filtered.length === 1) {
        setSelectedBrand(filtered[0]);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to filter brands", error);
    } finally {
      setLoading(prev => ({ ...prev, brands: false }));
    }
  };

  const handleOpenModal = (brand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (loading.filters) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" }, 
        gap: 3, 
        mb: 4,
        alignItems: "flex-end"
      }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selected.category}
            onChange={(e) => setSelected({ ...selected, category: e.target.value })}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Location</InputLabel>
          <Select
            value={selected.state}
            onChange={(e) => setSelected({ ...selected, state: e.target.value })}
          >
            <MenuItem value="">All Locations</MenuItem>
            {locations.states.map((s, idx) => (
              <MenuItem key={idx} value={s.name}>{s.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Investment Range</InputLabel>
          <Select
            value={selected.investment}
            onChange={(e) => setSelected({ ...selected, investment: e.target.value })}
          >
            <MenuItem value="">All Ranges</MenuItem>
            {investmentOptions.map((opt, idx) => (
              <MenuItem key={idx} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading.brands}
          startIcon={<SearchIcon />}
          sx={{ height: '56px', minWidth: '120px' }}
        >
          {loading.brands ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      {/* Results Section */}
      {filteredBrands.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {filteredBrands.length} {filteredBrands.length === 1 ? "Result" : "Results"} Found
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3 
          }}>
            {filteredBrands.map((brand, index) => (
              <Card 
                key={index} 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleOpenModal(brand)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={brand.brandImage || "https://via.placeholder.com/300"}
                  alt={brand.brandName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {brand.brandName}
                  </Typography>
                  <Chip 
                    label={brand.category} 
                    size="small" 
                    color="primary" 
                    sx={{ mb: 1 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {brand.state}, {brand.country}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                    Investment: {brand.investmentRange}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Brand Details Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="brand-details-modal"
        aria-describedby="brand-details-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '70%' },
          maxWidth: '800px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none'
        }}>
          {selectedBrand && (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid rgba(0,0,0,0.12)'
              }}>
                <Typography variant="h5" component="h2">
                  {selectedBrand.brandName}
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  mb: 3
                }}>
                  <Box sx={{ flex: 1 }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={selectedBrand.brandImage || "https://via.placeholder.com/300"}
                      alt={selectedBrand.brandName}
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Brand Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip label={selectedBrand.category} color="primary" />
                      <Chip label={`Investment: ${selectedBrand.investmentRange}`} variant="outlined" />
                    </Box>
                    
                    <Typography variant="body1" paragraph>
                      <strong>Location:</strong> {selectedBrand.city}, {selectedBrand.state}, {selectedBrand.country}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      <strong>Established:</strong> {selectedBrand.yearEstablished || 'N/A'}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      <strong>Franchise Units:</strong> {selectedBrand.franchiseUnits || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  About the Brand
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedBrand.brandDescription || 'No description available.'}
                </Typography>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      // Handle contact action
                      handleCloseModal();
                    }}
                  >
                    Contact Brand
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default FilterDropdowns;