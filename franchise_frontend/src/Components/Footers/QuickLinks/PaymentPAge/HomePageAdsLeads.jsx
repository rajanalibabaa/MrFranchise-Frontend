import React, { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Box,
  Button,
  useTheme,
  Divider,
  Grid,
  Chip,
  Avatar,
  Badge
} from '@mui/material';
import {
  LocalDining as FoodIcon,
  LocalCafe as CafeIcon,
  EmojiFoodBeverage as BeverageIcon,
  Star as PremiumIcon,
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';

const HomePageLeads = () => {
  const theme = useTheme();
  const [selectedPackages, setSelectedPackages] = useState({});

  const packagesData = useMemo(() => [
    {
      category: 'Top F & B Franchise Brands',
      icon: <FoodIcon />,
      color: theme.palette.primary.main,
      basic: { leads: 50, price: 15000, months: 3 },
      pro: { leads: 100, price: 30000, months: 6 },
      growth: { leads: 200, price: 60000, months: 12 }
    },
    {
      category: 'Top Franchise in Chennai',
      icon: <LocationIcon />,
      color: '#4f46e5',
      basic: { leads: 60, price: 18000, months: 3 },
      pro: { leads: 120, price: 30000, months: 6 },
      growth: { leads: 240, price: 72000, months: 12 }
    },
    {
      category: 'Top Franchise in Tamilnadu',
      icon: <LocationIcon />,
      color: '#4f46e5',
      basic: { leads: 60, price: 18000, months: 3 },
      pro: { leads: 120, price: 36000, months: 6 },
      growth: { leads: 240, price: 72000, months: 12 }
    },
    {
      category: 'Top Coffee Tea Cafes Brands',
      icon: <CafeIcon />,
      color: '#d97706',
      basic: { leads: 70, price: 21000, months: 3 },
      pro: { leads: 140, price: 42000, months: 6 },
      growth: { leads: 280, price: 84000, months: 12 }
    },
    {
      category: 'Top Restaurant Franchise Brands',
      icon: <RestaurantIcon />,
      color: '#dc2626',
      basic: { leads: 70, price: 21000, months: 3 },
      pro: { leads: 140, price: 42000, months: 6 },
      growth: { leads: 280, price: 84000, months: 12 }
    },
    {
      category: 'Top Beverage Franchise Brands',
      icon: <BeverageIcon />,
      color: '#059669',
      basic: { leads: 80, price: 24000, months: 3 },
      pro: { leads: 160, price: 48000, months: 6 },
      growth: { leads: 320, price: 96000, months: 12 }
    },
    {
      category: 'Top Food Franchise Brands',
      icon: <FoodIcon />,
      color: theme.palette.primary.main,
      basic: { leads: 80, price: 24000, months: 3 },
      pro: { leads: 160, price: 48000, months: 6 },
      growth: { leads: 320, price: 96000, months: 12 }
    },
    {
      category: 'Premium Franchise Brands',
      icon: <PremiumIcon />,
      color: '#9333ea',
      basic: { leads: 100, price: 30000, months: 3 },
      pro: { leads: 200, price: 60000, months: 6 },
      growth: { leads: 400, price: 120000, months: 12 }
    }
  ], [theme.palette.primary.main]);

  const handleSelectPackage = (category, plan) => {
    setSelectedPackages(prev => {
      const newSelection = { ...prev };
      const key = `${category}-${plan}`;
      
      if (newSelection[key]) {
        delete newSelection[key];
      } else {
        newSelection[key] = {
          category,
          plan,
          ...packagesData.find(pkg => pkg.category === category)[plan],
          color: packagesData.find(pkg => pkg.category === category).color
        };
      }
      
      return newSelection;
    });
  };

  const calculateTotal = useMemo(() => {
    return Object.values(selectedPackages).reduce((sum, pkg) => sum + pkg.price, 0);
  }, [selectedPackages]);

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'basic': return '#3b82f6';
      case 'pro': return '#9333ea';
      case 'growth': return '#10b981';
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 700, 
        mb: 3,
        color: theme.palette.text.primary,
        textAlign: 'center'
      }}>
        Home Page Leads Packages
      </Typography>
      
      <Paper elevation={0} sx={{ 
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        mb: 4
      }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
                borderBottom: `2px solid ${theme.palette.divider}`
              }}>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  width: '30%',
                  fontSize: '0.875rem',
                  color: theme.palette.text.primary
                }}>
                  Category
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  <Badge badgeContent="Popular" color="primary" sx={{ 
                    '& .MuiBadge-badge': {
                      top: -15,
                      right: -40,
                      fontSize: 10,
                      fontWeight: 700
                    }
                  }}>
                    <Box sx={{ color: getPlanColor('basic') }}>BASIC (3 Months)</Box>
                  </Badge>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem', color: getPlanColor('pro') }}>
                  PRO (6 Months)
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem', color: getPlanColor('growth') }}>
                  GROWTH (12 Months)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packagesData.map((pkg) => (
                <TableRow 
                  key={pkg.category}
                  sx={{ 
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'
                    },
                    '&:not(:last-child)': {
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Avatar sx={{ 
                      bgcolor: pkg.color,
                      color: theme.palette.getContrastText(pkg.color),
                      width: 32,
                      height: 32
                    }}>
                      {pkg.icon}
                    </Avatar>
                    {pkg.category}
                  </TableCell>
                  
                  {/* BASIC Column */}
                  <TableCell align="center" sx={{ p: 1.5 }}>
                    <Paper 
                      elevation={0}
                      onClick={() => handleSelectPackage(pkg.category, 'basic')}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: `1px solid ${selectedPackages[`${pkg.category}-basic`] ? getPlanColor('basic') : theme.palette.divider}`,
                        backgroundColor: selectedPackages[`${pkg.category}-basic`] ? `${getPlanColor('basic')}10` : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: getPlanColor('basic'),
                          backgroundColor: `${getPlanColor('basic')}08`
                        }
                      }}
                    >
                      <Checkbox
                        checked={!!selectedPackages[`${pkg.category}-basic`]}
                        sx={{ p: 0, mb: 1 }}
                      />
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {pkg.basic.leads} leads
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: getPlanColor('basic') }}>
                        ₹{pkg.basic.price.toLocaleString()}
                      </Typography>
                      <Chip 
                        label={`${pkg.basic.months} months`} 
                        size="small" 
                        sx={{ 
                          mt: 1,
                          fontSize: '0.65rem',
                          height: 20,
                          backgroundColor: `${getPlanColor('basic')}20`,
                          color: getPlanColor('basic')
                        }} 
                      />
                    </Paper>
                  </TableCell>
                  
                  {/* PRO Column */}
                  <TableCell align="center" sx={{ p: 1.5 }}>
                    <Paper 
                      elevation={0}
                      onClick={() => handleSelectPackage(pkg.category, 'pro')}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: `1px solid ${selectedPackages[`${pkg.category}-pro`] ? getPlanColor('pro') : theme.palette.divider}`,
                        backgroundColor: selectedPackages[`${pkg.category}-pro`] ? `${getPlanColor('pro')}10` : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: getPlanColor('pro'),
                          backgroundColor: `${getPlanColor('pro')}08`
                        }
                      }}
                    >
                      <Checkbox
                        checked={!!selectedPackages[`${pkg.category}-pro`]}
                        sx={{ p: 0, mb: 1 }}
                      />
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {pkg.pro.leads} leads
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: getPlanColor('pro') }}>
                        ₹{pkg.pro.price.toLocaleString()}
                      </Typography>
                      <Chip 
                        label={`${pkg.pro.months} months`} 
                        size="small" 
                        sx={{ 
                          mt: 1,
                          fontSize: '0.65rem',
                          height: 20,
                          backgroundColor: `${getPlanColor('pro')}20`,
                          color: getPlanColor('pro')
                        }} 
                      />
                    </Paper>
                  </TableCell>
                  
                  {/* GROWTH Column */}
                  <TableCell align="center" sx={{ p: 1.5 }}>
                    <Paper 
                      elevation={0}
                      onClick={() => handleSelectPackage(pkg.category, 'growth')}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: `1px solid ${selectedPackages[`${pkg.category}-growth`] ? getPlanColor('growth') : theme.palette.divider}`,
                        backgroundColor: selectedPackages[`${pkg.category}-growth`] ? `${getPlanColor('growth')}10` : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: getPlanColor('growth'),
                          backgroundColor: `${getPlanColor('growth')}08`
                        }
                      }}
                    >
                      <Checkbox
                        checked={!!selectedPackages[`${pkg.category}-growth`]}
                        sx={{ p: 0, mb: 1 }}
                      />
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {pkg.growth.leads} leads
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: getPlanColor('growth') }}>
                        ₹{pkg.growth.price.toLocaleString()}
                      </Typography>
                      <Chip 
                        label={`${pkg.growth.months} months`} 
                        size="small" 
                        sx={{ 
                          mt: 1,
                          fontSize: '0.65rem',
                          height: 20,
                          backgroundColor: `${getPlanColor('growth')}20`,
                          color: getPlanColor('growth')
                        }} 
                      />
                    </Paper>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {Object.keys(selectedPackages).length > 0 && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          mt: 4,
          background: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.7)'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Selected Packages</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.values(selectedPackages).map((pkg, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper sx={{ 
                  p: 2,
                  borderRadius: 2,
                  borderLeft: `4px solid ${pkg.color}`,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.7)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {pkg.category}
                      </Typography>
                      <Chip 
                        label={pkg.plan.toUpperCase()} 
                        size="small" 
                        sx={{ 
                          mt: 0.5,
                          fontSize: '0.65rem',
                          height: 20,
                          backgroundColor: `${getPlanColor(pkg.plan)}20`,
                          color: getPlanColor(pkg.plan)
                        }} 
                      />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {pkg.leads} leads
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: getPlanColor(pkg.plan) }}>
                        ₹{pkg.price.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    mt: 1,
                    color: theme.palette.text.secondary
                  }}>
                    {pkg.months} months duration
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.7)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Amount</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
              ₹{calculateTotal.toLocaleString()}
            </Typography>
          </Box>
          {/* <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ 
              mt: 3, 
              py: 1.5, 
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`
              }
            }}
          >
            Proceed to Payment
          </Button> */}
        </Paper>
      )}
    </Box>
  );
};

export default HomePageLeads;