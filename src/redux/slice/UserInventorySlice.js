import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";

// verify
export const verifyUser = createAsyncThunk(
    'user/verifyUser',
    async ({ rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/user-inventory/permission');
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

export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async ({ rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/user-inventory`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const UserInventorySlice = createSlice({
    name: 'userInventory',
    initialState: {
        userInventory: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.userInventory = action.payload; // Lưu chi tiết đơn nhập vào state
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
            });
    },
});

export default UserInventorySlice.reducer;