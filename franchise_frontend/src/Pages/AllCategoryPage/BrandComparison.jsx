// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   IconButton,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Avatar,
//   Badge,
//   Tooltip,
//   Chip,
// } from "@mui/material";
// import {
//   Close,
//   ArrowBack,
//   ArrowForward,
//   PlaylistAddCheckCircleOutlined,
// } from "@mui/icons-material";

// const BrandComparison = ({
//   open,
//   onClose,
//   selectedBrands,
//   onRemoveFromComparison,
// }) => {
//   console.log("Selected Brands compparebrands:", selectedBrands);
//   const [currentModelIndexes, setCurrentModelIndexes] = useState({});

//   useEffect(() => {
//     const indexes = {};
//     selectedBrands.forEach((brand) => {
//       if (brand.uuid && !(brand.uuid in currentModelIndexes)) {
//         indexes[brand.uuid] = 0;
//       }
//     });
//     if (Object.keys(indexes).length > 0) {
//       setCurrentModelIndexes((prev) => ({ ...prev, ...indexes }));
//     }
//   }, [selectedBrands]);

//   const getNestedValue = (obj, path) => {
//     try {
//       return (
//         path.split(".").reduce((o, p) => {
//           if (p.includes("[") && p.includes("]")) {
//             const prop = p.substring(0, p.indexOf("["));
//             const index = parseInt(
//               p.substring(p.indexOf("[") + 1, p.indexOf("]"))
//             );
//             return o[prop] ? o[prop][index] : null;
//           }
//           return o ? o[p] : null;
//         }, obj) || "-"
//       );
//     } catch (e) {
//       return "-";
//     }
//   };

//   const handleNextModel = (brandId) => {
//     setCurrentModelIndexes((prev) => {
//       const brandModels =
//         selectedBrands.find((b) => b.uuid === brandId)?.franchiseDetails
//           ?.fico || [];
//       const currentIndex = prev[brandId] || 0;
//       return {
//         ...prev,
//         [brandId]: (currentIndex + 1) % brandModels.length,
//       };
//     });
//   };

//   const handlePrevModel = (brandId) => {
//     setCurrentModelIndexes((prev) => {
//       const brandModels =
//         selectedBrands.find((b) => b.uuid === brandId)?.franchiseDetails
//           ?.fico || [];
//       const currentIndex = prev[brandId] || 0;
//       return {
//         ...prev,
//         [brandId]: (currentIndex - 1 + brandModels.length) % brandModels.length,
//       };
//     });
//   };

//   const basicInfoFields = [
//     { label: "Brand Name", field: "brandname" },
//     { label: "Company Name", field: "companyName" },
//     { label: "Established Year", field: "establishedYear" },
//     { label: "Total Outlets", field: "franchiseDetails.totalOutlets" },
//     {
//       label: "Company Owned Outlets",
//       field: "franchiseDetails.companyOwnedOutlets",
//     },
//     { label: "Franchise Outlets", field: "franchiseDetails.franchiseOutlets" },
//     {
//       label: "Agreement Period",
//       field: "franchiseDetails.fico[0].agreementPeriod",
//     },
//     { label: "Requirement Support", field: "trainingSupport" },
//   ];

//   const franchiseModelFields = [
//     { label: "Franchise Model", field: "franchiseModel" },
//     // { label: "Franchise Type", field: "franchiseType" },
//     { label: "Area Required (sq.ft)", field: "areaRequired" },
//     { label: "Investment Range", field: "investmentRange" },
//     { label: "Franchise Fee", field: "franchiseFee" },
//     { label: "Royalty Fee", field: "royaltyFee" },
//     { label: "Break Even Period", field: "breakEven" },
//     { label: "ROI", field: "roi" },
//     { label: "Interior Cost", field: "interiorCost" },
//     { label: "Other Costs", field: "otherCost" },
//     { label: "Stock Investment", field: "stockInvestment" },
//     { label: "Pay Back Period", field: "payBackPeriod" },
//     { label: "Require Working Captial", field: "requireWorkingCapital" },
//     { label: "Margin On Sales", field: "marginOnSales" },
//     { label: "Agreement Period", field: "agreementPeriod" },
//   ];

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       scroll="paper"
//       sx={{
//         "& .MuiDialog-paper": {
//           minHeight: "80vh",
//           height: "90vh",
//           maxHeight: "90vh",
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           bgcolor: "#f5f5f5",
//           color: "Black",
//           position: "sticky",
//           top: 0,
//           zIndex: 1,
//         }}
//       >
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6">
//             Brand Comparison ({selectedBrands.length})
//           </Typography>
//           <IconButton onClick={onClose} sx={{ color: "black" }}>
//             <Close />
//           </IconButton>
//         </Box>
//       </DialogTitle>
//       <DialogContent dividers>
//         {selectedBrands.length === 0 ? (
//           <Box textAlign="center" py={4}>
//             <Typography variant="h6" color="textSecondary">
//               No brands selected for comparison
//             </Typography>
//           </Box>
//         ) : (
//           <TableContainer component={Paper}>
//             <Table size="small" stickyHeader>
//               <TableHead>
//                 <TableRow sx={{ bgcolor: "#f5f5f5" }}>
//                   <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
//                     Feature
//                   </TableCell>
//                   {selectedBrands.map((brand) => (
//                     <TableCell
//                       key={brand.uuid}
//                       align="center"
//                       sx={{ width: `${80 / selectedBrands.length}%` }}
//                     >
//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         alignItems="center"
//                         mt={2}
//                       >
//                         <Tooltip title="Shortlisted" arrow>
//                           <Badge
//                             overlap="rectangular"
//                             anchorOrigin={{
//                               vertical: "top",
//                               horizontal: "right",
//                             }}
//                             badgeContent={<PlaylistAddCheckCircleOutlined />}
//                           >
//                             <Avatar
//                               variant="square" // <-- Makes the avatar rectangular
//                               src={brand.uploads?.brandLogo || ""}
//                               alt={brand.brandDetails?.brandName}
//                               sx={{
//                                 width: 100, // Adjust as needed
//                                 height: 80, // Adjust as needed
//                                 borderRadius: "8px", // Optional rounded corners
//                                 mb: 1,
//                                 border: "2px solid #ff9800",
//                                 bgcolor: "white",
//                                 p: 0.5,
//                               }}
//                             />
//                           </Badge>
//                         </Tooltip>
//                         <Typography
//                           variant="subtitle1"
//                           sx={{ fontWeight: "bold", color: "#4caf50" }}
//                         >
//                           {brand.brandDetails?.brandName || "-"}
//                         </Typography>
//                         <Chip
//                           label="Remove"
//                           size="small"
//                           onClick={() => onRemoveFromComparison(brand.uuid)}
//                           sx={{
//                             mt: 1,
//                             bgcolor: "#F2211D",
//                             color: "white",
//                             "&:hover": {
//                               bgcolor: "#fb8c00",
//                             },
//                           }}
//                         />
//                       </Box>
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {basicInfoFields.map((field) => (
//                   <TableRow key={field.label} hover>
//                     <TableCell
//                       component="th"
//                       scope="row"
//                       sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}
//                     >
//                       <Typography variant="subtitle2">{field.label}</Typography>
//                     </TableCell>
//                     {selectedBrands.map((brand) => {
//                       let value = getNestedValue(brand, field.field);

//                       if (
//                         field.label === "Requirement Support" &&
//                         Array.isArray(value)
//                       ) {
//                         value = value.join(", ");
//                       }

//                       return (
//                         <TableCell
//                           key={`${brand.uuid}-${field.field}`}
//                           align="center"
//                           sx={{
//                             borderLeft: "1px solid #e0e0e0",
//                             bgcolor:
//                               field.label === "Brand Name"
//                                 ? "#f5f5f5"
//                                 : "white",
//                           }}
//                         >
//                           {value}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 ))}

//                 <TableRow hover>
//                   <TableCell
//                     component="th"
//                     scope="row"
//                     sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}
//                   >
//                     <Typography variant="subtitle2">Franchise Model</Typography>
//                   </TableCell>
//                   {selectedBrands.map((brand) => {
//                     const models = brand.franchiseDetails?.fico || [];
//                     const currentIndex = currentModelIndexes[brand.uuid] || 0;
//                     const currentModel = models[currentIndex];

//                     return (
//                       <TableCell
//                         key={`${brand.uuid}-model-nav`}
//                         align="center"
//                         sx={{ bgcolor: "#f5f5f5" }}
//                       >
//                         {models.length > 0 ? (
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               p: 1,
//                               borderRadius: 1,
//                               bgcolor: "#fff8e1",
//                             }}
//                           >
//                             <IconButton
//                               size="small"
//                               onClick={() => handlePrevModel(brand.uuid)}
//                               disabled={models.length <= 1}
//                               sx={{ color: "#ff9800" }}
//                             >
//                               <ArrowBack fontSize="small" />
//                             </IconButton>

//                             <Box sx={{ mx: 1, minWidth: 120 }}>
//                               <Typography
//                                 variant="body2"
//                                 fontWeight="bold"
//                                 color="#4caf50"
//                               >
//                                 {currentModel?.franchiseModel || "-"}
//                               </Typography>
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                               >
//                                 {currentModel?.franchiseType || ""}
//                               </Typography>
//                               {models.length > 1 && (
//                                 <Typography
//                                   variant="caption"
//                                   display="block"
//                                   color="#ff9800"
//                                 >
//                                   ({currentIndex + 1} of {models.length})
//                                 </Typography>
//                               )}
//                             </Box>

//                             <IconButton
//                               size="small"
//                               onClick={() => handleNextModel(brand.uuid)}
//                               disabled={models.length <= 1}
//                               sx={{ color: "#ff9800" }}
//                             >
//                               <ArrowForward fontSize="small" />
//                             </IconButton>
//                           </Box>
//                         ) : (
//                           <Typography variant="body2">-</Typography>
//                         )}
//                       </TableCell>
//                     );
//                   })}
//                 </TableRow>

//                 {franchiseModelFields.slice(1).map((field) => (
//                   <TableRow key={field.label} hover>
//                     <TableCell
//                       component="th"
//                       scope="row"
//                       sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}
//                     >
//                       <Typography variant="subtitle2">{field.label}</Typography>
//                     </TableCell>
//                     {selectedBrands.map((brand) => {
//                       const models = brand.franchiseDetails?.fico || [];
//                       const currentIndex = currentModelIndexes[brand.uuid] || 0;
//                       const currentModel = models[currentIndex];

//                       return (
//                         <TableCell
//                           key={`${brand.uuid}-${field.field}`}
//                           align="center"
//                           sx={{
//                             borderLeft: "1px solid #e0e0e0",
//                             bgcolor: "white",
//                           }}
//                         >
//                           {currentModel ? (
//                             <Typography
//                               sx={{
//                                 color:
//                                   field?.label?.includes("Fee") ||
//                                   field?.label?.includes("Cost")
//                                     ? "#ff9800"
//                                     : "inherit",
//                                 fontWeight: field?.label?.includes("Investment")
//                                   ? "bold"
//                                   : "normal",
//                               }}
//                             >
//                               {currentModel?.[field.field] ?? "-"}
//                             </Typography>
//                           ) : (
//                             "-"
//                           )}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </DialogContent>
//       <DialogActions
//         sx={{ bgcolor: "#f5f5f5", position: "sticky", bottom: 0, zIndex: 1 }}
//       >
//         <Button
//           onClick={onClose}
//           sx={{
//             color: "white",
//             bgcolor: "#ff9800",
//             "&:hover": {
//               bgcolor: "#388e3c",
//             },
//           }}
//         >
//           Close Comparison
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default BrandComparison;
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Close,
  ArrowBack,
  ArrowForward,

} from "@mui/icons-material";
import { RiBookmark3Fill } from "react-icons/ri";
import axios from "axios";
import Navbar from "../../Components/Navbar/NavBar";

const BrandComparison = ({
  open,
  onClose,
  selectedBrands,
  onRemoveFromComparison,
}) => {
  const [currentModelIndexes, setCurrentModelIndexes] = useState({});
  const [brandDetails, setBrandDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   const fetchBrandDetails = async () => {
  if (selectedBrands.length === 0) return;

  setLoading(true);
  try {
    const promises = selectedBrands.map((brand) =>
      axios.get(`http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brand.uuid}`)
    );

    const responses = await Promise.all(promises);

    // Flatten each response's data if it's an array
    const details = responses.map((res) => {
      const data = res.data.data;
      return Array.isArray(data) ? data[0] : data;
    });

    console.log("✅ Flattened brand details:", details);
    setBrandDetails(details); // Now this will be an array of objects, not arrays

    // Initialize current model indexes
    const indexes = {};
    details.forEach((brand) => {
      if (brand?.uuid) indexes[brand.uuid] = 0;
    });
    setCurrentModelIndexes(indexes);
  } catch (error) {
    console.error("❌ Error fetching brand details:", error);
  } finally {
    setLoading(false);
  }
};

    fetchBrandDetails();
  }, [selectedBrands]);

 const getNestedValue = (obj, path) => {
  try {
    return (
      path.split(".").reduce((o, p) => {
        if (p.includes("[") && p.includes("]")) {
          const prop = p.substring(0, p.indexOf("["));
          const index = parseInt(
            p.substring(p.indexOf("[") + 1, p.indexOf("]"))
          );
          return o && o[prop] ? o[prop][index] : null;
        }
        return o ? o[p] : null;
      }, obj) ?? "-"
    );
  } catch (e) {
    return "-";
  }
};
const handleToggleShortList = async (brand) => {
    try {
      const response = await handleShortList(brand);
      if (response.success) {
        setAllBrands((prev) =>
          prev.map((b) =>
            b.uuid === brand.uuid ? { ...b, isShortListed: !b.isShortListed } : b
          )
        );
      }
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  };

 const handleNextModel = (brandId) => {
  setCurrentModelIndexes((prev) => {
    const brand = brandDetails.find(b => b.uuid === brandId);
    const models = brand?.brandfranchisedetails?.franchiseDetails?.fico || [];
    const currentIndex = prev[brandId] || 0;
    return {
      ...prev,
      [brandId]: (currentIndex + 1) % models.length
    };
  });
};
 const handlePrevModel = (brandId) => {
  setCurrentModelIndexes((prev) => {
    const brand = brandDetails.find(b => b.uuid === brandId);
    const models = brand?.brandfranchisedetails?.franchiseDetails?.fico || [];
    const currentIndex = prev[brandId] || 0;
    return {
      ...prev,
      [brandId]: (currentIndex - 1 + models.length) % models.length
    };
  });
};

  const basicInfoFields = [
    { label: "Brand Name", field: "brandDetails.brandName" },
    { label: "Company Name", field: "brandDetails.companyName" },
    { label: "Established Year", field: "brandfranchisedetails.franchiseDetails.establishedYear" },
    { label: "Total Outlets", field: "brandfranchisedetails.franchiseDetails.totalOutlets" },
    {
      label: "Company Owned Outlets",
      field: "brandfranchisedetails.franchiseDetails.companyOwnedOutlets",
    },
    { label: "Franchise Outlets", field: "brandfranchisedetails.franchiseDetails.franchiseOutlets" },
    {
      label: "Agreement Period",
      field: "brandfranchisedetails.franchiseDetails.fico[0].agreementPeriod",
    },
    { label: "Requirement Support", field: "brandfranchisedetails.franchiseDetails.consultationOrAssistance" },
  ];

  const franchiseModelFields = [
    { label: "Franchise Model", field: "franchiseModel" },
    { label: "Franchise Type", field: "franchiseType" },
    { label: "Area Required (sq.ft)", field: "areaRequired" },
    { label: "Investment Range", field: "investmentRange" },
    { label: "Franchise Fee", field: "franchiseFee" },
    { label: "Royalty Fee", field: "royaltyFee" },
    { label: "Break Even Period", field: "breakEven" },
    { label: "ROI", field: "roi" },
    { label: "Interior Cost", field: "interiorCost" },
    { label: "Other Costs", field: "otherCost" },
    { label: "Stock Investment", field: "stockInvestment" },
    { label: "Pay Back Period", field: "payBackPeriod" },
    { label: "Require Working Captial", field: "requireWorkingCapital" },
    { label: "Margin On Sales", field: "marginOnSales" },
    // { label: "Agreement Period", field: "agreementPeriod" },
  ];

  return (
 
<Box>
   <Box>
    <Navbar />
    </Box>
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      sx={{
        "& .MuiDialog-paper": {
          minHeight: "80vh",
          height: "90vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#f5f5f5",
          color: "Black",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Brand Comparison ({brandDetails.length})
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "black" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              Loading brand details...
            </Typography>
          </Box>
        ) : brandDetails.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              No brands selected for comparison
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                    Feature
                  </TableCell>
                  {brandDetails.map((brand) => (
                    <TableCell
                      key={brand.uuid}
                      align="center"
                      sx={{ width: `${80 / brandDetails.length}%` }}
                    >
                   <Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  mt={2}
  position="relative" // Needed for absolute positioning of the bookmark
>
  {/* Avatar with absolute positioned bookmark icon */}
  <Box position="relative">
    <Avatar
      variant="square"
      src={brand.uploads?.logo || ""}
      alt={brand.brandDetails?.brandName}
      sx={{
        width: 100,
        height: 80,
        borderRadius: "8px",
        mb: 1,
        border: "2px solid #ff9800",
        bgcolor: "white",
        p: 0.5,
      }}
    />
    
    {/* Bookmark icon positioned in top-right corner */}
    <Tooltip title={brand?.isShortListed ? "Remove from Shortlist" : "Add to Shortlist"}>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleToggleShortList(brand);
        }}
        sx={{
          position: 'absolute',
          top: '-10px',
          right:' -15px',
          padding: 0.5,
          color: brand?.isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }
        }}
        size="small"
      >
        <RiBookmark3Fill size={23} />
      </IconButton>
    </Tooltip>
  </Box>

  <Typography
    variant="subtitle1"
    sx={{ fontWeight: "bold", color: "#4caf50" }}
  >
    {brand.brandDetails?.brandName || "-"}
  </Typography>
  
  <Chip
    label="Remove"
    size="small"
    onClick={() => onRemoveFromComparison(brand.uuid)}
    sx={{
      mt: 1,
      bgcolor: "#F2211D",
      color: "white",
      "&:hover": {
        bgcolor: "#fb8c00",
      },
    }}
  />
</Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {basicInfoFields.map((field) => (
                  <TableRow key={field.label} hover>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}
                    >
                      <Typography variant="subtitle2">{field.label}</Typography>
                    </TableCell>
                    {brandDetails.map((brand) => {
                      let value = getNestedValue(brand, field.field);

                      if (
                        field.label === "Requirement Support" &&
                        Array.isArray(value)
                      ) {
                        value = value.join(", ");
                      }

                      return (
                        <TableCell
                          key={`${brand.uuid}-${field.field}`}
                          align="center"
                          sx={{
                            borderLeft: "1px solid #e0e0e0",
                            bgcolor:
                              field.label === "Brand Name"
                                ? "#f5f5f5"
                                : "white",
                          }}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}

                {/* <TableRow hover>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}
                  >
                    <Typography variant="subtitle2">Franchise Model</Typography>
                  </TableCell>
                  {brandDetails.map((brand) => {
                    const models = brand.franchiseDetails?.fico || [];
                    const currentIndex = currentModelIndexes[brand.uuid] || 0;
const currentModel = brand?.franchiseDetails?.fico?.[currentIndex];

                    return (
                      <TableCell
                        key={`${brand.uuid}-model-nav`}
                        align="center"
                        sx={{ bgcolor: "#f5f5f5" }}
                      >
                        {models.length > 0 ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              p: 1,
                              borderRadius: 1,
                              bgcolor: "#fff8e1",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handlePrevModel(brand.uuid)}
                              disabled={models.length <= 1}
                              sx={{ color: "#ff9800" }}
                            >
                              <ArrowBack fontSize="small" />
                            </IconButton>

                            <Box sx={{ mx: 1, minWidth: 120 }}>
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="#4caf50"
                              >
                               {currentModel?.franchiseModel || 
           (models[0]?.franchiseModel) || 
           (brand?.brandfranchisedetails?.franchiseDetails?.fico?.[0]?.franchiseModel) || 
           "-"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {currentModel?.franchiseType || 
           (models[0]?.franchiseType) || 
           (brand?.brandfranchisedetails?.franchiseDetails?.fico?.[0]?.franchiseType) || 
           ""}
                              </Typography>
                              {models.length > 1 && (
                                <Typography
                                  variant="caption"
                                  display="block"
                                  color="#ff9800"
                                >
                                  ({currentIndex + 1} of {models.length})
                                </Typography>
                              )}
                            </Box>

                            <IconButton
                              size="small"
                              onClick={() => handleNextModel(brand.uuid)}
                              disabled={models.length <= 1}
                              sx={{ color: "#ff9800" }}
                            >
                              <ArrowForward fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography variant="body2">-</Typography>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow> */}

               {franchiseModelFields.map((field) => (
  <TableRow key={field.label} hover>
    <TableCell
      component="th"
      scope="row"
      sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}
    >
      <Typography variant="subtitle2">{field.label}</Typography>
    </TableCell>
    {brandDetails.map((brand) => {
      const models = brand?.brandfranchisedetails?.franchiseDetails?.fico || [];
      const currentIndex = currentModelIndexes[brand.uuid] || 0;
      const currentModel = models[currentIndex];

      return (
        <TableCell
          key={`${brand.uuid}-${field.field}-${currentIndex}`}
          align="center"
          sx={{
            borderLeft: "1px solid #e0e0e0",
            bgcolor: "white",
          }}
        >
          {currentModel ? (
            <Typography
              sx={{
                color:
                  field?.label?.includes("Fee") ||
                  field?.label?.includes("Cost")
                    ? "#ff9800"
                    : "inherit",
                fontWeight: field?.label?.includes("Investment")
                  ? "bold"
                  : "normal",
              }}
            >
              {getNestedValue(currentModel, field.field.replace(/^brandfranchisedetails\.franchiseDetails\.fico\[\d+\]\./, ''))}
            </Typography>
          ) : (
            "-"
          )}
        </TableCell>
      );
    })}
  </TableRow>
))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions
        sx={{ bgcolor: "#f5f5f5", position: "sticky", bottom: 0, zIndex: 1 }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            bgcolor: "#ff9800",
            "&:hover": {
              bgcolor: "#388e3c",
            },
          }}
        >
          Close Comparison
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
};

export default BrandComparison;