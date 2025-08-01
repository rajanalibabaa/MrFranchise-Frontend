// import React, { useState, useRef, lazy, Suspense } from "react";
// import { Box, CircularProgress } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";

// // Lazy-loaded components
// const FranchiseDetailsTable = lazy(() => import("./OverViewBrandDetailsPage/FranchiseDetailsTableOverPage"));
// const BrandDescriptionSection = lazy(() => import("./OverViewBrandDetailsPage/BrandDescriptionSectionOverviewtab"));
// const SupportSection = lazy(() => import("./OverViewBrandDetailsPage/SupportSectionOverviewtab"));
// const LocationSections = lazy(() => import("./OverViewBrandDetailsPage/LocationHandlingOverviewtab"));
// const AwardsSection = lazy(() => import("./OverViewBrandDetailsPage/AwardsSectionOverviewtab"));
// const BusinessPlanSection = lazy(() => import("./OverViewBrandDetailsPage/BusinessPlanSectionOverViewtab"));
// const DisclaimerSection = lazy(() => import("./OverViewBrandDetailsPage/DisclaimerSectionOverviewtab"));

// const OverviewTab = ({ brand }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const overviewRef = useRef(null);
//   const [loadedSections, setLoadedSections] = useState({
//     franchiseDetails: false,
//     description: false,
//     support: false,
//     locations: false,
//     awards: false,
//     businessPlan: false
//   });

//   // Check if sections have data
//   const hasFranchiseDetails = !!brand.franchiseDetails?.fico;
//   const hasDescription = !!brand.franchiseDetails?.brandDescription;
//   const hasSupport = !!brand.franchiseDetails?.trainingSupport || !!brand.franchiseDetails?.aidFinancing;
//   const hasLocations = !!brand.expansionLocationData;
//   const hasAwards = !!brand.uploads?.awards;
//   const hasBusinessPlan = !!brand.uploads?.businessPlan;

//   // Loading placeholder
//   const LoadingPlaceholder = () => (
//     <Box sx={{ 
//       display: 'flex', 
//       justifyContent: 'center', 
//       alignItems: 'center', 
//       height: 200,
//       width: '100%'
//     }}>
//       <CircularProgress />
//     </Box>
//   );

//   return (
//     <Box ref={overviewRef} sx={{ overflow: 'hidden' }}>
//       {/* Franchise Details Table */}
//       {hasFranchiseDetails && (
//         <Suspense fallback={<LoadingPlaceholder />}>
//           <FranchiseDetailsTable 
//             data={brand.franchiseDetails.fico} 
//             isMobile={isMobile}
//             onLoad={() => setLoadedSections(prev => ({ ...prev, franchiseDetails: true }))}
//           />
//         </Suspense>
//       )}

//       {/* Brand Description */}
//       {hasDescription && (
//         <Suspense fallback={<LoadingPlaceholder />}>
//           <BrandDescriptionSection 
//             description={brand.franchiseDetails.brandDescription}
//             usp={brand.franchiseDetails.uniqueSellingPoints}
//             onLoad={() => setLoadedSections(prev => ({ ...prev, description: true }))}
//           />
//         </Suspense>
//       )}

//       {/* Support Section */}
//       {hasSupport && (
//         <Suspense fallback={<LoadingPlaceholder />}>
//           <SupportSection 
//             trainingSupport={brand.franchiseDetails.trainingSupport}
//             aidFinancing={brand.franchiseDetails.aidFinancing}
//             isInternational={brand.expansionLocationData?.isInternationalExpansion}
//             onLoad={() => setLoadedSections(prev => ({ ...prev, support: true }))}
//           />
//         </Suspense>
//       )}

//       {/* Location Sections */}
//       {hasLocations && (
//         <Suspense fallback={<LoadingPlaceholder />}>
//           <LocationSections 
//             expansionLocationData={brand.expansionLocationData}
//             onLoad={() => setLoadedSections(prev => ({ ...prev, locations: true }))}
//           />
//         </Suspense>
//       )}

//       {/* Awards Section - Only render if has data */}
//       {hasAwards && brand.uploads.awards.length > 0 && (
//         <Suspense fallback={<LoadingPlaceholder />}>
//           <AwardsSection 
//             awards={brand.uploads.awards}
//             onLoad={() => setLoadedSections(prev => ({ ...prev, awards: true }))}
//           />
//         </Suspense>
//       )}

//       {/* Business Plan Section - Only render if has data */}
//       {hasBusinessPlan && brand.uploads.businessPlan.length > 0 && (
//         <Suspense fallback={<LoadingPlaceholder />}>
//           <BusinessPlanSection 
//             documents={brand.uploads.businessPlan}
//             onLoad={() => setLoadedSections(prev => ({ ...prev, businessPlan: true }))}
//           />
//         </Suspense>
//       )}

//       {/* Disclaimer - Always render */}
//       <Suspense fallback={null}>
//         <DisclaimerSection isMobile={isMobile} />
//       </Suspense>
//     </Box>
//   );
// };

// export default React.memo(OverviewTab);


// import React, {
//   useState,
//   useEffect,
//   useRef,
//   lazy,
// } from "react";
// import {
//   Box,
//   Typography,
//   TableContainer,
//   Table,
//   TableBody,
//   TableRow,
//   TableCell,
//   Button,
//   IconButton,
//   Grid,
//   Divider,
//   TableHead,
//   Card,
//   CardContent,
//   Fade,
//   Slide,
//   Zoom,
//   styled,
//   Chip,
// } from "@mui/material";

// const DescriptionIcon = lazy(() => import("@mui/icons-material/Description"));
// const Business = lazy(() => import("@mui/icons-material/Business"));
// const ArrowBack = lazy(() => import("@mui/icons-material/ArrowBack"));
// const Place = lazy(() => import("@mui/icons-material/Place"));
// const LocationCity = lazy(() => import("@mui/icons-material/LocationCity"));
// const LocationOff = lazy(() => import("@mui/icons-material/LocationOff"));
// const Map = lazy(() => import("@mui/icons-material/Map"));
// const FiberManualRecord = lazy(() =>
//   import("@mui/icons-material/FiberManualRecord")
// );
// const Public = lazy(() => import("@mui/icons-material/Public"));

// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { keyframes } from "@emotion/react";
// import LeaderboardAd from "../../services/AdvertiseAds/LeaderBoardsAds";

// // Color palette
// const colors = {
//   primary: "#3f51b5",
//   secondary: "#ff9800",
//   success: "#4caf50",
//   error: "#f44336",
//   warning: "#ffc107",
//   info: "#2196f3",
//   dark: "#212121",
//   light: "#f5f5f5",
// };

// const float = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
//   100% { transform: translateY(0px); }
// `;

// // Styled components
// const AnimatedCard = styled(Card)(({ theme }) => ({
//   transition: "all 0.3s ease",
//   "&:hover": {
//     transform: "translateY(-5px)",
//     boxShadow: theme.shadows[10],
//   },
// }));

// const SectionHeader = styled(Typography)({
//   position: "relative",
//   paddingBottom: "10px",
//   marginBottom: "30px",
//   "&:after": {
//     content: '""',
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     width: "60px",
//     height: "4px",
//     background: `linear-gradient(90deg, ${colors.secondary}, ${colors.primary})`,
//     borderRadius: "2px",
//   },
// });

// const OverviewTab = ({ brand }) => {

//   console.log("OverviewTab brand:", brand);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const overviewRef = useRef(null);
//   const containerRef = useRef(null);
//   const [selectedModel, setSelectedModel] = useState(null);
// const [hasHoveredOnce, setHasHoveredOnce] = useState(false);
//   const [isUserScrolling, setIsUserScrolling] = useState(false);

//   useEffect(() => {
//     if (!isMobile || !containerRef.current) return;

//     let scrollInterval;
//     const container = containerRef.current;

//     const startAutoScroll = () => {
//       if (scrollInterval) clearInterval(scrollInterval);
//       scrollInterval = setInterval(() => {
//         if (!container) return;
//         container.scrollLeft += 1;
//          if (container.scrollLeft >= container.scrollWidth / 2) {
//           container.scrollLeft = 0;
//         }
//       }, 10);
//     };

//     if (!isUserScrolling) startAutoScroll();
//     return () => {
//       if (scrollInterval) {
//         clearInterval(scrollInterval);
//       }
//     };
//   }, [isMobile, isUserScrolling]);


//   const handleMouseEnter = () => {
//   if (!hasHoveredOnce) {
//     setHasHoveredOnce(true);
//     startScroll(); 
//   }
// };


//   const handleUserScrollStart = () => {
//     setIsUserScrolling(true);
//   };



//   const handleUserScrollEnd = () => {
//     // restart auto-scroll after short delay
// stopScroll();
//   };

//   const formatCurrency = (value) => {
//   const number = Number(value);
//   return isNaN(number) ? "N/A" : `₹${number.toLocaleString("en-IN")}`;
// };

// const ficoDetails = brand?.[0]?.brandfranchisedetails?.franchiseDetails?.fico || [];
// console.log("ficoDetails",ficoDetails)
// const tableRows = ficoDetails.map((model, index) => (
//   <Fade in={true} key={model._id || index} timeout={index * 100}>
//     <TableRow
//       hover
//       selected={selectedModel?._id && model._id && selectedModel._id === model._id}
//       sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
//     >
//       {[
//         model.franchiseModel,
//         model.franchiseType,
//         model.investmentRange,
//         model.areaRequired,
//         model.agreementPeriod ? `${model.agreementPeriod} yrs` : "N/A",
//         model.franchiseFee ? formatCurrency(model.franchiseFee) : "N/A",
//         model.interiorCost ? formatCurrency(model.interiorCost) : "N/A",
//         model.stockInvestment ? formatCurrency(model.stockInvestment) : "N/A",
//         model.otherCost ? formatCurrency(model.otherCost) : "N/A",
//         model.requireWorkingCapital ? formatCurrency(model.requireWorkingCapital) : "N/A",
//         model.royaltyFee,
//         model.breakEven,
//         model.roi ? `${model.roi}%` : "N/A",
//         model.payBackPeriod,
//         model.marginOnSales ? `${model.marginOnSales}%` : "N/A",
//       ].map((value, j) => (
//         <TableCell
//           key={j}
//           align="center"
//           sx={{
//             borderBottom: "1px solid rgba(0,0,0,0.05)",
//             padding: "25px 16px",
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             fontWeight:
//               (j === 12 && model.roi) || (j === 14 && model.marginOnSales)
//                 ? 700
//                 : "inherit",
//             color:
//               j === 12 && parseFloat(model.roi) > 20
//                 ? "success.main"
//                 : j === 14 && parseFloat(model.marginOnSales) > 30
//                 ? "success.main"
//                 : "inherit",
//           }}
//         >
//           {value || "N/A"}
//         </TableCell>
//       ))}
//     </TableRow>
//   </Fade>
// ));

//  const ExpansionLocationGrid = ({ data }) => {
//     const [expandedState, setExpandedState] = useState(0);
//     const [expandedDistrict, setExpandedDistrict] = useState(
//       data?.locations?.[0]?.districts?.length > 0 ? "0-0" : null
//     );
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//     if (!data || !Array.isArray(data.locations)) return null;

//     const visibleLocations = data.locations;
//     const hasData = data.locations.length > 0;

//     const toggleState = (stateIndex) => {
//       if (expandedState === stateIndex) {
//         setExpandedState(null);
//         setExpandedDistrict(null);
//       } else {
//         setExpandedState(stateIndex);
//         setExpandedDistrict(null);
//       }
//     };

//     const toggleDistrict = (stateIndex, distIndex) => {
//       const districtKey = `${stateIndex}-${distIndex}`;
//       setExpandedDistrict(
//         expandedDistrict === districtKey ? null : districtKey
//       );
//     };

//     // Function to render items with fallback to parent name
//     const renderItemsWithFallback = (items, parentName) => {
//       if (Array.isArray(items) && items.length > 0) {
//         return items;
//       }
//       return [parentName]; // Return parent name as single item if no items exist
//     };

//     return (
//       <Box
//         sx={{
//           mt: 2,
//           border: "1px solid #e0e0e0",
//           borderRadius: "8px",
//           overflow: "hidden",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         {!hasData ? (
//           <Box
//             sx={{
//               p: 3,
//               textAlign: "center",
//               color: "text.secondary",
//             }}
//           >
//             <Typography variant="body1">No locations available</Typography>
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               display: isMobile ? "block" : "flex",
//               height: isMobile ? "auto" : "400px",
//             }}
//           >
//             {/* Unified scroll container for desktop */}
//             <Box
//               sx={{
//                 display: isMobile ? "block" : "flex",
//                 flex: 1,
//                 "&::-webkit-scrollbar": {
//                   height: "8px",
//                 },
//                 "&::-webkit-scrollbar-thumb": {
//                   backgroundColor: "rgba(0,0,0,0.2)",
//                   borderRadius: "4px",
//                 },
//               }}
//             >
//               {/* States Column */}
//               <Box
//                 sx={{
//                   width: isMobile ? "100%" : "300px",
//                   minWidth: isMobile ? "100%" : "300px",
//                   borderRight: isMobile ? "none" : "1px solid #e0e0e0",
//                   bgcolor: "background.paper",
//                 }}
//               >
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     p: 2,
//                     position: "sticky",
//                     top: 0,
//                     bgcolor: "#7ad03a",
//                     zIndex: 2,
//                     borderBottom: "1px solid #e0e0e0",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Place sx={{ mr: 1, color: "#fff" }} />
//                   States
//                 </Typography>
//                 <Box
//                   sx={{
//                     p: 1,
//                     maxHeight: "calc(75vh - 200px)",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {renderItemsWithFallback(visibleLocations, "Country").map((loc, stateIndex) => (
//                     <Card
//                       key={`state-${stateIndex}`}
//                       onClick={() => toggleState(stateIndex)}
//                       sx={{
//                         mb: 1,
//                         cursor: "pointer",
//                         borderRadius: "6px",
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                         borderLeft: `4px solid ${
//                           expandedState === stateIndex
//                             ? theme.palette.primary.main
//                             : "transparent"
//                         }`,
//                         bgcolor:
//                           expandedState === stateIndex
//                             ? "rgba(25, 118, 210, 0.08)"
//                             : "background.paper",
//                         transition: "all 0.2s ease",
//                         "&:hover": {
//                           transform: "translateY(-1px)",
//                           boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
//                         },
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           p: 0.8,
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Typography fontWeight={600}>
//                           {typeof loc === 'string' ? loc : (loc.state || "Unknown State")}
//                         </Typography>
//                       </Box>
//                     </Card>
//                   ))}
//                 </Box>
//               </Box>

//               {/* Districts Column */}
//               <Box
//                 sx={{
//                   width: isMobile ? "100%" : "300px",
//                   minWidth: isMobile ? "100%" : "300px",
//                   borderRight: isMobile ? "none" : "1px solid #e0e0e0",
//                   bgcolor:
//                     expandedState !== null
//                       ? "background.paper"
//                       : "rgba(0,0,0,0.02)",
//                   display: isMobile
//                     ? expandedState !== null
//                       ? "block"
//                       : "none"
//                     : "block",
//                   transition: "background-color 0.3s ease",
//                 }}
//               >
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     p: 2,
//                     position: "sticky",
//                     top: 0,
//                     bgcolor: "#7ad03a",
//                     zIndex: 2,
//                     borderBottom: "1px solid #e0e0e0",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Map sx={{ mr: 1, color: "#fff" }} />
//                   Districts
//                   {isMobile && expandedState !== null && (
//                     <IconButton
//                       size="small"
//                       onClick={() => setExpandedState(null)}
//                       sx={{ ml: "auto" }}
//                     >
//                       <ArrowBack fontSize="small" />
//                     </IconButton>
//                   )}
//                 </Typography>
//                 <Box
//                   sx={{
//                     p: 1,
//                     maxHeight: "calc(75vh - 200px)",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {expandedState !== null ? (
//                     renderItemsWithFallback(
//                       data.locations[expandedState]?.districts,
//                       data.locations[expandedState]?.state || "Unknown State"
//                     ).map((dist, distIndex) => {
//                       const districtKey = `${expandedState}-${distIndex}`;
//                       return (
//                         <Card
//                           key={`district-${districtKey}`}
//                           onClick={() =>
//                             typeof dist !== 'string' && toggleDistrict(expandedState, distIndex)
//                           }
//                           sx={{
//                             mb: 1,
//                             cursor: "pointer",
//                             borderRadius: "6px",
//                             boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                             borderLeft: `4px solid ${
//                               expandedDistrict === districtKey
//                                 ? theme.palette.secondary.main
//                                 : "transparent"
//                             }`,
//                             bgcolor:
//                               expandedDistrict === districtKey
//                                 ? "rgba(255, 152, 0, 0.08)"
//                                 : "background.paper",
//                             transition: "all 0.2s ease",
//                             "&:hover": {
//                               transform: "translateY(-1px)",
//                               boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
//                             },
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               p: 0.8,
//                               display: "flex",
//                               justifyContent: "space-between",
//                             }}
//                           >
//                             <Typography variant="subtitle1">
//                               {typeof dist === 'string' ? dist : (dist.district || "N/A")}
//                             </Typography>
//                           </Box>
//                         </Card>
//                       );
//                     })
//                   ) : (
//                     <Box sx={{ p: 2, textAlign: "center" }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {expandedState === null ? (
//                           <>
//                             <ArrowBack
//                               sx={{
//                                 fontSize: 40,
//                                 color: "action.disabled",
//                                 mb: 1,
//                               }}
//                             />
//                             <br />
//                             Select a state
//                           </>
//                         ) : (
//                           "Loading districts..."
//                         )}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </Box>

//               {/* Cities Column */}
//               <Box
//                 sx={{
//                   flex: 1,
//                   bgcolor:
//                     expandedDistrict !== null
//                       ? "background.paper"
//                       : "rgba(0,0,0,0.02)",
//                   display: isMobile
//                     ? expandedDistrict !== null
//                       ? "block"
//                       : "none"
//                     : "block",
//                   transition: "background-color 0.3s ease",
//                 }}
//               >
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     p: 2,
//                     position: "sticky",
//                     top: 0,
//                     bgcolor: "#7ad03a",
//                     zIndex: 2,
//                     borderBottom: "1px solid #e0e0e0",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <LocationCity sx={{ mr: 1, color: "#fff" }} />
//                   {expandedDistrict !== null 
//                     ? `${data.locations[expandedDistrict.split("-")[0]]?.districts[expandedDistrict.split("-")[1]]?.name} Cities`
//                     : "Cities"}
//                   {isMobile && expandedDistrict !== null && (
//                     <IconButton
//                       size="small"
//                       onClick={() => setExpandedDistrict(null)}
//                       sx={{ ml: "auto" }}
//                     >
//                       <ArrowBack fontSize="small" />
//                     </IconButton>
//                   )}
//                 </Typography>
//                 <Box
//                   sx={{
//                     p: 1,
//                     display: "grid",
//                     gridTemplateColumns: isMobile
//                       ? "1fr"
//                       : "repeat(auto-fill, minmax(200px, 1fr))",
//                     gap: 1,
//                     maxHeight: "calc(75vh - 200px)",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {expandedDistrict !== null ? (
//                     renderItemsWithFallback(
//                       data.locations[expandedDistrict.split("-")[0]]?.districts[expandedDistrict.split("-")[1]]?.cities,
//                       data.locations[expandedDistrict.split("-")[0]]?.districts[expandedDistrict.split("-")[1]]?.name || "Unknown District"
//                     ).map((item, cityIndex) => (
//                       <Card
//                         key={`city-${cityIndex}`}
//                         sx={{
//                           borderRadius: "6px",
//                           boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                           bgcolor: "background.paper",
//                           transition: "all 0.2s ease",
//                           "&:hover": {
//                             transform: "translateY(-1px)",
//                             boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
//                           },
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             p: 0.8,
//                             display: "flex",
//                             alignItems: "center",
//                           }}
//                         >
//                           <FiberManualRecord
//                             sx={{
//                               fontSize: 8,
//                               color: "primary.main",
//                               mr: 1,
//                             }}
//                           />
//                           <Typography variant="body2">{item}</Typography>
//                         </Box>
//                       </Card>
//                     ))
//                   ) : (
//                     <Box sx={{ p: 2, textAlign: "center" }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {expandedState === null ? (
//                           <>
//                             <ArrowBack
//                               sx={{
//                                 fontSize: 40,
//                                 color: "action.disabled",
//                                 mb: 1,
//                               }}
//                             />
//                             <br />
//                             Select a district
//                           </>
//                         ) : (
//                           "Select a district to view cities"
//                         )}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         )}
//       </Box>
//     );
// };
//   const ExpansionLocationGridInternational = ({ data }) => {
//     const [expandedCountry, setExpandedCountry] = useState(null);
//     const [expandedDistrict, setExpandedDistrict] = useState(null);
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//     if (!data || !Array.isArray(data.country)) return null;

//     const visibleCountries = data.country;
//     const hasData = data.country.length > 0;

//     const toggleCountry = (countryIndex) => {
//       if (expandedCountry === countryIndex) {
//         setExpandedCountry(null);
//         setExpandedDistrict(null);
//       } else {
//         setExpandedCountry(countryIndex);
//         setExpandedDistrict(null);
//       }
//     };

//     const toggleDistrict = (countryIndex, distIndex) => {
//       const districtKey = `${countryIndex}-${distIndex}`;
//       setExpandedDistrict(
//         expandedDistrict === districtKey ? null : districtKey
//       );
//     };

//     return (
//       <Box
//         sx={{
//           mt: 2,
//           border: "1px solid #e0e0e0",
//           borderRadius: "8px",
//           overflow: "hidden",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         {!hasData ? (
//           <Box
//             sx={{
//               p: 3,
//               textAlign: "center",
//               color: "text.secondary",
//             }}
//           >
//             <Typography variant="body1">
//               No international locations available
//             </Typography>
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               display: isMobile ? "block" : "flex",
//               height: isMobile ? "auto" : "400px",
//               overflow: isMobile ? "visible" : "hidden",
//             }}
//           >
//             {/* Unified scroll container */}
//             <Box
//               sx={{
//                 display: isMobile ? "block" : "flex",
//                 flex: 1,
//                 overflow: isMobile ? "visible" : "auto",
//                 "&::-webkit-scrollbar": {
//                   height: "8px",
//                 },
//                 "&::-webkit-scrollbar-thumb": {
//                   backgroundColor: "rgba(0,0,0,0.2)",
//                   borderRadius: "4px",
//                 },
//               }}
//             >
//               {/* Countries Column */}
//               <Box
//                 sx={{
//                   width: isMobile ? "100%" : "300px",
//                   minWidth: isMobile ? "100%" : "300px",
//                   borderRight: isMobile ? "none" : "1px solid #e0e0e0",
//                   bgcolor: "background.paper",
//                 }}
//               >
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     p: 2,
//                     position: "sticky",
//                     top: 0,
//                     bgcolor: "#7ad03a",
//                     zIndex: 2,
//                     borderBottom: "1px solid #e0e0e0",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Public sx={{ mr: 1, color: "primary.main" }} />
//                   Countries
//                 </Typography>
//                 <Box sx={{ p: 1 }}>
//                   {visibleCountries.map((countryItem, countryIndex) => (
//                     <Card
//                       key={`country-${countryIndex}`}
//                       onClick={() => toggleCountry(countryIndex)}
//                       sx={{
//                         mb: 1,
//                         cursor: "pointer",
//                         borderRadius: "6px",
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                         borderLeft: `4px solid ${
//                           expandedCountry === countryIndex
//                             ? theme.palette.primary.main
//                             : "transparent"
//                         }`,
//                         bgcolor:
//                           expandedCountry === countryIndex
//                             ? "rgba(25, 118, 210, 0.08)"
//                             : "background.paper",
//                         transition: "all 0.2s ease",
//                         "&:hover": {
//                           transform: "translateY(-1px)",
//                           boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
//                         },
//                       }}
//                     >
//                       <CardContent
//                         sx={{
//                           py: 1.5,
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Box>
//                           <Typography fontWeight={600}>
//                             {countryItem.states || "Unknown Country"}
//                           </Typography>
//                           {countryItem.region && (
//                             <Typography
//                               variant="caption"
//                               color="text.secondary"
//                             >
//                               {countryItem.region}
//                             </Typography>
//                           )}
//                         </Box>
//                         <Chip
//                           label={countryItem.district?.length || 0}
//                           size="small"
//                           color={
//                             expandedCountry === countryIndex
//                               ? "primary"
//                               : "default"
//                           }
//                         />
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </Box>
//               </Box>

//               {/* Districts Column */}
//               <Box
//                 sx={{
//                   width: isMobile ? "100%" : "300px",
//                   minWidth: isMobile ? "100%" : "300px",
//                   borderRight: isMobile ? "none" : "1px solid #e0e0e0",
//                   bgcolor:
//                     expandedCountry !== null
//                       ? "background.paper"
//                       : "rgba(0,0,0,0.02)",
//                   display: isMobile
//                     ? expandedCountry !== null
//                       ? "block"
//                       : "none"
//                     : "block",
//                   transition: "background-color 0.3s ease",
//                 }}
//               >
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     p: 2,
//                     position: "sticky",
//                     top: 0,
//                     bgcolor: "#7ad03a",
//                     zIndex: 2,
//                     borderBottom: "1px solid #e0e0e0",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Map sx={{ mr: 1, color: "primary.main" }} />
//                   Districts/States
//                   {isMobile && expandedCountry !== null && (
//                     <IconButton
//                       size="small"
//                       onClick={() => setExpandedCountry(null)}
//                       sx={{ ml: "auto" }}
//                     >
//                       <ArrowBack fontSize="small" />
//                     </IconButton>
//                   )}
//                 </Typography>
//                 <Box sx={{ p: 1 }}>
//                   {expandedCountry !== null &&
//                   Array.isArray(data.country[expandedCountry].district) ? (
//                     data.country[expandedCountry].district.length > 0 ? (
//                       data.country[expandedCountry].district.map(
//                         (distItem, distIndex) => {
//                           const districtKey = `${expandedCountry}-${distIndex}`;
//                           return (
//                             <Card
//                               key={`district-${districtKey}`}
//                               onClick={() =>
//                                 toggleDistrict(expandedCountry, distIndex)
//                               }
//                               sx={{
//                                 mb: 1,
//                                 cursor: "pointer",
//                                 borderRadius: "6px",
//                                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                                 borderLeft: `4px solid ${
//                                   expandedDistrict === districtKey
//                                     ? theme.palette.secondary.main
//                                     : "transparent"
//                                 }`,
//                                 bgcolor:
//                                   expandedDistrict === districtKey
//                                     ? "rgba(255, 152, 0, 0.08)"
//                                     : "background.paper",
//                                 transition: "all 0.2s ease",
//                                 "&:hover": {
//                                   transform: "translateY(-1px)",
//                                   boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
//                                 },
//                               }}
//                             >
//                               <CardContent
//                                 sx={{
//                                   py: 1.5,
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <Typography variant="subtitle1">
//                                   {distItem.district || "N/A"}
//                                 </Typography>
//                                 <Chip
//                                   label={distItem.cities?.length || 0}
//                                   size="small"
//                                   color={
//                                     expandedDistrict === districtKey
//                                       ? "secondary"
//                                       : "default"
//                                   }
//                                 />
//                               </CardContent>
//                             </Card>
//                           );
//                         }
//                       )
//                     ) : (
//                       <Box sx={{ p: 2, textAlign: "center" }}>
//                         <Typography variant="body2" color="text.secondary">
//                           <LocationOff
//                             sx={{
//                               fontSize: 40,
//                               color: "action.disabled",
//                               mb: 1,
//                             }}
//                           />
//                           <br />
//                           No districts/states available
//                         </Typography>
//                       </Box>
//                     )
//                   ) : (
//                     <Box sx={{ p: 2, textAlign: "center" }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {expandedCountry === null ? (
//                           <>
//                             <ArrowBack
//                               sx={{
//                                 fontSize: 40,
//                                 color: "action.disabled",
//                                 mb: 1,
//                               }}
//                             />
//                             <br />
//                             Select a country
//                           </>
//                         ) : (
//                           "Loading districts..."
//                         )}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </Box>

//               {/* Cities Column */}
//               <Box
//                 sx={{
//                   flex: 1,
//                   bgcolor:
//                     expandedDistrict !== null
//                       ? "background.paper"
//                       : "rgba(0,0,0,0.02)",
//                   display: isMobile
//                     ? expandedDistrict !== null
//                       ? "block"
//                       : "none"
//                     : "block",
//                   transition: "background-color 0.3s ease",
//                 }}
//               >
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     p: 2,
//                     position: "sticky",
//                     top: 0,
//                     bgcolor: "#7ad03a",
//                     zIndex: 2,
//                     borderBottom: "1px solid #e0e0e0",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <LocationCity sx={{ mr: 1, color: "primary.main" }} />
//                   Cities
//                   {isMobile && expandedDistrict !== null && (
//                     <IconButton
//                       size="small"
//                       onClick={() => setExpandedDistrict(null)}
//                       sx={{ ml: "auto" }}
//                     >
//                       <ArrowBack fontSize="small" />
//                     </IconButton>
//                   )}
//                 </Typography>
//                 <Box
//                   sx={{
//                     p: 1,
//                     display: "grid",
//                     gridTemplateColumns: isMobile
//                       ? "1fr"
//                       : "repeat(auto-fill, minmax(200px, 1fr))",
//                     gap: 1,
//                   }}
//                 >
//                   {expandedDistrict !== null ? (
//                     (() => {
//                       const [countryIdx, districtIdx] = expandedDistrict
//                         .split("-")
//                         .map(Number);
//                       const cities =
//                         data.country[countryIdx]?.district[districtIdx]?.cities;

//                       return Array.isArray(cities) && cities.length > 0 ? (
//                         cities.map((city, cityIndex) => (
//                           <Card
//                             key={`city-${cityIndex}`}
//                             sx={{
//                               borderRadius: "6px",
//                               boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                               bgcolor: "background.paper",
//                               transition: "all 0.2s ease",
//                               "&:hover": {
//                                 transform: "translateY(-1px)",
//                                 boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
//                               },
//                             }}
//                           >
//                             <CardContent
//                               sx={{
//                                 py: 1.5,
//                                 display: "flex",
//                                 alignItems: "center",
//                               }}
//                             >
//                               <FiberManualRecord
//                                 sx={{
//                                   fontSize: 8,
//                                   color: "primary.main",
//                                   mr: 1,
//                                 }}
//                               />
//                               <Typography variant="body2">{city}</Typography>
//                             </CardContent>
//                           </Card>
//                         ))
//                       ) : (
//                         <Box sx={{ p: 2, textAlign: "center" }}>
//                           <Typography variant="body2" color="text.secondary">
//                             <LocationOff
//                               sx={{
//                                 fontSize: 40,
//                                 color: "action.disabled",
//                                 mb: 1,
//                               }}
//                             />
//                             <br />
//                             No cities available
//                           </Typography>
//                         </Box>
//                       );
//                     })()
//                   ) : (
//                     <Box sx={{ p: 2, textAlign: "center" }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {expandedCountry === null ? (
//                           <>
//                             <ArrowBack
//                               sx={{
//                                 fontSize: 40,
//                                 color: "action.disabled",
//                                 mb: 1,
//                               }}
//                             />
//                             <br />
//                             Select a district
//                           </>
//                         ) : (
//                           "Select a district to view cities"
//                         )}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   //   const ExpansionLocationTags = ({ brand }) => {
//   //     const locations = Array.isArray(
//   //       brand.expansionLocationData?.expansionLocations?.domestic?.locations
//   //     )
//   //       ? brand.expansionLocationData.expansionLocations.domestic.locations.flatMap(
//   //           (loc) =>
//   //             Array.isArray(loc.districts)
//   //               ? loc.districts.flatMap((dist) =>
//   //                   Array.isArray(dist.cities)
//   //                     ? dist.cities.map((city) => ({
//   //                         city,
//   //                         district: dist.district,
//   //                         state: loc.state,
//   //                       }))
//   //                     : []
//   //                 )
//   //               : []
//   //         )
//   //       : [];

//   //     const category = brand.franchiseDetails?.brandCategories || {};
//   //     const formattedChipsState = locations.map((loc, index) => ({
//   //       key: `${loc.state}-${index}`,
//   //       label: ` ${category.child || ""} franchise in-${loc.state}`,
//   //     }));
//   //     const formattedChipsDistrict = locations.map((loc, index) => ({
//   //       key: `${loc.district}-${index}`,
//   //       label: ` ${category.child || ""} franchise in-${loc.district}`,
//   //     }));
//   //     const formattedChipsCity = locations.map((loc, index) => ({
//   //       key: `${loc.city}-${index}`,
//   //       label: ` ${category.child || ""} franchise in-${loc.city}`,
//   //     }));

//   //     return (
//   //       <Box
//   //   sx={{
//   //     border: "1px solid #e0e0e0",
//   //     borderRadius: "8px",
//   //     p: 2,
//   //     display: "grid",
//   //     gridTemplateColumns: "repeat(3, 1fr)",  // 👉 Creates 3 equal columns
//   //     gap: 2,
//   //     height: "90px",
//   //     overflowY: "auto",
//   //   }}
//   // >
//   //   {/* State Column */}
//   //   <Box>
//   //     {formattedChipsState.length > 0 ? (
//   //       <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//   //         {formattedChipsState.map((chip) => (
//   //           <Typography
//   //             key={chip.key}
//   //             variant="caption"
//   //             sx={{
//   //               borderRadius: "4px",
//   //               color: colors.dark,
//   //               whiteSpace: "nowrap",
//   //             }}
//   //           >
//   //             {chip.label}
//   //           </Typography>
//   //         ))}
//   //       </Box>
//   //     ) : (
//   //       <Typography
//   //         variant="body2"
//   //         sx={{
//   //           color: "text.secondary",
//   //           textAlign: "center",
//   //           mt: 2,
//   //         }}
//   //       >
//   //         No locations available
//   //       </Typography>
//   //     )}
//   //   </Box>

//   //   {/* District Column */}
//   //   <Box>
//   //     {formattedChipsDistrict.length > 0 ? (
//   //       <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//   //         {formattedChipsDistrict.map((chip) => (
//   //           <Typography
//   //             key={chip.key}
//   //             variant="caption"
//   //             sx={{
//   //               borderRadius: "4px",
//   //               color: colors.dark,
//   //               whiteSpace: "nowrap",
//   //             }}
//   //           >
//   //             {chip.label}
//   //           </Typography>
//   //         ))}
//   //       </Box>
//   //     ) : (
//   //       <Typography
//   //         variant="body2"
//   //         sx={{
//   //           color: "text.secondary",
//   //           textAlign: "center",
//   //           mt: 2,
//   //         }}
//   //       >
//   //         No locations available
//   //       </Typography>
//   //     )}
//   //   </Box>

//   //   {/* City Column */}
//   //   <Box>
//   //     {formattedChipsCity.length > 0 ? (
//   //       <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//   //         {formattedChipsCity.map((chip) => (
//   //           <Typography
//   //             key={chip.key}
//   //             variant="caption"
//   //             sx={{
//   //               borderRadius: "4px",
//   //               color: colors.dark,
//   //               whiteSpace: "nowrap",
//   //             }}
//   //           >
//   //             {chip.label}
//   //           </Typography>
//   //         ))}
//   //       </Box>
//   //     ) : (
//   //       <Typography
//   //         variant="body2"
//   //         sx={{
//   //           color: "text.secondary",
//   //           textAlign: "center",
//   //           mt: 2,
//   //         }}
//   //       >
//   //         No locations available
//   //       </Typography>
//   //     )}
//   //   </Box>
//   // </Box>

//   //     );
//   //   };



//   const hasData = (sectionData) => {
//     if (Array.isArray(sectionData)) {
//       return sectionData.length > 0;
//     }
//     return !!sectionData;
//   };

//   const sections = [
//     {
//       title: "Brand Overview",
//       icon: <Business sx={{ color: colors.secondary }} />,
//       content: (
//         <Box>
//           {hasData(brand?.[0]?.brandfranchisedetails?.franchiseDetails?.fico?.[0]) && (
//             <>
//               <Typography
//                 variant="h6"
//                 fontWeight={700}
//                 sx={{ mb: 2, color: "#7ad03a" }}
//               >
//                 Franchise Details
//               </Typography>
//                <Box sx={{ mb: 4 }}>
//       <TableContainer
//         ref={containerRef}
//         sx={{
//           borderRadius: "16px",
//           overflowX: "auto",
//           maxHeight: "calc(100vh - 300px)",
//           display: "flex",  // make sure content flows horizontally
//         }}
//         onTouchStart={handleUserScrollStart}
//         onTouchEnd={handleUserScrollEnd}
//         onMouseEnter={handleUserScrollStart}
//         onMouseLeave={handleUserScrollEnd}
//       >
//         <Box sx={{ display: "flex" }} onMouseEnter={handleMouseEnter}>
//           {/* render original table */}
//           <Table
//             stickyHeader
//             sx={{
//               width: 2000,
//               tableLayout: "fixed",
//               flexShrink: 0,
//             }}
//           >
//             <TableHead>
//               <TableRow>
//                 {[
//                   "Model", "Type", "Investment", "Area", "Agreement",
//                   "Franchise Fee", "Interior Cost", "Stock", "Other Costs",
//                   "Working Capital", "Royalty Fee", "Break Even", "ROI",
//                   "Payback", "Margin"
//                 ].map((header, i) => (
//                   <TableCell
//                     key={i}
//                     align="center"
//                     sx={{
//                       backgroundColor: "#7ad03a",
//                       color: "black",
//                       fontWeight: 700,
//                       padding: "12px 16px",
//                       borderBottom: "none",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {header}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>{tableRows}</TableBody>
//           </Table>

//           {/* duplicate table for seamless scroll */}
//           <Table
//             stickyHeader
//             sx={{
//               width: 2000,
//               tableLayout: "fixed",
//               flexShrink: 0,
//             }}
//           >
//             <TableHead>
//               <TableRow>
//                 {[
//                   "Model", "Type", "Investment", "Area", "Agreement",
//                   "Franchise Fee", "Interior Cost", "Stock", "Other Costs",
//                   "Working Capital", "Royalty Fee", "Break Even", "ROI",
//                   "Payback", "Margin"
//                 ].map((header, i) => (
//                   <TableCell
//                     key={i}
//                     align="center"
//                     sx={{
//                       backgroundColor: "#7ad03a",
//                       color: "black",
//                       fontWeight: 700,
//                       padding: "12px 16px",
//                       borderBottom: "none",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {header}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>{tableRows}</TableBody>
//           </Table>
//         </Box>
//       </TableContainer>
//     </Box>
//             </>
//           )}

//           {/* Brand Description - Only show if data exists */}
//           {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.brandDescription && (
//             <Box
//               sx={{
//                 mb: 4,
//                 p: 3,
//                 borderRadius: "16px",
//                 background: "#fff",
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 fontWeight={700}
//                 sx={{ mb: 2, color: "#7ad03a" }}
//               >
//                 Brand Description
//               </Typography>
//               <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.1)" }} />
//               <Box
//                 dangerouslySetInnerHTML={{
//                   __html: brand?.[0]?.brandfranchisedetails?.franchiseDetails?.brandDescription,
//                 }}
//                 sx={{
//                   color: colors.dark,
//                   "& p": { mb: 2 },
//                   "& strong": { color: colors.primary },
//                 }}
//               />
//               <Typography variant="body2" component="div">
//                 {hasData(brand?.[0]?.brandfranchisedetails?.franchiseDetails?.uniqueSellingPoints) && (
//                   <>
//                     <Typography
//                       variant="body1"
//                       sx={{ color: colors.dark, fontWeight: 600 }}
//                     >
//                       Unique Points:
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: colors.dark }}>
//                       {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.uniqueSellingPoints.join(", ")}
//                     </Typography>
//                   </>
//                 )}
//               </Typography>
//             </Box>
//           )}

//           {/* Support Provided By Brand - Only show if data exists */}
//           {(hasData(brand?.[0]?.brandfranchisedetails?.franchiseDetails?.trainingSupport) ||
//             brand?.[0]?.brandfranchisedetails?.franchiseDetails?.aidFinancing ||
//             hasData(brand?.[0]?.brandfranchisedetails?.franchiseDetails?.uniqueSellingPoints)) && (
//             <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
//               <Grid xs={12} md={6}>
//                 <Zoom in={true} timeout={700}>
//                   <AnimatedCard
//                     sx={{
//                       borderRadius: "16px",
//                       height: "100%",
//                     }}
//                   >
//                     <CardContent>
//                       <Typography
//                         variant="h6"
//                         fontWeight={700}
//                         gutterBottom
//                         display="flex"
//                         alignItems="center"
//                         color="#7ad03a"
//                       >
//                         <Business sx={{ color: colors.secondary, mr: 1 }} />{" "}
//                         Support Provided By Brand
//                       </Typography>
//                       <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.1)" }} />
//                       <Box
//                         sx={{
//                           display: "grid",
//                           gridTemplateColumns: "180px auto",
//                           rowGap: 1,
//                           columnGap: 2,
//                           pl: 1,
//                         }}
//                       >
//                         {hasData(brand?.[0]?.brandfranchisedetails?.franchiseDetails?.trainingSupport) && (
//                           <>
//                             <Typography
//                               variant="body2"
//                               sx={{ color: colors.dark, fontWeight: 600 }}
//                             >
//                               Training Support:
//                             </Typography>
//                             <Typography
//   variant="body2"
//   sx={{
//     color: colors.dark,
//     display: "flex",
//     flexWrap: "wrap",
//     flexDirection: { xs: "column", sm: "row" }, // column on mobile
//     gap: 0.5, // small spacing between items
//   }}
// >
//   {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.trainingSupport.map((item, index) => (
//     <span key={index}>✅ {item}</span>
//   ))}
// </Typography>

//                           </>
//                         )}

//                         {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.aidFinancing && (
//                           <>
//                             <Typography
//                               variant="body2"
//                               sx={{ color: colors.dark, fontWeight: 600 }}
//                             >
//                               Financing Aid:
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               sx={{ color: colors.dark }}
//                             >
//                               {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.aidFinancing}
//                             </Typography>
//                           </>
//                         )}
//                         <Typography
//                           id="expansion-location"
//                           variant="body2"
//                           sx={{ color: colors.dark, fontWeight: 600 }}
//                         >
//                           International Expansion:
//                         </Typography>
//                         <Typography variant="body2" sx={{ color: colors.dark }}>
//                           {brand?.[0]?.brandfranchisedetails?.franchiseDetails?.isInternationalExpansion
//                             ? "Yes"
//                             : "No"}
//                         </Typography>
//                       </Box>
//                     </CardContent>
//                   </AnimatedCard>
//                 </Zoom>
//               </Grid>
//             </Grid>
//           )}

//           {/* Current Outlets (Domestic) - Only show if data exists */}
//           {hasData(
//             brand?.[0]?.brandexpansionlocationdatas?.currentOutletLocations?.domestic
//               ?.locations
//           ) && (
//             <>
//               <Typography
//                 variant="h6"
//                 sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}
//               >
//                 Current Outlets (India)
//               </Typography>
//               <ExpansionLocationGrid
//                 data={
//                  brand?.[0]?.brandexpansionlocationdatas?.currentOutletLocations?.domestic
//                 }
//               />
//             </>
//           )}

//           {/* Current Outlets (International) - Only show if data exists */}
//           {hasData(
//             brand?.[0]?.brandexpansionlocationdatas?.currentOutletLocations?.international
//               ?.country
//           ) && (
//             <>
//               <Typography
//                 variant="h6"
//                 sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}
//               >
//                 Current Outlets (International)
//               </Typography>
//               <ExpansionLocationGridInternational
//                 data={
//                   brand?.[0]?.brandexpansionlocationdatas?.currentOutletLocations?.international
//                 }
//               />
//             </>
//           )}

//           {/* Expansion Locations (Domestic) - Only show if data exists */}
//           {hasData(
//             brand?.[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations
//           ) && (
//             <>
//               <Typography
//                 variant="h6"
//                 sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}
//               >
//                 Expansion Locations (India)
//               </Typography>
//               <ExpansionLocationGrid
//                 data={brand?.[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic}
//               />
//             </>
//           )}

//           {/* Expansion Locations (International) - Only show if data exists */}
//           {hasData(
//            brand?.[0]?.brandexpansionlocationdatas?.expansionLocations?.international
//               ?.country
//           ) && (
//             <>
//               <Typography
//                 variant="h6"
//                 sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}
//               >
//                 Expansion Locations (International)
//               </Typography>
//               <ExpansionLocationGridInternational
//                 data={
//                   brand?.[0]?.brandexpansionlocationdatas?.expansionLocations?.international
//                 }
//               />
//             </>
//           )}

//           {hasData(brand?.[0]?.uploads?.awards) && (
//             <>
//               <Typography
//                 variant="h6"
//                 fontWeight={600}
//                 gutterBottom
//                 sx={{ mt: 4, color: "#7ad03a" }}
//               >
//                 Awards
//               </Typography>
//               {Array.isArray(brand?.[0]?.uploads?.awards) &&
//               brand?.[0]?.uploads?.awards.length > 0 ? (
//                 <Grid container spacing={2}>
//                   {brand?.[0]?.uploads?.awards.map((award, idx) => (
//                     <Grid xs={12} sm={6} md={4} key={idx}>
//                       <Slide direction="up" in={true} timeout={idx * 200}>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             mb: 2,
//                             p: 2,
//                             borderRadius: "12px",
//                             background: "white",
//                             boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                             transition: "all 0.3s ease",
//                             "&:hover": {
//                               transform: "translateY(-5px)",
//                               boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//                             },
//                           }}
//                         >
//                           {award.awardImage && (
//                             <img
//                               src={award.awardImage}
//                               loading="lazy"
//                               alt={`Award ${idx + 1}`}
//                               style={{
//                                 width: "100%",
//                                 maxWidth: 180,
//                                 height: 120,
//                                 borderRadius: 8,
//                                 marginBottom: 12,
//                                 objectFit: "cover",
//                                 background: "#f0f0f0",
//                                 display: award.awardImage ? "block" : "none",
//                               }}
//                               onError={(e) => {
//                                 e.target.style.display = "none";
//                               }}
//                             />
//                           )}
//                           {!award.awardImage && (
//                             <Box
//                               sx={{
//                                 width: "100%",
//                                 maxWidth: 180,
//                                 height: 120,
//                                 borderRadius: 2,
//                                 background: "#f0f0f0",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 mb: 2,
//                               }}
//                             >
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                               >
//                                 No Image
//                               </Typography>
//                             </Box>
//                           )}
//                           <Typography
//                             variant="body2"
//                             align="center"
//                             sx={{ color: colors.dark }}
//                           >
//                             {award.awardDescription || "No Description"}
//                           </Typography>
//                         </Box>
//                       </Slide>
//                     </Grid>
//                   ))}
//                 </Grid>
//               ) : (
//                 <Typography variant="body2" color="text.secondary">
//                   No awards available.
//                 </Typography>
//               )}
//             </>
//           )}

//           {/* Business Plan Documentation - New Section */}
//           {hasData(brand?.[0]?.uploads?.businessPlan) && (
//             <>
//               <Typography
//                 variant="h6"
//                 fontWeight={600}
//                 gutterBottom
//                 sx={{ mt: 4, color: "#7ad03a" }}
//               >
//                 Business Plan Documentation
//               </Typography>
//               <Grid container spacing={2}>
//                 {brand?.[0]?.uploads?.businessPlan.map((doc, idx) => (
//                   <Grid xs={12} sm={6} md={4} key={idx}>
//                     <Slide direction="up" in={true} timeout={idx * 200}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                           mb: 2,
//                           p: 2,
//                           borderRadius: "12px",
//                           background: "white",
//                           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "translateY(-5px)",
//                             boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//                           },
//                         }}
//                       >
//                         <DescriptionIcon
//                           sx={{
//                             fontSize: 60,
//                             color: colors.primary,
//                             mb: 1,
//                           }}
//                         />
//                         <Typography
//                           variant="body2"
//                           align="center"
//                           sx={{
//                             color: colors.dark,
//                             fontWeight: 500,
//                             mb: 1,
//                           }}
//                         >
//                           {doc.title || "Business Document"}
//                         </Typography>
//                         <Button
//                           variant="contained"
//                           size="small"
//                           sx={{
//                             backgroundColor: "#ff9800",
//                             color: "white",
//                             mt: 1,
//                           }}
//                           href={doc.fileUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           View Document
//                         </Button>
//                       </Box>
//                     </Slide>
//                   </Grid>
//                 ))}
//               </Grid>
//             </>
//           )}

//           <Box
//             sx={{
//               mt: 4,
//               p: 3,
//               borderRadius: "12px",
//               bgcolor: "rgba(244, 67, 54, 0.05)",
//               // borderLeft: `4px solid ${colors.error}`
//             }}
//           >
//             <Typography variant="body1" fontWeight={700} color={colors.error}>
//               Disclaimer:
//             </Typography>
//       {!isMobile &&      <Typography variant="caption" color={colors.dark}>
//       Mr Franchise and the site sponsors accept no liability for the
//       accuracy of any information contained on this site or on other
//       linked sites. We recommend you take advice from a lawyer,
//       accountant and franchise consultant experienced in franchising
//       before you commit yourself. It is user's responsibility to satisfy
//       yourself as to the accuracy and reliability of the information
//       supplied. Please read the terms & conditions on MrFranchise.in
//     </Typography>}
//            {isMobile && 
//   <Box sx={{ 
//     overflowX: 'auto',
//     whiteSpace: 'nowrap',
//     minWidth: '300px', // or whatever minimum width you prefer
//     py: 1 // optional padding
//   }}>
//     <Typography variant="caption" color={colors.dark}>
//       Mr Franchise and the site sponsors accept no liability for the
//       accuracy of any information contained on this site or on other
//       linked sites. We recommend you take advice from a lawyer,
//       accountant and franchise consultant experienced in franchising
//       before you commit yourself. It is user's responsibility to satisfy
//       yourself as to the accuracy and reliability of the information
//       supplied. Please read the terms & conditions on MrFranchise.in
//     </Typography>
//   </Box>
// }
//           </Box>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box ref={overviewRef}>
//       {sections.map((section, index) => (
//         <Box key={index} sx={{ mb: 6 }}>
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent:'space-evenly' }}>              
//                </Box>
//           {section.content}
//         </Box>
//       ))}
//     </Box>
//   );
// };

// export default React.memo(OverviewTab); // Use React.memo to optimize OverviewTab;

import React, { useState, useEffect, useRef, lazy } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Card,
  CardContent,
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";

// Import components
import FranchiseDetailsTable from "./FranchiseDetailsOverView.jsx";
import BrandDescription from "./BrandDescriptionsOverView.jsx";
import SupportProvided from "./SupportProvidedOverView.jsx";
import ExpansionLocationGrid from "./ExpansionLocationGrid";
import ExpansionLocationGridInternational from "./ExpansionLocationGridInternational";

// Lazy load icons
const DescriptionIcon = lazy(() => import("@mui/icons-material/Description"));
const Business = lazy(() => import("@mui/icons-material/Business"));

const OverviewTab = ({ brand }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const overviewRef = useRef(null);

  const formatCurrency = (value) => {
    const number = Number(value);
    return isNaN(number) ? "N/A" : `₹${number.toLocaleString("en-IN")}`;
  };

  const hasData = (sectionData) => {
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0;
    }
    return !!sectionData;
  };

  const franchiseDetails = brand?.[0]?.brandfranchisedetails?.franchiseDetails || {};
  const expansionLocationData = brand?.[0]?.brandexpansionlocationdatas || {};
  const uploads = brand?.[0]?.uploads || {};

  return (
    <Box ref={overviewRef}>
      {/* Franchise Details */}
      {hasData(franchiseDetails.fico) && (
        <FranchiseDetailsTable 
          ficoDetails={franchiseDetails.fico} 
          formatCurrency={formatCurrency} 
        />
      )}

      {/* Brand Description */}
      {franchiseDetails.brandDescription && (
        <BrandDescription
          brandDescription={franchiseDetails.brandDescription}
          uniqueSellingPoints={franchiseDetails.uniqueSellingPoints}
        />
      )}

      {/* Support Provided */}
      {(hasData(franchiseDetails.trainingSupport) ||
        franchiseDetails.aidFinancing ||
        hasData(franchiseDetails.uniqueSellingPoints)) && (
        <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
          <Grid item xs={12} md={6}>
            <SupportProvided
              trainingSupport={franchiseDetails.trainingSupport}
              aidFinancing={franchiseDetails.aidFinancing}
              isInternationalExpansion={franchiseDetails.isInternationalExpansion}
            />
          </Grid>
        </Grid>
      )}

      {/* Current Outlets (Domestic) */}
      {hasData(expansionLocationData.currentOutletLocations?.domestic?.locations) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Current Outlets (India)
          </Typography>
          <ExpansionLocationGrid
            data={expansionLocationData.currentOutletLocations.domestic}
          />
        </>
      )}

      {/* Current Outlets (International) */}
      {hasData(expansionLocationData.currentOutletLocations?.international?.country) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Current Outlets (International)
          </Typography>
          <ExpansionLocationGridInternational
            data={expansionLocationData.currentOutletLocations.international}
          />
        </>
      )}

      {/* Expansion Locations (Domestic) */}
      {hasData(expansionLocationData.expansionLocations?.domestic?.locations) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Expansion Locations (India)
          </Typography>
          <ExpansionLocationGrid
            data={expansionLocationData.expansionLocations.domestic}
          />
        </>
      )}

      {/* Expansion Locations (International) */}
      {hasData(expansionLocationData.expansionLocations?.international?.country) && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, mt: 4, color: "#7ad03a" }}>
            Expansion Locations (International)
          </Typography>
          <ExpansionLocationGridInternational
            data={expansionLocationData.expansionLocations.international}
          />
        </>
      )}

      {/* Awards */}
      {hasData(uploads.awards) && (
        <>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4, color: "#7ad03a" }}>
            Awards
          </Typography>
          {uploads.awards.length > 0 ? (
            <Grid container spacing={2}>
              {uploads.awards.map((award, idx) => (
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
                      {award.awardImage ? (
                        <img
                          src={award.awardImage}
                          loading="lazy"
                          alt={`Award ${idx + 1}`}
                          style={{
                            width: "100%",
                            maxWidth: 180,
                            height: 120,
                            borderRadius: 8,
                            marginBottom: 12,
                            objectFit: "cover",
                            background: "#f0f0f0",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
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
                          <Typography variant="caption" color="text.secondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                      <Typography variant="body2" align="center" sx={{ color: "#212121" }}>
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

      {/* Business Plan Documentation */}
      {hasData(uploads.businessPlan) && (
        <>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4, color: "#7ad03a" }}>
            Business Plan Documentation
          </Typography>
          <Grid container spacing={2}>
            {uploads.businessPlan.map((doc, idx) => (
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
                        color: "#3f51b5",
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{
                        color: "#212121",
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

      {/* Disclaimer */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: "12px",
          bgcolor: "rgba(244, 67, 54, 0.05)",
        }}
      >
        <Typography variant="body1" fontWeight={700} color="#f44336">
          Disclaimer:
        </Typography>
        {!isMobile ? (
          <Typography variant="caption" color="#212121">
            Mr Franchise and the site sponsors accept no liability for the
            accuracy of any information contained on this site or on other
            linked sites. We recommend you take advice from a lawyer,
            accountant and franchise consultant experienced in franchising
            before you commit yourself. It is user's responsibility to satisfy
            yourself as to the accuracy and reliability of the information
            supplied. Please read the terms & conditions on MrFranchise.in
          </Typography>
        ) : (
          <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', minWidth: '300px', py: 1 }}>
            <Typography variant="caption" color="#212121">
              Mr Franchise and the site sponsors accept no liability for the
              accuracy of any information contained on this site or on other
              linked sites. We recommend you take advice from a lawyer,
              accountant and franchise consultant experienced in franchising
              before you commit yourself. It is user's responsibility to satisfy
              yourself as to the accuracy and reliability of the information
              supplied. Please read the terms & conditions on MrFranchise.in
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(OverviewTab);