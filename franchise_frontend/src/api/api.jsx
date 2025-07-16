
export const API_BASE_URL =  "https://mrfranchisebackend.mrfranchise.in/api/v1";





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