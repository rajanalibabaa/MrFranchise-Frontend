// api/brands.js
import axios from "axios"
import { api, API_BASE_URL } from "./api";

// Create a single axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor to inject auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const id = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID");

export const fetchBrands = async () => {
  const url = id 
    ? `${api.allBrandsApi.get.likeAndUnlikeBrands}/${id}`
    : api.allBrandsApi.get.defaultBrands;
  
  try {
    const response = await apiClient.get(url);
    // console.log("Fetched Brands:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const fetchBrandById = async (brandId) => {
  try {
    const response = await apiClient.get(
      `/brandlisting/getBrandListingByUUID/${brandId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching brand by ID:", error);
    throw error;
  }
};

export const toggleBrandLike = async ({ brandId, isLiked }) => {
  const id = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID");

  try {
    if (!id || !brandId) {
      throw new Error("Missing investorUUID or brandId");
    }

    if (!isLiked) {
      // Fix field name: use corre  ct case
      await apiClient.post(api.likeApi.post, {
        investorUUID: id,
        brandUUID: brandId,
      });
    } else {
      // Fix field name: use correct case
      await apiClient.delete(`/like/delete-favbrand/${id}`, {
        data: { brandUUID: brandId },
      });
    }

    return { brandId, isLiked: !isLiked };
  } catch (error) {
    console.error("Error toggling brand like:", error?.response?.data || error.message);
    throw error;
  }
};


export const recordBrandView = async (brandID) => {
  const id = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID");
  
  try {
    const response = await apiClient.post(
      `/api/v1/view/postViewBrands/${id}`,
      { brandID }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error recording brand view:", error);
    throw error;
  }
};