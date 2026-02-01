import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { addToCart, getCart, removeFromCart } from "../api/cartApi"
import { getToken } from "../utils/authUtils"
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
}

export const fetchCart = createAsyncThunk("cart/fetch", async ({ userId }, thunkAPI) => {
  const token = getToken()
  try {
    const response = await getCart(userId, token)
    return { items: (response && response.items) ? response.items : [] }
  } catch (e) {
    return { items: [] }
  }
})

export const addItem = createAsyncThunk("cart/add", async ({ userId, productId, quantity }, thunkAPI) => {
  const token = getToken()
  return await addToCart(userId, { productId, quantity }, token)
})

export const removeItem = createAsyncThunk("cart/remove", async ({ userId, productId }, thunkAPI) => {
  const token = getToken()
  return await removeFromCart(userId, productId, token)
})

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.cartItems = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = (action.payload && action.payload.items) ? action.payload.items : [];
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.cartItems = (action.payload && action.payload.items) ? action.payload.items : [];
      })
      // .addCase(updateItem.fulfilled, (state, action) => {
      //   state.cartItems = action.payload
      // })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.cartItems = (action.payload && action.payload.items) ? action.payload.items : [];
      })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
