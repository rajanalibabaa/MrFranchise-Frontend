import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Grid,
  Divider,
  TableHead,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Fade,
  Grow,
  Slide,
  Zoom,
  useScrollTrigger,
  styled
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Business,
  AccountTree,
  Close,
  CheckCircleOutline,
  KeyboardArrowUp,
  ExpandMore
} from "@mui/icons-material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { keyframes } from "@emotion/react";

// Color palette
const colors = {
  primary: '#3f51b5',
  secondary: '#ff9800',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ffc107',
  info: '#2196f3',
  dark: '#212121',
  light: '#f5f5f5'
};

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10]
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${colors.secondary} 0%, ${colors.warning} 100%)`,
  color: 'white',
  fontWeight: 600,
  padding: '10px 24px',
  borderRadius: '50px',
  boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.6)'
  }
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  position: 'relative',
  paddingBottom: '10px',
  marginBottom: '30px',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '4px',
    background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
    borderRadius: '2px'
  }
}));

const OverviewTab = ({ brand, setIsModalOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const overviewRef = useRef(null);
  const [isModalOpen, setIsLocalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    investmentRange: "",
    location: "",
    planToInvest: "",
    readyToInvest: "",
  });
  const [userData, setUserData] = useState(null);

  const investorUUID = localStorage.getItem("investorUUID");
  const AccessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchInvestorDetails = async () => {
      if (!investorUUID || !AccessToken) return;
      try {
        const response = await axios.get(
          `https://franchise-backend-wgp6.onrender.com/api/v1/investor/getInvestorByUUID/${investorUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );
        setUserData(response.data.data);
        const investor = response.data?.data;
        if (investor) {
          setFormData((prev) => ({
            ...prev,
            fullName: investor.firstName || "",
            investorEmail: investor.email || "",
            mobileNumber: investor.mobileNumber || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch investor details:", error);
      }
    };

    fetchInvestorDetails();
  }, [investorUUID, AccessToken]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const investmentRanges = [
    ...new Set(
      brand?.franchiseDetails?.fico?.map((m) => m.investmentRange) || []
    ),
  ];

  const expansionLocations =
    brand.expansionLocationData?.expansionLocations?.domestic?.cities || [];

  const investmentTimings = [
    "Immediately",
    "1-3 months",
    "3-6 months",
    "6+ months",
  ];

  const readyToInvestOptions = [
    "Own Investment",
    "Going To Loan",
    "Need Loan Assistance",
  ];

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setFormData((prev) => ({
      ...prev,
      investmentRange: model.investmentRange || prev.investmentRange,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        brandId: brand?.uuid,
        brandName: brand.brandDetails?.brandName || "",
        brandEmail: brand.brandDetails?.email || "",
      };

      const token = localStorage.getItem("accessToken");
      const investorUUID = localStorage.getItem("investorUUID");
      const brandUUID = localStorage.getItem("brandUUID");

      const id = investorUUID || brandUUID;

      const response = await axios.post(
        `https://franchise-backend-wgp6.onrender.com/api/v1/instantapply/postApplication/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setSubmitSuccess(true);
        setFormData({
          fullName: "",
          location: "",
          investmentRange: "",
          planToInvest: "",
          readyToInvest: "",
          investorEmail: "",
          mobileNumber: "",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("❌Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsLocalModalOpen(false);
    setFormData({
      fullName: "",
      location: "",
      investmentRange: "",
      planToInvest: "",
      readyToInvest: "",
    });
    setSubmitSuccess(false);
  };

  const ExpansionLocationAccordion = ({ data }) => {
    const [expandedStates, setExpandedStates] = useState({});
    const [showAll, setShowAll] = useState(false);

    if (!data || !Array.isArray(data.locations)) return null;

    const visibleLocations = showAll ? data.locations : data.locations.slice(0, 2);

    const toggleState = (stateIndex) => {
      setExpandedStates((prev) => ({
        ...prev,
        [stateIndex]: !prev[stateIndex],
      }));
    };

    return (
      <Box sx={{ mt: 2 }}>
        {visibleLocations.map((loc, stateIndex) => (
          <Grow in={true} key={stateIndex} timeout={stateIndex * 300}>
            <Accordion
              expanded={expandedStates[stateIndex] || false}
              onChange={() => toggleState(stateIndex)}
              disableGutters
              sx={{
                mb: 1,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: colors.secondary }} />}
                aria-controls={`panel-${stateIndex}-content`}
                id={`panel-${stateIndex}-header`}
                sx={{
                  bgcolor: 'rgba(255, 152, 0, 0.05)',
                  borderLeft: `4px solid ${colors.secondary}`
                }}
              >
                <Typography fontWeight={600} color={colors.dark}>
                  {loc.state || 'Unknown State'}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                {Array.isArray(loc.districts) && loc.districts.map((dist, distIndex) => (
                  <Box key={distIndex} sx={{ mb: 1, ml: 1 }}>
                    <Typography variant="subtitle2" fontWeight={500} color={colors.dark}>
                      District: {dist.district || 'N/A'}
                    </Typography>
                    {Array.isArray(dist.cities) && dist.cities.length > 0 && (
                      <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                        Cities: {dist.cities.join(', ')}
                      </Typography>
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grow>
        ))}

        {data.locations.length > 2 && (
          <Button
            size="small"
            onClick={() => setShowAll((prev) => !prev)}
            sx={{ mt: 2, color: colors.secondary }}
          >
            {showAll ? 'Show Less' : `View All (${data.locations.length})`}
          </Button>
        )}
      </Box>
    );
  };

  const ExpansionLocationAccordionInternational = ({ data }) => {
    const [expandedCountries, setExpandedCountries] = useState({});
    const [showAll, setShowAll] = useState(false);

    if (!data || !Array.isArray(data.country)) return null;

    const visibleCountries = showAll ? data.country : data.country.slice(0, 2);

    const toggleCountry = (index) => {
      setExpandedCountries((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };

    return (
      <Box sx={{ mt: 2 }}>
        {visibleCountries.map((countryItem, index) => (
          <Slide direction="up" in={true} key={index} timeout={index * 300}>
            <Accordion
              expanded={expandedCountries[index] || false}
              onChange={() => toggleCountry(index)}
              disableGutters
              sx={{
                mb: 1,
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: colors.primary }} />}
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
                sx={{
                  bgcolor: 'rgba(63, 81, 181, 0.05)',
                  borderLeft: `4px solid ${colors.primary}`
                }}
              >
                <Typography fontWeight={600} color={colors.dark}>
                  {countryItem.states || 'Unknown Country/State'}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                {Array.isArray(countryItem.district) && countryItem.district.map((distItem, distIndex) => (
                  <Box key={distIndex} sx={{ mb: 1, ml: 1 }}>
                    <Typography variant="subtitle2" fontWeight={500} color={colors.dark}>
                      District: {distItem.district || 'N/A'}
                    </Typography>
                    {Array.isArray(distItem.cities) && distItem.cities.length > 0 && (
                      <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                        Cities: {distItem.cities.join(', ')}
                      </Typography>
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Slide>
        ))}

        {data.country.length > 2 && (
          <Button
            size="small"
            onClick={() => setShowAll((prev) => !prev)}
            sx={{ mt: 2, color: colors.primary }}
          >
            {showAll ? 'Show Less' : `View All (${data.country.length})`}
          </Button>
        )}
      </Box>
    );
  }

  const ExpansionLocationTags = ({ brand }) => {
    const [showAll, setShowAll] = useState(false);

    const locations = Array.isArray(brand.expansionLocationData?.expansionLocations?.domestic?.locations)
      ? brand.expansionLocationData.expansionLocations.domestic.locations.flatMap(loc =>
          Array.isArray(loc.districts) ?
            loc.districts.flatMap(dist =>
              Array.isArray(dist.cities) ?
                dist.cities.map(city => ({
                  city,
                  district: dist.district,
                  state: loc.state
                }))
              : []
            )
          : []
        )
      : [];

    const category = brand.franchiseDetails?.brandCategories || {};
    const formattedChips = locations.map((loc, index) => ({
      key: `${loc.state}-${loc.district}-${loc.city}-${index}`,
      label: `(${loc.city} - ${loc.district} - ${loc.state} - ${category.main || ''} - ${category.sub || ''} - ${category.child || ''} ),`
    }));

    const visibleChips = showAll ? formattedChips : formattedChips.slice(0, 5);

    return (
      <Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {visibleChips.map(chip => (
            <Typography
              key={chip.key}
              variant="caption"
              sx={{ 
                // mb: 0.5,
                // p: '4px 8px',
                // bgcolor: 'rgba(63, 81, 181, 0.1)',
                // borderRadius: '4px',
                // color: colors.dark
              }}
            >
              {chip.label}
            </Typography>
          ))}
        </Box>
        {formattedChips.length > 5 && (
          <Button
            variant="text"
            size="small"
            onClick={() => setShowAll(prev => !prev)}
            sx={{ mt: 1, color: colors.primary }}
          >
            {showAll ? 'View Less' : 'View More'}
          </Button>
        )}
      </Box>
    );
  };

  const sections = [
    {
      title: "Franchise Models",
      icon: <AccountTree sx={{ color: colors.secondary }} />,
      content: (
        <Box sx={{ mb: 4 }}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflowX: 'auto',
              maxHeight: 'calc(100vh - 300px)',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                // backgroundColor: colors.secondary,
                borderRadius: '4px',
              },
              // background: 'linear-gradient(145deg, #ffffff, #f5f5f5)'
            }}
          >
            <Table 
              sx={{ 
                minWidth: 1200,
                position: 'relative',
              }}
              // stickyHeader
            >
              <TableHead>
                <TableRow sx={{ 
                  '& th': {
                    backgroundColor: '#BCCCDC',
                    color: 'black',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    padding: '12px 16px',
                    borderBottom: 'none',
                    '&:first-of-type': {
                      borderTopLeftRadius: '16px',
                    },
                    '&:last-of-type': {
                      borderTopRightRadius: '16px',
                    },
                  }
                }}>
                  <TableCell>Model</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Investment</TableCell>
                  <TableCell>Area (sq.ft)</TableCell>
                  <TableCell>Agreement</TableCell>
                  <TableCell>Franchise Fee</TableCell>
                  <TableCell>Interior Cost</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Other Costs</TableCell>
                  <TableCell>Working Capital</TableCell>
                  <TableCell>Royalty Fee</TableCell>
                  <TableCell>Break Even</TableCell>
                  <TableCell>ROI</TableCell>
                  <TableCell>Payback</TableCell>
                  <TableCell>Margin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brand.franchiseDetails?.fico?.map((model, index) => (
                  <Fade in={true} key={index} timeout={index * 100}>
                    <TableRow
                      hover
                      
                      selected={selectedModel?._id === model._id}
                      onClick={() => handleModelSelect(model)}
                    >
                      <TableCell sx={{ 
                        fontWeight: 600,
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                        padding: '12px 16px',
                        color: colors.dark
                      }}>
                        {model.franchiseModel || "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px',  }}>
                        {model.franchiseType || "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px', }}>
                        {model.investmentRange || "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px',  }}>
                        {model.areaRequired ? `${model.areaRequired} sq.ft` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px',  }}>
                        {model.agreementPeriod ? `${model.agreementPeriod} yrs` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px', }}>
                        {model.franchiseFee ? `₹${Number(model.franchiseFee).toLocaleString('en-IN')}` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px', }}>
                        {model.interiorCost ? `₹${Number(model.interiorCost).toLocaleString('en-IN')}` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px', }}>
                        {model.stockInvestment ? `₹${Number(model.stockInvestment).toLocaleString('en-IN')}` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px', }}>
                        {model.otherCost ? `₹${Number(model.otherCost).toLocaleString('en-IN')}` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px',  }}>
                        {model.requireWorkingCapital ? `₹${Number(model.requireWorkingCapital).toLocaleString('en-IN')}/yr` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px',  }}>
                        {model.royaltyFee ? `${model.royaltyFee}%` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px',  }}>
                        {model.breakEven ? `${model.breakEven} mos` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ 
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                        padding: '12px 16px',
                        // color: model.roi ? (parseFloat(model.roi) > 20 ? colors.success : colors.warning) : 'inherit',
                        fontWeight: model.roi ? 700 : 'inherit'
                      }}>
                        {model.roi ? `${model.roi}%` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px',  }}>
                        {model.payBackPeriod ? `${model.payBackPeriod} mos` : "N/A"}
                      </TableCell>
                      <TableCell sx={{ 
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                        padding: '12px 16px',
                        // color: model.marginOnSales ? (parseFloat(model.marginOnSales) > 30 ? colors.success : colors.warning) : 'inherit',
                        fontWeight: model.marginOnSales ? 700 : 'inherit'
                      }}>
                        {model.marginOnSales ? `${model.marginOnSales}%` : "N/A"}
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={4} textAlign="center">
            <GradientButton
              onClick={() => {
                setIsLocalModalOpen(true);
              }}
              startIcon={<DescriptionIcon />}
              sx={{
                animation: `${pulse} 2s infinite`,
                '&:hover': {
                  animation: 'none'
                }
              }}
            >
              Apply for Selected Model
            </GradientButton>
          </Box>
        </Box>
      ),
    },
    {
      title: "Brand Overview",
      icon: <Business sx={{ color: colors.secondary }} />,
      content: (
        <Box> 
          <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={500}>
                <AnimatedCard sx={{ 
                  borderRadius: '16px', 
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom display="flex" alignItems="center">
                      <Business sx={{ color: colors.secondary, mr: 1 }} /> Brand Details
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
                    <Box sx={{ pl: 1 }}>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Category:</strong> {[brand.franchiseDetails?.brandCategories?.main, brand.franchiseDetails?.brandCategories?.sub, brand.franchiseDetails?.brandCategories?.child].filter(Boolean).join(" > ") || 'N/A'}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Company Owned Outlets:</strong> {brand.franchiseDetails?.companyOwnedOutlets || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Franchise Owned Outlets:</strong> {brand.franchiseDetails?.franchiseOwnedOutlets || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Total Outlets:</strong> {brand.franchiseDetails?.totalOutlets || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Established Year:</strong> {brand.franchiseDetails?.establishedYear || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Franchising Since:</strong> {brand.franchiseDetails?.franchiseSinceYear || "N/A"}
                      </Typography>
                    </Box>
                  </CardContent>
                </AnimatedCard>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={700}>
                <AnimatedCard sx={{ 
                  borderRadius: '16px', 
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom display="flex" alignItems="center">
                      <Business sx={{ color: colors.secondary, mr: 1 }} /> Support & Services
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
                    <Box sx={{ pl: 1 }}>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Consultation/Assistance:</strong> {brand.franchiseDetails?.consultationOrAssistance || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Franchise Development:</strong> {brand.franchiseDetails?.franchiseDevelopment || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Financing Aid:</strong> {brand.franchiseDetails?.aidFinancing || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Training Support:</strong> {brand.franchiseDetails?.trainingSupport?.join(", ") || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>Unique Selling Points:</strong> {brand.franchiseDetails?.uniqueSellingPoints?.join(", ") || "N/A"}
                      </Typography>
                      <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                        <strong style={{ color: colors.primary }}>International Expansion:</strong> {brand.expansionLocationData?.isInternationalExpansion ? "Yes" : "No"}
                      </Typography>
                    </Box>
                  </CardContent>
                </AnimatedCard>
              </Zoom>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: colors.dark }}>
              Brand Description
            </Typography>
            <Box 
              dangerouslySetInnerHTML={{ __html: brand.franchiseDetails.brandDescription }} 
              sx={{ 
                color: colors.dark,
                '& p': { mb: 2 },
                '& strong': { color: colors.primary }
              }}
            />
          </Box>

          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Awards
            </Typography>
            {Array.isArray(brand.uploads?.awards) && brand.uploads.awards.length > 0 ? (
              <Grid container spacing={2}>
                {brand.uploads.awards.map((award, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Slide direction="up" in={true} timeout={idx * 200}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        mb: 2,
                        p: 2,
                        borderRadius: '12px',
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }
                      }}>
                        {award.awardImage && (
                          <img
                            src={award.awardImage}
                            alt={`Award ${idx + 1}`}
                            style={{
                              width: '100%',
                              maxWidth: 180,
                              height: 120,
                              borderRadius: 8,
                              marginBottom: 12,
                              objectFit: 'cover',
                              background: '#f0f0f0',
                              display: award.awardImage ? 'block' : 'none'
                            }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        )}
                        {!award.awardImage && (
                          <Box
                            sx={{
                              width: '100%',
                              maxWidth: 180,
                              height: 120,
                              borderRadius: 2,
                              background: '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="body2" align="center" sx={{ color: colors.dark }}>
                          {award.awardDescription || "No Description"}
                        </Typography>
                      </Box>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No awards available.
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
          
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.dark }}>
              Current Outlets (Domestic)
            </Typography>
            <ExpansionLocationAccordion data={brand.expansionLocationData?.currentOutletLocations?.domestic} />
          </Box>
          
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.dark }}>
              Current Outlets (International)
            </Typography>
            <ExpansionLocationAccordionInternational data={brand.expansionLocationData?.currentOutletLocations?.international} />
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
          
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.dark }}>
              Expansion Locations (Domestic)
            </Typography>
            <ExpansionLocationAccordion data={brand.expansionLocationData?.expansionLocations?.domestic} />   
          </Box>
          
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.dark }}>
              Expansion Locations (International)
            </Typography>
            <ExpansionLocationAccordionInternational data={brand.expansionLocationData?.expansionLocations?.international} />
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
          
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.dark }}>
              Location Tags
            </Typography>
            <ExpansionLocationTags brand={brand}/>
          </Box>
          <Box sx={{ 
            mt: 4,
            p: 3,
            borderRadius: '12px',
            bgcolor: 'rgba(244, 67, 54, 0.05)',
            // borderLeft: `4px solid ${colors.error}`
          }}>
            <Typography variant="body1" fontWeight={700} color={colors.error}>
              Disclaimer: 
            </Typography>
            <Typography variant="caption" color={colors.dark}>
              Mr Franchise and the site sponsors accept no liability for the accuracy of any information contained on this site or on other linked sites. We recommend you take advice from a lawyer, accountant and franchise consultant experienced in franchising before you commit yourself. It is user's responsibility to satisfy yourself as to the accuracy and reliability of the information supplied. Please read the terms & conditions on MrFranchise.in
            </Typography>
          </Box>
        </Box>
        
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }} ref={overviewRef}>
      {sections.map((section, index) => (
        <Box key={index} sx={{ mb: 6 }}>
          <SectionHeader
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 152, 0, 0.1)',
              animation: `${float} 4s ease-in-out infinite`
            }}>
              {section.icon}
            </Box>
            {section.title}
          </SectionHeader>
          {section.content}
          
        </Box>
      ))}

      {/* Application Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.dark }}>
              <DescriptionIcon sx={{ color: colors.secondary, mr: 1 }} /> Franchise
              Application
            </Typography>
            <IconButton onClick={handleModalClose} sx={{ color: colors.dark }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {submitSuccess ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircleOutline
                sx={{ 
                  fontSize: 80, 
                  color: colors.success, 
                  mb: 2,
                  animation: `${pulse} 2s infinite`
                }}
              />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: colors.dark }}>
                Application Submitted Successfully!
              </Typography>
              <Typography variant="body1" sx={{ color: colors.dark, mb: 3 }}>
                We'll contact you soon regarding your franchise application.
              </Typography>
              <GradientButton
                onClick={handleModalClose}
                sx={{
                  bgcolor: colors.success,
                  background: `linear-gradient(45deg, ${colors.success} 0%, #66bb6a 100%)`,
                  px: 6
                }}
              >
                Close
              </GradientButton>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || userData?.firstName || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="investorEmail"
                    value={formData.investorEmail || userData?.email || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={
                      formData.mobileNumber || userData?.mobileNumber || ""
                    }
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                      },
                    }}
                  >
                    {expansionLocations.map((loc, i) => (
                      <MenuItem key={i} value={loc} sx={{ color: colors.dark }}>
                        {loc}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Investment Range"
                    name="investmentRange"
                    value={formData.investmentRange}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                      },
                    }}
                  >
                    {investmentRanges.map((range, i) => (
                      <MenuItem key={i} value={range} sx={{ color: colors.dark }}>
                        {range}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Plan to Invest"
                    name="planToInvest"
                    value={formData.planToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                      },
                    }}
                  >
                    {investmentTimings.map((option, i) => (
                      <MenuItem key={i} value={option} sx={{ color: colors.dark }}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Ready to Invest"
                    name="readyToInvest"
                    value={formData.readyToInvest}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="medium"
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: colors.secondary,
                        },
                      },
                    }}
                  >
                    {readyToInvestOptions.map((option, i) => (
                      <MenuItem key={i} value={option} sx={{ color: colors.dark }}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <GradientButton
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: '50px',
                      py: 1.5,
                      fontSize: '1rem',
                      '&:disabled': {
                        background: '#e0e0e0',
                        color: '#9e9e9e'
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Apply Now"
                    )}
                  </GradientButton>
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Zoom in={showBackToTop}>
          <Fab
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              bgcolor: colors.secondary,
              color: 'white',
              '&:hover': {
                bgcolor: '#fb8c00',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <KeyboardArrowUp />
          </Fab>
        </Zoom>
      )}
    </Box>
  );
};

export default OverviewTab;