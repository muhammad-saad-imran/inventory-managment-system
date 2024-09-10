import { configureStore } from "@reduxjs/toolkit";
import LoadingSlice from "@/store/features/loading";
import productSlice from "@/store/features/products"

export const makeStore = () => {
  return configureStore({
    reducer: {
      loading: LoadingSlice,
      product: productSlice
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
