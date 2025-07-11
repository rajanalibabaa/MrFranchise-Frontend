const LOCAL_API = "https://franchise-backend-wgp6.onrender.com/api/v1";
const RENDER_API = "https://franchise-backend-wgp6.onrender.com/api/v1";

// Option 1: Ping localhost, fallback to Render (recommended for production)
export const getApiBaseUrl = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000); // 1s timeout

    const res = await fetch(`${LOCAL_API}/health`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) return LOCAL_API;
    throw new Error("Localhost not available");
  } catch (error) {
    return RENDER_API;
  }
};

// Option 2: Use static API based on environment (simple & fast)
export const API_BASE_URL = "https://franchise-backend-wgp6.onrender.com/api/v1";
  // import.meta.env.MODE === "development" ? LOCAL_API : RENDER_API;





  // API Endpoints
export const api = {

  allBrandsApi : {
    get : {
      defaultBrands : `${API_BASE_URL}/brandlisting/getAllBrandListing`,
      likeAndUnlikeBrands :`${API_BASE_URL}/like/favbrands/getAllLikedAndUnlikedBrand`
    }
  },


  viewApi: {
    post: `${API_BASE_URL}/view/postViewBrands`,
    get: {
      getAllViewBrandByID: `${API_BASE_URL}/view/getAllViewBrandByID`
    },
    delete: `${API_BASE_URL}/view/deleteViewBrandByID`
  },
  likeApi: {
    post: `${API_BASE_URL}/like/post-favbrands`,
    get: `${API_BASE_URL}/like/get-favbrands`,
    delete: `${API_BASE_URL}/like/delete-favbrand`
  },
  instantApplyApi: {
    post: `${API_BASE_URL}/instantapply/postInstaApply`,
    get: {
      getInstaApplyById: `${API_BASE_URL}/instantapply/getInstaApplyById`
    }
  },
  user: {
    get: {
      investor: `${API_BASE_URL}/investor/getInvestorByUUID`
    }
  }
};