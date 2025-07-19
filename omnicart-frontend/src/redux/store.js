import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import productReducer from "./productSlice"
import cartReducer from "./cartSlice"
import orderReducer from "./orderSlice"
import wishlistReducer from "./wishlistSlice";
import shipmentReducer from './shipmentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    shipment: shipmentReducer,
  },
})

export default store
