// hooks/useBrands.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import{fetchBrands,fetchBrandById,recordBrandView,toggleBrandLike} from "../Api/Brands";

export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useBrand = (brandId) => {
  return useQuery({
    queryKey: ["brand", brandId],
    queryFn: () => fetchBrandById(brandId),
    enabled: !!brandId, // Only fetch if brandId exists
    staleTime: 5 * 60 * 1000,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.toggleBrandLike,
    onMutate: async ({ brandId, isLiked }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["brands"]);
      
      // Snapshot previous value
      const previousBrands = queryClient.getQueryData(["brands"]);
      
      // Optimistically update
      queryClient.setQueryData(["brands"], (old) => 
        old?.map(brand => 
          brand.uuid === brandId ? { ...brand, isLiked: !isLiked } : brand
        )
      );
      
      return { previousBrands };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBrands) {
        queryClient.setQueryData(["brands"], context.previousBrands);
      }
    },
    onSettled: () => {
      // Refresh data
      queryClient.invalidateQueries(["brands"]);
    }
  });
};

export const useRecordView = () => {
  return useMutation({
    mutationFn: recordBrandView,
  });
};

// Filter function (same as your Redux version)
export const filterBrands = (brands, filters) => {
  if (!brands) return [];
 return brands.filter(brand => {
    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const brandName = brand.brandDetails?.brandName?.toLowerCase() || "";
      const description = brand.brandDetails?.description?.toLowerCase() || "";
      const companyName = brand.brandDetails?.companyName?.toLowerCase() || "";
      
      if (!brandName.includes(term) && 
          !description.includes(term) && 
          !companyName.includes(term)) {
        return false;
      }
    }
    
    // Category filters
    if (filters.selectedCategory && 
        brand.franchiseDetails?.brandCategories?.main !== filters.selectedCategory) {
      return false;
    }
    
    if (filters.selectedSubCategory && 
        brand.franchiseDetails?.brandCategories?.sub !== filters.selectedSubCategory) {
      return false;
    }
    
    if (filters.selectedChildCategory?.length > 0 && 
        !filters.selectedChildCategory.includes(brand.franchiseDetails?.brandCategories?.child)) {
      return false;
    }
    
    // Model type filter
    if (filters.selectedModelType) {
      const fico = brand.franchiseDetails?.fico || [];
      if (!fico.some(item => item.franchiseType === filters.selectedModelType)) {
        return false;
      }
    }
    
    // Location filters
    if (filters.selectedState || filters.selectedDistrict || filters.selectedCity) {
      const domesticLocations = brand.expansionLocationData?.expansionLocations.domestic?.locations || [];
      let hasMatchingLocation = false;
      
      for (const location of domesticLocations) {
        // Check state match
        if (filters.selectedState && location.state !== filters.selectedState) {
          continue;
        }
        
        // If no district or city filter, any location in the state matches
        if (!filters.selectedDistrict && !filters.selectedCity) {
          hasMatchingLocation = true;
          break;
        }
        
        // Check districts in this location
        const districts = location.districts || [];
        for (const districtObj of districts) {
          // Check district match
          if (filters.selectedDistrict && districtObj.district !== filters.selectedDistrict) {
            continue;
          }
          
          // If no city filter, any district in the state matches
          if (!filters.selectedCity) {
            hasMatchingLocation = true;
            break;
          }
          
          // Check cities in this district
          const cities = districtObj.cities || [];
          if (cities.includes(filters.selectedCity)) {
            hasMatchingLocation = true;
            break;
          }
        }
        
        if (hasMatchingLocation) break;
      }
      
      if (!hasMatchingLocation) return false;
    }
    
    // Investment range filter
    if (filters.selectedInvestmentRange) {
      const fico = brand.franchiseDetails?.fico || [];
      if (!fico.some(item => item.investmentRange === filters.selectedInvestmentRange)) {
        return false;
      }
    }
    
    return true;
  });
};