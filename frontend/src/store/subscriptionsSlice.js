import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../config";
import { toast } from "react-toastify";
import { getAuthHeader } from "./userSlice";


export const fetchSubList = createAsyncThunk("subscriptions/list", async (thunkAPI) => {
  const response = await fetch(`${config.API}/dashboard/list_subscription`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  return { status: response.status, ...(await response.json()) };
});

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: {
    subList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSubList.fulfilled, (state, action) => {
      if (action.payload.status != 200) {
        toast.error(action.payload.message);
        if (action.payload.loginRequired) {
          localStorage.clear();
          window.location.replace("/auth");
        }
        return;
      }
      state.subList = action.payload.subscriptions;
    });
  },
});

export default subscriptionsSlice.reducer;
