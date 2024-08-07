import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../config";
import { toast } from "react-toastify";

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("/auth");
  }
  return { Authorization: `Bearer ${token}` };
};

export const fetchUser = createAsyncThunk("user/me", async (thunkAPI) => {
  const response = await fetch(`${config.API}/dashboard/me`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return { status: response.status, ...(await response.json()) };
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      if (action.payload.status != 200) {
        toast.error(action.payload.message);
        if (action.payload.loginRequired) {
          localStorage.clear();
          window.location.replace("/auth");
        }
        return;
      }
      state.email = action.payload.email;
      state.name = action.payload.name;
    });
  },
});

export default userSlice.reducer;
