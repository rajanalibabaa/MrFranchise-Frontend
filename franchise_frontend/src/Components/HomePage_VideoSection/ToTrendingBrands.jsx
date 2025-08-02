import {
  Typography,
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  CircularProgress,
  Tooltip ,
} from "@mui/material";
import { RiBookmark3Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { postView } from "../../Utils/function/view";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands, toggleBrandLike } from "../../Redux/Slices/GetAllBrandsDataUpdationFile";
// import { toast } from "react-toastify";
import { likeApiFunction } from "../../Api/likeApi";
import { toggleHomeCardLike } from "../../Redux/Slices/TopCardFetchingSlice";
import { token } from "../../Utils/autherId";


const TopInvestVdocardround = () => {
  const [likeProcessing, setLikeProcessing] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [page, setPage] = useState(1);
  const [allBrands, setAllBrands] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const { brands, isLoading, error, pagination, fetchedPages } = useSelector((state) => state.brands);

  const handleToggleShortList = async (brand) => {
    try {
      const response = await handleShortList(brand);
      if (response.success) {
        setAllBrands((prevBrands) =>
          prevBrands.map((b) =>
            b.uuid === brand.uuid ? { ...b, isShortListed: !b.isShortListed } : b
          )
        );
      }
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  };

  // Initial load and pagination
  useEffect(() => {
    if (!(fetchedPages || [] ).includes(page)) {
      console.log("DISPATCHING BRANDS PAGE:", page);
      dispatch(fetchBrands({ page }));
    }
  }, [dispatch, page, fetchedPages]);

  // Accumulate brands when new data loads
  useEffect(() => {
    if (brands && brands.length > 0) {
      if (page === 1) {
        setAllBrands(brands);
      } else {
        setAllBrands((prev) => {
          const existingIds = new Set(prev.map((b) => b.uuid));
          const newUnique = brands.filter((b) => !existingIds.has(b.uuid));
          return [...prev, ...newUnique];
        });
      }
      setHasMore(pagination?.totalPages > page);
    }
  }, [brands, page, pagination]);


const handleLikeClick = async(brandId) => {

  console.log(brandId)
  if (!token) {
    setShowLogin(true);
    return;
  }
  dispatch(toggleBrandLike(brandId));
  dispatch(toggleHomeCardLike(brandId));
  await likeApiFunction(brandId)
};
  const handleApply = useCallback((brand) => {
    postView(brand.uuid);
    openBrandDialog(brand);
  }, []);

  const loadMoreBrands = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={60} thickness={4} sx={{ color: "#f29724" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography color="error">
          {error.message || "Failed to load brands."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ maxWidth: 1300, mx: "auto" }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 800,
          textAlign: "center",
          background: "linear-gradient(45deg, #f29724 30%, #ffcc80 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Franchise Opportunities
      </Typography>

      {/* Compact Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: { xs: 4, sm: 3, md: 4, lg: 5 },
          mb: 6,
          width: "100%",
          px: { xs: 1, sm: 2 },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {allBrands.map((brand) => (
          <motion.div
            key={brand.uuid}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            style={{ minWidth: 0 }}
          >
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
              <Stack
                direction="column"
                spacing={0.5}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  zIndex: 2,
                }}
              >
                <IconButton
                  sx={{
                    color: brand?.isLiked ? "#ff5252" : "rgba(0,0,0,0.2)",
                    "&:hover": { color: "#ff5252" },
                  }}
                  onClick={() => handleLikeClick(brand.uuid, brand?.isLiked)}
                  disabled={likeProcessing[brand.uuid]}
                >
                  {likeProcessing[brand.uuid] ? (
                    <CircularProgress size={24} />
                  ) : brand?.isLiked ? (
                    <FavoriteIcon fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>

                <IconButton
                  onClick={() => handleToggleShortList(brand)}
                  sx={{
                    color: brand?.isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
                  }}
                >
                  <Tooltip title="ShortList">
                    <RiBookmark3Fill size={21} />
                  </Tooltip>
                </IconButton>
              </Stack>
              <Box
                component="img"
                src={brand.logo}
                alt={brand.brandname}
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
                {brand.brandname}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mt: 0.5,
                  mb: 1,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {brand.brandCategories?.child}
              </Typography>
              <Stack direction="column" spacing={0.5} sx={{ mb: 0.5, width: "100%" }}>
                <Typography variant="caption" fontWeight={500} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Investment : {brand.fico?.investmentRange || "N/A"}
                </Typography>
                <Typography variant="caption" fontWeight={500} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Area : {brand.fico?.areaRequired || "N/A"}
                </Typography>
                <Typography variant="caption" fontWeight={500} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Type : {brand.fico?.franchiseModel || "N/A"}
                </Typography>
              </Stack>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => handleApply(brand)}
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
        ))}
      </Box>

     {hasMore && (
  <Box sx={{ textAlign: "center", mt: 2, mb: 4 }}>
    <Button
      variant="contained"
      sx={{
        borderRadius: 2,
        px: 4,
        py: 1,
        background: "linear-gradient(45deg, #f29724 30%, #ffcc80 90%)",
        fontWeight: 600,
        fontSize: "0.875rem",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 8px rgba(242, 151, 36, 0.3)",
        },
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => {
        if (!isLoading) {
          loadMoreBrands(); // Trigger on hover
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <CircularProgress size={24} sx={{ color: "white" }} />
      ) : (
        "Load More Brands"
      )}
    </Button>
  </Box>
)}


      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
};

export default React.memo(TopInvestVdocardround);  