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
    <Box>
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" }, 
        gap: 6, 
        mb: 4,
        // alignItems: "flex-end"
      }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selected.category}
            onChange={(e) => setSelected({ ...selected, category: e.target.value })}
            label="Category"
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
            label="Location"
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
            label="Investment Range"
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
          // variant="contained"
          // color="primary"
          onClick={handleSearch}
          disabled={loading.brands}
          startIcon={<SearchIcon />}
          sx={{ height: '46px', minWidth: '220px' ,backgroundColor: "#689f38", color: "#fafafa"}}
        >
          {loading.brands ? <CircularProgress size={24} /> : "Find Brands"}
        </Button>
      </Box>
    </Box>
  );
};

export default FilterDropdowns;