import React, { useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import InvestorRegister from './Pages/Registration/InvestorsRegister';
import LoginPage from "./Pages/LoginPage/LoginPage";
import "./App.css";
import HomeBannerSec from "./Pages/HomePages/HomeBannerSec";
import RegisterHandleUser from "./Pages/Registration/RegisterHandlePage";
import SideViewContent from "./Components/SideViewContentMenu/SideHoverMenu";
import ProfilePage from "./Pages/Profile_Pages/profilePage";
import IconBreadcrumbs from "./Pages/Profile_Pages/IconBreadcrumbs";
import ManageProfile from "../src/Components/Investor_Profile_Component/ManageProfile.jsx";
import ResponseManager from "./Components/Investor_Profile_Component/ResponseManager.jsx";
import DashBoard from "../src/Components/Investor_Profile_Component/DashBoard.jsx";
import FeedBack from "../src/Components/Investor_Profile_Component/FeedBack.jsx";
import Complaint from "../src/Components/Investor_Profile_Component/Complaint.jsx";
import BrandDashBoard from "./Components/BrandProfile_Component/BrandDashBoard";
import Sidebar from "./Pages/BrandProfile_Pages/Sidebar_page";
import BrandFeedBack from "./Components/BrandProfile_Component/BrandFeedback";
import BrandComplaint from "./Components/BrandProfile_Component/BrandComplaint";

import BrandListingController from './Components/BrandProfile_Component/BrandDashboardController/BrandListingController.jsx';
import Upgradeaccount from './Components/Investor_Profile_Component/Upgradeaccount.jsx';
import { useDispatch } from 'react-redux';
import BrandCategroyViewPage from './Pages/AllCategoryPage/BrandCategroyViewPage.jsx';
import BrandSearchus from './Components/BrandProfile_Component/BrandSearches.jsx';
import BrandRegisterForm from './Pages/Registration/BrandLIstingRegister/BrandRegisterForm.jsx';
import ContactUs from './Components/Footers/HelpAndSupport/ContactUs.jsx';
import FAQs from './Components/Footers/HelpAndSupport/FAQs.jsx';
import Help from './Components/Footers/HelpAndSupport/Help.jsx';
import PrivacyPolicy from './Components/Footers/HelpAndSupport/PrivacyPolicy.jsx';
import TermsAndConditions from './Components/Footers/HelpAndSupport/TermsAndConditions.jsx';
import AdvertiseWithUs from './Components/Footers/QuickLinks/AdvertiseWithUs.jsx';

import ExpandYourBrand from './Components/Footers/QuickLinks/ExpandYourBrand.jsx';
import InvestFranchise from './Components/Footers/QuickLinks/InvestFranchise.jsx';
// import FranchisePromotion from './Components/Footers/QuickLinks/FranchisePromotion.jsx';
import { logout } from './Redux/Slices/AuthSlice/authSlice.jsx';

import { Box } from "@mui/material";
import Otherindustries from "./Components/Footers/QuickLinks/Otherindustries.jsx";
import GlobalLoader from './Components/GLobalLoader.jsx';
import Blogs from './Components/Footers/QuickLinks/Blogs.jsx';
import BrandDetailsPage from './Pages/AllCategoryPage/BrandDetailsPage.jsx';
import NavbarSearch from './Components/Navbar/NavbarSearch.jsx';
import AboutUs from './Components/Footers/HelpAndSupport/AboutUs.jsx';
import BrandDetailsControl from './Components/BrandProfile_Component/BrandDashboardController/BrandDetailsControl.jsx';
import FranchiseDetailsControl from './Components/BrandProfile_Component/BrandDashboardController/FranchiseDetailsControl.jsx';
import ExpansionLocationControl from './Components/BrandProfile_Component/BrandDashboardController/ExpansionLocationControl.jsx';
import UploadsControl from './Components/BrandProfile_Component/BrandDashboardController/UploadsControl.jsx';
import { VideoControllerProvider } from './services/VideoControllerMedia/VideHandlingFunctions.jsx';
// import AllBrandsApi from './Api/AllBrandsApi.jsx';

function App() {
  const dispatch = useDispatch();
  const AccessToken = localStorage.getItem("accessToken");




useEffect(() => {
  const disableShortcuts = (e) => {
    if (
      (e.ctrlKey && (e.key === 'c' || e.key === 's' || e.key === 'u' || e.key === 'p')) ||
      (e.metaKey && (e.key === 'c' || e.key === 's' || e.key === 'u' || e.key === 'p'))
    ) {
      e.preventDefault();
    }
  };

  document.addEventListener('keydown', disableShortcuts);
  return () => document.removeEventListener('keydown', disableShortcuts);
}, []);


  useEffect(() => {
    const logoutTimestamp = localStorage.getItem("logoutTimestamp");

    if (!logoutTimestamp || !AccessToken) {
      // console.log("No logout timestamp or access token. Skipping auto logout.");
      return;
    }

    const parsedLogoutTime = parseInt(logoutTimestamp, 10);
    const now = Date.now();
    const exitTime = parsedLogoutTime - now;

    const checkAutoLogout = () => {
      const currentTime = Date.now();

      if (currentTime >= parsedLogoutTime) {
        // console.log("Session expired. Logging out...");
        dispatch(logout());
        window.location.href = "/";
      }
    };

    checkAutoLogout();

    const timeoutId = setTimeout(() => {
      // console.log("Timeout reached. Calling checkAutoLogout again...");
      checkAutoLogout();
    }, exitTime);

    return () => {
      clearTimeout(timeoutId);
      // console.log("Cleared logout timeout.");
    };
  }, [AccessToken, dispatch]);
  return (
    <>
    {/* <AllBrandsApi /> */}
    <VideoControllerProvider>
   <GlobalLoader/>
        <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 1100 }}>
        {/* <Navbar /> */}
      </Box>
        <Routes>
          <Route path="/" element={<HomeBannerSec />} />
          <Route path="/investor-register" element={<InvestorRegister />} />
          <Route Path="/navbarsearch" element={<NavbarSearch/>}/>
          <Route path="/loginpage" element={<LoginPage />} />
          <Route path="/registerhandleuser" element={<RegisterHandleUser />} />
          <Route path="/brandlistingform" element={<BrandRegisterForm />} />
          <Route path="/sideviewcontentmenu" element={<SideViewContent />} />
          <Route path="/brandviewpage" element={<BrandCategroyViewPage />} >
          
          </Route>

          <Route path="/investordashboard" element={<ProfilePage />}>
            <Route index element={<DashBoard />} />
            <Route path="iIconbreadcrumbs" element={<IconBreadcrumbs />} />
            <Route path="complaint" element={<Complaint />} />
            <Route path="feedBack" element={<FeedBack />} />
            <Route path="upgradeaccount" element={<Upgradeaccount />} />
            <Route path="manageProfile" element={<ManageProfile />} />
            <Route path="respondemanager" element={<ResponseManager />} />
          </Route>

          <Route path="/brandDashboard" element={<Sidebar />}>
            <Route index element={<BrandDashBoard />} />
            <Route path="brandDashboard" element={<BrandDashBoard />} />
            <Route path='branddetailcontrol' element={<BrandDetailsControl/>}/>
            <Route path='franchisedetailcontrol' element={<FranchiseDetailsControl/>}/>
            <Route path='expansionlocationcontrol' element={<ExpansionLocationControl/>}/>
            <Route path='uploadcontrol' element={<UploadsControl/>}/>
            <Route path="brandfeedback" element={<BrandFeedBack />} />
            <Route path="brandcomplaint" element={<BrandComplaint />} />
            <Route path="brandsearchus" element={<BrandSearchus />} />
            <Route
              path="/brandDashboard/brandlistingcontrol"
              element={<BrandListingController />}
            />  
          </Route>

          {/* <Route path="/brandsearchview" element={<BrandCategroyViewPage />} /> */}

          {/* {Footer paths} */}
          <Route path='/aboutus' element ={<AboutUs/>}/>
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/faq" element={<FAQs />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />

          <Route path="/advertisewithus" element={<AdvertiseWithUs />} />
          <Route path="/expandyourbrand" element={<ExpandYourBrand />} />
          <Route path="/investfranchise" element={<InvestFranchise />} />
          {/* <Route path="/franchisepromotion" element={<FranchisePromotion />} /> */}
          <Route path="/otherindustries" element={<Otherindustries/>}/>
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/brands" element={<BrandCategroyViewPage />} />
          <Route path="/brands/:brandId" element={<BrandDetailsPage />} />
          
        </Routes>
      
   </VideoControllerProvider>
    </>
  );
}
export default App;

// import React, { useEffect, lazy, Suspense, useCallback,useMemo } from 'react';
// import { Route, Routes, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, CircularProgress } from '@mui/material';
// import { logout } from './Redux/Slices/AuthSlice/authSlice';
// import './App.css';

// // Context Providers
// import { VideoControllerProvider } from './services/VideoControllerMedia/VideHandlingFunctions';
// // import AppDataProvider from './context/AppDataProvider';

// // Core Components (not lazy-loaded as they're used immediately)
// import Navbar from './Components/Navbar/NavBar';
// import Footer from './Components/Footers/Footer';

// // Lazy-loaded components with prefetching
// const HomeBannerSec = lazy(() => import(/* webpackPrefetch: true */ './Pages/HomePages/HomeBannerSec'));
// const BrandDetailsPage = lazy(() => import(/* webpackPrefetch: true */ './Pages/AllCategoryPage/BrandDetailsPage'));
// const BrandCategroyViewPage = lazy(() => import(/* webpackPrefetch: true */ './Pages/AllCategoryPage/BrandCategroyViewPage'));

// // Authentication
// const InvestorRegister = lazy(() => import('./Pages/Registration/InvestorsRegister'));
// const LoginPage = lazy(() => import('./Pages/LoginPage/LoginPage'));
// const RegisterHandleUser = lazy(() => import('./Pages/Registration/RegisterHandlePage'));
// const BrandRegisterForm = lazy(() => import('./Pages/Registration/BrandLIstingRegister/BrandRegisterForm'));

// // Dashboard Components
// const ProfilePage = lazy(() => import('./Pages/Profile_Pages/profilePage'));
// const Sidebar = lazy(() => import('./Pages/BrandProfile_Pages/Sidebar_page'));

// // Sub-components
// const IconBreadcrumbs = lazy(() => import('./Pages/Profile_Pages/IconBreadcrumbs'));
// const NavbarSearch = lazy(() => import('./Components/Navbar/NavbarSearch'));
// const SideViewContent = lazy(() => import('./Components/SideViewContentMenu/SideHoverMenu'));
// const GlobalLoader = lazy(() => import('./Components/GLobalLoader'));

// // Investor Dashboard
// const DashBoard = lazy(() => import('../src/Components/Investor_Profile_Component/DashBoard'));
// const FeedBack = lazy(() => import('../src/Components/Investor_Profile_Component/FeedBack'));
// const Complaint = lazy(() => import('../src/Components/Investor_Profile_Component/Complaint'));
// const Upgradeaccount = lazy(() => import('./Components/Investor_Profile_Component/Upgradeaccount'));
// const ManageProfile = lazy(() => import('../src/Components/Investor_Profile_Component/ManageProfile'));
// const ResponseManager = lazy(() => import('./Components/Investor_Profile_Component/ResponseManager'));

// // Brand Dashboard
// const BrandDashBoard = lazy(() => import('./Components/BrandProfile_Component/BrandDashBoard'));
// const BrandFeedBack = lazy(() => import('./Components/BrandProfile_Component/BrandFeedback'));
// const BrandComplaint = lazy(() => import('./Components/BrandProfile_Component/BrandComplaint'));
// const BrandListingController = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/BrandListingController'));
// const BrandSearchus = lazy(() => import('./Components/BrandProfile_Component/BrandSearches'));
// const BrandDetailsControl = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/BrandDetailsControl'));
// const FranchiseDetailsControl = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/FranchiseDetailsControl'));
// const ExpansionLocationControl = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/ExpansionLocationControl'));
// const UploadsControl = lazy(() => import('./Components/BrandProfile_Component/BrandDashboardController/UploadsControl'));

// // Footer Pages
// const AboutUs = lazy(() => import('./Components/Footers/HelpAndSupport/AboutUs'));
// const ContactUs = lazy(() => import('./Components/Footers/HelpAndSupport/ContactUs'));
// const FAQs = lazy(() => import('./Components/Footers/HelpAndSupport/FAQs'));
// const Help = lazy(() => import('./Components/Footers/HelpAndSupport/Help'));
// const PrivacyPolicy = lazy(() => import('./Components/Footers/HelpAndSupport/PrivacyPolicy'));
// const TermsAndConditions = lazy(() => import('./Components/Footers/HelpAndSupport/TermsAndConditions'));
// const AdvertiseWithUs = lazy(() => import('./Components/Footers/QuickLinks/AdvertiseWithUs'));
// const ExpandYourBrand = lazy(() => import('./Components/Footers/QuickLinks/ExpandYourBrand'));
// const InvestFranchise = lazy(() => import('./Components/Footers/QuickLinks/InvestFranchise'));
// const Otherindustries = lazy(() => import('./Components/Footers/QuickLinks/Otherindustries'));
// const Blogs = lazy(() => import('./Components/Footers/QuickLinks/Blogs'));

// const App = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const authState = useSelector(state => state.auth);
//   const isLoading = useSelector(state => state.loading.isLoading);

//   // Memoized authentication state
//   const isAuthenticated = useMemo(() => !!authState.accessToken, [authState]);

//   // Disable keyboard shortcuts
//   const handleKeyDown = useCallback((e) => {
//     if (
//       (e.ctrlKey && (e.key === 'c' || e.key === 's' || e.key === 'u' || e.key === 'p')) ||
//       (e.metaKey && (e.key === 'c' || e.key === 's' || e.key === 'u' || e.key === 'p'))
//     ) {
//       e.preventDefault();
//     }
//   }, []);

//   useEffect(() => {
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [handleKeyDown]);

//   // Auto logout functionality
//   useEffect(() => {
//     const checkAutoLogout = () => {
//       const logoutTimestamp = localStorage.getItem('logoutTimestamp');
//       if (!logoutTimestamp || !isAuthenticated) return;
      
//       if (Date.now() >= parseInt(logoutTimestamp, 10)) {
//         dispatch(logout());
//         window.location.href = '/loginpage';
//       }
//     };

//     checkAutoLogout();
//     const interval = setInterval(checkAutoLogout, 60000); // Check every minute
    
//     return () => clearInterval(interval);
//   }, [isAuthenticated, dispatch]);

//   // Scroll to top on route change
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   // Resource preloading
//   useEffect(() => {
//     // Preconnect to CDNs
//     const preconnects = [
//       { rel: 'preconnect', href: 'https://your-video-cdn.com' },
//       { rel: 'preconnect', href: 'https://your-api-domain.com' }
//     ];

//     preconnects.forEach(link => {
//       const el = document.createElement('link');
//       Object.entries(link).forEach(([key, value]) => {
//         el[key] = value;
//       });
//       document.head.appendChild(el);
//     });

//     return () => {
//       preconnects.forEach(link => {
//         const el = document.querySelector(`link[href="${link.href}"]`);
//         if (el) document.head.removeChild(el);
//       });
//     };
//   }, []);

//   return (
//     // <AppDataProvider>
//       <VideoControllerProvider>
//         {/* Navigation and Header */}
//         {/* <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1100 }}>
//           <Navbar />
//         </Box> */}

//         {/* Main Content */}
//         <Box component="main" sx={{ pt: '64px', minHeight: 'calc(100vh - 64px)' }}>
//           <Suspense fallback={<GlobalLoadingFallback />}>
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<HomeBannerSec />} />
//               <Route path="/brands/:brandId" element={<BrandDetailsPage />} />
//               <Route path="/brandviewpage" element={<BrandCategroyViewPage />} />
//               <Route path="/brands" element={<BrandCategroyViewPage />} />
              
//               {/* Authentication Routes */}
//               <Route path="/loginpage" element={<LoginPage />} />
//               <Route path="/investor-register" element={<InvestorRegister />} />
//               <Route path="/registerhandleuser" element={<RegisterHandleUser />} />
//               <Route path="/brandlistingform" element={<BrandRegisterForm />} />
//               <Route path="/navbarsearch" element={<NavbarSearch />} />
//               <Route path="/sideviewcontentmenu" element={<SideViewContent />} />

//               {/* Investor Dashboard Routes */}
//               {isAuthenticated && (
//                 <Route path="/investordashboard" element={<ProfilePage />}>
//                   <Route index element={<DashBoard />} />
//                   <Route path="iIconbreadcrumbs" element={<IconBreadcrumbs />} />
//                   <Route path="complaint" element={<Complaint />} />
//                   <Route path="feedBack" element={<FeedBack />} />
//                   <Route path="upgradeaccount" element={<Upgradeaccount />} />
//                   <Route path="manageProfile" element={<ManageProfile />} />
//                   <Route path="respondemanager" element={<ResponseManager />} />
//                 </Route>
//               )}

//               {/* Brand Dashboard Routes */}
//               {isAuthenticated && (
//                 <Route path="/brandDashboard" element={<Sidebar />}>
//                   <Route index element={<BrandDashBoard />} />
//                   <Route path="brandDashboard" element={<BrandDashBoard />} />
//                   <Route path="branddetailcontrol" element={<BrandDetailsControl />} />
//                   <Route path="franchisedetailcontrol" element={<FranchiseDetailsControl />} />
//                   <Route path="expansionlocationcontrol" element={<ExpansionLocationControl />} />
//                   <Route path="uploadcontrol" element={<UploadsControl />} />
//                   <Route path="brandfeedback" element={<BrandFeedBack />} />
//                   <Route path="brandcomplaint" element={<BrandComplaint />} />
//                   <Route path="brandsearchus" element={<BrandSearchus />} />
//                   <Route path="brandlistingcontrol" element={<BrandListingController />} />
//                 </Route>
//               )}

//               {/* Footer Routes */}
//               <Route path="/aboutus" element={<AboutUs />} />
//               <Route path="/contactus" element={<ContactUs />} />
//               <Route path="/faq" element={<FAQs />} />
//               <Route path="/help" element={<Help />} />
//               <Route path="/privacypolicy" element={<PrivacyPolicy />} />
//               <Route path="/termsandconditions" element={<TermsAndConditions />} />
//               <Route path="/advertisewithus" element={<AdvertiseWithUs />} />
//               <Route path="/expandyourbrand" element={<ExpandYourBrand />} />
//               <Route path="/investfranchise" element={<InvestFranchise />} />
//               <Route path="/otherindustries" element={<Otherindustries />} />
//               <Route path="/blogs" element={<Blogs />} />

//               {/* Fallback Route */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </Suspense>
//         </Box>

//         {/* Global Loader */}
//         {isLoading && <GlobalLoader />}

//         {/* Footer */}
//         <Footer />
//       </VideoControllerProvider>
//     // </AppDataProvider>
//   );
// };

// // Simple loading fallback
// const GlobalLoadingFallback = () => (
//   <Box sx={{
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//     width: '100vw'
//   }}>
//     <CircularProgress size={60} />
//   </Box>
// );

// // Simple 404 component
// const NotFound = () => (
//   <Box sx={{
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '60vh',
//     textAlign: 'center'
//   }}>
//     <Typography variant="h3" gutterBottom>404</Typography>
//     <Typography variant="h5">Page Not Found</Typography>
//   </Box>
// );

// export default React.memo(App);