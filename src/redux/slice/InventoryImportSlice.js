import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/APIClient'; // Import axiosInstance từ APIClient

// Lấy danh sách đơn nhập hàng
export const fetchInventoryImports = createAsyncThunk(
  'inventoryImport/fetchImports',
  async ({ page, size, sortBy, sortName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/inventory-import', {
        params: { page, size, sortBy, sortName },
      });
      return response.data.data; // Trả về `data` từ trường `data` trong phản hồi API
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Lấy chi tiết đơn nhập hàng theo id
export const fetchInventoryImportById = createAsyncThunk(
  'inventoryImport/fetchImportById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/inventory-import/${id}/detail`);
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Tạo đơn nhập hàng mới
export const createInventoryImport = createAsyncThunk(
  'inventoryImport/createImport',
  async (importRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/v1/inventory-import/add', importRequest);
      return response.data.data; // Trả về đơn nhập hàng mới
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const inventoryImportSlice = createSlice({
  name: 'inventoryImport',
  initialState: {
    imports: [],  // Dữ liệu sẽ được lưu trong `imports`
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryImports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryImports.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryImport = action.payload.data; // Lưu danh sách đơn nhập vào state
      })
      .addCase(fetchInventoryImports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data; // Xử lý lỗi khi gọi API thất bại
      })
      .addCase(createInventoryImport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInventoryImport.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryImport.push(action.payload.data); // Thêm đơn mới vào danh sách
      })
      .addCase(createInventoryImport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data; // Xử lý lỗi khi tạo đơn nhập thất bại
      })
      .addCase(fetchInventoryImportById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryImportById.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryImport = action.payload.data; 
      })
      .addCase(fetchInventoryImportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data; 
      });
  },
});

export default inventoryImportSlice.reducer;
