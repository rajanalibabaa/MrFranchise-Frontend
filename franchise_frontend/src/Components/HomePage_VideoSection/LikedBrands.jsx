import React, {  useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import Favorite from "@mui/icons-material/Favorite";
import ArrowRight from "@mui/icons-material/ArrowRight";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import Business from "@mui/icons-material/Business";
import AreaChart from "@mui/icons-material/AreaChart";
import { useNavigate } from "react-router-dom";
// import LoginPage from "../../Pages/LoginPage/LoginPage";

import { postView } from "../../Utils/function/view";

import {useBrands, useToggleLike,openBrandDialog} from "../../Hooks/Fetchbrands"
const CARD_DIMENSIONS = {
  mobile: { width: 280, height: 520 },
  tablet: { width: 320, height: 560 },
  desktop: { width: 327, height: 500 },
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const BrandCard = React.memo(({ 
  brand, 
  handleApply, 
  handleLikeClick, 
  likeProcessing, 
  dimensions,
  theme,
  isMobile,
  isTablet
}) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef();

  const brandId = brand.uuid;
  const franchiseModel = brand.franchiseDetails?.fico?.[0] || {};
  const category = brand.franchiseDetails?.brandCategories || {};
  const videoUrl = brand?.uploads?.franchisePromotionVideo?.[0];
  const mediaHeight = isMobile ? 180 : isTablet ? 200 : 220;

  // Extract brand details with fallbacks
  const brandDetails = brand.brandDetails || {};
  const {
    brandName = "N/A",
    // tagLine = "",
    // companyName = "N/A",
  } = brandDetails;

  // Extract franchise details with fallbacks
  const {
    investmentRange = "Not specified",
    areaRequired = "Not specified",
    franchiseType = "N/A",
    // franchiseModel: modelType = "N/A",
    // franchiseFee = "N/A",
    // royaltyFee = "N/A",
    // roi = "N/A",
    // payBackPeriod = "N/A"
  } = franchiseModel;

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observerRef.current.observe(videoRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <motion.div
      key={brandId}
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      style={{
        width: dimensions.width,
        flexShrink: 0,
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
          border: "1px solid #eee",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
          },
        }}
      >
        {/* Video/Image Section */}
        <Box
          ref={videoRef}
          sx={{
            height: mediaHeight,
            width: "100%",
            overflow: "hidden",
            position: "relative",
            backgroundColor: theme.palette.grey[200],
          }}
        >
          {isVisible && videoUrl ? (
            <CardMedia
              component="video"
              loading="lazy"
              poster={brand?.uploads?.brandLogo?.[0] || ""}
              src={videoUrl}
              alt={brandName}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              controls
              muted
              loop
              preload="none"
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.grey[300],
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No media available
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <CardContent sx={{ pb: 1 }}>
            {/* Brand Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1.5,
                justifyContent: "space-between",
              }}
            >
              <Avatar
                src={brand?.uploads?.brandLogo?.[0]}
                sx={{
                  width: 50,
                  height: 50,
                  border: "1px solid #eee",
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Tooltip title={brandName} placement="top">
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {brandName}
                  </Typography>
                </Tooltip>
                {/* {tagLine && (
                  <Tooltip title={tagLine} placement="top">
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tagLine}
                    </Typography>
                  </Tooltip>
                )} */}
              </Box>
              <IconButton
                onClick={() => handleLikeClick(brand.uuid, brand.isLiked)}
                disabled={likeProcessing[brand.uuid]}
                sx={{ ml: 1 }}
              >
                {likeProcessing[brand.uuid] ? (
                  <CircularProgress size={24} />
                ) : (
                  <Favorite
                    sx={{
                      color: brand.isLiked
                        ? "#f44336"
                        : "rgba(0, 0, 0, 0.23)",
                    }}
                  />
                )}
              </IconButton>
            </Box>

            {/* Categories */}
            {(category.main || category.child) && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {/* {category.main && (
                    <Chip
                      label={category.main}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 152, 0, 0.1)",
                        color: "orange.dark",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    />
                  )} */}
                  {category.child && (
                    <Chip
                      label={category.child}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255, 152, 0, 0.1)",
                        color: "orange.dark",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    />
                  )}
                </Stack>
              </Box>
            )}

            {/* Franchise Details */}
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center">
                <Business
                  sx={{
                    mr: 1.5,
                    fontSize: "1rem",
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2">
                   <strong>Franchise Type :</strong> {franchiseType}
                   {/* <strong>Model:</strong> {modelType} | */}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <MonetizationOn
                  sx={{
                    mr: 1.5,
                    fontSize: "1rem",
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2">
                  <strong>Investment:</strong> {investmentRange} 
                  {/* | <strong>Fee:</strong> {franchiseFee} */}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <AreaChart
                  sx={{
                    mr: 1.5,
                    fontSize: "1rem",
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2">
                  <strong>Area:</strong> {areaRequired} 
                  {/* | <strong>ROI:</strong> {roi}% in {payBackPeriod} */}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 1 }} />
          </CardContent>

          {/* Action Button */}
          <Box sx={{ px: 2, pb: 2, mt: 'auto' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleApply(brand)}
              sx={{
                backgroundColor: "#f29724",
                "&:hover": {
                  backgroundColor: "#e68a1e",
                  boxShadow: 2,
                },
                py: 1,
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              View Full Details
            </Button>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
});

const LikedBrands = () => {
 const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const isTablet = useMediaQuery(theme.breakpoints.down("md"));
   const containerRef = useRef(null);
   const isPaused = useRef(false);
 
   
   const [likeProcessing, setLikeProcessing] = useState({});
   const [showLogin, setShowLogin] = useState(false);
   
   const navigate = useNavigate();
  // REACT-QUERY HOOKS
   const { data: brands = [], isLoading: brandsLoading, error } = useBrands();
   const toggleLike = useToggleLike();
 
   // Filter beverage franchises
   const beverageBrands = useMemo(() => {
     return brands.filter(brand => {
       const category = brand.franchiseDetails?.brandCategories || {};
       return (
         category.main === "Food & Beverages"
       );
     });
   }, [brands]);
 
   const dimensions = useMemo(() => {
     if (isMobile) return CARD_DIMENSIONS.mobile;
     if (isTablet) return CARD_DIMENSIONS.tablet;
     return CARD_DIMENSIONS.desktop;
   }, [isMobile, isTablet]);
 
  const handleLikeClick = useCallback(async (brandId, isLiked) => {
     if (likeProcessing[brandId]) return;
     const token = localStorage.getItem("accessToken");
     if (!token) {
       setShowLogin(true);
       return;
     }
     setLikeProcessing(prev => ({ ...prev, [brandId]: true }));
     try {
       await toggleLike.mutateAsync({ brandId, isLiked });
     } catch (error) {
       console.error("Like operation failed:", error);
     } finally {
       setLikeProcessing(prev => ({ ...prev, [brandId]: false }));
     }
   }, [likeProcessing, toggleLike]);
 
    const handleApply = useCallback((brand) => {
     postView(brand.uuid);
     openBrandDialog(brand);
   }, []);
 
   const handleMouseEnter = useCallback(() => {
     isPaused.current = true;
   }, []);
 
   const handleMouseLeave = useCallback(() => {
     isPaused.current = false;
   }, []);
 
   if (brandsLoading) {
     return (
       <Box sx={{ textAlign: "center", p: 4 }}>
         <CircularProgress />
       </Box>
     );
   }
 
   if (error) {
     return (
      <Box sx={{ textAlign: "center", p: 4 }}>
         <Typography color="error">{error.message || "Failed to load brands."}</Typography>
       </Box>
     );
   }
 
   return (
     
 
     <>
       {beverageBrands.length > 0 && (
         <Box
       sx={{
         py: isMobile ? 1 : 2,
         px: isMobile ? 0 : 2,
         maxWidth: isMobile ? "100%" : 1400,
         mx: "auto",
         mb: isMobile ? 0 : 2,
       }}
       ref={containerRef}
     >
       <Box
         sx={{
           display: "flex",
           justifyContent: "space-between",
           alignItems: "center",
           mb: 1,
         }}
       >
         <Typography
           variant={isMobile ? "body1" : "h5"}
           fontWeight="bold"
           sx={{
             color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
             mb: 1,
             textAlign: "left",
             position: "relative",
             "&:after": {
               content: '""',
               display: "block",
               width: "80px",
               height: "4px",
               background: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
               mt: 1,
               borderRadius: 2,
             },
           }}
         >
           Liked Brands
         </Typography>
 
         <Button
           variant="text"
           size="small"
           endIcon={<ArrowRight />}
           sx={{
             textTransform: "none",
             fontSize: isMobile ? 14 : 16,
             color: theme.palette.text.secondary,
             "&:hover": {
               color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
               backgroundColor: "transparent",
             },
           }}
           onClick={async () => {
             navigate("/brandviewpage");
           
           }}
         >
           View More
         </Button>
       </Box>
 
       <Box
         component={motion.div}
         initial="initial"
         animate="animate"
         sx={{
           display: "flex",
           gap: isMobile ? 2 : 3,
           borderRadius: 3,
           p: 1,
           overflowX: "auto",
           scrollbarWidth: "none",
           "&::-webkit-scrollbar": { display: "none" },
         }}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
       >
         {beverageBrands.map((brand) => (
           <BrandCard 
             key={brand.uuid}
             brand={brand}
             handleApply={handleApply}
             handleLikeClick={handleLikeClick}
             likeProcessing={likeProcessing}
             dimensions={dimensions}
             theme={theme}
             isMobile={isMobile}
             isTablet={isTablet}
           />
         ))}
       </Box>
       {showLogin && (
         <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
       )}
     </Box>
       )}
     </>
   );
 };

export default LikedBrands





























// import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   CircularProgress,
//   IconButton,
//   useMediaQuery,
//   useTheme,
//   Avatar,
//   Tooltip,
//   Chip,
// } from "@mui/material";
// import { motion } from "framer-motion";
// import Favorite from "@mui/icons-material/Favorite";
// import ArrowRight from "@mui/icons-material/ArrowRight";
// import MonetizationOn from "@mui/icons-material/MonetizationOn";
// import LocationOn from "@mui/icons-material/LocationOn";
// import { useNavigate } from "react-router-dom";
// import { postView } from "../../Utils/function/view";
// import { openBrandDialog } from "../../Hooks/Fetchbrands";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { api } from "../../Api/api";
// import img from "../../assets/images/brandLogo.jpg";

// const CARD_DIMENSIONS = {
//   mobile: { width: 280, height: 420 },
//   tablet: { width: 320, height: 440 },
//   desktop: { width: 327, height: 420 },
// };

// const cardVariants = {
//   initial: { opacity: 0, y: 30 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// const BrandCard = React.memo(({ 
//   brand, 
//   handleApply, 
//   handleLikeClick, 
//   likeProcessing, 
//   dimensions,
//   theme,
//   isMobile,
//   isTablet
// }) => {
//   const brandId = brand.uuid;
//   const brandName = brand.brandDetails?.brandName || "Unnamed Brand";
//   const brandLogo = brand.uploads?.brandLogo?.[0] || img;
//   const franchiseModels = brand.franchiseDetails?.fico || [];
//   const investmentRange = brand.franchiseDetails?.fico?.[0]?.investmentRange || "N/A";
//   const locations = brand.brandDetails?.locations?.join(', ') || 'Multiple locations';

//   return (
//     <motion.div
//       key={brandId}
//       variants={cardVariants}
//       whileHover={{ scale: 1.03 }}
//       style={{
//         width: dimensions.width,
//         flexShrink: 0,
//       }}
//     >
//       <Card
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           borderRadius: 3,
//           overflow: "hidden",
//           width: "100%",
//           border: "1px solid #eee",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//           transition: "all 0.3s ease",
//           "&:hover": {
//             boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
//           },
//         }}
//       >
//         {/* Image Section */}
//         <Box
//           sx={{
//             height: isMobile ? 180 : isTablet ? 200 : 220,
//             width: "100%",
//             overflow: "hidden",
//             position: "relative",
//           }}
//         >
//           <CardMedia
//             component="img"
//             image={brandLogo}
//             alt={brandName}
//             sx={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               transition: 'transform 0.3s ease',
//               '&:hover': {
//                 transform: 'scale(1.05)'
//               }
//             }}
//           />
          
//           {/* Like button */}
//           <Box sx={{
//             position: 'absolute',
//             top: 12,
//             right: 12,
//             zIndex: 2
//           }}>
//             <IconButton
//               onClick={() => handleLikeClick(brand.uuid)}
//               disabled={likeProcessing[brand.uuid]}
//               sx={{
//                 backgroundColor: 'rgba(255,255,255,0.9)',
//                 p: 0.5,
//                 '&:hover': { 
//                   backgroundColor: '#fff',
//                   transform: 'scale(1.1)'
//                 },
//                 transition: 'all 0.2s ease'
//               }}
//             >
//               {likeProcessing[brand.uuid] ? (
//                 <CircularProgress size={24} />
//               ) : (
//                 <Favorite 
//                   fontSize="small" 
//                   sx={{ 
//                     fontSize: '1rem',
//                     color: '#ff3d00',
//                     transition: 'all 0.3s ease'
//                   }} 
//                 />
//               )}
//             </IconButton>
//           </Box>
//         </Box>

//         {/* Content Section */}
//         <CardContent sx={{ 
//           flex: '1 1 auto',
//           p: 2.5,
//           display: 'flex',
//           flexDirection: 'column',
//           bgcolor: 'background.paper'
//         }}>
//           {/* Details section */}
//           <Box sx={{ 
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1.5,
//             mb: 1.5
//           }}>
//             <MonetizationOn sx={{ 
//               fontSize: 20,
//               color: '#ff6d00' 
//             }} />
//             <Typography variant="body2" color="text.secondary">
//               {investmentRange}
//             </Typography>
//           </Box>
          
//           <Box sx={{ 
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1.5,
//             mb: 2
//           }}>
//             <LocationOn sx={{ 
//               fontSize: 20,
//               color: '#ff6d00' 
//             }} />
//             <Typography variant="body2" color="text.secondary">
//               {locations}
//             </Typography>
//           </Box>
          
//           {/* Franchise models chips */}
//           <Box sx={{ 
//             mt: 'auto',
//             display: 'flex', 
//             flexWrap: 'wrap', 
//             gap: 1,
//             '& .MuiChip-root': {
//               borderRadius: 1,
//               height: 24,
//               fontSize: '0.65rem',
//               borderColor: '#ffb74d',
//               color: '#e65100',
//               '&:hover': {
//                 backgroundColor: '#ffe0b2'
//               }
//             }
//           }}>
//             {franchiseModels.slice(0, 3).map((model, idx) => (
//               <Chip
//                 key={`${model.franchiseModel}-${idx}`}
//                 label={model.franchiseModel}
//                 size="small"
//                 variant="outlined"
//               />
//             ))}
//             {franchiseModels.length > 3 && (
//               <Chip
//                 label={`+${franchiseModels.length - 3}`}
//                 size="small"
//                 variant="outlined"
//               />
//             )}
//           </Box>
//         </CardContent>

//         {/* Action Button */}
//         <Box sx={{ 
//           p: 2,
//           pt: 0,
//           textAlign: 'center'
//         }}>
//           <Button
//             fullWidth
//             variant="contained"
//             onClick={() => handleApply(brand)}
//             sx={{
//               borderRadius: 2,
//               py: 1,
//               fontSize: '0.8rem',
//               textTransform: 'none',
//               fontWeight: 600,
//               letterSpacing: 0.5,
//               background: 'linear-gradient(135deg, #ff6d00 0%, #ff9100 100%)',
//               boxShadow: '0 2px 10px rgba(255,109,0,0.3)',
//               color: 'white',
//               '&:hover': {
//                 background: 'linear-gradient(135deg, #ff8500 0%, #ffa000 100%)',
//                 boxShadow: '0 4px 14px rgba(255,109,0,0.4)',
//                 transform: 'translateY(-1px)'
//               },
//               transition: 'all 0.3s ease'
//             }}
//           >
//             Explore Opportunity
//           </Button>
//         </Box>
//       </Card>
//     </motion.div>
//   );
// });

// const LikedBrands = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"));
//   const containerRef = useRef(null);
  
//   const [likeProcessing, setLikeProcessing] = useState({});
//   const [likedBrands, setLikedBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [removeMsg, setRemoveMsg] = useState("");
  
//   const navigate = useNavigate();
//   const investorUUID = useSelector((state) => state.auth?.investorUUID);
//   const AccessToken = useSelector((state) => state.auth?.AccessToken);

//   // Fetch liked brands from API
//   useEffect(() => {
//     const fetchLikedBrands = async () => {
//       if (!investorUUID || !AccessToken) {
//         setError("Please login to view liked brands");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
        
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AccessToken}`,
//           },
//           timeout: 10000
//         };

//         const response = await axios.get(
//           `${api.likeApi.get}/${investorUUID}`,
//           config
//         );

//         setLikedBrands(Array.isArray(response.data?.data) ? response.data.data : []);
//       } catch (err) {
//         console.error("Error fetching liked brands:", err);
//         setError(err.response?.data?.message || "Failed to fetch liked brands");
//         setLikedBrands([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLikedBrands();
//   }, [investorUUID, AccessToken]);

//   const dimensions = useMemo(() => {
//     if (isMobile) return CARD_DIMENSIONS.mobile;
//     if (isTablet) return CARD_DIMENSIONS.tablet;
//     return CARD_DIMENSIONS.desktop;
//   }, [isMobile, isTablet]);

//   const handleLikeClick = useCallback(async (brandId) => {
//     if (likeProcessing[brandId] || !investorUUID || !AccessToken) return;
    
//     // Optimistic update
//     const prevLikedBrands = [...likedBrands];
//     setLikedBrands(prev => prev.filter(brand => brand.uuid !== brandId));
//     setLikeProcessing(prev => ({ ...prev, [brandId]: true }));
    
//     try {
//       await axios.delete(
//         `${api.likeApi.delete}/${investorUUID}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AccessToken}`,
//           },
//           data: { brandID: brandId },
//         }
//       );
      
//       setRemoveMsg("Brand removed successfully");
//       setTimeout(() => setRemoveMsg(""), 3000);
//     } catch (error) {
//       console.error("Remove error:", error);
//       // Revert optimistic update
//       setLikedBrands(prevLikedBrands);
//       setRemoveMsg("Failed to remove brand");
//     } finally {
//       setLikeProcessing(prev => ({ ...prev, [brandId]: false }));
//     }
//   }, [likeProcessing, likedBrands, investorUUID, AccessToken]);

//   const handleApply = useCallback((brand) => {
//     postView(brand.uuid);
//     openBrandDialog(brand);
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ 
//         display: 'flex', 
//         flexDirection: 'column', 
//         alignItems: 'center', 
//         py: 10,
//         textAlign: 'center'
//       }}>
//         <Typography variant="h6" color="error" sx={{ mb: 2 }}>
//           Please Login ...
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {error}
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       py: isMobile ? 1 : 2,
//       px: isMobile ? 0 : 2,
//       maxWidth: isMobile ? "100%" : 1400,
//       mx: "auto",
//       mb: isMobile ? 0 : 2,
//     }}>
//       {removeMsg && (
//         <Box sx={{ 
//           mb: 3,
//           p: 2,
//           borderRadius: 2,
//           backgroundColor: '#4caf50',
//           color: 'white',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography>{removeMsg}</Typography>
//           <IconButton size="small" onClick={() => setRemoveMsg("")}>
//             <Close sx={{ color: 'white' }} />
//           </IconButton>
//         </Box>
//       )}
      
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 1,
//         }}
//       >
//         <Typography
//           variant={isMobile ? "body1" : "h5"}
//           fontWeight="bold"
//           sx={{
//             color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
//             mb: 1,
//             textAlign: "left",
//             position: "relative",
//             "&:after": {
//               content: '""',
//               display: "block",
//               width: "80px",
//               height: "4px",
//               background: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
//               mt: 1,
//               borderRadius: 2,
//             },
//           }}
//         >
//           Liked Brands
//         </Typography>

//         <Button
//           variant="text"
//           size="small"
//           endIcon={<ArrowRight />}
//           sx={{
//             textTransform: "none",
//             fontSize: isMobile ? 14 : 16,
//             color: theme.palette.text.secondary,
//             "&:hover": {
//               color: theme.palette.mode === "dark" ? "#ffb74d" : "#f57c00",
//               backgroundColor: "transparent",
//             },
//           }}
//           onClick={() => navigate("/brandviewpage")}
//         >
//           View More
//         </Button>
//       </Box>

//       {likedBrands.length > 0 ? (
//         <Box
//           component={motion.div}
//           initial="initial"
//           animate="animate"
//           sx={{
//             display: "flex",
//             gap: isMobile ? 2 : 3,
//             borderRadius: 3,
//             p: 1,
//             overflowX: "auto",
//             scrollbarWidth: "none",
//             "&::-webkit-scrollbar": { display: "none" },
//           }}
//         >
//           {likedBrands.map((brand) => (
//             <BrandCard 
//               key={brand.uuid}
//               brand={brand}
//               handleApply={handleApply}
//               handleLikeClick={handleLikeClick}
//               likeProcessing={likeProcessing}
//               dimensions={dimensions}
//               theme={theme}
//               isMobile={isMobile}
//               isTablet={isTablet}
//             />
//           ))}
//         </Box>
//       ) : (
//         <Box sx={{ 
//           display: 'flex', 
//           flexDirection: 'column', 
//           alignItems: 'center', 
//           py: 10,
//           textAlign: 'center'
//         }}>
//           <Favorite color="disabled" sx={{ fontSize: 60, mb: 2 }} />
//           <Typography variant="h6" color="text.secondary">
//             No liked brands yet
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//             Like brands to save them for later
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default LikedBrands;