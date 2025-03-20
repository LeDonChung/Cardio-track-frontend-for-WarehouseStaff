import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";

export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
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



  const categorySlice = createSlice({
    name: "category",
    initialState: { categories: [], medicinesByCategory: [], totalPages: 1 },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchCategories.fulfilled, (state, action) => {
            state.categories = action.payload?.data || []; 
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