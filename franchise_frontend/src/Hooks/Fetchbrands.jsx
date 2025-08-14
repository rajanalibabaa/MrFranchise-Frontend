  import {  useMutation, useQueryClient } from "@tanstack/react-query";
  import {  recordBrandView, toggleBrandLike } from "../Api/Brands";




export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleBrandLike,
    onMutate: async ({ brandId, isLiked }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["brands"]);
      
      // Get current data snapshot
      const previousBrands = queryClient.getQueryData(["brands"]);
      
      // Optimistically update the UI
      queryClient.setQueryData(["brands"], (old) => 
        old?.map(brand => 
          brand.uuid === brandId 
            ? { ...brand, isLiked: !isLiked } 
            : brand
        )
      );
      
      return { previousBrands };
    },
    onError: (error, variables, context) => {
      console.error("Like toggle failed:", error);
      // Rollback optimistic update
      if (context?.previousBrands) {
        queryClient.setQueryData(["brands"], context.previousBrands);
      }
    },
    onSettled: () => {
      // Ensure data is in sync with server
      queryClient.invalidateQueries(["brands"]);
    }
  });
};
  export const useRecordView = () => {
    return useMutation({
      mutationFn: recordBrandView,
    });
  };

