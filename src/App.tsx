import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load all page components
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const Calendar = lazy(() => import("./pages/Calendar"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const Blank = lazy(() => import("./pages/Blank"));
const AdsOverview = lazy(() => import("./pages/Ads/AdsOverview"));
const GmvMaxProduct = lazy(() => import("./pages/Ads/GmvMaxProduct"));
const GmvMaxLive = lazy(() => import("./pages/Ads/GmvMaxLive"));
const CampaignVideoDetail = lazy(() => import("./pages/Ads/CampaignVideoDetail"));
const VideoManagement = lazy(() => import("./pages/VideoManagement"));
const BookingManagement = lazy(() => import("./pages/BookingManagement"));
const StaffList = lazy(() => import("./pages/Management/StaffList"));
const CreatorAnalytics = lazy(() => import("./pages/Creator/CreatorAnalytics"));
const CreatorCommission = lazy(() => import("./pages/Creator/CreatorCommission"));
const Orders = lazy(() => import("./pages/Store/Orders"));
const ProductManagement = lazy(() => import("./pages/Store/ProductManagement"));
const OrdersFulfillment = lazy(() => import("./pages/Store/OrdersFulfillment"));
const AftersalesAnalytics = lazy(() => import("./pages/Store/AftersalesAnalytics"));
const TikTokApiPage = lazy(() => import("./pages/Demo/TikTokApiPage"));

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Dashboard Layout */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/ads-overview" replace />} />

              {/* Others Page */}
              <Route path="profile" element={<UserProfiles />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="blank" element={<Blank />} />

              {/* Forms */}
              <Route path="form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="alerts" element={<Alerts />} />
              <Route path="avatars" element={<Avatars />} />
              <Route path="badge" element={<Badges />} />
              <Route path="buttons" element={<Buttons />} />
              <Route path="images" element={<Images />} />
              <Route path="videos" element={<Videos />} />

              {/* Charts */}
              <Route path="line-chart" element={<LineChart />} />
              <Route path="bar-chart" element={<BarChart />} />

              {/* Ads */}
              <Route path="ads-overview" element={<AdsOverview />} />
              <Route path="gmv-max-product" element={<GmvMaxProduct />} />
              <Route path="gmv-max-live" element={<GmvMaxLive />} />
              <Route path="gmv-max-product/campaign-video/:campaignId" element={<CampaignVideoDetail />} />

              {/* Creator */}
              <Route path="creator-analytics" element={<CreatorAnalytics />} />
              <Route path="creator-commission" element={<CreatorCommission />} />

              {/* Management */}
              <Route path="video-management" element={<VideoManagement />} />
              <Route path="booking-management" element={<BookingManagement />} />
              <Route path="staff-list" element={<StaffList />} />

              {/* Store */}
              <Route path="orders" element={<Orders />} />
              <Route path="product-management" element={<ProductManagement />} />
              <Route path="orders-fulfillment" element={<OrdersFulfillment />} />
              <Route path="aftersales-analytics" element={<AftersalesAnalytics />} />

              {/* Demo */}
              <Route path="tiktok-api-demo" element={<TikTokApiPage />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}
