import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";

export const fetchMedicines = createAsyncThunk(
    "medicine/fetchMedicines",
    async ({ page, size, sortBy, sortName }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/v1/medicine", {
                params: { page, size, sortBy, sortName },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const searchMedicines = createAsyncThunk(
    "medicine/searchMedicines",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/v1/medicine", {
                params: { searchTerm, page: 1, size: 10, sortBy: "name", sortName: "asc" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);
export const deleteMedicine = createAsyncThunk(
    "medicine/deleteMedicine",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await axiosInstance.put(`/api/v1/medicine/${id}/0`);
            dispatch(fetchMedicines({ page: 1, size: 10, sortBy: "name", sortName: "asc" }));
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);
export const updateMedicine = createAsyncThunk(
    "medicine/updateMedicine",
    async (medicine, { rejectWithValue, dispatch }) => {
        try {
            await axiosInstance.put(`/api/v1/medicine`, medicine);
            dispatch(fetchMedicines({ page: 1, size: 10, sortBy: "name", sortName: "asc" }));
            return medicine;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Lỗi không xác định");
        }
    }
);
// Lấy danh sách đơn nhập hàng
export const fetchMedicinesByCategoryTitle = createAsyncThunk(
    'medicines/fetchMedicinesByCategoryTitle',
    async ({ title }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/v1/medicine/get-by-category-title', {
                params: { title },
            });
            return response.data.data; // Trả về `data` từ trường `data` trong phản hồi API
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//Tìm kiếm thuốc theo id
export const fetchMedicineById = createAsyncThunk(
    'medicine/fetchMedicineById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/medicine/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//Tìm thuốc theo id gọi client qua product-service
export const fetchMedicineById_client = createAsyncThunk(
    'medicine/fetchMedicineById_client',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/medicine/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const medicineSlice = createSlice({
    name: "medicine",
    initialState: { medicines: [], totalPages: 1 },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMedicinesByCategoryTitle.fulfilled, (state, action) => {
            state.medicines = action.payload || [];
        });
        builder.addCase(fetchMedicineById.fulfilled, (state, action) => {
            console.log("ss",action.payload);
            state.medicines = action.payload || [];
        });
        builder.addCase(fetchMedicines.fulfilled, (state, action) => {
            state.medicines = action.payload?.data || [];
            state.totalPages = action.payload?.totalPage || 1;
        });
        builder.addCase(deleteMedicine.fulfilled, (state, action) => {
            state.medicines = state.medicines.filter((item) => item.id !== action.payload);
        });
        builder.addCase(updateMedicine.fulfilled, (state, action) => {
            state.medicines = state.medicines.map((item) => (item.id === action.payload.id ? action.payload : item));
        });
        builder.addCase(fetchMedicineById_client.fulfilled, (state, action) => {
            const newMedicine = action.payload;
            
            // Kiểm tra nếu thuốc đã có trong state
            const existingMedicine = state.medicines.find(medicine => medicine.id === newMedicine.id);
            
            if (!existingMedicine) {
                // Nếu chưa có thì thêm thuốc mới vào state
                state.medicines.push(newMedicine);
            }
        });
    },
});

export default medicineSlice.reducer;
