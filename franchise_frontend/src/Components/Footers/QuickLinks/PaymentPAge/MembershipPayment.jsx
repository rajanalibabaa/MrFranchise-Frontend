import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Checkbox,
  useTheme,
  Tabs,
  Tab,
  Badge,
  Avatar
} from '@mui/material';
import {
  Diamond as DiamondIcon,
  WorkspacePremium as PremiumIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const MembershipSelection = ({ onNext }) => {
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const membershipOptions = [
    {
        tier:'Free',
        icon: <CheckCircleIcon fontSize="small" />,
        color: theme.palette.mode === 'dark' ? '#C0C0C0' : '#A0A0A0',
        plans: {
            BASIC: { months: 3, leads: 15, totalLeads:15, price: 0 },
            // PRO: { months: 6, leads: 15, totalLeads: 15, price: 0 },
            // GROWTH: { months: 12, leads: 15, totalLeads: 15, price: 0 }
        }
    },
    {
      tier: 'Silver',
      icon: <DiamondIcon fontSize="small" />,
      color: theme.palette.mode === 'dark' ? '#C0C0C0' : '#A0A0A0',
      plans: {
        BASIC: { months: 3, leads: 30, totalLeads: 90, price: 13500 },
        PRO: { months: 6, leads: 45, totalLeads: 270, price: 27000 },
        GROWTH: { months: 12, leads: 60, totalLeads: 720, price: 54000 }
      }
    },
    {
      tier: 'Gold',
      icon: <PremiumIcon fontSize="small" />,
      color: '#FFD700',
      popular: true,
      plans: {
        BASIC: { months: 3, leads: 45, totalLeads: 135, price: 20250 },
        PRO: { months: 6, leads: 60, totalLeads: 360, price: 40500 },
        GROWTH: { months: 12, leads: 75, totalLeads: 900, price: 81000 }
      }
    },
    {
      tier: 'Platinum',
      icon: <StarIcon fontSize="small" />,
      color: theme.palette.mode === 'dark' ? '#E5E4E2' : '#C5C4C2',
      plans: {
        BASIC: { months: 3, leads: 60, totalLeads: 180, price: 27000 },
        PRO: { months: 6, leads: 75, totalLeads: 450, price: 54000 },
        GROWTH: { months: 12, leads: 90, totalLeads: 1080, price: 108000 }
      }
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedPlan(null);
  };

  const handlePlanSelect = (tier, plan, details) => {
    setSelectedPlan({
      tier,
      plan,
      ...details,
      color: membershipOptions.find(m => m.tier === tier).color
    });
  };

  const currentTier = membershipOptions[tabValue];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* <Typography variant="h4" align="center" gutterBottom sx={{ 
        mb: 2, 
        fontWeight: 800,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Choose Your Advertising Plan
      </Typography> */}
      
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 1 }}>
        Select the perfect package for your business growth
      </Typography>

      {/* Tier Selection Tabs */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mb: 4,
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: theme.palette.divider
        }
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              backgroundColor: currentTier.color
            }
          }}
        >
          {membershipOptions.map((option, index) => (
            <Tab
              key={option.tier}
              label={
                <Badge 
                  badgeContent={option.popular ? "POPULAR" : null} 
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      top: -10,
                      right: -30,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    color: tabValue === index ? currentTier.color : 'inherit'
                  }}>
                    <Avatar sx={{ 
                      bgcolor: tabValue === index ? currentTier.color : 'transparent',
                      color: tabValue === index ? 
                        theme.palette.getContrastText(currentTier.color) : 
                        theme.palette.text.secondary,
                      width: 32,
                      height: 32
                    }}>
                      {option.icon}
                    </Avatar>
                    {option.tier}
                  </Box>
                </Badge>
              }
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                minHeight: 64,
                '&.Mui-selected': {
                  color: currentTier.color
                }
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Plan Cards */}
      <Grid container spacing={3} justifyContent="center">
        {Object.entries(currentTier.plans).map(([plan, details]) => {
          const isSelected = selectedPlan?.plan === plan;
          return (
            <Grid item xs={12} sm={6} md={4} key={plan}>
              <Card
                onClick={() => handlePlanSelect(currentTier.tier, plan, details)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isSelected ? `2px solid ${currentTier.color}` : `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 10px 20px rgba(0,0,0,0.1)`,
                    borderColor: currentTier.color
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: currentTier.color
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {plan}
                    </Typography>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handlePlanSelect(currentTier.tier, plan, details)}
                      icon={<BoltIcon />}
                      checkedIcon={<CheckCircleIcon sx={{ color: currentTier.color }} />}
                      sx={{
                        p: 0,
                        '& .MuiSvgIcon-root': {
                          fontSize: 28
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ 
                    backgroundColor: `${currentTier.color}15`,
                    p: 2,
                    borderRadius: 1,
                    mb: 3,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      ₹{details.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For {details.months} months
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      py: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography variant="body2">Monthly Leads:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {details.leads}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      py: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography variant="body2">Total Leads:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {details.totalLeads}
                      </Typography>
                    </Box>
                   
                  </Box>

                  {plan === 'PRO' && (
                    <Chip 
                      label="Best Value" 
                      size="small" 
                      sx={{ 
                        mt: 1,
                        backgroundColor: currentTier.color,
                        color: theme.palette.getContrastText(currentTier.color),
                        fontWeight: 600
                      }} 
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Continue Button */}
      {selectedPlan && (
        <Box sx={{ 
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Box sx={{
            backgroundColor: `${currentTier.color}15`,
            p: 3,
            borderRadius: 3,
            width: '100%',
            maxWidth: 600,
            textAlign: 'center',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              You selected: <span style={{ color: currentTier.color }}>{selectedPlan.tier} {selectedPlan.plan}</span>
            </Typography>
            <Typography variant="body1">
              {selectedPlan.leads} leads/month for {selectedPlan.months} months
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
              Total: ₹{selectedPlan.price.toLocaleString()}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => onNext(selectedPlan)}
            sx={{
              px: 8,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: 50,
              background: `linear-gradient(90deg, ${currentTier.color}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 15px ${currentTier.color}80`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${currentTier.color}80`
              }
            }}
          >
            Continue to Banner Ads
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MembershipSelection; 