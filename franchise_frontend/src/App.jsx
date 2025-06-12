import React, { useEffect } from 'react'
import { Route, Routes } from "react-router-dom"
import InvestorRegister from './Pages/Registration/InvestorsRegister';
// import BrandRegister from './Pages/Registration/BrandRegister';
import LoginPage from './Pages/LoginPage/LoginPage';

import './App.css';
import HomeBannerSec from './Pages/HomePages/HomeBannerSec';
import RegisterHandleUser from './Pages/Registration/RegisterHandlePage';
// import BrandListingFormPage from './Pages/BrandListingForm/BrandListingFormPage';
import SideViewContent from './Components/SideViewContentMenu/SideHoverMenu';
import ProfilePage from './Pages/Profile_Pages/profilePage';
import IconBreadcrumbs from './Pages/Profile_Pages/IconBreadcrumbs';
import ManageProfile from "../src/Components/Investor_Profile_Component/ManageProfile.jsx";
// import PostRequirement from '../src/Components/Investor_Profile_Component/PostRequirement.jsx';
import ResponseManager from './Components/Investor_Profile_Component/ResponseManager.jsx';
import DashBoard from '../src/Components/Investor_Profile_Component/DashBoard.jsx';
import FeedBack from '../src/Components/Investor_Profile_Component/FeedBack.jsx';
import Complaint from '../src/Components/Investor_Profile_Component/Complaint.jsx';
import BrandDashBoard from './Components/BrandProfile_Component/BrandDashBoard';
import Sidebar from './Pages/BrandProfile_Pages/Sidebar_page';
import BrandFeedBack from './Components/BrandProfile_Component/BrandFeedback';
import BrandComplaint from './Components/BrandProfile_Component/BrandComplaint';
import BrandAddVedios from './Components/BrandProfile_Component/BrandAddVedios';

import BrandListingController from './Components/BrandProfile_Component/BrandListingController.jsx';
import Upgradeaccount from './Components/Investor_Profile_Component/Upgradeaccount.jsx';
import { Provider, useDispatch } from 'react-redux';
// import store from './Redux/Store/Index.jsx';
import BrandCategroyViewPage from './Pages/AllCategoryPage/BrandCategroyViewPage.jsx';
import BrandSearchus from './Components/BrandProfile_Component/BrandSearches.jsx';
import BrandRegisterForm from './Pages/Registration/BrandLIstingRegister/BrandRegisterForm.jsx';
import AboutUs from './Components/Footers/HelpAndSupport/AboutUs.jsx';
import ContactUs from './Components/Footers/HelpAndSupport/ContactUs.jsx';
import FAQs from './Components/Footers/HelpAndSupport/FAQs.jsx';
import Help from './Components/Footers/HelpAndSupport/Help.jsx';
import PrivacyPolicy from './Components/Footers/HelpAndSupport/PrivacyPolicy.jsx';
import TermsAndConditions from './Components/Footers/HelpAndSupport/TermsAndConditions.jsx';
import AdvertiseWithUs from './Components/Footers/QuickLinks/AdvertiseWithUs.jsx';

import ExpandYourBrand from './Components/Footers/QuickLinks/ExpandYourBrand.jsx';
import InvestFranchise from './Components/Footers/QuickLinks/InvestFranchise.jsx';
import FranchisePromotion from './Components/Footers/QuickLinks/FranchisePromotion.jsx';
import { logout } from './Redux/Slices/AuthSlice/authSlice.jsx';


function App() {
  const dispatch = useDispatch();
  const AccessToken = localStorage.getItem("accessToken");
  // console.log("Access Token:", AccessToken);

  useEffect(() => {
    const logoutTimestamp = localStorage.getItem("logoutTimestamp");

    if (!logoutTimestamp || !AccessToken) {
      console.log("No logout timestamp or access token. Skipping auto logout.");
      return;
    }

    const parsedLogoutTime = parseInt(logoutTimestamp, 10);
    const now = Date.now();
    const exitTime = parsedLogoutTime - now;

    const checkAutoLogout = () => {
      console.log("Checking auto logout...");
      const currentTime = Date.now();
      console.log("Current time:", currentTime);
      console.log("Logout timestamp:", parsedLogoutTime);
      console.log("Difference (ms):", parsedLogoutTime - currentTime);

      if (currentTime >= parsedLogoutTime) {
        console.log("Session expired. Logging out...");
        dispatch(logout());
        window.location.href = "/";
      }
    };

    // ✅ 1. Call immediately on mount
    checkAutoLogout();

    // ✅ 2. Schedule exact-time logout
    const timeoutId = setTimeout(() => {
      console.log("Timeout reached. Calling checkAutoLogout again...");
      checkAutoLogout();
    }, exitTime);

    // ✅ Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      console.log("Cleared logout timeout.");
    };
  }, [AccessToken, dispatch]);
  return (
  
    <>

    {/* <Provider store={store}> */}
      <Routes>
  <Route path="/" element={<HomeBannerSec />} />
  {/* <Route path="/brandview" element={<BrandViewPage />} /> */}
  <Route path="/investor-register" element={<InvestorRegister />} />
  {/* <Route path="/brand-register" element={<BrandRegister />} /> */}
  <Route path="/loginpage" element={<LoginPage />} />
  <Route path="/registerhandleuser" element={<RegisterHandleUser />} />
  <Route path="/brandlistingform" element={<BrandRegisterForm />} />
  <Route path="/sideviewcontentmenu" element={<SideViewContent />} />
  <Route path='/brandviewpage' element={<BrandCategroyViewPage />} />

  <Route path="/investordashboard" element={<ProfilePage />}>
    <Route index element={<DashBoard />} />
    <Route path="iIconbreadcrumbs" element={<IconBreadcrumbs />} />
    <Route path="complaint" element={<Complaint />} />
    <Route path="feedBack" element={<FeedBack />} />
    <Route path="upgradeaccount" element={<Upgradeaccount />} />
    <Route path="manageProfile" element={<ManageProfile />} />
    {/* <Route path="PostRequirement" element={<PostRequirement />} /> */}
    <Route path="respondemanager" element={<ResponseManager />} />
  </Route>

  <Route path="/brandDashboard" element={<Sidebar />}>
    <Route index element={<BrandDashBoard />} />
    <Route path="brandDashboard" element={<BrandDashBoard />} />
    <Route path="brandaddvedios" element={<BrandAddVedios />} />
    <Route path="brandfeedback" element={<BrandFeedBack />} />
    <Route path="brandcomplaint" element={<BrandComplaint />} />
    <Route path="brandsearchus" element={<BrandSearchus />} />
    <Route path='/brandDashboard/brandlistingcontrol' element={<BrandListingController />} />
  </Route>


 <Route path="/brandsearchview" element={<BrandCategroyViewPage />} />
 
 
  {/* {Footer paths} */}
  <Route path='/aboutus' element={<AboutUs/>}/>
  <Route path='/contactus' element={<ContactUs/>}/>
  <Route path='/faq' element={<FAQs/>}/>
  <Route path='/help' element={<Help/>}/>
  <Route path='/privacypolicy' element={<PrivacyPolicy/>}/>
  <Route path='/termsandconditions' element={<TermsAndConditions/>}/>

  <Route path='/advertisewithus' element={<AdvertiseWithUs/>}/>
  <Route path='/expandyourbrand' element={<ExpandYourBrand/>}/>
  {/* <Route path='/franchiseconsulting' element={<FranchiseConsulting/>}/> */}
  <Route path='/investfranchise' element={<InvestFranchise/>}/>
  <Route path='/franchisepromotion' element={<FranchisePromotion/>}/>

  
</Routes>
    {/* </Provider> */}

    </>
  );
}

export default App;
