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

const shelfSlice = createSlice({
  name: "shelf",
  initialState: { shelves: [], totalPages: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchShelfs.fulfilled, (state, action) => {
        console.log("dda",action.payload.data);
      state.shelves = action.payload?.data || [];
      state.totalPages = action.payload?.totalPages || 1;
    });
  },
});

export default shelfSlice.reducer;
