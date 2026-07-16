import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import PublicLayout from '../layouts/PublicLayout'
import SellerLayout from '../layouts/SellerLayout'
import HostLayout from '../layouts/HostLayout'
import CourierLayout from '../layouts/CourierLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/public/Home'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import BrowseListings from '../pages/public/BrowseListings'
import ListingDetail from '../pages/public/ListingDetail'
import Services from '../pages/public/Services'
import AboutUs from '../pages/public/AboutUs'
import Contact from '../pages/public/Contact'
import SellerDashboard from '../pages/seller/SellerDashboard'
import MyBookings from '../pages/seller/MyBookings'
import Inventory from '../pages/seller/Inventory'
import Chat from '../pages/seller/Chat'
import Payments from '../pages/seller/Payments'
import SellerProfile from '../pages/seller/Profile'
import SellerDocumentation from '../pages/seller/Documentation'
import HostDashboard from '../pages/host/HostDashboard'
import MyListings from '../pages/host/MyListings'
import ManageBookings from '../pages/host/ManageBookings'
import Earnings from '../pages/host/Earnings'
import HostProfile from '../pages/host/Profile'
import HostDocumentation from '../pages/host/Documentation'
import CourierDashboard from '../pages/courier/CourierDashboard'
import AvailableJobs from '../pages/courier/AvailableJobs'
import ActiveDeliveries from '../pages/courier/ActiveDeliveries'
import CourierProfile from '../pages/courier/Profile'
import CourierDocumentation from '../pages/courier/Documentation'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageListings from '../pages/admin/ManageListings'
import Analytics from '../pages/admin/Analytics'
import AdminDocumentation from '../pages/admin/Documentation'
import NotFound from '../pages/NotFound'
import PaymentSimulate from '../pages/public/PaymentSimulate'
import CmsLayout from '../pages/admin/cms/CmsLayout'
import HeroManager from '../pages/admin/cms/HeroManager'
import AboutManager from '../pages/admin/cms/AboutManager'
import ServicesManager from '../pages/admin/cms/ServicesManager'
import HowItWorksManager from '../pages/admin/cms/HowItWorksManager'
import FeaturesManager from '../pages/admin/cms/FeaturesManager'
import TestimonialsManager from '../pages/admin/cms/TestimonialsManager'
import FaqManager from '../pages/admin/cms/FaqManager'
import ContactManager from '../pages/admin/cms/ContactManager'
import FooterManager from '../pages/admin/cms/FooterManager'
import AdminProfile from '../pages/admin/Profile'
import { ToastProvider } from '../context/ToastContext'
import PricingPlansManager from '../pages/admin/cms/PricingPlansManager'
import SectionHeadingsManager from '../pages/admin/cms/SectionHeadingsManager'
import RoleStepsManager from '../pages/admin/cms/RoleStepsManager'
import ServicesHeroManager from '../pages/admin/cms/ServicesHeroManager'
import BrowseHeroManager from '../pages/admin/cms/BrowseHeroManager'
import AboutHeroManager from '../pages/admin/cms/AboutHeroManager'
import AboutValuesManager from '../pages/admin/cms/AboutValuesManager'
import NavigationManager from '../pages/admin/cms/NavigationManager'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-chalk">
      <div className="w-7 h-7 border-2 border-[#1c1917] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<BrowseListings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment/simulate" element={<PaymentSimulate />} />
        <Route path="/payment-simulate" element={<PaymentSimulate />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout /></ProtectedRoute>}>
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/bookings" element={<MyBookings />} />
        <Route path="/seller/inventory" element={<Inventory />} />
        <Route path="/seller/chat" element={<Chat />} />
        <Route path="/seller/payments" element={<Payments />} />
        <Route path="/seller/profile" element={<SellerProfile />} />
        <Route path="/seller/docs" element={<SellerDocumentation />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['host']}><HostLayout /></ProtectedRoute>}>
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/host/listings" element={<MyListings />} />
        <Route path="/host/bookings" element={<ManageBookings />} />
        <Route path="/host/chat" element={<Chat />} />
        <Route path="/host/earnings" element={<Earnings />} />
        <Route path="/host/profile" element={<HostProfile />} />
        <Route path="/host/docs" element={<HostDocumentation />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['courier']}><CourierLayout /></ProtectedRoute>}>
        <Route path="/courier/dashboard" element={<CourierDashboard />} />
        <Route path="/courier/jobs" element={<AvailableJobs />} />
        <Route path="/courier/deliveries" element={<ActiveDeliveries />} />
        <Route path="/courier/chat" element={<Chat />} />
        <Route path="/courier/profile" element={<CourierProfile />} />
        <Route path="/courier/docs" element={<CourierDocumentation />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/listings" element={<ManageListings />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/docs" element={<AdminDocumentation />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/cms" element={<ToastProvider><CmsLayout /></ToastProvider>}>
          <Route index element={<HeroManager />} />
          <Route path="hero" element={<HeroManager />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="how-it-works" element={<HowItWorksManager />} />
          <Route path="features" element={<FeaturesManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="faqs" element={<FaqManager />} />
          <Route path="contact" element={<ContactManager />} />
          <Route path="footer" element={<FooterManager />} />
          <Route path="section-headings" element={<SectionHeadingsManager />} />
          <Route path="pricing-plans" element={<PricingPlansManager />} />
<Route path="role-steps" element={<RoleStepsManager />} />
<Route path="services-hero" element={<ServicesHeroManager />} />
<Route path="browse-hero" element={<BrowseHeroManager />} />
<Route path="about-hero" element={<AboutHeroManager />} />
<Route path="about-values" element={<AboutValuesManager />} />
<Route path="navigation" element={<NavigationManager />} />


        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}