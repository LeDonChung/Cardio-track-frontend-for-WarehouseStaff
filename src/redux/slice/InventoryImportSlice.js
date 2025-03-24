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
                notes: purchaseOrder.notes || "New", // Nếu không có ghi chú thì mặc định
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

//Thay đổi trạng thái của đơn nhập hàng
export const updateInventoryImportStatus = createAsyncThunk(
    'inventoryImport/updateInventoryImportStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/v1/inventory-import/change-status/${id}`, null, {
                params: { status }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Lấy đơn nhập theo trạng thái chờ xác nhận
export const fetchInventoryImportsByPendingStatus = createAsyncThunk(
    'inventoryImport/fetchInventoryImportsByPendingStatus',
    async ({ page, size, sortBy, sortName }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/inventory-import/pending`, {
                params: { page, size, sortBy, sortName }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
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
            .addCase(updateInventoryImportStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateInventoryImportStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Loại bỏ đơn hàng bị hủy khỏi danh sách
                state.inventoryImport = state.inventoryImport.filter(
                    order => order.id !== action.payload.id
                );

            })
            .addCase(fetchInventoryImportsByPendingStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInventoryImportsByPendingStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.inventoryImport = action.payload.data; // Lưu chi tiết đơn nhập vào state
            })
            .addCase(fetchInventoryImportsByPendingStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
            });

    },
});

export default inventoryImportSlice.reducer;
