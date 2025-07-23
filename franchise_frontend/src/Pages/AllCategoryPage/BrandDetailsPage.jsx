import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import { useBrands } from "../../Hooks/Fetchbrands.jsx";
import { CircularProgress ,Box} from "@mui/material";

function BrandDetailsPage() {
  const { brandId } = useParams();
  const [fromSession, setFromSession] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Memoized brand key
  const brandKey = useMemo(() => `viewing-brand-id-${brandId}`, [brandId]);

  // Check session storage (optimized)
  useEffect(() => {
    const storedId = sessionStorage.getItem(brandKey);
    if (storedId === brandId) {
      setFromSession(true);
    }
    setIsHydrated(true);
  }, [brandId, brandKey]);

  // Fetch brands data
  const { data: brands = [], isLoading, isError } = useBrands();

  // Optimized memo for brand data
  const fallbackBrandData = useMemo(() => {
    if (!brands.length) return null;
    return brands.find((brand) => 
      brand.uuid === brandId || brand.id?.toString() === brandId
    );
  }, [brands, brandId]);

  // Loading stateimport { Box, CircularProgress } from "@mui/material";

if (isLoading || !isHydrated) {
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
        backgroundColor: "rgba(255,255,255,0.6)", // semi-transparent overlay
        zIndex: 1300, // make sure it stays above everything (MUI modal level)
      }}
    >
      <CircularProgress color="warning" size={60} />
    </Box>
  );
}

  // Error state
  if (isError) {
    return <div>Error loading brand data</div>;
  }

  // No matching brand found
  if (!fallbackBrandData) {
    return <div>Brand not found</div>;
  }

  return (
    <BrandDetails 
      brandData={fallbackBrandData}
      fromSession={fromSession}
      key={brandKey} // Using brandKey instead of brandId for consistency
    />
  );
}

export default BrandDetailsPage;