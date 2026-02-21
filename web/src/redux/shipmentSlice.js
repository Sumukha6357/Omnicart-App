// src/store/shipmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getShipmentByOrderId,
  createShipment,
  updateShipmentStatus,
} from '../api/shipmentApi';

// Async Thunks
export const fetchShipmentByOrderId = createAsyncThunk(
  'shipment/fetchByOrderId',
  async (orderId, thunkAPI) => {
    try {
      return await getShipmentByOrderId(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createNewShipment = createAsyncThunk(
  'shipment/createShipment',
  async ({ orderId, logisticsPartner }, thunkAPI) => {
    try {
      return await createShipment(orderId, logisticsPartner);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateShipment = createAsyncThunk(
  'shipment/updateShipment',
  async ({ shipmentId, status }, thunkAPI) => {
    try {
      return await updateShipmentStatus(shipmentId, status);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState: {
    shipment: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearShipmentState: (state) => {
      state.shipment = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch shipment
      .addCase(fetchShipmentByOrderId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipmentByOrderId.fulfilled, (state, action) => {
        state.loading = false;
        state.shipment = action.payload;
      })
      .addCase(fetchShipmentByOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create shipment
      .addCase(createNewShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createNewShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipment = action.payload;
        state.successMessage = "Shipment created successfully";
      })
      .addCase(createNewShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update shipment
      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipment = action.payload;
        state.successMessage = "Shipment updated successfully";
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShipmentState } = shipmentSlice.actions;
export default shipmentSlice.reducer;
