import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import { useBrand } from "../../Hooks/Fetchbrands.jsx";
import { CircularProgress } from "@mui/material";

function BrandDetailsPage() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [localBrand, setLocalBrand] = useState(null);
  
  // Use the useBrand hook to fetch brand data if not in localStorage
  const { 
    data: fetchedBrand, 
    isLoading, 
    isError,
    error 
  } = useBrand(brandId, {
    enabled: !localBrand, // Only fetch if we don't have local brand data
  });

  useEffect(() => {
    // Check localStorage first
    const storedBrand = localStorage.getItem(`brand-${brandId}`);
    if (storedBrand) {
      try {
        setLocalBrand(JSON.parse(storedBrand));
      } catch (e) {
        console.error("Failed to parse stored brand data", e);
        localStorage.removeItem(`brand-${brandId}`);
      }
    }
  }, [brandId]);

  useEffect(() => {
    // If no brand found and API call failed, redirect
    if (isError || (!isLoading && !fetchedBrand && !localBrand)) {
      console.error("Failed to load brand data", error);
      navigate('/brands', { replace: true });
    }
  }, [brandId, fetchedBrand, isLoading, isError, navigate, localBrand, error]);

  // Decide which brand data to use
  const brandData = localBrand || fetchedBrand;

  if (isLoading && !localBrand) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress color="secondary"   />
      </div>
    );
  }

  if (!brandData) {
    return null; // Redirect will happen in the effect
  }

  return <BrandDetails brandData={brandData} />;
}

export default BrandDetailsPage;