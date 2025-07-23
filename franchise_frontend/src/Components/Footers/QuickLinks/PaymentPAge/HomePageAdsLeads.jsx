import React, { useState } from 'react';
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
  Grid
} from '@mui/material';

const HomePageLeads = () => {
  const theme = useTheme();
  const [selectedPackages, setSelectedPackages] = useState({});

  const packagesData = [
    {
      category: 'Top F & B Franchise Brands',
      basic: { leads: 50, price: 15000, months: 3 },
      pro: { leads: 100, price: 30000, months: 6 },
      growth: { leads: 200, price: 60000, months: 12 }
    },
    {
      category: 'Top Franchise in Chennai',
      basic: { leads: 60, price: 18000, months: 3 },
      pro: { leads: 120, price: 30000, months: 6 },
      growth: { leads: 240, price: 72000, months: 12 }
    },
    {
      category: 'Top Franchise in Tamilnadu',
      basic: { leads: 60, price: 18000, months: 3 },
      pro: { leads: 120, price: 36000, months: 6 },
      growth: { leads: 240, price: 72000, months: 12 }
    },
    {
      category: 'Top Coffee Tea Cafes Brands',
      basic: { leads: 70, price: 21000, months: 3 },
      pro: { leads: 140, price: 42000, months: 6 },
      growth: { leads: 280, price: 84000, months: 12 }
    },
    {
      category: 'Top Restaurant Franchise Brands',
      basic: { leads: 70, price: 21000, months: 3 },
      pro: { leads: 140, price: 42000, months: 6 },
      growth: { leads: 280, price: 84000, months: 12 }
    },
    {
      category: 'Top Beverage Franchise Brands',
      basic: { leads: 80, price: 24000, months: 3 },
      pro: { leads: 160, price: 48000, months: 6 },
      growth: { leads: 320, price: 96000, months: 12 }
    },
    {
      category: 'Top Food Franchise Brands',
      basic: { leads: 80, price: 24000, months: 3 },
      pro: { leads: 160, price: 48000, months: 6 },
      growth: { leads: 320, price: 96000, months: 12 }
    },
    {
      category: 'Premium Franchise Brands',
      basic: { leads: 100, price: 30000, months: 3 },
      pro: { leads: 200, price: 60000, months: 6 },
      growth: { leads: 400, price: 120000, months: 12 }
    }
  ];

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
          ...packagesData.find(pkg => pkg.category === category)[plan]
        };
      }
      
      return newSelection;
    });
  };

  const calculateTotal = () => {
    return Object.values(selectedPackages).reduce((sum, pkg) => sum + pkg.price, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Home Page Leads Packages
      </Typography>
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell sx={{ color: 'white', fontWeight: 600, width: '30%' }}>Category</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>
                BASIC (3 Months)
              </TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>
                PRO (6 Months)
              </TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>
                GROWTH (12 Months)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packagesData.map((pkg) => (
              <TableRow key={pkg.category}>
                <TableCell sx={{ fontWeight: 600 }}>{pkg.category}</TableCell>
                
                {/* BASIC Column */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Checkbox
                      checked={!!selectedPackages[`${pkg.category}-basic`]}
                      onChange={() => handleSelectPackage(pkg.category, 'basic')}
                    />
                    <Typography variant="body2">{pkg.basic.leads} leads</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ₹{pkg.basic.price.toLocaleString()}
                    </Typography>
                  </Box>
                </TableCell>
                
                {/* PRO Column */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Checkbox
                      checked={!!selectedPackages[`${pkg.category}-pro`]}
                      onChange={() => handleSelectPackage(pkg.category, 'pro')}
                    />
                    <Typography variant="body2">{pkg.pro.leads} leads</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ₹{pkg.pro.price.toLocaleString()}
                    </Typography>
                  </Box>
                </TableCell>
                
                {/* GROWTH Column */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Checkbox
                      checked={!!selectedPackages[`${pkg.category}-growth`]}
                      onChange={() => handleSelectPackage(pkg.category, 'growth')}
                    />
                    <Typography variant="body2">{pkg.growth.leads} leads</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ₹{pkg.growth.price.toLocaleString()}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {Object.keys(selectedPackages).length > 0 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Selected Packages</Typography>
          <Box sx={{ mb: 3 }}>
            {Object.values(selectedPackages).map((pkg, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 1,
                p: 1,
                backgroundColor: index % 2 === 0 ? theme.palette.grey[100] : 'transparent',
                borderRadius: 1
              }}>
                <Typography>
                  {pkg.category} - {pkg.plan} ({pkg.months} Months)
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2">{pkg.leads} leads</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ₹{pkg.price.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              ₹{calculateTotal().toLocaleString()}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ 
              mt: 3, 
              py: 1.5, 
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            }}
          >
            Proceed to Payment
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default HomePageLeads;