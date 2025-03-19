import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/APIClient'; // Import axiosInstance từ APIClient

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
