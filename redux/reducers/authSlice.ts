import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;

  token: string | null;
};

const initialState: InitialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setUser, setToken } = authSlice.actions;

export default authSlice.reducer;
