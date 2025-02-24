import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../api/APIClient";
import axios from "axios";

const inititalState = {
    errorResponse: null
}

const register = createAsyncThunk('user/register', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/register', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


const login = createAsyncThunk('user/login', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/login', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const sendOtp = createAsyncThunk('user/sendOtp', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/generation-otp?phoneNumber=' + request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

const UserSlice = createSlice({
    name: 'user',
    initialState: inititalState,
    reducers: {

    },
    extraReducers: (builder) => {
        // register
        builder.addCase(register.pending, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(register.fulfilled, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(register.rejected, (state, action) => {
            state.errorResponse = action.payload;
        })

        // login
        builder.addCase(login.pending, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(login.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload.data);
            state.errorResponse = null;
        })
        builder.addCase(login.rejected, (state, action) => {
            state.errorResponse = action.payload;
        })

        // sendOtp
        builder.addCase(sendOtp.pending, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(sendOtp.fulfilled, (state, action) => {
            state.errorResponse = null;
        })
        builder.addCase(sendOtp.rejected, (state, action) => {
            state.errorResponse = action.payload;
        })
    }
})


export const { } = UserSlice.actions;
export { register, login, sendOtp };
export default UserSlice.reducer;