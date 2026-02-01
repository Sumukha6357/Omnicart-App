import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { placeOrder, getUserOrders, getOrderById, getAllOrders } from "../api/orderApi";
import { getToken } from "../utils/authUtils";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const placeOrderThunk = createAsyncThunk(
  "order/placeOrder",
  async ({ userId, orderRequest }) => {
    const token = getToken();
    return await placeOrder(userId, orderRequest, token);
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async ({ userId }) => {
    const token = getToken();
    return await getUserOrders(userId, token);
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async ({ orderId }) => {
    const token = getToken();
    return await getOrderById(orderId, token);
  }
);

export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async () => {
    const token = getToken();
    return await getAllOrders(token);
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        if (action.payload?.orderId) {
          const exists = state.orders.some(
            (order) => String(order?.orderId) === String(action.payload.orderId)
          );
          if (!exists) {
            state.orders = [action.payload, ...state.orders];
          }
        }
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data ?? [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data ?? [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
