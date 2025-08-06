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
  Avatar,
  Stack
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
      tier: 'Free',
      icon: <CheckCircleIcon fontSize="small" />,
      color: theme.palette.mode === 'dark' ? '#6b7280' : '#9ca3af',
      gradient: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
      plans: {
        BASIC: { months: 3, leads: 15, totalLeads: 15, price: 0 },
      }
    },
    {
      tier: 'Silver',
      icon: <DiamondIcon fontSize="small" />,
      color: '#a1a1aa',
      gradient: 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
      plans: {
        BASIC: { months: 3, leads: 30, totalLeads: 90, price: 13500 },
        PRO: { months: 6, leads: 45, totalLeads: 270, price: 27000 },
        GROWTH: { months: 12, leads: 60, totalLeads: 720, price: 54000 }
      }
    },
    {
      tier: 'Gold',
      icon: <PremiumIcon fontSize="small" />,
      color: '#d4b01e',
      gradient: 'linear-gradient(135deg, #fef3c7, #fde68a)',
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
      color: '#a5b4fc',
      gradient: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
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
      color: membershipOptions.find(m => m.tier === tier).color,
      gradient: membershipOptions.find(m => m.tier === tier).gradient
    });
  };

  const currentTier = membershipOptions[tabValue];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Select the perfect package for your business growth
      </Typography>

      {/* Tier Selection Tabs */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mb: 4,
        position: 'relative'
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
                      height: 32,
                      background: option.gradient
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
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected ? `0 10px 25px -5px ${currentTier.color}40` : '0 4px 6px -1px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 25px -5px ${currentTier.color}20, 0 10px 10px -5px ${currentTier.color}10`,
                    borderColor: currentTier.color
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: currentTier.gradient
                  }
                }}
              >
                <CardContent sx={{ 
                  flexGrow: 1,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      color: 'text.primary'
                    }}>
                      {plan}
                    </Typography>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handlePlanSelect(currentTier.tier, plan, details)}
                      icon={<BoltIcon color="action" />}
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
                    background: currentTier.gradient,
                    p: 2.5,
                    borderRadius: 1.5,
                    mb: 3,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                      ₹{details.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For {details.months} months
                    </Typography>
                  </Box>

                  <Stack spacing={1.5} sx={{ mb: 3, flexGrow: 1 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      py: 1.5,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography variant="body2" color="text.secondary">Monthly Leads:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {details.leads}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      py: 1.5,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}>
                      <Typography variant="body2" color="text.secondary">Total Leads:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {details.totalLeads}
                      </Typography>
                    </Box>
                  </Stack>

                  {plan === 'PRO' && (
                    <Chip 
                      label="Best Value" 
                      size="small" 
                      sx={{ 
                        mt: 'auto',
                        alignSelf: 'center',
                        backgroundColor: currentTier.color,
                        color: theme.palette.getContrastText(currentTier.color),
                        fontWeight: 600,
                        px: 1.5,
                        py: 0.5
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
            background: selectedPlan.gradient,
            p: 3,
            borderRadius: 2,
            width: '100%',
            maxWidth: 600,
            textAlign: 'center',
            mb: 3,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: `0 4px 6px -1px ${selectedPlan.color}20`
          }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              You selected: <span style={{ color: selectedPlan.color, fontWeight: 700 }}>{selectedPlan.tier} {selectedPlan.plan}</span>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedPlan.leads} leads/month for {selectedPlan.months} months
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 800 }}>
              Total: ₹{selectedPlan.price.toLocaleString()}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => onNext(selectedPlan)}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 2,
              background: '#ffad33',
              boxShadow: `0 4px 15px ${selectedPlan.color}40`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${selectedPlan.color}60`
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