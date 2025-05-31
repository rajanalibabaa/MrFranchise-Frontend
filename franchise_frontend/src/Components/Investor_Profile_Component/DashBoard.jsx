import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme, useMediaQuery } from '@mui/material';
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import axios from "axios";
import { useSelector } from "react-redux";
import img from "../../assets/images/brandLogo.jpg";

const DashBoard = ({ selectedSection, sectionContent }) => {
     const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [investorInfo, setInvestorInfo] = useState(null);
  const [viewedBrands, setViewedBrands] = useState([]);
  const [likedBrands, setLikedBrands] = useState([]);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const [showMore, setShowMore] = useState({});
  const [removeMsg, setremoveMsg] = useState("");
  const [viewStatus, setviewStatus] = useState({});
  
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);

  useEffect(() => {
    const fetchInvestor = async () => {
      if (!investorUUID || !AccessToken) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/like/get-favbrands/${investorUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );

        const data = response?.data?.data || [];
        setInvestorInfo(data);

        setLikedBrands(data);

        // console.log(" ==== :",data.length)

        // Initialize likedStates
        const initialLiked = {};
        data.forEach((item, idx) => {
          const id = item.brandDetails?.brandId || item._id || item.id || idx;
          initialLiked[id] = true;
        });
        setLikedStates(initialLiked);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchInvestor();
  }, [investorUUID, AccessToken]);
  useEffect(() => {
    const fetchInvestor = async () => {
      if (!investorUUID || !AccessToken) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/view/getAllViewBrands/${investorUUID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AccessToken}`,
            },
          }
        );

        const data = response?.data?.data || [];
        setviewStatus(data);

        setviewStatus(data);

        // console.log(" ==== :",data.length)

        // Initialize likedStates
        const initialLiked = {};
        data.forEach((item, idx) => {
          const id = item.brandDetails?.brandId || item._id || item.id || idx;
          initialLiked[id] = true;
        });
        setLikedStates(initialLiked);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchInvestor();
  }, [investorUUID, AccessToken]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

//   console.log(" ========== :",isMobile)
  

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleLike = async (brandID) => {
  try {
    // Optimistically update like state
    setLikedStates((prev) => ({ ...prev, [brandID]: !prev[brandID] }));

    
    setTimeout(() => {
        setLikedBrands((prev) => prev.filter((item) => item.uuid !== brandID));
    }, 1000);

    // Call delete API
    const response = await axios.delete(
      `http://localhost:5000/api/v1/like/delete-favbrand/${investorUUID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`,
        },
        data: { brandID }, // Pass brandID correctly in request body
      }
    );

    // Show success message
    if (response.status === 200) {
      setremoveMsg("Brand removed successfully.");
    } else {
      setremoveMsg("Failed to remove brand.");
    }
  } catch (error) {
    console.error("Remove error:", error);
    setremoveMsg("Something went wrong while removing the brand.");
  }

  // Auto-hide message
  setTimeout(() => {
    setremoveMsg("");
  }, 1000);
};


  const toggleShowMore = (brandId) => {
    setShowMore((prev) => ({ ...prev, [brandId]: !prev[brandId] }));
  };

const handleViewBTN = (brandId) => {
  console.log("Clicked brandId:", brandId);

  viewStatus.map((value, index) => {
    // console.log(value);
    if (value.uuid === brandId) {
      console.log(value.uuid);
      console.log(value);
    }
  });
  
};

  const renderTabContent = () => {
    switch (tabValue) {
     case 0:
  return viewStatus.length > 0 ? (
    <Grid container spacing={3}>
      {viewStatus.map((item, idx) => {
        const brandId = item.uuid;

        return (
         <Grid item sm={6} md={4} lg={3} key={brandId} sx={{ display: "flex", justifyContent: "center" }}>
  <Card
    sx={{
      width: "345px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      boxShadow: 3,
      "&:hover": { boxShadow: 6 },
    }}
  >
    {/* Exit Button */}
    <IconButton
      size="small"
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 2,
        backgroundColor: "#fff",
        boxShadow: 1,
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
      onClick={() => handleRemoveCard(brandId)} // your custom handler
    >
      <CloseIcon fontSize="small" />
    </IconButton>

    {/* Brand Image */}
    <CardMedia
      component="img"
      height="160"
      image={
        item.brandDetails?.brandLogo?.[0] ||
        "https://via.placeholder.com/300x160?text=No+Image"
      }
      alt={item.personalDetails?.brandName || "Brand Image"}
    />

    {/* Brand Info */}
    <CardContent>
      <Typography
        variant="h6"
        component="div"
        noWrap
        title={item.personalDetails?.brandName || "Unnamed Brand"}
      >
        {item.personalDetails?.brandName || "Unnamed Brand"}
      </Typography>

      {item.franchiseDetails?.modelsOfFranchise?.length > 0 && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Franchise Models: </strong>
          {item.franchiseDetails.modelsOfFranchise.map((value, index) => (
            <span key={index} style={{ marginRight: "6px" }}>
              {value.franchiseModel}
              {index !== item.franchiseDetails.modelsOfFranchise.length - 1 ? "," : ""}
            </span>
          ))}
        </Typography>
      )}
    </CardContent>
    <Button
    sx={{backgroundColor:"green",color:"white"}}
    onClick={() => handleViewBTN(brandId)}
    >VIEW DETAILS</Button>
  </Card>
</Grid>
        );
      })}
    </Grid>
  ) : (
    <Typography>No viewed brands available.</Typography>
  );

      case 1:
        return likedBrands.length > 0 ? (
          isMobile ? (
            <Grid container spacing={3}
            sx={{display:"flex", justifyContent:"center",alignItems:"center"}}
          >
            {likedBrands.map((item, idx) => {
              const brandId = item.uuid;

              return (
                <Grid item sm={6} md={4} lg={3} key={brandId}
                    sx={{display:"flex", justifyContent:"center",}}
                >
                 <Card
                    sx={{
                        width: "345px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        boxShadow: 3,
                        "&:hover": { boxShadow: 6 },
                        
                    }}
                    >
                    {/* Favorite Icon */}
                    <FavoriteIcon
                        onClick={() => toggleLike(brandId)}
                        sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        cursor: "pointer",
                        color: likedStates[brandId] ? "gray" : "red",
                        transition: "color 0.3s",
                        zIndex: 10,
                        }}
                    />

                    {/* Brand Image */}
                    <CardMedia
                        component="img"
                        height="160"
                        image={
                        item.brandDetails?.brandLogo?.[0] ||
                        "https://via.placeholder.com/300x160?text=No+Image"
                        }
                        alt={item.personalDetails?.brandName || "Brand Image"}
                    />

                    {/* Brand Info */}
                    <CardContent>
                        {/* Brand Name */}
                        <Typography
                        variant="h6"
                        component="div"
                        noWrap
                        title={item.personalDetails?.brandName || "Unnamed Brand"}
                        >
                        {item.personalDetails?.brandName || "Unnamed Brand"}
                        </Typography>

                        {/* Franchise Models */}
                        {item.franchiseDetails?.modelsOfFranchise?.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Franchise Models: </strong>
                            {item.franchiseDetails.modelsOfFranchise.map((value, index) => (
                            <span key={index} style={{ marginRight: "6px" }}>
                                {value.franchiseModel}
                                {index !== item.franchiseDetails.modelsOfFranchise.length - 1 ? "," : ""}
                            </span>
                            ))}
                        </Typography>
                        )}
                    </CardContent>

                    {/* Brand Description */}
                    <CardContent
                        sx={{
                        pt: 0,
                        mt: "auto",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        }}
                    >
                        {/* Description Title */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Description:
                        </Typography>

                        {item.personalDetails?.brandDescription ? (
                        showMore[brandId] ? (
                            <Typography variant="body2" color="text.secondary">
                            {item.personalDetails.brandDescription}
                            <Typography
                                component="span"
                                onClick={() => toggleShowMore(brandId)}
                                sx={{
                                cursor: "pointer",
                                color: "primary.main",
                                ml: 0.5,
                                userSelect: "none",
                                fontWeight: "bold",
                                }}
                            >
                                ...Less
                            </Typography>
                            </Typography>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                            {item.personalDetails.brandDescription.slice(0, 100)}
                            {item.personalDetails.brandDescription.length > 100 && (
                                <Typography
                                component="span"
                                onClick={() => toggleShowMore(brandId)}
                                sx={{
                                    cursor: "pointer",
                                    color: "primary.main",
                                    ml: 0.5,
                                    userSelect: "none",
                                    fontWeight: "bold",
                                }}
                                >
                                ...More
                                </Typography>
                            )}
                            </Typography>
                        )
                        ) : (
                        <Typography variant="body2" color="text.secondary">
                            No description provided.
                        </Typography>
                        )}
                    </CardContent>
                </Card>


                </Grid>
              );
            })}
          </Grid>
          ):(
            <Grid container spacing={3}
           
          >
            {likedBrands.map((item, idx) => {
              const brandId = item.uuid;

              return (
                <Grid item sm={6} md={4} lg={3} key={brandId}
                    sx={{
                        justifyContent: {
                            xs:"center",
                            sm:"center",
                        }
                    }}
                >
                 <Card
                    sx={{
                        width: "345px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        boxShadow: 3,
                        "&:hover": { boxShadow: 6 },
                        
                    }}
                    >
                    {/* Favorite Icon */}
                    <FavoriteIcon
                        onClick={() => toggleLike(brandId)}
                        sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        cursor: "pointer",
                        color: likedStates[brandId] ? "gray" : "red",
                        transition: "color 0.3s",
                        zIndex: 10,
                        }}
                    />

                    {/* Brand Image */}
                    <CardMedia
                        component="img"
                        height="160"
                        image={
                        item.brandDetails?.brandLogo?.[0] ||
                        "https://via.placeholder.com/300x160?text=No+Image"
                        }
                        alt={item.personalDetails?.brandName || "Brand Image"}
                    />

                    {/* Brand Info */}
                    <CardContent>
                        {/* Brand Name */}
                        <Typography
                        variant="h6"
                        component="div"
                        noWrap
                        title={item.personalDetails?.brandName || "Unnamed Brand"}
                        >
                        {item.personalDetails?.brandName || "Unnamed Brand"}
                        </Typography>

                        {/* Franchise Models */}
                        {item.franchiseDetails?.modelsOfFranchise?.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Franchise Models: </strong>
                            {item.franchiseDetails.modelsOfFranchise.map((value, index) => (
                            <span key={index} style={{ marginRight: "6px" }}>
                                {value.franchiseModel}
                                {index !== item.franchiseDetails.modelsOfFranchise.length - 1 ? "," : ""}
                            </span>
                            ))}
                        </Typography>
                        )}
                    </CardContent>

                    {/* Brand Description */}
                    <CardContent
                        sx={{
                        pt: 0,
                        mt: "auto",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        }}
                    >
                        {/* Description Title */}
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Description:
                        </Typography>

                        {item.personalDetails?.brandDescription ? (
                        showMore[brandId] ? (
                            <Typography variant="body2" color="text.secondary">
                            {item.personalDetails.brandDescription}
                            <Typography
                                component="span"
                                onClick={() => toggleShowMore(brandId)}
                                sx={{
                                cursor: "pointer",
                                color: "primary.main",
                                ml: 0.5,
                                userSelect: "none",
                                fontWeight: "bold",
                                }}
                            >
                                ...Less
                            </Typography>
                            </Typography>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                            {item.personalDetails.brandDescription.slice(0, 100)}
                            {item.personalDetails.brandDescription.length > 100 && (
                                <Typography
                                component="span"
                                onClick={() => toggleShowMore(brandId)}
                                sx={{
                                    cursor: "pointer",
                                    color: "primary.main",
                                    ml: 0.5,
                                    userSelect: "none",
                                    fontWeight: "bold",
                                }}
                                >
                                ...More
                                </Typography>
                            )}
                            </Typography>
                        )
                        ) : (
                        <Typography variant="body2" color="text.secondary">
                            No description provided.
                        </Typography>
                        )}
                    </CardContent>
                </Card>


                </Grid>
              );
            })}
          </Grid>
          )
        ) : (
          <Typography>No interested brands available.</Typography>
        );

      case 2:
        return appliedBrands.length > 0 ? (
          <ul>
            {appliedBrands.map((item, idx) => (
              <li key={idx}>{item.name || JSON.stringify(item)}</li>
            ))}
          </ul>
        ) : (
          <Typography>No applied brands available.</Typography>
        );

      default:
        return <Typography>No data available.</Typography>;
    }
  };

  return (
    <Box

      sx={{
        minHeight: "85vh",
        bgcolor: "#f4f6f8",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Dashboard Title */}
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
        sx={{
          textAlign: "center",
          color: "#fafafa",
          backgroundColor: "#689f38",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        Dashboard
      </Typography>

      {/* Profile + Welcome Section */}
      {!selectedSection || selectedSection === "Dashboard" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "center",
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 230,
              height: 210,
              bgcolor: "transparent",
              position: "relative",
            }}
          >
            <img
              src={img}
              alt="Profile"
              loading="lazy"
              style={{
                width: "90%",
                height: "110%",
                borderRadius: "40%",
                objectFit: "cover",
              }}
            />
            <PersonIcon
              fontSize="large"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#ccc",
              }}
            />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
              Welcome {investorInfo?.firstName || "Investor"}
            </Typography>
            <Typography color="text.secondary" variant="h5">
              Investor
            </Typography>
          </Box>
        </Box>
      ) : (
        sectionContent[selectedSection]
      )}

      {/* Tabs */}
      {!selectedSection || selectedSection === "Dashboard" ? (
        <>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
            variant="fullWidth"
            scrollButtons="auto"
          >
            <Tab
              label={
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FavoriteIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  Viewed Brands 
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="primary"
                  sx={{ ml: 0.5 }}
                >
                  ({viewStatus?.length || 0})
                </Typography>
              </Box>

              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FavoriteIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  Interested Brands
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="primary"
                  sx={{ ml: 0.5 }}
                >
                  ({likedBrands?.length || 0})
                </Typography>
              </Box>

              }
            />
            <Tab
              label={
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FavoriteIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  Applied List 
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="primary"
                  sx={{ ml: 0.5 }}
                >
                  ({likedBrands?.length || 0})
                </Typography>
              </Box>               
              }
            />
          </Tabs>

          {/* Tab Content */}
          <Box>{renderTabContent()}</Box>
        </>
      ) : (
        sectionContent[selectedSection]
      )}
    </Box>
  );
};

export default DashBoard;
