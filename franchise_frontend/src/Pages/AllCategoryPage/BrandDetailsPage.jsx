import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx"; // This will be our renamed component
import { openBrandDialog, closeBrandDialog } from "../../Redux/Slices/brandSlice.jsx";

function BrandDetailsPage() {
  const dispatch = useDispatch();
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { data: brands } = useSelector((state) => state.brands);

  useEffect(() => {
    // Find the brand by ID when the route changes
    const brand = location.state?.brand ||brands.find(b => b.uuid === brandId);
    if (brand) {
      dispatch(openBrandDialog(brand));
    } else {
      dispatch(closeBrandDialog());
      navigate('/brands'); // Redirect if brand not found
    }
  }, [brandId, brands, dispatch, navigate, location.state]);

  return <BrandDetails />;
}

export default BrandDetailsPage;