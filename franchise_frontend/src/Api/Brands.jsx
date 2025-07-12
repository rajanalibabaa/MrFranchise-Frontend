// api/brands.js
import axios from "axios"
import { api } from "./api";
import {API_BASE_URL} from "./api";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const id = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID")

export const fetchBrands = async () => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader()
  };
  
  let url = `${api.allBrandsApi.get.defaultBrands}`

    if (id) {
      url = `${api.allBrandsApi.get.likeAndUnlikeBrands}/${id}`
    }
    
    
  const response = await axios.get(url, { headers });
  console.log("Fetched Brands   ooo:", response.data.data);
  return response.data.data;
};

export const fetchBrandById = async (brandId) => {
  const response = await axios.get(
    `https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getBrandListingByUUID/${brandId}`,
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
      `${api.likeApi.post}`,
      { branduuid: brandId },
      { headers }
    );
  } else {
    await axios.delete(
      `${API_BASE_URL}/like/delete-favbrand/${id}`,
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