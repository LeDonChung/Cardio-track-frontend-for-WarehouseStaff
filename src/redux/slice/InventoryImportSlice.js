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

// Tạo đơn nhập kho và chi tiết đơn nhập từ đơn mua
export const createInventoryImport = createAsyncThunk(
  'inventoryImport/createInventoryImportFromPurchaseOrder',
  async (purchaseOrder, { rejectWithValue }) => {
    try {
      // Chuyển đổi thông tin từ đơn mua thành đơn nhập kho
      const inventoryImportRequest = {
        recipient: purchaseOrder.recipient,
        importDate: new Date().toISOString(), // Thời gian nhập kho (có thể là thời gian hiện tại)
        notes: purchaseOrder.notes || "Chờ nhập vào kho", // Nếu không có ghi chú thì mặc định
        recipient: "Mai Chiến Nô", // Người nhận hàng
        supplier: purchaseOrder.supplierId, // Nhà cung cấp
        inventory: 1, // Kho nhập hàng
        inventoryImportDetails: purchaseOrder.purchaseOrderDetails.map(item => ({
          discount: item.discount,
          price: item.price,
          quantity: item.quantity,
          medicine: item.medicine, // ID thuốc
          category: item.category, // ID loại thuốc
          expirationDate: item.expirationDate // Ngày hết hạn
        }))
      };

      // Gửi yêu cầu POST để tạo đơn nhập kho
      const response = await axiosInstance.post('/api/v1/inventory-import/add', inventoryImportRequest);
      return response.data.data; // Trả về thông tin đơn nhập kho đã tạo
    } catch (error) {
      return rejectWithValue(error.response.data); // Nếu có lỗi thì trả về thông báo lỗi
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
            });
    },
});

export default inventoryImportSlice.reducer;
