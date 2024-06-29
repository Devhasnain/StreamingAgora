import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
