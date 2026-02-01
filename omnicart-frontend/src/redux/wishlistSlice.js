// redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWishlist, addToWishlist } from "../api/wishlistApi";

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (userId) => {
  let serverItems = [];
  try {
    serverItems = await getWishlist(userId);
  } catch (e) {
    serverItems = [];
  }
  return serverItems;
});

export const addWishlistItem = createAsyncThunk(
  "wishlist/addItem",
  async ({ userId, productId }, { dispatch, getState }) => {
    await addToWishlist(userId, productId);
    dispatch(fetchWishlist(userId));
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default wishlistSlice.reducer;
