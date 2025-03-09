// InventoryImportDetailSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/APIClient'; // Import axiosInstance từ APIClient

// Lấy đơn mua hàng theo trạng thái chờ xác nhận
export const fetchPurchaseOrderByPendingStatus = createAsyncThunk(
  'purchaseOrder/fetchPurchaseOrderByPendingStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/purchase-order/pending`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const inventoryImportDetailSlice = createSlice({
  name: 'purchaseOrderByPendingStatus',
  initialState: {
    purchaseOrderByPendingStatus: [],  
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrderByPendingStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseOrderByPendingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrderByPendingStatus = action.payload; // Lưu chi tiết đơn nhập vào state
      })
      .addCase(fetchPurchaseOrderByPendingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
      });
  },
});

export default inventoryImportDetailSlice.reducer;
