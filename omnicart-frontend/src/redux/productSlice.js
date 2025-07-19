// redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchAllProducts, fetchProductById } from "../api/productApi"

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
}

export const getAllProducts = createAsyncThunk(
  "product/getAll",
  async (_, thunkAPI) => {
    try {
      return await fetchAllProducts()
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to load products")
    }
  }
)

export const getProductById = createAsyncThunk(
  "product/getById",
  async (id, thunkAPI) => {
    try {
      return await fetchProductById(id)
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to load product")
    }
  }
)

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data ?? []
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload
      })
  },
})

export default productSlice.reducer
