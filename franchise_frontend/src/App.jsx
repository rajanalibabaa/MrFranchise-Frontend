
import React, { useEffect, lazy, Suspense, useCallback,useMemo } from 'react';
import { Route, Routes, useLocation , useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress ,Typography } from '@mui/material';
import { logout } from './Redux/Slices/AuthSlice/authSlice';

import './App.css';

// Context Providers
import { VideoControllerProvider } from './services/VideoControllerMedia/VideHandlingFunctions';
import LoadingFallback from '../src/services/SupportingComponents/LoadingFallback.jsx';
import HomeBannerSec from "./Pages/HomePages/HomeBannerSec"
import BrandDetailsPage from './Pages/AllCategoryPage/BrandDetailsPage'
import BrandCategroyViewPage from './Pages/AllCategoryPage/BrandCategroyViewPage'
// Lazy-loaded components with prefetching
// const  = lazy(() => import(/* webpackPrefetch: true */ ));
// const  = lazy(() => import(/* webpackPrefetch: true */ ''));

// Authentication
const InvestorRegister = lazy(() => import('./Pages/Registration/InvestorsRegister'));
const LoginPage = lazy(() => import('./Pages/LoginPage/LoginPage'));
const RegisterHandleUser = lazy(() => import('./Pages/Registration/RegisterHandlePage'));
const BrandRegisterForm = lazy(() => import('./Pages/Registration/BrandLIstingRegister/BrandRegisterForm'));

// Dashboard Components
const ProfilePage = lazy(() => import('./Pages/Profile_Pages/profilePage'));
const Sidebar = lazy(() => import('./Pages/BrandProfile_Pages/Sidebar_page'));

// Sub-components
const IconBreadcrumbs = lazy(() => import('./Pages/Profile_Pages/IconBreadcrumbs'));
const NavbarSearch = lazy(() => import('./Components/Navbar/NavbarSearch'));
const SideViewContent = lazy(() => import('./Components/SideViewContentMenu/SideHoverMenu'));
const GlobalLoader = lazy(() => import('./Components/GLobalLoader'));

// Investor Dashboard
const DashBoard = lazy(() => import('../src/Components/Investor_Profile_Component/DashBoard'));
const FeedBack = lazy(() => import('../src/Components/Investor_Profile_Component/FeedBack'));
const Complaint = lazy(() => import('../src/Components/Investor_Profile_Component/Complaint'));
const Upgradeaccount = lazy(() => import('./Components/Investor_Profile_Component/Upgradeaccount'));
const ManageProfile = lazy(() => import('../src/Components/Investor_Profile_Component/ManageProfile'));
const ResponseManager = lazy(() => import('./Components/Investor_Profile_Component/ResponseManager'));

// Brand Dashboard
const BrandDashBoard = lazy(() => import('./Components/BrandProfile_Component/BrandDashBoard'));
const BrandFeedBack = lazy(() => import('./Components/BrandProfile_Component/BrandFeedback'));
const BrandComplaint = lazy(() => import('./Components/BrandProfile_Component/BrandComplaint'));
const BrandListingController = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/BrandListingController'));
const BrandSearchus = lazy(() => import('./Components/BrandProfile_Component/BrandSearches'));
const BrandDetailsControl = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/BrandDetailsControl'));
const FranchiseDetailsControl = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/FranchiseDetailsControl'));
const ExpansionLocationControl = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/ExpansionLocationControl'));
const UploadsControl = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/UploadsControl'));

// Footer Pages
const AboutUs = lazy(() => import('./Components/Footers/HelpAndSupport/AboutUs'));
const ContactUs = lazy(() => import('./Components/Footers/HelpAndSupport/ContactUs'));
const FAQs = lazy(() => import('./Components/Footers/HelpAndSupport/FAQs'));
const Help = lazy(() => import('./Components/Footers/HelpAndSupport/Help'));
const PrivacyPolicy = lazy(() => import('./Components/Footers/HelpAndSupport/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./Components/Footers/HelpAndSupport/TermsAndConditions'));
const AdvertiseWithUs = lazy(() => import('./Components/Footers/QuickLinks/AdvertiseWithUs'));
const ExpandYourBrand = lazy(() => import('./Components/Footers/QuickLinks/ExpandYourBrand'));
const InvestFranchise = lazy(() => import('./Components/Footers/QuickLinks/InvestFranchise'));
const Otherindustries = lazy(() => import('./Components/Footers/QuickLinks/Otherindustries'));
const Blogs = lazy(() => import('./Components/Footers/QuickLinks/Blogs'));

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // const authState = useSelector(state => state.auth);
  const isLoading = useSelector(state => state.loading.isLoading);

  // Memoized authentication state
  // const isAuthenticated = useMemo(() => !!authState.accessToken, [authState]);

  // Disable keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (
      (e.ctrlKey && (e.key === 'c' || e.key === 's' || e.key === 'u' || e.key === 'p')) ||
      (e.metaKey && (e.key === 'c' || e.key === 's' || e.key === 'u' || e.key === 'p'))
    ) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto logout functionality
  useEffect(() => {
    const checkAutoLogout = () => {
      const logoutTimestamp = localStorage.getItem('logoutTimestamp');
      if (!logoutTimestamp ) return;
      
      if (Date.now() >= parseInt(logoutTimestamp, 10)) {
        dispatch(logout());
        window.location.href = '/loginpage';
      }
    };

    checkAutoLogout();
    const interval = setInterval(checkAutoLogout, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [ dispatch]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);




    // hide the right click disable 
  useEffect(() => {
   const disableRightClick = (e) => e.preventDefault();
   document.addEventListener("contextmenu", disableRightClick);
   return () => document.removeEventListener("contextmenu", disableRightClick);
 }, []);

 
  return (
      <VideoControllerProvider>
        {/* Main Content */}
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomeBannerSec />} />
              <Route path="/brands/:brandId" element={<BrandDetailsPage />} />
              <Route path="/brandviewpage" element={<BrandCategroyViewPage />} />
              <Route path="/brands" element={<BrandCategroyViewPage />} />
              
              {/* Authentication Routes */}
              <Route path="/loginpage" element={<LoginPage />} />
              <Route path="/investor-register" element={<InvestorRegister />} />
              <Route path="/registerhandleuser" element={<RegisterHandleUser />} />
              <Route path="/brandlistingform" element={<BrandRegisterForm />} />
              <Route path="/navbarsearch" element={<NavbarSearch />} />
              <Route path="/sideviewcontentmenu" element={<SideViewContent />} />

              {/* Investor Dashboard Routes */}
              {/* {isAuthenticated && ( */}
                <Route path="/investordashboard" element={<ProfilePage />}>
                  <Route index element={<DashBoard />} />
                  <Route path="iIconbreadcrumbs" element={<IconBreadcrumbs />} />
                  <Route path="complaint" element={<Complaint />} />
                  <Route path="feedBack" element={<FeedBack />} />
                  <Route path="upgradeaccount" element={<Upgradeaccount />} />
                  <Route path="manageProfile" element={<ManageProfile />} />
                  <Route path="respondemanager" element={<ResponseManager />} />
                </Route>
              {/* )} */}

              {/* Brand Dashboard Routes */}
              {/* {isAuthenticated && ( */}
                <Route path="/brandDashboard" element={<Sidebar />}>
                  <Route index element={<BrandDashBoard />} />
                  <Route path="brandDashboard" element={<BrandDashBoard />} />
                  <Route path="branddetailcontrol" element={<BrandDetailsControl />} />
                  <Route path="franchisedetailcontrol" element={<FranchiseDetailsControl />} />
                  <Route path="expansionlocationcontrol" element={<ExpansionLocationControl />} />
                  <Route path="uploadcontrol" element={<UploadsControl />} />
                  <Route path="brandfeedback" element={<BrandFeedBack />} />
                  <Route path="brandcomplaint" element={<BrandComplaint />} />
                  <Route path="brandsearchus" element={<BrandSearchus />} />
                  <Route path="brandlistingcontrol" element={<BrandListingController />} />
                </Route>
              {/* )} */}

              {/* Footer Routes */}
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/faq" element={<FAQs />} />
              <Route path="/help" element={<Help />} />
              <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              <Route path="/termsandconditions" element={<TermsAndConditions />} />
              <Route path="/advertisewithus" element={<AdvertiseWithUs />} />
              <Route path="/expandyourbrand" element={<ExpandYourBrand />} />
              <Route path="/investfranchise" element={<InvestFranchise />} />
              <Route path="/otherindustries" element={<Otherindustries />} />
              <Route path="/blogs" element={<Blogs />} />

              {/* Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
      

        {/* Global Loader */}
        {isLoading && <GlobalLoader />}

       
      </VideoControllerProvider>
  );
};


// Simple 404 component
const NotFound = () => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    textAlign: 'center'
  }}>
    <Typography variant="h3" gutterBottom>404</Typography>
    <Typography variant="h5">Page Not Found</Typography>
  </Box>
);

export default React.memo(App);