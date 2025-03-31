import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";

export const fetchShelfs = createAsyncThunk(
  "shelf/fetchShelfs",
  async ({ page, size, sortBy, sortName, location }, { rejectWithValue }) => {
    try {
      const params = { page, size, sortBy, sortName };
      if (location) params.location = location; // Chỉ thêm nếu location có giá trị

      const response = await axiosInstance.get("/api/v1/shelf", { params });

      return {
        data: response.data.data.data,
        totalPages: response.data.data.totalPage,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const addShelf = createAsyncThunk(
  "shelf/addShelf",
  async (shelf, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/shelf", shelf);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateShelf = createAsyncThunk(
  "shelf/updateShelf",
  async (shelf, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/api/v1/shelf", shelf);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//search
export const searchShelf = createAsyncThunk(
  "shelf/searchShelf",
  async ({ location }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/shelf/location", {
        params: { page:0, size: 10, sortBy:"location", sortName:"asc", location },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Cập nhật số lượng sản phẩm của kệ sau khi nhập kho
export const updateShelfQuantity = createAsyncThunk(
    "shelf/updateShelfQuantity",
    async ({ id, quantity }, { rejectWithValue }) => {
      try {
        // Gửi yêu cầu PUT với tham số qua query string
        const response = await axiosInstance.put(`/api/v1/shelf/update-add-total-product`, null, {
          params: {
            id, 
            quantity
          }
        });
        console.log(response.data.data);
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  

const shelfSlice = createSlice({
  name: "shelf",
  initialState: { shelves: [], totalPages: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchShelfs.fulfilled, (state, action) => {
      state.shelves = action.payload?.data || [];
      state.totalPages = action.payload?.totalPages || 1;
      console.log("📌 totalPages trong Redux:", state.totalPages);
    });
    builder.addCase(updateShelfQuantity.fulfilled, (state, action) => {
      const index = state.shelves.findIndex((shelf) => shelf.id === action.payload.id);
      if (index !== -1) {
        state.shelves[index] = action.payload;
      }
    });
  },
});


export default shelfSlice.reducer;
