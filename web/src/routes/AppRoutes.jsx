import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import PageTransition from "../components/PageTransition"

import Home from "../features/shared/pages/Home"
import Login from "../features/shared/pages/Login"
import Signup from "../features/shared/pages/Signup"
import PrivacyPolicy from "../features/shared/pages/PrivacyPolicy"
import TermsOfService from "../features/shared/pages/TermsOfService"
import ContactUs from "../features/shared/pages/ContactUs"

import ProductDetail from "../features/shared/pages/ProductDetail"
import Cart from "../features/customer/pages/Cart"
import Checkout from "../features/customer/pages/Checkout"
import OrderHistory from "../features/customer/pages/OrderHistory"
import Payment from "../features/customer/pages/Payment"
import OrderSuccess from "../features/customer/pages/OrderSuccess"
import TrackOrder from "../features/customer/pages/TrackOrder"

import AdminDashboard from "../features/admin/pages/AdminDashboard"
import AdminUsers from "../features/admin/pages/AdminUsers"
import AdminCategories from "../features/admin/pages/AdminCategories"
import AddCategory from "../features/admin/pages/AddCategory"
import AddProduct from "../features/seller/pages/AddProduct"
import AdminProducts from "../features/admin/pages/AdminProducts"
import AdminOrders from "../features/admin/pages/AdminOrders"
import AdminInventory from "../features/admin/pages/AdminInventory"
import AdminWarehouses from "../features/admin/pages/AdminWarehouses"
import AdminShipments from "../features/admin/pages/AdminShipments"
import AdminAds from "../features/admin/pages/AdminAds"
import EditProduct from "../features/seller/pages/EditProduct"

import SellerDashboard from "../features/seller/pages/SellerDashboard"
import SellerProducts from "../features/seller/pages/SellerProducts"
import SellerBuyersOrders from "../features/seller/pages/SellerBuyersOrders"
import SellerInventory from "../features/seller/pages/SellerInventory"
import SellerShipments from "../features/seller/pages/SellerShipments"

import CustomerHome from "../features/customer/pages/CustomerHome"
import WishlistPage from "../features/customer/pages/WishlistPage"

import NotFound from "../features/shared/pages/NotFound"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactUs /></PageTransition>} />
        <Route path="/cart" element={<ProtectedRoute role="customer"><PageTransition><Cart /></PageTransition></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute role="customer"><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute role="customer"><PageTransition><Payment /></PageTransition></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute role="customer"><PageTransition><OrderSuccess /></PageTransition></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="customer"><PageTransition><OrderHistory /></PageTransition></ProtectedRoute>} />
        <Route path="/track-order" element={<ProtectedRoute role="customer"><PageTransition><TrackOrder /></PageTransition></ProtectedRoute>} />


        {/* Customer Routes */}
        <Route path="/customer/home" element={<ProtectedRoute role="customer"><PageTransition><CustomerHome /></PageTransition></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute role="customer"><PageTransition><WishlistPage /></PageTransition></ProtectedRoute>} /> 

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/add-product" element={<ProtectedRoute role="admin"><PageTransition><AddProduct /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><PageTransition><AdminUsers /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute role="admin"><PageTransition><AdminCategories /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/add-category" element={<ProtectedRoute role="admin"><PageTransition><AddCategory /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute role="admin"><PageTransition><AdminProducts /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/ads" element={<ProtectedRoute role="admin"><PageTransition><AdminAds /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/shipments" element={<ProtectedRoute role="admin"><PageTransition><AdminShipments /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute role="admin"><PageTransition><AdminInventory /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/warehouses" element={<ProtectedRoute role="admin"><PageTransition><AdminWarehouses /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/edit-product/:id" element={<ProtectedRoute role="admin"><PageTransition><EditProduct /></PageTransition></ProtectedRoute>} />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><PageTransition><SellerDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/seller/products" element={<ProtectedRoute role="seller"><PageTransition><SellerProducts /></PageTransition></ProtectedRoute>} />
        <Route path="/seller/add-product" element={<ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>} />
        <Route path="/seller/edit-product/:id" element={<ProtectedRoute role="seller"><EditProduct /></ProtectedRoute>} />
        <Route path="/seller/buyers-orders" element={<ProtectedRoute role="seller"><PageTransition><SellerBuyersOrders /></PageTransition></ProtectedRoute>} />
        <Route path="/seller/inventory" element={<ProtectedRoute role="seller"><PageTransition><SellerInventory /></PageTransition></ProtectedRoute>} />
        <Route path="/seller/shipments" element={<ProtectedRoute role="seller"><PageTransition><SellerShipments /></PageTransition></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}



