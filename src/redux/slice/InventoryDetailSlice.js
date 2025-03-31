import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/APIClient'; // Import axiosInstance từ APIClient

export const fetchInventoryDetail = createAsyncThunk(
    'inventoryDetail/fetchInventoryDetail',
    async ({ page, size, sortBy, sortName, medicineId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/inventory/inventory-details-expiration', {
                params: { page, size, sortBy, sortName, medicineId },
            });
            console.log("Response từ API:", response.data); // Kiểm tra phản hồi API

            return {
                data: response.data.data.data,  // Danh sách chi tiết tồn kho
                totalPages: response.data.data.totalPage // Tổng số trang
            };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }   
);

// Tạo chi tiết kho
export const createInventoryDetail = createAsyncThunk(
    'inventoryDetail/createInventoryDetail',
    async (inventoryDetailArray, { rejectWithValue }) => {
        try {
            // Duyệt qua từng item trong inventoryDetailArray và gửi từng yêu cầu một
            const inventoryDetailRequests = inventoryDetailArray.map(inventoryDetail => ({
                inventoryId: 1,
                medicine: inventoryDetail.medicine,
                category: inventoryDetail.category,
                // shelfId: 1, 
                shelfId: inventoryDetail.shelfId,
                quantity: inventoryDetail.quantity,
                price: inventoryDetail.price,
                expirationDate: inventoryDetail.expirationDate,
                location: inventoryDetail.location || ""
            }));

            // Gửi từng yêu cầu đến API
            for (let request of inventoryDetailRequests) {
                const response = await axiosInstance.post('/api/v1/inventory', request);
            }

            return { message: "Successfully added all inventory details." }; // Nếu tất cả các yêu cầu thành công
        } catch (error) {
            return rejectWithValue(error.response.data); // Nếu có lỗi thì trả về thông báo lỗi
        }
    }
);

// Tạo phương thức để lấy tổng số lượng
export const getTotalQuantity = createAsyncThunk(
    'inventoryDetail/getTotalQuantity',
    async (_, { rejectWithValue }) => {
        try {
            // Gửi yêu cầu GET để lấy tổng số lượng từ API
            const response = await axiosInstance.get('/api/v1/inventory/total-quantity');

            // Trả về giá trị tổng số lượng
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data); // Nếu có lỗi, trả về thông báo lỗi
        }
    }
);


const inventoryDetailSlice = createSlice({
    name: 'inventoryDetail',
    initialState: {
        inventoryDetail: [],
        totalProduct: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createInventoryDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(createInventoryDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.inventoryDetail.push(action.payload.data);
            })
            .addCase(createInventoryDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.data;
            });;
        builder
            .addCase(getTotalQuantity.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTotalQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.totalProduct = action.payload; // Lưu giá trị tổng số lượng
            })
            .addCase(getTotalQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lưu thông báo lỗi
            });

        builder
            .addCase(fetchInventoryDetail.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInventoryDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.inventoryDetail = action.payload?.data || [];
                state.totalPages = action.payload?.totalPages || 1; // Lưu tổng số trang
            })
            .addCase(fetchInventoryDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.data; // Lưu thông báo lỗi
            });
    },
});
export default inventoryDetailSlice.reducer;
