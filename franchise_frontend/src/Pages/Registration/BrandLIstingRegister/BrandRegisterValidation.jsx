const validateBrandDetails = (data) => {
  const errors = {};
  
  // Helper function to check if a value is empty
  const isEmpty = (value) => !value || !value.toString().trim();
  
  // Personal Information
  if (isEmpty(data.fullName)) errors.fullName = "Full name is required";
  
  // Contact Information
  if (isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  
  if (isEmpty(data.mobileNumber)) {
    errors.mobileNumber = "Mobile number is required";
  } else if (!/^\+\d{8,15}$/.test(data.mobileNumber)) {
    errors.mobileNumber = "Invalid mobile number format";
  }
  
  if (isEmpty(data.whatsappNumber)) {
    errors.whatsappNumber = "WhatsApp number is required";
  } else if (!/^\+\d{8,15}$/.test(data.whatsappNumber)) {
    errors.whatsappNumber = "Invalid WhatsApp number format";
  }
  
  // Brand Information
  if (isEmpty(data.companyName)) errors.companyName = "Company name is required";
  if (isEmpty(data.brandName)) errors.brandName = "Brand name is required";
    if (isEmpty(data.brandName)) errors.Tagline = "Brand name is required";
  
  // CEO Information
  if (isEmpty(data.ceoName)) errors.ceoName = "CEO name is required";
  
  if (isEmpty(data.ceoEmail)) {
    errors.ceoEmail = "CEO email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ceoEmail)) {
    errors.ceoEmail = "Invalid CEO email format";
  }
  
  if (isEmpty(data.ceoMobile)) {
    errors.ceoMobile = "CEO mobile number is required";
  } else if (!/^\+\d{8,15}$/.test(data.ceoMobile)) {
    errors.ceoMobile = "Invalid CEO mobile number format";
  }
  
  // Office Information
  if (isEmpty(data.headOfficeAddress)) {
    errors.headOfficeAddress = "Head office address is required";
  }
  
  if (isEmpty(data.country)) errors.country = "Country is required";
  if (isEmpty(data.pincode)) {
    errors.pincode = data.country === "India" ? "Pincode is required" : "Postal code is required";
  } else if (data.country === "India" && !/^\d{6}$/.test(data.pincode)) {
    errors.pincode = "Pincode must be 6 digits";
  }
  
  if (isEmpty(data.state)) errors.state = "State is required";
  if (isEmpty(data.city)) errors.city = "City is required";
  if (isEmpty(data.district)) errors.district = "District is required";
  
  // Brand Details
  if (!Array.isArray(data.brandCategories) || data.brandCategories.length === 0) {
    errors.brandCategories = "At least one category is required";
  }
  
  if (isEmpty(data.brandDescription)) {
    errors.brandDescription = "Brand description is required";
  }
  
  if (!Array.isArray(data.expansionLocation) || data.expansionLocation.length === 0) {
    errors.expansionLocation = "At least one expansion location is required";
  }
  
  // Business Information
  if (isEmpty(data.establishedYear)) {
    errors.establishedYear = "Established year is required";
  } else if (!/^\d{4}$/.test(data.establishedYear)) {
    errors.establishedYear = "Year must be 4 digits";
  } else if (parseInt(data.establishedYear) > new Date().getFullYear()) {
    errors.establishedYear = "Year cannot be in the future";
  }
  
  if (isEmpty(data.franchiseSinceYear)) {
    errors.franchiseSinceYear = "Franchise since year is required";
  } else if (!/^\d{4}$/.test(data.franchiseSinceYear)) {
    errors.franchiseSinceYear = "Year must be 4 digits";
  } else if (parseInt(data.franchiseSinceYear) > new Date().getFullYear()) {
    errors.franchiseSinceYear = "Year cannot be in the future";
  } else if (
    data.establishedYear &&
    parseInt(data.franchiseSinceYear) < parseInt(data.establishedYear)
  ) {
    errors.franchiseSinceYear = "Cannot be before established year";
  }
  
  // Website validation if provided
  if (data.website && !isEmpty(data.website)) {
    if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(data.website)) {
      errors.website = "Invalid website URL";
    }
  }
  
  return errors;
};

// Validation for Franchise Details
const validateFranchiseDetails = (data) => {
  const errors = {};
  
//   // // Validate FICO models
//   if (!data.fico || data.fico.length === 0) {
//     errors.fico = "At least one FICO model is required";
//   } else {
//     data.fico.forEach((model, index) => {
//       if (!model.investmentRange) {
//         errors[`fico[${index}].investmentRange`] = "Investment range is required";
//       }
//       if (!model.areaRequired) {
//         errors[`fico[${index}].areaRequired`] = "Area required is required";
//       }
//       if (!model.franchiseModel) {
//         errors[`fico[${index}].franchiseModel`] = "Franchise model is required";
//       }
//       if (!model.franchiseType) {
//         errors[`fico[${index}].franchiseType`] = "Franchise type is required";
//       }
//       if (!model.franchiseFee) {
//         errors[`fico[${index}].franchiseFee`] = "Franchise fee is required";
//       }
//       if (!model.royaltyFee) {
//         errors[`fico[${index}].royaltyFee`] = "Royalty fee is required";
//       }
//       if (!model.interiorCost) {
//         errors[`fico[${index}].interiorCost`] = "Interior cost is required";
//       }
//       if (!model.stockCost) {
//         errors[`fico[${index}].stockCost`] = "Stock Investment is required";
//       }
//       if (!model.otherCost) {
//         errors[`fico[${index}].otherCost`] = "Other cost is required";
//       }
//       if (!model.roi) {
//         errors[`fico[${index}].roi`] = "ROI period is required";
//       }
  
//       if (!model.breakEven) {
//         errors[`fico[${index}].breakEven`] = "Break even period is required";
//       }
//       if (!model.requireWorkingCapital) {
//         errors[`fico[${index}].requireWorkingCapital`] = "Required working capital is required";
//       }
//       if (!model.propertyType) {
//         errors[`fico[${index}].propertyType`] = "Property type is required";
//       }
//     });
//   }

//   // // Validate franchise network
//   // if (!data.companyOwnedOutlets) {
//   //   errors.companyOwnedOutlets = "Company owned outlets is required";
//   // }
//   // if (!data.franchiseOutlets) {
//   //   errors.franchiseOutlets = "Franchise outlets is required";
//   // }
//   // if (!data.totalOutlets) {
//   //   errors.totalOutlets = "Total outlets is required";
//   // }
//   // // Validate franchise network
//   if (!data.companyOwnedOutlets) {
//     errors.companyOwnedOutlets = "Company owned outlets is required";
//   }
//   if (!data.franchiseOutlets) {
//     errors.franchiseOutlets = "Franchise outlets is required";
//   }
//   if (!data.totalOutlets) {
//     errors.totalOutlets = "Total outlets is required";
//   }
//   if( !data.currentOutletsLocatedAt){
//     errors.currentOutletsLocatedAt="Current outlets located at is required";
//   }
//   if(!data.internationalExpansion){
//     errors.internationalExpansion="International expansion is required";
//   }
//   if(!data.aidFinancing){
//     errors.aidFinancing="Aid financing is required";
//   }

//   // // Validate support and training
//   // if (!data.requirementSupport) {
//   //   errors.requirementSupport = "Requirement support is required";
//   // }
//   // if (!data.trainingProvidedBy) {
//   //   errors.trainingProvidedBy = "Training provider is required";
//   // }
//   // if (!data.agreementPeriod) {
//   //   errors.agreementPeriod = "Agreement period is required";
//   // }

//   // Validate support and training
//   if (!data.requirementSupport) {
//     errors.requirementSupport = "Requirement support is required";
//   }
//   if (!data.staffTraining) {
//     errors.staffTraining = "Staff Training provider is required";
//   }
//    if (!data.staffRecruitment) {
//     errors.staffRecruitment = "Staff Recruitment provider is required";
//   }
//   if (!data.agreementPeriod) {
//     errors.agreementPeriod = "Agreement period is required";
//   }
//   if (!data.statergicPlan){
//     errors.statergicPlan="Field is required";
//   }
//   if (!data.operatingProcedure){
//     errors.operatingProcedure="Field is required";
//   }
// if (!data.finacialOperating){
//     errors.finacialOperating="Field is required";
//   }

//   if (!data.marketingSales){
//     errors.marketingSales="Field is required";
//   }
//   if (!data.agreementFranchise){
//     errors.agreementFranchise="Field is required";
//   }
  return errors;
};

export { validateBrandDetails, validateFranchiseDetails };


