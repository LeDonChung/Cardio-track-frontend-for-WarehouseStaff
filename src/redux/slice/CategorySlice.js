import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";

export const fetchCategorys = createAsyncThunk(
    "category/fetchfetchCategorys",
    async ({ rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/category/get-all`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//Tìm danh mục thuốc theo id gọi client qua product-service
export const fetchCategoryById_client = createAsyncThunk(
    'category/fetchCategoryById_client',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/category/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const categorySlice = createSlice({
    name: 'categorys',
    initialState: {
        categorys: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategorys.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategorys.fulfilled, (state, action) => {
                state.loading = false;
                state.categorys = action.payload; // Lưu chi tiết đơn nhập vào state
            })
            .addCase(fetchCategorys.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
            });
        builder.addCase(fetchCategoryById_client.fulfilled, (state, action) => {
            const newCategory = action.payload;
            const existingCategory = state.categorys.find(category => category.id === newCategory.id);

            if (!existingCategory) {
                state.categorys.push(newCategory);
            }
        });
    },
});

export default categorySlice.reducer;
