import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import {  useBrands } from "../../Hooks/Fetchbrands.jsx";

function BrandDetailsPage() {
  const { brandId } = useParams();
  const [fromSession, setFromSession] = useState(false);

  // ✅ Check session storage (optional tracking)
  useEffect(() => {
    const brandKey = `viewing-brand-id-${brandId}`;
    const storedId = sessionStorage.getItem(brandKey);
    if (storedId === brandId) {
      setFromSession(true);
    }
  }, [brandId]);

 
  const { data: brands = [] } = useBrands();
  const fallbackBrandData = useMemo(() => {
    return brands.find((brand) => brand.uuid === brandId || brand.id?.toString() === brandId);
  }, [brands, brandId]);

  const finalBrandData = fallbackBrandData;

  if (!finalBrandData) return null;

  return <BrandDetails brandData={finalBrandData} fromSession={fromSession} />;
}

export default BrandDetailsPage;
