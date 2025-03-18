import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/APIClient'; // Import axiosInstance từ APIClient

// Them chi tiết kho
export const createInventoryDetail = createAsyncThunk(
    'inventoryDetail/createInventoryDetail',
    async (inventoryDetail, { rejectWithValue }) => {
        try {
            // Chuyển đổi thông tin từ đơn mua thành đơn nhập kho
            const inventoryDetailRequest = {
                inventoryId: 1,
                medicine: inventoryDetail.medicine,
                category: inventoryDetail.category,
                quantity: inventoryDetail.quantity,
                price: inventoryDetail.price,
                expirationDate: inventoryDetail.expirationDate
            };


            const response = await axiosInstance.post('/api/v1/inventory', inventoryDetailRequest);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data); // Nếu có lỗi thì trả về thông báo lỗi
        }
    }
)


const inventoryDetailSlice = createSlice({
    name: 'inventoryDetail',
    initialState: {
        inventoryDetail: [],
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
    },
});
export default inventoryDetailSlice.reducer;
