import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import { useBrand } from "../../Hooks/Fetchbrands.jsx";
import { CircularProgress } from "@mui/material";

function BrandDetailsPage() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [fromSession, setFromSession] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);

  // ✅ Check if brandId is stored (just to track if it's opened from dialog)
  useEffect(() => {
    const brandKey = `viewing-brand-id-${brandId}`;
    const storedId = sessionStorage.getItem(brandKey);

    if (storedId === brandId) {
      setFromSession(true); // optional use
    }

    setCheckedStorage(true);
  }, [brandId]);

  // ✅ Fetch brand data only after session check
  const {
    data: brandData,
    isLoading,
    isError,
    error
  } = useBrand(brandId, {
    enabled: checkedStorage,
  });

  // ✅ Redirect if nothing is found
  useEffect(() => {
    if (checkedStorage && !isLoading && !brandData && isError) {
      console.error("Brand not found. Redirecting...", error);
      navigate("/brandviewpage", { replace: true });
    }
  }, [checkedStorage, isLoading, brandData, isError, navigate, error]);

  if (!checkedStorage || isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  if (!brandData) return null;

  return <BrandDetails brandData={brandData} />;
}

export default BrandDetailsPage;
