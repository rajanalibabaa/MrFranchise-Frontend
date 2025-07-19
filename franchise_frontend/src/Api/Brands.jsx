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
  // const investorId = localStorage.getItem("investorUUID") || localStorage.getItem("brandUUID");
  const token = localStorage.getItem("accessToken");

  console.log("brandId :",brandId)
  console.log("brandId isLiked  :",isLiked)
  const brands = await fetchBrands();
  brands.filter(brand =>{
    if ( brand.uuid === brandId) {
      console.log("Brand found:", brand);
      console.log("Brand found:", brand.isLiked);
     
      
    }
     
  });
  


  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    if (!isLiked) {
       console.log("if  :",isLiked)
      // For like creation
      // const response = await apiClient.post(
      //   '/api/v1/like/post-favbrands',
      //   {
      //     branduuid: brandId,
      //     // investorUUID: investorId
      //   },
      //   config
      // );
      

      const response = await axios.post(`${api.likeApi.post}`,
          {
          branduuid: brandId,
          // investorUUID: investorId
        },
        config
      )

      return response.data;
    } else {
      console.log("else  :",isLiked)
      // For like removal
      // const response = await apiClient.delete(
      //   '/api/v1/like/delete-favbrand',
      //   {
      //     ...config,
      //     data: {
      //       brandID: brandId,
      //       // investorUUID: investorId
      //     }
      //   }
      // );

      const response = await axios.delete(`${api.likeApi.delete}/${id}`,
        {
          branduuid: brandId,
          // investorUUID: investorId
        },
        config
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
      // response: error?.response?.data
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