import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from "@/store/features/loading";
import productSlice from "@/store/features/products";
import supplierSlice from "@/store/features/suppliers";
import clientSlice from "@/store/features/clients";
import inventorySlice from "@/store/features/inventory";
import orderSlice from "@/store/features/orders";

export const makeStore = () => {
  return configureStore({
    reducer: {
      loading: loadingSlice,
      product: productSlice,
      supplier: supplierSlice,
      client: clientSlice,
      inventory: inventorySlice,
      order: orderSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
