
import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useParams, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { userId } from "../../Utils/autherId.jsx";
import SEO from "../../Components/SEO/Seo";

const BrandDetails = lazy(() => import("./BrandDetail.jsx"));

function BrandDetailsPage() {
  const { brandId: routeBrandId } = useParams();
  const location = useLocation();
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try to find the brand ID in all likely locations immediately
  const brandId = useMemo(() => {
    if (routeBrandId) return routeBrandId;
    if (location.state?.brandId) return location.state.brandId;

    // Fallback: try sessionStorage keys
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("brand-")) {
        try {
          const item = JSON.parse(sessionStorage.getItem(key));
          if (item?.uuid) return item.uuid;
        } catch {}
      }
    }
    return null;
  }, [routeBrandId, location.state]);

  const brandCacheKey = `brand-data-${brandId || "none"}`;
  const brandSessionDataKey = `brand-${brandId || "none"}`;

  // IMMEDIATE hydration from sessionStorage if possible
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!brandId) {
      setLoading(false);
      setError("No brand found");
      setBrandData(null);
      return;
    }

    // 1. Strict check from sessionStorage (full brand storage)
    let hydrated = null;
    const fromSession = sessionStorage.getItem(brandSessionDataKey);
    if (fromSession) {
      try {
        hydrated = JSON.parse(fromSession);
        setBrandData(Array.isArray(hydrated) ? hydrated : [hydrated]);
        setLoading(false);
        return;
      } catch {}
    }
    // 2. Generic cache fallback
    const fromCache = sessionStorage.getItem(brandCacheKey);
    if (fromCache) {
      try {
        hydrated = JSON.parse(fromCache);
        setBrandData(Array.isArray(hydrated) ? hydrated : [hydrated]);
        setLoading(false);
        return;
      } catch {}
    }

    // 3. Must fetch from API
    (async () => {
      try {
        const res = await axios.get(
          `https://mrfranchisebackend.mrfranchise.in/api/v1/brandlisting/getBrandListingByUUID/${brandId}`,
          { params: { userId } }
        );
        let brand = res.data?.data;
        // Guarantee always array for BrandDetails
        setBrandData(Array.isArray(brand) ? brand : [brand]);
        sessionStorage.setItem(brandCacheKey, JSON.stringify(Array.isArray(brand) ? brand : [brand]));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load brand details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [brandId, brandCacheKey, brandSessionDataKey]);

  // Defensive: while loading or error or missing/invalid data, render early spinner/state
  if (error)
    return (
      <Box sx={{ pt: 10, textAlign: "center", color: "error.main" }}>
        Error: {error}
      </Box>
    );
  if (
    loading ||
    !brandData ||
    !Array.isArray(brandData) ||
    brandData.length === 0 ||
    !brandData[0]
  ) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.6)",
          zIndex: 1300,
        }}
      >
        <CircularProgress color="warning" size={60} />
      </Box>
    );
  }

  // --- SEO Extraction ---
  // Always use the fully loaded, first brand object:
  const pageBrand = brandData[0] || {};

  // Helper: deeply get fields with fallback
  const getNested = (obj, pathArray, fallback) => {
    try {
      let value = obj;
      for (const key of pathArray) value = value?.[key];
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };

  // Compute fields with fallback
  const brandName =
    getNested(pageBrand, ["brandDetails", "brandName"]) ||
    pageBrand.name ||
    "Brand";
  const investMentRange =
    getNested(pageBrand, [
      "brandfranchisedetails",
      "franchiseDetails",
      "fico",
      0,
      "investmentRange",
    ]) || pageBrand.investmentRange || "5-50 lakhs";

  const brandDescription =
    getNested(pageBrand, [
      "brandfranchisedetails",
      "franchiseDetails",
      "brandDescription",
    ]) || pageBrand.shortDescription || `Franchise opportunity for ${brandName} in India`;

  const roi = pageBrand.roi || "15-25";
  const roiPeriod = pageBrand.roiPeriod || "12-24 months";
  const requirements = pageBrand.requirements || "minimum 200-500 sq ft space and business experience";
  const establishedYear = pageBrand.establishedYear
    ? `${pageBrand.establishedYear}-01-01`
    : undefined;
  const category =
    getNested(pageBrand, [
      "brandfranchisedetails",
      "franchiseDetails",
      "brandCategories",
      "child",
    ]) || pageBrand.category || "Food & Beverage";
  const slug = pageBrand.slug || brandId;
  const brandUrl = `https://mrfranchise.in/brand/${slug}`;
  const brandImage = getNested(pageBrand, ["uploads", "logo"]) || "https://mrfranchise.in/images/default-brand.jpg";

  // --- SCHEMAS (robust and error-free) ---
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mrfranchise.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category,
        item: `https://mrfranchise.in/franchises/${category
          .toLowerCase()
          .replace(/ /g, "-")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: brandUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much does a ${brandName} franchise cost in India?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The total investment for a ${brandName} franchise ranges between ₹${investMentRange}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the ROI for ${brandName} franchise?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${brandName} franchise offers an ROI of ${roi}% within ${roiPeriod}.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the requirements to start a ${brandName} franchise?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Requirements include ${requirements}.`,
        },
      },
    ],
  };

  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: brandUrl,
    logo: brandImage,
    description: brandDescription,
    foundingDate: establishedYear,
    address: {
      "@type": "PostalAddress",
      addressCountry: "India",
    },
  };

  return (
    <>
      <SEO
        title={`Start ${brandName} Franchise in India | Cost ₹${investMentRange} | ROI ${roi}%`}
        description={`${brandDescription}. Investment: ₹${investMentRange}, ROI: ${roi}%. ${pageBrand.keyFeatures || "Trusted brand with proven business model"}.`}
        keywords={`${brandName} franchise, ${brandName} franchise cost, ${brandName} ROI, ${category} franchise opportunities`}
        canonical={brandUrl}
        url={brandUrl}
        image={brandImage}
        schema={[breadcrumbSchema, faqSchema, brandSchema]}
        og={{
          type: "website",
          title: `${brandName} Franchise Opportunity`,
          description: `Invest in ${brandName} franchise with ROI of ${roi}%`,
        }}
        twitter={{
          card: "summary_large_image",
          title: `Start ${brandName} Franchise in India`,
          description: `Franchise investment: ₹${investMentRange} | ROI: ${roi}%`,
        }}
      />

      <Suspense
        fallback={
          <Box sx={{ minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress color="warning" size={40} />
          </Box>
        }
      >
        <BrandDetails
          brandData={brandData}
          fromSession={true}
          key={brandCacheKey}
        />
      </Suspense>
    </>
  );
}

export default BrandDetailsPage;
