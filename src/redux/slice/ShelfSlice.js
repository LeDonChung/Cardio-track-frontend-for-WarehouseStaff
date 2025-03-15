import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";

export const fetchShelfs = createAsyncThunk(
  "shelf/fetchShelfs",
  async ({ page, size, sortBy, sortName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/shelf", {
        params: { page, size, sortBy, sortName },
      });
      return response.data.data;
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

const shelfSlice = createSlice({
  name: "shelf",
  initialState: { shelves: [], totalPages: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchShelfs.fulfilled, (state, action) => {
      state.shelves = action.payload?.data || [];
      state.totalPages = action.payload?.totalPages || 1;
    });
  },
});

export default shelfSlice.reducer;
