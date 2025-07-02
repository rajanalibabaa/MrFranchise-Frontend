const validateBrandDetails = (data) => {
  const errors = {};
  
  // // Helper function to check if a value is empty
  // const isEmpty = (value) => !value || !value.toString().trim();
  
  // // Personal Information
  // if (isEmpty(data.fullName)) errors.fullName = "Full name is required";
  
  // // Contact Information
  // if (isEmpty(data.email)) {
  //   errors.email = "Email is required";
  // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
  //   errors.email = "Invalid email format";
  // }
  
  // if (isEmpty(data.mobileNumber)) {
  //   errors.mobileNumber = "Mobile number is required";
  // } else if (!/^\+\d{8,15}$/.test(data.mobileNumber)) {
  //   errors.mobileNumber = "Invalid mobile number format";
  // }
  
  // if (isEmpty(data.whatsappNumber)) {
  //   errors.whatsappNumber = "WhatsApp number is required";
  // } else if (!/^\+\d{8,15}$/.test(data.whatsappNumber)) {
  //   errors.whatsappNumber = "Invalid WhatsApp number format";
  // }
  
  // Brand Information
  // if (isEmpty(data.companyName)) errors.companyName = "Company name is required";
  // if (isEmpty(data.brandName)) errors.brandName = "Brand name is required";
  //   if (isEmpty(data.tagLine)) errors.tagLine = "TagLine is required";
  
  // // CEO Information
  // if (isEmpty(data.ceoName)) errors.ceoName = "CEO name is required";
  
  // if (isEmpty(data.ceoEmail)) {
  //   errors.ceoEmail = "CEO email is required";
  // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ceoEmail)) {
  //   errors.ceoEmail = "Invalid CEO email format";
  // }
  
  // if (isEmpty(data.ceoMobile)) {
  //   errors.ceoMobile = "CEO mobile number is required";
  // } else if (!/^\+\d{8,15}$/.test(data.ceoMobile)) {
  //   errors.ceoMobile = "Invalid CEO mobile number format";
  // }
  
  // Office Information
  // if (isEmpty(data.headOfficeAddress)) {
  //   errors.headOfficeAddress = "Head office address is required";
  // }
  //   if (isEmpty(data.officeemail)) {
  //   errors.officeEmail = " Office Email is required";
  // }
  //   if (isEmpty(data.officeMobile)) {
  //   errors.officeMobile = " Office Mobile Number is required";
  // }
  
  // if (isEmpty(data.country)) errors.country = "Country is required";
  // if (isEmpty(data.pincode)) {
  //   errors.pincode = data.country === "India" ? "Pincode is required" : "Postal code is required";
  // } else if (data.country === "India" && !/^\d{6}$/.test(data.pincode)) {
  //   errors.pincode = "Pincode must be 6 digits";
  // }
  
  // if (isEmpty(data.state)) errors.state = "State is required";
  // if (isEmpty(data.city)) errors.city = "City is required";
  // if (isEmpty(data.district)) errors.district = "District is required";
  
  // // Brand Details
  // if (!Array.isArray(data.brandCategories) || data.brandCategories.length === 0) {
  //   errors.brandCategories = "At least one category is required";
  // }
  
  // if (isEmpty(data.brandDescription)) {
  //   errors.brandDescription = "Brand description is required";
  // }
  
  // if (!Array.isArray(data.expansionLocation) || data.expansionLocation.length === 0) {
  //   errors.expansionLocation = "At least one expansion location is required";
  // }
  
  // // Business Information
  // if (isEmpty(data.establishedYear)) {
  //   errors.establishedYear = "Established year is required";
  // } else if (!/^\d{4}$/.test(data.establishedYear)) {
  //   errors.establishedYear = "Year must be 4 digits";
  // } else if (parseInt(data.establishedYear) > new Date().getFullYear()) {
  //   errors.establishedYear = "Year cannot be in the future";
  // }
  
  // Website validation if provided
  // if ( isEmpty(data.website)) {
  //   if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(data.website)) {
  //     errors.website = "Invalid website URL";
  //   }
  // }
  
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

 const validateExpansionLocationDetails = (data) => {
    const errors = {};
    // if (!data.currentOutletsLocatedAt || data.currentOutletsLocatedAt.length === 0) {
    //   errors.currentOutletsLocatedAt = "Current outlets located at is required";
    // }
    // if (!data.expansionLocations || data.expansionLocations.length === 0) {
    //   errors.expansionLocations = "Expansion locations are required";
    // } else {
    //   data.expansionLocations.forEach((location, index) => {
    //     if (!location.type) {
    //       errors[`expansionLocations.${index}.type`] = "Location type is required";
    //     }

    //     if (!location.location || !location.location.country) {
    //       errors[`expansionLocations.${index}.location.country`] =
    //         "Country is required";
    //     }
    //     if (!location.location || !location.location.state) {
    //       errors[`expansionLocations.${index}.location.state`] =

    //         "State is required";
    //     }
    //     if (!location.location || !location.location.city) {
    //       errors[`expansionLocations.${index}.location.city`] =
    //         "City is required";
    //     }
    //     if (!location.location || !location.location.district) {
    //       errors[`expansionLocations.${index}.location.district`] =
    //         "District is required";
    //     }
    //   });
    // }
    return errors;
  };


  const validateUploadsDetails = (data) => {
  const errors = {};
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const allowedDocTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime'];

  // Validate brand logo
  if (!data.brandLogo || data.brandLogo.length === 0) {
    errors.brandLogo = "Brand logo is required";
  } else if (!allowedImageTypes.includes(data.brandLogo[0].type)) {
    errors.brandLogo = "Only JPEG, PNG or GIF images are allowed";
  } else if (data.brandLogo[0].size > 5 * 1024 * 1024) { // 5MB
    errors.brandLogo = "Image size should be less than 5MB";
  }

  // Validate PAN card
  if (!data.pancard || data.pancard.length === 0) {
    errors.pancard = "PAN card document is required";
  } else if (!allowedDocTypes.includes(data.pancard[0].type)) {
    errors.pancard = "Only PDF, JPEG or PNG files are allowed";
  } else if (data.pancard[0].size > 5 * 1024 * 1024) { // 5MB
    errors.pancard = "File size should be less than 5MB";
  }

  // Validate GST certificate
  if (!data.gstCertificate || data.gstCertificate.length === 0) {
    errors.gstCertificate = "GST certificate is required";
  } else if (!allowedDocTypes.includes(data.gstCertificate[0].type)) {
    errors.gstCertificate = "Only PDF, JPEG or PNG files are allowed";
  } else if (data.gstCertificate[0].size > 5 * 1024 * 1024) { // 5MB
    errors.gstCertificate = "File size should be less than 5MB";
  }

  // Validate exterior outlet images
  if (!data.exteriorOutlet || data.exteriorOutlet.length === 0) {
    errors.exteriorOutlet = "At least one exterior outlet image is required";
  } else {
    data.exteriorOutlet.forEach((file, index) => {
      if (!allowedImageTypes.includes(file.type)) {
        if (!errors.exteriorOutlet) errors.exteriorOutlet = [];
        errors.exteriorOutlet[index] = "Only JPEG, PNG or GIF images are allowed";
      } else if (file.size > 5 * 1024 * 1024) {
        if (!errors.exteriorOutlet) errors.exteriorOutlet = [];
        errors.exteriorOutlet[index] = "Image size should be less than 5MB";
      }
    });
  }

  // Validate interior outlet images
  if (!data.interiorOutlet || data.interiorOutlet.length === 0) {
    errors.interiorOutlet = "At least one interior outlet image is required";
  } else {
    data.interiorOutlet.forEach((file, index) => {
      if (!allowedImageTypes.includes(file.type)) {
        if (!errors.interiorOutlet) errors.interiorOutlet = [];
        errors.interiorOutlet[index] = "Only JPEG, PNG or GIF images are allowed";
      } else if (file.size > 5 * 1024 * 1024) {
        if (!errors.interiorOutlet) errors.interiorOutlet = [];
        errors.interiorOutlet[index] = "Image size should be less than 5MB";
      }
    });
  }

  // Validate promotion video (optional)
  if (data.franchisePromotionVideo && data.franchisePromotionVideo.length > 0) {
    if (!allowedVideoTypes.includes(data.franchisePromotionVideo[0].type)) {
      errors.franchisePromotionVideo = "Only MP4 or MOV videos are allowed";
    } else if (data.franchisePromotionVideo[0].size > 50 * 1024 * 1024) { // 50MB
      errors.franchisePromotionVideo = "Video size should be less than 50MB";
    }
  }

  // Validate award documents (optional)
  if (data.awardDoc && data.awardDoc.length > 0) {
    data.awardDoc.forEach((file, index) => {
      if (!allowedDocTypes.includes(file.type)) {
        if (!errors.awardDoc) errors.awardDoc = [];
        errors.awardDoc[index] = "Only PDF, JPEG or PNG files are allowed";
      } else if (file.size > 5 * 1024 * 1024) {
        if (!errors.awardDoc) errors.awardDoc = [];
        errors.awardDoc[index] = "File size should be less than 5MB";
      }
    });
  }

  // Validate business plan (optional)
  if (data.businessPlan && data.businessPlan.length > 0) {
    if (!allowedDocTypes.includes(data.businessPlan[0].type)) {
      errors.businessPlan = "Only PDF, JPEG or PNG files are allowed";
    } else if (data.businessPlan[0].size > 10 * 1024 * 1024) { // 10MB
      errors.businessPlan = "File size should be less than 10MB";
    }
  }

  return errors;
};
  

export { validateBrandDetails, validateFranchiseDetails,validateExpansionLocationDetails,validateUploadsDetails };


