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
  Chip,
  Divider,
  TableHead,
  Collapse,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
  Stack

} from "@mui/material";
import {
  Description as DescriptionIcon,
  Business,
  AccountTree,
  Close,
  CheckCircleOutline,
  KeyboardArrowUp,
  ExpandMore,
  ExpandLess
} from "@mui/icons-material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const OverviewTab = ({ brand, setIsModalOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const overviewRef = useRef(null);
  const [isModalOpen, setIsLocalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [expandedOutlets, setExpandedOutlets] = useState(false);
  const [expandedExpansion, setExpandedExpansion] = useState(false);
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

  // const franchiseModels = [
  //   ...new Set(
  //     brand?.franchiseDetails?.fico?.map((m) => m.franchiseModel) || []
  //   ),
  // ];

  // const franchiseTypes = [
  //   ...new Set(
  //     brand?.franchiseDetails?.fico?.map((m) => m.franchiseType) || []
  //   ),
  // ];

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
        <Accordion
          key={stateIndex}
          expanded={expandedStates[stateIndex] || false}
          onChange={() => toggleState(stateIndex)}
          disableGutters
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`panel-${stateIndex}-content`}
            id={`panel-${stateIndex}-header`}
          >
            <Typography fontWeight={600}>{loc.state || 'Unknown State'}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            {Array.isArray(loc.districts) && loc.districts.map((dist, distIndex) => (
              <Box key={distIndex} sx={{ mb: 1, ml: 1 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  District: {dist.district || 'N/A'}
                </Typography>
                {Array.isArray(dist.cities) && dist.cities.length > 0 && (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Cities: {dist.cities.join(', ')}
                  </Typography>
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {data.locations.length > 2 && (
        <Button
          size="small"
          onClick={() => setShowAll((prev) => !prev)}
          sx={{ mt: 2 }}
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
        <Accordion
          key={index}
          expanded={expandedCountries[index] || false}
          onChange={() => toggleCountry(index)}
          disableGutters
        >
          <AccordionSummary
            expandIcon={<ExpandMore/>}
            aria-controls={`panel-${index}-content`}
            id={`panel-${index}-header`}
          >
            <Typography fontWeight={600}>
              {countryItem.states || 'Unknown Country/State'}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {Array.isArray(countryItem.district) && countryItem.district.map((distItem, distIndex) => (
              <Box key={distIndex} sx={{ mb: 1, ml: 1 }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  District: {distItem.district || 'N/A'}
                </Typography>

                {Array.isArray(distItem.cities) && distItem.cities.length > 0 && (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Cities: {distItem.cities.join(', ')}
                  </Typography>
                )}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {data.country.length > 2 && (
        <Button
          size="small"
          onClick={() => setShowAll((prev) => !prev)}
          sx={{ mt: 2 }}
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
      variant="body2"
      sx={{ mb: 0.5 }}
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
            sx={{ mt: 1 }}
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
      icon: <AccountTree sx={{ color: "#ff9800" }} />,
      content: (
       <Box sx={{ mb: 4 }}>
  <TableContainer
    component={Paper}
    sx={{
      borderRadius: '12px',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
      overflowX: 'auto',
      maxHeight: 'calc(100vh - 300px)',
      '&::-webkit-scrollbar': {
        height: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#ff9800',
        borderRadius: '3px',
      },
    }}
  >
    <Table 
      sx={{ 
        minWidth: 1200,
        position: 'relative',
      }}
      stickyHeader
    >
      <TableHead>
        <TableRow sx={{ 
          '& th': {
            backgroundColor: '#ff9800',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '12px 16px',
            borderBottom: 'none',
            '&:first-of-type': {
              borderTopLeftRadius: '12px',
            },
            '&:last-of-type': {
              borderTopRightRadius: '12px',
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
          <TableRow
            key={index}
            hover
            sx={{
              '&:hover': { 
                backgroundColor: 'rgba(255, 152, 0, 0.08)',
              },
              '&:nth-of-type(even)': {
                backgroundColor: '#fafafa',
              },
              '&.Mui-selected, &.Mui-selected:hover': {
                backgroundColor: 'rgba(255, 152, 0, 0.12)',
              },
            }}
            selected={selectedModel?._id === model._id}
            onClick={() => handleModelSelect(model)}
          >
            <TableCell sx={{ 
              fontWeight: 500,
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
              padding: '12px 16px',
            }}>
              {model.franchiseModel || "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.franchiseType || "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.investmentRange || "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.areaRequired ? `${model.areaRequired} sq.ft` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.agreementPeriod ? `${model.agreementPeriod} yrs` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.franchiseFee ? `₹${Number(model.franchiseFee).toLocaleString('en-IN')}` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.interiorCost ? `₹${Number(model.interiorCost).toLocaleString('en-IN')}` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.stockInvestment ? `₹${Number(model.stockInvestment).toLocaleString('en-IN')}` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.otherCost ? `₹${Number(model.otherCost).toLocaleString('en-IN')}` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.requireWorkingCapital ? `₹${Number(model.requireWorkingCapital).toLocaleString('en-IN')}/yr` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.royaltyFee ? `${model.royaltyFee}%` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.breakEven ? `${model.breakEven} mos` : "N/A"}
            </TableCell>
            <TableCell sx={{ 
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
              padding: '12px 16px',
              color: model.roi ? (parseFloat(model.roi) > 20 ? '#4caf50' : '#ff9800') : 'inherit',
              fontWeight: model.roi ? 600 : 'inherit'
            }}>
              {model.roi ? `${model.roi}%` : "N/A"}
            </TableCell>
            <TableCell sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)', padding: '12px 16px' }}>
              {model.payBackPeriod ? `${model.payBackPeriod} mos` : "N/A"}
            </TableCell>
            <TableCell sx={{ 
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
              padding: '12px 16px',
              color: model.marginOnSales ? (parseFloat(model.marginOnSales) > 30 ? '#4caf50' : '#ff9800') : 'inherit',
              fontWeight: model.marginOnSales ? 600 : 'inherit'
            }}>
              {model.marginOnSales ? `${model.marginOnSales}%` : "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  <Box mt={4} textAlign="center">
    <Button
      variant="contained"
      size="large"
      onClick={() => {
        setIsLocalModalOpen(true);
      }}
      sx={{
        bgcolor: "#ff9800",
        color: "white",
        fontWeight: 600,
        px: 6,
        py: 1.5,
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
        textTransform: 'none',
        fontSize: '1rem',
        '&:hover': {
          bgcolor: "#fb8c00",
          boxShadow: '0 6px 16px rgba(255, 152, 0, 0.4)',
        },
        '&:active': {
          boxShadow: '0 2px 8px rgba(255, 152, 0, 0.4)',
        }
      }}
      startIcon={<DescriptionIcon />}
    >
      Apply for Selected Model
    </Button>
  </Box>
</Box>
      ),
    },
    {
      title: "Brand Overview",
      icon: <Business sx={{ color: "#ff9800" }} />,
      content: (
        <Box> <Grid  display={"flex"} justifyContent={"space-evenly"} spacing={4} sx={{ mt: 2 ,mb: 3}}>
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom display="flex" alignItems="center">
              <Business sx={{ color: '#ff9800', mr: 1 }} /> Brand Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ pl: 1, color: '#555' }}>
              <Typography variant="body2" paragraph>
                <strong>Category:</strong> {[brand.franchiseDetails?.brandCategories?.main, brand.franchiseDetails?.brandCategories?.sub, brand.franchiseDetails?.brandCategories?.child].filter(Boolean).join(" > ") || 'N/A'}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Company Owned Outlets:</strong> {brand.franchiseDetails?.companyOwnedOutlets || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Franchise Owned Outlets:</strong> {brand.franchiseDetails?.franchiseOwnedOutlets || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Total Outlets:</strong> {brand.franchiseDetails?.totalOutlets || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Established Year:</strong> {brand.franchiseDetails?.establishedYear || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Franchising Since:</strong> {brand.franchiseDetails?.franchiseSinceYear || "N/A"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom display="flex" alignItems="center">
              <Business sx={{ color: '#ff9800', mr: 1 }} /> Support & Services
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ pl: 1, color: '#555' }}>
              <Typography variant="body2" paragraph>
                <strong>Consultation/Assistance:</strong> {brand.franchiseDetails?.consultationOrAssistance || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Franchise Development:</strong> {brand.franchiseDetails?.franchiseDevelopment || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Financing Aid:</strong> {brand.franchiseDetails?.aidFinancing || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Training Support:</strong> {brand.franchiseDetails?.trainingSupport?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Unique Selling Points:</strong> {brand.franchiseDetails?.uniqueSellingPoints?.join(", ") || "N/A"}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>International Expansion:</strong> {brand.expansionLocationData?.isInternationalExpansion ? "Yes" : "No"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
            <Typography variant="body1" paragraph>
            <strong>Brand Description:</strong>
            <Box dangerouslySetInnerHTML={{ __html: brand.franchiseDetails.brandDescription }} />
          </Typography>
          <Box sx={{ mt: 2 }}>
  <Typography variant="h6" fontWeight={600} gutterBottom>
    Awards
  </Typography>
{Array.isArray(brand.uploads?.awards) && brand.uploads.awards.length > 0 ? (
                        <Grid container spacing={2}>
                        {brand.uploads.awards.map((award, idx) => (
                          <Grid item xs={12} sm={6} md={4} key={idx}>
                          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2 }}>
                            {award.awardImage && (
                            <img
                              src={award.awardImage}
                              alt={`Award ${idx + 1}`}
                              style={{
                              width: '100%',
                              maxWidth: 180,
                              borderRadius: 8,
                              marginBottom: 8,
                              objectFit: 'cover',
                              background: '#f0f0f0',
                              minHeight: 100,
                              display: award.awardImage ? 'block' : 'none'
                              }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                            )}
                            {!award.awardImage && (
                            <Box
                              sx={{
                              width: 180,
                              height: 100,
                              borderRadius: 2,
                              background: '#f0f0f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 1
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                              No Image
                              </Typography>
                            </Box>
                            )}
                            <Typography variant="body2" align="center">
                            {award.awardDescription || "No Description"}
                            </Typography>
                          </Box>
                          </Grid>
                        ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                        No awards available.
                        </Typography>
                      )}
</Box>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Current Outlets (Domestic)
          </Typography>
          <ExpansionLocationAccordion data={brand.expansionLocationData?.currentOutletLocations?.domestic} />
           <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Current Outlets (International)
          </Typography>
          <ExpansionLocationAccordionInternational data={brand.expansionLocationData?.currentOutletLocations?.international} />
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Expansion Locations (Domestic)
          </Typography>
<ExpansionLocationAccordion data={brand.expansionLocationData?.expansionLocations?.domestic} />   
                  
  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Expansion Locations (International)
          </Typography>
          <ExpansionLocationAccordionInternational data={brand.expansionLocationData?.expansionLocations?.international} />

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Location Tags
          </Typography>
          <Box>
            {/* {Array.isArray(brand.expansionLocationData?.expansionLocations?.domestic?.locations) && 
              brand.expansionLocationData.expansionLocations.domestic.locations.flatMap(loc => 
                Array.isArray(loc.districts) ? 
                  loc.districts.flatMap(dist => 
                    Array.isArray(dist.cities) ? 
                      dist.cities.map(city => (
                        <Chip 
                          key={`${loc.state}-${dist.district}-${city}`}
                          label={`${city}, ${dist.district}, ${loc.state} - ${brand.franchiseDetails?.brandCategories?.main} , ${brand.franchiseDetails?.brandCategories?.sub} ,${brand.franchiseDetails?.brandCategories?.child}`}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      ))
                    : []
                  )
                : []
              )} */}
              <ExpansionLocationTags brand={brand}/>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }} ref={overviewRef}>
      {sections.map((section, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              color: "text.primary",
            }}
          >
            {section.icon}
            {section.title}
          </Typography>
          {section.content}
          <Typography variant="body1" fontWeight={600}   >
            Disclimer : 
            <Typography>Mr Franchise and the site sponsors accept no liability for the accuracy of any information contained on this site or on other linked sites. We recommend you take advice from a lawyer, accountant and franchise consultant experienced in franchising before you commit yourself. It is user’s responsibility to satisfy yourself as to the accuracy and reliability of the information supplied. Please read the terms & conditions on MrFranchise.in</Typography>
          </Typography>
        </Box>
      ))}

      {/* Application Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              <DescriptionIcon sx={{ color: "#ff9800", mr: 1 }} /> Franchise
              Application
            </Typography>
            <IconButton onClick={handleModalClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {submitSuccess ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircleOutline
                sx={{ fontSize: 60, color: "#4caf50", mb: 2 }}
              />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Application Submitted Successfully!
              </Typography>
              <Typography variant="body1">
                We'll contact you soon regarding your franchise application.
              </Typography>
              <Button
                variant="contained"
                onClick={handleModalClose}
                sx={{
                  mt: 2,
                  bgcolor: "#4caf50",
                  borderRadius: "8px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Close
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName || userData?.firstName || ""}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
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
                    size="small"
                    sx={{ mb: 2 }}
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
                    size="small"
                    sx={{ mb: 2 }}
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
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {expansionLocations.map((loc, i) => (
                      <MenuItem key={i} value={loc}>
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
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {investmentRanges.map((range, i) => (
                      <MenuItem key={i} value={range}>
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
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {investmentTimings.map((option, i) => (
                      <MenuItem key={i} value={option}>
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
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {readyToInvestOptions.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "#ff9800",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#fb8c00" },
                      borderRadius: "8px",
                      py: 1.5,
                      fontSize: "1rem",
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Fab
          color="primary"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: '#ff9800',
            '&:hover': {
              bgcolor: '#fb8c00'
            }
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Box>
  );
};

export default OverviewTab;