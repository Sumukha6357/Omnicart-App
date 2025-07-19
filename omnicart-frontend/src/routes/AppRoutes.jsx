import { Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Signup from "../pages/Signup"

import ProductDetail from "../pages/ProductDetail"
import Cart from "../pages/Cart"
import Checkout from "../pages/Checkout"
import OrderHistory from "../pages/OrderHistory"
import Payment from "../pages/Payment"
import TrackOrder from "../pages/TrackOrder"

import AdminDashboard from "../pages/AdminDashboard"
import AdminUsers from "../pages/AdminUsers"
import AdminCategories from "../pages/AdminCategories"
import AddProduct from "../pages/AddProduct"
import AdminProducts from "../pages/AdminProducts"
import AdminOrders from "../pages/AdminOrders"
import EditProduct from "../pages/EditProduct"

import SellerDashboard from "../pages/SellerDashboard"
import SellerProducts from "../pages/SellerProducts"
import SellerBuyersOrders from "../pages/SellerBuyersOrders"

import CustomerHome from "../pages/CustomerHome"
import WishlistPage from "../pages/WishlistPage"; 

import NotFound from "../pages/NotFound"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes({ cart, addToCart, orders, placeOrder }) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
      <Route path="/cart" element={<Cart placeOrder={placeOrder} />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/orders" element={<OrderHistory orders={orders} />} />
      <Route path="/track-order" element={<TrackOrder />} />


      {/* Customer Routes */}
      <Route path="/customer/home" element={<ProtectedRoute role="customer"><CustomerHome /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute role="customer"><WishlistPage /></ProtectedRoute>} /> 

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/add-product" element={<ProtectedRoute role="admin"><AddProduct /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute role="admin"><AdminCategories /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/edit-product/:id" element={<ProtectedRoute role="admin"><EditProduct /></ProtectedRoute>} />

      {/* Seller Routes */}
      <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
      <Route path="/seller/products" element={<ProtectedRoute role="seller"><SellerProducts /></ProtectedRoute>} />
      <Route path="/seller/add-product" element={<ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>} />
      <Route path="/seller/edit-product/:id" element={<ProtectedRoute role="seller"><EditProduct /></ProtectedRoute>} />
      <Route path="/seller/buyers-orders" element={<ProtectedRoute role="seller"><SellerBuyersOrders /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
