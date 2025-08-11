import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Tooltip,
  Pagination,
  Stack,
} from "@mui/material";
import {
  Favorite,
  Visibility,
  AssignmentTurnedIn,
  Close,
  Business,
  Bookmark 
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useMediaQuery, useTheme } from '@mui/material';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import img from "../../assets/images/brandLogo.jpg";
import { api } from "../../Api/api";
import { RiBookmark3Fill } from "react-icons/ri";
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice";
import { fetchShortListedById , removeFromShortlist } from "../../Redux/Slices/shortlistslice";
import { fetchLikedBrandsById, removeFromLikedBrands } from "../../Redux/Slices/likeSlice";
import { fetchViewBrandsById, removeviewBrand, clearviewBrands } from "../../Redux/Slices/viewSlice"; 
import { handleShortList } from "../../Api/shortListApi"

const StatCard = memo(({ icon, title, value, color, isSelected, onClick }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 240, md: 260 },
        minHeight: { xs: 40, sm: 72 },
        borderRadius: 2,
        px: { xs: 1, sm: 1.5 },
        py: 0,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
        bgcolor: isSelected ? `rgba(${color}, 0.25)` : `rgba(${color}, 0.05)`,
        border: '1px solid',
        borderColor: isSelected ? `rgba(${color}, 0.5)` : `rgba(${color}, 0.1)`,
        transition: 'all 0.2s ease-out',
        boxShadow: isSelected ? `0 4px 16px -2px rgba(${color}, 0.4)` : 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: { xs: 'none', sm: 'translateY(-2px)' },
          boxShadow: isSelected 
            ? `0 4px 16px -2px rgba(${color}, 0.4)`
            : { xs: 'none', sm: `0 4px 12px -2px rgba(${color}, 0.15)` },
          bgcolor: isSelected 
            ? `rgba(${color}, 0.25)`
            : { xs: `rgba(${color}, 0.05)`, sm: `rgba(${color}, 0.08)` },
          '& .stat-icon': {
            transform: { xs: 'none', sm: 'scale(1.05)' }
          }
        },
        '@media (hover: none)': {
          '&:active': {
            bgcolor: `rgba(${color}, 0.1)`
          }
        }
      }}
    >
      <Box
        className="stat-icon"
        sx={{
          flexShrink: 0,
          p: { sm: 1 },
          borderRadius: '50%',
          bgcolor: isSelected ? `rgba(${color}, 0.3)` : `rgba(${color}, 0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease-out',
          boxShadow: `inset 0 0 0 1px rgba(${color}, ${isSelected ? '0.4' : '0.15'})`,
          '& > svg': {
            fontSize: { xs: '13px', sm: '15px', md: '22px' }
          },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            color: isSelected ? `rgba(${color}, 1)` : `rgb(${color})`,
            fontSize: { xs: '16px', sm: '10px', md: '22px' },
            transition: 'color 0.2s ease-out'
          }
        })}
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-end', sm: 'center' },
          justifyContent: 'end',
          gap: { xs: 0.5, sm: 1 }
        }}
      >
        {isSm && (
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: isSelected ? 600 : 500,
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              color: isSelected ? `rgba(${color}, 0.9)` : 'text.secondary',
              lineHeight: 1.3,
              transition: 'all 0.2s ease-out'
            }}
          >
            {title}
          </Typography>
        )}

        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: isSelected ? 700 : 600,
            fontSize: { xs: '0.6rem', sm: '1rem', md: '1.125rem' },
            lineHeight: 1.2,
            background: isSelected 
              ? `linear-gradient(75deg, rgba(${color}, 1) 0%, rgba(${color}, 0.8) 100%)`
              : `linear-gradient(75deg, rgb(${color}) 0%, rgba(${color}, 0.9) 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            '@media (hover: hover)': {
              textShadow: isSelected 
                ? `0 0 8px rgba(${color}, 0.4)`
                : `0 0 6px rgba(${color}, 0.2)`
            },
            transition: 'all 0.2s ease-out'
          }}
        >
          {value}
        </Typography>
      </Box>
    </Card>
  );
});

const BrandCard = memo(({ item, type, likedStates, shortlistedStates, onViewDetails, onToggleLike, onToggleShortlist, onToggleViewClose }) => {  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!item || typeof item !== 'object') return null;

  const brandId = item.uuid || item.brandID?.uuid || item.brandID;
  const isLiked = brandId ? likedStates[brandId] : false;
  const isShortlisted = brandId ? shortlistedStates[brandId] : false;
  
  const wrapAfter30 = (str) => {
    if (!str) return "";
    return str.replace(/(.{30})/g, "$1\u200B");
  };

  const brandName =
    item?.brandName ||
    item?.brandname ||
    item?.brandDetails?.brandName ||
    (typeof item?.brandID === "object" && item.brandID?.brandName) ||
    item?.name ||
    item?.brand_title ||
    "Unnamed Brand";

  const brandLogo =
    item?.logo ||
    item?.brandLogo ||
    item?.brandDetails?.brandLogo ||
    (typeof item?.brandID === "object" ? item.brandID?.brandLogo : null) ||
    item?.uploads?.brandLogo?.[0] ||
    item?.image ||
    img;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} style={{ minWidth: 0 }}>
      <Card
        sx={{
          p: 1.5,
          borderRadius: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(242, 151, 36, 0.2)",
          },
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {!isMobile && (
          <Stack direction="column" spacing={0.5} sx={{ position: "absolute", top: 4, right: 4, zIndex: 2 }}>
            {type === 'liked' && (
              <IconButton
                sx={{
                  color: isLiked ? "#ff5252" : "rgba(0,0,0,0.2)",
                  "&:hover": { color: "#ff5252" },
                }}
                onClick={() => onToggleLike(brandId)}
              >
                <Favorite fontSize="small" />
              </IconButton>
            )}
     {type === 'shortlisted' && (
  <IconButton 
    sx={{ 
      color: isShortlisted ? "#689f38" : "rgba(0,0,0,0.2)",
      "&:hover": { color: "#689f38" },
    }}
    onClick={async (e) => {
      e.stopPropagation();
      await onToggleShortlist(brandId);
    }}
  >
    <Tooltip title={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}>
      <RiBookmark3Fill size={21} />
    </Tooltip>
  </IconButton>
)}

          </Stack>
        )}

{isMobile && (
          <Stack direction="row" spacing={0.5}>
            {type === 'liked' && (
              <IconButton
                sx={{
                  color: isLiked ? "#ff5252" : "rgba(0,0,0,0.2)",
                  "&:hover": { color: "#ff5252" },
                }}
                onClick={() => onToggleLike(brandId)}
              >
                <Favorite fontSize="small" />
              </IconButton>
            )}
             {type === 'shortlisted' && (
  <IconButton 
    sx={{ 
      color: "#689f38",
      "&:hover": { color: "#689f38" },
    }}
    onClick={async () => {
      await onToggleShortlist(brandId); // remove from shortlist
    }}
  >
    <Tooltip title="Remove from shortlist">
      <RiBookmark3Fill size={21} />
    </Tooltip>
  </IconButton>
)}

          </Stack>
        )}

        <Box
          component="img"
          src={brandLogo}
          alt={brandName}
          loading="lazy"
          sx={{
            width: 100,
            height: 80,
            border: "1px solid #f29724",
            mb: 1,
            objectFit: "contain",
          }}
        />

        <Typography
          variant="caption"
          fontWeight={600}
          textAlign="center"
          sx={{
            mb: 0.5,
            whiteSpace: "normal",
            overflowWrap: "break-word",
            width: "100%",
            px: 0.5,
          }}
        >
          {brandName}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            maxWidth: "300px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 0.5,
            mt: 0.5,
            mb: 1,
            width: "100%",
            textAlign: "center",
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {wrapAfter30(item.brandCategories?.child)}
        </Typography>

        <Stack direction="column" spacing={0.5} sx={{ mb: 0.5, width: "100%" }}>
          <Typography variant="caption" fontWeight={500}>
            Investment : {item.fico?.investmentRange || "N/A"}
          </Typography>
          <Typography variant="caption" fontWeight={500}>
            Area : {item.fico?.areaRequired || "N/A"}
          </Typography>
          <Typography variant="caption" fontWeight={500}>
            Type : {item.fico?.franchiseModel || "N/A"}
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          aria-label="apply now"
          size="small"
          fullWidth
          onClick={() => onViewDetails(item)}
          sx={{
            mt: "auto",
            borderRadius: 2,
            fontSize: "0.7rem",
            py: 0.5,
            borderColor: "#f29724",
            color: "green",
            "&:hover": {
              backgroundColor: "rgba(250, 141, 8, 0.7)",
            },
          }}
        >
          View Details
        </Button>
      </Card>
    </motion.div>
  );
});

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const [shortlistedStates, setShortlistedStates] = useState({});
  const [removeMsg, setRemoveMsg] = useState("");
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const investorUUID = useSelector((state) => state.auth?.investorUUID);  
  const AccessToken = useSelector((state) => state.auth?.AccessToken);
  const shortListState = useSelector(state => state.shortList);
  const likedBrandsState = useSelector(state => state.likedBrands);
  const viewBrandsState = useSelector(state => state.viewBrands);

  const { brands: viewedBrands, pagination: viewPagination } = viewBrandsState;
  const shortlistedBrands = Array.isArray(shortListState.brands) ? shortListState.brands : [];
  const likedBrands = Array.isArray(likedBrandsState.brands) ? likedBrandsState.brands : [];

  const isLoading = likedBrandsState.isLoading || shortListState.isLoading;
  const errorMessage = likedBrandsState.error || shortListState.error;

  const stats = useMemo(() => ({
    totalViews: viewPagination?.totalItems || viewedBrands?.length || 0,
    totalLikes: likedBrands.length,
    totalApplications: appliedBrands.length,
    totalShortlisted: Object.values(shortlistedStates).filter(Boolean).length,
  }), [viewedBrands, viewPagination, likedBrands, appliedBrands, shortlistedStates]);

  useEffect(() => {
    const initialLiked = {};
    likedBrands.forEach(item => {
      const brandId = item.uuid || item.brandID?.uuid || item.brandID;
      if (brandId) initialLiked[brandId] = true;
    });
    setLikedStates(initialLiked);

    const initialShortlisted = {};
    shortlistedBrands.forEach(item => {
      const brandId = item.uuid || item.brandID?.uuid || item.brandID;
      if (brandId) initialShortlisted[brandId] = true;
    });
    setShortlistedStates(initialShortlisted);
  }, [likedBrands, shortlistedBrands]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tabValue]);

// Modify your fetchData function to handle errors better
const fetchData = useCallback(async () => {
  if (!investorUUID || !AccessToken) return;

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AccessToken}`,
      }
    };

    // Dispatch all requests in parallel
    await Promise.all([
      dispatch(fetchLikedBrandsById({ userId: investorUUID })),
      dispatch(fetchShortListedById({ investorUUID })),
      dispatch(fetchViewBrandsById({ userId: investorUUID })),
      axios.get(`${api.instantApplyApi.get.getInstaApplyById}/${investorUUID}`, config)
        .then(res => {
          setAppliedBrands(Array.isArray(res.data?.data) ? res.data.data : []);
        }),
      axios.get(`${api.user.get.investor}/${investorUUID}`, config)
        .then(res => {
          setUserData(res.data?.data || null);
        })
    ]);

  } catch (error) {
    console.error("Error in fetchData:", error);
  }
}, [investorUUID, AccessToken, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleLike = useCallback(async (brandId) => {
    if (!brandId) return;

    const brandToRemove = likedBrands.find(brand =>
      brand.uuid === brandId ||
      brand.brandID?.uuid === brandId ||
      brand.brandID === brandId
    );

    if (!brandToRemove) return;

    const apiBrandId = brandToRemove.uuid || brandToRemove.brandID?.uuid || brandToRemove.brandID;

    setLikedStates(prev => {
      const newState = { ...prev };
      delete newState[brandId];
      return newState;
    });

    try {
      await dispatch(removeFromLikedBrands(apiBrandId)).unwrap();
      setRemoveMsg("Brand removed successfully");
      setTimeout(() => setRemoveMsg(""), 3000);
      dispatch(fetchLikedBrandsById({ userId: investorUUID }));
    } catch (error) {
      console.error("Remove error:", error);
      setRemoveMsg(error.message || "Failed to remove brand");
      setLikedStates(prev => ({ ...prev, [brandId]: true }));
    }
  }, [investorUUID, dispatch, likedBrands]);

const toggleShortlist = useCallback(async (brandId) => {
  if (!brandId) return;

  try {
    // Optimistic UI update
    setShortlistedStates(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));

    // Call API to toggle shortlist status
    await handleShortList(brandId);
    
    // Refresh data from server
    const response = await dispatch(fetchShortListedById({ investorUUID }));
    console.log('Server response:', response); // Now properly inside the function
    
    if (response?.payload?.brands) {
      const updatedStates = {};
      response.payload.brands.forEach(brand => {
        const id = brand.uuid || brand.brandID?.uuid || brand.brandID;
        if (id) updatedStates[id] = true;
      });
      setShortlistedStates(updatedStates);
    }

    setRemoveMsg(shortlistedStates[brandId] 
      ? "Brand removed from shortlist" 
      : "Brand added to shortlist");
    
    setTimeout(() => setRemoveMsg(""), 3000);
  } catch (error) {
    // Revert on error
    setShortlistedStates(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
    console.error("Shortlist toggle error:", error);
    setRemoveMsg(error.message || "Failed to update shortlist");
  }
}, [investorUUID, dispatch, shortlistedStates]);
useEffect(() => {
  console.log('Shortlisted brands from Redux:', shortlistedBrands);
}, [shortlistedBrands]);

  const toggleViewClose = useCallback(async (brandId) => {
    if (!investorUUID || !AccessToken || !brandId) return;

    try {
      await dispatch(removeviewBrand({
        userId: investorUUID,
        brandId,
        token: AccessToken
      })).unwrap();

      setRemoveMsg("Brand removed from view history");
      setTimeout(() => setRemoveMsg(""), 3000);
      dispatch(fetchViewBrandsById({ userId: investorUUID }));
    } catch (error) {
      console.error("Error removing viewed brand:", error);
      setRemoveMsg(error.message || "Failed to remove brand from view history");
    }
  }, [investorUUID, AccessToken, dispatch]);

  const handleViewDetails = useCallback((brand) => {
    dispatch(openBrandDialog(brand));
  }, [dispatch]);

  const getCurrentBrands = useCallback(() => {
    let brands = [];
    switch(tabValue) {
      case 0: brands = Array.isArray(viewedBrands) ? viewedBrands : []; break;
      case 1: brands = Array.isArray(likedBrands) ? likedBrands : []; break;
      case 2: brands = Array.isArray(appliedBrands) ? appliedBrands : []; break;
      case 3: brands = Array.isArray(shortlistedBrands) ? shortlistedBrands : []; break;
      default: brands = [];
    }
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return brands.slice(indexOfFirstItem, indexOfLastItem);
  }, [tabValue, viewedBrands, likedBrands, appliedBrands, shortlistedBrands, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    let brands = [];
    switch(tabValue) {
      case 0: brands = Array.isArray(viewedBrands) ? viewedBrands : []; break;
      case 1: brands = Array.isArray(likedBrands) ? likedBrands : []; break;
      case 2: brands = Array.isArray(appliedBrands) ? appliedBrands : []; break;
      case 3: brands = Array.isArray(shortlistedBrands) ? shortlistedBrands : []; break;
      default: brands = [];
    }
    return Math.max(1, Math.ceil(brands.length / itemsPerPage));
  }, [tabValue, viewedBrands, likedBrands, appliedBrands, shortlistedBrands, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  
  const renderTabContent = useMemo(() => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (errorMessage) {
      return (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      );
    }

    const currentBrands = getCurrentBrands();
    let emptyState = {
      icon: <Business color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
      title: "No data available",
      description: "There are no items to display"
    };

    switch(tabValue) {
      case 0: 
        emptyState = {
          icon: <Visibility color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
          title: "No viewed brands",
          description: "Brands you view will appear here"
        };
        break;
      case 1: 
        emptyState = {
          icon: <Favorite color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
          title: "No liked brands yet",
          description: "Like brands to save them for later"
        };
        break;
      case 2: 
        emptyState = {
          icon: <AssignmentTurnedIn color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
          title: "No applications yet",
          description: "Your applications will appear here"
        };
        break;
      case 3: 
        emptyState = {
          icon: <Bookmark color="disabled" sx={{ fontSize: 60, mb: 2 }} />,
          title: "No shortlisted brands",
          description: "Brands you shortlist will appear here"
        };
        break;
      default: 
    }

    return (
      <>
        {currentBrands.length > 0 ? (
          <>
            <Grid container spacing={3} justifyContent="center">
              {currentBrands.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item?.uuid || Math.random()}>
                  <BrandCard 
                    item={item} 
                    type={['viewed', 'liked', 'applied', 'shortlisted'][tabValue]}
                    likedStates={likedStates}
                    shortlistedStates={shortlistedStates}
                    onViewDetails={handleViewDetails}
                    onToggleLike={toggleLike}
                    onToggleShortlist={toggleShortlist}
                    onToggleViewClose={toggleViewClose}
                  />
                </Grid>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontSize: '1rem',
                      '&.Mui-selected': {
                        fontWeight: 'bold',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            {emptyState.icon}
            <Typography variant="h6">{emptyState.title}</Typography>
            <Typography>{emptyState.description}</Typography>
          </Box>
        )}
      </>
    );
  }, [
    isLoading, 
    errorMessage, 
    tabValue, 
    getCurrentBrands, 
    totalPages, 
    currentPage, 
    likedStates, 
    shortlistedStates,
    handleViewDetails, 
    toggleLike, 
    toggleShortlist,
    toggleViewClose
  ]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      p: { xs: 2, md: 4 }
    }}>
      <Box sx={{ 
        mb: 1,
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          gap: 1
        }}>
          <Avatar
            src={userData?.profileImage || img}
            loading="lazy"
            alt="Profile"
            sx={{
              width: 60,
              height: 60,
              mr: { md: 3 },
              border: '3px solid #689f38'
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              {userData?.firstName || 'Investor'} {userData?.lastName || ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData?.inveterID || ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        justifyContent: { xs: 'center', md: 'flex-start' },
        mt: 3,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
        }
      }}>
        <StatCard 
          icon={<Business />} 
          title="Viewed" 
          value={stats.totalViews} 
          color="76, 175, 80"
          isSelected={tabValue === 0}
          onClick={() => setTabValue(0)}
        />
        <StatCard 
          icon={<Favorite />} 
          title="Liked" 
          value={stats.totalLikes} 
          color="244, 67, 54"
          isSelected={tabValue === 1}
          onClick={() => setTabValue(1)}
        />
        <StatCard 
          icon={<AssignmentTurnedIn />} 
          title="Applied" 
          value={stats.totalApplications} 
          color="33, 150, 243"
          isSelected={tabValue === 2}
          onClick={() => setTabValue(2)}
        />
        <StatCard 
          icon={<Bookmark />}  
          title="Shortlisted" 
          value={stats.totalShortlisted} 
          color="156, 39, 176"  
          isSelected={tabValue === 3} 
          onClick={() => setTabValue(3)}
        />
      </Box>

      <Card sx={{ 
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        background: 'white',
        mt: 3
      }}>
        <Box sx={{ p: 3 }}>
          {removeMsg && (
            <Box sx={{ 
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#4caf50',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography>{removeMsg}</Typography>
              <IconButton size="small" onClick={() => setRemoveMsg("")}>
                <Close sx={{ color: 'white' }} />
              </IconButton>
            </Box>
          )}
          
          {renderTabContent}
        </Box>
      </Card>
    </Box>
  );
};

export default Dashboard;