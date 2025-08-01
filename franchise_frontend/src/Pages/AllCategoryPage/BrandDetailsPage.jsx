import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import { CircularProgress, Box } from "@mui/material";
import axios from "axios";
 
function BrandDetailsPage() {
  const { brandId: routeBrandId } = useParams(); // fallback if needed
  const [brandData, setBrandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Get brandId from localStorage instead of URL
  const brandId = useMemo(() => {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("brand-")) {
        const item = JSON.parse(localStorage.getItem(key));
        if (item?.uuid) return item.uuid;
      }
    }
    return routeBrandId; // fallback if needed
  }, [routeBrandId]);
 
  const brandKey = useMemo(() => `viewing-brand-id-${brandId}`, [brandId]);
 
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/v1/brandlisting/getBrandListingByUUID/${brandId}`
        );
        setBrandData(res.data?.data); // depends on your API response structure
        console.log("Brand data fetched:", res.data?.data);
        sessionStorage.setItem(brandKey, brandId);
      } catch (err) {
        console.error("Error fetching brand data:", err);
        setError("Failed to load brand details.");
      } finally {
        setLoading(false);
      }
    };
 
    if (brandId) {
      fetchBrand();
    } else {
      setError("Brand ID not found in localStorage.");
      setLoading(false);
    }
  }, [brandId, brandKey]);
 
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
 
  if (error) return <div>{error}</div>;
 
  if (!brandData) return <div>No brand data found.</div>;
 
  return (
    <BrandDetails
      brandData={brandData}
      fromSession={true}
      key={brandKey}
    />
  );
}
 
export default BrandDetailsPage;