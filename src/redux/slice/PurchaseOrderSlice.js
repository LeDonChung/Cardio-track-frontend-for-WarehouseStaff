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

// Thay đổi trạng thái của đơn mua thành CANCELED
export const ChangeStatusPurchaseOrder = createAsyncThunk(
    'purchaseOrder/ChangeStatusPurchaseOrder',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            // Gửi status dưới dạng query string thay vì trong body
            const response = await axiosInstance.put(`/api/v1/purchase-order/change-status/${id}`, null, {
                params: { status } // Gửi status qua query string
            });
            return response.data; // Trả về dữ liệu sau khi đơn được cập nhật
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


const purchaseOrderSlice = createSlice({
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
            })
            .addCase(ChangeStatusPurchaseOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(ChangeStatusPurchaseOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Loại bỏ đơn hàng bị hủy khỏi danh sách
                state.purchaseOrderByPendingStatus = state.purchaseOrderByPendingStatus.filter(
                    order => order.id !== action.payload.id
                );

            })
            .addCase(ChangeStatusPurchaseOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
            });
    },
});
export default purchaseOrderSlice.reducer;
