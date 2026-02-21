import { Routes, Route, Navigate } from "react-router-dom"

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
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/cart" element={<ProtectedRoute role="customer"><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute role="customer"><Checkout /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute role="customer"><Payment /></ProtectedRoute>} />
      <Route path="/order-success" element={<ProtectedRoute role="customer"><OrderSuccess /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute role="customer"><OrderHistory /></ProtectedRoute>} />
      <Route path="/track-order" element={<ProtectedRoute role="customer"><TrackOrder /></ProtectedRoute>} />


      {/* Customer Routes */}
      <Route path="/customer/home" element={<ProtectedRoute role="customer"><CustomerHome /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute role="customer"><WishlistPage /></ProtectedRoute>} /> 

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/add-product" element={<ProtectedRoute role="admin"><AddProduct /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute role="admin"><AdminCategories /></ProtectedRoute>} />
      <Route path="/admin/add-category" element={<ProtectedRoute role="admin"><AddCategory /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/ads" element={<ProtectedRoute role="admin"><AdminAds /></ProtectedRoute>} />
      <Route path="/admin/shipments" element={<ProtectedRoute role="admin"><AdminShipments /></ProtectedRoute>} />
      <Route path="/admin/inventory" element={<ProtectedRoute role="admin"><AdminInventory /></ProtectedRoute>} />
      <Route path="/admin/warehouses" element={<ProtectedRoute role="admin"><AdminWarehouses /></ProtectedRoute>} />
      <Route path="/admin/edit-product/:id" element={<ProtectedRoute role="admin"><EditProduct /></ProtectedRoute>} />

      {/* Seller Routes */}
      <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
      <Route path="/seller/products" element={<ProtectedRoute role="seller"><SellerProducts /></ProtectedRoute>} />
      <Route path="/seller/add-product" element={<ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>} />
      <Route path="/seller/edit-product/:id" element={<ProtectedRoute role="seller"><EditProduct /></ProtectedRoute>} />
      <Route path="/seller/buyers-orders" element={<ProtectedRoute role="seller"><SellerBuyersOrders /></ProtectedRoute>} />
      <Route path="/seller/inventory" element={<ProtectedRoute role="seller"><SellerInventory /></ProtectedRoute>} />
      <Route path="/seller/shipments" element={<ProtectedRoute role="seller"><SellerShipments /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}



