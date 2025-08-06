import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Chip,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import Favorite from "@mui/icons-material/Favorite";
// import PlaylistAddCheckCircleOutlined from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import Business from "@mui/icons-material/Business";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import AreaChart from "@mui/icons-material/AreaChart";
import { handleShortList } from "../../Api/shortListApi";
import LoginPage from "../../Pages/LoginPage/LoginPage";

// import { BsFillBookmarkStarFill } from "react-icons/bs";
import { RiBookmark3Fill } from "react-icons/ri";
import { toggleHomeCardLike, toggleHomeCardShortlist } from "../../Redux/Slices/TopCardFetchingSlice";
import {token} from "../../Utils/autherId.jsx"
import { VideoPlayer } from "../../services/VideoControllerMedia/VideoPlayercomponents.jsx";

import { postView } from "../../Utils/function/view.jsx";
import { openBrandDialog } from "../../Redux/Slices/OpenBrandNewPageSlice.jsx";
import { useDispatch } from "react-redux";
import { addSortlist, removeSortList, toggleSortlistBrandLike } from "../../Redux/Slices/shortlistslice.jsx";
import { toggleBrandLike, toggleBrandShortList } from "../../Redux/Slices/GetAllBrandsDataUpdationFile.jsx";
import { likeApiFunction } from "../../Api/likeApi.jsx";
const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomePageBrandCard = React.memo(
  ({
    brand,
    
    // handleLikeClick,
    likeProcessing,
    dimensions,
    theme,
  }) => {

    const videoRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const observerRef = useRef();
    const [showLogin, setShowLogin] = useState(false);
    
    const brandId = brand?.uuid || "";
    const franchiseModel = brand?.fico || {}; // Changed to match the array structure
    const category = brand?.brandCategories || {}; // Changed to match the new structure
    const videoUrl = brand?.franchiseVideos ||brand?.logo ; // Direct URL now
    const brandLogo = brand?.logo || "";
    const brandName = brand?.brandname || "Brand";
    const mediaHeight = dimensions.height * 0.4;

    const {
      investmentRange = "Not specified",
      areaRequired = "Not specified",
      franchiseModel: modelType = "N/A",
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

    const [shortListed, setShortListed] = useState(brand.isShortListed);
    const dispatch = useDispatch()
    const handleToggleShortList = async (brand) => {
      try {
        // const response = await handleShortList(brand);
        // if (response.success) {
        //   setShortListed(!shortListed);
        // }
        if (!token) {
                                setShowLogin(true);
                                return;
                              }

        if (!brand.isShortListed) {
                dispatch(addSortlist(brand))
              }else(
                dispatch(removeSortList(brand.uuid))
              )
        // dispatch(removeSortList(brand.uuid))
        dispatch(toggleBrandShortList(brand.uuid))
        dispatch(toggleHomeCardShortlist(brand.uuid))
        await handleShortList(brand.uuid)
        setShortListed(!shortListed)
      } catch (error) {
        console.error("Error toggling shortlist:", error);
      }
    };

    const handleLikeClick =  async(brandId) => {
           if (!token) {
             setShowLogin(true);
             return;
           }
           dispatch(toggleSortlistBrandLike(brandId))
           dispatch(toggleBrandLike(brandId))
           dispatch(toggleHomeCardLike(brandId))
           await likeApiFunction(brandId)
         }
    

    const handleApply = (brand) => {
        postView(brand.uuid);
        dispatch(openBrandDialog(brand));
      };

    return (
      <motion.div
        key={brandId}
        variants={cardVariants}
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
            height: dimensions.height,
            border: "1px solid #eee",
          }}
        >
 <VideoPlayer
        id={brand.uuid}
        videoUrl={brand.franchiseVideos || brand.logo}
        poster={brand.logo}
        width="100%"
        height={dimensions.height * 0.4}
      />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ pb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box
                  component="img"
                  src={brandLogo}
                  alt={brandName}
                  loading="lazy"
                   onClick={() => handleApply(brand)}
cursor="pointer"
                  sx={{
                    width: 100,
                    height: 50,
                    border: "1px solid #f29724",
                    mb: 1,
                    borderRadius: 2,
                    objectFit: "contain",
                  }}
                />

                <Box>
                  <IconButton
                    onClick={() => handleToggleShortList(brand)}
                    sx={{
                      color: brand.isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
                    }}
                  >
                    <Tooltip title={"ShortList"}>
                      <RiBookmark3Fill size={21} />
                    </Tooltip>
                  </IconButton>

                  <IconButton
                    onClick={() => handleLikeClick(brandId, brand?.isLiked)}
                    disabled={likeProcessing[brandId]}
                    sx={{
                          color: brand?.isLiked
                            ? "#f44336"
                            : "rgba(0, 0, 0, 0.23)",
                        }}
                  >
                    {likeProcessing[brandId] ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Favorite
                        
                      />
                    )}
                  </IconButton>
                </Box>
              </Box>
              <Typography
                variant="body1"
                fontWeight={800}
                                onClick={() => handleApply(brand)}
cursor="pointer"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                  mb: 1,
                }}
              >
                {brandName}
              </Typography>
              {category?.child && (
                <Box sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={3}
                    justifyContent="space-between"
                    alignItems="center"
                  >
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
                  </Stack>
                </Box>
              )}

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
                    <strong>Investment:</strong> {investmentRange}
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
                    <strong>Area:</strong> {areaRequired}
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
                    <strong>Model :</strong> {modelType}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 1 }} />
            </CardContent>

            <Box sx={{ px: 2, pb: 2 }}>
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
                View Details
              </Button>
            </Box>
          </Box>
        </Card>
        {showLogin && (
                  <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
                )}
      </motion.div>
    );
  }
);

export default HomePageBrandCard;
