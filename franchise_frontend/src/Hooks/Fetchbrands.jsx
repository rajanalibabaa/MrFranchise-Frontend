  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { fetchBrands, fetchBrandById, recordBrandView, toggleBrandLike } from "../Api/Brands";

  // Cache configuration
  const CACHE_TIME = 10 * 60 * 1000; // 10 minutes
  const STALE_TIME = 5 * 60 * 1000; // 5 minutes

  // Predefined selectors for optimized data access
  const brandSelectors = {
    basicInfo: (brand) => ({
      uuid: brand.uuid,
      brandName: brand.brandDetails?.brandName,
      logo: brand.brandDetails?.logo,
      isLiked: brand.isLiked
    }),
    forFiltering: (brand) => ({
      uuid: brand.uuid,
      brandName: brand.brandDetails?.brandName,
      categories: brand.franchiseDetails?.brandCategories,
      locations: brand.expansionLocationData?.expansionLocations?.domestic?.locations || [],
      investmentRanges: brand.franchiseDetails?.fico?.map(f => f.investmentRange) || []
    }),
    forListing: (brand) => ({
      ...brandSelectors.basicInfo(brand),
      description: brand.brandDetails?.description,
      companyName: brand.brandDetails?.companyName,
      investmentRange: brand.franchiseDetails?.fico?.[0]?.investmentRange
    })
  };

  export const useBrands = (options = {}) => {
    return useQuery({
      queryKey: ["brands"],
      queryFn: fetchBrands,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      select: (data) => {
        // Apply selector if provided in options
        if (options.selector) {
          return data.map(options.selector);
        }
        return data;
      },
      onError: (error) => {
        console.error("Failed to fetch brand:", error);
      },
      ...options
    });
  };

  export const useBrand = (brandId, options = {}) => {
    return useQuery({
      queryKey: ["brand", brandId],
      queryFn: () => fetchBrandById(brandId),
      enabled: !!brandId,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      
      ...options
    });
  };

  export const useBrandsForFiltering = () => {
    return useBrands({
      selector: brandSelectors.forFiltering,
      // Keep fresh data for filtering
      staleTime: 2 * 60 * 1000 // 2 minutes
    });
  };

  export const useBrandsForListing = () => {
    return useBrands({
      selector: brandSelectors.forListing
    });
  };

 export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleBrandLike,
    onMutate: async ({ brandId, isLiked }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries(["brands"]);
      
      // Snapshot the previous value
      const previousBrands = queryClient.getQueryData(["brands"]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["brands"], (old) => 
        old?.map(brand => 
          brand.uuid === brandId ? { 
            ...brand, 
            isLiked: !isLiked,
            // Add optimistic flag to track this update
            _optimistic: true 
          } : brand
        )
      );
      
      return { previousBrands, brandId, isLiked };
    },
    onError: (err, variables, context) => {
      // Roll back to previous value on error
      if (context?.previousBrands) {
        queryClient.setQueryData(["brands"], context.previousBrands);
      }
      
      // Optionally show error feedback to user
      toast.error("Failed to update like status");
    },
    onSuccess: (data, variables, context) => {
      // Update with server data on success
      queryClient.setQueryData(["brands"], (old) => 
        old?.map(brand => 
          brand.uuid === context?.brandId ? { 
            ...brand, 
            isLiked: !context.isLiked,
            _optimistic: undefined // Remove optimistic flag
          } : brand
        )
      );
    },
    // Use onSettled carefully - it might cause unnecessary refetches
    // onSettled: () => {
    //   queryClient.invalidateQueries(["brands"]);
    // }
  });
};

  export const useRecordView = () => {
    return useMutation({
      mutationFn: recordBrandView,
    });
  };

  // Optimized filter function using early returns and memoized selectors
  export const filterBrands = (brands, filters) => {
    if (!brands || !Array.isArray(brands)) return [];
    
    return brands.filter(brand => {
      // Search term filter (if present)
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
      
      // Category filters with early return
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
        const hasModelType = brand.franchiseDetails?.fico?.some(
          item => item.franchiseType === filters.selectedModelType
        );
        if (!hasModelType) return false;
      }
      
      // Location filters with optimized checking
      if (filters.selectedState || filters.selectedDistrict || filters.selectedCity) {
        const locations = brand.expansionLocationData?.expansionLocations?.domestic?.locations || [];
        const hasLocation = locations.some(location => {
          // Check state match
          if (filters.selectedState && location.state !== filters.selectedState) {
            return false;
          }
          
          // Check districts if needed
          if (filters.selectedDistrict || filters.selectedCity) {
            const districts = location.districts || [];
            return districts.some(districtObj => {
              // Check district match
              if (filters.selectedDistrict && districtObj.district !== filters.selectedDistrict) {
                return false;
              }
              
              // Check city if needed
              if (filters.selectedCity) {
                const cities = districtObj.cities || [];
                return cities.includes(filters.selectedCity);
              }
              
              return true;
            });
          }
          
          return true;
        });
        
        if (!hasLocation) return false;
      }
      
      // Investment range filter
      if (filters.selectedInvestmentRange) {
        const hasInvestmentRange = brand.franchiseDetails?.fico?.some(
          item => item.investmentRange === filters.selectedInvestmentRange
        );
        if (!hasInvestmentRange) return false;
      }
      
      return true;
    });
  };

  // Optimized version for large datasets
  export const fastFilterBrands = (brands, filters) => {
    if (!brands || !Array.isArray(brands)) return [];
    
    // Convert filters to more efficient format
    const {
      searchTerm,
      selectedCategory,
      selectedSubCategory,
      selectedChildCategory = [],
      selectedModelType,
      selectedState,
      selectedDistrict,
      selectedCity,
      selectedInvestmentRange
    } = filters;
    
    const searchTermLower = searchTerm?.toLowerCase();
    
    return brands.filter(brand => {
      // Early exit if no match
      if (searchTermLower) {
        const brandName = brand.brandDetails?.brandName?.toLowerCase() || "";
        if (!brandName.includes(searchTermLower)) {
          const description = brand.brandDetails?.description?.toLowerCase() || "";
          const companyName = brand.brandDetails?.companyName?.toLowerCase() || "";
          if (!description.includes(searchTermLower) && !companyName.includes(searchTermLower)) {
            return false;
          }
        }
      }
      
      if (selectedCategory && brand.franchiseDetails?.brandCategories?.main !== selectedCategory) {
        return false;
      }
      
      if (selectedSubCategory && brand.franchiseDetails?.brandCategories?.sub !== selectedSubCategory) {
        return false;
      }
      
      if (selectedChildCategory.length > 0 && 
          !selectedChildCategory.includes(brand.franchiseDetails?.brandCategories?.child)) {
        return false;
      }
      
      if (selectedModelType && 
          !brand.franchiseDetails?.fico?.some(f => f.franchiseType === selectedModelType)) {
        return false;
      }
      
      if (selectedState || selectedDistrict || selectedCity) {
        let hasLocation = false;
        const locations = brand.expansionLocationData?.expansionLocations?.domestic?.locations || [];
        
        for (const location of locations) {
          if (selectedState && location.state !== selectedState) continue;
          
          if (selectedDistrict || selectedCity) {
            const districts = location.districts || [];
            for (const district of districts) {
              if (selectedDistrict && district.district !== selectedDistrict) continue;
              
              if (selectedCity) {
                if (district.cities?.includes(selectedCity)) {
                  hasLocation = true;
                  break;
                }
              } else {
                hasLocation = true;
                break;
              }
            }
          } else {
            hasLocation = true;
          }
          
          if (hasLocation) break;
        }
        
        if (!hasLocation) return false;
      }
      
      if (selectedInvestmentRange && 
          !brand.franchiseDetails?.fico?.some(f => f.investmentRange === selectedInvestmentRange)) {
        return false;
      }
      
      return true;
    });
  };

export const openBrandDialog = (brand) => {

  console.log("============ :",brand)
  const brandSlug = brand.brandDetails?.brandName
    ?.toLowerCase()
    ?.replace(/\s+/g, '-')
    ?.replace(/[^a-z0-9\-]/g, '')
    ?.substring(0, 50);

  const brandKey = `viewing-brand-id-${brand.uuid}`;
  sessionStorage.setItem(brandKey, brand.uuid); // ✅ Only store ID

  const newWindow = window.open(`/brands/${brand.uuid}?--${brandSlug}`, '_blank');

  // 🧹 Auto-remove sessionStorage when tab is closed
  if (newWindow) {
    const interval = setInterval(() => {
      if (newWindow.closed) {
        sessionStorage.removeItem(brandKey);
        clearInterval(interval);
      }
    }, 1000); // check every 1s
  }
};

