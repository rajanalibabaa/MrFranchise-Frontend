
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  lazy,
  Suspense,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

// Critical (above fold) imports
import { useBrand } from "../../Hooks/Fetchbrands.jsx";
import { useToggleLike } from "../../Hooks/Fetchbrands.jsx";
import { handleShortList } from "../../Api/shortListApi.jsx";
import { toggleBrandLike, toggleBrandShortList } from "../../Redux/Slices/GetAllBrandsDataUpdationFile.jsx";
import { toggleHomeCardLike, toggleHomeCardShortlist } from "../../Redux/Slices/TopCardFetchingSlice.jsx";
import { likeApiFunction } from "../../Api/likeApi.jsx";
import { useDispatch } from "react-redux";
import { token } from "../../Utils/autherId.jsx";
import LoginPage from "../LoginPage/LoginPage.jsx";
import { addSortlist, removeSortList } from "../../Redux/Slices/shortlistslice.jsx";

// Split: lazy-load OverviewTab!
// EAGER (above fold!) imports
import BrandHeader from "./BrandViewPageHandling/BrandHeaderViewPage.jsx";
import MediaSection from "./BrandViewPageHandling/MediaSectionViewPage.jsx";

// LAZY load (secondary) components
const Navbar = lazy(() => import("../../Components/Navbar/NavBar.jsx"));
const Footer = lazy(() => import("../../Components/Footers/Footer.jsx"));
const OverviewTab = lazy(() => import("./OverviewTab.jsx"));
const ExpansionLocationTags = lazy(() => import("./BrandViewPageHandling/ExpansionLocationTags.jsx"));
const ImageDialog = lazy(() => import("./BrandViewPageHandling/ImageDialogBoxViewPage.jsx"));
const ApplyDrawer = lazy(() => import("./BrandViewPageHandling/ApplyDrawerFormViewPage.jsx"));
const BackToTopButton = lazy(() => import("./BrandViewPageHandling/BackToTopButtonViewPage.jsx"));
const FloatingApplyButton = lazy(() => import("./BrandViewPageHandling/FloatingApplyButtonViewPage.jsx"));
const SimilarBrands = lazy(() => import("../../Components/HomePage_VideoSection/SimilarBrands.jsx"));
const LikedBrands = lazy(() => import("../../Components/HomePage_VideoSection/LikedBrands.jsx"));
const ViewBrands = lazy(() => import("../../Components/HomePage_VideoSection/ViewBrands.jsx"));
const ShortListedBrands = lazy(() => import("../../Components/HomePage_VideoSection/ShortListBrands.jsx"));

// Lazy-load OverviewTab only when visible
function LazyOverviewTab({ brand }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} sx={{ minHeight: 400 }}>
      {visible ? (
        <Suspense fallback={<Box minHeight={200} display="flex" alignItems="center" justifyContent="center"><CircularProgress /></Box>}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <OverviewTab brand={brand} />
          </motion.div>
        </Suspense>
      ) : (
        <Box minHeight={260} />
      )}
    </Box>
  );
}


const ExpansionLocationSection = ({
  brand,
  isMobile,
  isTablet,
  isSmallDesktop,
  isLargeDesktop,
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "300px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={<div style={{ minHeight: 100 }}>Loading tags...</div>}>
          <ExpansionLocationTags
            brand={brand}
            isMobile={isMobile}
            isTablet={isTablet}
            isSmallDesktop={isSmallDesktop}
            isLargeDesktop={isLargeDesktop}
          />
        </Suspense>
      ) : (
        <div style={{ minHeight: 100 }} /> // Keep layout stable
      )}
    </div>
  );
};

const BrandDetails = ({ brandData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { uuid } = useParams();

  // Media queries
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // Ref for scrolling
  const mainContainerRef = useRef(null);

  // States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [locationData, setLocationData] = useState({
    states: [],
    districts: [],
    cities: [],
  });
  const [localIsLiked, setLocalIsLiked] = useState(brandData[0].isLiked);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const [shortListed, setShortListed] = useState(brandData[0].isShortListed);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    investorEmail: "",
    mobileNumber: "",
    investmentRange: "",
    state: "",
    district: "",
    city: "",
    planToInvest: "",
    readyToInvest: "",
  });
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();

  // Memoized
  const selectedBrand = brandData || {};
  const investorUUID = useMemo(() => localStorage.getItem("investorUUID"), []);
  const AccessToken = useMemo(() => localStorage.getItem("accessToken"), []);

  const { mutate: toggleLike } = useToggleLike();

  const investmentRanges = useMemo(
    () => [
      ...new Set(
        selectedBrand[0]?.brandfranchisedetails?.franchiseDetails?.fico?.map((m) => m.investmentRange) ||
          []
      ),
    ],
    [selectedBrand]
  );

  const investmentTimings = useMemo(
    () => ["Immediately", "1 - 3 Months", "3 - 6 Months", "6 + Months"],
    []
  );

  const readyToInvestOptions = useMemo(
    () => ["Own Investment", "Going For Loan", "Need Loan Assistance"],
    []
  );

  const allVideos = useMemo(() => {
    if (!selectedBrand || selectedBrand.length === 0) return [];
    return selectedBrand[0]?.uploads?.franchiseVideos || [];
  }, [selectedBrand]);

  const allImages = useMemo(
    () => [
      ...(selectedBrand[0]?.uploads?.logo
        ? [selectedBrand[0]?.uploads?.logo]
        : []),
      ...(selectedBrand[0]?.uploads?.exteriorOutlet || []),
      ...(selectedBrand[0]?.uploads?.interiorOutlet || []),
    ],
    [selectedBrand]
  );

  // Events (useCallback)
  const handleOpenShareClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleLikeClick = async () => {
    const brandId = brandData[0].uuid;
    if (!token) {
      setShowLogin(true);
      return;
    }
    dispatch(toggleBrandLike(brandId));
    dispatch(toggleHomeCardLike(brandId));
    await likeApiFunction(brandId);
    setLocalIsLiked(!localIsLiked);
  };

  const handleToggleShortList = async () => {
    const brandId = brandData[0].uuid;
    if (!token) {
      setShowLogin(true);
      return;
    }
    dispatch(toggleBrandShortList(brandId));
    dispatch(toggleHomeCardShortlist(brandId));
    await handleShortList(brandId);
    setShortListed(!shortListed);
  };

  const toggleDrawer = useCallback(
    (open) => (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    },
    []
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const id = investorUUID || localStorage.getItem("brandUUID");
      if (!id) {
        alert("User not logged in or missing ID. Please login again.");
        navigate("/registerhandleuser");
        return;
      }
      try {
        const payload = {
          ...formData,
          state: formData.state || "",
          district: formData.district || "",
          city: formData.city || "",
          brandId: selectedBrand?.uuid,
          brandName: selectedBrand?.brandDetails?.brandName || "",
          applyId: id,
        };

        const requiredFields = [
          "fullName",
          "investorEmail",
          "mobileNumber",
          "state",
          "district",
          "city",
          "investmentRange",
          "planToInvest",
          "readyToInvest",
        ];
        const missingFields = requiredFields.filter((field) => !payload[field]);
        if (missingFields.length > 0) {
          alert(`Please fill all required fields: ${missingFields.join(", ")}`);
          return;
        }
        const response = await axios.post(
          "http://localhost:5000/api/v1/instantapply/postApplication",
          payload,
          {
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(10000),
          }
        );
        if (response.data) {
          setSubmitSuccess(true);
          alert("✅Success! Your application has been submitted.");
          setDrawerOpen(false);
          setFormData({
            fullName: "",
            investorEmail: "",
            mobileNumber: "",
            investmentRange: "",
            state: "",
            district: "",
            city: "",
            planToInvest: "",
            readyToInvest: "",
          });
        }
        console.log("Submission successful:", response.data);
      } catch (error) {
        console.error(
          "Submission error:",
          error?.response?.data || error.message
        );
        alert("❌Failed to submit application. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, selectedBrand, investorUUID, navigate]
  );

  const handleImageOpen = useCallback((index) => {
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  }, []);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);

  // API: fetch investor and brand as before...

  const fetchInvestorDetails = useCallback(async () => {
    if (!investorUUID || !AccessToken) return;
    try {
      const response = await axios.get(
        `https://mrfranchisebackend.mrfranchise.in/api/v1/investor/getInvestorByUUID/${investorUUID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AccessToken}`,
          },
          signal: AbortSignal.timeout(5000),
        }
      );
      if (response.data?.data) {
        setUserData(response.data.data);
        setFormData((prev) => ({
          ...prev,
          fullName: response.data.data.firstName || "",
          investorEmail: response.data.data.email || "",
          mobileNumber: response.data.data.mobileNumber || "",
        }));
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Failed to fetch investor details:", error);
      }
    }
  }, [investorUUID, AccessToken]);

  // Effects (keep unchanged except for lazy-lazy components)

  useEffect(() => {
    if (!uuid) return;
    const controller = new AbortController();
    const fetchBrand = async () => {
      try {
        await useBrand(uuid).unwrap();
      } catch (error) {
        console.error("Failed to fetch brand details:", error);
      }
    };
    fetchBrand();
    return () => controller.abort();
  }, [uuid]);

  useEffect(() => {
    if (investorUUID && AccessToken) {
      const controller = new AbortController();
      fetchInvestorDetails();
      return () => controller.abort();
    }
  }, [fetchInvestorDetails, investorUUID, AccessToken]);

  useEffect(() => {
    const locations =
      selectedBrand[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations || [];
    if (locations.length > 0) {
      const states = [
        ...new Set(locations.map((loc) => loc.state).filter(Boolean)),
      ];
      setLocationData((prev) => ({
        ...prev,
        states,
        districts: [],
        cities: [],
      }));
    }
  }, [selectedBrand]);

  useEffect(() => {
    const locations =
      selectedBrand[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations || [];
    if (formData.state && locations.length > 0) {
      const stateObj = locations.find((loc) => loc.state === formData.state);
      const districts = [
        ...new Set(stateObj?.districts?.map((d) => d.district) || []),
      ];
      setLocationData((prev) => ({
        ...prev,
        districts,
        cities: [],
      }));
      setFormData((prev) => ({
        ...prev,
        district: "",
        city: "",
      }));
    }
  }, [formData.state, selectedBrand]);

  useEffect(() => {
    const locations =
      selectedBrand[0]?.brandexpansionlocationdatas?.expansionLocations?.domestic?.locations || [];
    if (formData.state && formData.district && locations.length > 0) {
      const stateObj = locations.find((loc) => loc.state === formData.state);
      const districtObj = stateObj?.districts?.find(
        (d) => d.district === formData.district
      );
      const cities = [...new Set(districtObj?.cities || [])];
      setLocationData((prev) => ({
        ...prev,
        cities,
      }));
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  }, [formData.district, formData.state, selectedBrand]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Utility
  const getImageBoxSize = useCallback(() => {
    if (isMobile) return 120;
    if (isTablet) return 160;
    if (isSmallDesktop) return 180;
    return 204;
  }, [isMobile, isTablet, isSmallDesktop]);
  const getOutletRange = useCallback((value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue)) return "N/A";
    if (numericValue < 10) return "Below 10";
    const lower = Math.floor(numericValue / 10) * 10;
    const upper = lower + 10;
    return `${lower} - ${upper}`;
  }, []);
 if (!brandData || !brandData.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  

  return (
    <>
      {/* LAZY NAVBAR LOAD */}
      <Suspense fallback={<div style={{height: 60, background: "#fff"}} />}>
        <Navbar />
      </Suspense>

      <Box
        ref={mainContainerRef}
        sx={{
          width: "90%",
          maxWidth: 1200,
          mx: "auto",
          my: isMobile ? 2 : 4,
          px: isMobile ? 1 : isTablet ? 3 : 4,
        }}
      >
        {/* CRITICAL BUTTONS DRAWERS HEADER */}
        {/* <Suspense fallback={null}> */}
          <FloatingApplyButton
            isMobile={isMobile}
            brand={selectedBrand}
            toggleDrawer={toggleDrawer}
          />
        {/* </Suspense> */}
        {/* <Suspense fallback={null}> */}
          <ApplyDrawer
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            isMobile={isMobile}
            isTablet={isTablet}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            locationData={locationData}
            investmentRanges={investmentRanges}
            investmentTimings={investmentTimings}
            readyToInvestOptions={readyToInvestOptions}
            selectedBrand={selectedBrand}
            userData={userData}
          />
        {/* </Suspense> */}
        {/* <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}> */}
          <BrandHeader
            brand={selectedBrand}
            isMobile={isMobile}
            isTablet={isTablet}
            localIsLiked={localIsLiked}
            isProcessingLike={isProcessingLike}
            shortListed={shortListed}
            handleLikeClick={handleLikeClick}
            handleToggleShortList={handleToggleShortList}
            handleOpenShareClick={handleOpenShareClick}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            toggleDrawer={toggleDrawer}
            getOutletRange={getOutletRange}
          />
        {/* </Suspense> */}
        <Divider sx={{ my: 3 }} />
        {/* MEDIA LAZY */}
        {/* <Suspense fallback={<Box minHeight={200}><CircularProgress /></Box>}> */}
          <MediaSection
            allVideos={allVideos}
            allImages={allImages}
            isMobile={isMobile}
            isTablet={isTablet}
            getImageBoxSize={getImageBoxSize}
            handleImageOpen={handleImageOpen}
          />
        {/* </Suspense> */}
        <Divider sx={{ my: 5 }} />

        <Suspense fallback={<Box minHeight={180}><CircularProgress /></Box>}>
          <LazyOverviewTab brand={selectedBrand} />
        </Suspense>

        {/* <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 4,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <OverviewTab brand={selectedBrand} />
            </motion.div>
          </Box>
        </Box> */}
        <Suspense fallback={null}>
          <ImageDialog
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            isMobile={isMobile}
            allImages={allImages}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            handlePrevImage={handlePrevImage}
            handleNextImage={handleNextImage}
          />
        </Suspense>
      </Box>

      {/* LAZY LOAD LIKED/SIMILAR BRANDS */}
      <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}>
        <LikedBrands />
      </Suspense>
      <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}>
      <ViewBrands />
        </Suspense>
      <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}>
      <ShortListedBrands />
        </Suspense>
      <Suspense fallback={<Box minHeight={120}><CircularProgress /></Box>}>
        <SimilarBrands brandData={selectedBrand} />
      </Suspense>

      {/* EXPANSION LOCATIONS LAZY ON SCROLL */}
      <Box
        sx={{
          width: "90%",
          maxWidth: 1200,
          mx: "auto",
          my: 4,
          px: isMobile ? 1 : isTablet ? 3 : 4,
        }}
        color={"#ff9800"}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontSize: isMobile ? "1.25rem" : "1.5rem" }}
        >
          Tags
        </Typography>
        <ExpansionLocationSection
          brand={selectedBrand}
          isMobile={isMobile}
          isTablet={isTablet}
          isSmallDesktop={isSmallDesktop}
          isLargeDesktop={isLargeDesktop}
        />
      </Box>

      <Suspense fallback={null}>
        <BackToTopButton show={showBackToTop} isMobile={isMobile} />
      </Suspense>
      <Suspense fallback={<div style={{height: 300, background: "#eee"}} />}>
        <Footer />
      </Suspense>

      {/* Login Dialog */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
};

export default React.memo(BrandDetails);
