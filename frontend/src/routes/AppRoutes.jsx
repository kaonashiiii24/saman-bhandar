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
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}