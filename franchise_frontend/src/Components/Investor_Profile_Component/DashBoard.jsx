// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Typography,
//     Avatar,
//     Tabs,
//     Tab
// } from "@mui/material";
// import PersonIcon from '@mui/icons-material/Person';
// import img from "../../assets/images/brandLogo.jpg";
// import axios from 'axios';
// import { set } from 'react-hook-form';

// const DashBoard = ({ selectedSection, sectionContent }) => {
//     const [tabValue, setTabValue] = useState(0);
//     const [brandData, setBrandData] = useState([]);
// const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const handleTabChange = (event, newValue) => {
//         setTabValue(newValue);
//     };

//     // Axios GET API call
//     useEffect(() => {
//         const fetchBrandData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get("");
//                 setBrandData(response.data); // assuming response.data is an array
//             } catch (error) {
//                 console.error("API Error:", error);
//             }
//         };

//         fetchBrandData();
//     }, []);

//     const renderTabContent = () => {
//         const label = ["Expressed Interest", "Viewed Brands", "Liked Brands", "Short List"][tabValue];

//         return (
//             <Box sx={{ p: 2 }}>
//                 <Typography variant="h6">{label}</Typography>
//                 {brandData.length > 0 ? (
//                     <ul>
//                         {brandData.map((item, idx) => (
//                             <li key={idx}>{item.name || JSON.stringify(item)}</li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <Typography>No data available.</Typography>
//                 )}
//             </Box>
//         );
//     };

//     return (
//         <div>
//             <Typography variant="h6" fontWeight={600} mb={2}>
//                 Dashboard
//             </Typography>
//             <Box sx={{ display: "flex", minHeight: "85vh", bgcolor: "#f4f6f8" }}>
//                 <Box sx={{ flex: 1, p: 3 }}>
//                     {selectedSection ? (
//                         sectionContent[selectedSection]
//                     ) : (
//                         <Box sx={{ display: "flex", gap: 4 }}>
//                             <Box sx={{
//                                 width: 240, height: 200, textAlign: "center",
//                                 bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2
//                             }}>
//                                 <Avatar sx={{
//                                     width: 200, height: 200, mx: "auto", mb: 2,
//                                     bgcolor: "transparent"
//                                 }}>
//                                     <img
//                                         src={img}
//                                         alt="Profile"
//                                         loading='lazy'
//                                         style={{ width: "140%", height: "105%", borderRadius: "50%" }}
//                                     />
//                                     <PersonIcon fontSize="large" />
//                                 </Avatar>
//                             </Box>

//                             <Box sx={{ flex: 1 }}>
//                                 <Box sx={{
//                                     mb: 3, bgcolor: "#fff", p: 2, borderRadius: 2,
//                                     boxShadow: 2, width: "90%", textAlign: "center",
//                                     height: "40%", paddingTop: "65px", paddingBottom: "65px"
//                                 }}>
//                                     <Typography variant="h4" fontWeight={600}>
//                                         Welcome (Manikandan.M)
//                                     </Typography>
//                                     <Typography color="text.secondary" variant="h5">
//                                         Investor
//                                     </Typography>
//                                     <Typography color="text.secondary" variant="h5" fontWeight={800}>
//                                         ID(721720104305)
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </Box>
//                     )}

//                     {/* Dashboard Tabs Section */}
//                     {!selectedSection || selectedSection === "Dashboard" ? (
//                         <>
//                             <Box sx={{ mt: 4 }}>
//                                 <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
//                                     <Tabs value={tabValue} onChange={handleTabChange} centered>
//                                         <Tab label="Expressed Interest" />
//                                         <Tab label="Viewed Brands" />
//                                         <Tab label="Liked Brands" />
//                                         <Tab label="Short List" />
//                                     </Tabs>
//                                 </Box>
//                                 <Box>
//                                     {renderTabContent()}
//                                 </Box>
//                             </Box>
//                         </>
//                     ) : (
//                         sectionContent[selectedSection]
//                     )}
//                 </Box>
//             </Box>
//         </div>
//     );
// };

// export default DashBoard;
import React from 'react'

function DashBoard() {
  return (
    <div>
      hello
    </div>
  )
}

export default DashBoard
