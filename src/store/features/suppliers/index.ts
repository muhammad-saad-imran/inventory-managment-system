import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Supplier } from "@/utils/database/types";

interface SupplierState {
  supplier: Supplier;
  allSuppliers: Supplier[];
}

const initialState = {
  supplier: {
    id: "",
    name: "",
    email: "",
    phone_number: 0,
    created_at: "",
  },
  allSuppliers: [],
} satisfies SupplierState as SupplierState;

const SupplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    setSupplier(state, action: PayloadAction<Supplier>) {
      return {
        ...state,
        supplier: {
          ...action.payload,
        },
      };
    },
    setAllSuppliers(state, action: PayloadAction<Supplier[]>) {
      return {
        ...state,
        allSuppliers: [...action.payload],
      };
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(getAllProducts.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.allProducts = action.payload;
    //     }
    //   })
    //   .addCase(getProduct.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.product = action.payload;
    //     }
    //   })
    //   .addCase(updateProduct.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.product = action.payload;
    //     }
    //   });
  },
});

export const { setAllSuppliers, setSupplier } = SupplierSlice.actions;
export default SupplierSlice.reducer;

export const selectSupplier = (state: RootState) => state.supplier.supplier;
export const selectAllSuppliers = (state: RootState) =>
  state.supplier.allSuppliers;
