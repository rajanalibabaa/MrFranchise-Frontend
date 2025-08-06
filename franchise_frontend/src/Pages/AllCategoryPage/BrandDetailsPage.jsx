import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import { CircularProgress, Box } from "@mui/material";
import axios from "axios";
import { userId } from "../../Utils/autherId.jsx";
import SEO from "../../Components/SEO/Seo";

function BrandDetailsPage() {
  const { brandId: routeBrandId } = useParams();
  const location = useLocation();
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the most relevant brand ID
  const brandId = useMemo(() => {
    if (routeBrandId) return routeBrandId;
    if (location.state?.brandId) return location.state.brandId;
    
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("brand-")) {
        const item = JSON.parse(localStorage.getItem(key));
        if (item?.uuid) return item.uuid;
      }
    }
    return null;
  }, [routeBrandId, location.state]);

  const brandKey = useMemo(() => `brand-view-${brandId || 'none'}`, [brandId]);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!brandId) {
        setError("Brand ID not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const cachedData = sessionStorage.getItem(`brand-data-${brandId}`);
        if (cachedData) {
          setBrandData(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brandId}`,
          { params: { userId } }
        );
        
        const brandData = res.data?.data;
        if (brandData) {
          setBrandData(brandData);
          sessionStorage.setItem(`brand-data-${brandId}`, JSON.stringify(brandData));
        } else {
          throw new Error("No data returned from API");
        }
      } catch (err) {
        console.error("Error fetching brand data:", err);
        setError(err.response?.data?.message || "Failed to load brand details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [brandId]);

  if (loading) {
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

  if (error) return <div>Error: {error}</div>;
  if (!brandData) return <div>No brand data found for ID: {brandId}</div>;

  // Generate SEO data
  const brandUrl = `https://mrfranchise.in/brand/${brandData.slug || brandId}`;
  const brandImage = brandData.logo || "https://mrfranchise.in/images/default-brand.jpg";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mrfranchise.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": brandData.category || "Food & Beverage",
        "item": `https://mrfranchise.in/franchises/${(brandData.category || 'food-and-beverage').toLowerCase().replace(/ /g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": brandData.name,
        "item": brandUrl
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How much does a ${brandData.name} franchise cost in India?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The total investment for a ${brandData.name} franchise ranges between ₹${brandData.investmentRange || '5-50 lakhs'}.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the ROI for ${brandData.name} franchise?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${brandData.name} franchise offers an ROI of ${brandData.roi || '15-25'}% within ${brandData.roiPeriod || '12-24 months'}.`
        }
      },
      {
        "@type": "Question",
        "name": `What are the requirements to start a ${brandData.name} franchise?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Requirements include ${brandData.requirements || 'minimum 200-500 sq ft space and business experience'}.`
        }
      }
    ]
  };

  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": brandData.name,
    "url": brandUrl,
    "logo": brandImage,
    "description": brandData.shortDescription || `Franchise opportunity for ${brandData.name} in India`,
    "foundingDate": brandData.establishedYear ? `${brandData.establishedYear}-01-01` : undefined,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "India"
    }
  };

  return (
    <>
      <SEO
        title={`Start ${brandData.name} Franchise in India | Cost ₹${brandData.investmentRange || ''} | ROI ${brandData.roi || ''}%`}
        description={`${brandData.shortDescription || `Learn how to start ${brandData.name} franchise in India`}. Investment: ₹${brandData.investmentRange || '5-50 lakhs'}, ROI: ${brandData.roi || '15-25'}%. ${brandData.keyFeatures || 'Trusted brand with proven business model'}.`}
        keywords={`${brandData.name} franchise, ${brandData.name} franchise cost, ${brandData.name} ROI, ${brandData.category || 'food'} franchise opportunities`}
        canonical={brandUrl}
        url={brandUrl}
        image={brandImage}
        schema={[breadcrumbSchema, faqSchema, brandSchema]}
        og={{
          type: "website",
          title: `${brandData.name} Franchise Opportunity`,
          description: `Invest in ${brandData.name} franchise with ROI of ${brandData.roi || '15-25'}%`
        }}
        twitter={{
          card: "summary_large_image",
          title: `Start ${brandData.name} Franchise in India`,
          description: `Franchise investment: ₹${brandData.investmentRange || '5-50 lakhs'} | ROI: ${brandData.roi || '15-25'}%`
        }}
      />

      <BrandDetails
        brandData={brandData}
        fromSession={true}
        key={brandKey}
      />
    </>
  );
}

export default BrandDetailsPage;