export const validateBrandDetails = (brandDetails) => {
    const errors = {};
  
  //   // Required fields
  //   if (!brandDetails.companyName?.trim()) {
  //     errors.companyName = "Company Name is required";
  //   }
  
  //   if (!brandDetails.brandName?.trim()) {
  //     errors.brandName = "Brand Name is required";
  //   } 
  
  
  //   // GSTIN validation
  //   if (!brandDetails.gstin) {
  //     errors.gstin = "GSTIN is required";
  //   } else if (brandDetails.gstin.length !== 15) {
  //     errors.gstin = "GSTIN must be 15 characters";
  //   } else if (!/^[0-9A-Z]{15}$/.test(brandDetails.gstin)) {
  //     errors.gstin = "Invalid GSTIN format";
  //   }
  // //    else if (!brandDetails.gstVerified) {
  // //     errors.gstin = "GSTIN must be verified";
  // //   }
  
  //   // Contact information validation
  //   if (!brandDetails.mobileNumber) {
  //     errors.mobileNumber = "Mobile number is required";
  //   } else if (!/^\d{10}$/.test(brandDetails.mobileNumber)) {
  //     errors.mobileNumber = "Invalid mobile number (10 digits required)";
  //   } 
  // //   else if (!brandDetails.mobileVerified) {
  // //     errors.mobileNumber = "Mobile number must be verified";
  // //   }
  
  //   if (!brandDetails.whatsappNumber) {
  //     errors.whatsappNumber = "WhatsApp number is required";
  //   } else if (!/^\d{10}$/.test(brandDetails.whatsappNumber)) {
  //     errors.whatsappNumber = "Invalid WhatsApp number (10 digits required)";
  //   } 
  // //   else if (!brandDetails.whatsappVerified) {
  // //     errors.whatsappNumber = "WhatsApp number must be verified";
  // //   }
  
  //   if (!brandDetails.email) {
  //     errors.email = "Email is required";
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brandDetails.email)) {
  //     errors.email = "Invalid email format";
  //   } 
  // //   else if (!brandDetails.emailVerified) {
  // //     errors.email = "Email must be verified";
  // //   }
  
  //   // Location validation
  //   if (!brandDetails.country) {
  //     errors.country = "Country is required";
  //   }
  
  //   if (!brandDetails.pincode) {
  //     errors.pincode = "Pincode is required";
  //   } else if (!/^\d+$/.test(brandDetails.pincode)) {
  //     errors.pincode = "Pincode must contain only numbers";
  //   }
  
  //   if (!brandDetails.state) {
  //     errors.state = "State is required";
  //   }
  
  //   if (!brandDetails.city) {
  //     errors.city = "City is required";
  //   }
  
  //   if (!brandDetails.address) {
  //     errors.address = "Address is required";
  //   } else if (brandDetails.address.length < 10) {
  //     errors.address = "Address should be more detailed";
  //   }
  
  //   // Categories validation
  //   if (!brandDetails.categories || brandDetails.categories.length === 0) {
  //     errors.categories = "At least one category is required";
  //   } else if (brandDetails.categories.length > 5) {
  //     errors.categories = "Maximum 5 categories allowed";
  //   }
  
  //   // Description validation
  //   if (!brandDetails.description) {
  //     errors.description = "Description is required";
  //   } else if (brandDetails.description.length < 50) {
  //     errors.description = "Description should be at least 50 characters";
  //   } else if (brandDetails.description.length > 1000) {
  //     errors.description = "Description should be less than 1000 characters";
  //   }
  
   
  //   if (!brandDetails.establishedYear) {
  //     errors.establishedYear = "Established year is required";
  //   } 
  
  //   if (!brandDetails.franchiseSinceYear) {
  //    errors.franchiseSinceYear = "Franchise since year is required";
  //     }
    
  
  //   // Social media validation
  //   const hasSocialMedia =
  //     brandDetails.website ||
  //     brandDetails.facebook ||
  //     brandDetails.instagram ||
  //     brandDetails.linkedin;
  
  //   if (!hasSocialMedia) {
  //     errors.website = "At least one social media link is required";
  //     errors.facebook = "At least one social media link is required";
  //     errors.instagram = "At least one social media link is required";
  //     errors.linkedin = "At least one social media link is required";
  //   } 
  // // else {
  // //     if (
  // //       brandDetails.website &&
  // //       !/^https?:\/\/.+\..+/.test(brandDetails.website)
  // //     ) {
  // //       errors.website = "Invalid website URL";
  // //     }
  // //     if (
  // //       brandDetails.facebook &&
  // //       !/^https?:\/\/(www\.)?facebook\.com\/.+/.test(brandDetails.facebook)
  // //     ) {
  // //       errors.facebook = "Invalid Facebook URL";
  // //     }
  // //     if (
  // //       brandDetails.instagram &&
  // //       !/^https?:\/\/(www\.)?instagram\.com\/.+/.test(brandDetails.instagram)
  // //     ) {
  // //       errors.instagram = "Invalid Instagram URL";
  // //     }
  // //     if (
  // //       brandDetails.linkedin &&
  // //       !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(brandDetails.linkedin)
  // //     ) {
  // //       errors.linkedin = "Invalid LinkedIn URL";
  // //     }
  // //   }
  
    return errors;
  };
  
  export const validateExpansionPlans = (expansionData) => {
    const errors = {};
  
    // // Validate expansion type
    // if (!expansionData.expansionType) {
    //   errors.expansionType = "Expansion type is required";
    // }
  
    // if (expansionData.expansionType === "international") {
    //   // Validate at least one country is selected
    //   if (expansionData.selectedCountries.length === 0) {
    //     errors.selectedCountries = "Please select at least one country";
    //   }
  
    //   // Validate at least one state per selected country
    //   expansionData.selectedCountries.forEach(country => {
    //     const hasStates = expansionData.selectedStates.some(
    //       s => s.country === country
    //     );
    //     if (!hasStates) {
    //       if (!errors.selectedStates) errors.selectedStates = {};
    //       errors.selectedStates[country] = `Please select at least one state in ${country}`;
    //     }
    //   });
  
    // } else if (expansionData.expansionType === "domestic") {
    //   // Validate at least one Indian state is selected
    //   if (expansionData.selectedIndianStates.length === 0) {
    //     errors.selectedIndianStates = "Please select at least one Indian state";
    //   }
    // }
  
    // expansionData.selectedIndianStates.forEach(state => {
    //   const hasDistricts = expansionData.selectedIndianDistricts.some(
    //     d => d.state === state
    //   );
    //   if (!hasDistricts) {
    //     if (!errors.selectedIndianDistricts) errors.selectedIndianDistricts = {};
    //     errors.selectedIndianDistricts[state] = `Please select at least one district in ${state}`;
    //   }
    // });
  
    return errors;
  };
  
  
  
  
  // Validation function for FranchiseModel
  export const validateFranchiseModel = (franchiseData) => {
      const errors = {};
      
      // Investment Details validation
      if (!franchiseData.totalInvestment) {
        errors.totalInvestment = "Investment range is required";
      }
      
      // Required financial fields
      const financialFields = [
        'franchiseFee',
        'royaltyFee',
        'equipmentCost',
        'expectedRevenue',
        'expectedProfit',
        'spaceRequired',
        'paybackPeriod',
        'minimumCashRequired'
      ];
      
      financialFields.forEach(field => {
        if (!franchiseData[field]) {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
        }
      });
    
      // Outlet Distribution validation
      if (!franchiseData.companyOwnedOutlets) {
        errors.companyOwnedOutlets = "Company owned outlets count is required";
      }
      if (!franchiseData.franchiseOutlets) {
        errors.franchiseOutlets = "Franchise outlets count is required";
      }
      if (!franchiseData.totalOutlets) {
        errors.totalOutlets = "Total outlets count is required";
      }
    
      // Expansion Plans validation
      if (!franchiseData.expansionFranchiseFee) {
        errors.expansionFranchiseFee = "Expansion franchise fee is required";
      }
      if (!franchiseData.expansionRoyalty) {
        errors.expansionRoyalty = "Expansion royalty percentage is required";
      }
    
      return errors;
    };
  
  
    // ValidateBrandListing.jsx
  export const formatLabel = (str) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  };
  
  export const validateDocumentation = (documentation) => {
    const errors = {};
    
    // const requiredDocuments = [
    //   'brandLogo',
    //   'businessRegistration',
    //   'gstCertificate',
    //   'franchiseAgreement',
    //   'menuCatalog',
    //   'interiorPhotos',
    //   'fssaiLicense',
    //   'panCard',
    //   'aadhaarCard'
    // ];
  
    // requiredDocuments.forEach(field => {
    //   if (!documentation[field]) {
    //     errors[field] = `${formatLabel(field)} is required`;
    //   } else if (documentation[field] instanceof File) {
    //     const file = documentation[field];
    //     const maxSize = 5 * 1024 * 1024; // 5MB
        
    //     if (file.size > maxSize) {
    //       errors[field] = `${formatLabel(field)} must be less than 5MB`;
    //     }
        
    //     const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    //     if (!validTypes.includes(file.type)) {
    //       errors[field] = `${formatLabel(field)} must be a JPEG, PNG, or PDF`;
    //     }
    //   }
    // });
  
    return errors;
  };
  
  
  
  export const validateGallery = (gallery) => {
    const errors = {};
   
    // Just check if at least one media file is uploaded
    if (!gallery.mediaFiles || gallery.mediaFiles.length === 0) {
      errors.mediaFiles = "At least one media file is required";
    }
    
    return errors;
  };