import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import { CircularProgress, Box } from "@mui/material";
import axios from "axios";

function BrandDetailsPage() {
  const { brandId: routeBrandId } = useParams();
  const location = useLocation();
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the most relevant brand ID (priority: URL param > location state > localStorage)
  const brandId = useMemo(() => {
    // First check if brandId is passed in route params
    if (routeBrandId) return routeBrandId;
    
    // Then check if brandId is passed in location state (from dialog/navigation)
    if (location.state?.brandId) return location.state.brandId;
    
    // Finally fall back to localStorage
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("brand-")) {
        const item = JSON.parse(localStorage.getItem(key));
        if (item?.uuid) return item.uuid;
      }
    }
    
    return null;
  }, [routeBrandId, location.state]);

  // Generate a unique key for this brand view
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
        
        // Check sessionStorage first for cached data
        const cachedData = sessionStorage.getItem(`brand-data-${brandId}`);
        if (cachedData) {
          setBrandData(JSON.parse(cachedData));
          console.log("Using cached brand data");
          setLoading(false);
          return;
        }

        // Fetch fresh data from API
        const res = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brandId}`
        );
        
        const brandData = res.data?.data;
        if (brandData) {
          setBrandData(brandData);
          // Cache the data in sessionStorage
          sessionStorage.setItem(`brand-data-${brandId}`, JSON.stringify(brandData));
          console.log("Brand data fetched:", brandData);
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

  return (
    <BrandDetails
      brandData={brandData}
      fromSession={true}
      key={brandKey}
    />
  );
}

export default BrandDetailsPage;