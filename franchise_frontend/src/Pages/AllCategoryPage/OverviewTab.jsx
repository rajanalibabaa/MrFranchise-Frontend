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
  FiberManualRecord,
} from "@mui/icons-material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { keyframes } from "@emotion/react";

// Color palette
const colors = {
  primary: "#3f51b5",
  secondary: "#ff9800",
  success: "#4caf50",
  error: "#f44336",
  warning: "#ffc107",
  info: "#2196f3",
  dark: "#212121",
  light: "#f5f5f5",
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
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${colors.secondary} 0%, ${colors.warning} 100%)`,
  color: "white",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: "50px",
  boxShadow: "0 4px 15px rgba(255, 152, 0, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(255, 152, 0, 0.6)",
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  position: "relative",
  paddingBottom: "10px",
  marginBottom: "30px",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "60px",
    height: "4px",
    background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
    borderRadius: "2px",
  },
}));

const OverviewTab = ({ brand, setIsModalOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
    const [expandedDistrict, setExpandedDistrict] = useState(
      data?.locations?.[0]?.districts?.length > 0 ? "0-0" : null
    );
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      setExpandedDistrict(
        expandedDistrict === districtKey ? null : districtKey
      );
    };

    return (
      <Box
        sx={{
          mt: 2,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {!hasData ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body1">No locations available</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: isMobile ? "block" : "flex",
              height: isMobile ? "auto" : "400px",
            }}
          >
            {/* Unified scroll container for desktop */}
            <Box
              sx={{
                display: isMobile ? "block" : "flex",
                flex: 1,
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                },
              }}
            >
              {/* States Column */}
              <Box
                sx={{
                  width: isMobile ? "100%" : "300px",
                  minWidth: isMobile ? "100%" : "300px",
                  borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                  bgcolor: "background.paper",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    p: 2,
                    position: "sticky",
                    top: 0,
                    bgcolor: "#7ad03a",
                    zIndex: 2,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Place sx={{ mr: 1, color: "#fff" }} />
                  States
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    maxHeight: "calc(75vh - 200px)",
                    overflowY: "auto",
                  }}
                >
                  {visibleLocations.map((loc, stateIndex) => (
                    <Card
                      key={`state-${stateIndex}`}
                      onClick={() => toggleState(stateIndex)}
                      sx={{
                        mb: 1,
                        cursor: "pointer",
                        borderRadius: "6px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        borderLeft: `4px solid ${
                          expandedState === stateIndex
                            ? theme.palette.primary.main
                            : "transparent"
                        }`,
                        bgcolor:
                          expandedState === stateIndex
                            ? "rgba(25, 118, 210, 0.08)"
                            : "background.paper",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 0.8,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography fontWeight={600}>
                          {loc.state || "Unknown State"}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Box>

              {/* Districts Column */}
              <Box
                sx={{
                  width: isMobile ? "100%" : "300px",
                  minWidth: isMobile ? "100%" : "300px",
                  borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                  bgcolor:
                    expandedState !== null
                      ? "background.paper"
                      : "rgba(0,0,0,0.02)",
                  display: isMobile
                    ? expandedState !== null
                      ? "block"
                      : "none"
                    : "block",
                  transition: "background-color 0.3s ease",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    p: 2,
                    position: "sticky",
                    top: 0,
                    bgcolor: "#7ad03a",
                    zIndex: 2,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Map sx={{ mr: 1, color: "#fff" }} />
                  Districts
                  {isMobile && expandedState !== null && (
                    <IconButton
                      size="small"
                      onClick={() => setExpandedState(null)}
                      sx={{ ml: "auto" }}
                    >
                      <ArrowBack fontSize="small" />
                    </IconButton>
                  )}
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    maxHeight: "calc(75vh - 200px)",
                    overflowY: "auto",
                  }}
                >
                  {expandedState !== null &&
                  Array.isArray(data.locations[expandedState].districts) ? (
                    data.locations[expandedState].districts.length > 0 ? (
                      data.locations[expandedState].districts.map(
                        (dist, distIndex) => {
                          const districtKey = `${expandedState}-${distIndex}`;
                          return (
                            <Card
                              key={`district-${districtKey}`}
                              onClick={() =>
                                toggleDistrict(expandedState, distIndex)
                              }
                              sx={{
                                mb: 1,
                                cursor: "pointer",
                                borderRadius: "6px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                borderLeft: `4px solid ${
                                  expandedDistrict === districtKey
                                    ? theme.palette.secondary.main
                                    : "transparent"
                                }`,
                                bgcolor:
                                  expandedDistrict === districtKey
                                    ? "rgba(255, 152, 0, 0.08)"
                                    : "background.paper",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-1px)",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 0.8,
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {dist.district || "N/A"}
                                </Typography>
                              </Box>
                            </Card>
                          );
                        }
                      )
                    ) : (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          <LocationOff
                            sx={{
                              fontSize: 40,
                              color: "action.disabled",
                              mb: 1,
                            }}
                          />
                          <br />
                          No districts available
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {expandedState === null ? (
                          <>
                            <ArrowBack
                              sx={{
                                fontSize: 40,
                                color: "action.disabled",
                                mb: 1,
                              }}
                            />
                            <br />
                            Select a state
                          </>
                        ) : (
                          "Loading districts..."
                        )}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Cities Column */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor:
                    expandedDistrict !== null
                      ? "background.paper"
                      : "rgba(0,0,0,0.02)",
                  display: isMobile
                    ? expandedDistrict !== null
                      ? "block"
                      : "none"
                    : "block",
                  transition: "background-color 0.3s ease",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    p: 2,
                    position: "sticky",
                    top: 0,
                    bgcolor: "#7ad03a",
                    zIndex: 2,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocationCity sx={{ mr: 1, color: "#fff" }} />
                  Cities
                  {isMobile && expandedDistrict !== null && (
                    <IconButton
                      size="small"
                      onClick={() => setExpandedDistrict(null)}
                      sx={{ ml: "auto" }}
                    >
                      <ArrowBack fontSize="small" />
                    </IconButton>
                  )}
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 1,
                    maxHeight: "calc(75vh - 200px)",
                    overflowY: "auto",
                  }}
                >
                  {expandedDistrict !== null ? (
                    (() => {
                      const [stateIdx, districtIdx] = expandedDistrict
                        .split("-")
                        .map(Number);
                      const cities =
                        data.locations[stateIdx]?.districts[districtIdx]
                          ?.cities;

                      return Array.isArray(cities) && cities.length > 0 ? (
                        cities.map((city, cityIndex) => (
                          <Card
                            key={`city-${cityIndex}`}
                            sx={{
                              borderRadius: "6px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              bgcolor: "background.paper",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                p: 0.8,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <FiberManualRecord
                                sx={{
                                  fontSize: 8,
                                  color: "primary.main",
                                  mr: 1,
                                }}
                              />
                              <Typography variant="body2">{city}</Typography>
                            </Box>
                          </Card>
                        ))
                      ) : (
                        <Box sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            <LocationOff
                              sx={{
                                fontSize: 40,
                                color: "action.disabled",
                                mb: 1,
                              }}
                            />
                            <br />
                            No cities available
                          </Typography>
                        </Box>
                      );
                    })()
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {expandedState === null ? (
                          <>
                            <ArrowBack
                              sx={{
                                fontSize: 40,
                                color: "action.disabled",
                                mb: 1,
                              }}
                            />
                            <br />
                            Select a district
                          </>
                        ) : (
                          "Select a district to view cities"
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
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      setExpandedDistrict(
        expandedDistrict === districtKey ? null : districtKey
      );
    };

    return (
      <Box
        sx={{
          mt: 2,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {!hasData ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body1">
              No international locations available
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: isMobile ? "block" : "flex",
              height: isMobile ? "auto" : "400px",
              overflow: isMobile ? "visible" : "hidden",
            }}
          >
            {/* Unified scroll container */}
            <Box
              sx={{
                display: isMobile ? "block" : "flex",
                flex: 1,
                overflow: isMobile ? "visible" : "auto",
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                },
              }}
            >
              {/* Countries Column */}
              <Box
                sx={{
                  width: isMobile ? "100%" : "300px",
                  minWidth: isMobile ? "100%" : "300px",
                  borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                  bgcolor: "background.paper",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    p: 2,
                    position: "sticky",
                    top: 0,
                    bgcolor: "#7ad03a",
                    zIndex: 2,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Public sx={{ mr: 1, color: "primary.main" }} />
                  Countries
                </Typography>
                <Box sx={{ p: 1 }}>
                  {visibleCountries.map((countryItem, countryIndex) => (
                    <Card
                      key={`country-${countryIndex}`}
                      onClick={() => toggleCountry(countryIndex)}
                      sx={{
                        mb: 1,
                        cursor: "pointer",
                        borderRadius: "6px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        borderLeft: `4px solid ${
                          expandedCountry === countryIndex
                            ? theme.palette.primary.main
                            : "transparent"
                        }`,
                        bgcolor:
                          expandedCountry === countryIndex
                            ? "rgba(25, 118, 210, 0.08)"
                            : "background.paper",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          py: 1.5,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography fontWeight={600}>
                            {countryItem.states || "Unknown Country"}
                          </Typography>
                          {countryItem.region && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {countryItem.region}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          label={countryItem.district?.length || 0}
                          size="small"
                          color={
                            expandedCountry === countryIndex
                              ? "primary"
                              : "default"
                          }
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>

              {/* Districts Column */}
              <Box
                sx={{
                  width: isMobile ? "100%" : "300px",
                  minWidth: isMobile ? "100%" : "300px",
                  borderRight: isMobile ? "none" : "1px solid #e0e0e0",
                  bgcolor:
                    expandedCountry !== null
                      ? "background.paper"
                      : "rgba(0,0,0,0.02)",
                  display: isMobile
                    ? expandedCountry !== null
                      ? "block"
                      : "none"
                    : "block",
                  transition: "background-color 0.3s ease",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    p: 2,
                    position: "sticky",
                    top: 0,
                    bgcolor: "#7ad03a",
                    zIndex: 2,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Map sx={{ mr: 1, color: "primary.main" }} />
                  Districts/States
                  {isMobile && expandedCountry !== null && (
                    <IconButton
                      size="small"
                      onClick={() => setExpandedCountry(null)}
                      sx={{ ml: "auto" }}
                    >
                      <ArrowBack fontSize="small" />
                    </IconButton>
                  )}
                </Typography>
                <Box sx={{ p: 1 }}>
                  {expandedCountry !== null &&
                  Array.isArray(data.country[expandedCountry].district) ? (
                    data.country[expandedCountry].district.length > 0 ? (
                      data.country[expandedCountry].district.map(
                        (distItem, distIndex) => {
                          const districtKey = `${expandedCountry}-${distIndex}`;
                          return (
                            <Card
                              key={`district-${districtKey}`}
                              onClick={() =>
                                toggleDistrict(expandedCountry, distIndex)
                              }
                              sx={{
                                mb: 1,
                                cursor: "pointer",
                                borderRadius: "6px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                borderLeft: `4px solid ${
                                  expandedDistrict === districtKey
                                    ? theme.palette.secondary.main
                                    : "transparent"
                                }`,
                                bgcolor:
                                  expandedDistrict === districtKey
                                    ? "rgba(255, 152, 0, 0.08)"
                                    : "background.paper",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-1px)",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              <CardContent
                                sx={{
                                  py: 1.5,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {distItem.district || "N/A"}
                                </Typography>
                                <Chip
                                  label={distItem.cities?.length || 0}
                                  size="small"
                                  color={
                                    expandedDistrict === districtKey
                                      ? "secondary"
                                      : "default"
                                  }
                                />
                              </CardContent>
                            </Card>
                          );
                        }
                      )
                    ) : (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          <LocationOff
                            sx={{
                              fontSize: 40,
                              color: "action.disabled",
                              mb: 1,
                            }}
                          />
                          <br />
                          No districts/states available
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {expandedCountry === null ? (
                          <>
                            <ArrowBack
                              sx={{
                                fontSize: 40,
                                color: "action.disabled",
                                mb: 1,
                              }}
                            />
                            <br />
                            Select a country
                          </>
                        ) : (
                          "Loading districts..."
                        )}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Cities Column */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor:
                    expandedDistrict !== null
                      ? "background.paper"
                      : "rgba(0,0,0,0.02)",
                  display: isMobile
                    ? expandedDistrict !== null
                      ? "block"
                      : "none"
                    : "block",
                  transition: "background-color 0.3s ease",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    p: 2,
                    position: "sticky",
                    top: 0,
                    bgcolor: "#7ad03a",
                    zIndex: 2,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocationCity sx={{ mr: 1, color: "primary.main" }} />
                  Cities
                  {isMobile && expandedDistrict !== null && (
                    <IconButton
                      size="small"
                      onClick={() => setExpandedDistrict(null)}
                      sx={{ ml: "auto" }}
                    >
                      <ArrowBack fontSize="small" />
                    </IconButton>
                  )}
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 1,
                  }}
                >
                  {expandedDistrict !== null ? (
                    (() => {
                      const [countryIdx, districtIdx] = expandedDistrict
                        .split("-")
                        .map(Number);
                      const cities =
                        data.country[countryIdx]?.district[districtIdx]?.cities;

                      return Array.isArray(cities) && cities.length > 0 ? (
                        cities.map((city, cityIndex) => (
                          <Card
                            key={`city-${cityIndex}`}
                            sx={{
                              borderRadius: "6px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              bgcolor: "background.paper",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                              },
                            }}
                          >
                            <CardContent
                              sx={{
                                py: 1.5,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <FiberManualRecord
                                sx={{
                                  fontSize: 8,
                                  color: "primary.main",
                                  mr: 1,
                                }}
                              />
                              <Typography variant="body2">{city}</Typography>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Box sx={{ p: 2, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            <LocationOff
                              sx={{
                                fontSize: 40,
                                color: "action.disabled",
                                mb: 1,
                              }}
                            />
                            <br />
                            No cities available
                          </Typography>
                        </Box>
                      );
                    })()
                  ) : (
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {expandedCountry === null ? (
                          <>
                            <ArrowBack
                              sx={{
                                fontSize: 40,
                                color: "action.disabled",
                                mb: 1,
                              }}
                            />
                            <br />
                            Select a district
                          </>
                        ) : (
                          "Select a district to view cities"
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
    const locations = Array.isArray(
      brand.expansionLocationData?.expansionLocations?.domestic?.locations
    )
      ? brand.expansionLocationData.expansionLocations.domestic.locations.flatMap(
          (loc) =>
            Array.isArray(loc.districts)
              ? loc.districts.flatMap((dist) =>
                  Array.isArray(dist.cities)
                    ? dist.cities.map((city) => ({
                        city,
                        district: dist.district,
                        state: loc.state,
                      }))
                    : []
                )
              : []
        )
      : [];

    const category = brand.franchiseDetails?.brandCategories || {};
    const formattedChipsState = locations.map((loc, index) => ({
      key: `${loc.state}-${index}`,
      label: ` ${category.child || ""} franchise in-${loc.state}`,
    }));
    const formattedChipsDistrict = locations.map((loc, index) => ({
      key: `${loc.district}-${index}`,
      label: ` ${category.child || ""} franchise in-${loc.district}`,
    }));
    const formattedChipsCity = locations.map((loc, index) => ({
      key: `${loc.city}-${index}`,
      label: ` ${category.child || ""} franchise in-${loc.city}`,
    }));
 
    return (
      <Box
  sx={{
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    p: 2,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",  // 👉 Creates 3 equal columns
    gap: 2,
    height: "90px",
    overflowY: "auto",
  }}
>
  {/* State Column */}
  <Box>
    {formattedChipsState.length > 0 ? (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {formattedChipsState.map((chip) => (
          <Typography
            key={chip.key}
            variant="caption"
            sx={{
              borderRadius: "4px",
              color: colors.dark,
              whiteSpace: "nowrap",
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
          color: "text.secondary",
          textAlign: "center",
          mt: 2,
        }}
      >
        No locations available
      </Typography>
    )}
  </Box>

  {/* District Column */}
  <Box>
    {formattedChipsDistrict.length > 0 ? (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {formattedChipsDistrict.map((chip) => (
          <Typography
            key={chip.key}
            variant="caption"
            sx={{
              borderRadius: "4px",
              color: colors.dark,
              whiteSpace: "nowrap",
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
          color: "text.secondary",
          textAlign: "center",
          mt: 2,
        }}
      >
        No locations available
      </Typography>
    )}
  </Box>

  {/* City Column */}
  <Box>
    {formattedChipsCity.length > 0 ? (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {formattedChipsCity.map((chip) => (
          <Typography
            key={chip.key}
            variant="caption"
            sx={{
              borderRadius: "4px",
              color: colors.dark,
              whiteSpace: "nowrap",
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
          color: "text.secondary",
          textAlign: "center",
          mt: 2,
        }}
      >
        No locations available
      </Typography>
    )}
  </Box>
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
          {hasData(brand.franchiseDetails?.fico) && (
            <>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 2, color: "#7ad03a" }}
              >
                Franchise Details
              </Typography>
              <Box sx={{ mb: 4 }}>
                <TableContainer
                  sx={{
                    borderRadius: "16px",
                    overflowX: "auto",
                    maxHeight: "calc(100vh - 300px)",
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{
                      width: 2300,
                      tableLayout: "fixed", // this makes columns distribute evenly
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        {[
                          "Model",
                          "Type",
                          "Investment",
                          "Area",
                          "Agreement",
                          "Franchise Fee",
                          "Interior Cost",
                          "Stock",
                          "Other Costs",
                          "Working Capital",
                          "Royalty Fee",
                          "Break Even",
                          "ROI",
                          "Payback",
                          "Margin",
                        ].map((header, i) => (
                          <TableCell
                            key={i}
                            align="center"
                            sx={{
                              backgroundColor: "#7ad03a",
                              color: "black",
                              fontWeight: 700,
                              padding: "12px 16px",
                              borderBottom: "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {brand.franchiseDetails?.fico?.map((model, index) => (
                        <Fade in={true} key={index} timeout={index * 100}>
                          <TableRow
                            hover
                            selected={selectedModel?._id === model._id}
                            onClick={() => handleModelSelect(model)}
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            {[
                              model.franchiseModel,
                              model.franchiseType,
                              model.investmentRange,
                              model.areaRequired,
                              model.agreementPeriod
                                ? `${model.agreementPeriod} yrs`
                                : "N/A",
                              model.franchiseFee
                                ? `₹${Number(model.franchiseFee).toLocaleString(
                                    "en-IN"
                                  )}`
                                : "N/A",
                              model.interiorCost
                                ? `₹${Number(model.interiorCost).toLocaleString(
                                    "en-IN"
                                  )}`
                                : "N/A",
                              model.stockInvestment
                                ? `₹${Number(
                                    model.stockInvestment
                                  ).toLocaleString("en-IN")}`
                                : "N/A",
                              model.otherCost
                                ? `₹${Number(model.otherCost).toLocaleString(
                                    "en-IN"
                                  )}`
                                : "N/A",
                              model.requireWorkingCapital
                                ? `₹${Number(
                                    model.requireWorkingCapital
                                  ).toLocaleString("en-IN")}`
                                : "N/A",
                              model.royaltyFee,
                              model.breakEven,
                              model.roi ? `${model.roi}%` : "N/A",
                              model.payBackPeriod,
                              model.marginOnSales
                                ? `${model.marginOnSales}%`
                                : "N/A",
                            ].map((value, j) => (
                              <TableCell
                                key={j}
                                align="center"
                                sx={{
                                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                                  padding: "25px 16px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  fontWeight:
                                    (j === 12 && model.roi) ||
                                    (j === 14 && model.marginOnSales)
                                      ? 700
                                      : "inherit",
                                  color:
                                    j === 12 && parseFloat(model.roi) > 20
                                      ? "success.main"
                                      : j === 14 &&
                                        parseFloat(model.marginOnSales) > 30
                                      ? "success.main"
                                      : "inherit",
                                }}
                              >
                                {value || "N/A"}
                              </TableCell>
                            ))}
                          </TableRow>
                        </Fade>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </>
          )}

          {/* Brand Description - Only show if data exists */}
          {brand.franchiseDetails?.brandDescription && (
            <Box
              sx={{
                mb: 4,
                p: 3,
                borderRadius: "16px",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 2, color: "#7ad03a" }}
              >
                Brand Description
              </Typography>
              <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.1)" }} />
              <Box
                dangerouslySetInnerHTML={{
                  __html: brand.franchiseDetails.brandDescription,
                }}
                sx={{
                  color: colors.dark,
                  "& p": { mb: 2 },
                  "& strong": { color: colors.primary },
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
                  <AnimatedCard
                    sx={{
                      borderRadius: "16px",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                        display="flex"
                        alignItems="center"
                        color="#7ad03a"
                      >
                        <Business sx={{ color: colors.secondary, mr: 1 }} />{" "}
                        Support Provided By Brand
                      </Typography>
                      <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.1)" }} />
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "180px auto",
                          rowGap: 1,
                          columnGap: 2,
                          pl: 1,
                        }}
                      >
                        {hasData(brand.franchiseDetails?.trainingSupport) && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.dark, fontWeight: 600 }}
                            >
                              Training Support:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.dark }}
                            >
                              {brand.franchiseDetails.trainingSupport
                                .map((item) => `✅ ${item}`)
                                .join(", ")}
                            </Typography>
                          </>
                        )}

                        {brand.franchiseDetails?.aidFinancing && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.dark, fontWeight: 600 }}
                            >
                              Financing Aid:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.dark }}
                            >
                              {brand.franchiseDetails.aidFinancing}
                            </Typography>
                          </>
                        )}

                        {hasData(
                          brand.franchiseDetails?.uniqueSellingPoints
                        ) && (
                          <>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.dark, fontWeight: 600 }}
                            >
                              Unique Selling Points:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: colors.dark }}
                            >
                              {brand.franchiseDetails.uniqueSellingPoints.join(
                                ", "
                              )}
                            </Typography>
                          </>
                        )}

                        <Typography
                          variant="body2"
                          sx={{ color: colors.dark, fontWeight: 600 }}
                        >
                          International Expansion:
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.dark }}>
                          {brand.expansionLocationData?.isInternationalExpansion
                            ? "Yes"
                            : "No"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </AnimatedCard>
                </Zoom>
              </Grid>
            </Grid>
          )}

          {/* Current Outlets (Domestic) - Only show if data exists */}
          {hasData(
            brand.expansionLocationData?.currentOutletLocations?.domestic
              ?.locations
          ) && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}
              >
                Current Outlets (Domestic)
              </Typography>
              <ExpansionLocationGrid
                data={
                  brand.expansionLocationData.currentOutletLocations.domestic
                }
              />
            </>
          )}

          {/* Current Outlets (International) - Only show if data exists */}
          {hasData(
            brand.expansionLocationData?.currentOutletLocations?.international
              ?.country
          ) && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}
              >
                Current Outlets (International)
              </Typography>
              <ExpansionLocationGridInternational
                data={
                  brand.expansionLocationData.currentOutletLocations
                    .international
                }
              />
            </>
          )}

          {/* Expansion Locations (Domestic) - Only show if data exists */}
          {hasData(
            brand.expansionLocationData?.expansionLocations?.domestic?.locations
          ) && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}
              >
                Expansion Locations (Domestic)
              </Typography>
              <ExpansionLocationGrid
                data={brand.expansionLocationData.expansionLocations.domestic}
              />
            </>
          )}

          {/* Expansion Locations (International) - Only show if data exists */}
          {hasData(
            brand.expansionLocationData?.expansionLocations?.international
              ?.country
          ) && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}
              >
                Expansion Locations (International)
              </Typography>
              <ExpansionLocationGridInternational
                data={
                  brand.expansionLocationData.expansionLocations.international
                }
              />
            </>
          )}

          {hasData(brand.uploads?.awards) && (
            <>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 4, color: "#7ad03a" }}
              >
                Awards
              </Typography>
              {Array.isArray(brand.uploads?.awards) &&
              brand.uploads.awards.length > 0 ? (
                <Grid container spacing={2}>
                  {brand.uploads.awards.map((award, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Slide direction="up" in={true} timeout={idx * 200}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 2,
                            p: 2,
                            borderRadius: "12px",
                            background: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          {award.awardImage && (
                            <img
                              src={award.awardImage}
                              alt={`Award ${idx + 1}`}
                              style={{
                                width: "100%",
                                maxWidth: 180,
                                height: 120,
                                borderRadius: 8,
                                marginBottom: 12,
                                objectFit: "cover",
                                background: "#f0f0f0",
                                display: award.awardImage ? "block" : "none",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          {!award.awardImage && (
                            <Box
                              sx={{
                                width: "100%",
                                maxWidth: 180,
                                height: 120,
                                borderRadius: 2,
                                background: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                No Image
                              </Typography>
                            </Box>
                          )}
                          <Typography
                            variant="body2"
                            align="center"
                            sx={{ color: colors.dark }}
                          >
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
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 4, color: "#7ad03a" }}
              >
                Business Plan Documentation
              </Typography>
              <Grid container spacing={2}>
                {brand.uploads.businessPlan.map((doc, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Slide direction="up" in={true} timeout={idx * 200}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mb: 2,
                          p: 2,
                          borderRadius: "12px",
                          background: "white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <DescriptionIcon
                          sx={{
                            fontSize: 60,
                            color: colors.primary,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{
                            color: colors.dark,
                            fontWeight: 500,
                            mb: 1,
                          }}
                        >
                          {doc.title || "Business Document"}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#ff9800",
                            color: "white",
                            mt: 1,
                          }}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
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

          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: "12px",
              bgcolor: "rgba(244, 67, 54, 0.05)",
              // borderLeft: `4px solid ${colors.error}`
            }}
          >
            <Typography variant="body1" fontWeight={700} color={colors.error}>
              Disclaimer:
            </Typography>
            <Typography variant="caption" color={colors.dark}>
              Mr Franchise and the site sponsors accept no liability for the
              accuracy of any information contained on this site or on other
              linked sites. We recommend you take advice from a lawyer,
              accountant and franchise consultant experienced in franchising
              before you commit yourself. It is user's responsibility to satisfy
              yourself as to the accuracy and reliability of the information
              supplied. Please read the terms & conditions on MrFranchise.in
            </Typography>
          </Box>
          {/* Location Tags - Only show if data exists */}
          {hasData(
            brand.expansionLocationData?.expansionLocations?.domestic?.locations
          ) && (
            <>
              <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.1)" }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 2, color: colors.dark }}
              >
                Location Tags
              </Typography>
              <ExpansionLocationTags brand={brand} />
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box ref={overviewRef}>
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
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "rgba(255, 152, 0, 0.1)",
                animation: `${float} 4s ease-in-out infinite`,
              }}
            >
              {section.icon}
            </Box>
            <Typography variant="h5" fontWeight={700} color="#ff9800">
              {section.title}
            </Typography>
          </SectionHeader>
          {section.content}
        </Box>
      ))}

      {/* Back to Top Button
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
      )} */}
    </Box>
  );
};

export default OverviewTab;
