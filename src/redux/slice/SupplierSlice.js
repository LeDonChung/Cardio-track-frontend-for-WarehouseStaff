import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";

export const fetchSuppliers = createAsyncThunk(
    "supplier/fetchSuppliers",
    async ({ rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/v1/supplier`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Add supplier action
export const addSupplier = createAsyncThunk(
    "supplier/addSupplier",
    async (supplierData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/v1/supplier/add`, supplierData);
            return response.data.data; // Assuming the response contains the created supplier data
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const supplierSlice = createSlice({
    name: 'supplier',
    initialState: {
        supplier: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuppliers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.loading = false;
                state.supplier = action.payload; // Lưu chi tiết đơn nhập vào state
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Lỗi khi lấy chi tiết đơn nhập
            }).addCase(addSupplier.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSupplier.fulfilled, (state, action) => {
                state.loading = false;
                state.supplier.push(action.payload); // Add the new supplier to the supplier list
            })
            .addCase(addSupplier.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Error while adding supplier
            });
    },
});

export default supplierSlice.reducer;
