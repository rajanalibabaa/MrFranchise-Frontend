// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   Button,
//   IconButton,
//   Avatar,
//   useMediaQuery,
//   useTheme,
//   Chip,
//   Divider,
//   CircularProgress,
//   Grid,
//   Modal,
//   Link
// } from "@mui/material";
// import { Favorite, FavoriteBorder, PlayCircleOutline, NavigateBefore, NavigateNext } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import { openBrandDialog } from "../../Redux/Slices/brandSlice";
// import BrandDetailsDialog from "../../Pages/AllCategoryPage/BrandDetailsDialog";

// const ImageGallery = ({ brand }) => {
//   const [selectedImage, setSelectedImage] = useState(null);

//   const handleImageClick = (imgUrl) => {
//     setSelectedImage(imgUrl);
//   };

//   const handleClose = () => {
//     setSelectedImage(null);
//   };

//   const renderImageRow = (images, title) => (
//     images?.length > 0 && (
//       <>
//         <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>{title}</Typography>
//         <Box
//           sx={{
//             display: 'flex',
//             overflowX: 'auto',
//             gap: 2,
//             pb: 1,
//             mb: 3,
//             '&::-webkit-scrollbar': {
//               display: 'none' // Hide scrollbar
//             },
//             scrollbarWidth: 'none' // Firefox
//           }}
//         >
//           {images.map((img, index) => (
//             <Box
//               key={index}
//               component="img"
//               src={img}
//               alt={`${title} ${index + 1}`}
//               onClick={() => handleImageClick(img)}
//               sx={{
//                 width: 160,
//                 height: 100,
//                 borderRadius: 2,
//                 objectFit: 'cover',
//                 cursor: 'pointer',
//                 boxShadow: 2,
//                 transition: 'transform 0.3s ease',
//                 '&:hover': {
//                   transform: 'scale(1.05)',
//                 },
//               }}
//             />
//           ))}
//         </Box>
//       </>
//     )
//   );




//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', mt: 3,  color: 'orange'}}>
//       {renderImageRow(brand?.brandDetails?.interiorOutlet, 'Brand Interior Gallery')}
//       {renderImageRow(brand?.brandDetails?.exteriorOutlet, 'Brand Exterior Gallery')}

//       <Modal open={!!selectedImage} onClose={handleClose}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             outline: 'none',
//             maxWidth: '90%',
//             maxHeight: '90%',
//           }}
//         >
//           <Box
//             component="img"
//             src={selectedImage}
//             alt="Full View"
//             sx={{
//               width: '100%',
//               height: 'auto',
//               maxHeight: '90vh',
//               borderRadius: 2,
//               boxShadow: 5,
//             }}
//           />
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// const BrandVideoCard = ({ 
//   brand, 
//   isPlaying, 
//   onPlay, 
//   onPause, 
//   videoRef,
//   liked,
//   onLike,
//   onApply,
//   onNext,
//   onPrev,
//   currentIndex,
//   totalBrands
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"));

//   // Get the first available video URL
//   const videoUrl = brand?.brandDetails?.brandPromotionVideo?.[0] || 
//                   brand?.brandDetails?.franchisePromotionVideo?.[0];

// const [expanded, setExpanded] = useState(false);
// const description = brand?.personalDetails?.brandDescription || "No description available";
//   const shortDescription = description.substring(0, 100);



//   return (
//     <Card sx={{ 
//       width: '100%',
//       height: isMobile ? 'auto' : '500px',
//       borderRadius: 2,
//       boxShadow: 3,
//       overflow: 'hidden',
//       display: 'flex',
//       flexDirection: isMobile ? 'column' : 'row',
//       transition: 'all 0.3s ease',
//       position: 'relative',
//       '&:hover': {
//         boxShadow: 6
//       }
//     }}>
//       {/* Video Section - Left Side */}
//       <Box sx={{
//         position: 'relative',
//         width: isMobile ? '100%' : '55%',
//         height: isMobile ? 300 : '100%',
//         backgroundColor: '#000',
//         overflow: 'hidden',
//         flexShrink: 0,
//       }}>
        
//         {videoUrl ? (
          
//           <>
//             <video
//               ref={videoRef}
//               src={videoUrl}
//               controls={isPlaying}
//               onPlay={onPlay}
//               onPause={onPause}
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'cover',
//                 cursor: 'pointer',
//               }}
//               muted
//               autoPlay
//               playsInline
              
//             />
            
//             {!isPlaying && (
//               <Box sx={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backgroundColor: 'rgba(0,0,0,0.3)',
//                 cursor: 'pointer'
//               }} onClick={onPlay}>
//                 <PlayCircleOutline sx={{ 
//                   fontSize: 64, 
//                   color: 'rgba(255,255,255,0.8)' 
//                 }} />
//               </Box>
//             )}
//           </>
//         ) : (
//           <Box sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: '100%',
//             color: 'white',
//             backgroundColor: theme.palette.grey[700]
//           }}>
//             <Typography>Video not available</Typography>
//           </Box>
//         )}

//         {/* Video Navigation Controls */}
//         {!isMobile && (
//           <Box sx={{
//             position: 'absolute',
//             bottom: 16,
//             left: '30%',
//             // right: 16,
//             display: 'flex',
//             gap: 20,
//             zIndex: 1
//           }}>
//             <IconButton
//               onClick={onPrev}
//               size="small"
//               sx={{
//                 backgroundColor: 'rgba(197, 154, 12, 0.89)',
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: 'rgba(123, 255, 0, 0.8)'
//                 }
//               }}
//               disabled={currentIndex === 0}
//             >
//               <NavigateBefore />
//             </IconButton>
//             <IconButton
//               onClick={onNext}
//               size="small"
//               sx={{
//                 backgroundColor: 'rgba(102, 236, 0, 0.6)',
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: 'rgba(239, 182, 13, 0.8)'
//                 }
//               }}
//               disabled={currentIndex === totalBrands - 1}
//             >
//               <NavigateNext />
//             </IconButton>
//           </Box>
//         )}
//       </Box>
      
//       {/* Content Section - Right Side */}
//       <Box sx={{ 
//         p: 3,
//         mr: isMobile ? 0 : 2,
//         width: isMobile ? '100%' : '40%',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         overflowY: 'auto',
//         overflowX: 'hidden',
//         overflow:'scroll',
//         scrollbarWidth:'none',
//       }}>
//         <Box>
//           <Box sx={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: 2,
//             mb: 2
//           }}>
//             <Avatar 
//               src={brand?.brandDetails?.brandLogo?.[0]} 
//               sx={{ 
//                 width: 50, 
//                 height: 50,
//                 border: '1px solid #eee'
//               }} 
//             />
//             <Box>
//               <Typography variant="h5" fontWeight="bold" >
//                 {brand?.personalDetails?.brandName || "Unknown Brand"}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {brand?.personalDetails?.brandCategories?.[0]?.child  || "No category"}
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ mb: 2 }}>
//             <Typography variant="body2" paragraph>
//           {expanded ? description : `${shortDescription}...`},
//                 {description.length > 100 && (
//         <Typography
//           size="small"
//           color="grey"
//           variant="text"
//           sx={{ cursor: 'pointer' }}
//           onClick={() => setExpanded(!expanded)}
//         >
//           {expanded ? 'readless' : 'readmore'}
//         </Typography>
//       )}
//              </Typography>
       
//           </Box>
// <hr style={{ border: "1px solid green" }} />
// <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ mt: 2 , mb: 1 , color: "orange"}}>
//   Investment Details 
// </Typography>

// <Box sx={{ mb: 2 }}>
//   <Grid container spacing={1} justifyContent={"space-evenly"}>
//     {brand?.franchiseDetails?.modelsOfFranchise?.[0]?.investmentRange && (
//       <Grid item xs={6}>
//         <Typography variant="body2">
//           <strong>Investment:</strong><br />
//           {formatInvestmentRange(brand.franchiseDetails.modelsOfFranchise[0].investmentRange)}
//         </Typography>
//       </Grid>
//     )}

//     {brand?.franchiseDetails?.modelsOfFranchise?.[0]?.areaRequired && (
//       <Grid item xs={6}>
//         <Typography variant="body2">
//           <strong>Area:</strong><br />
//           {brand.franchiseDetails.modelsOfFranchise[0].areaRequired} sq.ft
//         </Typography>
//       </Grid>
//     )}

//     {brand?.personalDetails?.franchiseSinceYear && (
//       <Grid item xs={6}>
//         <Typography variant="body2">
//           <strong>Franchising:</strong><br />
//           {brand.personalDetails.franchiseSinceYear} Years
//         </Typography>
//       </Grid>
//     )}

//     {brand?.personalDetails?.establishedYear && (
//       <Grid item xs={6}>
//         <Typography variant="body2">
//           <strong>Established :</strong><br />
//           {brand.personalDetails.establishedYear} Years
//         </Typography>
//       </Grid>
//     )}

//     {brand?.franchiseDetails?.franchiseOutlets && (
//       <Grid item xs={6}>
//         <Typography variant="body2">
//           <strong>Total:</strong><br />
//           {brand.franchiseDetails.franchiseOutlets} Outlets
//          </Typography>
//       </Grid>
//     )}
//   </Grid>
// </Box>

// <hr style={{ border: "1px solid green" }} />

//           <ImageGallery brand={brand} />
//         </Box>

//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           mt: 'auto',
//           // pt: 2
//         }}>
//           <Button
//             variant="contained" 
//             onClick={() => onApply(brand)}
//             size="medium"
            
//             sx={{
//               flex: 1,
//               backgroundColor: "#f29724",
//               textTransform: "none",
//               borderRadius: 1,
//               py: 1,
//               "&:hover": {
//                 backgroundColor: "#e68a1e",
//                 boxShadow: 2,
//               },
//             }}
//           >
//             Apply Now
//           </Button>

//           <IconButton
//             onClick={onLike}
//             size="small"
//             sx={{ 
//               ml: 2,
//               '&:hover': {
//                 transform: 'scale(1.1)'
//               }
//             }}
//           >
//             {liked ? (
//               <Favorite sx={{ 
//                 color: "red", 
//                 fontSize: 24,
//                 animation: 'pulse 0.5s ease'
//               }} />
//             ) : (
//               <FavoriteBorder sx={{ 
//                 color: "gray", 
//                 fontSize: 24 
//               }} />
//             )}
//           </IconButton>
//         </Box>

//         {/* Mobile Navigation */}
//         {isMobile && (
//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'center', 
//             gap: 2,
//             mt: 2
//           }}>
//             <IconButton
//               onClick={onPrev}
//               size="small"
//               sx={{
//                 backgroundColor: theme.palette.grey[200],
//                 '&:hover': {
//                   backgroundColor: theme.palette.grey[300]
//                 }
//               }}
//               disabled={currentIndex === 0}
//             >
//               <NavigateBefore />
//             </IconButton>
//             <IconButton
//               onClick={onNext}
//               size="small"
//               sx={{
//                 backgroundColor: theme.palette.grey[200],
//                 '&:hover': {
//                   backgroundColor: theme.palette.grey[300]
//                 }
//               }}
//               disabled={currentIndex === totalBrands - 1}
//             >
//               <NavigateNext />
//             </IconButton>
//           </Box>
//         )}
//       </Box>
//     </Card>
//   );
// };

// function formatInvestmentRange(range) {
//   if (!range) return "N/A";
  
//   const ranges = {
//     '5_10_lakhs': '₹5-10 Lakhs',
//     '10_25_lakhs': '₹10-25 Lakhs',
//     '25_50_lakhs': '₹25-50 Lakhs',
//     '50_75_lakhs': '₹50-75 Lakhs',
//     '75_1_crore': '₹75 Lakhs - 1 Crore',
//     '1_2_crore': '₹1-2 Crore',
//     '2_5_crore': '₹2-5 Crore',
//     '5_10_crore': '₹5-10 Crore'
//   };
  
//   return ranges[range] || range.split('_').join('-') + ' Lakhs';
// }

// function TopBrandVdoSec() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
//   const [brandData, setBrandData] = useState([]);
//   const [currentBrand, setCurrentBrand] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [likedBrands, setLikedBrands] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const videoRef = useRef(null);
//   const autoPlayTimer = useRef(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchBrandData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           "https://franchise-backend-wgp6.onrender.com/api/v1/admin/videoAdvertise/getAdminVideoAdvertiseTopOne"
//         );
        
//         let fetchedData = response.data?.data;
//         if (!Array.isArray(fetchedData)) {
//           fetchedData = fetchedData ? [fetchedData] : [];
//         }
        
//         setBrandData(fetchedData);
//         if (fetchedData.length > 0) {
//           setCurrentBrand(fetchedData[0]);
//         }
        
//         // Initialize liked status
//         const initialLikedState = {};
//         fetchedData.forEach(brand => {
//           const brandId = brand.uuid || brand.personalDetails?.brandName;
//           if (brandId) {
//             initialLikedState[brandId] = false;
//           }
//         });
//         setLikedBrands(initialLikedState);
        
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching brand data:", err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchBrandData();

//     return () => {
//       if (autoPlayTimer.current) {
//         clearInterval(autoPlayTimer.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (brandData.length <= 1) return;
    
//     // Set up auto-rotation every 30 seconds (30000 ms)
//     autoPlayTimer.current = setInterval(() => {
//       handleNext();
//     }, 30000);

//     return () => {
//       if (autoPlayTimer.current) {
//         clearInterval(autoPlayTimer.current);
//       }
//     };
//   }, [brandData, currentIndex]);

//   const handlePlay = () => {
//     setIsPlaying(true);
//     // Reset auto-play timer when user manually plays
//     if (autoPlayTimer.current) {
//       clearInterval(autoPlayTimer.current);
//       autoPlayTimer.current = setInterval(() => {
//         handleNext();
//       }, 30000);
//     }
//   };

//   const handlePause = () => {
//     setIsPlaying(false);
//   };

//   const handleNext = () => {
//     if (brandData.length === 0) return;
    
//     const nextIndex = (currentIndex + 1) % brandData.length;
//     setCurrentIndex(nextIndex);
//     setCurrentBrand(brandData[nextIndex]);
//     setIsPlaying(false); // Auto-pause when changing videos
    
//     // Reset video to start
//     if (videoRef.current) {
//       videoRef.current.currentTime = 0;
//     }
//   };

//   const handlePrev = () => {
//     if (brandData.length === 0) return;
    
//     const prevIndex = (currentIndex - 1 + brandData.length) % brandData.length;
//     setCurrentIndex(prevIndex);
//     setCurrentBrand(brandData[prevIndex]);
//     setIsPlaying(false); // Auto-pause when changing videos
    
//     // Reset video to start
//     if (videoRef.current) {
//       videoRef.current.currentTime = 0;
//     }
//   };

//   const handleLike = (brandId) => {
//     setLikedBrands(prev => ({
//       ...prev,
//       [brandId]: !prev[brandId]
//     }));
//   };

//   const handleApply = (brand) => {
//     dispatch(openBrandDialog(brand));
//   };

//   if (loading) {
//     return (
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: 300 
//       }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: 300 
//       }}>
//         <Typography color="error">Error loading brands: {error}</Typography>
//       </Box>
//     );
//   }

//   if (!brandData || brandData.length === 0) {
//     return (
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: 300 
//       }}>
//         <Typography>No brands available</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       px: isMobile ? 2 : 4,
//       py: 4,
//       maxWidth: '1400px',
//       mx: 'auto',
//     }}>
//       <Typography 
//               variant={isMobile ? "h6" : "h5"} 
//               fontWeight="bold" 
//               sx={{ 
//                 color: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
//                 mb: 3, 
//                 textAlign: "left",
//                 position: 'relative',
//                 '&:after': {
//                   content: '""',
//                   display: 'block',
//                   width: '80px',
//                   height: '4px',
//                   background: theme.palette.mode === 'dark' ? '#ffb74d' : '#f57c00',
//                   mt: 1,
//                   borderRadius: 2
//                 }
//               }}
//             >
//         Featured Franchise Opportunities
//             </Typography>
      
      
//       {currentBrand && (
//         <BrandVideoCard
//           brand={currentBrand}
//           isPlaying={isPlaying}
//           onPlay={handlePlay}
//           onPause={handlePause}
//           videoRef={videoRef}
//           liked={currentBrand.uuid ? likedBrands[currentBrand.uuid] : false}
//           onLike={() => currentBrand.uuid && handleLike(currentBrand.uuid)}
//           onApply={handleApply}
//           onNext={handleNext}
//           onPrev={handlePrev}
//           currentIndex={currentIndex}
//           totalBrands={brandData.length}
//         />
//       )}

//       {/* Brand counter */}
//       {brandData.length > 1 && (
//         <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
//           {currentIndex + 1} of {brandData.length}
//         </Typography>
//       )}

//       <BrandDetailsDialog />
//     </Box>
//   );
// }

// export default TopBrandVdoSec;