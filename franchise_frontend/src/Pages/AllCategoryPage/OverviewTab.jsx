import React, { useState, useRef, lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Lazy-loaded components
const FranchiseDetailsTable = lazy(() => import("./OverViewBrandDetailsPage/FranchiseDetailsTableOverPage"));
const BrandDescriptionSection = lazy(() => import("./OverViewBrandDetailsPage/BrandDescriptionSectionOverviewtab"));
const SupportSection = lazy(() => import("./OverViewBrandDetailsPage/SupportSectionOverviewtab"));
const LocationSections = lazy(() => import("./OverViewBrandDetailsPage/LocationHandlingOverviewtab"));
const AwardsSection = lazy(() => import("./OverViewBrandDetailsPage/AwardsSectionOverviewtab"));
const BusinessPlanSection = lazy(() => import("./OverViewBrandDetailsPage/BusinessPlanSectionOverViewtab"));
const DisclaimerSection = lazy(() => import("./OverViewBrandDetailsPage/DisclaimerSectionOverviewtab"));

const OverviewTab = ({ brand }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const overviewRef = useRef(null);
  const [loadedSections, setLoadedSections] = useState({
    franchiseDetails: false,
    description: false,
    support: false,
    locations: false,
    awards: false,
    businessPlan: false
  });

  // Check if sections have data
  const hasFranchiseDetails = !!brand.franchiseDetails?.fico;
  const hasDescription = !!brand.franchiseDetails?.brandDescription;
  const hasSupport = !!brand.franchiseDetails?.trainingSupport || !!brand.franchiseDetails?.aidFinancing;
  const hasLocations = !!brand.expansionLocationData;
  const hasAwards = !!brand.uploads?.awards;
  const hasBusinessPlan = !!brand.uploads?.businessPlan;

  // Loading placeholder
  const LoadingPlaceholder = () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: 200,
      width: '100%'
    }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box ref={overviewRef} sx={{ overflow: 'hidden' }}>
      {/* Franchise Details Table */}
      {hasFranchiseDetails && (
        <Suspense fallback={<LoadingPlaceholder />}>
          <FranchiseDetailsTable 
            data={brand.franchiseDetails.fico} 
            isMobile={isMobile}
            onLoad={() => setLoadedSections(prev => ({ ...prev, franchiseDetails: true }))}
          />
        </Suspense>
      )}

      {/* Brand Description */}
      {hasDescription && (
        <Suspense fallback={<LoadingPlaceholder />}>
          <BrandDescriptionSection 
            description={brand.franchiseDetails.brandDescription}
            usp={brand.franchiseDetails.uniqueSellingPoints}
            onLoad={() => setLoadedSections(prev => ({ ...prev, description: true }))}
          />
        </Suspense>
      )}

      {/* Support Section */}
      {hasSupport && (
        <Suspense fallback={<LoadingPlaceholder />}>
          <SupportSection 
            trainingSupport={brand.franchiseDetails.trainingSupport}
            aidFinancing={brand.franchiseDetails.aidFinancing}
            isInternational={brand.expansionLocationData?.isInternationalExpansion}
            onLoad={() => setLoadedSections(prev => ({ ...prev, support: true }))}
          />
        </Suspense>
      )}

      {/* Location Sections */}
      {hasLocations && (
        <Suspense fallback={<LoadingPlaceholder />}>
          <LocationSections 
            expansionLocationData={brand.expansionLocationData}
            onLoad={() => setLoadedSections(prev => ({ ...prev, locations: true }))}
          />
        </Suspense>
      )}

      {/* Awards Section - Only render if has data */}
      {hasAwards && brand.uploads.awards.length > 0 && (
        <Suspense fallback={<LoadingPlaceholder />}>
          <AwardsSection 
            awards={brand.uploads.awards}
            onLoad={() => setLoadedSections(prev => ({ ...prev, awards: true }))}
          />
        </Suspense>
      )}

      {/* Business Plan Section - Only render if has data */}
      {hasBusinessPlan && brand.uploads.businessPlan.length > 0 && (
        <Suspense fallback={<LoadingPlaceholder />}>
          <BusinessPlanSection 
            documents={brand.uploads.businessPlan}
            onLoad={() => setLoadedSections(prev => ({ ...prev, businessPlan: true }))}
          />
        </Suspense>
      )}

      {/* Disclaimer - Always render */}
      <Suspense fallback={null}>
        <DisclaimerSection isMobile={isMobile} />
      </Suspense>
    </Box>
  );
};

export default React.memo(OverviewTab);