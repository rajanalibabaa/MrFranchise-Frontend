import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import { useBrands } from "../../Hooks/Fetchbrands.jsx";

function BrandDetailsPage() {
  const { brandId } = useParams();
  const [fromSession, setFromSession] = useState(false);

  // Memoize the brand key to avoid recomputation
  const brandKey = useMemo(() => `viewing-brand-id-${brandId}`, [brandId]);

  // ✅ Check session storage (optimized)
  useEffect(() => {
    const storedId = sessionStorage.getItem(brandKey);
    if (storedId === brandId) {
      setFromSession(true);
    }
    // No need to clean up as we're just reading
  }, [brandId, brandKey]); // Added brandKey to dependencies

  // Consider adding error handling if useBrands supports it
  const { data: brands = [] } = useBrands();
  
  // Optimized memo with early return
  const fallbackBrandData = useMemo(() => {
    if (!brands.length) return null;
    return brands.find((brand) => 
      brand.uuid === brandId || brand.id?.toString() === brandId
    );
  }, [brands, brandId]);

  // Early return if no data yet
  if (!fallbackBrandData) return null;

  return (
    <BrandDetails 
      brandData={fallbackBrandData} 
      fromSession={fromSession} 
      key={brandId} // Add key to force re-render when brand changes
    />
  );
}

export default BrandDetailsPage;