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
    console.log("Fetched Brands:", response.data.data);
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
  const investorId = localStorage.getItem("investorUUID");
  const token = localStorage.getItem("accessToken");

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    if (!isLiked) {
      // For like creation
      const response = await apiClient.post(
        '/api/v1/like/post-favbrands',
        {
          brandUUID: brandId,
          investorUUID: investorId
        },
        config
      );
      return response.data;
    } else {
      // For like removal
      const response = await apiClient.delete(
        '/api/v1/like/delete-favbrand',
        {
          ...config,
          data: {
            brandUUID: brandId,
            investorUUID: investorId
          }
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error("API Error Details:", {
      request: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      },
      response: error.response?.data
    });
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