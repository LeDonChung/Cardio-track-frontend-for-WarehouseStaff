// InventoryImportDetailSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/APIClient'; // Import axiosInstance từ APIClient

// Lấy chi tiết đơn nhập hàng theo id
export const fetchInventoryImportById = createAsyncThunk(
  'inventoryImportDetail/fetchImportById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/inventory-import/${id}/detail`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const inventoryImportDetailSlice = createSlice({
  name: 'inventoryImportDetail',
  initialState: {
    selectedOrderDetail: [],  // Dữ liệu chi tiết của đơn nhập
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryImportById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryImportById.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.inventoryImportDetail = action.payload; // Lưu chi tiết đơn nhập vào state
      })
      .addCase(fetchInventoryImportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
      });
  },
});

export default inventoryImportDetailSlice.reducer;
