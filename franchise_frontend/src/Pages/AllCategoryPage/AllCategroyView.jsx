import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  TextField, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  Category as CategoryIcon,
  FilterAlt as FilterIcon,
  ChevronRight,
  ExpandMore,
  ExpandLess,
  LocationOn,
  AttachMoney,
  SquareFoot,
  Home as HomeIcon
} from '@mui/icons-material';
import { categories } from '../BrandListingForm/BrandCategories.jsx';
function AllCategoryViewPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filters, setFilters] = useState({
    location: '',
    investment: '',
    area: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterSubmit = () => {
    console.log('Filters applied:', filters);
  };

  const toggleCategory = (index) => {
    setExpandedCategories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <>
    <Container maxWidth="lg" sx={{ display: 'flex', marginTop: 5 ,marginLeft: 0}}>
      {/* Sidebar Navigation */}
      <Box
        sx={{
          width: '300px',
          position: 'sticky',
          top: 20,
          height: 'calc(100vh - 40px)',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          border: '1px solid',
          borderColor: 'divider',
          mr: 3
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 2, '& .MuiTabs-indicator': { height: 3, borderRadius: 3 } }}
        >
          <Tab icon={<CategoryIcon />} iconPosition="start" label="Categories" sx={{ minHeight: 48 }} />
          <Tab icon={<FilterIcon />} iconPosition="start" label="Filters" sx={{ minHeight: 48 }} />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#FF6F00' }}>
              <CategoryIcon sx={{ mr: 1 }} /> Browse Categories
            </Typography>
            <List component="nav" sx={{ py: 0 }}>
              {categories.map((cat, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    onClick={() => toggleCategory(index)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      backgroundColor: activeCategory === index ? '#C8E6C9' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#A5D6A7'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {cat.icon || <ChevronRight />}
                    </ListItemIcon>
                    <ListItemText primary={cat.name} primaryTypographyProps={{ fontWeight: 'medium' }} />
                    {cat.children && (
                      expandedCategories[index] ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItem>
                  {expandedCategories[index] && cat.children && (
                    <List component="div" disablePadding>
                      {cat.children.map((subCat, subIndex) => (
                        <React.Fragment key={subIndex}>
                          <ListItem
                            button
                            onClick={() => setActiveSubCategory(subIndex === activeSubCategory ? null : subIndex)}
                            sx={{
                              pl: 4,
                              borderRadius: 1,
                              mb: 0.5,
                              backgroundColor: activeSubCategory === subIndex ? '#FFE0B2' : 'transparent',
                              '&:hover': {
                                backgroundColor: '#FFCC80'
                              }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {subCat.icon || <ChevronRight fontSize="small" />}
                            </ListItemIcon>
                            <ListItemText primary={subCat.name} />
                            {subCat.children && (
                              activeSubCategory === subIndex ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />
                            )}
                          </ListItem>
                          {activeSubCategory === subIndex && subCat.children && (
                            <List component="div" disablePadding>
                              {subCat.children.map((subChild, childIndex) => (
                                <ListItem
                                  key={childIndex}
                                  sx={{ pl: 8, py: 0.5, borderRadius: 1, mb: 0.5, '&:hover': { backgroundColor: '#F1F8E9' } }}
                                >
                                  <ListItemText primary={subChild} primaryTypographyProps={{ variant: 'body2' }} />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#388E3C' }}>
              <FilterIcon sx={{ mr: 1 }} /> Filter Options
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                variant="outlined"
                size="small"
                label="Location"
                InputProps={{ startAdornment: <LocationOn sx={{ color: 'action.active', mr: 1 }} /> }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">Select a State</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
                <option value="New York">New York</option>
                <option value="Florida">Florida</option>
                <option value="Illinois">Illinois</option>
              </TextField>
              <TextField
                select
                name="investment"
                value={filters.investment}
                onChange={handleFilterChange}
                variant="outlined"
                size="small"
                label="Investment Range"
                InputProps={{ startAdornment: <AttachMoney sx={{ color: 'action.active', mr: 1 }} /> }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">Select Investment Range</option>
                <option value="10000-50000">10,000 - 50,000</option>
                <option value="50000-100000">50,000 - 100,000</option>
                <option value="100000-500000">100,000 - 500,000</option>
                <option value="500000-1000000">500,000 - 1,000,000</option>
                <option value="1000000+">1,000,000+</option>
              </TextField>
              <TextField
                select
                name="area"
                value={filters.area}
                onChange={handleFilterChange}
                variant="outlined"
                size="small"
                label="Area Range"
                InputProps={{ startAdornment: <SquareFoot sx={{ color: 'action.active', mr: 1 }} /> }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">Select Area Range</option>
                <option value="0-500">0 - 500 sq ft</option>
                <option value="500-1000">500 - 1,000 sq ft</option>
                <option value="1000-2000">1,000 - 2,000 sq ft</option>
                <option value="2000-5000">2,000 - 5,000 sq ft</option>
                <option value="5000+">5,000+ sq ft</option>
              </TextField>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleFilterSubmit}
                startIcon={<FilterIcon />}
                sx={{ mt: 1 }}
                fullWidth
              >
                Apply Filters
              </Button>
              {Object.values(filters).some(val => val) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Active Filters:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {filters.location && (
                      <Chip 
                        label={`Location: ${filters.location}`} 
                        onDelete={() => setFilters(prev => ({...prev, location: ''}))}
                        size="small"
                        icon={<LocationOn fontSize="small" />}
                      />
                    )}
                    {filters.investment && (
                      <Chip 
                        label={`Investment: ${filters.investment}`} 
                        onDelete={() => setFilters(prev => ({...prev, investment: ''}))}
                        size="small"
                        icon={<AttachMoney fontSize="small" />}
                      />
                    )}
                    {filters.area && (
                      <Chip 
                        label={`Area: ${filters.area}`} 
                        onDelete={() => setFilters(prev => ({...prev, area: ''}))}
                        size="small"
                        icon={<SquareFoot fontSize="small" />}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="inherit" href="/">
            <HomeIcon fontSize="small" sx={{ mr: 0.5, }} /> Home
          </Link>
        </Breadcrumbs>

        <Box sx={{ 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          boxShadow: 1,
          minHeight: '80vh'
        }}>
          <Typography variant="h5" gutterBottom>
            {activeTab === 0 ? 'Browse Categories' : 'Filter Results'}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex',  alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'text.secondary' }}>
            <Typography variant="h6">
              {activeTab === 0 ? 'Select a category to view brands' : 'Apply filters to see matching brands'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
    </>
  );
}

export default AllCategoryViewPage;
