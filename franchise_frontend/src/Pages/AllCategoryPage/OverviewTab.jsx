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
  styled,
  Chip,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Business,
  AccountTree,
  Close,
  CheckCircleOutline,
  KeyboardArrowUp,
  ExpandMore,
  ContactMail,
  Schedule,
  LocationOn,
  AttachMoney,
  ArrowBackIosNew,
  ArrowBack,
  Place,
  LocationCity,
  LocationOff,
  Map,
  FiberManualRecord
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
          `http://localhost:5000/api/v1/investor/getInvestorByUUID/${investorUUID}`,
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
        `http://localhost:5000/api/v1/instantapply/postApplication/${id}`,
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


const ExpansionLocationGrid = ({ data }) => {
  const [expandedState, setExpandedState] = useState(0);
  const [expandedDistrict, setExpandedDistrict] = useState( data?.locations?.[0]?.districts?.length > 0 ? "0-0" : null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!data || !Array.isArray(data.locations)) return null;

  const visibleLocations = data.locations;
  const hasData = data.locations.length > 0;

  const toggleState = (stateIndex) => {
    if (expandedState === stateIndex) {
      setExpandedState(null);
      setExpandedDistrict(null);
    } else {
      setExpandedState(stateIndex);
      setExpandedDistrict(null);
    }
  };

  const toggleDistrict = (stateIndex, distIndex) => {
    const districtKey = `${stateIndex}-${distIndex}`;
    setExpandedDistrict(expandedDistrict === districtKey ? null : districtKey);
  };

  return (
    <Box sx={{ 
      mt: 2,
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {!hasData ? (
        <Box sx={{
          p: 3,
          textAlign: 'center',
          color: 'text.secondary'
        }}>
          <Typography variant="body1">No locations available</Typography>
        </Box>
      ) : (
        <Box sx={{
          display: isMobile ? 'block' : 'flex',
          height: isMobile ? 'auto' : '400px',
          overflow: isMobile ? 'visible' : 'hidden'
        }}>
          {/* Unified scroll container for desktop */}
          <Box sx={{
            display: isMobile ? 'block' : 'flex',
            flex: 1,
            overflow: isMobile ? 'visible' : 'auto',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            }
          }}>
            {/* States Column */}
            <Box sx={{
              width: isMobile ? '100%' : '300px',
              minWidth: isMobile ? '100%' : '300px',
              borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
              bgcolor: 'background.paper'
            }}>
              <Typography variant="subtitle1" sx={{ 
                p: 2,
                position: 'sticky',
                top: 0,
                bgcolor: '#7ad03a',
                zIndex: 2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Place sx={{ mr: 1, color: '#fff' }} />
                States
              </Typography>
              <Box sx={{ p: 1 }}>
                {visibleLocations.map((loc, stateIndex) => (
                  <Card
                    key={`state-${stateIndex}`}
                    onClick={() => toggleState(stateIndex)}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      borderLeft: `4px solid ${expandedState === stateIndex ? theme.palette.primary.main : 'transparent'}`,
                      bgcolor: expandedState === stateIndex ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography fontWeight={600}>
                        {loc.state || 'Unknown State'}
                      </Typography>
                      <Chip
                        label={loc.districts?.length || 0} 
                        size="small" 
                        color={expandedState === stateIndex ? 'primary' : 'default'}
                      sx={{backgroundColor:'#ff9800'}}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Districts Column */}
            <Box sx={{
              width: isMobile ? '100%' : '300px',
              minWidth: isMobile ? '100%' : '300px',
              borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
              bgcolor: expandedState !== null ? 'background.paper' : 'rgba(0,0,0,0.02)',
              display: isMobile ? (expandedState !== null ? 'block' : 'none') : 'block',
              transition: 'background-color 0.3s ease'
            }}>
              <Typography variant="subtitle1" sx={{ 
                p: 2,
                position: 'sticky',
                top: 0,
                bgcolor: '#7ad03a',
                zIndex: 2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Map sx={{ mr: 1, color: '#fff' }} />
                Districts
                {isMobile && expandedState !== null && (
                  <IconButton 
                    size="small" 
                    onClick={() => setExpandedState(null)}
                    sx={{ ml: 'auto' }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                )}
              </Typography>
              <Box sx={{ p: 1 }}>
                {expandedState !== null && Array.isArray(data.locations[expandedState].districts) ? (
                  data.locations[expandedState].districts.length > 0 ? (
                    data.locations[expandedState].districts.map((dist, distIndex) => {
                      const districtKey = `${expandedState}-${distIndex}`;
                      return (
                        <Card
                          key={`district-${districtKey}`}
                          onClick={() => toggleDistrict(expandedState, distIndex)}
                          sx={{
                            mb: 1,
                            cursor: 'pointer',
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            borderLeft: `4px solid ${expandedDistrict === districtKey ? theme.palette.secondary.main : 'transparent'}`,
                            bgcolor: expandedDistrict === districtKey ? 'rgba(255, 152, 0, 0.08)' : 'background.paper',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <CardContent sx={{ py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">
                              {dist.district || 'N/A'}
                            </Typography>
                            <Chip 
                              label={dist.cities?.length || 0} 
                              size="small" 
                              color={expandedDistrict === districtKey ? 'secondary' : 'default'}
                            />
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOff sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                        <br />
                        No districts available
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {expandedState === null ? (
                        <>
                          <ArrowBack sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                          <br />
                          Select a state
                        </>
                      ) : (
                        'Loading districts...'
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Cities Column */}
            <Box sx={{
              flex: 1,
              bgcolor: expandedDistrict !== null ? 'background.paper' : 'rgba(0,0,0,0.02)',
              display: isMobile ? (expandedDistrict !== null ? 'block' : 'none') : 'block',
              transition: 'background-color 0.3s ease'
            }}>
              <Typography variant="subtitle1" sx={{ 
                p: 2,
                position: 'sticky',
                top: 0,
                bgcolor: '#7ad03a',
                zIndex: 2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <LocationCity sx={{ mr: 1, color: '#fff' }} />
                Cities
                {isMobile && expandedDistrict !== null && (
                  <IconButton 
                    size="small" 
                    onClick={() => setExpandedDistrict(null)}
                    sx={{ ml: 'auto' }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                )}
              </Typography>
              <Box sx={{ 
                p: 1,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 1
              }}>
                {expandedDistrict !== null ? (
                  (() => {
                    const [stateIdx, districtIdx] = expandedDistrict.split('-').map(Number);
                    const cities = data.locations[stateIdx]?.districts[districtIdx]?.cities;
                    
                    return Array.isArray(cities) && cities.length > 0 ? (
                      cities.map((city, cityIndex) => (
                        <Card 
                          key={`city-${cityIndex}`}
                          sx={{ 
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            bgcolor: 'background.paper',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <CardContent sx={{ 
                            py: 1.5,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <FiberManualRecord sx={{ 
                              fontSize: 8, 
                              color: 'primary.main',
                              mr: 1
                            }} />
                            <Typography variant="body2">
                              {city}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          <LocationOff sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                          <br />
                          No cities available
                        </Typography>
                      </Box>
                    );
                  })()
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {expandedState === null ? (
                        <>
                          <ArrowBack sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                          <br />
                          Select a district
                        </>
                      ) : (
                        'Select a district to view cities'
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
const ExpansionLocationGridInternational = ({ data }) => {
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!data || !Array.isArray(data.country)) return null;

  const visibleCountries = data.country;
  const hasData = data.country.length > 0;

  const toggleCountry = (countryIndex) => {
    if (expandedCountry === countryIndex) {
      setExpandedCountry(null);
      setExpandedDistrict(null);
    } else {
      setExpandedCountry(countryIndex);
      setExpandedDistrict(null);
    }
  };

  const toggleDistrict = (countryIndex, distIndex) => {
    const districtKey = `${countryIndex}-${distIndex}`;
    setExpandedDistrict(expandedDistrict === districtKey ? null : districtKey);
  };

  return (
    <Box sx={{ 
      mt: 2,
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {!hasData ? (
        <Box sx={{
          p: 3,
          textAlign: 'center',
          color: 'text.secondary'
        }}>
          <Typography variant="body1">No international locations available</Typography>
        </Box>
      ) : (
        <Box sx={{
          display: isMobile ? 'block' : 'flex',
          height: isMobile ? 'auto' : '400px',
          overflow: isMobile ? 'visible' : 'hidden'
        }}>
          {/* Unified scroll container */}
          <Box sx={{
            display: isMobile ? 'block' : 'flex',
            flex: 1,
            overflow: isMobile ? 'visible' : 'auto',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            }
          }}>
            {/* Countries Column */}
            <Box sx={{
              width: isMobile ? '100%' : '300px',
              minWidth: isMobile ? '100%' : '300px',
              borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
              bgcolor: 'background.paper'
            }}>
              <Typography variant="subtitle1" sx={{ 
                p: 2,
                position: 'sticky',
                top: 0,
                bgcolor: '#7ad03a',
                zIndex: 2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Public sx={{ mr: 1, color: 'primary.main' }} />
                Countries
              </Typography>
              <Box sx={{ p: 1 }}>
                {visibleCountries.map((countryItem, countryIndex) => (
                  <Card
                    key={`country-${countryIndex}`}
                    onClick={() => toggleCountry(countryIndex)}
                    sx={{
                      mb: 1,
                      cursor: 'pointer',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      borderLeft: `4px solid ${expandedCountry === countryIndex ? theme.palette.primary.main : 'transparent'}`,
                      bgcolor: expandedCountry === countryIndex ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ 
                      py: 1.5, 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Box>
                        <Typography fontWeight={600}>
                          {countryItem.states || 'Unknown Country'}
                        </Typography>
                        {countryItem.region && (
                          <Typography variant="caption" color="text.secondary">
                            {countryItem.region}
                          </Typography>
                        )}
                      </Box>
                      <Chip 
                        label={countryItem.district?.length || 0} 
                        size="small" 
                        color={expandedCountry === countryIndex ? 'primary' : 'default'}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Districts Column */}
            <Box sx={{
              width: isMobile ? '100%' : '300px',
              minWidth: isMobile ? '100%' : '300px',
              borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
              bgcolor: expandedCountry !== null ? 'background.paper' : 'rgba(0,0,0,0.02)',
              display: isMobile ? (expandedCountry !== null ? 'block' : 'none') : 'block',
              transition: 'background-color 0.3s ease'
            }}>
              <Typography variant="subtitle1" sx={{ 
                p: 2,
                position: 'sticky',
                top: 0,
                bgcolor: '#7ad03a',
                zIndex: 2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Map sx={{ mr: 1, color: 'primary.main' }} />
                Districts/States
                {isMobile && expandedCountry !== null && (
                  <IconButton 
                    size="small" 
                    onClick={() => setExpandedCountry(null)}
                    sx={{ ml: 'auto' }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                )}
              </Typography>
              <Box sx={{ p: 1 }}>
                {expandedCountry !== null && Array.isArray(data.country[expandedCountry].district) ? (
                  data.country[expandedCountry].district.length > 0 ? (
                    data.country[expandedCountry].district.map((distItem, distIndex) => {
                      const districtKey = `${expandedCountry}-${distIndex}`;
                      return (
                        <Card
                          key={`district-${districtKey}`}
                          onClick={() => toggleDistrict(expandedCountry, distIndex)}
                          sx={{
                            mb: 1,
                            cursor: 'pointer',
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            borderLeft: `4px solid ${expandedDistrict === districtKey ? theme.palette.secondary.main : 'transparent'}`,
                            bgcolor: expandedDistrict === districtKey ? 'rgba(255, 152, 0, 0.08)' : 'background.paper',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <CardContent sx={{ 
                            py: 1.5, 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <Typography variant="subtitle1">
                              {distItem.district || 'N/A'}
                            </Typography>
                            <Chip 
                              label={distItem.cities?.length || 0} 
                              size="small" 
                              color={expandedDistrict === districtKey ? 'secondary' : 'default'}
                            />
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOff sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                        <br />
                        No districts/states available
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {expandedCountry === null ? (
                        <>
                          <ArrowBack sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                          <br />
                          Select a country
                        </>
                      ) : (
                        'Loading districts...'
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Cities Column */}
            <Box sx={{
              flex: 1,
              bgcolor: expandedDistrict !== null ? 'background.paper' : 'rgba(0,0,0,0.02)',
              display: isMobile ? (expandedDistrict !== null ? 'block' : 'none') : 'block',
              transition: 'background-color 0.3s ease'
            }}>
              <Typography variant="subtitle1" sx={{ 
                p: 2,
                position: 'sticky',
                top: 0,
                bgcolor: '#7ad03a',
                zIndex: 2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <LocationCity sx={{ mr: 1, color: 'primary.main' }} />
                Cities
                {isMobile && expandedDistrict !== null && (
                  <IconButton 
                    size="small" 
                    onClick={() => setExpandedDistrict(null)}
                    sx={{ ml: 'auto' }}
                  >
                    <ArrowBack fontSize="small" />
                  </IconButton>
                )}
              </Typography>
              <Box sx={{ 
                p: 1,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 1
              }}>
                {expandedDistrict !== null ? (
                  (() => {
                    const [countryIdx, districtIdx] = expandedDistrict.split('-').map(Number);
                    const cities = data.country[countryIdx]?.district[districtIdx]?.cities;
                    
                    return Array.isArray(cities) && cities.length > 0 ? (
                      cities.map((city, cityIndex) => (
                        <Card 
                          key={`city-${cityIndex}`}
                          sx={{ 
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            bgcolor: 'background.paper',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <CardContent sx={{ 
                            py: 1.5,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <FiberManualRecord sx={{ 
                              fontSize: 8, 
                              color: 'primary.main',
                              mr: 1
                            }} />
                            <Typography variant="body2">
                              {city}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          <LocationOff sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                          <br />
                          No cities available
                        </Typography>
                      </Box>
                    );
                  })()
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {expandedCountry === null ? (
                        <>
                          <ArrowBack sx={{ fontSize: 40, color: 'action.disabled', mb: 1 }} />
                          <br />
                          Select a district
                        </>
                      ) : (
                        'Select a district to view cities'
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

 const ExpansionLocationTags = ({ brand }) => {
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
      label: `${loc.city} - ${loc.district} - ${loc.state} - ${category.main || ''} - ${category.sub || ''} - ${category.child || ''}`
    }));

    return (
      <Box sx={{ 
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        p: 1,
        height: '150px', // Fixed height
        overflowY: 'auto' // Scrollable content
      }}>
        {formattedChips.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column',  gap: 1 }}>
            {formattedChips.map(chip => (
              <Typography
                key={chip.key}
                variant="caption"
                sx={{ 
                  display: 'inline-block',
                  // p: '4px 8px',
                  // bgcolor: 'rgba(63, 81, 181, 0.1)',
                  borderRadius: '4px',
                  color: colors.dark,
                  whiteSpace: 'nowrap'
                }}
              >
                {chip.label}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              mt: 2
            }}
          >
            No locations available
          </Typography>
        )}
      </Box>
    );
  };

  const hasData = (sectionData) => {
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0;
    }
    return !!sectionData;
  };

  const sections = [
   
    {
      title: "Brand Overview",
      icon: <Business sx={{ color: colors.secondary }} />,
      content: (

        <Box>
          {hasData(brand.franchiseDetails?.fico) && ( <>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: colors.dark }}>
    Franchise Details
          </Typography>
         <Box sx={{ mb: 4 }}>
  <TableContainer
    // component={Paper}
    sx={{
      borderRadius: '16px',
      border: 'none',
      overflowX: 'auto',
      maxHeight: 'calc(100vh - 300px)',
      '&::-webkit-scrollbar': {
        height: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '4px',
      },
    }}
  >
    <Table 
      sx={{ 
        minWidth: 1500, // Set a minimum width to ensure all columns are visible
        position: 'relative',
      }}
      stickyHeader
    >
      <TableHead>
        <TableRow sx={{ 
          '& th': {
            backgroundColor: '#7ad03a',
            color: 'black',
            fontWeight: 700,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            padding: { xs: '8px 12px', sm: '12px 16px' },
            borderBottom: 'none',
            whiteSpace: 'nowrap',
            '&:first-of-type': {
              borderTopLeftRadius: '16px',
            },
            '&:last-of-type': {
              borderTopRightRadius: '16px',
            },
          }
        }}>
          <TableCell sx={{ width: '150px' }}>Model</TableCell>
          <TableCell sx={{ width: '120px' }}>Type</TableCell>
          <TableCell sx={{ width: '150px' }}>Investment</TableCell>
          <TableCell sx={{ width: '100px' }}>Area</TableCell>
          <TableCell sx={{ width: '120px' }}>Agreement</TableCell>
          <TableCell sx={{ width: '150px' }}>Franchise Fee</TableCell>
          <TableCell sx={{ width: '150px' }}>Interior Cost</TableCell>
          <TableCell sx={{ width: '150px' }}>Stock</TableCell>
          <TableCell sx={{ width: '150px' }}>Other Costs</TableCell>
          <TableCell sx={{ width: '150px' }}>Working Capital</TableCell>
          <TableCell sx={{ width: '120px' }}>Royalty Fee</TableCell>
          <TableCell sx={{ width: '120px' }}>Break Even</TableCell>
          <TableCell sx={{ width: '100px' }}>ROI</TableCell>
          <TableCell sx={{ width: '120px' }}>Payback</TableCell>
          <TableCell sx={{ width: '120px' }}>Margin</TableCell>
        </TableRow>
      </TableHead>
      <TableBody >
        {brand.franchiseDetails?.fico?.map((model, index) => (
          <Fade in={true} key={index} timeout={index * 100}>
            <TableRow
              hover
              selected={selectedModel?._id === model._id}
              onClick={() => handleModelSelect(model)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                },
                
              }}
            >
              <TableCell sx={{ 
                fontWeight: 600,
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                padding: { xs: '8px 12px', sm: '12px 16px' },
                color: 'text.primary',
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {model.franchiseModel || "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '120px'
              }}>
                {model.franchiseType || "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '150px'
              }}>
                {model.investmentRange || "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '100px'
              }}>
                {model.areaRequired ? `${model.areaRequired} ` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '120px'
              }}>
                {model.agreementPeriod ? `${model.agreementPeriod} yrs` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '150px'
              }}>
                {model.franchiseFee ? `₹${Number(model.franchiseFee).toLocaleString('en-IN')}` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '150px'
              }}>
                {model.interiorCost ? `₹${Number(model.interiorCost).toLocaleString('en-IN')}` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '150px'
              }}>
                {model.stockInvestment ? `₹${Number(model.stockInvestment).toLocaleString('en-IN')}` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '150px'
              }}>
                {model.otherCost ? `₹${Number(model.otherCost).toLocaleString('en-IN')}` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '150px'
              }}>
                {model.requireWorkingCapital ? `₹${Number(model.requireWorkingCapital).toLocaleString('en-IN')}` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '120px'
              }}>
                {model.royaltyFee ? `${model.royaltyFee}` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '120px'
              }}>
                {model.breakEven ? `${model.breakEven} ` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '100px',
                fontWeight: model.roi ? 700 : 'inherit',
                color: model.roi ?  `${(parseFloat(model.roi) > 20 ? 'success.main' : 'warning.main')}` : 'inherit'
              }}>
                {model.roi ? `${model.roi}%` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '120px'
              }}>
                {model.payBackPeriod ? `${model.payBackPeriod}` : "N/A"}
              </TableCell>
              <TableCell sx={{ 
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
                padding: { xs: '8px 12px', sm: '12px 16px' },
                width: '120px',
                fontWeight: model.marginOnSales ? 700 : 'inherit',
                color: model.marginOnSales ?  `${(parseFloat(model.marginOnSales) > 30 ? 'success.main' : 'warning.main')}` : 'inherit'
              }}>
                {model.marginOnSales ? `${model.marginOnSales}%` : "N/A"}
              </TableCell>
            </TableRow>
          </Fade>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
</>)}
    

{/* Brand Description - Only show if data exists */}
          {brand.franchiseDetails?.brandDescription && (
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: '16px', 
              background: '#fff',
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
          )}


         {/* Support Provided By Brand - Only show if data exists */}
          {(hasData(brand.franchiseDetails?.trainingSupport) || 
            brand.franchiseDetails?.aidFinancing || 
            hasData(brand.franchiseDetails?.uniqueSellingPoints)) && (
            <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Zoom in={true} timeout={700}>
                  <AnimatedCard sx={{ 
                    borderRadius: '16px', 
                    height: '100%'
                  }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700} gutterBottom display="flex" alignItems="center">
                        <Business sx={{ color: colors.secondary, mr: 1 }} /> Support Provided By Brand
                      </Typography>
                      <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.1)' }} />
                      <Box sx={{ pl: 1 }}>
                        {hasData(brand.franchiseDetails?.trainingSupport) && (
                          <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                            <strong>Training Support:</strong>{' '}
                            {brand.franchiseDetails.trainingSupport.map((item) => `✅ ${item}`).join('  ')}
                          </Typography>
                        )}
                        {brand.franchiseDetails?.aidFinancing && (
                          <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                            <strong>Financing Aid:</strong> {brand.franchiseDetails.aidFinancing}
                          </Typography>
                        )}
                        {hasData(brand.franchiseDetails?.uniqueSellingPoints) && (
                          <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                            <strong>Unique Selling Points:</strong> {brand.franchiseDetails.uniqueSellingPoints.join(", ")}
                          </Typography>
                        )}
                        <Typography variant="body2" paragraph sx={{ color: colors.dark }}>
                          <strong>International Expansion:</strong> {brand.expansionLocationData?.isInternationalExpansion ? "Yes" : "No"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </AnimatedCard>
                </Zoom>
              </Grid>
            </Grid>
          )}          
          
               {/* Current Outlets (Domestic) - Only show if data exists */}
          {hasData(brand.expansionLocationData?.currentOutletLocations?.domestic?.locations) && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: colors.dark }}>
                Current Outlets (Domestic)
              </Typography>
              <ExpansionLocationGrid data={brand.expansionLocationData.currentOutletLocations.domestic} />
            </>
          )}
          
      
                    {/* Current Outlets (International) - Only show if data exists */}
          {hasData(brand.expansionLocationData?.currentOutletLocations?.international?.country) && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: colors.dark }}>
                Current Outlets (International)
              </Typography>
              <ExpansionLocationGridInternational data={brand.expansionLocationData.currentOutletLocations.international} />
            </>
          )}
          
          
                  {/* Expansion Locations (Domestic) - Only show if data exists */}
          {hasData(brand.expansionLocationData?.expansionLocations?.domestic?.locations) && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: colors.dark }}>
                Expansion Locations (Domestic)
              </Typography>
              <ExpansionLocationGrid data={brand.expansionLocationData.expansionLocations.domestic} />
            </>
          )}
          
       
                     {/* Expansion Locations (International) - Only show if data exists */}
          {hasData(brand.expansionLocationData?.expansionLocations?.international?.country) && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: colors.dark }}>
                Expansion Locations (International)
              </Typography>
              <ExpansionLocationGridInternational data={brand.expansionLocationData.expansionLocations.international} />
            </>
          )}
        
          
          
          {hasData(brand.uploads?.awards) && (
            <>

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
            </>
          )}

           {/* Business Plan Documentation - New Section */}
          {hasData(brand.uploads?.businessPlan) && (
            <>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Business Plan Documentation
              </Typography>
              <Grid container spacing={2}>
                {brand.uploads.businessPlan.map((doc, idx) => (
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
                        <DescriptionIcon sx={{ 
                          fontSize: 60, 
                          color: colors.primary,
                          mb: 1 
                        }} />
                        <Typography variant="body2" align="center" sx={{ 
                          color: colors.dark,
                          fontWeight: 500,
                          mb: 1
                        }}>
                          {doc.title || "Business Document"}
                        </Typography>
                        <Button 
                          variant="contained" 
                          size="small"
                          color="primary"
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 1 }}
                        >
                          View Document
                        </Button>
                      </Box>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
         

        
           {/* Location Tags - Only show if data exists */}
          {hasData(brand.expansionLocationData?.expansionLocations?.domestic?.locations) && (
            <>
              <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.dark }}>
                Location Tags
              </Typography>
              <ExpansionLocationTags brand={brand}/>
            </>
          )}
          
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
    <Box  ref={overviewRef}>
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