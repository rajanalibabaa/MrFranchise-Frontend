import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import BrandDetails from "./BrandDetail.jsx";
import { openBrandDialog, closeBrandDialog } from "../../Redux/Slices/brandSlice.jsx";

function BrandDetailsPage() {
  const dispatch = useDispatch();
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { data: brands } = useSelector((state) => state.brands);

  useEffect(() => {
    
    const storedBrand = localStorage.getItem(`brand-${brandId}`);
    if (storedBrand) {
      dispatch(openBrandDialog(JSON.parse(storedBrand)));
      return;
    }

    // If not in localStorage, try to find it in Redux store
    const brand = brands.find(b => b.uuid === brandId);
    if (brand) {
      dispatch(openBrandDialog(brand));
    } else {
      dispatch(closeBrandDialog());
      navigate('/brands'); 
    }
  }, [brandId, brands, dispatch, navigate]);

  return <BrandDetails />;
}

export default BrandDetailsPage;