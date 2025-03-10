// InventoryImportDetailSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/APIClient'; // Import axiosInstance từ APIClient

// Lấy chi tiết đơn nhập hàng theo id
export const fetchPurchaseOrderDetailById = createAsyncThunk(
  'purchaseOrderDetail/fetchPurchaseOrderDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/purchase-order/${id}/detail`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const purchaseOrderDetailSlice = createSlice({
  name: 'purchaseOrderDetail',
  initialState: {
    purchaseOrderDetail: [],  // Dữ liệu chi tiết của đơn nhập
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrderDetailById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseOrderDetailById.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrderDetail = action.payload; // Lưu chi tiết đơn nhập vào state
      })
      .addCase(fetchPurchaseOrderDetailById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
      });
  },
});

export default purchaseOrderDetailSlice.reducer;
