import React, {
  useState,
  useEffect,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import PopupModal from "../../Components/PopUpModal/PopUpModal";
import FilterDropdowns from "../../Components/Navbar/FilterDropdownsData";
import { useDispatch } from "react-redux";
import Footer from "../../Components/Footers/Footer.jsx";
import { hideLoading, showLoading } from "../../Redux/Slices/loadingSlice.jsx";
import Navbar from "../../Components/Navbar/NavBar.jsx";
import ShortlistBrands from "../../Components/HomePage_VideoSection/ShortlistBrands.jsx";
import SEO from "../../Components/SEO/Seo.jsx";
import HomeBanner from "../../assets/Images/HomeBanner.avif";

// ErrorBoundary component remains the same
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
// Optimized withSuspense HOC
// Update your withSuspense HOC
const withSuspense = (Component, { fallback } = {}) => (props) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || (
      <Box sx={{ /* your error fallback styles */ }}>
        <Typography color="error">Failed to load this section</Typography>
      </Box>
    );
  }

  return (
    <Suspense
      fallback={
        fallback || (
          <Box sx={{ /* your loading styles */ }}>
            <CircularProgress color="secondary" />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading content...
            </Typography>
          </Box>
        )
      }
    >
      <ErrorBoundary
        fallback={
          <Box sx={{ /* your error fallback styles */ }}>
            <Typography color="error">Failed to load this section</Typography>
          </Box>
        }
      >
        <Component {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const bannerTexts = [
  {
    title: {
      text: "1000+ Food Brands \n One Platform Endless Possibilities",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Discover A Universe Of F&B Franchise Opportunities From Quick Service Restaurants To Gourmet Cafes All Under On Powerful Portal",
      highlight: {
        text: " F&B franchise opportunities",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Turn Your Investment \n Into A Tasteful Venture",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Explore Curated Restaurant And Cafe Franchises With Proven Models Designed For ROI Stability And Low Opertational Hassle",
      highlight: {
        text: " proven models",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "India's #1 F&B Franchise Marketplace\n Your Food Business Starts Here",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "From Startup Food kiosks To International Food Chains We Have Everything You Need To Start Your ",
      highlight: {
        text: "food franchise journey",
        color: "#ff9800",
        lineHeight: "1.5",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Serve Success Hot \n Choose the Right F&B Franchise Today",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Invest in hot-selling food concepts with hight demand, fast scalability, and support from trusted brands.",
      highlight: {
        text: "F&B Franchise",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "From Local Taste to Global Plates \n Start Your Food Business Now",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Franchise options available in street food, bakeries, ice cream parlors, multicusine restaurants, and more.",
      highlight: {
        text: "Food Business",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Low Investment.\nHigh Appetite for Growth",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Start from just ₹5 Lakhs with multiple profitable options in cafes, cloud kitchens, and food trucks.",
      highlight: {
        text: "Low Investment",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Franchise a Restaurant.\n Own a Cafe Lead a Cloud Kitchen",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Find franchise businesses across every food format to suit your budget, location, and business dream.",
      highlight: {
        text: "franchise businesses",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "F&B Franchise Made Easy \n with www.MrFranchise.in",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Step-by-step guidance, brand comparisons, and expert consultation to help you confidently invest.",
      highlight: {
        text: "consultation",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "No Experience? No Problem!\n Proven Food Franchise Models Await You",
      gradient:
        "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "Get full training, support, marketing tools, and setup assistance with our zero-hassle franchise options.",
      highlight: {
        text: "zero-hassle",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
  {
    title: {
      text: "Your Food Franchise Future\n Starts At food and beverage www.MrFranchise.in",
      gradient: "linear-gradient(90deg, #FF9800 10%, #FF5722 100%)",
      fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2rem" },
    },
    subtitle: {
      text: "The one-stop portal for serious F&B investors looking to explore, compare, and close franchise deals.",
      highlight: {
        text: "franchise deals",
        color: "#ff9800",
        fontWeight: "bold",
      },
    },
  },
];


const HomeBannerSec = () => {
  const theme = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const controls = useAnimation();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);

  // Memoized dynamic components
  const dynamicComponents = useMemo(
    () => ({
      TopBrandThreevdocards: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/TopBrandThreeVdoCards")
        )
      ),
      LikedBrands: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/LikedBrands.jsx")
        .catch(() => ({ 
          default: () => <div>Failed to load component</div> 
        }))
        )
      ),
      ShortlistBrands: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/ShortlistBrands.jsx")
        )
      ),
      TopCafeFranchises: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/TopCafeBrands.jsx")
        )
      ),
      TopFoodFranchise: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/TopFoodFranchise.jsx")
        )
      ),
      TopBeverageFranchise: withSuspense(
        React.lazy(() =>
          import(
            "../../Components/HomePage_VideoSection/TopBeverageFranchise.jsx"
          )
        )
      ),
      TopDesertBakeryFranchise: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/TopDesertBakerys.jsx")
        )
      ),
      TopTruckAndKiosks: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/TopTruckAndKiosks.jsx")
        )
      ),
      TopRestaurantsFranchise: withSuspense(
        React.lazy(() =>
          import(
            "../../Components/HomePage_VideoSection/TopRestaurantsFranchise.jsx"
          )
        )
      ),
      ToTrendingBrands: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/ToTrendingBrands.jsx")
        )
      ),
       FindFranchiseLocations: withSuspense(
        React.lazy(() =>
          import("../../Components/HomePage_VideoSection/FindFranchiseLocations.jsx")
        )
      ),
    }),
    []
  );

  const pageConfig = useMemo(
    () => ({
      heroBanner: {
        backgroundImage: HomeBanner,
        overlayColor: "rgba(0, 0, 0, 0.3)",
        title: {
          text: "Welcome To Our MrFranchise Network",
          gradient:
            "linear-gradient(0deg, rgb(249, 108, 0) 10%, rgba(250, 250, 250, 1) 100%)",
          fontSize: { mobile: "2rem", tablet: "3.5rem", desktop: "2.5rem" },
        },
        subtitle: {
          text: "World's most comprehensive franchise platform with 1000+ opportunities waiting for you...",
          highlight: {
            text: "1000+ opportunities",
            color: "#ff9800",
            fontWeight: "bold",
          },
        },
      },
      sections: [
        { component: "TopBrandThreevdocards", background: "white" },
        { component: "LikedBrands", background: "#white" },
        { component: "ShortlistBrands", background: "#white" },
        { component: "TopCafeFranchises", background: "#fffaf7" },
        { component: "TopFoodFranchise", background: "#fffaf7" },
        { component: "TopBeverageFranchise", background: "#fffaf7" },
        { component: "TopDesertBakeryFranchise", background: "#fffaf7" },
        { component: "TopTruckAndKiosks", background: "#fffaf7" },
        { component: "TopRestaurantsFranchise", background: "white" },
        { component: "FindFranchiseLocations", background: "white" },
        { component: "ToTrendingBrands", title: "Trending Brands" },
      ],
      animations: {
        banner: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { when: "beforeChildren", staggerChildren: 0.3 },
          },
        },
        item: {
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", damping: 10, stiffness: 100 },
          },
        },
        pulse: {
          scale: [1, 1.02, 1],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        },
      },
    }),
    []
  );

  // Memoize banner texts to prevent recreation on every render
  const memoizedBannerTexts = useMemo(() => bannerTexts, []);

  // Single preload effect with cleanup
  useEffect(() => {
    let isMounted = true;
    const preload = async () => {
      try {
        await Promise.all([
          import(
            "../../Components/HomePage_VideoSection/TopBrandThreeVdoCards"
          ),
          import("../../Components/HomePage_VideoSection/LikedBrands.jsx"),
        ]);
        if (isMounted) setIsPreloaded(true);
      } catch (error) {
        console.error("Preload failed:", error);
      }
    };

    if (!isPreloaded) {
      preload();
    }

    return () => {
      isMounted = false;
    };
  }, [isPreloaded]);

  // Popup and loading logic
  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries[0]?.type === "reload";
    const popupShown = sessionStorage.getItem("popup-shown");

    dispatch(showLoading());
    const timer = setTimeout(() => {
      if (!popupShown || isReload) {
        setIsPopupOpen(true);
        sessionStorage.setItem("popup-shown", "true");
      }
      dispatch(hideLoading());
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // Optimized banner text rotation
  useEffect(() => {
    if (!isPreloaded) return;

    const interval = setInterval(() => {
      controls
        .start({
          opacity: 0,
          x: -80,
          transition: { duration: 0.5 },
        })
        .then(() => {
          setBannerIndex((prev) => (prev + 1) % memoizedBannerTexts.length);
          controls.start({
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 },
          });
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [controls, isPreloaded, memoizedBannerTexts.length]);

  const handlePopupClose = useCallback(() => setIsPopupOpen(false), []);

  // Memoize current text to prevent recalculations
  const currentText = useMemo(
    () => memoizedBannerTexts[bannerIndex],
    [bannerIndex, memoizedBannerTexts]
  );

  // Memoize section rendering
 const renderSection = useCallback(
  (sectionConfig, index) => {
    const DynamicComponent = dynamicComponents[sectionConfig.component];

    return (
      <Box key={`section-${index}`} sx={{ /* your styles */ }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <ErrorBoundary
              fallback={
                <Box sx={{ /* error styles */ }}>
                  Failed to load {sectionConfig.component}
                </Box>
              }
            >
              <Suspense
                fallback={
                  <Box sx={{ /* loading styles */ }}>
                    <CircularProgress />
                  </Box>
                }
              >
                {isPreloaded && <DynamicComponent />}
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </Container>
      </Box>
    );
  },
  [isPreloaded, dynamicComponents]
);

  // Combine with your existing popup state
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(!localStorage.getItem("accessToken") && isPopupOpen);
    }, 0); // Next tick

    return () => clearTimeout(timer);
  }, [isPopupOpen]);

  // const currentText = bannerTexts[bannerIndex];

  return (
    <>
      <SEO
        title={`${currentText.title.text} | Top Franchise Opportunities in India 2025`}
        description={`${currentText.subtitle.text} Start your journey with the best franchise opportunities in India.`}
        keywords="franchise opportunities in India, top franchises India, food franchise India, low investment franchise India, cafe franchise, restaurant franchise, F&B business opportunities"
        canonical="https://mrfranchise.in/"
        url="https://mrfranchise.in/"
        image={
          currentText.images || "https://mrfranchise.in/images/hero-banner.jpg"
        }
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://mrfranchise.in/#organization",
          name: "Mr Franchise",
          url: "https://mrfranchise.in",
          logo: "https://mrfranchise.in/images/logo.png",
          sameAs: [
            "https://www.facebook.com/mrfranchise",
            "https://www.instagram.com/mrfranchise",
            "https://www.linkedin.com/company/mrfranchise",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+91-XXXXXXXXXX",
            contactType: "customer service",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
          },
        }}
        og={{
          type: "website",
          title: `${currentText.title.text} | Mr Franchise`,
          description: `${currentText.subtitle.text} Explore 1000+ franchise opportunities.`,
          image: "https://mrfranchise.in/images/social-share.jpg",
          imageWidth: "1200",
          imageHeight: "630",
        }}
        twitter={{
          card: "summary_large_image",
          site: "@MrFranchise",
          creator: "@MrFranchise",
          title: `${currentText.title.text} | Mr Franchise`,
          description: `${currentText.subtitle.text} India's #1 F&B Franchise Marketplace`,
          image: "https://mrfranchise.in/images/twitter-card.jpg",
        }}
        additionalMeta={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1, maximum-scale=1",
          },
          {
            name: "theme-color",
            content: "#FF5722",
          },
          {
            name: "apple-mobile-web-app-title",
            content: "Mr Franchise",
          },
        ]}
      />

      <Navbar />
      {showPopup && (
        <PopupModal
          open={isPopupOpen}
          onClose={handlePopupClose}
          disableInitialAnimation // Add this prop to your modal if available
        />
      )}

      {/* Hero Banner */}
      <Box
        mt={0}
        sx={{
          background: `linear-gradient(${pageConfig.heroBanner.overlayColor}), url(${pageConfig.heroBanner.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
          py: 1,
          // px: 2,
          position: "relative",
          overflow: "hidden",
          color: "white",
          minHeight: isMobile ? "75vh" : "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "0px",
            background: "linear-gradient(to bottom, transparent 0%, #fff 100%)",
            zIndex: 1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          },
        }}
      >
        <Container
          sx={{
            position: "",
            zIndex: 2,
            textAlign: isMobile ? "center" : "center",
            height: "100%",
            mt: 3,
          }}
        >
          <motion.div
            key={bannerIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
          >
            <Typography mb={3} component="span">
              <Box
                sx={{
                  background: currentText.title.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                  display: "inline-block",
                  fontSize: isMobile ? "1.5rem" : "2.2rem",
                  fontWeight: 900,
                  px: 1,
                  whiteSpace: "pre-line",
                }}
              >
                {currentText.title.text}
              </Box>
            </Typography>
          </motion.div>

          <motion.div variants={pageConfig.animations.item}>
            <Typography
              variant={isMobile ? "body1" : "subtitle2"}
              mt={isMobile ? 0 : 3}
              sx={{
                textAlign: "center",
                color: "rgba(255,255,255,0.9)",
                fontWeight: 300,
                mt: 2,
                mb: 5,
                maxWidth: "800px",
                mx: "auto",
                lineHeight: 1.5,
                fontSize: isMobile ? "0.6rem" : ".8rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                position: "relative",
              }}
              component={motion.div}
            >
              {
                currentText.subtitle.text.split(
                  currentText.subtitle.highlight.text
                )[0]
              }
              <Typography
                variant="outlined"
                sx={{
                  fontWeight: currentText.subtitle.highlight.fontWeight,
                  color: currentText.subtitle.highlight.color,
                  display: "inline",
                  mb: 5,
                }}
                component="span"
              >
                {currentText.subtitle.highlight.text}
              </Typography>
              {
                currentText.subtitle.text.split(
                  currentText.subtitle.highlight.text
                )[1]
              }
            </Typography>
          </motion.div>

          <FilterDropdowns />
        </Container>
      </Box>

      {/* Render all sections from config */}
      <Box>
        {pageConfig.sections.map((section, index) =>
          renderSection(section, index)
        )}
      </Box>
      <Footer />
    </>
  );
};

export default React.memo(HomeBannerSec); // Use React.memo to optimize HomeBannerSec
