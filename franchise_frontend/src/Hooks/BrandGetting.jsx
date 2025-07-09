import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import axios from 'axios'

const token = localStorage.getItem("accessToken");
const id = localStorage?.getItem("investorUUID") || localStorage?.getItem("brandUUID");


// API functions
const fetchBrands = async () => {
  let response;

  if (!token) {
    response = await axios.get(
      "https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getAllBrandListing",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    response = await axios.get(
      `https://franchise-backend-wgp6.onrender.com/api/v1/like/favbrands/getAllLikedAndUnlikedBrand/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  return response.data.data;
};

const fetchBrandById = async (brandId) => {
  const response = await axios.get(
    `https://franchise-backend-wgp6.onrender.com/api/v1/brandlisting/getBrandListingById/${brandId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};