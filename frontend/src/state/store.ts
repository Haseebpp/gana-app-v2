import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import authReducer from "@/state/slices/authSlice";
import ordersReducer from "@/state/slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
  },
  devTools: import.meta.env?.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
