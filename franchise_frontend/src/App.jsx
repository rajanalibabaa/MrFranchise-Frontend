import { Route, Routes } from "react-router-dom";
import InvestorRegister from "./Pages/Registration/InvestorsRegister";
import BrandRegister from "./Pages/Registration/BrandRegister";
import LoginPage from "./Pages/LoginPage/LoginPage";
import BrandViewPage from "./Pages/BrandViewPage/BrandViewPage";
import "./App.css";
import HomeBannerSec from "./Pages/HomePages/HomeBannerSec";
import RegisterHandleUser from "./Pages/Registration/RegisterHandlePage";
import BrandListingFormPage from "./Pages/BrandListingForm/BrandListingFormPage";
import SideViewContent from "./Components/SideViewContentMenu/SideHoverMenu";
import ProfilePage from "./Pages/Profile_Pages/profilePage";
import IconBreadcrumbs from "./Pages/Profile_Pages/IconBreadcrumbs";
import ManageProfile from "./Components/Profile_Component/ManageProfile";
import PostRequirement from "./Components/Profile_Component/PostRequirement";
import ResponseManager from "./Components/Profile_Component/ResponseManager";
import DashBoard from "./Components/Profile_Component/DashBoard";
import FeedBack from "./Components/Profile_Component/FeedBack";
import Complaint from "./Components/Profile_Component/Complaint";
import BrandDashBoard from "./Components/BrandProfile_Component/BrandDashBoard";
import Sidebar from "./Pages/BrandProfile_Pages.jsx/Sidebar_page";
import BrandManageProfile from "./Components/BrandProfile_Component/BrandManageProfile";
import BrandFeedBack from "./Components/BrandProfile_Component/BrandFeedback";
import BrandComplaint from "./Components/BrandProfile_Component/BrandComplaint";
import BrandAddVedios from "./Components/BrandProfile_Component/BrandAddVedios";
import AllCategoryMainPage from "./Pages/AllCategoryPage/AllCategoryMainPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeBannerSec />} />

        <Route path="/brandViewPage" element={<BrandViewPage />} />
        <Route path="/investor-register" element={<InvestorRegister />} />
        <Route path="/brand-register" element={<BrandRegister />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/registerhandleuser" element={<RegisterHandleUser />} />
        <Route path="/brandlistingform" element={<BrandListingFormPage />} />
        <Route path="/sideviewcontentmenu" element={<SideViewContent />} />
        <Route path="/allcategories" element={<AllCategoryMainPage />} />

        <Route path="/investerdashboard" element={<ProfilePage />}>
          <Route index element={<DashBoard />} />
          <Route path="iIconbreadcrumbs" element={<IconBreadcrumbs />} />
          <Route path="complaint" element={<Complaint />} />
          <Route path="feedBack" element={<FeedBack />} />
          <Route path="manageProfile" element={<ManageProfile />} />
          <Route path="PostRequirement" element={<PostRequirement />} />
          <Route path="respondemanager" element={<ResponseManager />} />
        </Route>

        <Route path="/brandDashboard" element={<Sidebar />}>
          <Route index element={<BrandDashBoard />} />
          <Route path="brandDashboard" element={<BrandDashBoard />} />
          <Route path="brandaddvedios" element={<BrandAddVedios />} />
          <Route path="brandfeedback" element={<BrandFeedBack />} />
          <Route path="brandcomplaint" element={<BrandComplaint />} />
          <Route path="brandmanageprofile" element={<BrandManageProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
