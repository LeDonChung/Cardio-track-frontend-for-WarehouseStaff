
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";

export const fetchCategories = createAsyncThunk(
    "category/fetchCategoriess",
    async ({ page, size, sortBy, sortName }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/v1/category", {
                params: { page, size, sortBy, sortName },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getMedicinesByCategory = createAsyncThunk(
    "category/getMedicinesByCategory",
    async ({ categoryId, page,  size, sortBy, sortName}, { rejectWithValue }) => {
      if (!categoryId) return rejectWithValue("Invalid categoryId");
      try {
        const response = await axiosInstance.get("/api/v1/inventory/medicine-by-category/" + categoryId, {
          params: { page, size, sortBy, sortName },
        });
        console.log("API Response:", response);
        
        return response.data.data;  
      } catch (error) {
        return rejectWithValue(error.response?.data || "API error");
      }
    }
  );


export const fetchCategorys = createAsyncThunk(
    "category/fetchfetchCategory",
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
        builder
          .addCase(fetchCategories.fulfilled, (state, action) => {
            state.categorys = action.payload?.data || []; 
            state.totalPages = action.payload?.totalPages;
          })
          .addCase(getMedicinesByCategory.fulfilled, (state, action) => {
            console.log("Redux Medicines:", action.payload);
            state.medicinesByCategory = action.payload?.data || []; 
          })
          .addCase(getMedicinesByCategory.rejected, (state, action) => {
            state.medicinesByCategory = []; 
          });
    },
});

export default categorySlice.reducer;
