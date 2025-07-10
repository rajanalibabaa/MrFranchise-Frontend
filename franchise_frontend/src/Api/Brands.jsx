// api/brands.js
import axios from "axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchBrands = async () => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader()
  };
  
  const url =  
    // ? `https://franchise-backend-wgp6.onrender.com/api/v1/like/favbrands/getAllLikedAndUnlikedBrand/${id}`
     "https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getAllBrandListing";
    
  const response = await axios.get(url, { headers });
  console.log("Fetched Brands:", response.data.data);
  return response.data.data;
};

export const fetchBrandById = async (brandId) => {
  const response = await axios.get(
    `https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getBrandListingById/${brandId}`,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data.data;
};

export const toggleBrandLike = async ({ brandId, isLiked }) => {
  const id = localStorage?.getItem("investorUUID") || localStorage?.getItem("brandUUID");
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader()
  };

  if (!isLiked) {
    await axios.post(
      "https://franchise-backend-wgp6.onrender.com/api/v1/like/post-favbrands",
      { branduuid: brandId },
      { headers }
    );
  } else {
    await axios.delete(
      `https://franchise-backend-wgp6.onrender.com/api/v1/like/delete-favbrand/${id}`,
      { headers, data: { brandID: brandId } }
    );
  }
  return { brandId, isLiked: !isLiked };
};

export const recordBrandView = async (brandID) => {
  const id = localStorage?.getItem("investorUUID") || localStorage?.getItem("brandUUID");
  const response = await axios.post(
    `https://franchise-backend-wgp6.onrender.com/api/v1/view/postViewBrands/${id}`,
    { brandID },
    { headers: { ...getAuthHeader(), "Content-Type": "application/json" } }
  );
  return response.data.data;
};