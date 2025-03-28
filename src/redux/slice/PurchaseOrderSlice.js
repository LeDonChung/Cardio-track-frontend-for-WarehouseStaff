// InventoryImportDetailSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/APIClient'; // Import axiosInstance từ APIClient

// verify order
export const verifyOrder = createAsyncThunk(
    'purchaseOrder/verifyOrder',
    async ({ rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/purchase-order/permission');
            return response.data.data; // Trả về `data` từ trường `data` trong phản hồi API
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Hiển thị thông báo và chuyển hướng về trang chủ
                alert("Bạn không có quyền truy cập trang này, hãy đăng nhập tài khoản ADMIN");
                window.location.href = "/";
            }
            return rejectWithValue(error.response.data);
        }
    }
);  

// Lấy danh sách đơn mua hàng
export const fetchPurchaseOrders = createAsyncThunk(
    'purchaseOrder/fetchPurchaseOrders',
    async ({ page, size, sortBy, sortName }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/purchase-order', {
                params: { page, size, sortBy, sortName },
            });
            return response.data.data; // Trả về `data` từ trường `data` trong phản hồi API
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Lấy đơn mua hàng theo trạng thái chờ xác nhận
export const fetchPurchaseOrderByPendingStatus = createAsyncThunk(
    'purchaseOrder/fetchPurchaseOrderByPendingStatus',
    async ({ page, size, sortBy, sortName }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/purchase-order/pending`, {
                params: { page, size, sortBy, sortName }});
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

// Them don mua hang
export const createPurchaseOrder = createAsyncThunk(
    'purchaseOrder/createPurchaseOrder',
    async (purchaseOrder, { rejectWithValue }) => {
        try {
            // Chuyển đổi thông tin từ đơn mua thành đơn nhập kho
            const purchaseOrderRequest = {
                orderDate: new Date().toISOString(),
                supplierId: purchaseOrder.supplierId, // Nhà cung cấp
                purchaseOrderDetails: purchaseOrder.purchaseOrderDetails.map(item => ({
                    discount: item.discount,
                    price: item.price,
                    quantity: item.quantity,
                    medicine: item.medicine,
                    category: item.category,
                    expirationDate: item.expirationDate
                }))
            };

            console.log("purchaseOrderRequest",purchaseOrderRequest);


            const response = await axiosInstance.post('/api/v1/purchase-order/add', purchaseOrderRequest);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data); // Nếu có lỗi thì trả về thông báo lỗi
        }
    }
)


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
            .addCase(fetchPurchaseOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseOrderByPendingStatus = action.payload;
            })
            .addCase(fetchPurchaseOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
            })
            .addCase(fetchPurchaseOrderByPendingStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPurchaseOrderByPendingStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseOrderByPendingStatus = action.payload.data; // Lưu chi tiết đơn nhập vào state
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
            })
            .addCase(createPurchaseOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPurchaseOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseOrderByPendingStatus.push(action.payload.data); // Thêm đơn mới vào danh sách
            })
            .addCase(createPurchaseOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.data; // Xử lý lỗi khi tạo đơn nhập thất bại
            });;
    },
});
export default purchaseOrderSlice.reducer;
